# 06 — Connectors & Integrations

Every connector, in a consistent template. **Owner** is a placeholder — assign real names. All secrets are referenced by name only.

---

## Lark
- **Business purpose:** system of record for content ops; also the data source for the Vercel carousel dashboard.
- **Owner:** <OWNER>
- **Auth:** Lark app (App ID + App Secret) → tenant access token, server-side. MCP uses a Lark MCP auth token.
- **Env vars:** `LARK_APP_ID`, `LARK_APP_SECRET`, `LARK_APP_TOKEN`, `LARK_TABLE_ID`, `LARK_DOMAIN`.
- **Files:** `apps/smm-carousel-dashboard/api/carousels.js`; `connectors/lark/README.md`.
- **n8n involvement:** many workflows call Lark (token → Bitable read/write, Messenger sends). Several **hardcode the app secret inline** (🔴 S2–S5, see [15](15-security-and-secrets.md)).
- **Data pulled:** Bitable records (carousels, videos, pages, projects). **Data pushed:** brief messages to chats; batch record writes in sync workflows.
- **Schedule/trigger:** on-demand (Vercel/MCP) + n8n cron.
- **Logs:** n8n executions; Vercel function logs.
- **Failure modes:** token expiry (auto-refresh handled), app not added as Base collaborator → empty results, scope missing (`bitable:app:readonly`).
- **Safe test:** read-only `GET /api/carousels` on Vercel; MCP `bitable_v1_appTableRecord_search` (read).
- **Extend:** add scope + publish app version; update field mapping in `mapRecord`.

## HubSpot
- **Purpose:** CRM (contacts, deals, companies) → warehouse; source for CEO sales cards.
- **Owner:** <OWNER> · **Auth:** Private App token (Fivetran-held) + HubSpot MCP (OAuth) for reads.
- **Env vars:** `HUBSPOT_PRIVATE_APP_TOKEN` *(needs confirmation — held in Fivetran)*.
- **Files:** none local; Supabase `hubspot` schema.
- **n8n:** none direct (Fivetran-managed).
- **Data pulled:** contacts (4,309), deals (166), companies (320) into Supabase `hubspot`. **Pushed:** none.
- **Schedule:** Fivetran managed sync. **Logs:** Fivetran + `fivetran_metadata`.
- **Failure modes:** Fivetran sync lag/auth expiry; deleted-row flags (`_fivetran_deleted`) must be filtered in cards.
- **Safe test:** read `hubspot.deal` via Metabase MCP.
- **Extend:** add HubSpot objects in Fivetran; new Metabase card with home-currency amount + deleted guards.

## Xero
- **Purpose:** accounting (invoices, payments) → warehouse; AR/cash cards.
- **Owner:** <OWNER> · **Auth:** Xero OAuth2 (client id/secret/tenant, Fivetran-held) + Xero MCP for reads.
- **Env vars:** `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET`, `XERO_TENANT_ID`, `XERO_REDIRECT_URI` *(needs confirmation)*.
- **Files:** none local; Supabase `xero` (+ unused dbt `xero_staging`/`xero_reports`).
- **n8n:** none direct. **Data pulled:** invoices (436), payments (304). **Pushed:** none.
- **Schedule:** Fivetran. **Logs:** Fivetran.
- **Failure modes:** OAuth token expiry; the Xero MCP returns totals + top-N only (no full invoice list / no aged-receivables tool).
- **Safe test:** Xero MCP `get_contacts_and_receivables` (read-only).
- **Extend:** raw `xero.*` is what cards use — the dbt layer is currently bypassed (decide before building on it).

## Supabase
- **Purpose:** central Postgres warehouse (analytics).
- **Owner:** <OWNER> · **Auth:** Postgres role / service key; n8n uses managed `Postgres account` cred.
- **Env vars:** `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_HOST`, `SUPABASE_DB_PASSWORD` *(needs confirmation)*.
- **Files:** `supabase/README.md`. **n8n:** writes `content_perf` + `finance`; reads for briefs/dashboard.
- **Data in:** Fivetran (`hubspot`,`xero`) + n8n (`content_perf`,`finance`). **Out:** Metabase reads.
- **Schedule/trigger:** continuous (Fivetran) + n8n cron. **Logs:** Supabase logs; n8n executions.
- **Failure modes:** loader overwrites history (`metricool_snapshots` must append); pooler connection limits; `vault` schema is secrets — never query.
- **Safe test:** `SELECT count(*)` via Metabase MCP. **Extend:** see [07](07-supabase-setup.md).

