# 04 — Requirements & Decisions

> Exact Claude Code session transcripts were not found. Requirements were reconstructed from the working laptop setup, discovered files, configs, scripts, the live n8n/Supabase/Metabase/Lark state, and user-provided context. Assumptions are marked; unknowns are listed as open questions, not invented.

## Business goals
- Scale content output (videos + carousels) across markets without the founder holding every state in his head.
- Pivot toward **lead-gen / performance**: measure leads & views per piece, not just produce.
- Give leadership **live, trustworthy** operational + financial visibility.
- Move toward a **team-self-serve, sellable company brain** decoupled from any one person.

## User requirements
- A governed pipeline with enforced SLAs and clear ownership per role/market.
- Automated briefings (CEO daily, weekly management, monthly role briefs) delivered in Lark.
- Dashboards: a founder Command view + BI (finance, sales, content).
- Near-real-time views of specific trackers (e.g. SMM carousels) outside Lark.

## Constraints
- **Non-technical owner** — the system must be operable and documented for others.
- **Cloud-first, low-ops** — no local servers; SaaS + n8n Cloud.
- **Lark is the system of record** — everything operational is modeled there.
- Brand/data rules from the company (English-only system content; privacy: nothing auto-shares).

## Known CEO preferences (reconstructed)
- Direct, brief, decision-first communication.
- "Success = adopted, not just built" — ship to real usage.
- Documents decisions so they aren't re-derived.
- Prefers the right tool per job (e.g. Metabase for BI, not forcing Lark).

## The system MUST
- Keep operational state in Lark; enforce SLAs; notify owners.
- Sync performance + finance to Supabase; surface via Metabase + Command dashboard.
- Deliver scheduled briefs reliably.
- Protect secrets and avoid unintended production writes.

## The system MUST NOT
- Expose secrets in code, dashboards, or workflow params.
- Trigger production writes (Lark/HubSpot/Xero/Supabase/Metabase) without explicit approval.
- Model operational state outside Lark, or write analytics back into Lark.
- Depend on a single person to operate.

## Decisions made (and why)
| Decision | Why |
|---|---|
| Lark Base = system of record | Team already works there; buttons+automations enforce process at source. |
| AnyCross for real-time, n8n for scheduled | Clear latency/ownership split; avoids double-implementing logic. |
| Supabase + Metabase for analytics (not Lark dashboards) | Lark tracks output; the lead-gen loop needs a real warehouse + BI. |
| Fivetran for HubSpot/Xero, n8n for Metricool/Aspire | Managed replication where connectors exist; custom sync where they don't. |
| Vercel serverless for the SMM dashboard | Keeps Lark credentials server-side; browser never touches Lark. |
| Cloud-only, no local runtime | Low-ops for a non-technical owner. |

## Open questions
- Should `marts.targets` be wired into Metabase (actual-vs-target), or removed?
- Is the dbt `xero_staging`/`xero_reports` layer intended as the semantic layer, or dead scaffolding?
- Confirm the true `.env` home for each cloud secret (n8n cred vs Vercel vs MCP) — see [.env.example](../.env.example) "needs confirmation" items.
- Should the carousel CSV / generated `dashboard.html` be included (business data) or kept out?
- Who owns rotation for each secret? (assign per [15](15-security-and-secrets.md)).

## Future requirements
- Rotate inline n8n secrets → managed credentials.
- Wire error alerting (n8n error-handler is a stub).
- Close the outcome/target layer for lead-gen.
- Enable team self-serve; reduce key-person dependency.

## Requirements traceability
| Req ID | Requirement | Evidence found | Implementation location | Status | Notes |
|---|---|---|---|---|---|
| R1 | Governed content pipeline + SLAs | Lark M&D base stages + SLA formulas | Lark `BG8Pba…` (Videos/Carousels) | ✅ Live | 19 tables |
| R2 | Real-time assign/notify | AnyCross fan-out (history) | In-Lark AnyCross | ✅ Live | No MCP to verify; confirm in-console |
| R3 | Scheduled briefings | n8n cron workflows | n8n `c3OAv5oJRanDv8UH`, `yv5Pz0hpX3kHKvVE`, `c3bYweWzK8Q4xlFe` | ✅ Live | 🔴 inline Lark secret |
| R4 | Command dashboard | n8n webhooks + AI cache | n8n `ePDPNKpgKdz4SUMZ`, `m7n7555E2t6Wlvkk` | ✅ Live | Basic-Auth; clean pattern |
| R5 | Performance data warehouse | Supabase `content_perf` | n8n Metricool syncs | ✅ Live | 🔴 inline secrets |
| R6 | Finance data warehouse | Supabase `finance` + Fivetran `xero` | n8n Aspire sync; Fivetran | ✅ Live | Aspire = card float only |
| R7 | CRM → warehouse | Supabase `hubspot` | Fivetran | ✅ Live | — |
| R8 | BI dashboards | Metabase 67 + 100 | Metabase | ✅ Live | `marts.targets` unused |
| R9 | Live SMM carousel dashboard | Vercel app | `apps/smm-carousel-dashboard` | ✅ Live | Copied to repo |
| R10 | Outcome/target metrics | `marts.targets` exists | Supabase `marts` | ⚠️ Partial | Not wired to any card |
| R11 | Secret hygiene | n8n inline secrets found | n8n params | ❌ Open | Top remediation task |
| R12 | Failure visibility | n8n Error Trigger stub | n8n `ReSF67JnUkuFRkCZ` | ❌ Open | No alerting wired |
