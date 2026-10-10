// Credits backfill talks to speakers when the title clearly names them ("<talk> | <Name>", "<Name>: <talk>", "<talk> - <Name>", "by <Name>").
// Adds missing people to src/data/speakers.yaml (id + name only). Skips anything ambiguous and prints those titles.
// Usage: node scripts/attribute-speakers.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const dir = 'src/content/talks';
const yamlPath = 'src/data/speakers.yaml';
const STOP = new Set(['AIMUG', 'AI', 'MUG', 'Austin', 'LangChain', 'LangGraph', 'Claude', 'Code', 'Deep', 'Agents', 'Agent', 'Panama', 'Showcase', 'September', 'October', 'November', 'December', 'Builders', 'Podcast', 'Thunderstorm', 'Talks', 'Smart', 'Spaces', 'Users', 'Group', 'Meeting', 'Full', 'Expert', 'Panel', 'Cursor', 'Cloudflare', 'CloudFlare', 'Containers', 'Results', 'Ketzai', 'Sir', 'Muzz', 'Stanford', 'Intro', 'Middleware', 'Edge', 'Computing', 'Hypernova', 'Labs', 'Mixer', 'Recording', 'Streamlit', 'Dashboards', 'Inference', 'Frameworks', 'En', 'Espanol', 'Español']);
const word = "[A-Z][a-zà-ÿ]+(?:[A-Z][a-zà-ÿ]+)?(?:-[A-Z][a-zà-ÿ]+)?";
const NAME = new RegExp(`^${word}(?: ${word}){1,2}$`);
const isName = (s) => NAME.test(s) && !s.split(' ').some((w) => STOP.has(w));
const kebab = (n) => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function names(title) {
  // Only a person-shaped whole segment counts; the first segment counts only when followed by ":" ("<Name>: <talk>").
  const out = [];
  const colon = title.match(/^([^:|]+?):\s/);
  const segs = title.split(/\s+[|–—-]\s+|\s*[()]\s*|\s+by\s+/).map((s) => s.trim()).filter(Boolean);
  const cands = [];
  if (colon) cands.push(colon[1]);
  segs.slice(1).forEach((s) => cands.push(s));
  for (const c of cands) {
    for (const part of c.split(/\s+&\s+/)) if (isName(part.trim())) out.push(part.trim());
  }
  return [...new Set(out)];
}

let yaml = readFileSync(yamlPath, 'utf8');
const known = new Set([...yaml.matchAll(/^- id: (.+)$/gm)].map((m) => m[1].trim()));
const added = [];
const skipped = [];
let credited = 0;

for (const f of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const p = `${dir}/${f}`;
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.backfill || j.speakers.length) continue;
  const ns = names(j.title);
  if (!ns.length) { skipped.push(j.title); continue; }
  const ids = ns.map(kebab);
  ns.forEach((n, i) => {
    if (!known.has(ids[i])) {
      yaml = yaml.replace(/\n*$/, `\n\n- id: ${ids[i]}\n  name: ${n}\n`);
      known.add(ids[i]);
      added.push(n);
    }
  });
  j.speakers = ids;
  writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
  credited++;
  console.log(`${ids.join(', ').padEnd(40)} <- ${j.title}`);
}
writeFileSync(yamlPath, yaml);
console.log(`\nCredited ${credited} talks; added ${added.length} speakers: ${added.join(', ')}`);
console.log(`Skipped ${skipped.length}:\n  ${skipped.join('\n  ')}`);
