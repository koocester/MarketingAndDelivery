# 19 — Staff Portal (staffacademy.koocester.com)

> Added 2026-07-21. The portal did not exist when this repo was reconstructed on 2026-07-10; it is the newest and most-changed part of the system. This doc is the narrative; the mechanics live in [`../portal/`](../portal/README.md).

## What it is

A single sign-in web app for the whole company. One door, one identity, and behind it everything a staff member needs: their training curriculum, the tools for their role, and — for managers — the live dashboards. It is the **human-facing front end** over systems this repo already documents (Lark, Supabase, n8n, Metabase). It stores almost nothing itself; it **gates, routes, and proxies**.

- **URL:** `https://staffacademy.koocester.com`
- **Hosting:** Cloudflare Pages, project `koocester-academy`, branch `main`.
- **Source:** the CEO's vault at `04. Resources/Training/` (not in this repo — it is product source, not handover docs). Deployed only via `./deploy.sh` (see [portal/03](../portal/03-deploy-nav-ops.md)).
- **Identity:** Supabase project `lfppmsppvqtjyusfrlkf` (separate from the analytics warehouse). `auth.users` is who can sign in; `public.profiles` is what every gate reads.

It is the fifth dashboard surface — see [10-dashboard-setup.md](10-dashboard-setup.md), surface **E**.

## The one thing to understand: two kinds of gate

The portal has **soft gates** and **hard gates**, and confusing them is how the security hole it was built to close got opened in the first place.

| | Soft gate | Hard gate |
|---|---|---|
| Runs | in the browser, after delivery | at the edge / server, before delivery |
| On failure (network blip) | fails **open** (never locks anyone out) | fails **closed** (403) |
| Job | routing and focus | the real security boundary |
| Examples | `academy-access.js` (which decks show), `koo-nav.js` | `functions/_middleware.js`, `functions/dash.js`, `functions/hr-feed.js`, `functions/mgmt-deck.js` |
| Rule | nothing genuinely confidential goes behind one | company financials and salary go **only** behind these |

The full access model — the four identity questions, which Supabase column answers each, and the traps that already cost a day — is [portal/01](../portal/01-access-and-gates.md). It mirrors the vault's own `SOURCES_OF_TRUTH.md`.

## The front door — `functions/_middleware.js`

Runs on **every** request before any file is served.

- No valid `koo_session` cookie (a Supabase JWT) → `302` to login for pages, bare `401` for assets. No body, so the deck is never delivered.
- Valid cookie → the file is served.
- Validation asks **Supabase** (`/auth/v1/user`), not a local signature check — so **deleting an account revokes access within ~2 minutes**, which is the entire point. A locally-verified JWT would stay valid until it expired even after the account was gone.
- **Outage behaviour is deliberate, three-way:** a token Supabase already validated is trusted for 120s with no call, and for up to 10 minutes if Supabase is unreachable — but a token never seen before is refused even during an outage. Failing fully open would restore the hole; failing fully closed would lock out all 35 staff over a blip. Do not "simplify" this.

Why this exists: before the middleware, the only gate was a browser-side guard that ran *after* the deck was delivered. `curl` returned the full C-Suite deck to anybody, and deleting an ex-staff account revoked nothing.

## How it links into Lark

The portal never talks to Lark directly. Lark reaches it through two paths this repo already documents, now consumed by the portal:

1. **Who works here → the People directory.** The Lark HR base (`Employee Data`) is synced nightly by n8n (**HR Roster Sync `8XEtLLl63t3oEhcq`**, ~02:45) into Supabase `hr_employees`, exposed as the narrow view `public.hr_directory` (six columns, no salary), which `people.html` reads. Fix a person in the **HR base**, then re-run the sync — never edit the page. `curl https://koocester.app.n8n.cloud/webhook/hr-roster-sync-run`
2. **Who trains on what → the curriculum.** The HR base `Academy Role` field (not `Department`) drives `academy_me` / `academy_my_decks`, which decide the decks a person sees.

And the manager dashboards are **live proxies of n8n**, which itself reads Lark + Supabase at render time (next section).

## How the numbers get onto the dashboards

Three Cloudflare Pages Functions are the portal's hard-gated proxies. Each verifies the caller's Supabase token, resolves their role, and — only if allowed — fetches a live n8n feed **server-side**, injecting a Basic-Auth login that is never sent to the browser. **Every figure is computed live by n8n at render time; nothing is cached, copied, or hardcoded in the portal.** That is what keeps the portal honest with the vault's Metric Registry discipline — there is no stale number to go out of date.

