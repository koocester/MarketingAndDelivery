# Build Log — CX Client Journey Agent (run-2026-07-23-001)

Read this before continuing work in any session. Newest entries at the bottom. Blueprint: `deliverables/cx-agent-engineering-package-r4.md` §18 deployment checklist.

## 2026-07-23 — Approval and build start

- DEC-002: Faiz approved the revision 004 design in chat; build phase authorized starting with checklist item 1 (D-1: prove ManyChat WhatsApp outbound to an internal test number).
- Manifest state: HUMAN_APPROVED. Work continues on the standing `cx` branch.
- Checklist position: item 1 (D-1) in progress. Items 2–11 not started.

## 2026-07-23 — D-1 research complete, workflow creation pending permission

- ManyChat credential confirmed in n8n: `Manychat API` (httpHeaderAuth, id vmcgC8qXLH06C8aj), used by ManyChat Sync (PQ89Q6xBTPaCXrve) against `https://api.manychat.com/fb/page/getInfo`.
- API research (ManyChat community/docs): WhatsApp send within the 24h session window is `POST https://api.manychat.com/fb/sending/sendContent` with body `{"subscriber_id": N, "data": {"version": "v2", "content": {"type": "whatsapp", "messages": [{"type": "text", "text": "..."}]}}}` — no `message_tag` for WhatsApp. Outside the 24h window WhatsApp requires an approved Message Template (via a flow + `sendFlow`). Subscriber lookup: `GET /fb/subscriber/findBySystemField?phone=...`.
- Supabase `public.manychat_leads` (Godmode Dashboard project wnerzolcmjrsktfqferw) contains only the 2026-07-13 smoke-test row (`test-001`) — no real subscribers yet, so the probe target must be supplied by a human.
- Probe workflow designed: `CX — D-1 WhatsApp Probe (build check, temporary)` — GET webhook `cx-d1-probe`; no phone param → responds with Page Info (channel check); with `phone` (+`text`) params → findBySystemField → sendContent → respond. Inactive, errorWorkflow ReSF67JnUkuFRkCZ, Asia/Singapore.
- BLOCKED: n8n workflow creation denied by the session permission classifier; awaiting Faiz to allow n8n write tools (or create the workflow manually). Also awaiting the internal test WhatsApp number for the send.
- D-1 implications for design already visible: real sends depend on the client having messaged within 24h OR an approved WhatsApp template. CX-W1 event updates will regularly fall outside the session window, so an approved template (or template-triggering flow) is part of D-1's completion evidence, not just one session-window send.

## 2026-07-23 — D-1 finding: ManyChat has NO WhatsApp connected; Rasayel is the live WhatsApp stack

Browser verification (Faiz's Chrome, screenshots taken in session):

- ManyChat: WhatsApp NOT connected on any checked account. Main Koocester (fb4655708), Koocester Business (fb4741619), and Koocester Wealth Main (fb5044041) all show the "Connect" onboarding screen; an abandoned FREE shell account literally named "new WhatsApp account" (fb4814866, 0 contacts, no channels) confirms a setup was started and dropped. The brief's "ManyChat is the likely delivery path" assumption is falsified — connecting would need a Meta embedded signup, a dedicated number, and wallet funding.
- HubSpot portal koocester.com (242943364) connected apps: HubSpot-native "WhatsApp Business" (installed by Cheryl Lim 2026-06-10) with ONE live channel in the shared inbox: "Koocester Indonesia" +65 8034-0629, enabled. AND Rasayel's certified app "WhatsApp for Sales" (app 548954, installed by tech@koocester.com 2026-06-30, last activity today 2026-07-23 14:45) — logs WhatsApp activity into HubSpot and exposes WhatsApp actions in HubSpot workflows. ManyChat's HubSpot app is also installed (Mike Ka Wee, 2026-07-16).
- Rasayel app itself (app.rasayel.io): no active browser session; numbers connected inside Rasayel not yet enumerated. The company pays a monthly Rasayel subscription (per Faiz).
- Config smell to consolidate later: two parallel WhatsApp integrations in HubSpot (native channel + Rasayel). A WhatsApp number can only be bound to one API provider at a time, so the native +65 8034-0629 channel and Rasayel's number(s) are distinct bindings.

### DEC-003 (PROPOSED) — switch CX WhatsApp delivery from ManyChat to Rasayel

Rationale: already paid monthly; WhatsApp already live in the company via Rasayel; HubSpot-certified integration logs conversations into the CX system of record natively; team inbox gives the human CX owner same-thread takeover for T4 handovers; Rasayel exposes an API/webhooks for n8n. ManyChat remains lead-gen only, out of CX scope. Design impact: delivery adapter + inbound triage source swap in CX-W1/W2/W5; template requirement (24h rule) unchanged — it is Meta's rule, vendor-independent. D-1 re-scopes to "prove one Rasayel API send to an internal number".
Blocked on: Faiz confirmation + Rasayel account access (which numbers are connected, plan includes API + webhooks, API token).
