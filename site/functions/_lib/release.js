// The speaker release. /speak/ renders this text and /api/speak hashes it, so the page and the record can't drift.
// Changing the wording? Bump RELEASE_VERSION too: each row keeps the version and hash its speaker agreed to.
export const RELEASE_VERSION = '2026-10-draft-1';

export const RELEASE_TEXT =
  'I give the AI Middleware Users Group (AIMUG) permission to record my talk, including my image, voice and slides; ' +
  'to edit it, including into short clips; and to publish it on YouTube, social media, aimug.org and public-access TV ' +
  '(cable and streaming), without payment. I have the right to share what I presented, including any images, music, ' +
  'demos or material from my employer. I can ask AIMUG to take a recording down at any time.';

export async function sha256Hex(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
