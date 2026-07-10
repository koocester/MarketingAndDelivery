# supabase/

Documentation folder for the Supabase warehouse. **No SQL/migrations/edge-functions were found locally** — the schema is managed by Fivetran (raw `hubspot`/`xero`), a dbt project (source repo **not located** — open question), and n8n loaders (`content_perf`, `finance`).

- Full setup + schema: [../docs/07-supabase-setup.md](../docs/07-supabase-setup.md).
- If a Supabase CLI project or dbt repo is located later, add it here (migrations under `supabase/migrations/`, functions under `supabase/functions/`).
- **Never** commit connection strings or service-role keys.

## Safe validation (read-only, via Metabase MCP)
```sql
select max(snapshot_date) from content_perf.metricool_snapshots;
select count(*) from finance.aspire_transactions;
```
