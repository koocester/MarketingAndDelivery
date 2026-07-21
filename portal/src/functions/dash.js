/* ============================================================================
 * functions/dash.js — HARD-GATED proxy for the Command Dashboard
 * ----------------------------------------------------------------------------
 * Served at  /dash  on the portal (staffacademy.koocester.com).
 * Fetches a live n8n dashboard feed server-side (injecting its Basic-Auth login)
 * and returns the HTML — but scoped to WHO is asking:
 *   - the founder sees the full Command cockpit (all tabs, all financials)
 *   - every other manager sees ONLY their department feed (growth/finance/...)
 *   - everyone else is refused
 *
 * This is the REAL security boundary for the dashboard's financials:
 *   - verifies the caller's Supabase access token (Authorization: Bearer <jwt>)
 *   - loads their profile role and maps it to exactly one feed (feedFor)
 *   - fails CLOSED (403) on any missing/invalid token, unmapped role, or error
 * Each feed's n8n Basic-Auth credential lives here server-side and is never sent
 * to the browser. Everything else in the portal is a soft (client-side) gate;
 * this endpoint is the hard one, so it must stay fail-closed.
 * ==========================================================================*/

const SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
const SUPABASE_ANON_KEY = '<SUPABASE_ANON_KEY>';
// n8n dashboard base. Each department feed has its OWN Basic-Auth login (the
// role's mantra) and the n8n Build node prunes financials + tabs per role, so a
// department manager only ever sees their own view. All creds stay server-side
// and are never sent to the browser.
const N8N_BASE = 'https://koocester.app.n8n.cloud/webhook/';
const FEEDS = {
  command: { user: 'hakim',   pass: '<REDACTED_N8N_BASIC_AUTH>'   }, // founder — ALL tabs
  growth:  { user: 'mike',    pass: '<REDACTED_N8N_BASIC_AUTH>' }, // Growth + Team/Ops
  finance: { user: 'finance', pass: '<REDACTED_N8N_BASIC_AUTH>'  }, // Finance only
  sales:   { user: 'sales',   pass: '<REDACTED_N8N_BASIC_AUTH>' }, // Sales only
  hr:      { user: 'hr',      pass: '<REDACTED_N8N_BASIC_AUTH>'   }, // HR only
  tech:    { user: 'tech',    pass: '<REDACTED_N8N_BASIC_AUTH>' }, // Tech only
};

// The founder (and only the founder) sees the full Command cockpit.
// Hakim signs in to the portal as ceo@koocester.com, not the gmail address.
const FULL_ACCESS_EMAILS = ['koocester@gmail.com', 'ceo@koocester.com'];

// Management, named person by person, each routed to the ONE feed they may see.
// MUST MIRROR MANAGER_EMAILS in portal.html and mgmt-deck.js: the portal shows
// these people the Command Dashboard tile, so anyone missing here gets a tile
// that 403s. Their job titles ("Producer", "Copywriter", "Sales", "Events") are
// shared with their teams, so they cannot be routed by role without admitting a
// whole team — routing Sales by title would let every sales rep in, when only
// Cheryl is meant to have it.
// Source: members of the "Manager Updates" Lark group, read 2026-07-20, plus
// Cheryl for Sales. Emails are the HR base Work Email (the portal sign-in key).
const EMAIL_FEEDS = {
  'mike@koocester.com': 'growth',         // Head of Growth
  'thaddeus@koocester.com': 'growth',     // Producer lead
  'ratnasari@koocester.com': 'growth',    // Copywriter lead
  'imanarifin@koocester.com': 'growth',   // Head Editor
  'tpradian@koocester.com': 'growth',     // Social Media lead
  'shahrukh@koocester.com': 'growth',     // Strategy
  'rina@koocester.com': 'sales',          // Customer Success — Hakim 2026-07-20: sales, not growth
  'zainab@koocester.com': 'growth',       // Events lead
  'finance@koocester.com': 'finance',     // Mishkat — the address her PORTAL account uses
  'taninmishkat@koocester.com': 'finance',// Mishkat, personal address (no portal account yet)
  'bhavani@koocester.com': 'hr',          // HR
  'faiz@koocester.com': 'tech',           // Tech
  'cheryl@koocester.com': 'sales',        // Sales — the ONLY sales access
};

