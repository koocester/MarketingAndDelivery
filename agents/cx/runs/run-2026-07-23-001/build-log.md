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
