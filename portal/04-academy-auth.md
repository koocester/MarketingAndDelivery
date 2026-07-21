# Portal 04 — Academy Auth (sign-in, sessions, roles, permissions)

The identity subsystem behind the whole portal. Source: [`src/login.html`](src/login.html), [`src/koo-auth-guard.js`](src/koo-auth-guard.js), [`src/academy-access.js`](src/academy-access.js), [`src/functions/_middleware.js`](src/functions/_middleware.js), [`src/admin/`](src/admin), [`src/manager/`](src/manager). Nothing here is vague — every claim names the file and the column/RPC that decides it.

## 1. Sign-in — passwordless email OTP (`login.html`)

No passwords exist anywhere in this system. Sign-in is a Supabase one-time code:

1. User enters a `@koocester.com` email. **Client allowlist:** `isAllowed()` accepts `*@koocester.com` (plus the legacy `ceo@koocester.com`). This is convenience validation, not the boundary — Supabase decides who actually gets a code.
2. `supabase.auth.signInWithOtp({ email, options:{ shouldCreateUser:true, emailRedirectTo } })` emails a 6-digit code (and a magic link). `shouldCreateUser:true` means a first-time valid staff email auto-provisions an `auth.users` row.
3. User types the code → `supabase.auth.verifyOtp({ email, token, type:'email' })`. On success the session is live.
4. **Rate limit:** Supabase blocks a fresh code for ~50s; the page runs a resend countdown and, on a 429, lets the user enter the code already sent rather than hard-blocking.

**Delivery:** the OTP/magic-link email is sent by Supabase Auth via the project's SMTP (Resend). SMTP credentials live in Supabase project settings, **not** in this source.

## 2. The session cookie — why it exists and its exact shape

Supabase stores the session in `localStorage`. **Cloudflare's edge middleware cannot read `localStorage` — it only sees cookies.** So the browser mirrors the access token into a cookie the edge can read:

```
koo_session = <supabase access_token>
Path=/ ; Max-Age=34560000 (400 days) ; SameSite=Lax ; Secure
```

- **Not `HttpOnly`, on purpose:** the browser has to write and refresh it, and the same token already sits in `localStorage`, so `HttpOnly` would buy nothing.
- **400-day lifetime is safe** because the cookie is **not** the security boundary — `_middleware.js` revalidates the token against Supabase on every request (see [01](01-access-and-gates.md)). A stale or revoked token in a long cookie is still refused. Length just avoids bouncing people through login while their Supabase session is still good.
- **Token rotation is mirrored:** Supabase rotates the access token ~hourly; `onAuthStateChange` rewrites the cookie every time, so the next navigation after a rotation isn't refused. Both `login.html` and `koo-auth-guard.js` do this.

## 3. Redirect safety — `safeNext()`

After login the user is sent to `?next=`, but only if it passes `safeNext()`: a **relative `*.html` path**, no leading `/`, no `//`, no `..`. Anything else falls back to `portal.html`. This is why the middleware re-adds `.html` to extensionless deck URLs before putting them in `?next=` — otherwise the round-trip silently drops the destination. Absolute/protocol-relative/traversal targets are rejected, so the redirect can't be used to bounce a user off-site.

## 4. The gate stack (four layers, precisely)

A request passes through up to four checks. The two server-side ones are the real boundary; the two client-side ones are routing.

| Layer | File | Reads | Fails | Redirect / effect |
|---|---|---|---|---|
| Edge front door | `functions/_middleware.js` | Supabase `/auth/v1/user` | **closed** | 302 login / 401 asset, before delivery |
| Deck curriculum | `koo-auth-guard.js` + `academy-access.js` | `academy_me`, `academy_my_decks`, `academy_decks` | **open** | "This module is not part of your training" screen |
| Admin pages | `admin/koo-admin-guard.js` | `profiles.is_admin` | **open** | non-admin → `/portal.html` |
| Manager pages | `manager/koo-manager-guard.js` | `profiles.is_manager` (fallback: frozen email list) | **open** | non-manager → `/portal.html?why=not-manager` |

**Why the client guards fail open:** a network blip must never lock a staff member out of their own training. That is acceptable *only* because the edge middleware already gated delivery — the client guards do routing (which deck, which page), not protection. **Corollary: nothing genuinely confidential may live behind a client guard alone.**

## 5. Roles & entitlement — one column or function each

`academy-access.js` resolves `window.KOO_ACCESS.ready` → an `Access` object. Each field has exactly one source of truth:

