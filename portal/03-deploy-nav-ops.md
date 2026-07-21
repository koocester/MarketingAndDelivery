# Portal 03 — Deploy, Nav & Ops

How the portal ships, why the nav bar is enforced by a gate, and the day-to-day operations.

## `deploy.sh` — the only deploy path

Run `./deploy.sh` from `04. Resources/Training/`. **Never call `wrangler` directly** — you would skip the gates below. The script `set -euo pipefail`s, runs four gates, and refuses to upload if any fail. Only on all-pass does it run:

```
npx wrangler pages deploy . --project-name=koocester-academy --branch=main --commit-dirty=true
```

Every gate exists because a specific outage on 2026-07-20 could have been caught by a machine:

| Gate | Enforces | The outage it prevents |
|---|---|---|
| 1 | every inline `<script>` in every `.html` parses (`node --check`) | a duplicate `const` → SyntaxError → the whole portal hung on a spinner for the team |
| 2 | every standalone `.js` parses | a broken guard file shipping unnoticed |
| 3 | every shared include (`koo-nav`, `koo-*-guard`, `academy-access`) carries `?v=` | a fix that never reaches a browser holding the old cached file — **Iman locked out for hours** |
| 4 | the nav is on every page and on **no** deck, with paths that resolve from each page's depth | a page silently losing its nav, or a deck stealing a slide row for one |

Gate 4 detects decks by **content** (a real `class="slide"` element, or a `-training`/`-slides` filename), not by a filename list — so a new deck exempts itself automatically. A short `EXEMPT` map covers the legitimate no-nav pages (login, redirect stubs, full-bleed report/townhall views, internal references).

## Cloudflare Pages propagation

Edge nodes can serve the **previous** deployment for a few minutes after a deploy. **Never judge a deploy from one sweep — re-sweep until two consecutive runs are clean.** A single green check right after deploy is not proof; some nodes are still on the old build.

## `koo-nav.js` — one bar, everywhere but the decks

Hakim's rule, enforced by gate 4 so it survives whoever edits next:

- A persistent nav on **every** page, so staff stop bouncing back to the portal to move around.
- **Never** on a training deck — it would steal a row of the slide and fight the deck's own keyboard chrome.
- The include path must be relative to the page's own depth (`../` per directory level) or the bar 404s silently and only that one page loses it.

## Access changes (no deploy needed)

Most access changes are **data, not code**:

- **Grant/revoke a manager or dashboard** → Portal → Admin → Permissions (`admin/permissions.html`) → edits `profiles.is_manager` / `profiles.dashboard`. Takes effect immediately, no redeploy.
- **Revoke a leaver entirely** → delete their Supabase auth account → the edge gate stops them within ~2 min.
- **Fix a name/department/role in the directory** → edit the **Lark HR base** (`Employee Data`), then re-run the roster sync rather than waiting for the nightly job:
  `curl https://koocester.app.n8n.cloud/webhook/hr-roster-sync-run`

## The data behind the pages (Supabase, project `lfppmsppvqtjyusfrlkf`)

| Surface | Reads |
|---|---|
| `people.html` | `public.hr_directory` (6-column view over `hr_employees`; **not** `profiles`) |
| `academy.html` / deck guards | `academy_me`, `academy_my_decks`, `academy_decks`, `is_founder()` |
| `admin/permissions.html` | `profiles` via `list_permissions()` / `set_permissions()` (`SECURITY DEFINER`, founder-gated) |
| `leaderboard.html`, `completions.html`, `review-digest.html` | portal Supabase views / published artifacts |
| `/dash`, `/mgmt-deck`, `/hr-overview` | live n8n feeds, proxied (see [02](02-functions-and-numbers.md)) |

- `hr_directory` exposes only `full_name, preferred_name, department, academy_role, country, work_email`, granted to `authenticated` with an explicit **REVOKE from `anon`** (a plain view leaked `lb_people` to anon once). **Never widen it** — `hr_employees` carries IC numbers, bank accounts, and salary and stays RLS-locked with no policy.
- Verify anon is refused: `curl -s -o /dev/null -w "%{http_code}" ".../rest/v1/hr_directory?select=*&limit=1" -H "apikey: <anon>"` must return **401**.

## Rollback

There is a documented rollback for the server-side gate at `04. Resources/Training/ROLLBACK-academy-server-gate.md` in the vault. In short: removing `functions/_middleware.js` reverts to the old browser-only guard (which fails open) — do this only as a deliberate break-glass, and restore the middleware immediately after, because without it the decks are world-readable again.

## Ops checklist when something's wrong

1. **"Portal hangs on a spinner"** → an inline script threw. Re-run `./deploy.sh`; gate 1 names the file. If already live, a bad shared include is the usual cause.
2. **"My fix isn't showing"** → you didn't bump `?v=` (gate 3 would have blocked a fresh deploy) or you're seeing a stale edge node (re-sweep).
3. **"A manager can't open their dashboard"** → check `profiles.is_manager` / `profiles.dashboard`; then check they're in the Function's fallback list if the column is unset.
4. **"A leaver still has access"** → their auth account still exists; delete it and wait ~2 min for the cache window.
5. **"Someone's missing from People"** → they're inactive in the HR base or the roster sync hasn't run; fix in the base, re-run the webhook. Do **not** edit `people.html`.
