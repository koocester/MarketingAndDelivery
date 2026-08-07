# Changelog

All notable changes to this repo. Format: Keep a Changelog. Dates are absolute (YYYY-MM-DD).

## [Unreleased]

### Fixed - Metricool Reels Sync: duplicate rows filled Lark Base to its cap, numbers went stale (2026-08-07) - LIVE - CR-20260807-01
Jarvis alerted that `Metricool Lark Reels Sync (Indonesia)` failed at 09:00 SGT. Three separate faults sat behind it and the reported error named none of them.
- **Root cause 1 - duplication.** `Get Lark Records` read existing rows with `page_size=500` and **no pagination loop**, and `Match and Prepare` then read only `$input.item`, a single page. Past 500 rows the match step could only ever see the first 500 of ~19,500, so every post outside that window looked new on each run and was re-created. Running since 11 June; duplicate share reached **SG 90.7% / MY 94.6% / ID 94.7%**. Verified on Indonesia 2026-01-02: 103 rows for that day but only **4 distinct Post URLs**, two posts duplicated ~50x, every copy carrying identical metrics with `last_modified_time == created_time` - duplicates, not snapshots.
- **Root cause 2 - plan cap.** The tables then hit the Lark 20,000-row limit. Lark returns `403 code 1254306 "The tenant or base owner is subject to base plan limits"`, which the n8n HTTP node surfaces as the misleading **"Forbidden - perhaps check your credentials?"**. Not a credentials fault.
- **Root cause 3 - silent Singapore failure.** SG's `Video Title` field had been renamed to `Video Caption`, so every write returned `1254045 FieldNameNotFound`. **Lark sends that as HTTP 200 with an error body**, so n8n marked those runs *successful* while writing nothing - SG had recorded no new post since 6 July and no alert ever fired.
- **Impact.** Latest post actually stored before the fix: SG 2026-07-06, MY 2026-07-30, ID 2026-08-05. Any figure pulled from these tables was both inflated by duplicates and missing recent content.
- **Archive first.** All 58,631 raw Lark rows copied to `content_perf.reels_lark_archive` (Supabase, Godmode Dashboard) with `lark_record_id`, `lark_created_time`, `post_url` and the full `fields` jsonb; counts matched Lark exactly. Every deleted row is recoverable.
- **3 workflows changed** - `54vD7rU5KNMCjVq1` (SG), `IB2XF3NMrsyzqVAy` (MY), `qnhcgiVUB6jgqnwM` (ID): `Get Lark Records` now paginates on `page_token` until `has_more` is false; `Match and Prepare` reads every page via `$input.all().flatMap(...)`. SG additionally remaps `Video Title` -> `Video Caption`.
- **54,746 duplicate rows deleted**, keeping the earliest record per Post URL. Result **SG 19,135 -> 2,012 / MY 19,976 -> 1,114 / ID 19,520 -> 1,031**, all current to 6 August with ~18,000 rows of headroom each.
- **Verified.** All three syncs re-run clean. SG created 235 genuinely-new posts rather than re-creating 1,777, proving the matcher now sees every page; `Batch Update` and `Batch Create` both return `data.records` instead of an error body. Jarvis independently posted "Back to normal" at 12:00 SGT.
- **Related.** Instagram had also dropped off five Metricool brands (koocester, koocesterautos, koocesterbusiness, koocesterhomes, Koocester Business MY) and was reconnected via the Facebook full-access path; SG's 08:00 run had failed at `IG Autos` with "There is no instagram connection for blog: 4807248". Metricool's "Connect via Instagram" option is limited-access and cannot publish - always use "Connect via Facebook".
- **Still open.** The syncs do not assert on the Lark response `code`, so a future field rename would fail silently again exactly as Singapore did.

### Fixed — Overdue alert attribution (2026-07-30) · LIVE
The daily 09:00 overdue digests named the wrong person. Raised by Mike on 28 and 30 July; the counts were never wrong, the names were.
- **Root cause.** The `Digest – … Overdue → <owner>` automations filter correctly by stage. The bug was only in the Lark message **Title**, built as `⏰ Overdue alert: {Video Editor of "the first record found"}`. Two failures: the wrong role is named (an editor on a QC/Approval/Final Approval digest), and because the token resolves against *the first record found*, one arbitrary name is stamped across a digest covering many people — hiding the rest. `⏰ Overdue alert: Ulysess Marvels` appeared twice on 30 July purely because he was first in the result set.
- **Responsibility rule confirmed by Mike (owner).** Editors own an overdue ONLY at `Amendments (Marketing)` and `Amendments Needed`. Strategist QC is excluded (his 28 July message naming it was retracted as a typo). All other stages belong to the stage owner. Correct editor count on 30 July was 5, out of 22 total overdues.
- **5 Base automations changed** — the person token removed from the Title, replaced with a stage label: Video Strategist QC, Video Marketing Approval, Video Final Approval, Video Amendments, Video ManyChat. All Video-side; the carousel digests were never affected (they select only `Carousel Title`, so no person token was available).
- **7 verified correct, unchanged** — including `Video - Overdue edit alert`, which correctly filters on `Overdue (alert)` (the true editor SLA) and stayed silent on 30 July because zero videos were genuinely late on an editor's clock.
- **n8n `c2RpBCrqU20PLu7h` (Jarvis)** — `overdue_by_editor` restricted to the two amendment stages; added `overdue_by_stage` / `_strategist` / `_approver` and the rule as an explicit model instruction; fetch gained `Head of Growth Approver`, `Overdue (alert)`, `Amendments Overdue (alert)`.
- **Metric Registry** — `Content overdue count` downgraded Trusted → **Approximate**; new row `Overdue by person (responsibility attribution)` = **Broken**, owner Mike, not to be used for performance, pay or promotion.
- **New rule for all digests:** never interpolate a person field into a Base digest Title. Label by stage; put records in the body.
- Full audit + rollback: `connectors/lark/09-overdue-alert-attribution-fix.md`.
- **Still open.** `Last Video/Carousel Stage Updated` are record-level ModifiedTime fields that reset on ANY write, including 15-minute n8n jobs — so every duration **understates** lateness. Needs immutable per-stage timestamps. Same root cause already flagged against `SLA State (activate at go-live)`.

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
