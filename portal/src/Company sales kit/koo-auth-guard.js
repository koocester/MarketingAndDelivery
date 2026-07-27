/* ============================================================================
 * koo-auth-guard.js — Koocester Academy access guard
 * ----------------------------------------------------------------------------
 * Drop into any deck / page with a plain script tag:
 *     <script src="koo-auth-guard.js?v=2026072104"></script>  <!-- ALWAYS ?v=, and BUMP IT when you edit this file -->
 *
 * On load it checks for a Supabase session. No session -> bounce to login.html.
 * Session present -> do nothing, let the page render.
 *
 * Resilient by design: if Supabase can't load, it FAILS OPEN (logs a warning)
 * rather than trapping the user out of their training. This is a soft gate for
 * a private team site, not a hard security boundary.
 * ==========================================================================*/
(function () {
  'use strict';

  var SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcHBtc3BwdnF0anl1c2ZybGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzMzMDAsImV4cCI6MjA5OTUwOTMwMH0.juL94msBxiqlwIhdhraOhxF69MmrohuW4TkY_2J5oGs';
  var LOGIN_PAGE = '../login.html';

  // Guard against redirect loops: never bounce the login page to itself.
  var path = (window.location.pathname || '').toLowerCase();
  if (path.indexOf(LOGIN_PAGE) !== -1) { return; }

  // On file:// previews there is no shared session; skip the gate so decks are reviewable.
  if (window.location.protocol === 'file:') { return; }

  function toLogin() {
    // Preserve where the user was headed so login can (optionally) return them.
    try {
      var here = 'Company sales kit/index.html';
      var next = here ? ('?next=' + encodeURIComponent(here)) : '';
      window.location.replace(LOGIN_PAGE + next);
    } catch (e) {
      window.location.replace(LOGIN_PAGE);
    }
  }

  // Dynamically import the Supabase client (esm.sh). Plain-script friendly:
  // import() returns a promise so no module type is needed on the tag.
  import('https://esm.sh/@supabase/supabase-js@2')
    .then(function (mod) {
      var createClient = mod.createClient;
      if (typeof createClient !== 'function') {
        console.warn('[koo-auth-guard] Supabase createClient unavailable — failing open.');
        return;
      }
      var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return supabase.auth.getSession().then(function (res) {
        var session = res && res.data ? res.data.session : null;
        if (!session) {
          toLogin();
        }
        // Session present: do nothing, let the page render.
      });
    })
    .catch(function (err) {
      // Network / CDN / SDK failure: don't trap the user. Fail open.
      console.warn('[koo-auth-guard] Auth check failed, allowing page to render:', err);
    });
})();
