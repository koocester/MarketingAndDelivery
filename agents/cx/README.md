# CX — Client Journey and Retention Agent kit

The prompt stack and run record for the Customer Success mission (CX = Customer Success, never CS — CS means Content Strategist in this company).

- **Purpose:** an agent that owns the post-sale client journey — onboarding, event-driven project updates, weekly recaps with live numbers, feedback collection, and health/retention monitoring — over WhatsApp via ManyChat, logged into HubSpot. The agent nurtures the journey; the human Customer Success owner closes renewals and handles unhappiness, pricing, and sales.
- **Operating stack:** `01-company-agent-orchestrator.md` (control layer) → `02-automation-engineer-master-system-prompt-v3.md` (role worker) → `mission-brief.md` (CEO Mission Brief, 2026-07-22).
- **Systems touched (at deployment):** Lark M&D base read-only (Projects `tblAJKbb2UZRh8rn`, Clients `tblWpq8b0uo1vBtX`, Videos `tbl8wIByJQwhIUei`), Postgres (`content_perf.reels` read + new `cx_state` schema), HubSpot (seven new CX properties + timeline notes), ManyChat (WhatsApp sends), n8n (workflows CX-W0..W5, reusing the PCR pair). Full enumeration in the engineering package §3–§8.
- **Status (2026-07-23):** DESIGNED, READY_FOR_HUMAN_REVIEW. Revision 004 passed independent QA (4 isolated rounds, 16 findings, 15 resolved, 1 minor collected). Approval package at `runs/run-2026-07-23-001/approval-package.md`. Nothing deployed; zero writes to production systems so far. Build phase starts with D-1: prove one ManyChat WhatsApp outbound. Human decision DEC-001 (T4 handover pre-approved, sends ungated with parallel human alert) recorded in `runs/run-2026-07-23-001/decision-log.md`.
- **Standing rule:** every working session on this system commits and pushes to this branch, however small the change — the run history is the learning loop; read the latest run's manifest and approval package before continuing work.
- **Secrets:** none in this kit; deployment uses the existing managed n8n credentials plus a HubSpot private app token to be issued at build time (D-4).
- **Owner:** Faiz (faiz@koocester.com).
