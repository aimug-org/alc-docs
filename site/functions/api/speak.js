// POST /api/speak: store a signed speaker release in D1, then email the speaker a copy. Two forms post here:
// kind "pitch" from /speak/ (a new talk plus the release) and kind "release" from /speak/release/ (a talk we already recorded).
// The pages post JSON (fetch) or, without JS, a plain form post that gets redirected to a thanks page.
import { RELEASE_TEXT, RELEASE_VERSION, sha256Hex } from '../_lib/release.js';

const MIN_FILL_MS = 3000; // a person can't fill the form faster than this
const RATE_LIMIT = 3; // submissions per ip_hash per window
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY = 64 * 1024; // bytes; a full pitch is well under 10 KB as JSON; form encoding can triple non-ASCII text
const TYPES = ['application/json', 'application/x-www-form-urlencoded'];
const RESEND_URL = 'https://api.resend.com/emails'; // env.RESEND_API_URL overrides it, for the local tests only

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// 'any' or a real calendar date. 2026-02-30 fails: it either doesn't parse or doesn't round-trip.
const isEvent = (v) => v === 'any' || (/^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v)) && new Date(v).toISOString().slice(0, 10) === v);
const FORMATS = { thunderstorm: 'Thunderstorm talk, about 15 minutes', demo: 'Demo' };
const PAGES = { pitch: '/speak/', release: '/speak/release/' };

const str = (v) => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '');
const flag = (v) => v === true || v === 1 || ['1', 'true', 'on', 'yes'].includes(str(v).toLowerCase());

// The first problem with the submission, or '' if it's good. Release-only rows take their talk from the build, so skip the pitch checks.
function problem(f) {
  const len = (v, min, max) => v.length >= min && v.length <= max;
  if (f.kind === 'pitch') {
    if (!len(f.talk_title, 3, 150)) return 'Talk title should be 3 to 150 characters.';
    if (!len(f.abstract, 20, 2000)) return 'Abstract should be 20 to 2000 characters.';
    if (!Object.hasOwn(FORMATS, f.format)) return 'Pick a format: Thunderstorm talk or Demo.';
    if (!isEvent(f.preferred_event)) return 'Pick a meetup, or Any month.';
  }
  if (!len(f.name, 1, 120)) return 'Your name is required (up to 120 characters).';
  if (f.email.length > 254 || !EMAIL.test(f.email)) return 'Enter a valid email address.';
  if (f.company.length > 120 || f.title.length > 120) return 'Company and title should be up to 120 characters.';
  if (f.links.length > 1000) return 'Links should be up to 1000 characters.';
  if (!len(f.signature_name, 1, 120)) return 'Type your full name to sign the release.';
  if (!f.agreed) return 'Check "I agree" to sign the release.';
  if (f.minor && !len(f.guardian_name, 1, 120)) return "A parent or guardian's full name is required for speakers under 18.";
  return '';
}

// Talks a past speaker can sign for, as built by src/pages/speak/talks.json.ts: { slug: { title, event } }.
async function releaseTalks({ env, request }) {
  const res = await env.ASSETS.fetch(new URL('/speak/talks.json', request.url));
  if (!res.ok) throw new Error(`talks.json ${res.status}`);
  return res.json();
}

const COLS = ['id', 'created_at', 'kind', 'talk_title', 'abstract', 'format', 'preferred_event', 'name', 'email', 'company', 'title', 'links',
  'tag_ok', 'signature_name', 'agreed', 'release_version', 'release_sha256', 'minor', 'guardian_name', 'ip_hash', 'user_agent', 'emailed'];
// Rate limit and insert in one statement, so concurrent posts can't all pass the count before any of them lands.
const INSERT = `INSERT INTO submissions (${COLS.join(', ')}) SELECT ${COLS.map(() => '?').join(', ')}
  WHERE (SELECT COUNT(*) FROM submissions WHERE ip_hash = ? AND created_at > ?) < ${RATE_LIMIT}`;

