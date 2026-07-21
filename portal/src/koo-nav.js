/* ============================================================================
 * koo-nav.js — the persistent top navigation bar for the Koocester staff site
 * ----------------------------------------------------------------------------
 * Drop into any PAGE with a plain script tag, before the closing </head>:
 *     <script src="koo-nav.js?v=2026072106"></script>
 *
 * ALWAYS include the ?v= and BUMP IT whenever you edit this file. deploy.sh
 * refuses to upload without it. Without a cache-buster a browser keeps running
 * the copy it already has, and a shipped fix looks like it never shipped —
 * that is exactly how Iman sat locked out of the weekly report for hours on
 * 2026-07-20 while the corrected guard was live on the server the whole time.
 *
 * WHY IT EXISTS
 * Staff had to return to the portal to reach anything. One bar, on every page,
 * carrying every live destination the portal offers, in three tiers: everyday
 * for all staff, then Operate for managers, then Admin for the founder.
 *
 * NOT ON TRAINING DECKS. Decks are keyboard-driven full-bleed slides; a bar on
 * top steals a row of the slide and competes with the deck's own chrome. The
 * component also refuses to render on a page that looks like a deck, so an
 * accidental include cannot damage one.
 *
 * WHO SEES WHAT
 * Management links resolve from `public.profiles.is_manager` / `.is_admin` —
 * the SAME columns portal.html, functions/dash.js and koo-manager-guard.js
 * read. There is no second list here on purpose: access is one row edit in the
 * Permissions page, and this bar inherits it. See [[single-source-manager-access]].
 * Management links start hidden and only appear once the profile confirms them,
 * so a non-manager never sees a flash of links they cannot open.
 *
 * This is NAVIGATION, not a gate. Hiding a link protects nobody — every
 * destination runs its own guard. Do not treat this file as a security control.
 * ==========================================================================*/
