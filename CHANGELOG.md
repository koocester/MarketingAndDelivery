# Changelog

All notable changes to this repo. Format: Keep a Changelog. Dates are absolute (YYYY-MM-DD).

## [Unreleased]

### Added — Staff Portal documentation (2026-07-21)
The portal (`staffacademy.koocester.com`) post-dates the 2026-07-10 reconstruction and was the largest undocumented gap. Documented from the live runtime source, not memory.
- `docs/19-staff-portal.md` — narrative: what it is, the soft-vs-hard gate model, the edge front door, how it links into Lark (HR roster sync + Academy Role), how live numbers reach the dashboards, `deploy.sh`, security posture.
- `portal/` subtree — `README.md` (file/URL map + golden rules), `01-access-and-gates.md` (identity model, the four `profiles`-driven gates, the traps), `02-functions-and-numbers.md` (the three hard-gated proxy Functions and what each extracts), `03-deploy-nav-ops.md` (the four deploy gates, nav enforcement, propagation, ops checklist).
- `docs/diagrams/portal-access-flow.mmd` — request/gate flow (edge → functions → n8n → Lark/Supabase).
- Updated README (integration map, data-flow, per-system list, deep-docs), `docs/02-system-overview.md` (portal plane + "how staff reach it"), `docs/10-dashboard-setup.md` (surface **E**, five surfaces now).

### Added — replication artifacts (turns the map into a rebuildable backup)
- `n8n/workflows/*.json` — sanitized exports of the live workflows (structure byte-identical; secret VALUES replaced by `<REDACTED_*>` placeholders; credential names/ids preserved).
- `metabase/cards/` — the actual SQL for all 35 dashboard cards (33 `.sql` + 2 MBQL `.json`) + rebuild guide.
- `connectors/lark/08-schema-full-reference.md` — complete field dump: 19 tables, 243 fields across Videos(113)/Carousels(64)/Projects(46)/Pages(20).
- `supabase/schema-ddl.md` — DDL + primary keys for the 6 n8n-fed tables across `content_perf`/`finance`/`marts`/`public`.

### Fixed (documentation accuracy)
- Corrected Lark field counts: Videos 113 (not 107), Carousels 64 (not 63). Cause: the field API returns `has_more:true` even at `page_size=200` — an earlier pull truncated silently.
- Flagged `SLA State (activate at go-live)` as a deliberate blank placeholder — the SLA engine is specified but must be verified as switched on.

### Added
- Full Lark Base documentation subtree (`connectors/lark/`) centred on the end-to-end workflow and how the base connects to the dashboards.
- Build provenance (`docs/discovery/build-provenance.md`) — source systems, staging/CSV/idempotency method, verified migration result, full source→base→dashboard lineage.
- Metricool→Supabase rebuildable field mapping (`supabase/metricool-sync-mapping.md`) — live-extracted, column-by-column, with upsert keys and unwritten-column caveats.
- How briefs & the Command dashboard read the base (`n8n/how-briefs-and-command-read-the-base.md`) — per-workflow Lark/Supabase/AI logic; surfaced two additional base tables (Client accounts, Events).
- Engagement & work log (`docs/discovery/work-log.md`) — consolidated paper trail of decisions, builds, and parked items.
- Original engineering brief (`docs/discovery/original-brief.md`).
- Doc 10: the Lark-native Base dashboards (Ops Health & Bottlenecks, per-market) + the dashboard-strategy decision (pipeline health→Lark, performance→Metabase, Sankey not possible in Lark).
- config: local Claude Code CLI + Playwright MCP + `gh` setup as-built.
- Initial reconstructed documentation baseline (docs 00–18).
- SDLC process documentation and review checklists.
- Future Claude Code operating instructions.
- System discovery inventory + reconstruction notes (`docs/discovery/`).
- n8n workflow documentation structure (`n8n/`), redacted-export procedure, and credential doc templates.
- ADR-0001 (reconstructed current architecture) and Mermaid diagrams.
- Connector, Supabase, Metabase, agents, cron, config, scripts, apps folder docs.
- Copied clean project code: `apps/smm-carousel-dashboard/` and `scripts/build_dashboard.py`.
- `.env.example` (placeholder env-var catalogue) and `.gitignore`.

### Changed
- N/A (first baseline).

### Security
- 🔴 CEO Dashboard: three "7d" card-spend cards have **no date filter** — they report all-time spend as weekly. Documented, not fixed.
- 🔴 Lark button-automation audit: 7 of 28 button automations are unguarded; `Reject Video` sets Rejected/DO NOT POST and DMs the Producer from any stage. **Documented, not fixed** — explicit owner decision (2026-07-10).
- n8n exports carry **no secret values** — only `<REDACTED_*>` placeholders mapped to their managed credentials in `n8n/credentials/README.md`. Google Drive/Docs `fileId`s are retained (identifiers, not credentials).
- Corrected automation totals: 90 automations / 74 active (previously stated ~78).
- Added secret-redaction guidance and the S1–S6 inline-secret findings (values redacted).
- Added n8n credential-handling guidance (never export raw credentials; scan workflow JSON before commit).
- Documented unauthenticated webhooks and the missing error-alerting stub as open risks.

### Open (tracked, not yet done)
- Rotate + migrate inline n8n secrets (S1–S6).
- Rotate the Staff Portal's inline n8n Basic-Auth credentials (in `functions/dash.js`, `mgmt-deck.js`, `hr-feed.js`) to Cloudflare Pages env vars — same finding class as S1–S6; values redacted from this repo.
- Confirm `is_founder()` is false for a non-founder signed-in staff member (SOURCES_OF_TRUTH #4 is only partially verified).
- Wire n8n error alerting.
- Decide on `marts.targets` (wire vs remove) and the unused dbt Xero layer.
- Confirm the true `.env` home for each cloud secret; locate the dbt source repo.
- Decide whether to include the carousel CSV / generated dashboard.html (business data).
