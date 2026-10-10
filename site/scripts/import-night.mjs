// Build full talk entries for one meetup night from its nerdreel output folder.
// Usage: node scripts/import-night.mjs <nightDir> <mapping.json>
// The mapping (scripts/nights/<event>.json) gives each talk's public YouTube id and, if scheduled, its publishAt.
// A talk whose publishAt is still ahead gets a premiere stub (no summary, transcript, chapters, learn or links): re-run after the last premiere.
import { existsSync, readFileSync, unlinkSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { siteDir, talksDir, slugify, existingTalks, writeTalk, topicsFor, speakerIds, publishAtIso, parseCues, secs } from './lib.mjs';

const [nightDir, mappingPath] = process.argv.slice(2);
if (!nightDir || !mappingPath) {
  console.error('usage: node scripts/import-night.mjs <nightDir> <mapping.json>');
  process.exit(1);
}
const mapping = JSON.parse(readFileSync(mappingPath, 'utf8'));
const speakers = speakerIds();
const existing = existingTalks();
mkdirSync(join(siteDir, 'public/talks'), { recursive: true });

/** The lines of a "Heading" block in the description: "- item" lines up to the next blank line. */
function bullets(lines, heading) {
  const i = lines.indexOf(heading);
  if (i < 0) return [];
  const out = [];
  for (const l of lines.slice(i + 1)) {
    if (!l.startsWith('- ')) break;
    out.push(l.slice(2).trim());
  }
  return out;
}

/** SRT cues merged into readable lines: fragments join until a sentence ends, a pause, or ~200 chars. Text is verbatim. */
function transcript(srt) {
  const lines = [];
  let cur;
  for (const { start, end, lines: rows } of parseCues(srt)) {
    const text = rows.join(' ').trim();
    if (!text) continue;
    if (cur && start - cur.end < 2 && cur.text.length < 200 && !/[.?!]["')\]]?$/.test(cur.text)) {
      cur.text += ' ' + text;
      cur.end = end;
    } else {
      cur = { t: Math.floor(start), end, text };
      lines.push(cur);
    }
  }
  return lines.map(({ t, text }) => ({ t, text }));
}

// A key must be a speaker id, or a non-speaker segment (e.g. colin-intro) that has no youtubeId. Anything else is a typo.
const unknown = Object.entries(mapping.talks).filter(([name, m]) => !speakers.has(name) && m.youtubeId).map(([name]) => name);
if (unknown.length) {
  console.error(`import-night: mapping key(s) not in speakers.yaml: ${unknown.join(', ')}. Fix the key, or add the speaker, or drop the youtubeId for a non-speaker segment.`);
  process.exit(1);
}

for (const [name, m0] of Object.entries(mapping.talks)) {
  const m = m0.publishAt ? { ...m0, publishAt: publishAtIso(m0.publishAt) } : m0;
  const md = join(nightDir, 'out', `${name}.youtube.md`);
  if (!m.youtubeId || !existsSync(md)) {
    console.log(`skip ${name}: ${m.youtubeId ? 'no youtube.md' : 'no video id'}`);
    continue;
  }
  const lines = readFileSync(md, 'utf8').split('\n');
  const title = lines[lines.indexOf('## Title') + 1].split(' | ')[0].trim();
  const desc = lines.slice(lines.findIndex((l) => l.startsWith('----- description starts')) + 1, lines.findIndex((l) => l.startsWith('----- description ends')));
  const summary = desc.find((l) => l.trim())?.trim();
  const learn = bullets(desc, "What you'll learn");
  const links = bullets(desc, 'Resources mentioned').map((b) => b.match(/^(.+?):\s+(https?:\/\/\S+)$/)).filter(Boolean).map(([, label, url]) => ({ label, url }));
  const chapters = desc.map((l) => l.match(/^((?:\d+:)?\d{1,2}:\d{2}) (.+)$/)).filter(Boolean).map(([, t, title]) => ({ t: secs(t), title }));
  const hashtags = desc.filter((l) => l.startsWith('#')).join(' ');
  const fixed = join(nightDir, 'publish', `${name}.youtube.fixed.srt`);
  const srt = existsSync(fixed) ? fixed : join(nightDir, 'out', `${name}.youtube.srt`);
  // Length of the uploaded file (bumpers included); the cut's json duration if that file is gone.
  const mp4 = join(nightDir, 'out', `${name}.youtube.mp4`);
  const probed = existsSync(mp4) && Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', mp4], { encoding: 'utf8' }).stdout);
  const duration = probed || JSON.parse(readFileSync(join(nightDir, 'out', `${name}.json`), 'utf8')).duration;
  const premiere = m.publishAt && new Date(m.publishAt) > new Date();

  // A slug held by a different video gets the night appended, then -2, -3... until it is free.
  const holder = (s) => [...existing].find(([, e]) => e.slug === s)?.[0];
  const dated = slugify(`${title} ${mapping.event}`);
  let slug = slugify(title);
  for (let n = 1; holder(slug) && holder(slug) !== m.youtubeId; n++) slug = n === 1 ? dated : `${slugify(`${title} ${mapping.event}`, 76)}-${n}`;
  const prev = existing.get(m.youtubeId);

  await sharp(join(nightDir, 'out', `${name}.thumb.jpg`)).resize({ width: 1280 }).jpeg({ quality: 75 }).toFile(join(siteDir, 'public/talks', `${slug}.jpg`));
  const stub = {
    title,
    speakers: speakers.has(name) ? [name] : [],
    date: mapping.event,
    event: mapping.event,
    youtubeId: m.youtubeId,
    ...(m.publishAt && { publishAt: m.publishAt }),
    duration: Math.round(duration),
    thumbnail: `/talks/${slug}.jpg`,
    topics: m.topics ?? topicsFor([title, summary, ...learn, hashtags].join('\n')), // mapping can override the matcher
  };
  writeTalk(slug, premiere ? stub : { ...stub, summary, chapters, learn, links, transcript: transcript(readFileSync(srt, 'utf8')) });
  // Only once the new entry is written: drop this video's older entry (a stub or a renamed talk) and its thumbnail.
  if (prev && prev.slug !== slug) {
    unlinkSync(join(talksDir, `${prev.slug}.json`));
    const oldThumb = join(siteDir, 'public/talks', `${prev.slug}.jpg`);
    if (existsSync(oldThumb)) unlinkSync(oldThumb);
  }
  existing.set(m.youtubeId, { slug, backfill: false });
  console.log(premiere ? `${slug}: premiere stub until ${m.publishAt}` : `${slug}: ${chapters.length} chapters, ${learn.length} learn, ${links.length} links (${srt.includes('fixed') ? 'fixed' : 'raw'} srt)`);
}
