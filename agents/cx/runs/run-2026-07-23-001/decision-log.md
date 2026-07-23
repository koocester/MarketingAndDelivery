# Decision Log — run-2026-07-23-001

## DEC-003 — WhatsApp delivery channel: Rasayel, not ManyChat (2026-07-23)

- Decision maker: Faiz (in chat: questioned ManyChat given the paid Rasayel subscription, directed and enabled the Rasayel verification).
- Evidence: ManyChat has WhatsApp connected on no account (browser-verified); Rasayel is live with channel "Koocester Support" +65 8086 3787 (app 124386, channel 99720), a HubSpot-certified integration active in portal 242943364, a library of Meta-accepted templates, proven sends (2026-07-14), and API + webhooks available on the current plan.
- Decision: the CX agent's WhatsApp delivery and inbound triage run on Rasayel (API + webhooks). ManyChat remains lead-gen only, out of CX scope. Brief §9/§19's "likely ManyChat" is superseded by this evidence; the mission's channel requirement (WhatsApp, HubSpot as system of record) is unchanged.
- Follow-ups: engineering package delivery-adapter revision before CX-W1 build; API key created by a human directly into n8n credentials; consolidation decision on the HubSpot-native "Koocester Indonesia" +65 8034-0629 channel.

## DEC-002 — Design approval and build authorization (2026-07-23)

- Decision maker: Faiz (in chat, this session).
- Decision: revision 004 design approved per `approval-package.md`; build phase authorized, starting with deployment checklist item 1 (D-1: prove ManyChat WhatsApp outbound to an internal test number).
- Note: role work stays on the standing `cx` branch per repo convention; no merge to main performed as part of this approval.

## DEC-001 — QA-201 resolution (2026-07-23)

- Decision maker: Faiz (in chat, this session), per escalation-report.md.
- Decision: **Option B.** T4 is a fixed, Hakim pre-approved handover template. It sends immediately with no per-message review gate, while the human Customer Success owner is alerted in parallel. Rationale: when a client is unhappy, an immediate warm acknowledgement plus fast human takeover beats gated silence.
- Consequences: revision 004 authorized beyond the 3-revision cap solely to apply this decision and QA-202. T4 becomes part of the pilot setup checklist: Hakim approves the exact T4 wording (including the standing handover window phrase) once, before first pilot send; any later change to T4 wording requires re-approval.
- QA-202 resolution folded in: `{handover_window}` is replaced by a fixed phrase inside the pre-approved template (default proposal: "shortly today"), approved by Hakim as part of the one-time T4 sign-off. It is no longer a live placeholder.
