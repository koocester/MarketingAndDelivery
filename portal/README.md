# portal/ — Staff Portal (staffacademy.koocester.com)

The company sign-in app: training + role tools + manager dashboards, behind one Supabase identity. Narrative overview is [../docs/19-staff-portal.md](../docs/19-staff-portal.md); this folder is the engineering detail.

> **The source is not in this repo.** The portal is product code and lives in the CEO's vault at `04. Resources/Training/`, deployed to Cloudflare Pages (project `koocester-academy`) by `./deploy.sh`. These docs describe that code so it can be operated and rebuilt; they do **not** duplicate it, and they carry **no secret values**.

## Read in this order

| Doc | Covers |
|---|---|
| [01-access-and-gates.md](01-access-and-gates.md) | Sign-in, the soft-vs-hard gate model, the four identity questions and which Supabase column answers each, the traps |
| [02-functions-and-numbers.md](02-functions-and-numbers.md) | The three hard-gated Pages Functions, the role→feed map, and how live numbers reach the dashboards |
| [03-deploy-nav-ops.md](03-deploy-nav-ops.md) | `deploy.sh`'s four gates, `koo-nav.js`, cache-busting, Cloudflare propagation, day-to-day ops |

## The pieces (in the vault, `04. Resources/Training/`)

| File | Kind | Job |
|---|---|---|
| `functions/_middleware.js` | hard gate (edge) | the real front door — auth on every request before delivery |
| `functions/dash.js` | hard gate (server) | proxy `/dash` → n8n Command feed, role-scoped, fail-closed |
| `functions/mgmt-deck.js` | hard gate (server) | proxy `/mgmt-deck` → n8n Management Weekly deck, management-only |
| `functions/hr-feed.js` | hard gate (server) | proxy `/hr-overview` → n8n HR feed, founder + HR only |
| `academy-access.js` | soft gate (client) | `KOO_ACCESS` — who is signed in, their role, which decks they may open (fails open) |
| `koo-auth-guard.js` | soft gate (client) | per-deck bounce to login (backstop to the middleware) |
| `admin/koo-admin-guard.js`, `manager/koo-manager-guard.js` | soft gate (client) | admin / manager page guards |
| `koo-nav.js` | shared component | one nav bar on every page, none on decks |
| `deploy.sh` | tooling | the only deploy path; four gates, refuses to ship broken |
| `portal.html`, `login.html` | pages | the tile hub and the signed-out door |
| `people.html`, `command.html`, `leaderboard.html`, `completions.html`, `review-digest.html` | tools/dashboards | role tools reading Supabase views / the proxy Functions |
| `admin/permissions.html` | admin | grant/revoke management access — one row edit, no redeploy |
| `*-training.html`, `*-slides.html` | decks | the Academy curriculum (~80 pages) |

## URL map

| Path | Served by | Gate |
|---|---|---|
| `/login.html` | static | public (front door) |
| `/portal.html` | static | edge middleware |
| `/dash` | `functions/dash.js` | hard, fail-closed |
| `/mgmt-deck` | `functions/mgmt-deck.js` | hard, fail-closed |
| `/hr-overview` | `functions/hr-feed.js` | hard, fail-closed |
| `/<anything>-training` | static deck | edge middleware (soft client guard behind it) |

## The golden rules

1. **Deploy only with `./deploy.sh`.** Never call `wrangler` directly — you will skip the four gates.
2. **Bump `?v=` on any shared component you edit** (`koo-nav`, guards, `academy-access`) or the fix never reaches browsers that cached the old file.
3. **Grant access by editing `profiles`, not code.** Portal → Admin → Permissions.
4. **Hard gates fail closed; soft gates fail open.** Keep it that way. Nothing confidential behind a soft gate.
5. **Fix people in the Lark HR base, then re-sync** — never in `people.html`.
