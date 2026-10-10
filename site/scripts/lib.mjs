// Shared by import-night.mjs and backfill-youtube.mjs.
import { readdirSync, readFileSync, writeFileSync, renameSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { load } from 'js-yaml'; // a dependency of astro

export const siteDir = new URL('..', import.meta.url).pathname;
export const talksDir = join(siteDir, 'src/content/talks');

/** kebab-case, at most `max` chars, cut at a word boundary. */
export function slugify(s, max = 80) {
  const slug = s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (slug.length <= max) return slug;
  const cut = slug.slice(0, max + 1);
  return cut.slice(0, cut.lastIndexOf('-') > 0 ? cut.lastIndexOf('-') : max);
}

/** Every talk entry on disk, by YouTube id. */
export function existingTalks() {
  mkdirSync(talksDir, { recursive: true });
  const byId = new Map();
  for (const f of readdirSync(talksDir).filter((f) => f.endsWith('.json'))) {
    const d = JSON.parse(readFileSync(join(talksDir, f), 'utf8'));
    if (d.start !== undefined) continue; // a segment of a full-night video; the video's own entry is the match
    byId.set(d.youtubeId, { slug: f.slice(0, -5), backfill: !!d.backfill, date: d.date, dateApprox: !!d.dateApprox });
  }
  return byId;
}

/** Write via a temp file and rename, so an entry on disk is always complete. */
export function writeTalk(slug, entry) {
  const file = join(talksDir, `${slug}.json`);
  writeFileSync(`${file}.tmp`, JSON.stringify(entry, null, 2) + '\n');
  renameSync(`${file}.tmp`, file);
}

// Most specific first: TalkCard shows topics[0]. Only this vocabulary is allowed on the site.
const TOPICS = [
  ['Evals', /\bevals?\b|evaluat/i],
  ['Routing', /\brout(ing|er)\b/i],
  ['LangGraph', /langgraph/i],
  ['Graphs', /\bgraph(?!ic)/i],
  ['MCP', /\bmcp\b|model context protocol/i],
  ['RAG', /\brag\b|graphrag|retrieval|vector (db|database|store|search)/i],
  ['Coding agents', /coding (agent|factory|workflow)|claude code|codex|cursor\b|copilot|vibe cod/i],
  ['Inference', /inference|vllm|ollama|llama\.cpp|\bgpus?\b|mixture of models|local (llm|model)s?|quantiz/i],
  ['Security', /security|prompt injection|\bpii\b|privacy|guardrail/i],
  ['Agents', /agent/i],
  ['Community', /\bcommunity\b|welcome|announcements/i],
];

/** Up to three topics whose keywords appear in the text. */
export const topicsFor = (text) => TOPICS.filter(([, re]) => re.test(text)).map(([t]) => t).slice(0, 3);

/** Speaker ids from src/data/speakers.yaml. */
export const speakerIds = () => new Set(load(readFileSync(join(siteDir, 'src/data/speakers.yaml'), 'utf8')).map((s) => s.id));

/** publishAt as an ISO string: "YYYY-MM-DD HH:mm" is Austin local time (offset picked for that date, CDT or CST); a full ISO string passes through. */
export function publishAtIso(s) {
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/);
  if (!m) {
    if (Number.isNaN(Date.parse(s))) throw new Error(`bad publishAt "${s}": use "YYYY-MM-DD HH:mm" (Austin time) or a full ISO string`);
    return s;
  }
  const [y, mo, d, h, mi] = m.slice(1).map(Number);
  const local = Date.UTC(y, mo - 1, d, h, mi);
  const fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
  const offsetAt = (utc) => {
    const p = Object.fromEntries(fmt.formatToParts(utc).map((x) => [x.type, +x.value]));
    return (Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - utc) / 60000; // minutes, negative for Chicago
  };
  const off = offsetAt(local - offsetAt(local) * 60000);
  const sign = off < 0 ? '-' : '+';
  return `${s.replace(' ', 'T')}:00${sign}${String(Math.floor(Math.abs(off) / 60)).padStart(2, '0')}:${String(Math.abs(off) % 60).padStart(2, '0')}`;
}

/** "01:02:03,450", "01:02:03.450" or "02:03" to seconds. */
export const secs = (s) => s.trim().replace(',', '.').split(':').reduce((acc, p) => acc * 60 + Number(p), 0);

/** Cues of an SRT or WebVTT file: [{ start, end, lines }] with the raw text lines of each cue. */
export function parseCues(src) {
  const cues = [];
  for (const block of src.replace(/\r/g, '').split(/\n{2,}/)) {
    const rows = block.split('\n');
    const at = rows.findIndex((r) => r.includes('-->'));
    if (at < 0) continue;
    const [start, end] = rows[at].split('-->').map((x) => secs(x.trim().split(/\s/)[0]));
    cues.push({ start, end, lines: rows.slice(at + 1) });
  }
  return cues;
}
