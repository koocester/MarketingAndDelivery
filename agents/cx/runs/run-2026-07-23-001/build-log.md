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

## 2026-07-23 — Rasayel verified in-app; DEC-003 confirmed; D-1 re-scoped to Rasayel

Verified live in Rasayel (Faiz logged in, app id 124386, workspace user Tech tech@koocester.com, id 213707):

- **Channel:** exactly one WhatsApp channel — "Koocester Support", number **+65 8086 3787** (display 6580863787), channel id 99720, installed by Tech 23 days ago (~2026-06-30, matching the HubSpot app install).
- **Templates:** a library of Meta-**Accepted** templates already exists on this channel, several directly reusable for CX out-of-window sends: `follow_up_reminder` (Utility), `general_feedback_request` (Utility), `general_inquiry_follow_up` (Utility), `courtesy_check_in` (Marketing), `check_in_on_proposal` (Marketing), `appointment_request` (proven in a real send 2026-07-14). CX-specific templates (event update, weekly recap) still need drafting + Meta approval, but the approval pipeline is proven.
- **API:** API Dashboard accessible on the current plan (Access Keys + Webhooks sections present; "Developer documentation" linked). **No API key exists yet.**
- **Sends proven:** inbox shows real outbound template sends on 2026-07-14 to four test contacts via Koocester Support; messaging-window behaviour visible in-app ("Messaging window expired → use a message template or bot flow"), confirming the 24h/template model.

**DEC-003 CONFIRMED** (Faiz directed the Rasayel verification after questioning ManyChat; recorded here as the operative decision): CX WhatsApp delivery = Rasayel channel "Koocester Support" +65 8086 3787. ManyChat is out of CX scope (lead-gen only). The engineering package's delivery adapter and CX-W5 inbound source will be revised to Rasayel API + webhooks in the next package revision, before CX-W1 is built.

**D-1 re-scoped:** prove one Rasayel API send (session message to an internal number that has messaged +65 8086 3787 within 24h, plus one template send). Remaining prerequisites:
1. Faiz creates an API key in Rasayel (Settings → API management) and enters it **directly into the n8n credential store** as a new credential (never through chat).
2. n8n workflow-creation permission for this session (previous attempt classifier-denied) or Faiz creates the 3-node probe manually.
3. Housekeeping decision open: HubSpot native WhatsApp channel ("Koocester Indonesia" +65 8034-0629) vs Rasayel — which owns client WhatsApp long-term; recommend consolidating on Rasayel to avoid split inboxes.
