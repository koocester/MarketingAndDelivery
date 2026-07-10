# connectors/xero

**Xero** (accounting) replicates to Supabase via **Fivetran**; the CEO Dashboard finance cards read the `xero` schema. No local code.

- **Auth:** Xero OAuth2 (client id/secret/tenant, held by Fivetran); Xero MCP for agent reads.
- **Env:** `XERO_CLIENT_ID`, `XERO_CLIENT_SECRET`, `XERO_TENANT_ID`, `XERO_REDIRECT_URI` *(needs confirmation)*.
- **Data:** `xero.invoice` (436), `xero.payment` (304) + more → Supabase. AR outstanding/overdue, invoiced revenue, cash collected.
- **Note:** a dbt `xero_staging`/`xero_reports` layer exists but is **unused by cards** (they hit raw `xero.*`).
- **MCP limits:** returns totals + top-N invoices only; no full invoice list / no aged-receivables tool.
- **Safe test:** Xero MCP `get_contacts_and_receivables` (read-only).

Full template: [../../docs/06-connectors-and-integrations.md](../../docs/06-connectors-and-integrations.md).
