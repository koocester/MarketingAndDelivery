/* ============================================================================
 * koo-auth-guard.js — Koocester Academy access guard
 * ----------------------------------------------------------------------------
 * Drop into any deck / page with a plain script tag:
 *     <script src="koo-auth-guard.js?v=2026072104"></script>  <!-- ALWAYS ?v=, and BUMP IT when you edit this file -->
 *
 * Two jobs, in order:
 *   1. SESSION. No Supabase session -> bounce to login.html.
 *   2. CURRICULUM. Signed in, but this deck is not in your assigned curriculum
 *      -> show a "not assigned to you" screen instead of the deck.
 *
 * Step 2 only ever fires for pages the database lists in academy_decks. Pages
 * that are not curriculum decks (Brand Assets, Leaderboard, the Sales Kits)
 * are never gated, so this guard cannot strand a non-training page.
 *
 * Resilient by design: if Supabase can't load, it FAILS OPEN (logs a warning)
 * rather than trapping the user out of their training. This is a soft gate for
 * a private team site, not a hard security boundary. Do not put genuinely
 * confidential material behind it.
 * ==========================================================================*/
(function () {
  'use strict';

  var SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
  var SUPABASE_ANON_KEY = '<SUPABASE_ANON_KEY>';
  var LOGIN_PAGE = 'login.html';

  // Guard against redirect loops: never bounce the login page to itself.
  var path = (window.location.pathname || '').toLowerCase();
  if (path.indexOf(LOGIN_PAGE) !== -1) { return; }

  var here = (window.location.pathname.split('/').pop() || '').toLowerCase();
  // The hub runs its own richer role logic; it must never gate itself.
  var IS_HUB = here === 'academy.html' || here === 'academy-admin.html' || here === '';

  // On file:// previews there is no shared session; skip the gate so decks are reviewable.
  if (window.location.protocol === 'file:') { return; }

  function toLogin() {
    // Preserve where the user was headed so login can (optionally) return them.
    try {
      var next = here ? ('?next=' + encodeURIComponent(here)) : '';
      window.location.replace(LOGIN_PAGE + next);
    } catch (e) {
      window.location.replace(LOGIN_PAGE);
    }
  }

  function writeSessionCookie(token) {
    if (!token) return;
    // 400 days, matching login.html. See the note there for why long is correct:
    // the middleware revalidates with Supabase every request, so cookie lifetime
    // is a convenience setting, not a security one. Re-written on every page load
    // and every token rotation, so an active user's cookie never ages.
    document.cookie = 'koo_session=' + token +
      '; Path=/; Max-Age=' + (60 * 60 * 24 * 400) + '; SameSite=Lax; Secure';
  }

  function clearSessionCookie() {
    document.cookie = 'koo_session=; Path=/; Max-Age=0; SameSite=Lax; Secure';
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---- the "this is not your module" screen ---------------------------- */
  function blockPage(access) {
    var yours = access.roleLabel
      ? ('Your assigned role is <b>' + esc(access.roleLabel) + '</b>.')
      : 'You do not have an Academy role assigned yet.';
    var ask = access.assigned
      ? 'If you need this module for your work, ask your manager to grant it.'
      : 'Ask your manager or Tech to set your role so your curriculum can load.';

    document.documentElement.innerHTML =
      '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>Not in your curriculum · Koocester Academy</title></head>' +
      '<body style="margin:0;background:#fff;color:#111;' +
      'font-family:Helvetica,Arial,sans-serif;display:flex;align-items:center;' +
      'justify-content:center;min-height:100vh;padding:24px;">' +
      '<div style="max-width:520px;text-align:center;">' +
      '<div style="font-weight:700;letter-spacing:.02em;color:#C02025;' +
      'font-size:13px;text-transform:uppercase;margin-bottom:18px;">Koocester Academy</div>' +
      '<h1 style="font-size:28px;line-height:1.25;margin:0 0 14px;font-weight:700;">' +
      'This module is not part of your training</h1>' +
      '<p style="font-size:16px;line-height:1.6;color:#444;margin:0 0 10px;">' + yours + '</p>' +
      '<p style="font-size:16px;line-height:1.6;color:#444;margin:0 0 28px;">' + ask + '</p>' +
      '<a href="academy.html" style="display:inline-block;background:#C02025;color:#fff;' +
      'text-decoration:none;font-weight:600;font-size:15px;padding:13px 26px;border-radius:4px;">' +
      'Go to your curriculum</a>' +
      '</div></body>';
  }

  /* ---- load the shared entitlement resolver on demand ------------------ */
  function loadAccess() {
    if (window.KOO_ACCESS) return Promise.resolve(window.KOO_ACCESS);
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'academy-access.js?v=2026072104';
      s.onload = function () {
        window.KOO_ACCESS ? resolve(window.KOO_ACCESS) : reject(new Error('no KOO_ACCESS'));
      };
      s.onerror = function () { reject(new Error('academy-access.js failed to load')); };
      (document.head || document.documentElement).appendChild(s);
    });
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

      /* Keep the edge cookie in step with the session.
         Supabase rotates the access token about every hour. The cookie that
         functions/_middleware.js reads has to follow, or the next navigation
         after a rotation gets refused and the user is bounced through login for
         no reason. Mirroring on every auth state change keeps that invisible. */
      supabase.auth.onAuthStateChange(function (event, session) {
        if (session && session.access_token) { writeSessionCookie(session.access_token); }
        else { clearSessionCookie(); }
      });

      return supabase.auth.getSession().then(function (res) {
        var session = res && res.data ? res.data.session : null;
        if (!session) { clearSessionCookie(); toLogin(); return; }
        writeSessionCookie(session.access_token);
        if (IS_HUB) return;   // the hub gates itself

        // Signed in. Now check this deck is actually theirs to open.
        return loadAccess()
          .then(function (A) {
            return A.ready.then(function (access) { return { A: A, access: access }; });
          })
          .then(function (r) {
            if (!r.A.can(r.access, here)) blockPage(r.access);
          })
          .catch(function (err) {
            console.warn('[koo-auth-guard] Curriculum check failed, allowing deck:', err);
          });
      });
    })
    .catch(function (err) {
      // Network / CDN / SDK failure: don't trap the user. Fail open.
      console.warn('[koo-auth-guard] Auth check failed, allowing page to render:', err);
    });
})();
