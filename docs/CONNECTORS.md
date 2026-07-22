# Connector Verification Ledger

Point-in-time **access-verification status**, complementing [06-connectors-and-integrations.md](06-connectors-and-integrations.md) (which documents *how* each connector works). A connector counts as **verified** only when a real read operation succeeded. Update the "Last test" column whenever a connector is re-verified.

**Context of this ledger:** verified on **2026-07-22** from the Windows workstation (user `Faiz`, `Desktop/Koocester Group` session). This machine has **no MCP servers configured** — the `lark`, `n8n-mcp`, and `metabase` MCP configs documented in `config/` live on the CEO's laptop. That is the single biggest gap below.

| Connector | Method (per docs/06) | Access status from this machine | Read verification | Write availability | Limitations | Last test |
|---|---|---|---|---|---|---|
| **GitHub** | git over HTTPS | ✅ Working | ✅ `git ls-remote` + full clone in sync with `origin/main` | Untested (no push attempted; `gh` CLI not installed) | Cannot query collaborators/settings without authenticated API | 2026-07-22 |
| **Staff portal** | Cloudflare Pages, Supabase auth | ✅ Deployed & live | ✅ `staffacademy.koocester.com` serves the sign-in page ("Sign in · Koocester Staff Portal", email-OTP form) | n/a (read surface) | Authenticated pages not tested (no staff session used) | 2026-07-22 |
| **Metabase** | MCP + API key | ⚠️ Liveness only | ⚠️ `koocester.metabaseapp.com` responds (app shell loads); **no authenticated read** | Unknown | No `metabase` MCP or API key on this machine | 2026-07-22 |
| **n8n Cloud** | `n8n-mcp` + API key | ⚠️ Liveness only | ⚠️ `koocester.app.n8n.cloud` responds; **no authenticated read** | Unknown | No `n8n-mcp` or API key on this machine | 2026-07-22 |
| **Lark Base** | `lark` MCP / app token | ❌ Not verified | ❌ No credentials or MCP on this machine | Unknown | Blocks live schema/record confirmation | 2026-07-22 |
| **Supabase** | Postgres via Metabase/n8n creds | ❌ Not verified | ❌ No credentials on this machine | Unknown | Schema knowledge comes from `supabase/schema-ddl.md` (2026-07-21 export) | 2026-07-22 |
| **HubSpot** | Fivetran → Supabase; MCP (claude.ai-managed) | ❌ Not verified | ❌ | Unknown | Verifiable indirectly once Supabase/Metabase access exists (`hubspot.*` schema) | 2026-07-22 |
| **Xero** | Fivetran → Supabase; MCP (claude.ai-managed) | ❌ Not verified | ❌ | Unknown | Same as HubSpot (`xero.*` schema) | 2026-07-22 |
| **Metricool** | n8n (API key header) | ❌ Not verified | ❌ | Unknown | Verifiable indirectly via `content_perf.*` freshness | 2026-07-22 |
| **Aspire** | n8n (OAuth2 managed cred) | ❌ Not verified | ❌ | Unknown | Verifiable indirectly via `finance.*` freshness | 2026-07-22 |

## What unblocks full verification

1. **Add the three MCP servers to this machine/session** (server definitions documented in `config/README.md`; secrets must come from the owner, never this repo): `lark`, `n8n-mcp`, `metabase`.
2. With those, run the standard read-only entry points from [18-future-claude-code-instructions.md](18-future-claude-code-instructions.md): `n8n_list_workflows`, `metabase list_dashboards` / `execute_query`, Lark `bitable_v1_appTableRecord_search`.
3. Indirect connectors (HubSpot, Xero, Metricool, Aspire) are then confirmed by querying row counts / max-loaded-at in their Supabase schemas — no direct credentials needed for discovery.

No production write was attempted against any system during this verification.
