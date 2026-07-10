# scripts/

Standalone utilities. Not scheduled — run manually.

| Script | Purpose | Run | Notes |
|---|---|---|---|
| `build_dashboard.py` | Generate the static `dashboard.html` from the SMM Carousel CSV | `python3 scripts/build_dashboard.py` | Source CSV is business data and is **not** committed (see [../docs/discovery/inventory.md](../docs/discovery/inventory.md)); provide it locally. |

## Rules
- No secrets in scripts — read from env vars.
- If a script starts writing to production, treat it like a connector change (doc 06 + CHANGELOG + approval).
- Prefer moving anything recurring into **n8n** rather than a local scheduled script (there is no local cron).
