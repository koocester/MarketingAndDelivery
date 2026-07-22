# Changelog

All notable changes to this repo. Format: Keep a Changelog. Dates are absolute (YYYY-MM-DD).

## [Unreleased]

### Added — Copywriter-bot readiness pass (2026-07-22)
Discovery-only session from the Windows workstation (no MCP connectors available there; no production system touched, nothing pushed).
- `docs/COPYWRITER_BOT_SPEC.md` — grounded v1 spec: revive the archived transcript→`Caption (AI)` path as a scheduled n8n workflow; drafts only, `Reviewed Caption (final)` stays human-only; strict-JSON output; error branch to Lark (the global error handler is a stub); blockers incl. exporting the archived "AI Video Summary ×4" workflows and confirming the SLA-engine state.
- `docs/CONNECTORS.md` — connector *verification ledger* (complements doc 06): GitHub + portal verified from the workstation; Metabase/n8n liveness only; Lark/Supabase/HubSpot/Xero/Metricool/Aspire unverified there pending MCP setup.
- `docs/GITHUB_OWNERSHIP.md` — the repo is **public under a personal account**; no secret values in tree or history, but internal endpoints/architecture are exposed. Recommendation: flip private → transfer to a company org → branch protection → rotate flagged credentials. Not executed (owner actions).
- `SYSTEM_CONTEXT`/`DATA_FLOW` docs deliberately **not** created — already covered by `README.md`, `docs/02`, and `docs/05` (no duplicates rule).

### Added — Portal source + Academy auth deep-dive (2026-07-21)
- `portal/src/` — the **actual portal source** committed as a sanitized snapshot (103 HTML pages, 10 JS, `deploy.sh`, curriculum map + rollback runbook). Two secret classes replaced with placeholders exactly like the n8n exports: `<SUPABASE_ANON_KEY>` (26 files) and `<REDACTED_N8N_BASIC_AUTH>` (3 Functions). Binary assets (~22M of portraits/brand/logos) intentionally excluded; restored on deploy from the vault. The vault source is untouched.
- `portal/04-academy-auth.md` — the identity subsystem in full: passwordless email-OTP sign-in, the `koo_session` cookie (shape, why not HttpOnly, 400-day + token-rotation mirroring), `safeNext()` redirect safety, the four-layer gate stack, roles/permissions with the exact column/RPC per field, and the `is_founder()` open verification (with the SQL to close it).
- `portal/05-change-process.md` — the repo's 8-phase SDLC applied to portal changes, the Agile-vs-Waterfall cut, the two portal invariants (hard=fail-closed/soft=fail-open; the three mirrored access lists), and a portal PR checklist.
- Interlinked from `portal/README.md`, `docs/19`, and the README architecture table.
- Corrected loose wording on the Supabase anon key in `docs/19` and `portal/02` — it embeds no further secret but is itself a ~10-year anon-role bearer credential bounded only by RLS.

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

### Security — is_founder() verified, found misnamed (2026-07-21)
- 🔴 **`is_founder()` is defined as `profiles.is_admin`, not a founder check.** Read the definition end to end via `pg_get_functiondef` in the portal Supabase (`lfppmsppvqtjyusfrlkf`): `SELECT COALESCE((SELECT p.is_admin FROM public.profiles p WHERE p.id = auth.uid()), false)`. It returns true for **any admin**. Currently only one profile (`ceo@koocester.com`) has `is_admin=true`, so today it means "Hakim" by coincidence — but granting `is_admin` to Tech/an academy admin (its documented purpose, to bypass deck locks) would also hand them the Academy founder tools. **Documented, not fixed** — recommended fix is to key it on a dedicated `is_founder` column / fixed uid (production DDL, needs owner go-ahead). Corrects `SOURCES_OF_TRUTH.md` #4, which wrongly said it was "NOT the same as is_admin."

### Open (tracked, not yet done)
- Rotate + migrate inline n8n secrets (S1–S6).
- Decouple `is_founder()` from `is_admin` (see Security above) — dedicated column or fixed uid.
- (Won't-do per owner 2026-07-21: rotating the portal's inline n8n Basic-Auth creds — Hakim opted to leave as-is.)
- Wire n8n error alerting.
- Decide on `marts.targets` (wire vs remove) and the unused dbt Xero layer.
- Confirm the true `.env` home for each cloud secret; locate the dbt source repo.
- Decide whether to include the carousel CSV / generated dashboard.html (business data).
