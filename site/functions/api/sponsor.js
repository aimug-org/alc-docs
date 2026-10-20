// POST /api/sponsor: store a sponsorship inquiry from /support/ (a person or a company) in D1, then email the organizers.
// Same shape as /api/speak: JSON (fetch) or a plain form post redirected to /support/thanks/, honeypot, fill time, per-IP rate limit.
import { sha256Hex } from '../_lib/release.js';
import { SPONSOR_AS, INTERESTS } from '../_lib/sponsor.js';

const MIN_FILL_MS = 3000; // a person can't fill the form faster than this
const RATE_LIMIT = 3; // inquiries per ip_hash per window
const RATE_WINDOW_MS = 10 * 60 * 1000;
const MAX_BODY = 32 * 1024; // bytes; a full inquiry is well under 8 KB
const TYPES = ['application/json', 'application/x-www-form-urlencoded'];
const RESEND_URL = 'https://api.resend.com/emails'; // env.RESEND_API_URL overrides it, for the local tests only
const INBOX = 'sponsors@aimug.org';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v) => (typeof v === 'string' ? v.trim() : typeof v === 'number' ? String(v) : '');

// The first problem with the inquiry, or '' if it's good.
function problem(f) {
  const len = (v, min, max) => v.length >= min && v.length <= max;
  if (!Object.hasOwn(SPONSOR_AS, f.sponsor_as)) return "Pick who's sponsoring: you or your company.";
  if (!Object.hasOwn(INTERESTS, f.interest)) return "Pick what you'd like to support.";
  if (!len(f.name, 1, 120)) return 'Your name is required (up to 120 characters).';
  if (f.email.length > 254 || !EMAIL.test(f.email)) return 'Enter a valid email address.';
  if (f.sponsor_as === 'company' && !f.company) return 'Company name is required when your company is sponsoring.';
  if (f.company.length > 120) return 'Company should be up to 120 characters.';
  if (f.budget.length > 80) return 'Budget should be up to 80 characters.';
  if (!len(f.message, 10, 2000)) return 'Tell us a little about what you have in mind (10 to 2000 characters).';
  return '';
}

const COLS = ['id', 'created_at', 'sponsor_as', 'interest', 'name', 'email', 'company', 'budget', 'message', 'ip_hash', 'user_agent', 'emailed'];
// Rate limit and insert in one statement, so concurrent posts can't all pass the count before any of them lands.
const INSERT = `INSERT INTO sponsor_inquiries (${COLS.join(', ')}) SELECT ${COLS.map(() => '?').join(', ')}
  WHERE (SELECT COUNT(*) FROM sponsor_inquiries WHERE ip_hash = ? AND created_at > ?) < ${RATE_LIMIT}`;

export async function onRequestPost(context) {
  const { request, env } = context;
  const type = (request.headers.get('Content-Type') || '').split(';')[0].trim().toLowerCase();
  const isJson = type === 'application/json';
  let id;
  const thanks = () => (isJson ? Response.json({ ok: true, id }) : Response.redirect(new URL('/support/thanks/', request.url).href, 303));
  const fail = (status, error) => isJson
    ? Response.json({ ok: false, error }, { status })
    : new Response(errorPage(error), { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });

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

  if (str(raw.website)) return thanks(); // honeypot: look like success, store nothing
  const t = Number(raw.t);
  if (!Number.isFinite(t) || Date.now() - t < MIN_FILL_MS) return fail(400, 'That was fast. Wait a few seconds and send it again.');

  const f = {
    sponsor_as: str(raw.sponsor_as), interest: str(raw.interest), name: str(raw.name), email: str(raw.email),
    company: str(raw.company), budget: str(raw.budget), message: str(raw.message),
  };
  const bad = problem(f);
  if (bad) return fail(400, bad);

  let row;
  try {
    const ip_hash = await sha256Hex(env.IP_SALT + (request.headers.get('CF-Connecting-IP') || ''));
    const since = new Date(Date.now() - RATE_WINDOW_MS).toISOString();
    id = crypto.randomUUID();
    row = {
      ...f, id, created_at: new Date().toISOString(), company: f.company || null, budget: f.budget || null, ip_hash,
      user_agent: (request.headers.get('User-Agent') || '').slice(0, 500) || null,
      emailed: env.RESEND_API_KEY ? 0 : 2, // 0 not sent yet (or failed), 1 sent, 2 no email configured
    };
    const { meta } = await env.DB.prepare(INSERT).bind(...COLS.map((c) => row[c]), ip_hash, since).run();
    if (!meta.changes) return fail(429, 'Too many messages from here in the last few minutes. Try again in 10 minutes.');
  } catch (e) {
    console.error('sponsor: could not store the inquiry', e);
    return fail(500, 'Something broke on our side and nothing was saved. Please try again later.');
  }

  // The row is saved; email runs after the response. A failure only logs and leaves emailed = 0 (scripts/sponsors.sh --unsent).
  if (env.RESEND_API_KEY) context.waitUntil(sendEmails(env, row));
  return thanks();
}

