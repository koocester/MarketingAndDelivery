/* ============================================================================
 * academy-access.js — who is signed in, what role they hold, what they may open
 * ----------------------------------------------------------------------------
 * Single source of truth for Academy entitlement. Loaded by the hub
 * (academy.html) and by koo-auth-guard.js on every deck page.
 *
 * Exposes:
 *     window.KOO_ACCESS.ready  -> Promise<Access>
 *
 * Access = {
 *   email, roleSlug, roleLabel, department,
 *   isAdmin,            // founder, or a named Academy admin
 *   isFounder,          // Hakim alone, from the database's is_founder()
 *   mismatch,           // Lark HR and portal profile disagree on this person
 *   mismatchNote,
 *   decks,              // Set of deck filenames this person may open
 *   assigned,           // false = nobody has assigned this person a role yet
 *   degraded            // true = we could not reach the database
 * }
 *
 * DEGRADED MODE IS DELIBERATE. If Supabase is unreachable we set degraded=true
 * and callers fail OPEN, matching koo-auth-guard's existing stance: a network
 * blip must never lock somebody out of their own training. This makes the gate
 * a routing and focus mechanism, NOT a security boundary. Anything genuinely
 * confidential does not belong in a deck behind this gate.
 * ==========================================================================*/
(function () {
  'use strict';

  var SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
  var SUPABASE_ANON_KEY = '<SUPABASE_ANON_KEY>';

  // A blank, honest default. Never presented to the user as if it were real
  // data: callers check .assigned and .degraded before rendering anything.
  function blank(extra) {
    var a = {
      email: null, fullName: null, roleSlug: null, roleLabel: null, department: null,
      // isFounder defaults to false so every failure path — signed out, no role,
      // database unreachable — fails CLOSED on the founder tools.
      isAdmin: false, canReassign: false, isFounder: false, mismatch: false, mismatchNote: null,
      decks: new Set(), knownDecks: new Set(), assigned: false, degraded: false
    };
    for (var k in (extra || {})) a[k] = extra[k];
    return a;
  }

  function currentDeck() {
    try {
      return (window.location.pathname.split('/').pop() || '').toLowerCase();
    } catch (e) { return ''; }
  }

  var ready = (function () {
    // file:// previews have no shared session. Stay degraded so nothing gates.
    if (window.location.protocol === 'file:') {
      return Promise.resolve(blank({ degraded: true }));
    }

    return import('https://esm.sh/@supabase/supabase-js@2')
      .then(function (mod) {
        if (typeof mod.createClient !== 'function') throw new Error('no createClient');
        var sb = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        return sb.auth.getSession().then(function (res) {
          var session = res && res.data ? res.data.session : null;
          if (!session) return blank();               // not signed in; guard handles the bounce
          var email = (session.user && session.user.email) || null;

          return Promise.all([
            sb.from('academy_me').select('*').maybeSingle(),
            sb.from('academy_my_decks').select('deck,kind'),
            sb.from('academy_decks').select('deck'),
            // Real name. Deriving it from the email prefix turns
            // ceo@koocester.com into "Ceo", which is nobody's name.
            // full_name: deriving it from the email prefix turns
            // ceo@koocester.com into "Ceo", which is nobody's name.
            // can_reassign: set from the Permissions page. It is what gates the
            // role-reassignment tools, NOT is_admin — is_admin also bypasses deck
            // locks, which is a different job.
            sb.from('profiles').select('full_name, can_reassign').eq('id', session.user.id).maybeSingle(),
            // isFounder: Hakim alone. The SAME is_founder() the Permissions page
            // relies on, so there is one definition of "founder" and it lives in
            // the database, not in a list here that can drift. It gates the
            // Academy's founder tools — the role inspector, the dev view and the
            // coverage map — which expose the org's whole role map and every
            // unbuilt module. NOT can_reassign (that is Hakim + Bhavani, and
            // reassigning someone is a different job from reading the org),
            // and NOT is_admin (also true for Tech and the academy admins).
            sb.rpc('is_founder')
          ]).then(function (out) {
            var meRes = out[0], deckRes = out[1], allRes = out[2], profRes = out[3], fndRes = out[4];
            var fullName = (profRes && profRes.data && profRes.data.full_name) || null;
            var canReassign = !!(profRes && profRes.data && profRes.data.can_reassign === true);
            // supabase-js RESOLVES with an error object rather than throwing, so
            // an error here would otherwise read as `undefined` and, negated,
            // could hand the founder tools to everyone. Require an explicit true.
            var isFounder = !(fndRes && fndRes.error) && fndRes && fndRes.data === true;

            // A query error means we do not know. Do not guess: degrade.
            if (meRes.error || deckRes.error || allRes.error) {
              console.warn('[academy-access] lookup failed, failing open:',
                meRes.error || deckRes.error || allRes.error);
              return blank({ email: email, degraded: true });
            }

            var me = meRes.data;
            var decks = new Set((deckRes.data || []).map(function (r) {
              return String(r.deck || '').toLowerCase();
            }));
            // Every page the Academy considers a curriculum deck. Pages absent
            // from this set (Brand Assets, Leaderboard, Sales Kits) are never
            // gated, so the guard cannot strand a non-training page.
            var known = new Set((allRes.data || []).map(function (r) {
              return String(r.deck || '').toLowerCase();
            }));

            if (!me) {
              // Signed in, but nobody has assigned this person a role.
              return blank({ email: email, fullName: fullName, knownDecks: known, assigned: false, canReassign: canReassign, isFounder: isFounder });
            }

            return {
              email: me.email || email,
              // HR base preferred name first ("Hakim"), then the portal
              // profile, then nothing. Never the email prefix.
              fullName: me.full_name || fullName,
              roleSlug: me.role_slug || null,
              roleLabel: me.role_label || null,
              department: me.lark_dept || me.profile_dept || null,
              isAdmin: me.is_admin === true,
              canReassign: canReassign,
              isFounder: isFounder,
              mismatch: me.mismatch === true,
              mismatchNote: me.mismatch_note || null,
              decks: decks,
              knownDecks: known,
              assigned: !!me.role_slug,
              degraded: false
            };
          });
        });
      })
      .catch(function (err) {
        console.warn('[academy-access] unavailable, failing open:', err);
        return blank({ degraded: true });
      });
  })();

  window.KOO_ACCESS = {
    ready: ready,
    currentDeck: currentDeck,
    /* May this person open a given deck?
       Returns true when degraded or admin, so failures never trap anyone. */
    can: function (access, deck) {
      if (!access || access.degraded) return true;
      if (access.isAdmin) return true;
      var d = String(deck || '').toLowerCase();
      // Not a curriculum deck (Brand Assets, Leaderboard, a sales kit): open.
      if (access.knownDecks && access.knownDecks.size && !access.knownDecks.has(d)) return true;
      if (!access.assigned) return false;
      return access.decks.has(d);
    }
  };
})();
