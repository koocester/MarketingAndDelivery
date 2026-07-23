# Decision Log — run-2026-07-23-001

## DEC-005 — Defer HubSpot properties and project_number backfill (2026-07-23)

- Decision maker: Faiz (in chat), on engineering advice that items 3–4 do not block pilot sends but remain required for the full mission.
- Decision: checklist items 3–4 deferred. Interim: cx_state (Supabase) holds CX log/health/feedback/renewals; daily digest to CX owner replaces cx_health property writes; one-time replay into HubSpot when D-4 executes. Rasayel's HubSpot integration keeps logging raw conversations meanwhile.

## DEC-004 — Defer hardcoded Lark secret fix (2026-07-23)

- Decision maker: Faiz (in chat).
- Decision: the pre-existing hardcoded Lark app secret in PCR data workflow Qlo9PWJ7f3PqwF9i stays for now (internal exposure only). Hard revisit gate: before steady-state autonomy (D-5) or any n8n access expansion.

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
