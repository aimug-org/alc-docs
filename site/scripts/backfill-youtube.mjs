// List the AIMUG YouTube channel and write a stub talk entry (title, date, duration) per video.
// Usage: node scripts/backfill-youtube.mjs
// Entries made by import-night.mjs are never touched (matched by youtubeId). Shorts are skipped.
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { slugify, existingTalks, writeTalk, topicsFor, talksDir } from './lib.mjs';

const channel = 'https://www.youtube.com/channel/UC03IXA4KU6hOQ_3YPTbS0ig';

function ytdlp(...args) {
  const r = spawnSync('uvx', ['yt-dlp', '--no-warnings', ...args], { encoding: 'utf8', maxBuffer: 1 << 28, stdio: ['ignore', 'pipe', 'inherit'] });
  if (!r.stdout) throw new Error(`yt-dlp failed: ${args.join(' ')}`);
  return r.stdout;
}

const videos = new Map();
for (const tab of ['videos', 'streams']) {
  const { entries = [] } = JSON.parse(ytdlp('--flat-playlist', '-J', '--extractor-args', 'youtubetab:approximate_date', `${channel}/${tab}`));
  for (const v of entries) if (v.duration >= 180 && !v.url?.includes('/shorts/')) videos.set(v.id, v);
}

const existing = existingTalks();
// New videos, plus stubs still waiting on an exact date. Existing stubs are never rewritten: speakers, titles, topics
// and transcripts were added to them by hand and by later scripts.
const todo = [...videos.values()].filter((v) => !existing.has(v.id) || (existing.get(v.id).backfill && existing.get(v.id).dateApprox));

// The listing only has approximate dates ("1 year ago"); fetch the exact upload date for new videos and for
// stubs whose earlier lookup failed (dateApprox), so a failure is retried on the next run.
const exact = new Map();
const fresh = todo.filter((v) => !existing.has(v.id) || existing.get(v.id).dateApprox).map((v) => `https://www.youtube.com/watch?v=${v.id}`);
if (fresh.length) {
  const out = spawnSync('uvx', ['yt-dlp', '--no-warnings', '--ignore-errors', '--skip-download', '--print', '%(id)s %(upload_date)s', ...fresh], { encoding: 'utf8', maxBuffer: 1 << 24 }).stdout ?? '';
  for (const [id, d] of out.trim().split('\n').map((l) => l.split(' '))) if (/^\d{8}$/.test(d)) exact.set(id, `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`);
}

const taken = new Set([...existing.values()].map((e) => e.slug));
let written = 0;
for (const v of todo) {
  const prev = existing.get(v.id);
  if (prev) {
    const day = exact.get(v.id);
    if (!day) continue;
    const { dateApprox, ...d } = JSON.parse(readFileSync(join(talksDir, `${prev.slug}.json`), 'utf8'));
    writeTalk(prev.slug, { ...d, date: day });
    written++;
    continue;
  }
  const title = v.title.replace(/\s+/g, ' ').trim();
  let slug = slugify(title);
  for (let n = 2; taken.has(slug); n++) slug = `${slugify(title, 76)}-${n}`;
  taken.add(slug);
  const day = exact.get(v.id);
  const dateApprox = !day;
  writeTalk(slug, {
    title,
    speakers: [],
    date: day ?? new Date(v.timestamp * 1000).toISOString().slice(0, 10),
    ...(dateApprox && { dateApprox: true }),
    youtubeId: v.id,
    duration: v.duration,
    topics: topicsFor(title),
    backfill: true,
  });
  written++;
}
console.log(`${videos.size} videos on the channel, ${videos.size - todo.length} already imported, ${written} stubs written (${exact.size} of ${fresh.length} exact dates fetched)`);
