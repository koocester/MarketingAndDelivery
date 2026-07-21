# portal/src/ — sanitized snapshot of the deployed portal source

This is the **actual source** of `staffacademy.koocester.com` (Cloudflare Pages project `koocester-academy`), copied here as a handover backup and read-along for the docs in [`../`](../README.md). It is a **snapshot**, not the live tree — the live tree is the CEO's vault at `04. Resources/Training/`, deployed by `deploy.sh`.

## What is and isn't here

| Included | Excluded (and why) |
|---|---|
| All 103 `.html` pages (login, portal, academy, admin, manager, dashboards, ~80 training decks) | Binary assets — `operators/` portraits (~7M), `brand/`, `clientlogos/`, root images (~22M total). They render the decks but are not "the system"; they live in the vault and are restored on deploy. |
| All 10 `.js` files (guards, `academy-access`, `koo-nav`, the three `functions/`) | `node_modules/`, `.wrangler/` build output |
| `deploy.sh` (the gated deploy path) | Vault-internal handoff notes |
| `koocester-academy-curriculum-map.md`, `ROLLBACK-academy-server-gate.md`, `academy-assignments-plan.md` | |

## 🔒 This snapshot is SANITIZED — do not deploy it as-is

Two classes of secret were replaced with placeholders (structure preserved, exactly like the `n8n/workflows/*.json` exports). **The vault source is untouched; only this copy is redacted.**

| Placeholder | Real value lives | Appears in |
|---|---|---|
| `<SUPABASE_ANON_KEY>` | Supabase project `lfppmsppvqtjyusfrlkf` → Settings → API (anon/public key) | 26 files (every page/guard that talks to Supabase) |
| `<REDACTED_N8N_BASIC_AUTH>` | the per-feed n8n webhook Basic-Auth logins (the role "mantras") | `functions/dash.js`, `functions/mgmt-deck.js`, `functions/hr-feed.js` |

- The **anon key** is shipped in the browser by design, but it is still an `anon`-role bearer credential bounded only by RLS — see [../02-functions-and-numbers.md](../02-functions-and-numbers.md). Redacted here to keep the repo's "no secret values, ever" rule literally true.
- The **mantras** are the higher-severity secret (department logins, no RLS behind them). 🔴 Open item: rotate them to Cloudflare Pages env vars (CHANGELOG).

To make this tree runnable again, restore both placeholders from their managed stores. **Never commit the restored values.**

## Layout

```
src/
├── login.html              passwordless email-OTP sign-in (writes koo_session cookie)
├── portal.html             the tile hub (post-login home)
├── academy.html            training hub (role-aware curriculum)
├── koo-nav.js              the one nav bar (every page, no deck)
├── koo-auth-guard.js       per-deck soft gate → login / "not your module"
├── academy-access.js       KOO_ACCESS entitlement resolver (fails open)
├── functions/              Cloudflare Pages Functions (edge + hard gates)
│   ├── _middleware.js      the real front door — auth on every request
│   ├── dash.js             /dash  → n8n Command feed, role-scoped, fail-closed
│   ├── mgmt-deck.js        /mgmt-deck → n8n Management Weekly deck
│   └── hr-feed.js          /hr-overview → n8n HR feed (founder + HR only)
├── admin/                  permissions.html + koo-admin-guard.js (is_admin)
├── manager/               report/townhall views + koo-manager-guard.js (is_manager)
├── deploy.sh               the ONLY deploy path (four gates) — see ../03
└── *-training.html …       ~80 curriculum decks (gated by koo-auth-guard.js)
```

Read the mechanics in order: [../01 access & gates](../01-access-and-gates.md) → [../02 functions & numbers](../02-functions-and-numbers.md) → [../04 academy auth](../04-academy-auth.md) → [../03 deploy/nav/ops](../03-deploy-nav-ops.md).
