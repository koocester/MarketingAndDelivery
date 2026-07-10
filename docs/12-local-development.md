# 12 — Local Development

Most of the system is cloud SaaS with **nothing to run locally**. The one runnable local artifact is the Vercel dashboard app.

## Prerequisites
- Node.js 18+ and `npx`. (Claude Code CLI is at `~/.local/bin/claude`.)
- Access to the relevant cloud accounts (Lark app, Vercel, n8n Cloud, Supabase, Metabase) — request from the owner.

## Vercel SMM dashboard (the only local app)
```bash
cd apps/smm-carousel-dashboard
cp .env.example .env.local     # fill in real LARK_* values (never commit)
npx vercel dev                 # http://localhost:3000
```
- Verify `GET /api/carousels` returns `{updated, count, data}`.
- The Lark app must have `bitable:app:readonly` and be a collaborator on the Base.
- Field mapping is in `api/carousels.js` (`mapRecord`).

## Dashboard generator script
```bash
python3 scripts/build_dashboard.py     # regenerates the static dashboard.html from the CSV
```
> Note: the source CSV is business data and is **not** in the repo (see [discovery/inventory.md](discovery/inventory.md)). Provide it locally to run this.

## Working with the cloud systems (read-only by default)
- Use MCP connectors from Claude Code: `lark`, `n8n-mcp`, `metabase`, Xero/HubSpot.
- **Read-only** unless a change is explicitly approved. Never run production n8n workflows or write to Lark/HubSpot/Xero/Supabase from a dev session without sign-off.

## MCP setup (reference)
- CLI: `claude mcp add <name> <cmd>` (e.g. `playwright`). Global servers live in `~/.claude.json`; desktop connectors in `claude_desktop_config.json`; claude.ai connectors in connector settings. **These files hold secrets — never commit them.**

## Git hygiene
- Work on a branch (`git checkout -b type/desc`). Never commit `.env`, MCP configs, or raw n8n exports with secrets. Run the secret scan in [14](14-testing-and-validation.md) before committing.
