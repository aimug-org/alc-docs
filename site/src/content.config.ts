import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), url: z.url() });

// One JSON file per talk: src/content/talks/<slug>.json. Written by scripts/import-night.mjs and scripts/backfill-youtube.mjs.
const talks = defineCollection({
  loader: glob({ base: './src/content/talks', pattern: '**/*.json' }),
  schema: z.object({
    title: z.string(),
    speakers: z.array(z.string()).default([]), // speaker ids
    date: z.coerce.date(), // day the talk was given (or published, for backfilled videos)
    dateApprox: z.boolean().optional(), // backfill only: YouTube's "1 year ago" date; the next backfill run retries the exact one
    event: z.string().optional(), // events id, e.g. "2026-10-05"
    youtubeId: z.string(),
    publishAt: z.coerce.date().optional(), // when the video is public on YouTube; pages stay hidden before this
    duration: z.number().optional(), // seconds; for a segment, the segment's length
    // A talk inside a full-night upload: seconds into that video. The full-night entry has the same youtubeId and no start.
    start: z.number().optional(),
    end: z.number().optional(),
    summary: z.string().optional(),
    topics: z.array(z.string()).default([]),
    chapters: z.array(z.object({ t: z.number(), title: z.string() })).default([]),
    transcript: z.array(z.object({ t: z.number(), text: z.string() })).default([]),
    learn: z.array(z.string()).default([]), // "What you'll learn" bullets
    links: z.array(link).default([]),
    thumbnail: z.string().optional(), // path under /public, else the YouTube thumbnail is used
    language: z.string().optional(), // e.g. "es"; omitted for English
    backfill: z.boolean().default(false), // stub made from the channel listing, no transcript yet
  }),
});

const speakers = defineCollection({
  loader: file('src/data/speakers.yaml'),
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    company: z.string().optional(),
    bio: z.string().optional(),
    photo: z.string().optional(), // path under /public
    links: z.array(link).default([]),
    release: z.string().optional(), // id of the signed speaker release
  }),
});

const events = defineCollection({
  loader: file('src/data/events.yaml'),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['mixer', 'special', 'hacky-hour', 'field-trip']).default('mixer'),
    start: z.coerce.date(),
    end: z.coerce.date(),
    venue: z.object({ name: z.string(), address: z.string().optional() }),
    afterparty: z.object({ name: z.string(), address: z.string().optional() }).optional(),
    online: z.boolean().default(true),
    rsvp: z.object({ luma: z.url().optional(), meetup: z.url().optional() }).default({}),
    summary: z.string().optional(),
    agenda: z.array(z.object({ time: z.string(), label: z.string() })).default([]),
    lineup: z.array(z.string()).default([]), // speaker ids, only once each has a release
    lineupDate: z.coerce.date().optional(), // week the lineup is announced (picked at that Monday's Office Hours)
    pitchDeadline: z.coerce.date().optional(), // pitches due: the Monday before, before Office Hours at 5 PM CT
    recap: z.string().optional(), // site path of the recap post
    docs: z.string().optional(), // site path of the slides and notes
  }),
});

// Migrated from the Docusaurus site. Ids keep the file path as is (case and all), since URLs are built from it.
const pathId = ({ entry }: { entry: string }) => entry.replace(/\.mdx?$/, '');

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}', generateId: pathId }),
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.coerce.date().optional(), // else taken from the folder name
    slug: z.string().optional(), // else /YYYY/MM/DD/<name>
    description: z.string().optional(),
    authors: z.array(z.string()).default([]), // blogAuthors ids
    tags: z.array(z.string()).default([]), // blogTags ids
    image: z.union([z.string().startsWith('/'), image()]).optional(), // /public path, or a file next to the post
    draft: z.boolean().optional(),
  }),
});

// The Docusaurus authors.yml and tags.yml, copied as is.
const blogAuthors = defineCollection({
  loader: file('src/content/blog/authors.yml'),
  schema: z.object({
    name: z.string(),
    title: z.string().optional(),
    url: z.string().optional(),
    image_url: z.string().optional(),
    socials: z.record(z.string(), z.string()).default({}),
  }),
});

const blogTags = defineCollection({
  loader: file('src/content/blog/tags.yml'),
  schema: z.object({ label: z.string(), permalink: z.string(), description: z.string().optional() }),
});

const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.{md,mdx}', generateId: pathId }),
  schema: z.object({
    title: z.string().optional(), // else the first # heading
    description: z.string().optional(),
    sidebar_label: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { talks, speakers, events, blog, blogAuthors, blogTags, docs };
