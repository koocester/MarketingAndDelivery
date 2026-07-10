# Discovery Inventory

Read-only laptop discovery performed 2026-07-10 on `docs/system-reconstruction`. Secrets were **never opened or copied** — only file paths and variable *names* were recorded. "Contains secrets?" = whether the file is known/likely to hold secret values (which is why it is git-ignored, not copied).

| Item | Path | Type | Purpose | Safe to copy? | Contains secrets? | Notes |
|---|---|---|---|---|---|---|
| Vercel dashboard app | `~/Desktop/VAULT/dashboard creation/vercel-app/` | Project code | SMM Carousel dashboard: Lark Base → serverless JSON → browser | ✅ Yes | No (uses env vars; only `.env.example`) | **Copied** → `apps/smm-carousel-dashboard/` |
| Dashboard build script | `~/Desktop/VAULT/dashboard creation/build_dashboard.py` | Python script | Generates static `dashboard.html` from the carousel CSV | ✅ Yes | No (scanned clean) | **Copied** → `scripts/build_dashboard.py` |
| Carousel masterlist | `~/Desktop/VAULT/dashboard creation/SMM Carousel Tracker - Masterlist.csv` | Business data (78 KB) | Source data snapshot for the static dashboard | ⚠️ Candidate | No secrets, but real content/owner data | **NOT copied** — business data; confirm with CEO |
| Generated dashboard | `~/Desktop/VAULT/dashboard creation/dashboard.html` | Generated artifact (50 KB) | Static build output; may embed CSV rows | ⚠️ Candidate | Possibly embeds business data | **NOT copied** — regenerable from the script |
| Global MCP config | `~/.claude.json` (37 KB) | Config | Claude Code global MCP servers: `metabase`, `n8n-mcp` | ❌ No | **Yes** (API keys in server args/env) | Git-ignored; documented, never copied |
| Desktop MCP config | `~/Library/Application Support/Claude/claude_desktop_config.json` (2.4 KB) | Config | Desktop app MCP: `lark` (via `npx @larksuiteoapi/lark-mcp`) | ❌ No | **Yes** (Lark MCP auth token inline) | Git-ignored; documented, never copied |
| Vault Claude dir | `~/Desktop/VAULT/.claude/` | Config | `launch.json` (preview server), `settings.local.json`, `skills/`, `worktrees/` | ⚠️ Partial | `settings.local.json` may hold local prefs | Not part of the ops system; excluded |
| Vault preview launch cfg | `~/Desktop/VAULT/.claude/launch.json` | Config | Local preview server definition (dev only) | ➖ N/A | No | Dev tooling, not the ops system |
| Shell history | `~/.zsh_history` | History | Setup commands (lark-mcp auth, playwright add) | ❌ No | **Yes** (an inline `auth=` token seen, redacted) | Not copied; only redacted excerpts recorded |
| n8n local install | `~/.n8n` | — | — | ➖ N/A | — | **Absent** — n8n is cloud-hosted |
| Docker | — | — | — | ➖ N/A | — | **Not installed** |
| User crontab | `crontab -l` | — | — | ➖ N/A | — | **Empty** — no local cron; scheduling is in n8n cloud |
| LaunchAgents | `~/Library/LaunchAgents/` | — | — | ➖ N/A | — | Only 3rd-party updaters (Perplexity/Adobe/Dropbox/OpenAI); **no project jobs** |

## Cloud systems (no local files — inventoried via MCP)

| System | Where | Evidence | Detail doc |
|---|---|---|---|
| n8n | `koocester.app.n8n.cloud` (project `LTEF9CFjbRXTH9hr`) | MCP `n8n-mcp` | [../09-n8n-setup.md](../09-n8n-setup.md) |
| Supabase (Postgres 17) | Metabase db id 34 | MCP `metabase` | [../07-supabase-setup.md](../07-supabase-setup.md) |
| Metabase | CEO Dashboard (67), Content Performance (100) | MCP `metabase` | [../08-metabase-setup.md](../08-metabase-setup.md) |
| Lark Base (M&D) | `BG8PbaZFna1NQksNWkglTN85gSf` | MCP `lark` | [../06-connectors-and-integrations.md](../06-connectors-and-integrations.md) |
| HubSpot / Xero | Fivetran → Supabase `hubspot`/`xero` schemas | MCP + Metabase | [../06-connectors-and-integrations.md](../06-connectors-and-integrations.md) |

## Candidate files awaiting CEO confirmation before copying
1. `SMM Carousel Tracker - Masterlist.csv` — real carousel/owner data. Copy a **sample/redacted** version, or leave out?
2. `dashboard.html` — generated; may embed the CSV. Prefer to keep only the generator (`build_dashboard.py`)?
3. `apps/smm-carousel-dashboard/public/sample-data.json` — shipped with the app (already public via the deployed site); treated as safe. Confirm it holds no sensitive rows.
