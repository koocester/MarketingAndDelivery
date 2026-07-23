# Content Strategist — Storyboard Copilot kit

The prompt stack and run record for the Storyboard Copilot mission (CS = Content Strategist, never Customer Success).

- **Purpose:** an AI copilot that drafts the full GUIDE-structure storyboard from the discovery-call transcript into the M&D base Video record, maintains the discovery-call extraction question set, and runs the winners-to-Poppy-AI feedback loop. Assist, not autopilot — the strategist owns the call and approval.
- **Operating stack:** `01-company-agent-orchestrator.md` (control layer) → `02-automation-engineer-master-system-prompt-v3.md` (role worker) → `mission-brief.md` (CEO Mission Brief, 2026-07-22).
- **Systems touched (at deployment):** Lark M&D base Videos table (one URL field + new draft docs + DMs), Postgres (`copilot.storyboard_claims`, `copilot.poppy_uploads`), Poppy AI (uploads), n8n (workflows W1/W2). Full enumeration in the engineering package §7.
- **Status (2026-07-23):** BUILT, awaiting first pilot dry-run. W1 (`BGwVPFaCAK2o4zoB`) and W2 (`Wn8b9rOQcDRhqF6E`) live in n8n, inactive, dryRun on; Postgres tables applied; Poppy pattern snapshots bootstrap v0 wired (five Lark docs); storyboards output as Google Docs; pilot strategist Wendi Amalia; Poppy integration in assisted mode (API needs the $399/mo Power User plan — assessed not necessary for mission success). Full timeline in `runs/run-2026-07-23-001/build-log.md`; design in `deliverables/storyboard-copilot-engineering-package-r2.md`.
- **Standing rule:** every working session on this system commits and pushes to this branch, however small the change — the run history is the learning loop; read `build-log.md` before continuing work.
- **Secrets:** none in this kit; deployment uses the existing managed n8n credentials.
- **Owner:** Faiz (faiz@koocester.com).
