#!/usr/bin/env bash
# =============================================================================
# deploy.sh — the ONLY way the staff portal should be deployed.
#
# Every outage on 2026-07-20 was something a machine could have caught:
#   1. A duplicate `const` in one inline script -> SyntaxError -> the whole
#      portal hung on a spinner for the entire team. A bracket check on the
#      edited section passed and gave false confidence.
#   2. A guard file with no ?v= cache-buster -> browsers kept running the old
#      copy while the fix sat live on the server. Iman was locked out for hours.
#
# So both are now gates, not habits. This script REFUSES to deploy if either
# fails. Run it instead of calling wrangler directly:
#     ./deploy.sh
# =============================================================================
set -euo pipefail
cd "$(dirname "$0")"

fail=0

echo "──────────────────────────────────────────────────────────────"
echo "GATE 1 · every inline script in every page must parse"
echo "──────────────────────────────────────────────────────────────"
python3 - <<'PY' || fail=1
import re, subprocess, glob, sys
bad = 0; n = 0
for f in sorted(glob.glob('**/*.html', recursive=True)):
    h = open(f, encoding='utf-8', errors='replace').read()
    for i, s in enumerate(re.findall(r'<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)</script>', h)):
        if not s.strip():
            continue
        n += 1
        open('/tmp/_gate.mjs', 'w').write(s)
        r = subprocess.run(['node', '--check', '/tmp/_gate.mjs'],
                           capture_output=True, text=True)
        if r.returncode:
            bad += 1
            err = [l for l in r.stderr.split('\n') if 'Error' in l]
            print(f'  FAIL {f} script#{i}: {err[0] if err else r.stderr[:120]}')
print(f'  {n} inline scripts checked, {bad} failures')
sys.exit(1 if bad else 0)
PY

echo
echo "──────────────────────────────────────────────────────────────"
echo "GATE 2 · standalone JS must parse"
echo "──────────────────────────────────────────────────────────────"
js_bad=0
while IFS= read -r j; do
  if ! node --check "$j" >/dev/null 2>&1; then
    echo "  FAIL $j"; js_bad=1
  fi
done < <(find . -name '*.js' -not -path './.wrangler/*' -not -name '*.n8n.json')
[ "$js_bad" -eq 0 ] && echo "  all standalone JS parses" || fail=1

echo
echo "──────────────────────────────────────────────────────────────"
echo "GATE 3 · every shared-component include must carry a ?v= cache-buster"
echo "──────────────────────────────────────────────────────────────"
# Without ?v= a deployed fix never reaches a browser that already has the file.
unversioned=$(grep -rho 'src="[^"]*\(koo-[a-z]*-guard\|koo-nav\|academy-access\)\.js[^"]*"' . 2>/dev/null \
              | grep -v '?v=' || true)
if [ -n "$unversioned" ]; then
  echo "  FAIL — these includes have no ?v=:"; echo "$unversioned" | sed 's/^/    /'
  echo "  Bump the version and re-run."
  fail=1
else
  echo "  every guard include is version-stamped"
fi

echo
echo "──────────────────────────────────────────────────────────────"
echo "GATE 4 · the nav bar must be on every page and on no training deck"
echo "──────────────────────────────────────────────────────────────"
# Hakim's rule: a persistent nav on every page so staff stop bouncing back to
# the portal, but NEVER on a training deck, where it would steal a row of the
# slide and fight the deck's own keyboard chrome. Enforced here so the rule
# survives whoever edits next, instead of living in someone's memory.
python3 - <<'PY' || fail=1
import glob, sys, os, re

# Slide markup only counts when it is real markup. academy.html mentions
# `<section class="slide` inside a regex that counts slides in OTHER files, and
# renders a `class="slidect"` table cell — a naive substring test reads the hub
# as a deck and strips its nav. Strip scripts, then match a whole class token.
SCRIPT = re.compile(r'<script[\s\S]*?</script>', re.I)
SLIDE_EL = re.compile(r'<[a-z]+[^>]*\sclass=["\'][^"\']*\bslide\b', re.I)

# Decks: nav must NOT appear. Detected from CONTENT, not the filename, so a new
# deck exempts itself the moment it is added — a name-based list would silently
# stop matching the first time someone names a deck something else (it already
# would have missed mnd-workflow-futuristic.html and the dated report decks).
def is_deck(p, html):
    b = os.path.basename(p)
    if b.endswith('-training.html') or b.endswith('-slides.html'):
        return True
    return bool(SLIDE_EL.search(SCRIPT.sub('', html)))

# Pages that legitimately carry no nav, with the reason.
EXEMPT = {
    'login.html':                 'signed-out front door',
    'index.html':                 'meta-refresh redirect only',
    'manager/report-view.html':   'renders a report deck full-bleed, has its own back bar',
    'manager/townhall-view.html': 'renders a town-hall deck full-bleed, has its own back bar',
    'animation-sampler.html':     'internal motion reference',
    'entrance-animations.html':   'internal motion reference',
    'review-digest.html':         'generated digest',
    'mnd-workflow-map.html':      'standalone diagram',
    'org-who-to-ask-background-options.html': 'internal design comparison',
    'client-onboarding-rina-review.html':     'one-off review page',
}
EXEMPT.update({f: 'redirect stub' for f in glob.glob('sales-kit-*.html')
               if os.path.getsize(f) < 1024})

missing, wrong = [], []
for f in sorted(glob.glob('**/*.html', recursive=True)):
    f = f.replace(os.sep, '/')
    if f.startswith('.wrangler/'):
        continue
    h = open(f, encoding='utf-8', errors='replace').read()
    has = 'koo-nav.js' in h
    if is_deck(f, h):
        if has:
            wrong.append(f)
    elif f in EXEMPT:
        if has:
            wrong.append(f + '  (exempt: ' + EXEMPT[f] + ')')
    elif not has:
        missing.append(f)

# The include path has to resolve from the page's own depth, or the bar 404s
# silently and only that one page loses it.
badpath = []
for f in sorted(glob.glob('**/*.html', recursive=True)):
    f = f.replace(os.sep, '/')
    if f.startswith('.wrangler/'):
        continue
    h = open(f, encoding='utf-8', errors='replace').read()
    if 'koo-nav.js' not in h:
        continue
    want = '../' * f.count('/')
    if ('src="' + want + 'koo-nav.js') not in h:
        badpath.append(f + '  (expected src="' + want + 'koo-nav.js?v=…")')

for label, rows in (('page has NO nav', missing),
                    ('deck/exempt page HAS a nav', wrong),
                    ('wrong relative path', badpath)):
    for r in rows:
        print('  FAIL ' + label + ': ' + r)

ok = not (missing or wrong or badpath)
if ok:
    print('  nav present on every page, absent from every deck, all paths resolve')
sys.exit(0 if ok else 1)
PY

echo
if [ "$fail" -ne 0 ]; then
  echo "=============================================================="
  echo "DEPLOY BLOCKED. Fix the failures above. Nothing was uploaded."
  echo "=============================================================="
  exit 1
fi

echo "=============================================================="
echo "All gates passed. Deploying."
echo "=============================================================="
npx wrangler pages deploy . --project-name=koocester-academy --branch=main --commit-dirty=true
