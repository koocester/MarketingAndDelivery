/* ============================================================================
 * koo-admin-guard.js — founder/admin-only access guard
 * ----------------------------------------------------------------------------
 * Logged out            -> /login.html?next=<page>
 * Logged in, is_admin    -> render
 * Logged in, NOT admin   -> /portal.html
 * Soft gate (same caveat as the manager guard). file:// skips for review.
 * ==========================================================================*/
(function () {
  'use strict';
  var SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcHBtc3BwdnF0anl1c2ZybGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzMzMDAsImV4cCI6MjA5OTUwOTMwMH0.juL94msBxiqlwIhdhraOhxF69MmrohuW4TkY_2J5oGs';

  var path = (window.location.pathname || '').toLowerCase();
  if (path.indexOf('login.html') !== -1) { return; }
  if (window.location.protocol === 'file:') { return; }

  function toLogin() {
    try {
      var rel = (window.location.pathname || '').replace(/^\//, '');
      window.location.replace('/login.html' + (rel ? ('?next=' + encodeURIComponent(rel)) : ''));
    } catch (e) { window.location.replace('/login.html'); }
  }
  function toHub() { window.location.replace('/portal.html'); }

  import('https://esm.sh/@supabase/supabase-js@2')
    .then(function (mod) {
      if (typeof mod.createClient !== 'function') { return; }
      var supabase = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      return supabase.auth.getSession().then(function (res) {
        var session = res && res.data ? res.data.session : null;
        if (!session) { toLogin(); return; }
        return supabase.from('profiles').select('is_admin').eq('id', session.user.id).single()
          .then(function (r) {
            var admin = !!(r && r.data && r.data.is_admin === true);
            if (!admin) { toHub(); }
          })
          .catch(function () { /* fail open */ });
      });
    })
    .catch(function (err) { console.warn('[koo-admin-guard] auth check failed, allowing render:', err); });
})();
