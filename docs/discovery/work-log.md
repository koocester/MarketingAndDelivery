# Engagement & Work Log

A consolidated paper trail of the reconstruction engagement and every system-level decision, build, and parked item discussed — so nothing lives only in a chat window. Point-in-time; verify live before acting. Business/financial figures and personal material are intentionally excluded.

---

## 1. Local machine / tooling setup (this laptop)

- **Claude Code CLI** installed via the native installer (`curl -fsSL https://claude.ai/install.sh | bash`) after `npm -g` hit an `EACCES` permission error. Lands at `~/.local/bin/claude`; PATH fixed with `export PATH="$HOME/.local/bin:$PATH"` in `~/.zshrc`.
- **Playwright MCP** added as a **local** server: `claude mcp add playwright npx @playwright/mcp@latest` (writes to `~/.claude.json`). Note: Playwright MCP has no remote URL — it cannot be added via the desktop "Add custom connector" dialog (that box is for **remote** MCP servers only).
- **MCP config locations** (all git-ignored, hold secrets): `~/.claude.json` (global: `metabase`, `n8n-mcp`; per-project: `playwright`), `claude_desktop_config.json` (`lark`, via `npx @larksuiteoapi/lark-mcp` with an inline auth token). claude.ai-managed connectors add HubSpot, Xero, Brevo, Canva.
- **GitHub access:** the claude.ai "GitHub Integration" being connected does **not** grant a local Claude Code session repo tools or git push credentials — it powers chat attachments / Projects sync / remote sessions only. Pushing from this machine required `gh` CLI + `gh auth login` (browser OAuth; works with the Google-backed GitHub account). See [reconstruction-notes.md](reconstruction-notes.md).

## 2. What was built in this engagement
- Read-only laptop discovery + live MCP inventory (n8n, Supabase/Metabase, Lark). See [inventory.md](inventory.md).
- This documentation package (docs 00–18, ADR, diagrams, connector/n8n docs, discovery).
- Copied the only local project code: the Vercel SMM dashboard + `build_dashboard.py`.
- Extracted the package into its own standalone git repo (outside the personal vault) and pushed to the private `koocester/MarketingAndDelivery`.

## 3. The full dashboard landscape (all surfaces)
Beyond the Metabase/Command/Vercel surfaces in [../10-dashboard-setup.md](../10-dashboard-setup.md), the Lark M&D base also has **native Base dashboards**, built via computer-use (Lark Base dashboards have **no API**):
- **⚠️ Ops Health & Bottlenecks** — an isolated dashboard with alert tiles for the backlog/gap numbers (videos/projects Not Started, finished-but-unposted videos/carousels, missing-objective data gaps).
- **Main + per-market dashboards** (Regional / SG / MY / ID) — stage distribution ("Videos by Stage"), active workload by Producer/Editor/Copywriter, vertical + country donuts, publish-queue tiles, uploads-over-time.

## 4. Dashboard-strategy decision (where each intelligence lives)
- **Pipeline health / bottlenecks / "where is it stuck"** → **Lark** (the pipeline data is in the base; no pipe to build). Stage-count/funnel views already exist on the per-market + Ops Health dashboards.
- **Content performance / the lead-gen feedback loop** (views, leads per piece) → **Supabase + Metabase**, not Lark.
- **Sankey flow diagram is NOT possible in Lark** (no Sankey chart type). The insight (where the pipeline bulges/narrows) is covered by the existing stage bars + an aging view; a true node/Sankey visual would require Metabase or a custom app.

## 5. Parked / open items (decided or awaiting decision)
| Item | Status | Note |
|---|---|---|
| Lark "Stuck / aging" grid views (grouped by stage, sorted by Overdue/age, active-only) | **Parked** at Hakim's request | Robust, API-buildable, non-overlapping; resume on his go |
| Business-data files (`SMM Carousel Tracker.csv`, generated `dashboard.html`) | **Not copied** — awaiting decision | Real content/owner data; include as sample/redacted or leave out |
| n8n workflow JSON exports | **Deferred** | Several embed inline secrets; export only after manual redaction |
| Rotate inline n8n secrets S1–S6 | **Declined by Hakim (2026-07-10)** | Risk consciously accepted; repo is private. Locations remain documented in [../15-security-and-secrets.md](../15-security-and-secrets.md) |
| Guard the 7 unguarded Lark button automations (incl. 🔴 `Reject Video`) | **Declined by Hakim (2026-07-10) — "Don't fix. Document."** | Audit was read-only; **no change made to the live base**. Risk consciously accepted and recorded. Full detail: [../../connectors/lark/07-button-automation-audit.md](../../connectors/lark/07-button-automation-audit.md) |
| n8n error alerting (stub) | **Open** | No production change made |
| `marts.targets` wire vs remove; dbt Xero layer | **Open question** | See [../04-requirements-and-decisions.md](../04-requirements-and-decisions.md) |

## 6. Connector validations performed (read-only)
- **Xero** — receivables/AR checked live; connector confirmed to return totals + top-N invoices only (no full invoice list, no aged-receivables tool). Figures are live business data and are **not** stored here. Limits documented in [../06-connectors-and-integrations.md](../06-connectors-and-integrations.md).
- **n8n / Supabase / Metabase / Lark** — inventoried live; see their setup docs.

## 7. Standing constraints re-confirmed
- Lark Base **dashboards** are UI-only (no API); **automations** are list/toggle-only via API (no create).
- **AnyCross** has no MCP connector — that plane is mapped from history, confirm in-console.
- Metricool `metricool_snapshots` must **append** (never overwrite) to preserve dashboard history.
- Aspire `finance` is **card float only** — not a runway source.
