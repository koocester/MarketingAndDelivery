# connectors/

Per-connector code, configs, and notes. Full narrative + template for each connector is in [../docs/06-connectors-and-integrations.md](../docs/06-connectors-and-integrations.md).

| Folder | System | Local code? | Notes |
|---|---|---|---|
| `lark/` | Lark Base | via `apps/smm-carousel-dashboard` | System of record + carousel dashboard source |
| `hubspot/` | HubSpot CRM | no (Fivetran) | Replicated to Supabase `hubspot` |
| `xero/` | Xero accounting | no (Fivetran) | Replicated to Supabase `xero` |

Other integrations (Supabase, Metabase, n8n, Metricool, Aspire, Anthropic, MCP) have their own top-level folders or are documented in doc 06.

## Adding a connector
1. Read doc 06's template; create `connectors/<name>/README.md` with it.
2. Add env vars to [../.env.example](../.env.example) (placeholders only).
3. Auth via a **managed** store (n8n credential / Vercel env / MCP) — never inline.
4. Document data pulled/pushed, schedule, failure modes, safe test.
5. Update the CHANGELOG.
