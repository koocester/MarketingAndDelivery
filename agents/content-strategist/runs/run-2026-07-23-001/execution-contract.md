# Execution Contract — Storyboard Copilot (run-2026-07-23-001)

## Mission summary

Design and prepare for deployment an AI copilot that assists the two Content Strategists: it drafts the full storyboard (GUIDE - Producer Marketing Plan structure) from the discovery-call transcript into the M&D base Video record, maintains the discovery-call extraction question set, and runs the automated winners-to-Poppy-AI feedback loop. Assist, not autopilot: the strategist runs the call and owns approval.

## Business objective

Data-driven video planning that doubles down on proven winners, so every video drives leads and virality together; free the two strategists for higher-leverage work.

## Role

Automation Engineer Worker under the Company Agent Orchestrator.

## Scope (this run)

- MCP-first discovery against the live Lark M&D base and n8n instance.
- Full engineering design package: requirements matrix, architecture, workflow design, data model and field mapping, state machine, implementation plan, risk register, test plan, rollback plan, deployment checklist, QA handoff.
- The discovery-call extraction question set (v1 exists in the kit; validated against the brief).

## Non-scope (this run)

- No production Lark writes, no schema changes, no n8n workflow creation or activation, no Poppy AI connection (identifier pending from Faiz), no publishing, no sharing of the GUIDE.

## Target audience of the output

Producers (execute the shoot), Content Strategists (review/QC), video editors (intent/lead magnet/CTA at a glance); downstream, the videos serve Koocester page followers and the lead-magnet target audience.

## Deliverables

1. Engineering package (`deliverables/storyboard-copilot-engineering-package-r2.md`, current revision; r1 preserved alongside) covering the 15 required Automation Engineer outputs.
2. MCP discovery snapshot (`discovery/mcp-discovery.md`).
3. Discovery-call extraction question set (kit file `discovery-call-extraction-questions.md`, validated).
4. This contract, run manifest, QA report, approval package.

## Approved sources

Live M&D base `BG8PbaZFna1NQksNWkglTN85gSf` (read-only), live n8n instance (read-only), CEO Mission Brief 2026-07-22, kit files in this directory, Hormozi offer principles and NLP technique as named standards. Poppy AI and Metricool as named systems (Metricool data reached through the existing Postgres sync).

## Prohibited sources

Anything outside the approved list; no invented guest facts or numbers; no unverifiable claims.

## Definition of Done (objective, testable)

| # | Criterion | Evidence required |
|---|---|---|
| D1 | Every brief §6 deliverable is mapped to a design component in the package | Requirements matrix rows R1–R22 each cite a package section |
| D2 | All 15 Automation Engineer deliverables present | Package section headings 1–15 |
| D3 | Write surface fully enumerated and minimal — Lark: one URL field + new doc + DM (+ fallback staging doc); Postgres: claim/upload ledger rows; Poppy AI: stats upload — with the write-safety sequence specified as its own subsection | Package §7 (write surface) and §7.1 (write-safety sequence) |
| D4 | Brief §17 unknowns each resolved from live source, or explicitly escalated with an owner | Discovery §Resolved unknowns + package §Risk Register |
| D5 | No schema change, publish, share, or approval action is performed or designed as automatic | Package prohibited-actions section; run performed zero Lark writes |
| D6 | Winners-to-Poppy-AI loop designed end to end with a working fallback while Poppy AI access is unresolved | Package §Architecture C and §Implementation Plan |
| D7 | Every workflow defines trigger, validation, error handling, retry, idempotency, logging, notification per the n8n standard | Package §Workflow Design |
| D8 | Security review recorded; no secrets committed to this repo | Discovery §Security findings; repo grep clean |
| D9 | Test, rollback, deployment plans exist and are executable by a human | Package §12–14 |
| D10 | All artifacts committed on the run branch; QA run in a fresh context returned PASS or its blocker/major findings were fixed | git log; QA report file |

## QA criteria

Independent QA verifies: requirement coverage against the brief section by section, factual accuracy of every schema claim against the discovery snapshot, no invented field names or IDs, confidentiality rules honoured, no auto-approval anywhere in the design, feasibility of the fallback path, and the DoD table above.

## Approval gates (deployment-time, from brief §16 and orchestrator §19)

- Marking a storyboard reviewed/approved: Content Strategist only, via the existing `Storyboard Done and Checked` button.
- Sharing a storyboard with a client/interviewee: human action only.
- Anything touching offer or pricing on a paid client video: stop and ask.
- Creating the proposed `Storyboard Draft Status` field (schema change): CEO/base-owner approval.
- Activating any new n8n workflow in production: human approval.
- Rotating the exposed Lark app secret: human approval (recommended).

## Stop conditions

Max 3 revisions; escalate on: Poppy AI access blocking pilot value, Lark permission failure, conflicting schema evidence, any need to write outside the defined surface.

## Limits

Runtime: this session. Budget: cost-efficient model choice is a deployment parameter, not fixed. Revisions: 2–3 rounds with the strategist per storyboard at run time.
