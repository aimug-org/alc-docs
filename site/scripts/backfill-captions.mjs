// One-time: add YouTube captions, language, event link and summary to backfill talk stubs.
// Usage: node scripts/backfill-captions.mjs <scratchDir>
// <scratchDir> (outside the repo) holds the yt-dlp downloads and the review files:
// legal-gate.txt, event-links.txt, speaker-candidates.txt, no-captions.txt.
// Never logs in or uses cookies. A talk that trips the legal gate is left untouched.
import { homedir } from 'node:os';
import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { load } from 'js-yaml';
import { siteDir, talksDir, writeTalk, parseCues } from './lib.mjs';

const scratch = process.argv[2];
if (!scratch) {
  console.error('usage: node scripts/backfill-captions.mjs <scratchDir>');
  process.exit(1);
}
mkdirSync(scratch, { recursive: true });
const sleep = (s) => spawnSync('sleep', [String(s)]);

/** Run yt-dlp for one video; retry on HTTP 429, stop the whole run on a bot check. */
function ytdlp(id, ...args) {
  for (let n = 0; n < 5; n++) {
    const r = spawnSync('uvx', ['yt-dlp', '--no-warnings', '--skip-download', '--sleep-requests', '1', '-o', join(scratch, '%(id)s.%(ext)s'), ...args, `https://www.youtube.com/watch?v=${id}`], { encoding: 'utf8' });
    const err = r.stderr ?? '';
    if (/confirm you.re not a bot|Sign in to confirm/i.test(err)) {
      console.error(`YouTube bot check on ${id}; stopping.`);
      process.exit(2);
    }
    if (!/HTTP Error 429/.test(err)) return;
    sleep(30 * (n + 1));
  }
}

// Whole-word, case-insensitive; a few inflections allowed. Any hit blocks the talk.
// The gate's terms live outside the repo, one per line (default ~/.config/aimug/caption-gate.txt, or CAPTION_GATE).
// No list, no run: a talk is only written after it passes the gate.
const gateFile = process.env.CAPTION_GATE ?? join(homedir(), '.config/aimug/caption-gate.txt');
if (!existsSync(gateFile)) { console.error(`caption gate list not found at ${gateFile}; refusing to run`); process.exit(1); }
const LEGAL = readFileSync(gateFile, 'utf8').split('\n').map((t) => t.trim()).filter(Boolean);
if (!LEGAL.length) { console.error(`caption gate list at ${gateFile} is empty; refusing to run`); process.exit(1); }
const legalRes = LEGAL.map((k) => [k, new RegExp(`(?<![\\p{L}\\p{N}])${k.replace(/[-\s]/g, (c) => (c === ' ' ? '\\s+' : '[-\\s]?'))}(?:s|es|ed|ing|ment|ments)?(?![\\p{L}\\p{N}])`, 'giu')]);
function legalHits(text) {
  const hits = [];
  for (const [k, re] of legalRes) {
    const snippets = [...text.matchAll(re)].slice(0, 3).map((m) => text.slice(Math.max(0, m.index - 40), m.index + m[0].length + 40).replace(/\s+/g, ' '));
    if (snippets.length) hits.push({ k, snippets });
  }
  return hits;
}

/** Caption cues to [{ t, text }]. Auto captions roll: each cue repeats the previous line above the new one, so a line
 * already emitted in the last two pieces is a repeat. (Word timing tags can't be trusted: a one-word line has none.) */
