# Human Approval Package — CX Client Journey and Retention Agent (run-2026-07-23-001)

Status: **READY_FOR_HUMAN_REVIEW** · QA verdict: PASS on revision 004 (`qa/qa-report-r4.md`) · Zero blocker/major findings outstanding.

## What is being approved

The engineering design for the CX agent: `deliverables/cx-agent-engineering-package-r4.md`. This is a design approval, not a deployment. Nothing has been built or sent; zero writes occurred to Lark, HubSpot, ManyChat, or n8n during this run.

## The design in one paragraph

Six n8n workflows (onboarding CX-W0, event updates CX-W1, weekly recap CX-W2, feedback CX-W3, health/retention monitor CX-W4, inbound triage CX-W5) read delivery truth from the Lark M&D Projects table, pull performance numbers live from the Metricool-synced Postgres store via the existing PCR workflows, send WhatsApp updates through ManyChat, and log CX state into seven new HubSpot properties. Pilot: every message except the pre-approved T4 handover goes through Hakim before sending. The agent nurtures; the human Customer Success owner closes renewals and handles unhappiness, pricing, and sales.

## Human decisions already recorded

- DEC-001 (Faiz, 2026-07-23): T4 handover is a fixed Hakim pre-approved template that sends immediately with parallel human alerting (Option B). One-time wording sign-off gated at deployment checklist item 8a.

## Decisions still open before build (owners in package §14)

- D-1: Prove ManyChat WhatsApp outbound (Faiz, blocks all sends)
- D-2: Pilot client set (Hakim/CEO)
- D-3: LLM/cost model (Faiz + CEO; design works template-only at zero LLM cost)
- D-4: HubSpot property creation + private app + project_number backfill (human admin)
- D-6: Feedback field naming sign-off (Hakim)
- V-1/V-2: Videos post URL field verification; brand guidelines + vault voice documents located

## Minor items collected for human review (non-blocking)

- QA-301: two blanket statements in §9/§10 could each take one clarifying clause about the T4 carve-out.

## QA trail

r1: NEEDS_REVISION (1 blocker, 3 major, 4 minor) → r2: NEEDS_REVISION (1 blocker, 1 major, 3 minor) → r3: NEEDS_REVISION (1 major, 1 minor; revision cap reached, escalated) → DEC-001 → r4: **PASS**. 16 findings raised across the run; 15 resolved with evidence; 1 minor collected above. All four QA rounds ran in isolated fresh contexts.

## Approval requested

1. Approve the revision 004 design as the build blueprint.
2. Approve merge of branch `agent/automation-engineer/cx-client-journey/run-2026-07-23-001` to `main`.

The agent does not self-approve and does not merge. On approval, the next run executes the deployment checklist starting with D-1.
