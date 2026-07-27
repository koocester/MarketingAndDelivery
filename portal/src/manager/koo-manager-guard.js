/* ============================================================================
 * koo-manager-guard.js — management-only access guard
 * ----------------------------------------------------------------------------
 * Drop into any management-only deck (weekly report, town hall) with:
 *     <script src="koo-manager-guard.js?v=2026072004"></script>
 *
 * ALWAYS include the ?v= and BUMP IT whenever you edit this file. Without it the
 * browser keeps running the copy it already has, and a deployed fix looks like it
 * never shipped — Iman sat locked out of the weekly report for hours on
 * 2026-07-20 while the corrected file was live on the server the whole time.
 * The academy guards were versioned for this exact reason (commit 9d407a0);
 * this one was missed.
 *
 * Logged out            -> bounce to /login.html?next=<page>
 * Logged in, manager     -> render
 * Logged in, NOT manager -> bounce to /portal.html (back to the hub)
 *
 * SOFT gate: this hides management decks from non-managers in the normal flow,
 * but the file is still fetchable by anyone past the shared site login. Real
 * per-user hardening = Cloudflare Access. Keep sensitive raw data out of the
 * shared-auth project until that lands. Fails OPEN on network/SDK error so a
 * manager is never trapped out.
 * ==========================================================================*/
(function () {
  'use strict';

  var SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcHBtc3BwdnF0anl1c2ZybGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzMzMDAsImV4cCI6MjA5OTUwOTMwMH0.juL94msBxiqlwIhdhraOhxF69MmrohuW4TkY_2J5oGs';

  /* MUST MIRROR portal.html (MANAGER_ROLES + MANAGER_EMAILS), functions/dash.js
   * and functions/mgmt-deck.js. This list had drifted to just founder + head of
   * growth while the portal showed the Weekly Reports tile to all 13 managers,
   * so everyone else was shown the tile and then bounced straight back to the
   * hub. That is what "weekly report kicks out to homepage" was.
   * Most managers cannot be matched by title — "Producer", "Sales", "Copywriter"
   * are shared with their teams — so they are named by email, exactly as the
   * portal does it. */
  var MANAGER_ROLES = ['founder', 'ceo', 'owner', 'head of growth', 'head editor'];
  var MANAGER_EMAILS = [
    'koocester@gmail.com',        // Hakim, founder (legacy address)
    'ceo@koocester.com',          // Hakim, founder
    'mike@koocester.com',         // Mike, Head of Growth
    'thaddeus@koocester.com',     // Thaddeus, Producer lead
    'ratnasari@koocester.com',    // Ratnasari, Copywriter lead
    'imanarifin@koocester.com',   // Iman, Head Editor
    'tpradian@koocester.com',     // Talulla, Social Media lead
    'shahrukh@koocester.com',     // Shahrukh, Strategy
    'rina@koocester.com',         // Rina, Customer Success
    'finance@koocester.com',      // Mishkat, Finance — the address her portal account uses
    'taninmishkat@koocester.com', // Mishkat, personal address (no portal account yet)
    'faiz@koocester.com',         // Faiz, Tech
    'bhavani@koocester.com',      // Bhavani, HR
    'cheryl@koocester.com',       // Cheryl, Sales
    'zainab@koocester.com'        // Zainab, Events lead
  ];

  var path = (window.location.pathname || '').toLowerCase();
  if (path.indexOf('login.html') !== -1) { return; }

  // On file:// previews there is no origin-root; skip the guard so the deck is reviewable.
  if (window.location.protocol === 'file:') { return; }

  /* Both bounces carry a `why` so a locked-out person can just read their
   * address bar and say what it says, instead of us guessing.
   *   why=no-session  -> signed into the site but the Supabase session is gone
   *   why=not-manager -> signed in fine, but not on the management list */
  function toLogin(why) {
    try {
      var rel = (window.location.pathname || '').replace(/^\//, '');   // full site-relative path
      var next = rel ? ('?next=' + encodeURIComponent(rel)) : '?';
      window.location.replace('/login.html' + next + '&why=' + (why || 'no-session'));
    } catch (e) { window.location.replace('/login.html?why=' + (why || 'no-session')); }
  }
  function toHub(why) { window.location.replace('/portal.html?why=' + (why || 'not-manager')); }

  import('https://esm.sh/@supabase/supabase-js@2')
    .then(function (mod) {
      var createClient = mod.createClient;
      if (typeof createClient !== 'function') { return; } // fail open
      var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return supabase.auth.getSession().then(function (res) {
        var session = res && res.data ? res.data.session : null;
        if (!session) { toLogin(); return; }
        // SOURCE OF TRUTH = profiles.is_manager. Falls back to the frozen list
        // below only while that column does not exist yet, so this file is safe
        // to ship before or after the migration.
        // email is selected on purpose: in fallback mode most managers are
        // matched by address, not title. Selecting only role/is_admin silently
        // broke the email list once already.
        // supabase-js does NOT throw on a bad request: selecting a column that
        // does not exist RESOLVES with {data:null, error:{code:'42703'}}. So the
        // retry must be driven by r.error, not by .catch() — a .catch() here
        // never fires, the row comes back null, and the guard silently lets
        // EVERYONE through. That exact mistake shipped once; do not reintroduce it.
        return supabase.from('profiles').select('email, role, is_admin, is_manager').eq('id', session.user.id).single()
          .then(function (r) {
            if (r && r.error) {
              // is_manager not deployed yet -> re-read the columns that do exist
              return supabase.from('profiles').select('email, role, is_admin').eq('id', session.user.id).single();
            }
            return r;
          })
          .then(function (r) {
            var p = (r && r.data) ? r.data : null;
            // Genuinely no profile row (or the read failed twice): fail OPEN so a
            // manager is never trapped out. Rare, and the server-side gates on
            // /dash and /mgmt-deck still fail closed, so nothing sensitive leaks.
            if (!p) { return; }
            var email = String(p.email || session.user.email || '').toLowerCase().trim();
            var role = String(p.role || '').toLowerCase().trim();
            var manager;
            if (typeof p.is_manager === 'boolean') {
              manager = p.is_manager || p.is_admin === true;      // DB decides
            } else {
              manager = p.is_admin === true ||                     // frozen fallback
                MANAGER_EMAILS.indexOf(email) !== -1 ||
                MANAGER_ROLES.indexOf(role) !== -1;
            }
            if (!manager) { toHub('not-manager'); }
          })
          .catch(function () { /* profile read failed: fail open */ });
      });
    })
    .catch(function (err) {
      console.warn('[koo-manager-guard] auth check failed, allowing render:', err);
    });
})();