export const onRequest = () => Response.json({ ok: false, error: 'Use POST.' }, { status: 405, headers: { Allow: 'POST' } });

async function sendEmails(env, r) {
  const send = (msg) => fetch(env.RESEND_API_URL || RESEND_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM || `AIMUG <${INBOX}>`, ...msg }),
  }).then(async (res) => { if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`); });

  // The sender's copy carries only the fixed choices, never their free text, so the form can't send arbitrary mail from aimug.org.
  const jobs = [send({
    to: [r.email],
    reply_to: INBOX,
    subject: 'Your note to AIMUG about sponsoring',
    text: [
      `Hi ${r.name},`,
      '',
      `Thanks for offering to sponsor AIMUG. We got your note about: ${INTERESTS[r.interest]}.`,
      `An organizer will reply by email. To add anything, reply to this email or write to ${INBOX}.`,
      '',
      `Record id: ${r.id}`,
    ].join('\n'),
  })];
  const notify = env.SPONSOR_NOTIFY_TO || env.NOTIFY_TO; // SPONSOR_NOTIFY_TO sends sponsor notices somewhere other than speaker pitches
  if (notify) {
    jobs.push(send({
      to: notify.split(',').map((s) => s.trim()),
      reply_to: r.email,
      subject: `Sponsor inquiry: ${r.company || r.name}, ${INTERESTS[r.interest]}`.replace(/\s+/g, ' '),
      text: [
        `Sponsoring as: ${SPONSOR_AS[r.sponsor_as]}`,
        `Wants to support: ${INTERESTS[r.interest]}`,
        `Name: ${r.name}`,
        `Email: ${r.email}`,
        `Company: ${r.company || '-'}`,
        `Budget: ${r.budget || '-'}`,
        '',
        r.message,
        '',
        `Reply to this email to answer them. Record id: ${r.id}`,
      ].join('\n'),
    }));
  }
  const results = await Promise.allSettled(jobs);
  for (const res of results) if (res.status === 'rejected') console.error('sponsor: email failed', res.reason);
  if (results.every((res) => res.status === 'fulfilled')) {
    await env.DB.prepare('UPDATE sponsor_inquiries SET emailed = 1 WHERE id = ?').bind(r.id).run().catch((e) => console.error('sponsor: could not mark emailed', e));
  }
}

// For no-JS form posts that fail server-side checks. Messages are fixed strings, never user input.
const errorPage = (msg) => `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Not sent | AIMUG</title></head>
<body style="background:#06182b;color:#eef3f7;font:18px/1.5 sans-serif;padding:24px;max-width:640px;margin:auto"><h1>That wasn't sent</h1><p>${msg}</p><p>Use your browser's Back button to return to the form with your answers, or write to <a style="color:#f5b81c" href="mailto:${INBOX}">${INBOX}</a>.</p></body></html>`;