export async function onRequestPost(context) {
  const { request, env } = context;
  const type = (request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
  const isJson = type === 'application/json';
  let kind = 'pitch';
  let id;
  const thanks = () => (isJson ? Response.json({ ok: true, id }) : Response.redirect(new URL(`${PAGES[kind]}thanks/`, request.url).href, 303));
  const fail = (status, error) => isJson
    ? Response.json({ ok: false, error }, { status })
    : new Response(errorPage(error, PAGES[kind]), { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

  // Fail closed: without the salt, ip_hash would be an unsalted (reversible by brute force) hash of the IP.
  if (!env.IP_SALT) return fail(500, 'Not configured.');
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) return fail(403, 'Send this from the form on aimug.org.');
  if (!TYPES.includes(type)) return fail(415, 'Send the form as JSON or a regular form post.');
  if (Number(request.headers.get('Content-Length')) > MAX_BODY) return fail(413, 'That is too long to send.');

  let raw;
  try {
    const body = await request.arrayBuffer(); // chunked bodies have no Content-Length, so check what arrived too
    if (body.byteLength > MAX_BODY) return fail(413, 'That is too long to send.');
    const text = new TextDecoder().decode(body);
    raw = isJson ? JSON.parse(text) : Object.fromEntries(new URLSearchParams(text));
  } catch {
    return fail(400, 'Could not read the form.');
  }
  if (!raw || typeof raw !== 'object') return fail(400, 'Could not read the form.');
  if (str(raw.kind) === 'release') kind = 'release';
  else if (str(raw.kind) && str(raw.kind) !== 'pitch') return fail(400, 'Unknown form.');

  if (str(raw.website)) return thanks(); // honeypot: look like success, store nothing
  const t = Number(raw.t);
  if (!Number.isFinite(t) || Date.now() - t < MIN_FILL_MS) return fail(400, 'That was fast. Wait a few seconds and send it again.');
  // The page sends the version it showed; a page loaded before the wording changed must not sign the new text.
  if (str(raw.release_version) !== RELEASE_VERSION) return fail(409, 'The release wording changed. Please reload the page and sign the current version.');

  const f = {
    kind, talk_title: str(raw.talk_title), abstract: str(raw.abstract), format: str(raw.format), preferred_event: str(raw.preferred_event),
    name: str(raw.name), email: str(raw.email), company: str(raw.company), title: str(raw.title), links: str(raw.links),
    tag_ok: flag(raw.tag_ok), signature_name: str(raw.signature_name), agreed: flag(raw.agreed), minor: flag(raw.minor),
    guardian_name: str(raw.guardian_name),
  };
  if (kind === 'release') {
    let talks;
    try {
      talks = await releaseTalks(context);
    } catch (e) {
      console.error('speak: could not load talks.json', e);
      return fail(500, 'Something broke on our side and nothing was saved. Please try again later.');
    }
    const talk = Object.hasOwn(talks, str(raw.talk)) ? talks[str(raw.talk)] : null;
    if (!talk) return fail(400, 'Pick the talk you gave.');
    Object.assign(f, { talk_title: talk.title, preferred_event: talk.event, abstract: '', format: '' });
  }
  const bad = problem(f);
  if (bad) return fail(400, bad);

  let row;
  try {
    const ip_hash = await sha256Hex(env.IP_SALT + (request.headers.get('CF-Connecting-IP') || ''));
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    id = crypto.randomUUID();
    row = {
      ...f, id, created_at: new Date().toISOString(), tag_ok: +f.tag_ok, agreed: 1, minor: +f.minor,
      company: f.company || null, title: f.title || null, links: f.links || null, guardian_name: f.minor ? f.guardian_name : null,
      release_version: RELEASE_VERSION, release_sha256: await sha256Hex(RELEASE_TEXT), ip_hash,
      user_agent: (request.headers.get('User-Agent') || '').slice(0, 500) || null,
      emailed: env.RESEND_API_KEY ? 0 : 2, // 0 not sent yet (or failed), 1 sent, 2 no email configured
    };
    const { meta } = await env.DB.prepare(INSERT).bind(...COLS.map((c) => row[c]), ip_hash, since).run();
    if (!meta.changes) return fail(429, 'Too many submissions from here in the last few minutes. Try again in 10 minutes.');
  } catch (e) {
    console.error('speak: could not store the submission', e);
    return fail(500, 'Something broke on our side and nothing was saved. Please try again later.');
  }

  // The row is saved; email runs after the response. A failure only logs and leaves emailed = 0 (releases.sh --unsent).
  if (env.RESEND_API_KEY) context.waitUntil(sendEmails(env, row));
  return thanks();
}

export const onRequest = () => Response.json({ ok: false, error: 'Use POST.' }, { status: 405, headers: { Allow: 'POST' } });

async function sendEmails(env, r) {
  const send = (msg) => fetch(env.RESEND_API_URL || RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM || 'AIMUG <speakers@aimug.org>', ...msg }),
  }).then(async (res) => { if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`); });

  const pitch = r.kind === 'pitch';
  const about = pitch ? [
    'Thanks for pitching a talk to AIMUG. We read every pitch and will reply by email to set a date. Here is what you sent and the release you signed.',
    '',
    `Talk: ${r.talk_title}`,
    `Format: ${FORMATS[r.format]}`,
    `Preferred meetup: ${r.preferred_event === 'any' ? 'Any month' : r.preferred_event}`,
    'Abstract:',
    r.abstract,
    '',
    `Name: ${r.name}`,
    `Email: ${r.email}`,
    `Company: ${r.company || '-'}`,
    `Title: ${r.title || '-'}`,
    `Links: ${r.links || '-'}`,
    `OK to tag you on LinkedIn and X: ${r.tag_ok ? 'yes' : 'no'}`,
  ] : [
    'Thanks for signing the AIMUG speaker release for your talk. Here is a copy for your records.',
    '',
    `Talk: ${r.talk_title}`,
    `Meetup: ${r.preferred_event}`,
    `Name: ${r.name}`,
    `Email: ${r.email}`,
  ];
  const jobs = [send({
    to: [r.email],
    reply_to: env.REPLY_TO || 'speakers@aimug.org', // MAIL_FROM is a send-only subdomain, so replies (takedowns) need a real inbox
    subject: pitch ? 'Your AIMUG speaker pitch and release' : 'Your AIMUG speaker release',
    text: [
      `Hi ${r.name},`,
      '',
      ...about,
      '',
      'Speaker release',
      RELEASE_TEXT,
      '',
      `Signed by: ${r.signature_name}`,
      ...(r.minor ? [`Parent or guardian: ${r.guardian_name}`] : []),
      `Agreed: yes, ${r.created_at}`,
      `Release version: ${r.release_version} (SHA-256 ${r.release_sha256})`,
      `Record id: ${r.id}`,
      '',
      'To take a recording down, reply to this email or write to speakers@aimug.org.',
    ].join('\n'),
  })];
  if (env.NOTIFY_TO) {
    const what = pitch ? `pitched "${r.talk_title}" (${FORMATS[r.format]}) for ${r.preferred_event}` : `signed the release for "${r.talk_title}" (${r.preferred_event})`;
    jobs.push(send({
      to: env.NOTIFY_TO.split(',').map((s) => s.trim()),
      reply_to: r.email,
      subject: `${pitch ? 'New speaker pitch' : 'Speaker release signed'}: ${r.talk_title}`.replace(/\s+/g, ' '),
      text: `${r.name} <${r.email}> ${what}.\nRelease ${r.release_version} signed${r.minor ? ' with a guardian' : ''}.\nRecord id: ${r.id}`,
    }));
  }
  const results = await Promise.allSettled(jobs);
  for (const res of results) if (res.status === 'rejected') console.error('speak: email failed', res.reason);
  if (results.every((res) => res.status === 'fulfilled')) {
    await env.DB.prepare('UPDATE submissions SET emailed = 1 WHERE id = ?').bind(r.id).run().catch((e) => console.error('speak: could not mark emailed', e));
  }
}

// For no-JS form posts that fail server-side checks. Messages are fixed strings, never user input.
const errorPage = (msg, back) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Not sent | AIMUG</title></head>
<body style="background:#06182b;color:#eef3f7;font:18px/1.5 sans-serif;padding:24px;max-width:640px;margin:auto"><h1>That wasn't sent</h1><p>${msg}</p><p>Use your browser's Back button to return to the form with your answers, or <a style="color:#f5b81c" href="${back}">start over</a>.</p></body></html>`;
