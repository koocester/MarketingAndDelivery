# Content Strategist — Storyboard Copilot kit

The prompt stack and run record for the Storyboard Copilot mission (CS = Content Strategist, never Customer Success).

- **Purpose:** an AI copilot that drafts the full GUIDE-structure storyboard from the discovery-call transcript into the M&D base Video record, maintains the discovery-call extraction question set, and runs the winners-to-Poppy-AI feedback loop. Assist, not autopilot — the strategist owns the call and approval.
- **Operating stack:** `01-company-agent-orchestrator.md` (control layer) → `02-automation-engineer-master-system-prompt-v3.md` (role worker) → `mission-brief.md` (CEO Mission Brief, 2026-07-22).
- **Systems touched (at deployment):** Lark M&D base Videos table (one URL field + new draft docs + DMs), Postgres (`copilot.storyboard_claims`, `copilot.poppy_uploads`), Poppy AI (uploads), n8n (workflows W1/W2). Full enumeration in the engineering package §7.
- **Status:** design QA-passed at revision 2, READY_FOR_HUMAN_REVIEW. Start at `runs/run-2026-07-23-001/approval-package.md` — decisions E1–E7 gate the build. Test plan, rollback, and deployment checklist are in `runs/run-2026-07-23-001/deliverables/storyboard-copilot-engineering-package-r2.md` §12–§14.
- **Secrets:** none in this kit; deployment uses the existing managed n8n credentials.
- **Owner:** Faiz (faiz@koocester.com).
