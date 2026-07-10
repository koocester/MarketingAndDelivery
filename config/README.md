# config/

Non-secret configuration and references. **No secret files live here** — real config with secrets stays in the platforms (n8n Cloud, Vercel env) and in the git-ignored MCP config files.

## MCP configuration (reference — not stored here)
| File (on the laptop, git-ignored) | Holds |
|---|---|
| `~/.claude.json` | global MCP servers: `metabase`, `n8n-mcp` |
| `~/Library/Application Support/Claude/claude_desktop_config.json` | `lark` MCP (npx, inline auth token) |
| per-project `.claude.json` `mcpServers` | `playwright` |
| claude.ai connector settings | HubSpot, Xero, Brevo, Canva (OAuth) |

To add an MCP server: `claude mcp add <name> <cmd> [-s user]`. Never commit these files.

## App/deploy config (committed, non-secret)
- `apps/smm-carousel-dashboard/vercel.json` — function config.
- `.env.example` (repo root) — the canonical env-var name list (placeholders only).
