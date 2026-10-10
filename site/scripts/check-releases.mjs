// Release gate, run first in `npm run build`: an event that hasn't ended can't list a speaker in its lineup until that
// speaker has a signed release on file (`release` in src/data/speakers.yaml, the record id from scripts/releases.sh).
// Usage: node scripts/check-releases.mjs [events.yaml speakers.yaml]   (defaults to the files in src/data/)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml'; // a dependency of astro, already in the lockfile

const data = (name) => fileURLToPath(new URL(`../src/data/${name}`, import.meta.url));
const [eventsFile = data('events.yaml'), speakersFile = data('speakers.yaml')] = process.argv.slice(2);
const read = (file) => load(readFileSync(file, 'utf8')) ?? [];

const speakers = read(speakersFile);
const known = new Set(speakers.map((s) => s.id));
const released = new Set(speakers.filter((s) => s.release).map((s) => s.id));
const now = new Date();
const upcoming = read(eventsFile).filter((e) => new Date(e.end) > now); // still on until it ends
const lineup = upcoming.flatMap((e) => (e.lineup ?? []).map((id) => [e.id, id]));
const unknown = lineup.filter(([, id]) => !known.has(id)).map(([e, id]) => `  ${e}: ${id}`);
const missing = lineup.filter(([, id]) => known.has(id) && !released.has(id)).map(([e, id]) => `  ${e}: ${id}`);

if (unknown.length || missing.length) {
  if (unknown.length) console.error(`check-releases: these lineup ids are not in speakers.yaml:\n${unknown.join('\n')}`);
  if (missing.length) console.error(`check-releases: these lineup speakers have no signed release on file:\n${missing.join('\n')}\n` +
    'Add `release: <record id>` to their entry in src/data/speakers.yaml (find it with scripts/releases.sh), or take them off the lineup.');
  process.exit(1);
}
console.log(`check-releases: ok, every lineup speaker in ${upcoming.length} upcoming event(s) has a release on file`);
