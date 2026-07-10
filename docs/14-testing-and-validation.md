# 14 — Testing & Validation

**Principle:** read-only by default. Never write to production systems or trigger workflows without explicit approval.

## Safe, non-destructive checks

**Repo / secrets**
```bash
git status                     # confirm branch + intended changes only
# secret scan before every commit:
grep -rInE 'sk-ant-|service_role|eyJ[A-Za-z0-9_-]{20,}|app_secret\s*[:=]|X-Mc-Auth|cli_[a-z0-9]{16}' . \
  --exclude-dir=node_modules --exclude-dir=.git || echo "CLEAN"
```

**Vercel app**
```bash
cd apps/smm-carousel-dashboard
node --check api/carousels.js   # JS syntax check (no network)
npx vercel dev                  # then GET /api/carousels (read-only Lark read)
```

**Supabase (read-only via Metabase MCP)**
```sql
select max(snapshot_date) from content_perf.metricool_snapshots;
select count(*) from finance.aspire_transactions;
```

**n8n (read-only)**
- `n8n_list_workflows`, `n8n_get_workflow`, `n8n_executions` — inspect only. **Do not** `Execute`/activate/deactivate in prod without approval.

**Metabase**
- Open dashboards read-only; cross-check a card vs a direct `SELECT`.

## What is explicitly OUT of bounds without approval
- Triggering n8n workflows (sends messages / writes data).
- Any HubSpot / Xero / Lark / Supabase / Metabase **write**.
- Activating/deactivating workflows.
- Deleting anything.

## Validation matrix
| Change area | Safe validation |
|---|---|
| Vercel app | `node --check`, `vercel dev`, `/api/carousels` |
| Metabase card | direct `SELECT` cross-check |
| n8n workflow | read execution history; test on a test chat/table |
| Supabase loader | `max(date)` freshness + row counts |
| Docs | link check (below) |

## Doc link check (optional, safe)
```bash
grep -roE '\]\(([^)]+)\)' docs README.md | sed -E 's/.*\(([^)]+)\)/\1/' | sort -u   # eyeball relative links exist
```
