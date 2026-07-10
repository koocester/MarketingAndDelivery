# ADR-0001 — Reconstructed Current Architecture

**Status:** Accepted (describes the as-built system, reconstructed 2026-07-10).

## Context
The GitHub repo was empty; the working automation/dashboard system was built by hand (Claude Code + desktop + browser) by a non-technical owner. This ADR records the architecture as reconstructed from live inspection so future changes have a baseline.

## Decision
Adopt and document a **four-plane cloud architecture** around Lark as the system of record, with one standalone Vercel app. Keep operational state in Lark, real-time automation in AnyCross, scheduling/outbound in n8n Cloud, and analytics in Supabase + Metabase.

## Reconstructed evidence
- Laptop: no local runtime (no n8n install, Docker, cron, or project LaunchAgents); MCP configs + one Vercel app + one Python script. See [../discovery/inventory.md](../discovery/inventory.md).
- Live MCP inventory: n8n (26 workflows), Supabase (schemas/tables), Metabase (dashboards 67/100), Lark M&D base.

## Role of each system
- **n8n:** the only scheduler; briefs, metric syncs (Metricool/Aspire → Supabase), Command dashboard API. Cloud-hosted.
- **Supabase:** central Postgres warehouse; fed by Fivetran + n8n; read by Metabase.
- **Metabase:** BI dashboards (finance/sales/content) on Supabase.
- **Lark:** system of record; stage machine + SLA formulas + role auto-assign; also the Vercel app's data source.
- **HubSpot:** CRM → Supabase via Fivetran.
- **Xero:** accounting → Supabase via Fivetran.
- **MCP:** agent control plane (Claude Code/desktop reach the system read/write); not part of production data flow.

## Consequences
- **Positive:** low-ops, clear plane boundaries, single source of truth, replaceable parts.
- **Negative / debt:** inline secrets in n8n; no error alerting; unauthenticated webhooks; orphaned `marts.targets`; unused dbt Xero layer; key-person dependency.

## Alternatives considered
- **Lark-native dashboards for BI** — rejected: insufficient for the lead-gen measurement loop (chosen Supabase+Metabase).
- **Self-hosted n8n / Docker** — rejected: higher ops burden for a non-technical owner (chosen n8n Cloud).
- **Custom app for everything** — rejected: build+maintain cost; SaaS + MCP is faster.

## Open questions
- Wire or remove `marts.targets`? Is the dbt Xero layer the intended semantic layer? Where does each cloud secret canonically live? Include the carousel CSV/HTML or not? Where is the dbt source repo?

## Future review date
Re-verify within one quarter of acceptance, or after any secret rotation / plane change.

## Security handling
No secrets recorded. Inline-secret findings tracked in [../15-security-and-secrets.md](../15-security-and-secrets.md); rotation is the top action.