| Endpoint | Serves | Who may see it | What it extracts |
|---|---|---|---|
| `/dash` (`dash.js`) | Command cockpit | founder → all tabs; each manager → **only** their department feed; everyone else 403 | role-scoped operational + financial tiles (the n8n Build node prunes financials/tabs per role) |
| `/mgmt-deck` (`mgmt-deck.js`) | Management Weekly deck (n8n wf `t9ZZ7sk9hyWEKNdR`) | management only | live company financials: collected MTD, AR, per-client revenue |
| `/hr-overview` (`hr-feed.js`) | People & HR overview | founder + HR role only | headcount, payroll incl. salary, lifecycle — salary is **never** stored in the portal DB |

Full mechanics, the role→feed map, and the redaction note are in [portal/02](../portal/02-functions-and-numbers.md).

## How it ships — `deploy.sh`

The **only** deploy path. It refuses to upload if any of four gates fail, because every 2026-07-20 outage was something a machine could have caught:

1. every inline `<script>` in every page parses (a duplicate `const` hung the whole portal on a spinner);
2. every standalone `.js` parses;
3. every shared-component include (`koo-nav`, the guards, `academy-access`) carries a `?v=` cache-buster (without it a fix never reaches a browser that already has the file — Iman sat locked out for hours);
4. the nav bar is on every page and on **no** training deck, with include paths that resolve from each page's depth.

Cloudflare edge nodes can serve the previous deployment for a few minutes — **never trust one sweep; re-sweep until two consecutive runs are clean.** Details in [portal/03](../portal/03-deploy-nav-ops.md).

## Security posture (read before touching it)

- The hard gates (`_middleware`, `dash`, `hr-feed`, `mgmt-deck`) **fail closed**. Keep them that way.
- The soft gates (`academy-access.js`, the client guards) **fail open** by design. Never put confidential content behind only a soft gate.
- 🔴 **Inline server-side secrets.** The three Functions hold their n8n Basic-Auth credentials inline in the source (server-side, never sent to the browser — but still hardcoded). This is the same class of finding as the S1–S6 n8n inline secrets in [16-troubleshooting.md](16-troubleshooting.md). **Values are redacted from this repo.** Rotate + move to Cloudflare env vars when the n8n secrets are rotated. Tracked in the CHANGELOG "Open" list.
- The Supabase **anon** key is shipped in browser JS by design, but it is **not "nothing."** Decoded, it carries only `{ref, role: anon, iat, exp}` — no password, no service key, and its HMAC signature cannot be reversed to the signing secret. But the token *itself* is an `anon`-role bearer credential valid ~10 years, and its blast radius is **whatever Row-Level Security allows** — this system leaked `lb_people` to `anon` through a plain view once. So: keep it out of this repo, keep RLS tight, and treat the n8n Basic-Auth mantras as the higher-severity secret (department logins with no RLS behind them).

## Rebuild / operate — quick reference

| Task | Do this |
|---|---|
| Deploy a change | edit in `04. Resources/Training/`, then `./deploy.sh` (never call `wrangler` directly) |
| Grant/revoke management access | one row edit in **Portal → Admin → Permissions** (`profiles.is_manager` / `.dashboard`) — no redeploy |
| Fix a person in the directory | edit the **Lark HR base**, then re-run HR Roster Sync webhook |
| Revoke a leaver | delete their Supabase auth account — the edge gate stops them within ~2 min |
| A shared JS fix "won't take" | you forgot to bump `?v=` — gate 3 catches it before upload |

## Cross-references

- Access + identity model: [portal/01-access-and-gates.md](../portal/01-access-and-gates.md)
- The proxy Functions + numbers: [portal/02-functions-and-numbers.md](../portal/02-functions-and-numbers.md)
- Deploy, nav, ops: [portal/03-deploy-nav-ops.md](../portal/03-deploy-nav-ops.md)
- Where it sits among the dashboards: [10-dashboard-setup.md](10-dashboard-setup.md)
- The feeds it proxies: [09-n8n-setup.md](09-n8n-setup.md), [n8n/how-briefs-and-command-read-the-base.md](../n8n/how-briefs-and-command-read-the-base.md)
- Gate-flow diagram: [diagrams/portal-access-flow.mmd](diagrams/portal-access-flow.mmd)