| Field | Source of truth | Notes |
|---|---|---|
| `email`, `fullName` | `academy_me` → `profiles` | `preferred_name`/`full_name`, **never** the email prefix (`ceo@` is not "Ceo") |
| `roleSlug` / `roleLabel` / `department` | `academy_me` (from HR base **`Academy Role`**) | blank role → `assigned:false` → mismatch queue |
| `decks` | `academy_my_decks` | the set of deck filenames this person may open |
| `knownDecks` | `academy_decks` | every curriculum deck; pages absent here are **never** gated |
| `isAdmin` | `profiles.is_admin` | also bypasses deck locks |
| `canReassign` | `profiles.can_reassign` | Hakim **and Bhavani**; gates the role inspector — **not** `is_admin` |
| `isFounder` | DB function **`is_founder()`** | ⚠️ returns `profiles.is_admin` (any admin; today only Hakim) — see §8; defaults **false** on every failure path (fails closed) |
| `mismatch` | `academy_me.mismatch` | Lark HR and portal profile disagree on this person |
| `degraded` | (set on any query/network error) | callers fail **open** |

**Keep the three "elevated" concepts distinct — they are different jobs:**
- `is_admin` — bypasses deck locks; also true for Tech and the academy admins.
- `can_reassign` — may reassign roles (Hakim + Bhavani).
- `is_founder()` — gates reading the org's whole role map and every unbuilt module. ⚠️ **Defined as `profiles.is_admin`** (see §8) — true for any admin; today only Hakim is one.

## 6. Permissions admin — `admin/permissions.html`

The one place access is changed, and it is **data, not code**: it calls three `SECURITY DEFINER` RPCs — `list_permissions()`, `set_permissions()`, and `is_founder()` — so the grant logic runs in the database under founder gating, not in the browser. Editing `profiles.is_manager` / `profiles.dashboard` / `profiles.is_admin` here takes effect immediately, no redeploy. The hardcoded fallback lists in the Functions are frozen break-glass only (see [02](02-functions-and-numbers.md)).

## 7. Training completion — `completions.html`

Reads `roster`, `profiles`, and `progress` (the completion-tracking views/tables in the portal Supabase) to show who has finished which module. This is reporting over the same identity; it is not a gate.

## 8. ✅ `is_founder()` — VERIFIED 2026-07-21, and it is misnamed (latent bug)

**Read the definition directly** in the Supabase SQL editor (project `lfppmsppvqtjyusfrlkf`), via `pg_get_functiondef`:

```sql
CREATE OR REPLACE FUNCTION public.is_founder()
 RETURNS boolean
 LANGUAGE sql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
  SELECT COALESCE((SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid()), false)
$function$
```

**It is not a founder check. It returns `profiles.is_admin` for the caller.** So `is_founder()` is true for **any** admin, not Hakim specifically.

**Current state (verified same session):** exactly **one** profile has `is_admin = true` — `ceo@koocester.com` (Hakim). So *today* the function returns true for Hakim alone and false for everyone else. The behaviour is correct **right now, by coincidence**, because Hakim is the only admin.

**⚠️ The latent bug.** `is_admin` is the flag you grant Tech or an academy admin to let them bypass deck locks (see §5). The moment `is_admin` is set on anyone else, that person **also** passes `is_founder()` and gains the founder-only tools — the role inspector, dev view, and coverage map, which expose the org's whole role map and every unbuilt module. The name promises "founder"; the code delivers "any admin." This is the classic name-vs-code drift.

**Recommended fix (not yet applied — needs Hakim's go-ahead, it's a production DDL change):** decouple the two. Either key `is_founder()` on a dedicated `profiles.is_founder` column or on Hakim's fixed `auth.uid()`/email, so granting `is_admin` never widens the founder tools. Until then, treat "grant is_admin" as also granting founder-tool visibility.

This corrects `SOURCES_OF_TRUTH.md` #4, which claimed is_founder is "NOT the same as is_admin." The running code is the fact; the registry entry was fixed the same day.

## Verify in 30 seconds

| Claim | Check |
|---|---|
| Sign-in works | request a code to a `@koocester.com` address; a wrong code is rejected by `verifyOtp` |
| The edge gate is live | `curl -sI https://staffacademy.koocester.com/portal.html` with no cookie → `302` to login |
| A leaver is out | delete their `auth.users` row → refused within ~2 min (middleware cache window) |
| Founder tools are locked | run the `is_founder()` check in §8 |
