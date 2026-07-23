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

## 2026-07-23 — Rasayel REST API research complete (rest.developers.rasayel.io)

- Auth: `Authorization: Basic <basic-auth-value>` — the "Basic Auth value" shown at key creation, NOT the Bearer/JWT token (that is for the GraphQL API). Key scope must be Read/Write to send. Faiz created key "Customer Succ…" 2026-07-23; value goes directly into n8n Header Auth credential `Rasayel API` (name `Authorization`).
- Send: `POST https://api.rasayel.io/v1/messages`, addressable by `conversation_id` OR `phone` + `channel_id` (no pre-registered contact needed — removes the ManyChat-era subscriber-mapping requirement from the design; cx_state.clients maps client → phone + channel only).
  - Text (session): `{"phone","channel_id","type":"TEXT","text":{"body":"…"}}` → 201 with full message object (sent/delivered/read/failed timestamps + failure_reason for delivery audit).
  - Template (out-of-window): `{"phone","channel_id","type":"TEMPLATE","template":{"message_template_id":N,"components":[…]}}`.
  - Also NOTE (internal) and MEDIA types.
- Templates: full CRUD at `/v1/templates` (create resubmits to Meta) — CX-specific templates can be provisioned via API.
- Conversations: `GET /v1/conversations?phone=…&channel_id=…` — supports the pre-send session-window check (last_inbound_message_at within 24h → TEXT, else TEMPLATE).
- Rate limits: leaky bucket, 100 capacity, 20 req/min refill; `X_Rasayel_Api_Call_Capacity` + `Retry-After` headers. Far above CX volumes; n8n retry policy will honor Retry-After.
- Webhooks: "Message created/updated" subscriptions exist (GraphQL docs + API Dashboard Webhooks section) — inbound path for CX-W5; exact payloads to verify when subscribing.
- D-1 probe (Rasayel version) ready to build once the `Rasayel API` credential exists in n8n: webhook → POST /v1/messages (TEXT to internal number) → respond; second call with TEMPLATE type.

## 2026-07-23 — ✅ D-1 COMPLETE: Rasayel WhatsApp outbound proven (deployment checklist item 1 done)

- Credential: `Rasayel for Customer Success` (n8n id mpqr9eVtImd0S5ZL, httpHeaderAuth) created by Faiz; value is the Rasayel Basic Auth key (key name "Customer Succ…", Read/Write).
- Probe workflow: `CX — D-1 Rasayel WhatsApp Probe (temporary)` (n8n id SentryvcX7iW14Yp), published by Faiz for the test, **deactivated immediately after** (public webhook, temporary by design; kept for reuse when CX-W1 needs a manual send tester).
- Evidence (all via n8n execution of the probe, channel 99720 "Koocester Support" +65 8086 3787, target internal test number +65 8917 5822):
  1. Auth + read: GET /v1/templates → 200, 21 accepted templates enumerated with ids/variables (e.g. courtesy_check_in 673901 {{1}} {{2}}, follow_up_reminder 673908 {{1}}..{{3}}, general_feedback_request 673911, order_status_update 673910 {{1}}..{{4}}).
  2. Session TEXT send: POST /v1/messages → 200, message id 315011078, uuid fb1c45b9-d5f1-4e28-b3ae-544325b6f192, sent_at 2026-07-23T10:01:22Z, conversation 22586514, failure_reason null.
  3. TEMPLATE send (out-of-window path): template 673901 courtesy_check_in with BODY params ["Faiz","the Koocester team"] → 200, message id 315011166, uuid 3c796d84-fa65-431d-b779-64bac6820034, sent_at 2026-07-23T10:01:42Z, same conversation.
- Receipt on the handset confirmed pending Faiz's verbal confirmation (delivery timestamps populate asynchronously in Rasayel).
- Template insight for CX-W1/W2: `order_status_update` ({{1}} name, {{2}} sender, {{3}} order/project, {{4}} status) is a workable interim template for out-of-window project status updates until CX-specific templates are approved. `general_feedback_request` covers CX-W3's ask.
- Checklist position: item 1 DONE. Next per §18: item 2 (fix hardcoded Lark secret in Qlo9PWJ7f3PqwF9i + resolve V-1/V-2), item 3 (HubSpot properties, D-4), with the package's delivery-adapter revision (ManyChat → Rasayel, per DEC-003) to be folded in before CX-W1 is built.

## 2026-07-23 — cx_state schema applied; CX-W1 soak workflow built (checklist item 5 done, item 6 staged)

- Supabase migration `cx_state_schema_v1` applied to Godmode Dashboard project (wnerzolcmjrsktfqferw): schema `cx_state` with tables clients, project_snapshot, events, messages, feedback + indexes. Reverse migration: `DROP SCHEMA cx_state CASCADE;` (documented, not staged). Amended per r5: clients.wa_phone replaces ManyChat subscriber columns.
- CX-W1 created in n8n: `CX-W1 — Client Project Update Engine (soak: diff only, no sends)` (id UXOGKObos0HXbYbb, inactive, validated 0 errors). Design per r4 §4 CX-W1 steps 1–3 only: every 15m (+ manual probe webhook `cx-w1-soak-probe`) → house Lark token pattern → paged search of Projects (Delivery) with client-side Engagement=Client filter → diff vs cx_state.project_snapshot on status/progress/pace/due date → events written with idempotency keys (first run writes state=BASELINE so the initial flood can never become sends) → snapshot upsert. No drafting, no gating, no sending in this version.
- Soak plan: Faiz publishes; baseline run seeds snapshots; 2 days of diff accuracy review against real project activity before the draft/gate/send stages are added.
- Note: events.client_id left NULL during soak; the client mapping (cx_state.clients incl. wa_phone) fills when the pilot list (D-2) arrives.

## 2026-07-23 — CX-W1 published; baseline run verified; soak underway (checklist item 6 in progress)

- Faiz published CX-W1 (UXOGKObos0HXbYbb); baseline run executed via manual probe 10:22 SGT-equivalent.
- First-run finding fixed in place: Lark search API returns DuplexLink fields as `{link_record_ids:[…]}` with no display text, so client_name was null. Fix: each run also reads Clients & Vendor (tblWpq8b0uo1vBtX, Client Name + Client ID) and maps link ids → names/CLI-#### ids. Both Code nodes patched (updateNode); change took effect live.\n- Verified in cx_state after re-run: 363/363 snapshots with project_id + status; 363/363 with client_name and client_id (CLI-####); 40 with Pace, 55 with due dates (plausible — formulas only fill when inputs set); 363 events all state=BASELINE; second run produced 0 DETECTED events and no duplicates (idempotency proven).
- Soak now running on the 15-minute schedule. Review gate: ~2 days of DETECTED events compared against real project activity before building draft/review/send stages.
- events.client_id now populates (CLI-####) for all post-baseline events; superseded the earlier NULL note.