function transcript(vtt) {
  const cues = parseCues(vtt);
  const auto = cues.some((c) => c.lines.some((l) => /<\d\d:\d\d:\d\d\.\d+>/.test(l)));
  const pieces = [];
  const clean = (l) => l.replace(/<[^>]*>/g, '').replace(/&nbsp;|\u00a0/g, ' ').replace(/&amp;/g, '&').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
  for (const c of cues) {
    for (const text of auto ? c.lines.map(clean) : [clean(c.lines.join(' '))]) {
      if (!text || pieces.slice(-2).some((p) => p.text === text)) continue;
      pieces.push({ start: c.start, text });
    }
  }
  // Merge into lines of about 10 s: break at a sentence end after 4 s, else at 12 s or 180 chars.
  const lines = [];
  let cur;
  for (const p of pieces) {
    if (cur) {
      const age = p.start - cur.t;
      const ended = /[.?!]["')\]]?$/.test(cur.text);
      if (!(age >= 12 || cur.text.length >= 180 || (ended && age >= 4))) {
        cur.text += ' ' + p.text;
        continue;
      }
    }
    cur = { t: Math.floor(p.start), text: p.text };
    lines.push(cur);
  }
  return lines;
}

const events = load(readFileSync(join(siteDir, 'src/data/events.yaml'), 'utf8')).map((e) => ({ id: String(e.id), kind: e.kind ?? 'mixer', title: e.title }));
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
const MEETING = new RegExp(`\\b(${MONTHS.join('|')})(?:\\s+(20\\d\\d))?\\s+(?:monthly\\s+)?(?:aimug\\s+|ai\\s*mug\\s+|austin\\s+ai\\s+mug\\s+)?(showcase|meeting|meetup|mixer|hacky hour)\\b`, 'i');

/** { id, evidence } when the title or description names a meeting and exactly one event fits; else undefined. */
function eventLink(talk, desc) {
  for (const text of [talk.title, desc]) {
    const m = text.match(MEETING);
    if (!m) continue;
    const month = MONTHS.indexOf(m[1].toLowerCase()) + 1;
    const day = String(talk.date).slice(0, 10);
    let year = m[2] ? Number(m[2]) : Number(day.slice(0, 4));
    if (!m[2] && month > Number(day.slice(5, 7))) year--; // no year named: the latest such month before the upload
    const prefix = `${year}-${String(month).padStart(2, '0')}`;
    const hacky = /hacky/i.test(m[3]);
    const hits = events.filter((e) => e.id.startsWith(prefix) && (e.kind === 'hacky-hour') === hacky);
    if (hits.length === 1 && hits[0].id <= day) return { id: hits[0].id, evidence: `"${m[0]}" in ${text === talk.title ? 'title' : 'description'}` };
  }
}

const BOILER = /subscribe|join us|follow us|sign up|rsvp|meetup\.com|lu\.ma|luma|connect with|like and share|check out our|for more (info|information)|support the channel|sponsor|^\s*#|^\s*\d{1,2}:\d{2}/i;
/** First genuine paragraph of a description, at most ~280 chars ending on a sentence. */
function summaryFrom(desc) {
  for (const para of desc.split(/\n\s*\n/)) {
    const text = para.replace(/https?:\/\/\S+/g, '').replace(/#\w+/g, '').replace(/^[^\p{L}\p{N}]+/u, '').replace(/^Description\b\s*/i, '').replace(/\s+[\u2014\u2013]\s+/g, ', ').replace(/[\u2014\u2013]/g, ', ').replace(/\s+/g, ' ').trim();
    if (/[:,]$/.test(text)) continue; // a heading with its list cut off
    if (text.length < 40 || BOILER.test(para) || para.split('\n').filter((l) => /^\s*\d{1,2}:\d{2}/.test(l)).length > 1) continue;
    if (text.length <= 280) return text;
    const cut = text.slice(0, 281);
    const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
    return end >= 40 ? cut.slice(0, end + 1) : undefined;
  }
}

/** Names that look like speaker credits. For human review only, never written to a talk. */
function speakerCandidates(text) {
  const out = [];
  const name = '[A-Z][\\p{L}\\.\'-]+(?:\\s+[A-Z][\\p{L}\\.\'-]+){1,2}';
  const re = new RegExp(`(?:speakers?|presenters?|presented by|presenting|hosted by|featuring|guests?|with|by)\\s*[:\\-]?\\s*(${name})`, 'gu');
  for (const m of text.matchAll(re)) out.push([m[1], m[0].replace(/\s+/g, ' ')]);
  return out;
}

const all = readdirSync(talksDir).filter((f) => f.endsWith('.json')).sort();
const stats = { processed: 0, transcripts: 0, gated: [], none: [], events: 0, summaries: 0, languages: 0, bytes: 0 };
const log = { gate: [], events: [], speakers: [], none: [] };

for (const f of all) {
  const talk = JSON.parse(readFileSync(join(talksDir, f), 'utf8'));
  const slug = f.slice(0, -5);
  if (!talk.backfill || talk.transcript?.length || (talk.publishAt && new Date(talk.publishAt) > new Date())) continue;
  // Talks by the organizer are held for human review.
  if (talk.speakers?.includes('colin-mcnamara') || /colin/i.test(talk.title)) continue;
  stats.processed++;
  const id = talk.youtubeId;
  const infoFile = join(scratch, `${id}.info.json`);
  if (!existsSync(infoFile)) ytdlp(id, '--write-info-json');
  if (!existsSync(infoFile)) {
    stats.none.push(slug);
    log.none.push(`${slug}\t${id}\tno info.json`);
    continue;
  }
  const info = JSON.parse(readFileSync(infoFile, 'utf8'));
  const desc = info.description ?? '';
  const manual = Object.keys(info.subtitles ?? {});
  const autoOrig = Object.keys(info.automatic_captions ?? {}).filter((k) => k.endsWith('-orig'));
  const lang = (info.language || autoOrig[0]?.replace('-orig', '') || manual[0] || '').split('-')[0];
  const track = manual.find((k) => k === lang) ?? manual.find((k) => k.split('-')[0] === lang) ?? autoOrig.find((k) => k === `${lang}-orig`) ?? autoOrig[0];
  const isManual = manual.includes(track);
  let vtt = track && readdirSync(scratch).find((n) => n === `${id}.${track}.vtt`);
  if (track && !vtt) {
    ytdlp(id, isManual ? '--write-subs' : '--write-auto-subs', '--sub-langs', track, '--sub-format', 'vtt');
    vtt = readdirSync(scratch).find((n) => n === `${id}.${track}.vtt`);
  }
  if (!vtt) {
    stats.none.push(slug);
    log.none.push(`${slug}\t${id}\tmanual=[${manual}] auto-orig=[${autoOrig}]`);
    continue;
  }
  const lines = transcript(readFileSync(join(scratch, vtt), 'utf8'));
  const gate = legalHits([talk.title, desc, lines.map((l) => l.text).join(' ')].join('\n'));
  if (gate.length) {
    stats.gated.push(`${slug} (${gate.map((g) => g.k).join(', ')})`);
    log.gate.push(`${slug}\t${id}\t${gate.map((g) => `${g.k}: ${g.snippets.map((s) => `"${s}"`).join(' | ')}`).join('\n\t\t')}`);
    continue;
  }
  for (const [n, ev] of speakerCandidates(`${talk.title}\n${desc}`)) log.speakers.push(`${slug}\t${id}\t${n}\t${ev}`);

  // Rebuild in schema order: title, speakers, date, dateApprox, event, youtubeId, publishAt, duration, thumbnail, summary, topics, ..., transcript, language, backfill.
  const link = eventLink(talk, desc);
  const summary = talk.summary ? undefined : summaryFrom(desc);
  const { title, speakers, date, dateApprox, event, youtubeId, publishAt, duration, thumbnail, topics, ...rest } = talk;
  const { backfill, ...other } = rest;
  const entry = {
    title, speakers, date, ...(dateApprox !== undefined && { dateApprox }),
    ...((event ?? link?.id) && { event: event ?? link.id }),
    youtubeId, ...(publishAt && { publishAt }), ...(duration !== undefined && { duration }), ...(thumbnail && { thumbnail }),
    ...(summary && { summary }), topics, ...other,
    transcript: lines,
    ...(lang === 'es' && { language: 'es' }),
    backfill,
  };
  const before = readFileSync(join(talksDir, f)).length;
  writeTalk(slug, entry);
  stats.bytes += readFileSync(join(talksDir, f)).length - before;
  stats.transcripts++;
  if (link && !event) { stats.events++; log.events.push(`${slug}\t${id}\t${link.id}\t${link.evidence}`); }
  if (summary) stats.summaries++;
  if (lang === 'es') stats.languages++;
  console.log(`${slug}: ${lines.length} lines (${isManual ? 'manual' : 'auto'} ${track})${link && !event ? ` event ${link.id}` : ''}`);
}

writeFileSync(join(scratch, 'legal-gate.txt'), log.gate.join('\n') + '\n');
writeFileSync(join(scratch, 'event-links.txt'), log.events.join('\n') + '\n');
writeFileSync(join(scratch, 'speaker-candidates.txt'), log.speakers.join('\n') + '\n');
writeFileSync(join(scratch, 'no-captions.txt'), log.none.join('\n') + '\n');
console.log(JSON.stringify({ ...stats, gated: stats.gated.length, none: stats.none.length }, null, 2));
console.log('gated:', stats.gated.join('; '));
console.log('no captions:', stats.none.join('; '));
