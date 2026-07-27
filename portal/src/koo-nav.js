/* ============================================================================
 * koo-nav.js — the persistent top navigation bar for the Koocester staff site
 * ----------------------------------------------------------------------------
 * Drop into any PAGE with a plain script tag, before the closing </head>:
 *     <script src="koo-nav.js?v=2026072304"></script>
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
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmcHBtc3BwdnF0anl1c2ZybGtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM5MzMzMDAsImV4cCI6MjA5OTUwOTMwMH0.juL94msBxiqlwIhdhraOhxF69MmrohuW4TkY_2J5oGs';

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

  /* ---- mobile bottom tab bar --------------------------------------------
   * On a phone the 15-link top strip is unusable, so mobile gets a proper
   * web-app tab bar pinned to the bottom: four primary destinations plus a
   * More sheet that carries everything else, including the gated tiers. At the
   * same breakpoint the top bar is hidden and --koo-nav-h collapses to 0, so
   * the body padding-top and the header-pin offset (both keyed to that var)
   * fall to 0 on their own — the page header sits at the very top where it
   * belongs when nothing is up there, and content clears the bottom bar via a
   * padding-bottom added in the same media query. Primary tabs are easy to
   * swap: they are just the first destinations a phone user reaches for. */
  var ICON = {
    portal:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.7 12 3l9 7.7"/><path d="M5 9.5V21h14V9.5"/></svg>',
    academy:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.5 12 4l10 4.5-10 4.5z"/><path d="M6 10.6V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-5.4"/><path d="M22 8.5V14"/></svg>',
    leaderboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4.5v1A3.5 3.5 0 0 0 8 10.5M17 6h2.5v1A3.5 3.5 0 0 1 16 10.5"/><path d="M12 14v3M8.5 21h7l-1-3.4h-5z"/></svg>',
    people:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.2a3.2 3.2 0 0 1 0 6.1M20.5 20a5.5 5.5 0 0 0-3.7-5.2"/></svg>',
    more:        '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="19" cy="12" r="1.9"/></svg>'
  };
  var BOTTOM = [
    { label: 'Home',        file: 'portal.html',      icon: ICON.portal, home: true },
    { label: 'Academy',     file: 'academy.html',     icon: ICON.academy },
    { label: 'Leaderboard', file: 'leaderboard.html', icon: ICON.leaderboard },
    { label: 'People',      file: 'people.html',      icon: ICON.people }
  ];
  var _sheetEl = null;   // set in buildBottom, styled by resolveManager

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
      /* mobile: hide the top strip entirely and show a bottom tab bar.
         Bottom-nav elements are display:none by default (desktop) and only
         switch on below the breakpoint. */
      '#koo-botnav{display:none}#koo-moresheet{display:none}' +
      '@media (max-width:640px){' +
        ':root{--koo-nav-h:0px}' +
        '#koo-nav{display:none!important}' +
        'body{padding-top:0;padding-bottom:calc(58px + env(safe-area-inset-bottom,0px))}' +
        '#koo-botnav{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:2147483000;' +
          'height:calc(58px + env(safe-area-inset-bottom,0px));padding-bottom:env(safe-area-inset-bottom,0px);' +
          'background:rgba(255,255,255,.9);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-top:1px solid #e6e6e6;' +
          "font-family:'Helvetica Neue',Helvetica,Inter,'SF Pro Text',Arial,sans-serif}" +
        '#koo-botnav .koo-tab{flex:1;min-width:0;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;' +
          'text-decoration:none;color:#9aa0a6;background:none;border:0;cursor:pointer;' +
          'font-family:inherit;font-weight:700;font-size:10px;line-height:1;letter-spacing:0;padding:9px 1px 7px;-webkit-tap-highlight-color:transparent}' +
        '#koo-botnav .koo-tab svg{width:23px;height:23px;display:block}' +
        '#koo-botnav .koo-tab span{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
        '#koo-botnav .koo-tab.koo-here{color:#C02025}' +
        '#koo-botnav .koo-tab.koo-here svg{color:#C02025}' +
        '#koo-botnav .koo-tab.koo-here::before{content:"";position:absolute;top:0;width:26px;height:2.5px;border-radius:3px;background:#C02025}' +
        '#koo-moresheet{display:block;position:fixed;inset:0;z-index:2147483400;visibility:hidden}' +
        '#koo-moresheet.koo-open{visibility:visible}' +
        '#koo-moresheet .koo-scrim{position:absolute;inset:0;background:rgba(0,0,0,.5);opacity:0;transition:opacity .22s}' +
        '#koo-moresheet.koo-open .koo-scrim{opacity:1}' +
        '#koo-moresheet .koo-panel{position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:18px 18px 0 0;box-shadow:0 -6px 26px rgba(0,0,0,.14);' +
          'padding:8px 14px calc(18px + env(safe-area-inset-bottom,0px));transform:translateY(101%);' +
          'transition:transform .28s cubic-bezier(.22,.61,.36,1);max-height:78vh;overflow-y:auto}' +
        '#koo-moresheet.koo-open .koo-panel{transform:none}' +
        '#koo-moresheet .koo-grab{width:38px;height:4px;border-radius:2px;background:rgba(0,0,0,.16);margin:8px auto 6px}' +
        '#koo-moresheet .koo-mtitle{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#8a8a8a;font-weight:800;margin:14px 6px 4px}' +
        '#koo-moresheet a.koo-mlink{display:flex;align-items:center;justify-content:space-between;text-decoration:none;color:#1a1a1a;' +
          'font-size:15px;font-weight:600;padding:14px 8px;border-bottom:1px solid #eee}' +
        '#koo-moresheet a.koo-mlink.koo-here{color:#C02025}' +
        '#koo-moresheet a.koo-mlink.koo-mgr,#koo-moresheet a.koo-mlink.koo-adm{display:none}' +
        '#koo-moresheet .koo-mtitle.koo-mgr,#koo-moresheet .koo-mtitle.koo-adm{display:none}' +
        '#koo-moresheet.koo-is-mgr a.koo-mlink.koo-mgr{display:flex}' +
        '#koo-moresheet.koo-is-mgr .koo-mtitle.koo-mgr{display:block}' +
        '#koo-moresheet.koo-is-adm a.koo-mlink.koo-adm{display:flex}' +
        '#koo-moresheet.koo-is-adm .koo-mtitle.koo-adm{display:block}}' +
      /* desktop: the same "primary + More" split, but the sheet becomes a
         top-right dropdown. Duplicated deliberately so the mobile block above is
         never touched. */
      '@media (min-width:641px){' +
        '#koo-nav .koo-moretop{display:inline-flex;align-items:center;gap:5px;flex:none;background:none;border:0;cursor:pointer;' +
          'color:rgba(255,255,255,.62);font-family:inherit;font-size:12px;font-weight:600;letter-spacing:.01em;' +
          'padding:6px 9px;border-radius:7px;transition:color .15s,background .15s;white-space:nowrap}' +
        '#koo-nav .koo-moretop:hover{color:#fff;background:rgba(255,255,255,.09)}' +
        '#koo-nav .koo-moretop .koo-dots{display:inline-flex}' +
        '#koo-nav .koo-moretop .koo-dots svg{width:15px;height:15px;fill:currentColor}' +
        '#koo-moresheet{display:block;position:fixed;inset:0;z-index:2147483400;visibility:hidden}' +
        '#koo-moresheet.koo-open{visibility:visible}' +
        '#koo-moresheet .koo-scrim{position:absolute;inset:0;background:transparent}' +
        '#koo-moresheet .koo-grab{display:none}' +
        '#koo-moresheet .koo-panel{position:absolute;top:calc(var(--koo-nav-h) + 6px);right:12px;left:auto;bottom:auto;' +
          'width:262px;max-height:72vh;overflow-y:auto;background:#0f0f0f;border:1px solid rgba(255,255,255,.1);' +
          'border-radius:12px;box-shadow:0 12px 34px rgba(0,0,0,.42);padding:8px 10px 12px;' +
          'opacity:0;transform:translateY(-6px);transition:opacity .16s var(--ease,ease),transform .16s;pointer-events:none}' +
        '#koo-moresheet.koo-open .koo-panel{opacity:1;transform:none;pointer-events:auto}' +
        '#koo-moresheet .koo-mtitle{font-size:9.5px;letter-spacing:.14em;text-transform:uppercase;color:#8a8a8a;font-weight:800;margin:10px 6px 3px}' +
        '#koo-moresheet a.koo-mlink{display:flex;align-items:center;justify-content:space-between;text-decoration:none;color:rgba(255,255,255,.82);' +
          'font-size:13px;font-weight:600;padding:9px 8px;border-radius:7px}' +
        '#koo-moresheet a.koo-mlink:hover{background:rgba(255,255,255,.08);color:#fff}' +
        '#koo-moresheet a.koo-mlink.koo-here{color:#C02025}' +
        '#koo-moresheet a.koo-mlink.koo-mgr,#koo-moresheet a.koo-mlink.koo-adm{display:none}' +
        '#koo-moresheet .koo-mtitle.koo-mgr,#koo-moresheet .koo-mtitle.koo-adm{display:none}' +
        '#koo-moresheet.koo-is-mgr a.koo-mlink.koo-mgr{display:flex}' +
        '#koo-moresheet.koo-is-mgr .koo-mtitle.koo-mgr{display:block}' +
        '#koo-moresheet.koo-is-adm a.koo-mlink.koo-adm{display:flex}' +
        '#koo-moresheet.koo-is-adm .koo-mtitle.koo-adm{display:block}}' +
      '@media print{#koo-nav,#koo-botnav,#koo-moresheet{display:none}body{padding-top:0}}';

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

    // Only the primary destinations sit on the bar; everything else lives behind
    // the More menu, so the front stays clean — the same split as the mobile tab bar.
    var inBottom = {};
    for (var b = 0; b < BOTTOM.length; b++) { inBottom[BOTTOM[b].file] = 1; }
    for (var i = 0; i < ITEMS.length; i++) {
      var it = ITEMS[i];
      if (!inBottom[it.file]) { continue; }
      var key = it.file.replace(/\.html$/, '');
      var here = (cur === key);
      html += '<a class="koo-link' + (here ? ' koo-here' : '') +
              '" href="' + ROOT + it.file + '"' +
              (here ? ' aria-current="page"' : '') + '>' + esc(it.label) + '</a>';
    }
    html += '<span class="koo-rule"></span>' +
            '<button class="koo-moretop" id="koo-nav-more" type="button" aria-haspopup="dialog" aria-label="More">' +
            '<span class="koo-dots">' + ICON.more + '</span>More</button>';

    nav.innerHTML = html;
    document.body.insertBefore(nav, document.body.firstChild);
    return nav;
  }

  /* ---- the mobile bottom bar + More sheet -------------------------------
   * Built on every non-deck page; CSS keeps both hidden until the mobile
   * breakpoint. The four primary tabs sit in the bar; every other destination,
   * grouped by tier, lives in the sheet. Primary tabs are NOT repeated in the
   * sheet, so nothing shows twice. */
  function buildBottom() {
    var inBottom = {};
    for (var b = 0; b < BOTTOM.length; b++) { inBottom[BOTTOM[b].file] = 1; }

    var bn = document.createElement('nav');
    bn.id = 'koo-botnav';
    bn.setAttribute('aria-label', 'Koocester staff navigation');
    var h = '';
    for (var i = 0; i < BOTTOM.length; i++) {
      var t = BOTTOM[i];
      var tkey = t.file.replace(/\.html$/, '');
      var there = (cur === tkey) || (t.home && (cur === 'portal' || cur === 'index'));
      h += '<a class="koo-tab' + (there ? ' koo-here' : '') + '" href="' + ROOT + t.file + '"' +
           (there ? ' aria-current="page"' : '') + '>' + t.icon + '<span>' + esc(t.label) + '</span></a>';
    }
    h += '<button class="koo-tab" type="button" id="koo-more-btn" aria-label="More" aria-haspopup="dialog">' +
         ICON.more + '<span>More</span></button>';
    bn.innerHTML = h;
    document.body.appendChild(bn);

    var sheet = document.createElement('div');
    sheet.id = 'koo-moresheet';
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-label', 'All destinations');
    var GROUPS = [
      { title: 'Everyday', access: 'all',     tier: '' },
      { title: 'Operate',  access: 'manager', tier: ' koo-mgr' },
      { title: 'Admin',    access: 'admin',   tier: ' koo-adm' }
    ];
    var sh = '<div class="koo-scrim" id="koo-more-scrim"></div><div class="koo-panel">' +
             '<div class="koo-grab"></div>';
    for (var g = 0; g < GROUPS.length; g++) {
      var grp = GROUPS[g];
      sh += '<div class="koo-mtitle' + grp.tier + '">' + grp.title + '</div>';
      for (var j = 0; j < ITEMS.length; j++) {
        var it = ITEMS[j];
        if (it.access !== grp.access || inBottom[it.file]) { continue; }   // skip primary tabs
        var key = it.file.replace(/\.html$/, '');
        var here = (cur === key);
        sh += '<a class="koo-mlink' + grp.tier + (here ? ' koo-here' : '') + '" href="' + ROOT + it.file + '"' +
              (here ? ' aria-current="page"' : '') + '>' + esc(it.label) + (here ? '<span>•</span>' : '') + '</a>';
      }
    }
    sh += '</div>';
    sheet.innerHTML = sh;
    document.body.appendChild(sheet);
    _sheetEl = sheet;

    function close() { sheet.classList.remove('koo-open'); }
    function open() { sheet.classList.add('koo-open'); }
    document.getElementById('koo-more-btn').addEventListener('click', open);
    var topMore = document.getElementById('koo-nav-more');   // desktop top-bar More
    if (topMore) { topMore.addEventListener('click', open); }
    document.getElementById('koo-more-scrim').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); } });
    [].forEach.call(sheet.querySelectorAll('a.koo-mlink'), function (a) { a.addEventListener('click', close); });
    return bn;
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
      if (_sheetEl) { _sheetEl.classList.add('koo-is-mgr'); _sheetEl.classList.add('koo-is-adm'); }
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
              if (mgr) { nav.classList.add('koo-is-mgr'); if (_sheetEl) { _sheetEl.classList.add('koo-is-mgr'); } }
              if (adm) { nav.classList.add('koo-is-adm'); if (_sheetEl) { _sheetEl.classList.add('koo-is-adm'); } }
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
    buildBottom();
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
