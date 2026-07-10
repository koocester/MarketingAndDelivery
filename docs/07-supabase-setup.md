# 07 — Supabase Setup

*Verified live via Metabase MCP, 2026-07-10. No connection secrets reproduced.*

## Purpose
Central Postgres 17 warehouse ("Koocester Group", Metabase db id **34**, Supabase pooler `aws-1-ap-southeast-1`, SSL required). Holds performance, finance, CRM, and accounting data for BI.

## Schemas & tables (analytics)
| Schema | Pipeline | Key tables (rows) |
|---|---|---|
| `content_perf` | **n8n / Metricool** | `reels` (3,577), `metricool_snapshots` (1,008) |
| `finance` | **n8n / Aspire** | `aspire_transactions` (109), `aspire_accounts` (2) |
| `marts` | dbt | `targets` (25) — **orphaned, no card reads it** |
| `public` | app | `command_ai_cache` (2) |
| `hubspot` | **Fivetran** | `contact` (4,309), `deal` (166), `deal_stage` (183), `company` (320) + ~44 |
| `xero` | **Fivetran** | `invoice` (436), `payment` (304) + ~34 |
| `xero_staging` / `xero_reports` | dbt | `stg_xero__*`, `int_xero__*` — **built but unused by BI** |
| `fivetran_metadata` | Fivetran | sync bookkeeping |

**Platform schemas (do not use for reporting):** `auth`, `storage`, `realtime`, `vault` (**secrets — never query**), `extensions`.

## SQL / migrations / edge functions detected
- **None found locally** — there is no `supabase/` CLI project, migrations folder, or edge-functions dir on the laptop. Schema is managed by Fivetran (raw) + a dbt project (whose source repo was **not located** — open question) + n8n loaders. See `supabase/README.md`.

## RLS policies
- Not inspected in this read-only pass (would require the Supabase dashboard). Warehouse tables are read by Metabase via a service connection; **open item** to document RLS if any.

## Environment variables
`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_HOST`, `SUPABASE_DB_PASSWORD` — placeholders in [.env.example](../.env.example); live values in the n8n `Postgres account` credential / Supabase dashboard.

## How data enters Supabase
- **Fivetran** → `hubspot`, `xero` (managed).
- **n8n** → `content_perf` (Metricool syncs), `finance` (Aspire sync). **If these go stale, look at n8n, not Fivetran.**
- **dbt** → `marts`, `xero_staging/reports` (source repo TBD).
- No manual loads detected.

## How agents read Supabase
Read-only via the **Metabase MCP** (`execute_query`) or via Metabase cards. Direct Postgres access uses the n8n credential — not exposed to agents.

## How Metabase connects
Metabase db id **34** = this Supabase Postgres (SSL). All business cards query it. See [08](08-metabase-setup.md).

## Safe validation queries (read-only)
```sql
select count(*) from content_perf.metricool_snapshots;   -- expect ~1,008
select max(snapshot_date) from content_perf.metricool_snapshots;  -- freshness
select count(*) from finance.aspire_transactions;         -- expect ~109
select count(*) from hubspot.deal where not coalesce(_fivetran_deleted,false);
```

## Backup & restore
- Supabase provides managed PITR/backups (confirm plan tier — **open question**).
- dbt models are rebuildable **if** the dbt repo is located; raw Fivetran schemas re-sync from source.

## Common issues
- `metricool_snapshots` history lost if a loader **overwrites** instead of appends.
- Pooler connection limits under load.
- The "magic 48" completeness rule downstream in Metabase.
