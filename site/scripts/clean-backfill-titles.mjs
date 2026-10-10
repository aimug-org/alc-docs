// Strips trailing channel suffixes (" | AIMUG", " - Austin LangChain AIMUG December 2024", ...) from backfill titles and flags Spanish talks.
// Slugs (file names) never change. Usage: node scripts/clean-backfill-titles.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const dir = 'src/content/talks';
const clean = (t) => t
  .replace(/AIMUG (Builders Podcast)/, '$1')
  .replace(/\s*\|\s*AIMUG [A-Z][a-z]+ 20\d\d\)$/, ')')
  .replace(/\s+\(AIMUG [A-Z][a-z]+ 20\d\d\)$/, '')
  .replace(/\s+[|–-]\s+(?:(?:Panama |Austin )?(?:AIMUG|AI MUG)|Austin LangChain)\b[^|–]*$/, '')
  .trim();
const es = /Español|Espanol|en español/i;

for (const f of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const p = `${dir}/${f}`;
  const j = JSON.parse(readFileSync(p, 'utf8'));
  if (!j.backfill) continue;
  const t = clean(j.title);
  const lang = es.test(j.title) ? 'es' : j.language;
  if (t === j.title && lang === j.language) continue;
  console.log(`${lang === 'es' ? '[ES] ' : ''}${j.title}\n   -> ${t}`);
  j.title = t;
  if (lang) j.language = lang;
  writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
}
