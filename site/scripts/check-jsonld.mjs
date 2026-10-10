// Parses every application/ld+json block in dist/talks/**/index.html. Run after a build.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
let pages = 0, blocks = 0, bad = 0;
for (const slug of readdirSync('dist/talks')) {
  const f = `dist/talks/${slug}/index.html`;
  if (!existsSync(f)) continue;
  pages++;
  for (const m of readFileSync(f, 'utf8').matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    blocks++;
    try { JSON.parse(m[1]); } catch (e) { bad++; console.error(`${f}: ${e.message}`); }
  }
}
console.log(`${pages} talk pages, ${blocks} JSON-LD blocks, ${bad} invalid`);
process.exit(bad || !blocks ? 1 : 0);
