# metabase/

Documentation folder for Metabase. No dashboard exports are committed (they can embed data); document + rebuild from [../docs/08-metabase-setup.md](../docs/08-metabase-setup.md).

- **Connection:** db id **34** = Supabase Postgres (SSL). Placeholders in [../.env.example](../.env.example).
- **Dashboards:** CEO (67, 23 cards), Content Performance (100, 13 cards).
- **Archive:** the H2 "Sample Database" + "E-commerce Insights" demo dashboard.
- Cards are native SQL (created by the `Claude MCP` API user); preserve the `_fivetran_deleted` guards and the `>= 48` completeness rule.

To export a dashboard for reference, scrub any embedded data before committing.