(function () {
  'use strict';

  if (window.__KOO_NAV__) { return; }        // never inject twice
  window.__KOO_NAV__ = true;

  var SUPABASE_URL = 'https://lfppmsppvqtjyusfrlkf.supabase.co';
  var SUPABASE_ANON_KEY = '<SUPABASE_ANON_KEY>';

  var NAV_H = 44;   // keep in sync with --koo-nav-h below

  /* ---- where am I, and how do I get back to the site root? --------------
   * Only three depths exist on this site: root, /admin/ + /manager/, and
   * /manager/weekly/ + /manager/townhall/. Deriving the depth by counting
   * path segments breaks on file:// previews (the whole disk path is in
   * there), so match the known folders instead. Works on both. */
  var rawPath = (window.location.pathname || '').toLowerCase();

  var depth = 0;
  if (/\/manager\/(weekly|townhall)\/[^\/]*$/.test(rawPath)) { depth = 2; }
  else if (/\/(manager|admin)\/[^\/]*$/.test(rawPath)) { depth = 1; }

  var ROOT = new Array(depth + 1).join('../');

  /* Current page, normalised to a root-relative key without its extension, so
   * `/academy`, `/academy.html` and `/manager/townhall/` all compare cleanly.
   * Cloudflare Pages serves extensionless URLs, so both forms are real. */
  var cur = rawPath.replace(/^.*?\/(?=(?:manager|admin)\/)/, '');   // trim file:// prefix
  cur = cur.replace(/^\//, '');
  if (cur === '' || /\/$/.test(cur)) { cur += 'index'; }
  cur = cur.split('/').slice(-(depth + 1)).join('/').replace(/\.html$/, '');

  /* ---- the bar ----------------------------------------------------------
   * `access` mirrors portal.html: 'all' | 'manager' | 'admin', and the three
   * tiers render in that order separated by a hairline. Add a destination here
   * and it appears on every page at once — that is the whole point of one
   * shared component. */
  var ITEMS = [
    /* everyday — mirrors the live all-staff tiles on portal.html */
    { label: 'Academy',        file: 'academy.html',                access: 'all' },
    { label: 'Leaderboard',    file: 'leaderboard.html',            access: 'all' },
    { label: 'People',         file: 'people.html',                 access: 'all' },
    { label: 'Town Hall',      file: 'manager/townhall/index.html', access: 'all' },
    { label: 'Policies',       file: 'policies.html',               access: 'all' },
    { label: 'Media Kits',     file: 'media-kit-slides.html',       access: 'all' },
    { label: 'Sales Kits',     file: 'sales-kits.html',             access: 'all' },
    { label: 'Brand Assets',   file: 'brand-assets.html',           access: 'all' },
    { label: 'Growth Academy', file: 'growth-academy.html',         access: 'all' },
    /* operate — profiles.is_manager */
    { label: 'Weekly',         file: 'manager/weekly/index.html',   access: 'manager' },
    { label: 'Dashboard',      file: 'command.html',                access: 'manager' },
    { label: 'Accountability', file: 'accountability.html',         access: 'manager' },
    /* admin — profiles.is_admin */
    { label: 'Permissions',    file: 'admin/permissions.html',      access: 'admin' },
    { label: 'Runbook',        file: 'admin/runbook.html',          access: 'admin' },
    { label: 'Completions',    file: 'completions.html',            access: 'admin' }
  ];

  // Labels stay long-form. "Comp." or "Acct." saves a few pixels and costs
  // someone a guess at what they are clicking.
  var TIER = { all: '', manager: ' koo-mgr', admin: ' koo-adm' };
  var HOME = 'portal.html';

  /* ---- refuse to render on a slide deck ---------------------------------
   * Belt and braces. The include list deliberately excludes decks, but a
   * copy-pasted <head> should not be able to put a bar across a slide. */
  function looksLikeADeck() {
    if (document.querySelector('.slide, .slides, [data-slide]')) { return true; }
    return /-training\.html$|-slides\.html$|-training$|-slides$/.test(rawPath);
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function styles() {
    var css =
      ':root{--koo-nav-h:' + NAV_H + 'px}' +
      /* overflow-anchor:none is not cosmetic. The bar adds padding-top to body;
         if that lands after first layout, Chrome's scroll anchoring "helpfully"
         scrolls down by exactly the padding to keep content still, so every page
         opened 44px in with its own top row tucked under the bar. That is the
         "nav and the screen overlapping" report. The padding is now injected
         before body layout (see the call site) and anchoring is off as well,
         because one fix depending on script timing is not a fix. */
      'html{overflow-anchor:none}' +
      'body{padding-top:var(--koo-nav-h);overflow-anchor:none}' +
      '#koo-nav{position:fixed;top:0;left:0;right:0;height:var(--koo-nav-h);z-index:2147483000;' +
        'display:flex;align-items:center;gap:clamp(2px,1vw,6px);' +
        'padding:0 clamp(10px,2vw,18px);background:#0a0a0a;' +
        "font-family:'Helvetica Neue',Helvetica,Inter,'SF Pro Text',Arial,sans-serif;" +
        'box-shadow:0 1px 0 rgba(255,255,255,.08);overflow-x:auto;overflow-y:hidden;' +
        '-webkit-overflow-scrolling:touch;scrollbar-width:none}' +
      '#koo-nav::-webkit-scrollbar{display:none}' +
      /* home lockup */
      '#koo-nav .koo-home{display:inline-flex;align-items:center;gap:9px;flex:none;' +
        'text-decoration:none;margin-right:clamp(6px,1.4vw,12px);padding:6px 2px;' +
        "font-family:'SF Mono',ui-monospace,'JetBrains Mono',Menlo,monospace;" +
        'font-size:10.5px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;' +
        'color:#fff;white-space:nowrap;transition:opacity .15s}' +
      '#koo-nav .koo-home:hover{opacity:.72}' +
      '#koo-nav .koo-home .koo-dot{width:7px;height:7px;border-radius:50%;background:#C02025;flex:none}' +
      '#koo-nav .koo-home.koo-here{color:#8a8a8a;pointer-events:none}' +
      '#koo-nav .koo-rule{width:1px;height:16px;background:rgba(255,255,255,.16);flex:none;' +
        'margin-right:clamp(4px,1.4vw,10px)}' +
      /* links */
      '#koo-nav a.koo-link{position:relative;flex:none;text-decoration:none;white-space:nowrap;' +
        /* tight, because the founder sees all 15 links and the bar has to fit
           a laptop viewport without scrolling. Non-managers see 9. */
        'color:rgba(255,255,255,.62);font-size:12px;font-weight:600;letter-spacing:.01em;' +
        'padding:6px 7px;border-radius:7px;transition:color .15s,background .15s}' +
      '#koo-nav a.koo-link:hover{color:#fff;background:rgba(255,255,255,.09)}' +
      '#koo-nav a.koo-link.koo-here{color:#fff;font-weight:800}' +
      '#koo-nav a.koo-link.koo-here::after{content:"";position:absolute;left:10px;right:10px;' +
        'bottom:-11px;height:2px;border-radius:2px;background:#C02025}' +
      /* gated tiers stay out of the DOM flow until the profile confirms them.
         The tier's leading divider carries the same class, so it appears and
         disappears with the group instead of leaving a stray hairline. */
      '#koo-nav .koo-mgr,#koo-nav .koo-adm{display:none}' +
      '#koo-nav.koo-is-mgr a.koo-mgr{display:inline-block}' +
      '#koo-nav.koo-is-mgr span.koo-mgr{display:block}' +
      '#koo-nav.koo-is-adm a.koo-adm{display:inline-block}' +
      '#koo-nav.koo-is-adm span.koo-adm{display:block}' +
      '@media (max-width:560px){' +
        ':root{--koo-nav-h:40px}' +
        '#koo-nav .koo-home span.koo-word{display:none}' +
        '#koo-nav a.koo-link{font-size:12px;padding:6px 8px}}' +
      '@media print{#koo-nav{display:none}body{padding-top:0}}';

    var el = document.createElement('style');
    el.id = 'koo-nav-style';
    el.textContent = css;
    (document.head || document.documentElement).appendChild(el);
  }

  function build() {
    var nav = document.createElement('nav');
    nav.id = 'koo-nav';
    nav.setAttribute('aria-label', 'Koocester staff navigation');

    var atHome = (cur === 'portal' || cur === 'index');
    var html =
      '<a class="koo-home' + (atHome ? ' koo-here' : '') + '" href="' + ROOT + HOME + '">' +
        '<span class="koo-dot"></span><span class="koo-word">Staff Portal</span></a>' +
      '<span class="koo-rule"></span>';

    var prevAccess = 'all';
    for (var i = 0; i < ITEMS.length; i++) {
      var it = ITEMS[i];
      var tier = TIER[it.access] || '';
      // hairline between tiers, so 15 links read as three groups, not a wall
      if (it.access !== prevAccess) {
        html += '<span class="koo-rule' + tier + '"></span>';
        prevAccess = it.access;
      }
      var key = it.file.replace(/\.html$/, '');
      var here = (cur === key);
      html += '<a class="koo-link' + tier + (here ? ' koo-here' : '') +
              '" href="' + ROOT + it.file + '"' +
              (here ? ' aria-current="page"' : '') + '>' + esc(it.label) + '</a>';
    }

    nav.innerHTML = html;
    document.body.insertBefore(nav, document.body.firstChild);
    return nav;
  }

  /* ---- stop the bar covering the page's own sticky header ---------------
   * These pages were each built with their own `position:sticky;top:0` header
   * (and command.html with a `position:fixed;inset:0` iframe). Both pin to the
   * viewport top and would slide underneath a fixed bar. Rather than editing
   * twenty pages by hand — which is how a "one shared component" quietly turns
   * back into twenty copies — push anything already pinned at top:0 down by the
   * bar's height. Direct children of <body> only: every header on this site is
   * one, and a whole-document computed-style scan on a 150KB page is not free.
   * Run twice, because some pages render their header from script. */
  /* ---- pin each page's OWN header directly beneath the bar ---------------
   * Every page was built with its own header row (logo + page pill + back to
   * portal), and only portal.html made it sticky. On the rest it is static, so
   * it scrolls straight under the fixed bar; on the Academy `.htop` is absolute
   * at top:26px, which puts it 26px under the bar at rest and behind it the
   * moment you scroll. That is the "still not proper" report.
   *
   * So the page header now pins under the bar on EVERY page. One rule, one
   * behaviour, and the logo and back-to-portal are always reachable. */
  var PAGE_HEADER = 'body > header.top, body > .top, body > .bar, body > header.hero > .htop';

  function pinPageHeader() {
    var el = document.querySelector(PAGE_HEADER);
    if (!el || el.getAttribute('data-koo-pinned') === '1') { return; }
    var cs = window.getComputedStyle(el);
    var transparent = !cs.backgroundColor ||
                      cs.backgroundColor === 'transparent' ||
                      /rgba\(0,\s*0,\s*0,\s*0\)/.test(cs.backgroundColor);

    if (cs.position === 'absolute') {
      // The Academy's .htop overlays a full-bleed hero. Sticky would drop it
      // into flow and shove the centred hero content down, so keep it an
      // overlay and just pin it to the viewport under the bar instead.
      el.style.position = 'fixed';
      el.style.left = '0';
      el.style.right = '0';
    } else {
      el.style.position = 'sticky';
    }
    el.style.top = 'var(--koo-nav-h)';
    el.style.zIndex = '2147482000';          // beneath the bar, above the page
    if (transparent) {
      // A see-through header stops working the moment content scrolls behind it.
      el.style.background = 'rgba(255,255,255,.92)';
      el.style.backdropFilter = 'blur(12px)';
      el.style.webkitBackdropFilter = 'blur(12px)';
    }
    el.setAttribute('data-koo-pinned', '1');
  }

  function offsetPinned() {
    var kids = document.body.children;
    for (var i = 0; i < kids.length; i++) {
      var el = kids[i];
      if (el.id === 'koo-nav' || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') { continue; }
      if (el.getAttribute('data-koo-offset') === '1') { continue; }
      var cs = window.getComputedStyle(el);
      if ((cs.position === 'sticky' || cs.position === 'fixed') && cs.top === '0px') {
        el.style.top = 'var(--koo-nav-h)';
        el.setAttribute('data-koo-offset', '1');
      }
    }
  }

  /* ---- who is this, and do they get the management links? --------------- */
  function resolveManager(nav) {
    // file:// preview: no session exists. Show everything so decks and pages
    // are reviewable locally, exactly as the other guards do.
    if (window.location.protocol === 'file:') {
      nav.classList.add('koo-is-mgr');
      nav.classList.add('koo-is-adm');
      return;
    }

    import('https://esm.sh/@supabase/supabase-js@2')
      .then(function (mod) {
        if (typeof mod.createClient !== 'function') { return; }
        var supabase = mod.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

        return supabase.auth.getSession().then(function (res) {
          var session = res && res.data ? res.data.session : null;
          if (!session) { return; }   // logged out: the page's own guard bounces them

          // supabase-js does NOT throw on a missing column — it RESOLVES with
          // {data:null, error:{code:'42703'}} and HTTP 400. A .catch() never
          // fires. Drive the retry off r.error or this silently reads null and
          // every manager loses their links. See [[single-source-manager-access]].
          return supabase.from('profiles')
            .select('is_admin, is_manager').eq('id', session.user.id).single()
            .then(function (r) {
              if (r.error) {
                return supabase.from('profiles')
                  .select('is_admin').eq('id', session.user.id).single();
              }
              return r;
            })
            .then(function (r) {
              var p = r && r.data;
              if (!p) { return; }
              // is_admin implies management. Same precedence portal.html uses,
              // so the bar and the tiles can never disagree about who is who.
              var adm = (p.is_admin === true);
              var mgr = adm || (typeof p.is_manager === 'boolean' && p.is_manager);
              if (mgr) { nav.classList.add('koo-is-mgr'); }
              if (adm) { nav.classList.add('koo-is-adm'); }
            });
        });
      })
      .catch(function (err) {
        // Network / CDN failure. Fail CLOSED on the management links only: the
        // all-staff bar still renders, a manager just misses two shortcuts they
        // can still reach from the portal. Nobody is trapped, nobody is shown
        // a link that bounces them.
        console.warn('[koo-nav] Could not resolve management access:', err);
      });
  }

  /* The stylesheet goes in NOW, not at DOMContentLoaded. This script is loaded
     from <head>, so injecting here puts body's padding-top in place before the
     body is ever laid out. Adding it later makes scroll anchoring compensate by
     scrolling down exactly that much, which parked every page 44px in with its
     own header hidden behind the bar. The filename check is enough to skip decks
     at this point; the DOM check below still runs before anything is rendered. */
  if (!/-training\.html$|-slides\.html$|-training$|-slides$/.test(rawPath)) { styles(); }

  function start() {
    if (looksLikeADeck()) {
      // A deck that slipped through the filename check: drop the stylesheet too,
      // or it would leave a 44px gap at the top of a slide with no bar in it.
      var s = document.getElementById('koo-nav-style');
      if (s && s.parentNode) s.parentNode.removeChild(s);
      return;
    }
    if (!document.getElementById('koo-nav-style')) { styles(); }
    var nav = build();
    pinPageHeader();
    offsetPinned();
    // Some pages render their header from script, so run both again once the
    // page has settled. Both are idempotent via their data- attributes.
    setTimeout(function () { pinPageHeader(); offsetPinned(); }, 700);
    resolveManager(nav);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
