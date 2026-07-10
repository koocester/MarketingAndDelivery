# Changelog

All notable changes to this repo. Format: Keep a Changelog. Dates are absolute (YYYY-MM-DD).

## [Unreleased]

### Added
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
- Added secret-redaction guidance and the S1–S6 inline-secret findings (values redacted).
- Added n8n credential-handling guidance (never export raw credentials; scan workflow JSON before commit).
- Documented unauthenticated webhooks and the missing error-alerting stub as open risks.

### Open (tracked, not yet done)
- Rotate + migrate inline n8n secrets (S1–S6).
- Wire n8n error alerting.
- Decide on `marts.targets` (wire vs remove) and the unused dbt Xero layer.
- Confirm the true `.env` home for each cloud secret; locate the dbt source repo.
- Decide whether to include the carousel CSV / generated dashboard.html (business data).
