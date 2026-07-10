# Koocester Ops System — Engineering Knowledge Base

> Private engineering handover for Koocester Group's content-automation & dashboard system. Written so a **new engineer** or a **future Claude Code session** can understand what exists, how it works, and how to extend it safely — without ever having seen this laptop.

**Reconstructed:** 2026-07-10 from the live system (the GitHub repo was empty; the working setup is on the CEO's laptop + cloud SaaS). **No secrets committed. Nothing pushed.** Branch: `docs/system-reconstruction`.

---

## What this repo is for

The CEO is non-technical; the system was built by hand via Claude Code, desktop control, and the browser. This repo turns that working-but-undocumented setup into a professional knowledge base so the system can be operated, audited, handed over, and safely extended by others.

## The business problem it solves

Koocester runs high-volume content (videos + carousels) across markets. The system:
- runs content through a governed pipeline with enforced SLAs (Lark Base),
- syncs performance + finance data into a warehouse (Supabase),
- shows leadership live dashboards (Metabase + a Command dashboard),
- and pushes daily/weekly/monthly briefings automatically (n8n → Lark).

## What the current working system does

```
Lark Base (system of record)
   │  real-time webhooks
   ▼
AnyCross ── fan-out / assign / notify
   │
   │  scheduled + outbound
   ▼
n8n Cloud ── briefs, metric syncs, Command dashboard API
   │
   ▼
Supabase (Postgres)  ◄── Fivetran (HubSpot, Xero) + n8n (Metricool, Aspire)
   │
   ▼
Metabase (CEO + Content dashboards)   +   Vercel SMM dashboard
```

## What was reconstructed from the laptop

- Confirmed **no local runtime** (no n8n install, Docker, cron, or LaunchAgents) — everything is cloud + MCP.
- Recovered the **only local codebase**: the Vercel SMM-Carousel dashboard (`apps/`) + `scripts/build_dashboard.py`.
- Inventoried the cloud systems live via MCP (n8n, Supabase/Metabase, Lark). See [docs/discovery/](docs/discovery/).

## Integration map

| System | Role | Reached via | Doc |
|---|---|---|---|
| **Lark Base** | System of record (projects/videos/carousels/pages) | `lark` MCP; Vercel app (server-side token) | [06](docs/06-connectors-and-integrations.md) |
| **AnyCross** | Real-time fan-out on record change | (in-Lark; no MCP) | [11](docs/11-agents-and-cron-jobs.md) |
| **n8n Cloud** | Scheduled briefs, metric syncs, Command dashboard API | `n8n-mcp` | [09](docs/09-n8n-setup.md) |
| **Supabase** | Postgres warehouse | `metabase` MCP (reads) | [07](docs/07-supabase-setup.md) |
| **Metabase** | BI dashboards | `metabase` MCP | [08](docs/08-metabase-setup.md) |
| **HubSpot** | CRM → warehouse | Fivetran; HubSpot MCP | [06](docs/06-connectors-and-integrations.md) |
| **Xero** | Accounting → warehouse | Fivetran; Xero MCP | [06](docs/06-connectors-and-integrations.md) |
| **Metricool / Aspire** | Social & card-spend feeds | n8n → Supabase | [06](docs/06-connectors-and-integrations.md) |
| **MCP connectors** | Agent control plane | Claude Code / Desktop | [06](docs/06-connectors-and-integrations.md) |

## Current data flow

1. Work moves through **Lark**; **AnyCross** reacts in real time (assign/notify/calendar).
2. **n8n** (cron) compiles briefs (summarised by Anthropic) → **Lark Messenger**, and syncs **Metricool**/**Aspire** → **Supabase**.
3. **Fivetran** replicates **HubSpot** + **Xero** → **Supabase**.
4. **Metabase** reads Supabase for the CEO + Content dashboards. The Lark **post-URL fields are the join keys** between content and its metrics.

## Who does what: n8n vs scripts vs cron vs agents

- **n8n Cloud** owns *all* scheduling and outbound (briefs, syncs, Command API). There is **no local cron** and **no standalone agent process**.
- **Scripts** (`scripts/`) are one-off/manual generators (e.g. `build_dashboard.py`).
- **Vercel app** (`apps/`) is a live read-only dashboard function.
- **"Agents"** = Claude Code sessions operating via MCP, not deployed daemons.

## Where things live

- **Code:** `apps/` (Vercel dashboard), `scripts/` (utilities).
- **Docs:** `docs/00`→`18` (start at [docs/00-start-here.md](docs/00-start-here.md)).
- **Per-system:** `connectors/`, `supabase/`, `metabase/`, `n8n/`, `agents/`, `cron/`, `config/`.

## How to configure / run / test / deploy

- **Env vars:** copy [.env.example](.env.example) → `.env.local`; set real values in Vercel / n8n Cloud (never commit). See [15](docs/15-security-and-secrets.md).
- **Run locally:** the Vercel app — `cd apps/smm-carousel-dashboard && npx vercel dev`. See [12](docs/12-local-development.md).
- **Test safely:** read-only checks only; never trigger production writes. See [14](docs/14-testing-and-validation.md).
- **Deploy:** Vercel for the app; n8n changes in the n8n Cloud UI. See [13](docs/13-deployment-runbook.md).

## How to extend

- Add a **connector** → [06](docs/06-connectors-and-integrations.md) + `connectors/README.md`.
- Add an **n8n workflow** → [09](docs/09-n8n-setup.md) + `n8n/workflows/README.md`.
- Add a **cron job / scheduled automation** → build it *in n8n* → [11](docs/11-agents-and-cron-jobs.md).
- Add an **agent** → [18](docs/18-future-claude-code-instructions.md) + `agents/README.md`.

## Future Claude Code sessions — read first

[docs/18-future-claude-code-instructions.md](docs/18-future-claude-code-instructions.md). In short: read this README + `docs/00-start-here.md`, check `git status`, branch before changes, never expose secrets, never commit `.env` or raw n8n credentials, never trigger production writes without approval, and separate facts from assumptions.

## Security rules (non-negotiable)

No secret values in the repo — ever. `.env`, MCP configs, and raw n8n credential/workflow exports with embedded secrets are git-ignored. See [15](docs/15-security-and-secrets.md); known findings in [16](docs/16-troubleshooting.md) and the ADR.

## Deeper docs
[00 Start here](docs/00-start-here.md) · [01 Exec summary](docs/01-executive-summary.md) · [02 Overview](docs/02-system-overview.md) · [03 SDLC](docs/03-sdlc-process.md) · [04 Requirements & decisions](docs/04-requirements-and-decisions.md) · [05 Architecture](docs/05-architecture.md) · [06 Connectors](docs/06-connectors-and-integrations.md) · [07 Supabase](docs/07-supabase-setup.md) · [08 Metabase](docs/08-metabase-setup.md) · [09 n8n](docs/09-n8n-setup.md) · [10 Dashboards](docs/10-dashboard-setup.md) · [11 Agents & cron](docs/11-agents-and-cron-jobs.md) · [12 Local dev](docs/12-local-development.md) · [13 Deploy](docs/13-deployment-runbook.md) · [14 Testing](docs/14-testing-and-validation.md) · [15 Security](docs/15-security-and-secrets.md) · [16 Troubleshooting](docs/16-troubleshooting.md) · [17 Change-log process](docs/17-change-log-process.md) · [18 Future Claude](docs/18-future-claude-code-instructions.md)
