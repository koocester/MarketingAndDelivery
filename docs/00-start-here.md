# 00 — Start Here

Welcome. Read in this order.

## If you are a new engineer
1. [../README.md](../README.md) — the front door.
2. [01-executive-summary.md](01-executive-summary.md) — what this is, in business terms.
3. [02-system-overview.md](02-system-overview.md) + [05-architecture.md](05-architecture.md) — how it fits together.
4. [15-security-and-secrets.md](15-security-and-secrets.md) — **act on 🔴 items before touching anything.**
5. The doc for the plane you're changing (07 Supabase / 08 Metabase / 09 n8n / 10 dashboards / 11 agents & cron).
6. [12-local-development.md](12-local-development.md) to run the one local app.

## If you are a future Claude Code session
Read [18-future-claude-code-instructions.md](18-future-claude-code-instructions.md) **first**, then this file. Verify live via MCP before asserting; branch before changing; never expose secrets; never trigger production writes without approval.

## The 60-second mental model
- **Lark Base** = source of truth. **AnyCross** = real-time reactions. **n8n Cloud** = schedules + outbound + Command dashboard API. **Supabase** = warehouse. **Metabase** = BI. One **Vercel app** = a live carousel dashboard.
- **No local runtime** — no cron, no Docker, no n8n install. Scheduling lives in n8n Cloud.
- **Secrets are the top risk** — several live in the wrong place inside n8n (documented, not copied).

## Ground truth vs history
- This repo = **infrastructure ground truth** (verified live 2026-07-10).
- The CEO's second-brain vault = **decision history** (context, not config).
- When they disagree, **verify live** and trust the system.

## Where to look fast
- IDs & names → [discovery/inventory.md](discovery/inventory.md).
- What broke / known issues → [16-troubleshooting.md](16-troubleshooting.md).
- Why it's built this way → [adr/ADR-0001-reconstructed-current-architecture.md](adr/ADR-0001-reconstructed-current-architecture.md).
