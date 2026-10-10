// One-off: give backfill stubs topics from the existing vocabulary (topicsFor on the title). Never overwrites existing topics.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { talksDir, topicsFor, writeTalk } from './lib.mjs';

let n = 0, stubs = 0;
for (const f of readdirSync(talksDir).filter((f) => f.endsWith('.json'))) {
  const d = JSON.parse(readFileSync(join(talksDir, f), 'utf8'));
  if (!d.backfill) continue;
  stubs++;
  if (d.topics?.length) continue;
  const t = topicsFor(d.title);
  if (!t.length) continue;
  writeTalk(f.slice(0, -5), { ...d, topics: t });
  n++;
}
console.log(`${n} of ${stubs} backfill stubs gained topics`);
