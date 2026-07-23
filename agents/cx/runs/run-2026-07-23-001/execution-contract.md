# Execution Contract — CX Client Journey and Retention Agent (run-2026-07-23-001)

## Mission summary

Design and specify a production-ready Customer Success (CX) agent that owns the post-sale client journey for Koocester clients: onboarding, event-driven project updates, weekly recaps, feedback collection, and retention management — delivered over WhatsApp (likely via ManyChat), logged in HubSpot, sourced from the Lark M&D base and the Metricool/PCR performance stack. The agent nurtures; the human CX person (Customer Success owner in Lark) closes renewals and handles unhappiness, pricing, and sales questions.

## Business objective

Revenue through retention and word of mouth, opening a recurring revenue model. Every client always in the loop, never in the dark.

## Role

Automation Engineer Worker (per `02-automation-engineer-master-system-prompt-v3.md`), governed by `01-company-agent-orchestrator.md`.

## Scope (this run)

An engineering package: requirements matrix, architecture, workflow designs, data model and field mapping, HubSpot property spec (minimal write surface), state machine, message templates and tone rules, risk register, test plan, rollback plan, deployment checklist, and QA handoff. This is a design run; the ManyChat/HubSpot loop completion happening this week is a dependency, not part of this run's writes.

## Non-scope (this run)

- No client-facing messages are sent.
- No HubSpot properties are created; no HubSpot records are written.
- No n8n workflows are created, modified, or activated.
- No Lark schema changes; no Lark record writes.
- No pricing, discounting, renewal commitments, or sales answers — permanently out of the agent's authority, not just this run's.

## Target audience

Existing Koocester clients (Engagement = Client), pilot subset first (candidate filter: `💰 Money-Confirmed (Jul 2026)`; final pick is a CEO/Hakim decision).

## Deliverables

The 15 items in the worker prompt's Required Deliverables, as a single engineering package plus this run's artifacts.

## Approved sources

- Lark M&D base `BG8PbaZFna1NQksNWkglTN85gSf`: Projects (Delivery) `tblAJKbb2UZRh8rn` (read), Clients & Vendor (Sales) `tblWpq8b0uo1vBtX` (read).
- n8n instance (read): PCR pair, ManyChat workflows, Metricool syncs, Error Handling, digest patterns.
- Postgres `content_perf.reels` (via existing syncs) as the live performance numbers source.
- Mission brief `mission-brief.md` (2026-07-22).
- Best-practice CX/retention playbooks (external, general knowledge; no scraping required this run).

## Prohibited sources

- Raw HubSpot pipeline counts and deal-stage aggregates (unreliable per brief §7) — never presented as fact.
- Any cross-client data outside the addressed client's own Project Number(s) and video numbering.

## Source snapshot

`runs/run-2026-07-23-001/discovery/mcp-discovery.md` (committed af4568a).

## Definition of Done (mandatory, objective)

1. Requirements Matrix covers every explicit requirement in mission brief §1–§19, each with an ID, disposition, and where the design satisfies it. Evidence: matrix cross-references brief sections; no requirement dropped.
2. Architecture and workflow designs name concrete systems, tables, field_ids, workflow ids, and join keys from the discovery snapshot — no invented identifiers. Evidence: every identifier traceable to the snapshot.
3. HubSpot write surface is specified as a minimal named property set with types and owners, marked as build-work requiring human approval before creation. Evidence: property spec section.
4. Message templates satisfy brief §10–§11: direct and warm, premium and concise, no dashes, no unexplained abbreviations, English only, bullets over walls of text; every update template carries status, this week's work, waiting-on items, performance numbers (live-pulled placeholder), next steps with CTA, client name and point of contact. Evidence: template section maps each mandatory element.
5. Numbers discipline is enforced by design: templates contain no literal performance numbers; the data flow shows live pull from Metricool/PCR/Postgres at send time. Evidence: data flow + template placeholders.
6. Cross-client leakage controls specified: scoping by Project Number and client link at query level, plus a pre-send scope check. Evidence: security section.
7. Approval gates match brief §15–§16: pilot = Hakim reviews before send; unhappiness/renewals/pricing/sales route to the human Customer Success owner; steady-state autonomy is a flagged future decision. Evidence: state machine + escalation rules.
8. Every known unknown from brief §17 is dispositioned (resolved with evidence, or carried as an open item with owner). Evidence: unknowns table.
9. Risk register covers at minimum: WhatsApp reputational risk, cross-client leakage, HubSpot data quality, ManyChat/HubSpot dependency, cost model. Evidence: risk register.
10. Test plan covers happy path, invalid data, duplicate triggers, API failures, permission failures, malformed payloads, partial failures, rollback. Evidence: test plan section.
11. All artifacts committed to branch `agent/automation-engineer/cx-client-journey/run-2026-07-23-001` with meaningful messages. Evidence: git log.
12. Independent QA run in an isolated subagent returns PASS with no blocker/major findings outstanding. Evidence: committed QA report.

## Acceptance tests

QA validates each DoD item against the artifact text and the discovery snapshot, and hunts for: invented field_ids or workflow ids, requirement loss, tone violations in templates (dashes, buzzwords, unexplained abbreviations), hardcoded performance numbers, missing approval gates, and scope creep into prohibited actions.

## Lark read plan (this run)

Completed read-only discovery. No further Lark reads required.

## Lark write plan (this run)

None. Zero Lark writes.

## Git plan

Branch `agent/automation-engineer/cx-client-journey/run-2026-07-23-001`; commits per artifact; no merge to main without human approval.

## QA criteria

See Definition of Done + acceptance tests. QA returns PASS / NEEDS_REVISION / ESCALATE with issue IDs QA-###.

## Approval gates

- Merge to main: Faiz/Hakim.
- HubSpot property creation, n8n deployment, ManyChat sends, pilot client selection, Claude API/cost decision: human approval, listed in the deployment checklist as gated steps.

## Stop conditions

Max 3 revisions; escalate on: QA repeat-failure, source conflict, discovery contradiction, any need to write to production systems.

## Limits

- Runtime: this session. Budget: no paid API usage this run. Revisions: 3.