// Map a signed-in user to the ONE feed they may see. Founder -> full 'command';
// every other manager -> only their department; anything unrecognised -> null
// -> 403 (fail closed). Role strings are matched loosely so small label
// variations ("Head of Growth", "Finance Lead", ...) still route correctly.
function feedFor(role, email) {
  const r = String(role || '').toLowerCase().trim();
  const e = String(email || '').toLowerCase().trim();
  if (r === 'founder' || r === 'ceo' || r === 'owner' || FULL_ACCESS_EMAILS.indexOf(e) !== -1) return 'command';
  if (EMAIL_FEEDS[e]) return EMAIL_FEEDS[e];
  // Named people only, then two management-only titles. There is deliberately
  // NO loose role matching here any more.
  // It used to fall through to r.includes('sales') / 'finance' / 'hr', which
  // meant anyone whose title merely contained the word reached that department
  // feed — every sales rep would have got the Sales dashboard. Sales access is
  // Cheryl alone (2026-07-20), and this endpoint is the real boundary, so the
  // list above is the whole answer. Unknown -> null -> 403. Fail closed.
  if (r === 'head of growth') return 'growth';
  if (r === 'head editor') return 'growth';
  return null;
}

const deny = (msg, code) => new Response(msg || 'Not authorised', {
  status: code || 403,
  headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
});

export async function onRequestGet(context) {
  const { request } = context;

  const auth = request.headers.get('Authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!token) return deny('No session — sign in to the portal first.', 401);

  // 1) Verify the token resolves to a real user
  let user = null;
  try {
    const ur = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token },
    });
    if (!ur.ok) return deny('Invalid or expired session.', 401);
    user = await ur.json();
  } catch (e) { return deny('Could not verify session.', 403); }
  if (!user || !user.id) return deny('Invalid session.', 401);

  // 2) Resolve which ONE feed this user may see.
  //    SOURCE OF TRUTH = profiles.dashboard. The hardcoded map above is only a
  //    fallback for the window before that column exists / is populated.
  //    Fail closed on any error (no feed -> 403).
  let role = '', dashboard = null, sawColumn = false;
  try {
    let pr = await fetch(SUPABASE_URL + '/rest/v1/profiles?select=role,dashboard&id=eq.' + encodeURIComponent(user.id), {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token },
    });
    if (pr.ok) {
      sawColumn = true;
    } else {
      // column not there yet -> retry without it, so this deploys safely either way
      pr = await fetch(SUPABASE_URL + '/rest/v1/profiles?select=role&id=eq.' + encodeURIComponent(user.id), {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token },
      });
    }
    if (pr.ok) {
      const rows = await pr.json();
      const p = Array.isArray(rows) ? rows[0] : null;
      if (p) {
        role = String(p.role || '');
        if (sawColumn && p.dashboard) dashboard = String(p.dashboard).toLowerCase().trim();
      }
    }
  } catch (e) { role = ''; dashboard = null; }

  const feed = dashboard || feedFor(role, user.email);
  if (!feed || !FEEDS[feed]) return deny('This dashboard is for management only.', 403);

  // 3) Proxy that one feed, injecting ITS Basic-Auth login server-side
  try {
    const cred = FEEDS[feed];
    const basic = 'Basic ' + btoa(cred.user + ':' + cred.pass);
    const up = await fetch(N8N_BASE + feed, { headers: { Authorization: basic }, cf: { cacheTtl: 0 } });
    if (!up.ok) return deny('The dashboard service returned ' + up.status + '. Try again in a moment.', 502);
    return new Response(up.body, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-frame-options': 'SAMEORIGIN',
      },
    });
  } catch (e) { return deny('Could not reach the dashboard service.', 502); }
}
