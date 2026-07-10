# connectors/hubspot

**HubSpot** (CRM) replicates to Supabase via **Fivetran**; the CEO Dashboard sales cards read the `hubspot` schema. No local code.

- **Auth:** HubSpot Private App token (held by Fivetran); HubSpot MCP (OAuth) for agent reads.
- **Env:** `HUBSPOT_PRIVATE_APP_TOKEN` *(needs confirmation — in Fivetran)*.
- **Data:** `hubspot.contact` (4,309), `deal` (166), `company` (320) + more → Supabase.
- **Cards:** Open Pipeline SGD, Won/Open by Market, Deals Created/Week, New Leads/Month.
- **Gotchas:** filter `_fivetran_deleted`/`is_deleted`; amounts via `property_amount_in_home_currency` (SGD).
- **Safe test:** read `hubspot.deal` via Metabase MCP.
- **Extend:** add objects in Fivetran; new Metabase card following the guards above.

Full template: [../../docs/06-connectors-and-integrations.md](../../docs/06-connectors-and-integrations.md).
