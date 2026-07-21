# Portal 02 — Functions & Numbers

The three Cloudflare Pages Functions that put live numbers on the portal's dashboards. All three share one shape and one promise.

## The shape (identical in all three)

```
GET /dash | /mgmt-deck | /hr-overview
  Authorization: Bearer <supabase access token>
        │
   1. verify token → Supabase /auth/v1/user      (fail 401 if missing/invalid)
        │
   2. load profile role/columns from `profiles`  (retry without new columns if absent)
        │
   3. decide the ONE feed this caller may see     (fail 403 if none — fail CLOSED)
        │
   4. fetch that n8n webhook SERVER-SIDE,
      injecting its Basic-Auth login              (fail 502 if upstream down)
        │
      return the HTML/JSON to the browser
```

**The promise:** every figure is computed by n8n **at render time**. Nothing is copied, cached, or hardcoded in the portal, so there is no stale number to drift. This is what keeps the portal aligned with the vault's Metric Registry discipline — the portal is a *window*, not a *copy*.

## `/dash` — the Command cockpit (`dash.js`)

Proxies `https://koocester.app.n8n.cloud/webhook/<feed>`, where `<feed>` is the one dashboard the caller may see.

- **Feed decision (source of truth = `profiles.dashboard`):** if that column is set, it wins. Otherwise fall back to `feedFor(role, email)`: founder/CEO/owner email → `command` (all tabs, all financials); a named manager → their department; anything unrecognised → `null` → **403**.
- **Per-role pruning happens in n8n**, not here — the Build node strips financials and tabs so a department manager only ever sees their own view. Each feed has its **own** Basic-Auth login (a role "mantra"), all server-side.
- **No loose role matching** (removed 2026-07-20). It used to fall through to `role.includes('sales'/'finance'/'hr')`, which meant anyone whose *title* merely contained the word reached that feed — every sales rep would have gotten the Sales dashboard. **Sales access is Cheryl alone.** The named-people map is the whole answer; unknown → 403.

Feeds (credentials redacted):

| Feed | Who | Sees |
|---|---|---|
| `command` | founder | all tabs, all financials |
| `growth` | Head of Growth + growth leads | Growth + Team/Ops |
| `finance` | Finance | Finance only |
| `sales` | Sales (Cheryl only) | Sales only |
| `hr` | HR | HR only |
| `tech` | Tech | Tech only |

## `/mgmt-deck` — the Management Weekly deck (`mgmt-deck.js`)

- Proxies n8n workflow **`t9ZZ7sk9hyWEKNdR`** at `/webhook/mgmt-slides`.
- Management-only (`isManager()` — the **same** test as `portal.html`, driven by `profiles.is_manager` with a named-email fallback).
- Carries company financials (**collected MTD, AR, per-client revenue**), every figure computed live, so proxying the webhook always shows the current deck. Nothing archived here.
- **Keep in step** with `isManager()` in `portal.html` and `feedFor()` in `dash.js` — anyone shown the tile must pass here, or they get a door that won't open.

## `/hr-overview` — People & HR overview (`hr-feed.js`)

- Proxies n8n `/webhook/hr-overview`, returns **JSON**.
- Founder **or** HR-role only (`role` contains `hr`/`people`/`talent`) — everyone else 403.
- Extracts **headcount, payroll incl. salary, lifecycle**. Salary is fetched live from the HR base by n8n and proxied through; it is **never stored in the portal database** and never reaches a non-HR client.

## The three access lists must mirror each other

`portal.html` (which tiles show), `dash.js` (`EMAIL_FEEDS` / `feedFor`), and `mgmt-deck.js` (`MANAGER_EMAILS`) each carry the management roster as a hardcoded fallback. **They must stay identical.** If a person is on the portal's tile list but missing from a Function's list (and their `profiles` column is not yet set), they get a tile that 403s. The columns (`is_manager`, `dashboard`) are the real source of truth; the lists are break-glass for the window before a column is populated.

The roster was read from the **"Manager Updates" Lark group** on 2026-07-20, plus Cheryl for Sales, keyed on the HR base **Work Email** — three members do not follow the `firstname@` pattern, so the emails are read, not guessed.

## 🔴 Secret-handling note (do not commit values)

Each Function holds its n8n Basic-Auth credential **inline** (server-side; never sent to the browser, but hardcoded in source). **This repo redacts every value.** It is the same finding class as the S1–S6 inline n8n secrets in [../docs/16-troubleshooting.md](../docs/16-troubleshooting.md).

- Rotate and move these to **Cloudflare Pages environment variables** when the n8n secrets are rotated. Tracked in the CHANGELOG "Open" list.
- The Supabase **anon** key that also appears in these files is public by design (shipped in browser JS) — it is not the concern. The Basic-Auth mantras are.

## Validate in 30 seconds

| Endpoint | Check |
|---|---|
| `/dash` | signed in as a department manager → see only that department; as founder → all tabs; signed out → 401 |
| `/mgmt-deck` | non-manager → 403; manager → the live deck with a current timestamp |
| `/hr-overview` | non-HR, non-founder → 403; HR → JSON with headcount |
| any | stop n8n's feed → expect a clean `502`, never a leaked page or a blank 200 |
