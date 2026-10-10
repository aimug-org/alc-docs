import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { publicTalks, nextEvent, fmtDay, fmtTime, fmtDate } from '../lib/data';
import { moves, nightUrl } from '../components/content/content';

const head = `# AIMUG

> AIMUG, the AI Middleware Users Group, is a free community in Austin, Texas for people building with AI agents and the middleware around them (LangChain, LangGraph, routing, evals, tooling). Members share new research and teach each other through short talks. It meets the first Monday of every month at 6 PM at ACC Rio Grande and online, holds Office Hours on Google Meet the 2nd, 3rd and 4th Mondays at 5 PM CT, and records and publishes every talk.

## Key pages

- [Events](https://aimug.org/events/): the next meetup, Office Hours, and every past event; each meetup night has a page with its talks, recap and notes
- [Talks](https://aimug.org/talks/): every recorded talk; newer talks come with transcripts and chapters
- [Speak](https://aimug.org/speak/): how to pitch a talk
- [Notes](https://aimug.org/docs/): labs, slides and guides from past meetups, plus the earlier LangChain lab series
- [News](https://aimug.org/blog/): community news, essays and Office Hours notes

## Optional

- [Community](https://aimug.org/community/): Discord, newsletter and other ways to connect
- [Support](https://aimug.org/support/): monthly support, one-time gifts and sponsorship
- [Code of conduct](https://aimug.org/code-of-conduct/)
`;

export const GET: APIRoute = async () => {
  const names = new Map((await getCollection('speakers')).map((s) => [s.id, s.data.name]));
  const next = await nextEvent();
  let body = head;
  if (next) {
    const url = next.data.rsvp.luma ?? next.data.rsvp.meetup ?? 'https://aimug.org/events/';
    const v = next.data.venue;
    body += `\n## Next meetup\n\n- ${next.data.title}\n- ${fmtDay(next.data.start, { weekday: 'long', year: 'numeric' })}, ${fmtTime(next.data.start)} to ${fmtTime(next.data.end)} CT\n- ${v.address ? `${v.name}, ${v.address}` : v.name}\n- RSVP: ${url}\n`;
  }
  const lines = (await publicTalks()).map((t) => {
    const who = t.data.speakers.map((id) => names.get(id) ?? id).join(', ');
    const when = fmtDate(t.data.date, { weekday: undefined, day: undefined, year: 'numeric', month: 'long' });
    const first = t.data.summary?.match(/^.*?[.!?](?=\s|$)/s)?.[0] ?? t.data.summary;
    return `- [${t.data.title}](https://aimug.org/talks/${t.id}/): ${[who, when].filter(Boolean).join(', ')}.${first ? ` ${first.replace(/\s+/g, ' ')}` : ''}`;
  });
  body += `\n## Talks\n\n${lines.join('\n')}\n`;
  const nights = (await moves()).nights.filter((e) => e.data.end < new Date()).reverse();
  body += `\n## Meetup nights\n\n${nights.map((e) => `- [${e.data.title}, ${fmtDay(e.data.start, { weekday: undefined, year: 'numeric' })}](https://aimug.org${nightUrl(e.id)})`).join('\n')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
