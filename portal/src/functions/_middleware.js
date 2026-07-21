/* ============================================================================
 * functions/_middleware.js — the REAL front door for the Koocester Academy
 * ----------------------------------------------------------------------------
 * Runs on EVERY request to staffacademy.koocester.com before any file is served.
 *
 * Until this file existed, koo-auth-guard.js was the only gate. That guard runs
 * in the browser, AFTER the deck has already been delivered, and it fails open
 * by design. So `curl https://staffacademy.koocester.com/capital-growth-training`
 * returned the full 24-slide C-Suite deck to anybody, and deleting an ex-staff
 * account revoked nothing, because the decks never checked who was asking.
 *
 * This middleware moves the check to the edge, before delivery:
 *   - no session cookie          -> 302 to login (HTML) or 401 (assets). No body.
 *   - cookie present but bad     -> same treatment
 *   - cookie valid per Supabase  -> next(), the file is served normally
 *
 * WHY IT ASKS SUPABASE INSTEAD OF VERIFYING THE JWT LOCALLY
 * Local signature checks are faster, but a signed token stays valid until it
 * expires even after you delete the account. Asking Supabase makes deletion take
 * effect within the cache window (2 minutes), which is the whole point of the
 * exercise: Sujin, Afiq and Fadz lose access when their accounts go.
 *
 * OUTAGE BEHAVIOUR — deliberately chosen, do not "simplify" this away.
 * A token that Supabase has already validated is remembered for 10 minutes. If
 * Supabase is unreachable, we keep honouring those remembered tokens (so people
 * mid-session keep working) but we refuse anything we have never seen. Failing
 * fully open would restore the hole; failing fully closed would lock out all 35
 * staff over a blip. This is the middle, and it is not forgeable: an unverified
 * token never gets in, outage or not.
 * ==========================================================================*/

const SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
const SUPABASE_ANON_KEY = '<SUPABASE_ANON_KEY>';

const COOKIE_NAME = 'koo_session';
const LOGIN_PATH = '/login.html';

const FRESH_MS = 120 * 1000;        // trust a validated token this long with no call
const GRACE_MS = 600 * 1000;        // ...and this long if Supabase is unreachable

/* Reachable with no session. Keep this list short and boring — everything on it
 * is a hole. The door must not lock with the key inside, so login and the one
 * image it renders stay open. /dash, /hr-feed and /mgmt-deck are NOT holes: they
 * do their own Bearer-token check server-side and fail closed, and they are
 * called by fetch() with an Authorization header rather than a cookie, so
 * redirecting them here would break them — the caller would follow the 302 and
 * quietly render the login page inside the iframe instead of the content. */
const PUBLIC_PATHS = new Set([
  '/login',
  '/login.html',
  '/koocester-logo.png',
  '/favicon.ico',
  '/robots.txt',
  '/dash',
  '/hr-feed',
  '/mgmt-deck',
]);

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  if (PUBLIC_PATHS.has(path)) return next();

  const token = readCookie(request.headers.get('Cookie'), COOKIE_NAME);
  if (!token) return refuse(request, url);

  const ok = await validate(token);
  if (!ok) return refuse(request, url);

  return next();
}

/* ---- refusal ----------------------------------------------------------- */
/* A 302 carries no body, so the deck is never delivered. Assets get a bare 401
 * rather than a redirect, because bouncing an <img> to an HTML login page just
 * produces a broken image and a confusing console. */
function refuse(request, url) {
  if (wantsHtml(request, url)) {
    const target = LOGIN_PATH + '?next=' + encodeURIComponent(nextParam(url.pathname));
    return new Response(null, {
      status: 302,
      headers: {
        Location: target,
        'Cache-Control': 'no-store',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }
  return new Response(null, {
    status: 401,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function wantsHtml(request, url) {
  const accept = request.headers.get('Accept') || '';
  if (accept.includes('text/html')) return true;
  const last = url.pathname.split('/').pop() || '';
  return last === '' || last.endsWith('.html') || !last.includes('.');
}

/* login.html's safeNext() only accepts a relative *.html path with no leading
 * slash and no traversal. Pages serves decks extensionless (/capital-growth-
 * training), so re-add .html or the round trip silently drops the destination
 * and everyone lands on portal.html instead of the page they asked for. */
function nextParam(pathname) {
  let p = decodeURIComponent(pathname).replace(/^\/+/, '');
  if (!p) return 'portal.html';
  if (!p.toLowerCase().endsWith('.html')) p += '.html';
  return p;
}

/* ---- validation -------------------------------------------------------- */
async function validate(token) {
  // Structurally broken or already-expired tokens are rejected without spending
  // a network call. This is a cheap filter, not the security boundary.
  const exp = expiryOf(token);
  if (exp === null) return false;
  if (Date.now() >= exp) return false;

  const key = await cacheKeyFor(token);
  const cache = caches.default;

  const hit = await cache.match(key);
  if (hit) {
    const stamped = Number(hit.headers.get('X-Validated-At') || 0);
    const age = Date.now() - stamped;
    if (age < FRESH_MS) return true;          // recently confirmed, good enough

    const live = await askSupabase(token);
    if (live === true) { await remember(cache, key); return true; }
    if (live === false) { await cache.delete(key); return false; }   // revoked
    return age < GRACE_MS;                    // Supabase unreachable: ride it out
  }

  const live = await askSupabase(token);
  if (live === true) { await remember(cache, key); return true; }
  return false;                               // never seen it: refuse, outage or not
}

/* true = valid, false = rejected by Supabase, null = could not reach Supabase.
 * The three-way return is what lets an outage be told apart from a revocation. */
async function askSupabase(token) {
  try {
    const res = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: 'Bearer ' + token,
      },
    });
    if (res.status === 200) return true;
    if (res.status === 401 || res.status === 403) return false;
    return null;                              // 5xx / rate limit / anything odd
  } catch (e) {
    return null;                              // network failure
  }
}

function remember(cache, key) {
  return cache.put(key, new Response('ok', {
    headers: {
      'Cache-Control': 'max-age=' + Math.floor(GRACE_MS / 1000),
      'X-Validated-At': String(Date.now()),
    },
  }));
}

/* The token itself never becomes a cache key — only its SHA-256. */
async function cacheKeyFor(token) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
  const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
  return new Request('https://koo-session.invalid/' + hex);
}

/* ---- small helpers ------------------------------------------------------ */
function expiryOf(jwt) {
  try {
    const parts = String(jwt).split('.');
    if (parts.length !== 3) return null;
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    const exp = JSON.parse(json).exp;
    return typeof exp === 'number' ? exp * 1000 : null;
  } catch (e) {
    return null;
  }
}

function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i === -1) continue;
    if (part.slice(0, i).trim() === name) return part.slice(i + 1).trim();
  }
  return null;
}
