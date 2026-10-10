import type { APIRoute } from 'astro';
import { allEvents, now, type Event } from '../../lib/data';

export async function getStaticPaths() {
  return (await allEvents()).filter((e) => e.data.end >= now).map((e) => ({ params: { id: e.id }, props: { event: e } }));
}

const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const utc = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

// RFC 5545 folding: lines of at most 75 octets, continuation lines start with one space. Never split a UTF-8 character.
const fold = (line: string) => {
  const out: string[] = [];
  let cur = '', bytes = 0;
  for (const ch of line) {
    const n = Buffer.byteLength(ch);
    if (bytes + n > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch; bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
};

export const GET: APIRoute = ({ props }) => {
  const e = (props as { event: Event }).event;
  const url = e.data.rsvp.luma ?? e.data.rsvp.meetup ?? 'https://aimug.org/events/';
  const where = [e.data.venue.name, e.data.venue.address].filter(Boolean).join(', ');
  // The schema requires an end, but fall back to start + 2h30m (the standard showcase length) if it is ever missing.
  const end = e.data.end ?? new Date(e.data.start.getTime() + 150 * 60_000);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AIMUG//aimug.org//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${e.id}@aimug.org`,
    `DTSTAMP:${utc(now)}`,
    `DTSTART:${utc(e.data.start)}`,
    `DTEND:${utc(end)}`,
    `SUMMARY:${esc(`AIMUG: ${e.data.title}`)}`,
    `LOCATION:${esc(where)}`,
    `URL:${url}`,
    `DESCRIPTION:${esc([e.data.summary, e.data.online && 'Online on Zoom: the link comes with your RSVP.', url].filter(Boolean).join('\n\n'))}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return new Response(lines.map(fold).join('\r\n') + '\r\n', { headers: { 'Content-Type': 'text/calendar; charset=utf-8' } });
};