## Metabase
- **Purpose:** BI dashboards on Supabase.
- **Owner:** <OWNER> · **Auth:** Metabase login + API key (MCP).
- **Env vars:** `METABASE_SITE_URL`, `METABASE_DATABASE_ID=34`, `METABASE_API_KEY` *(needs confirmation)*.
- **Files:** `metabase/README.md`. **n8n:** none (n8n serves its own Command dashboard separately).
- **Data:** reads Supabase db 34. **Dashboards:** CEO (67), Content Performance (100).
- **Failure modes:** stale metadata sync; the "magic 48" completeness rule silently drops days; native-SQL cards need SQL edits.
- **Safe test:** read dashboards via Metabase MCP. **Extend:** see [08](08-metabase-setup.md).

## n8n
- **Purpose:** the scheduler + outbound + Command dashboard API.
- **Owner:** <OWNER> · **Auth:** n8n Cloud login; MCP uses `N8N_API_KEY`; per-service creds inside n8n.
- **Env vars:** `N8N_BASE_URL`, `N8N_WEBHOOK_URL`, `N8N_API_KEY`, dashboard Basic-Auth *(mostly managed inside n8n)*.
- **Files:** `n8n/` (workflow docs + redacted exports + credential templates).
- **Data:** reads Supabase/Lark; writes Supabase + Lark messages. **Trigger:** cron + webhooks.
- **Failure modes:** 🔴 inline secrets; no error alerting (stub); unauthenticated webhooks.
- **Safe test:** `n8n_list_workflows` / `n8n_get_workflow` (read). **Do NOT** activate/execute production workflows without approval. **Extend:** see [09](09-n8n-setup.md).

## MCP connectors (agent control plane)
- **Purpose:** how Claude Code / the desktop app reach the system.
- **Local config:** `~/.claude.json` (global: `metabase`, `n8n-mcp`), `claude_desktop_config.json` (`lark`), per-project `playwright`. **claude.ai-managed** connectors add HubSpot, Xero, Brevo, Canva (OAuth, not in local files).
- **Auth:** API keys / OAuth held by the connector runtime (in the config files or claude.ai) — **git-ignored, never copied**.
- **Failure modes:** token expiry → connector disconnects; a disconnected MCP does **not** break production data flow.
- **Safe test:** list tools; run read-only calls. **Extend:** `claude mcp add <name> …` (CLI) or claude.ai connector settings.

## Metricool (external feed)
- **Purpose:** social metrics (followers + reels) → Supabase `content_perf`.
- **Auth:** `X-Mc-Auth` API key — 🔴 **hardcoded inline across ~4 n8n workflows** (S6).
- **n8n:** `Metricool Followers Sync` + 3 `Reels Sync` (cron 07:00–09:00). **Failure modes:** key rotation touches dozens of nodes; the completeness "48" rule downstream.
- **Safe test:** inspect last n8n execution (read). **Extend:** add pages/markets → update the `48` rule ([08](08-metabase-setup.md)).

## Aspire (external feed)
- **Purpose:** card spend + balances → Supabase `finance`.
- **Auth:** OAuth2 (managed n8n cred `Aspire`). **n8n:** `Aspire → Supabase Sync` (cron 23:00 UTC).
- **Data:** accounts (2) + 7-day transactions (109). **Note:** card float only — **not** a runway source.
- **Safe test:** read `finance.*` via Metabase MCP.

## Anthropic (external service)
- **Purpose:** summarise briefs / candidate analysis in n8n.
- **Auth:** API key — managed cred `Anthropic API – Koocester` exists, but 🔴 a raw key is **hardcoded** in Candidate Analysis (S1).
- **n8n:** brief + Command AI cache + Candidate Analysis. **Safe test:** none needed (outbound only); do not run candidate pipeline in prod without approval.
