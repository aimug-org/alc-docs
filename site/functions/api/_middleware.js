// Security headers on every /api/* Function response. public/_headers only reaches static assets, not Functions.
export async function onRequest({ next }) {
  const res = await next();
  const out = new Response(res.body, res); // a copy, since some responses (redirects) have immutable headers
  out.headers.set('X-Content-Type-Options', 'nosniff');
  out.headers.set('X-Frame-Options', 'DENY');
  return out;
}
