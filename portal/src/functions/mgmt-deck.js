/* ============================================================================
 * functions/mgmt-deck.js — HARD-GATED proxy for the Management Weekly deck
 * ----------------------------------------------------------------------------
 * Served at  /mgmt-deck  on the portal (staffacademy.koocester.com).
 *
 * The deck is built live by n8n workflow t9ZZ7sk9hyWEKNdR and served at
 * /webhook/mgmt-slides behind Basic Auth. Every figure on it is computed at
 * render time, so proxying the webhook means the portal ALWAYS shows the
 * current deck. Nothing is copied, cached or archived here — there is no stale
 * version to go out of date.
 *
 * Same security model as dash.js, and for the same reason: the deck carries
 * company financials (collected MTD, AR, per-client revenue), so the Basic-Auth
 * credential stays server-side and is never sent to the browser.
 *   - verifies the caller's Supabase access token (Authorization: Bearer <jwt>)
 *   - loads their profile and applies the SAME manager test as the portal
 *   - fails CLOSED (403) on any missing/invalid token, unknown role, or error
 *
 * KEEP IN STEP with isManager() in portal.html and feedFor() in dash.js.
 * Anyone shown the tile must pass here, or they get a door that does not open.
 * ==========================================================================*/

const SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
const SUPABASE_ANON_KEY = '<SUPABASE_ANON_KEY>';

const DECK_URL = 'https://koocester.app.n8n.cloud/webhook/mgmt-slides';
const DECK_AUTH = { user: 'hakim', pass: '<REDACTED_N8N_BASIC_AUTH>' };

// Management by title. Mirrors MANAGER_ROLES in portal.html (exact match).
// Deliberately short: no bare function titles like 'sales' or 'finance', which
// are shared with whole teams. Management is named person by person below.
const MANAGER_ROLES = ['founder', 'ceo', 'owner', 'head of growth', 'head editor'];
// MANAGEMENT = the members of the "Manager Updates" Lark group, plus Cheryl for
// Sales. Read from that group on 2026-07-20; emails are the Work Email field on
// the HR base (the portal sign-in join key), not guessed from first names —
// three of them do not follow the firstname@ pattern.
// MUST MIRROR MANAGER_EMAILS in portal.html and EMAIL_FEEDS in dash.js.
const MANAGER_EMAILS = [
  'koocester@gmail.com',        // Hakim, founder (legacy address)
  'ceo@koocester.com',          // Hakim, founder
  'mike@koocester.com',         // Mike, Head of Growth
  'thaddeus@koocester.com',     // Thaddeus, Producer lead
  'ratnasari@koocester.com',    // Ratnasari, Copywriter lead
  'imanarifin@koocester.com',   // Iman, Head Editor
  'tpradian@koocester.com',     // Talulla, Social Media lead
  'shahrukh@koocester.com',     // Shahrukh, Strategy
  'rina@koocester.com',         // Rina, Customer Success
  'finance@koocester.com',      // Mishkat, Finance — the address her PORTAL account uses
  'taninmishkat@koocester.com', // Mishkat, personal address (no portal account yet)
  'faiz@koocester.com',         // Faiz, Tech
  'bhavani@koocester.com',      // Bhavani, HR
  'cheryl@koocester.com',       // Cheryl, Sales — the ONLY sales access
  'zainab@koocester.com',       // Zainab, Events lead
];

function isManager(role, email, isAdmin) {
  if (isAdmin === true) return true;
  const r = String(role || '').toLowerCase().trim();
  const e = String(email || '').toLowerCase().trim();
  if (MANAGER_EMAILS.indexOf(e) !== -1) return true;
  return MANAGER_ROLES.indexOf(r) !== -1;
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

  // 2) Manager test. SOURCE OF TRUTH = profiles.is_manager. The hardcoded list
  //    above is only a fallback for the window before that column exists.
  //    Fail closed: no profile row -> refused.
  let role = '', isAdmin = false, isMgrCol = null;
  try {
    let pr = await fetch(SUPABASE_URL + '/rest/v1/profiles?select=role,is_admin,is_manager&id=eq.' + encodeURIComponent(user.id), {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token },
    });
    let sawColumn = pr.ok;
    if (!pr.ok) {
      // column not there yet -> retry without it, so this deploys safely either way
      pr = await fetch(SUPABASE_URL + '/rest/v1/profiles?select=role,is_admin&id=eq.' + encodeURIComponent(user.id), {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token },
      });
    }
    if (pr.ok) {
      const rows = await pr.json();
      const p = Array.isArray(rows) ? rows[0] : null;
      if (p) {
        role = String(p.role || '');
        isAdmin = p.is_admin === true;
        if (sawColumn && typeof p.is_manager === 'boolean') isMgrCol = p.is_manager;
      }
    }
  } catch (e) { role = ''; isAdmin = false; isMgrCol = null; }

  const allowed = (isMgrCol === null) ? isManager(role, user.email, isAdmin) : (isMgrCol || isAdmin === true);
  if (!allowed) {
    return deny('The management deck is for management only.', 403);
  }

  // 3) Proxy the live deck, injecting its Basic-Auth login server-side
  try {
    const basic = 'Basic ' + btoa(DECK_AUTH.user + ':' + DECK_AUTH.pass);
    const up = await fetch(DECK_URL, { headers: { Authorization: basic }, cf: { cacheTtl: 0 } });
    if (!up.ok) return deny('The deck service returned ' + up.status + '. Try again in a moment.', 502);
    return new Response(up.body, {
      status: 200,
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'x-frame-options': 'SAMEORIGIN',
      },
    });
  } catch (e) { return deny('Could not reach the deck service.', 502); }
}
