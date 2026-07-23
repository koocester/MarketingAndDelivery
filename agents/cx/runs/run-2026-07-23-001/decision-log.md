# Decision Log — run-2026-07-23-001

## DEC-001 — QA-201 resolution (2026-07-23)

- Decision maker: Faiz (in chat, this session), per escalation-report.md.
- Decision: **Option B.** T4 is a fixed, Hakim pre-approved handover template. It sends immediately with no per-message review gate, while the human Customer Success owner is alerted in parallel. Rationale: when a client is unhappy, an immediate warm acknowledgement plus fast human takeover beats gated silence.
- Consequences: revision 004 authorized beyond the 3-revision cap solely to apply this decision and QA-202. T4 becomes part of the pilot setup checklist: Hakim approves the exact T4 wording (including the standing handover window phrase) once, before first pilot send; any later change to T4 wording requires re-approval.
- QA-202 resolution folded in: `{handover_window}` is replaced by a fixed phrase inside the pre-approved template (default proposal: "shortly today"), approved by Hakim as part of the one-time T4 sign-off. It is no longer a live placeholder.
