# GitHub Ownership & Repository Safety

Status as verified on **2026-07-22** from the Windows workstation (user `Faiz`). Facts below are discovered; anything marked *assumption* or *unknown* is labelled.

## Current state (facts)

| Item | Value | How verified |
|---|---|---|
| Repository | `koocester/MarketingAndDelivery` | `git remote -v` on the local clone (`~/Documents/GitHub/MarketingAndDelivery`) |
| Owner type | **Personal User account** (`koocester`), not an organization | Unauthenticated GitHub API, 2026-07-22 |
| Visibility | **PUBLIC** | Unauthenticated GitHub API returned the repo (a private repo returns 404) |
| Default branch | `main` | GitHub API + local clone |
| Recent commit identity | "Al Hakim" via a personal gmail address; local git config is `koocester-tech <tech@koocester.com>` | `git log`, `git config` |
| Collaborators / branch protection | **Unknown** — no `gh` CLI or authenticated API access on this machine | — |

## Security review of repo contents (2026-07-22)

- **No secret values found** in the working tree or in the full git history. Scans for JWT (`eyJ…`), `sk-ant-`, `ghp_`, `AKIA…`, and private-key headers matched only documentation examples (the redacted S1 finding record in `docs/15` and the grep recipe in `docs/14`).
- The sanitization pattern is consistent: n8n exports and portal source use `<REDACTED_*>` / `<SUPABASE_ANON_KEY>` placeholders; credential *names/ids* are preserved deliberately.
- **However, the repo publicly exposes** (category, not values):
  - Live **n8n webhook endpoint URLs** (`/webhook/hr-overview`, `/webhook/mgmt-slides`, `/webhook/hr-roster-sync-run`, the six `/dash` feeds). These are Basic-Auth-gated server-side, but public endpoint enumeration lowers the bar for credential-guessing and DoS; `hr-roster-sync-run` is documented as a plain `curl` trigger.
  - Full **internal architecture**, Lark Base/table/field IDs, Supabase project host, Metabase domain, portal gate logic including **break-glass email/role fallback lists**, staff names and roles, and org process detail.
  - The existence and IDs of workflows with known inline-secret findings (S1–S6) — a roadmap for an attacker if any credential ever leaks.

## Risk assessment

A public repo under a personal account means: anyone can read the company's internal system map; continuity depends on one personal account; no organization-level access control, audit, or ownership transfer path if the individual becomes unavailable.

## Recommended route (in order)

1. **Immediately flip visibility to Private** (GitHub → Settings → Danger Zone → Change visibility). Zero downtime; nothing depends on the repo being public (no Pages, no CI, deploys don't pull from GitHub).
2. **Create a company GitHub organization** (e.g. `koocester-group`) with `tech@koocester.com` as owner, and **transfer the repository** into it (Settings → Transfer ownership). GitHub auto-redirects the old URL; update the local clone remote afterwards.
3. Add the CEO/founder and the tech account as org owners; grant others least-privilege roles.
4. Enable **branch protection on `main`** (PRs required, no force-push).
5. After the transfer, rotate the credentials already flagged in `docs/15` (inline n8n secrets S1–S6, portal Function Basic-Auth mantras) — exposure window while public is unknown.
6. **Public template later, only if wanted:** a separate, freshly-created repo with company-specific IDs, URLs, names, and history stripped. Never make *this* repo public again — its history is the company map.

## Explicitly not done in this pass

No visibility change, transfer, collaborator change, or rotation was performed — these are account-level actions for the owner to execute. This document is the recommendation record.
