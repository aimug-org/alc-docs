// Data sanity gate, run first in `npm run build`. Fails on references that would 404 or silently drop off the site.
// Usage: node scripts/check-data.mjs [siteRoot]   (siteRoot defaults to site/; needs src/data, src/content/{talks,blog,docs})
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'js-yaml';

const root = process.argv[2] ?? fileURLToPath(new URL('..', import.meta.url));
const yaml = (f) => load(readFileSync(join(root, 'src/data', f), 'utf8')) ?? [];
const walk = (dir) => !existsSync(dir) ? [] : readdirSync(dir, { withFileTypes: true }).flatMap((d) => d.isDirectory() ? walk(join(dir, d.name)) : [join(dir, d.name)]);

const events = yaml('events.yaml');
const speakers = new Set(yaml('speakers.yaml').map((s) => s.id));
const eventIds = new Set(events.map((e) => String(e.id)));
const errors = [];

// Blog post URLs, built the way src/components/content/content.ts does: frontmatter slug, else /YYYY/MM/DD/<name>.
const postUrls = new Set(walk(join(root, 'src/content/blog')).filter((f) => /\.mdx?$/.test(f)).map((f) => {
  const slug = load(readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '')?.slug;
  const id = f.slice(join(root, 'src/content/blog/').length).replace(/\.mdx?$/, '');
  const m = id.match(/^(\d{4})[-/](\d{2})[-/](\d{2})[-/](.+?)(?:\/index)?$/);
  return `/blog/${slug?.replace(/^\/|\/$/g, '') ?? (m && `${m[1]}/${m[2]}/${m[3]}/${m[4]}`)}/`;
}));
const docsDir = join(root, 'src/content/docs');

for (const e of events) {
  if (!(new Date(e.end) > new Date(e.start))) errors.push(`event ${e.id}: end (${e.end}) is not after start (${e.start})`);
  for (const id of e.lineup ?? []) if (!speakers.has(id)) errors.push(`event ${e.id}: lineup speaker "${id}" is not in speakers.yaml`);
  if (e.recap && !postUrls.has(e.recap)) errors.push(`event ${e.id}: recap ${e.recap} is not the URL of any blog post`);
  const docs = e.docs?.replace(/^\/docs\/|\/$/g, '');
  if (e.docs && !(docs && existsSync(join(docsDir, docs)))) errors.push(`event ${e.id}: docs ${e.docs} has no folder under src/content/docs`);
}
for (const f of walk(join(root, 'src/content/blog')).filter((f) => /\.mdx?$/.test(f))) {
  const ev = load(readFileSync(f, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '')?.event;
  if (ev && !eventIds.has(String(ev))) errors.push(`post ${f.slice(f.indexOf('src/content/blog/') + 17)}: event "${ev}" is not an id in events.yaml`);
}
for (const f of walk(join(root, 'src/content/talks')).filter((f) => f.endsWith('.json'))) {
  const t = JSON.parse(readFileSync(f, 'utf8'));
  const name = f.slice(f.lastIndexOf('/') + 1);
  for (const id of t.speakers ?? []) if (!speakers.has(id)) errors.push(`talk ${name}: speaker "${id}" is not in speakers.yaml`);
  if (t.event && !eventIds.has(String(t.event))) errors.push(`talk ${name}: event "${t.event}" is not an id in events.yaml`);
  if (t.writeup && !['.md', '.mdx'].some((x) => existsSync(join(docsDir, t.writeup + x)))) errors.push(`talk ${name}: writeup "${t.writeup}" is not a file under src/content/docs`);
}

if (errors.length) {
  console.error(`check-data: ${errors.length} problem(s):\n${errors.map((e) => `  ${e}`).join('\n')}`);
  process.exit(1);
}
console.log(`check-data: ok (${events.length} events, ${speakers.size} speakers)`);
