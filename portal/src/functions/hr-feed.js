/* ============================================================================
 * functions/hr-overview.js — HARD-GATED feed for the People & HR Overview
 * ----------------------------------------------------------------------------
 * Served at  /hr-overview  on the portal (staffacademy.koocester.com).
 * Returns the HR dashboard data (headcount, payroll incl. salary, lifecycle) as
 * JSON — but ONLY to the founder or an HR-role user. Everyone else gets 403.
 *
 * This is the REAL security boundary for HR/comp data:
 *   - verifies the caller's Supabase access token (Authorization: Bearer <jwt>)
 *   - loads their profile role; allows founder email OR an HR/People/Talent role
 *   - fails CLOSED (403) on any missing/invalid token, wrong role, or error
 * The salary data is fetched live from the HR base by n8n and proxied here with
 * a server-side Basic-Auth login that is NEVER sent to the browser. Salary is
 * never stored in the portal database and never reaches a non-HR client.
 * ==========================================================================*/

const SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
const SUPABASE_ANON_KEY = '<SUPABASE_ANON_KEY>';

const N8N_FEED = 'https://koocester.app.n8n.cloud/webhook/hr-overview';
// Server-side Basic-Auth for the n8n feed — never sent to the browser.
const FEED_AUTH = { user: 'hroverview', pass: '<REDACTED_N8N_BASIC_AUTH>' };

// The founder always has access. HR staff are recognised by their profile role.
const FULL_ACCESS_EMAILS = ['koocester@gmail.com'];

function allowed(role, email) {
  const r = String(role || '').toLowerCase().trim();
  const e = String(email || '').toLowerCase().trim();
  if (FULL_ACCESS_EMAILS.indexOf(e) !== -1) return true;
  if (r === 'founder' || r === 'ceo' || r === 'owner') return true;
  if (r.includes('hr') || r.includes('people') || r.includes('talent')) return true;
  return false;
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

  // 1) Verify the token resolves to a real user.
  let user = null;
  try {
    const ur = await fetch(SUPABASE_URL + '/auth/v1/user', {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token },
    });
    if (!ur.ok) return deny('Invalid or expired session.', 401);
    user = await ur.json();
  } catch (e) { return deny('Could not verify session.', 403); }
  if (!user || !user.id) return deny('Invalid session.', 401);

  // 2) Founder email OR HR-role only. Fail closed on any error.
  let role = '';
  try {
    const pr = await fetch(SUPABASE_URL + '/rest/v1/profiles?select=role&id=eq.' + encodeURIComponent(user.id), {
      headers: { apikey: SUPABASE_ANON_KEY, Authorization: 'Bearer ' + token },
    });
    if (pr.ok) {
      const rows = await pr.json();
      const p = Array.isArray(rows) ? rows[0] : null;
      role = p ? String(p.role || '') : '';
    }
  } catch (e) { role = ''; }
  if (!allowed(role, user.email)) return deny('This dashboard is for the founder and HR only.', 403);

  // 3) Proxy the live HR feed, injecting its Basic-Auth login server-side.
  try {
    const basic = 'Basic ' + btoa(FEED_AUTH.user + ':' + FEED_AUTH.pass);
    const up = await fetch(N8N_FEED, { headers: { Authorization: basic }, cf: { cacheTtl: 0 } });
    if (!up.ok) return deny('The HR feed returned ' + up.status + '. Try again in a moment.', 502);
    const body = await up.text();
    return new Response(body, {
      status: 200,
      headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
    });
  } catch (e) { return deny('Could not reach the HR feed.', 502); }
}
