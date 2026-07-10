# How the Briefs & Command Dashboard Read the Base

The exact mechanics of the four n8n workflows that turn the M&D base + Supabase into leadership intelligence. This is the other half of the base→dashboard connection (the operational/live-read side). Secrets and recipient IDs redacted.

## The two-source pattern (read this first)
- **Quantitative business truth** (money, leads, followers, engagement) → **Supabase/Postgres**, one big `json_build_object(...)` query per workflow against `xero` / `hubspot` / `finance` / `content_perf`.
- **Operational pipeline state** (who holds what, which stage is jammed, per-person load) → **live Lark Bitable `records/search`** against M&D base `BG8PbaZFna1NQksNWkglTN85gSf` — counts from `data.total` (`page_size=1`), detail from paged 500-row scans, with stage→owner logic + a Pages record-id→name map done in JS.
- **Anthropic `claude-haiku-4-5`** turns merged numbers into a ranked action list.

## Shared primitives
1. **Lark tenant token** — `POST /open-apis/auth/v3/tenant_access_token/internal` (app `cli_aa914316d6b8deed`, secret redacted). Authorizes Bitable reads + IM sends.
2. **Supabase** — credential "Postgres account" (`iLlaPQLaICzc44cH`), read-only.
3. **Bitable search** — `POST /bitable/v1/apps/BG8PbaZFna1NQksNWkglTN85gSf/tables/{table_id}/records/search`.

## M&D base tables these workflows read
| table_id | Table | Read for |
|---|---|---|
| `tbl8wIByJQwhIUei` | Videos | stage histogram, 4 overdue flags, per-role owners, dates |
| `tblnMZctdGYfXjYL` | Carousels | stage counts, Copywriter, upload date |
| `tblUscIBwxElzzXi` | Pages | record_id→page-name map ("pages at risk") |
| `tblAJKbb2UZRh8rn` | Projects | client-project count, Status (Manual), Engagement |
| `tblWpq8b0uo1vBtX` | **Client accounts / sales pipeline** | Status (New / Active / Completed) |
| `tblA7Ick2xpH4T5H` | **Events** | next event, last outcome, missing-outcome gap |

> Note: the last two tables are additional to the four core tables — worth knowing they exist and feed the briefs.

## 1. CEO Daily Brief — `c3OAv5oJRanDv8UH` (cron `0 8 * * *`)
- **Lark:** `M&D Overdue` (OR across the 4 overdue flags, ≤200 rows) → bucketed bottleneck line; `Compose Manager` fires ~20 per-stage count queries across Videos+Carousels + a "Ready-to-Upload with empty Intended Upload Date" query + a 500-row overdue scan ranked by page and by assignee (owner picked by stage).
- **Supabase:** finance (collected/invoiced MTD, AR out/overdue, pipeline, Aspire float, spend 7d, won-by-market), sales (leads MTD, deals 7d), audience (followers + DoD%), content (reach 7d, engagement p90/p95, top reel).
- **AI:** Anthropic Haiku (`max_tokens 300`) → "⚡ TODAY" list; `onError: continueRegularOutput` (brief still sends if AI fails).
- **Output:** plain-text Lark messages → CEO DM + Management chat + a Manager chat that `@`-mentions role owners. 🔴 inlines the Lark secret (S4).

## 2. Weekly Management Report — `yv5Pz0hpX3kHKvVE` (cron `0 8 * * 1`, Asia/Singapore)
- **Supabase:** collected MTD+7d, AR out/overdue, total non-flagship followers.
- **Lark:** `Ops Data` code node — Videos stage histogram; Projects client count + completed; Client accounts Status pipeline; Events (next event, last outcome, missing-outcome gap).
- **AI:** Haiku (`max_tokens 400`) → "THE WEEK IN ONE LINE" + 3 moves.
- **Output:** CEO + Mgmt messages; points to the vault HTML report. 🔴 inlines the Lark secret (S4).

## 3. Koocester Command dashboard — `ePDPNKpgKdz4SUMZ` (6 Basic-Auth webhooks)
- **Trigger:** `GET /command /growth /sales /finance /hr /tech`, each its own Basic-Auth cred.
- **Flow:** webhook → Lark token → `Metrics` (Supabase mega-query) → `Compute` → `AI Cache` → `Build` → `Respond` (HTML).
- **Lark (`Compute`):** per-stage counts on Videos+Carousels; unscheduled Ready-to-Upload; Pages map; 500-row overdue scan → overdue-by-person/page; full paged scans to compute a per-person **Team** table (Active/Overdue/shipped-7d by role, using Shoot Date / Actual Upload Date + terminal-stage exclusion).
- **Supabase:** finance/sales/audience via `Metrics`; **reads `public.command_ai_cache` (latest row)** — the dashboard does **not** call Anthropic live; it reuses the cached daily analysis.
- **Output:** one self-contained HTML page; `Build` decodes a base64 template, injects `__DATA__` JSON, then role-scripts **prune tabs by role** (CEO all; growth sees Growth+Team; others see only their tab; cash nulled for non-finance). HR/Tech tabs are placeholders ("data source not connected"). ✅ no inline secrets — reference pattern.

## 4. Command AI Cache — `m7n7555E2t6Wlvkk` (cron `0 8 * * *`)
- The **writer** feeding #3's cache. Reads Supabase (`Metrics` + `Geo` two-snapshot follower query) + two Lark counts on Videos (Strategist QC queue, total Overdue).
- **AI:** Haiku (`max_tokens 1100`) → strict JSON (`tasks[]` tagged `[Cash]/[People]/[Machine]/[Direction]`, `focus`, `finance`, `sales`, `growth`, `social`); `Store` runs `CREATE TABLE IF NOT EXISTS public.command_ai_cache` then `INSERT … payload jsonb`. Only rows with a valid `focus` are stored → dashboard always reads the last good analysis. ✅ no inline secrets.

## Delivery diverges
Briefs **push** plain-text to Lark chats on a cron; the Command dashboard **pulls** on demand via Basic-Auth webhooks and returns role-pruned HTML.
