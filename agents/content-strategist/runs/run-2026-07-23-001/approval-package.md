# Human Approval Package — Storyboard Copilot (run-2026-07-23-001)

Status: READY_FOR_HUMAN_REVIEW · QA: PASS at revision 2 · Zero production writes were made this run (Lark and n8n were read-only).

## What you are approving

The engineering design for the Storyboard Copilot, ready to move into build/pilot. Read `deliverables/storyboard-copilot-engineering-package-r2.md` (the current revision).

## Decisions needed from you (minimum set)

| # | Decision | Why it needs you |
|---|---|---|
| E1 | Poppy AI access: supply the identifier/API key, or approve the Playwright path, or start the pilot in assisted mode (design supports all three) | Third-party dependency only you can resolve (brief §17) |
| E2 | Pick the pilot Content Strategist (one of the two) | Business decision (brief §14/§17) |
| E3 | Approve the two Postgres migrations: `copilot.storyboard_claims`, `copilot.poppy_uploads` | New tables in a production database |
| E4 | Approve building W1/W2 in n8n (deployed inactive, dry-run first per the checklist) | New production automations |
| E5 | Security: approve moving the hardcoded Lark app secret in "Post Campaign Report Data (by Video ID)" to the shared credential and rotating it | Pre-existing exposure found during discovery; touches a live workflow |
| E6 | Optional, later: approve the `Storyboard Draft Status` select field on the Videos table | Schema change; not needed for day one |
| E7 | Assisted mode prerequisite: have a strategist export the Poppy pattern snapshot per vertical | Human step the pilot depends on if E1 lands on assisted mode |

## What was NOT done, by design

No Lark record was written, no doc created, no workflow created or modified, no schema touched, nothing shared or published, the GUIDE was neither read into the repo nor reproduced.

## Evidence trail

- Branch: `agent/automation-engineer/storyboard-copilot/run-2026-07-23-001` (local repo initialized this run; no remote configured — add one and open a draft PR if you want the GitHub gate)
- Discovery snapshot: `discovery/mcp-discovery.md` (live Lark schema, 16 pages, n8n inventory, security finding)
- Contract + DoD: `execution-contract.md` — all criteria pass at r2 (D10's QA condition met by `qa/qa-report-r2.md`)
- QA: `qa/qa-report-r1.md` (NEEDS_REVISION, 12 findings) → revision 2 → `qa/qa-report-r2.md` (PASS)
