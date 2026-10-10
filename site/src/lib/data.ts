import { getCollection, type CollectionEntry } from 'astro:content';

export type Talk = CollectionEntry<'talks'>;
export type Event = CollectionEntry<'events'>;

// The site is static and rebuilt daily, so "now" is build time. Everything that hides or shows by date uses this one clock.
export const now = new Date();

/** Talks whose video is public. A talk with a future publishAt stays off the site until the rebuild after it. */
export async function publicTalks(): Promise<Talk[]> {
  const all = await getCollection('talks', (t) => !t.data.publishAt || t.data.publishAt <= now);
  return all.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.id.localeCompare(b.id));
}

/** Talks scheduled to premiere later, shown only as "premieres" cards with no video or transcript. */
export async function upcomingTalks(): Promise<Talk[]> {
  const all = await getCollection('talks', (t) => !!t.data.publishAt && t.data.publishAt > now);
  return all.sort((a, b) => a.data.publishAt!.getTime() - b.data.publishAt!.getTime());
}

export async function allEvents(): Promise<Event[]> {
  return (await getCollection('events')).sort((a, b) => a.data.start.getTime() - b.data.start.getTime());
}

/** The next event that hasn't ended yet, or undefined. */
export async function nextEvent(): Promise<Event | undefined> {
  return (await allEvents()).find((e) => e.data.end >= now);
}

export const thumb = (t: Talk) => t.data.thumbnail ?? `https://i.ytimg.com/vi/${t.data.youtubeId}/hqdefault.jpg`;

export const mmss = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = Math.floor(s % 60);
  return (h ? `${h}:${String(m).padStart(2, '0')}` : `${m}`) + `:${String(sec).padStart(2, '0')}`;
};

const tz = 'America/Chicago';
export const fmtDay = (d: Date, opts: Intl.DateTimeFormatOptions = {}) =>
  d.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric', ...opts });
// Date-only values (a talk's `date`, "2026-10-05") parse as UTC midnight: format them in UTC or they show the day before.
export const fmtDate = (d: Date, opts: Intl.DateTimeFormatOptions = {}) =>
  d.toLocaleDateString('en-US', { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric', ...opts });
export const fmtTime = (d: Date) =>
  d.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' }).replace(':00', '');

/** ISO time with the America/Chicago offset, e.g. 2026-11-02T18:00:00-06:00. */
export const chicagoIso = (d: Date) => {
  const f = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', ...o }).formatToParts(d);
  const p = Object.fromEntries(f({ year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).map((x) => [x.type, x.value]));
  const off = f({ timeZoneName: 'longOffset' }).find((x) => x.type === 'timeZoneName')!.value.replace('GMT', '') || '+00:00';
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${off}`;
};

/** schema.org Event for an event entry, or undefined while the venue is still to be announced. */
export const eventLd = (e: Event, url = 'https://aimug.org/events/') => {
  if (/to be announced/i.test(e.data.venue.name)) return undefined;
  const place = { '@type': 'Place', name: e.data.venue.name, address: e.data.venue.address ?? 'Austin, TX' };
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `AIMUG ${e.data.title}`,
    startDate: chicagoIso(e.data.start),
    endDate: chicagoIso(e.data.end),
    eventAttendanceMode: e.data.online ? 'https://schema.org/MixedEventAttendanceMode' : 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: e.data.online ? [place, { '@type': 'VirtualLocation', url }] : place,
    image: 'https://aimug.org/og-default.jpg',
    ...(e.data.summary && { description: e.data.summary }),
    isAccessibleForFree: true,
    organizer: { '@type': 'Organization', name: 'AI Middleware Users Group', url: 'https://aimug.org' },
    url,
  };
};
