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

### Local Claude Code + Playwright setup (as-built on this laptop)
- **Claude Code CLI** installed via the native installer (not `npm -g`, which failed with `EACCES`): `curl -fsSL https://claude.ai/install.sh | bash` → lands at `~/.local/bin/claude`. If `claude` isn't found, add to PATH: `echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc`.
- **Playwright MCP** is a **local** server: `claude mcp add playwright npx @playwright/mcp@latest` (then `npx playwright install chromium`). It has **no remote URL**, so it cannot be added through the desktop "Add custom connector" dialog (that box is for remote MCP servers only).
- **GitHub from the CLI:** the claude.ai GitHub connector does not authenticate the local `git`. Use `gh`: `brew install gh && gh auth login` (browser OAuth, works with a Google-backed GitHub account) — this wires `gh` as git's credential helper so HTTPS push authenticates silently.

## App/deploy config (committed, non-secret)
- `apps/smm-carousel-dashboard/vercel.json` — function config.
- `.env.example` (repo root) — the canonical env-var name list (placeholders only).
