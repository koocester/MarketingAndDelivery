# Portal 01 — Access & Gates

How the portal decides who you are and what you may see. This mirrors the vault's `00. System/SOURCES_OF_TRUTH.md`; when they disagree, **the running code wins** and both get fixed.

## Identity: two stores, one truth each

| Question | Source of truth | Note |
|---|---|---|
| Who can sign in? | `auth.users` (Supabase magic link) | kept in step with `profiles` by the `on_auth_user_created` trigger |
| Who do the gates recognise? | **`public.profiles`** | every gate reads this, not the HR base |

- **Emails do not follow `firstname@`.** e.g. `imanarifin@`, `tpradian@`, `taninmishkat@`, `okkykurniasaputra@`. **Hakim's portal account is `ceo@koocester.com`**, not the gmail address (which still appears as a legacy alias in the code).
- **The trap that cost a day (2026-07-20):** an HR-base field described itself as "the portal sign-in join key." It is not. The gates read `profiles`. A document is a claim; the running query is the fact.

## The four identity questions

Each gate asks one of these. Each is answered by a specific `profiles` column or database function — not by a hardcoded list.

| Question | Answered by | Changed where | Reads it |
|---|---|---|---|
| Is this person a manager? | `profiles.is_manager` (boolean) | Admin → Permissions | `portal.html`, `mgmt-deck.js`, `manager/koo-manager-guard.js`, `koo-nav.js` |
| Which dashboard may they see? | `profiles.dashboard` (`command`\|`growth`\|`sales`\|`finance`\|`hr`\|`tech`\|NULL) | Admin → Permissions | `dash.js` |
| Are they an admin? | `profiles.is_admin` | Admin → Permissions | guards; also bypasses deck locks |
| Are they the founder? | DB function **`is_founder()`** — ⚠️ actually returns `profiles.is_admin` (any admin; today only Hakim) | database | `academy-access.js` → `KOO_ACCESS.isFounder`; Academy founder tools |

- **Granting access is a one-row edit, no redeploy.** Do it in **Portal → Admin → Permissions** (`admin/permissions.html`).
- **Hardcoded fallback lists still exist** in `dash.js`, `mgmt-deck.js`, `hr-feed.js`, and `portal.html` as frozen break-glass, consulted only if the `profiles` columns vanish. **Do not edit them to grant access** — edit the column.
- `can_reassign` (Hakim **and** Bhavani) gates the role-reassignment tools, and is **not** the same as `is_admin` or `is_founder()`. Keep the three distinct.

## Soft gates vs hard gates

The distinction is the whole security design. Get it wrong and confidential data leaks or the whole team gets locked out.

### Hard gates — fail closed, real boundary

- **`functions/_middleware.js`** — edge auth on every request. No valid `koo_session` cookie → `302`/`401`, no body. Validates against Supabase `/auth/v1/user` (so account deletion revokes within ~2 min). Three-way outage handling: trust a validated token 120s with no call, up to 10 min if Supabase is unreachable, **but never admit a token it has not seen** — an outage cannot be used to forge entry.
- **`functions/dash.js` / `mgmt-deck.js` / `hr-feed.js`** — verify the Bearer token, resolve the role, proxy the one feed the caller may see, inject Basic-Auth server-side. Any missing/invalid token, unmapped role, or upstream error → `403`/`401`/`502`. See [02](02-functions-and-numbers.md).

These three endpoints are on the middleware's `PUBLIC_PATHS` allowlist **on purpose**: they are called by `fetch()` with an `Authorization: Bearer` header, not a cookie, and they do their own hard check. If the middleware redirected them, the caller would follow the `302` and silently render the login page inside the iframe. They are not holes — they self-gate and fail closed.

### Soft gates — fail open, routing only

- **`academy-access.js`** exposes `window.KOO_ACCESS.ready` → `{ email, roleSlug, department, isAdmin, isFounder, mismatch, decks, assigned, degraded }`. It reads `academy_me`, `academy_my_decks`, `academy_decks`, `profiles`, and `is_founder()`.
- **If Supabase is unreachable it sets `degraded=true` and callers fail OPEN** — a network blip must never lock someone out of their own training. This makes it a **routing and focus** mechanism, not a boundary. **Anything genuinely confidential must not live behind it** — the middleware is what actually protects deck delivery.
- `KOO_ACCESS.can(access, deck)` returns `true` when degraded or admin, `true` for non-curriculum pages (Brand Assets, Leaderboard, sales kits are never gated), and otherwise checks the person's assigned deck set.
- `is_founder()` defaults to **false** on every failure path (signed out, no role, DB down), so the founder-only tools fail **closed** even though the surrounding gate fails open.

## Who trains on what (curriculum)

- **Source of truth:** HR base **`Academy Role`** (`flduSUiDIi`), **not** `Department` — Marketing alone spans coordinator, strategist, events, community.
- Read at runtime via `academy_me` / `academy_my_decks`.
- A blank `Academy Role` → no curriculum can be assigned → the person lands in the mismatch queue.

## A person's name (display vs search)

- `preferred_name` is what to **display**; `full_name` is the legal name and what to **search**.
- They often share no substring — **Farel** is `Muhammad Fajrin Syahrullah Alfarel`; **Audrey** is Siti Kusmini. Searching only the display name will wrongly report a real colleague as missing. Always search `full_name` too.

## 30-second verifications

| Claim | Check |
|---|---|
| A leaver is locked out | delete their auth account; within ~2 min the edge gate `302`s them |
| A manager sees their dashboard | `profiles.is_manager = true` and `profiles.dashboard` set to their feed |
| The directory is complete | `people.html` reads `hr_directory` (35 active), **not** `profiles` (portal logins only) |
| The founder tools are locked down | `is_founder()` returns true for Hakim, false for anon; ⚠️ still unconfirmed for a non-founder staff member (see SOURCES_OF_TRUTH #4) |
