// Asserts every built dist/events/*.ics is valid enough for calendar apps. Run after `npm run build`.
import { readdirSync, readFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const dir = new URL('../dist/events/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.ics'));
assert(files.length, 'no .ics files in dist/events');
for (const f of files) {
  const raw = readFileSync(new URL(f, dir), 'utf8');
  assert(!/[^\r]\n/.test(raw) && raw.endsWith('\r\n'), `${f}: not CRLF`);
  const lines = raw.split('\r\n').slice(0, -1);
  for (const l of lines) assert(Buffer.byteLength(l) <= 75, `${f}: line over 75 octets: ${l}`);
  assert(lines[0] === 'BEGIN:VCALENDAR' && lines.at(-1) === 'END:VCALENDAR', `${f}: VCALENDAR`);
  assert(lines.includes('BEGIN:VEVENT') && lines.includes('END:VEVENT'), `${f}: VEVENT`);
  for (const k of ['DTSTART', 'DTEND', 'DTSTAMP']) assert(lines.some((l) => new RegExp(`^${k}:\\d{8}T\\d{6}Z$`).test(l)), `${f}: ${k} not UTC Z`);
  console.log(`ok ${f}`);
}
