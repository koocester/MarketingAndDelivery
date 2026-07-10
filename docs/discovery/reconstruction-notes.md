# Reconstruction Notes

How this repo was reconstructed, what is fact vs assumption, and what remains open.

## Method

The GitHub repo was empty; the working system lives on the CEO's laptop and in cloud SaaS. Reconstruction combined:
1. **Read-only laptop discovery** (2026-07-10) — filesystem, MCP configs, cron/launchd, shell history (redacted), and a scan for project code/`.env` files. See [inventory.md](inventory.md).
2. **Live cloud inventory via MCP connectors** (read-only) — n8n (`n8n-mcp`), Supabase + Metabase (`metabase`), and Lark Base (`lark`). Two read-only sub-agents captured the n8n workflow set and the analytics stack; findings are folded into the docs.
3. **Operational history** from the CEO's second-brain notes (decisions, prior migration/handover work) — used only to corroborate, always marked where not live-verified.

> Exact Claude Code session transcripts were not found. Requirements and design decisions were reconstructed from the working laptop setup, discovered files, configs, scripts, the live n8n/Supabase/Metabase/Lark state, and user-provided context. Where something could not be verified, it is written as an **open question**, not invented.

## Key reconstructed facts (verified live)

- **There is no local runtime.** No `~/.n8n`, no Docker, no crontab, no project LaunchAgents. All automation runs in **n8n Cloud**; all data lives in **Supabase**; dashboards in **Metabase**; the system of record is **Lark Base**.
- **The only local code** is the Vercel SMM-Carousel dashboard app (`apps/smm-carousel-dashboard/`) and `scripts/build_dashboard.py`. Both are secret-free (env-var based).
- **n8n:** 26 workflows (15 active) on `koocester.app.n8n.cloud`. Full inventory in [../09-n8n-setup.md](../09-n8n-setup.md).
- **Data:** Supabase Postgres (Metabase db 34) with `content_perf` (Metricool, n8n-fed), `finance` (Aspire, n8n-fed), and Fivetran-replicated `hubspot` + `xero`. Metabase = CEO Dashboard (67) + Content Performance (100).
- **Lark M&D base** `BG8PbaZFna1NQksNWkglTN85gSf` = system of record (19 tables).

## Boundaries respected

- Nothing in the working setup was modified, triggered, activated, or deleted.
- No production writes to Lark/HubSpot/Xero/Supabase/Metabase/n8n.
- No secrets were opened or copied; no personal vault files were pulled into the repo.
- Work is isolated on branch `docs/system-reconstruction`; nothing pushed.

## Assumptions flagged for confirmation

- `.env.example` variables for the cloud services (Supabase/Metabase/HubSpot/Xero/n8n/Metricool/Anthropic) are **inferred** from how the services are used, since there is no local `.env` for them (they live in n8n Cloud creds / Vercel env / MCP configs). Each is marked **needs confirmation**.
- AnyCross (real-time Lark fan-out) has **no MCP connector**, so that plane is mapped from operational history, not re-verified live.

## Prior artifact note

An earlier, smaller `system-handover/` folder was drafted this session; its verified content is superseded by and folded into this fuller package. It can be removed once this package is accepted.
