# Engineering Package — Revision 005 (Amendment to Revision 004)

Run: run-2026-07-23-001 · 2026-07-23 · This amendment supersedes the delivery-channel sections of `cx-agent-engineering-package-r4.md` per DEC-003/DEC-004/DEC-005 and the D-1 build evidence. Everything not amended here stands as written in r4.

## A1. Delivery adapter: Rasayel replaces ManyChat (DEC-003)

All references to ManyChat in r4 §3, §4 (CX-W0/W1/W2/W5), §5, §12, §15 are replaced as follows:

- **Send**: `POST https://api.rasayel.io/v1/messages`, n8n credential `Rasayel for Customer Success` (mpqr9eVtImd0S5ZL), channel_id **99720** ("Koocester Support" +65 8086 3787), addressed by client phone number. Session messages `type: TEXT`; out-of-window messages `type: TEMPLATE` with `message_template_id` + BODY parameters. Proven 2026-07-23 (message ids 315011078, 315011166 — build-log evidence).
- **Session-window check**: `GET /v1/conversations?phone=…&channel_id=99720` → `last_inbound_message_at` within 24h → TEXT, else TEMPLATE. This replaces r4's ManyChat subscriber mapping; `cx_state.clients.manychat_subscriber_id` / `wa_group_ref` are replaced by `wa_phone` (the client contact's WhatsApp number).
- **Inbound (CX-W5)**: Rasayel webhooks ("Message created") replace the ManyChat inbound webhook. Payload verification happens when the subscription is created (build step).
- **Human takeover (T4 moments)**: the Rasayel shared inbox is the human CX owner's takeover surface — same thread, same number. This strengthens r4's T4 design; the Lark DM alert to the CX owner is unchanged.
- **Templates**: 21 Meta-accepted templates exist on channel 99720. Interim mappings until CX-specific templates are approved: event update → `order_status_update` (673910: {{1}} name, {{2}} sender, {{3}} project, {{4}} status); feedback ask (T3) → `general_feedback_request` (673911); re-engagement/check-in → `courtesy_check_in` (673901). CX-specific templates (T1/T2 wording) are drafted and submitted to Meta during CX-W1 build via `POST /v1/templates`.
- **Rate limits**: 100-token bucket, 20 req/min refill; n8n retries honor `Retry-After`. One-update-per-client-per-day rule (r4) stands and keeps volume trivially inside limits.
- ManyChat remains lead-gen infrastructure only; out of CX scope. HubSpot's native WhatsApp channel ("Koocester Indonesia" +65 8034-0629) is untouched by CX; consolidation remains an open housekeeping decision.

## A2. Deferral: Lark secret fix (DEC-004, Faiz 2026-07-23)

Deployment checklist item 2's hardcoded-secret fix in `Post Campaign Report Data (by Video ID)` (Qlo9PWJ7f3PqwF9i) is **deferred, not dropped**. Accepted interim risk: the secret is exposed only to n8n workflow readers (internal). Revisit gate: before steady-state autonomy (D-5) or any expansion of n8n user access, whichever first. The risk register row stands with status "deferred by DEC-004".

## A3. Deferral: HubSpot properties + project_number backfill (DEC-005, Faiz 2026-07-23)

Checklist items 3–4 (seven HubSpot properties, private app, backfill) are **deferred for pilot start**. Engineering assessment recorded: not blocking for sending pilot updates; required for the full mission (client-level CX log, feedback storage, health, renewal dates — brief §7/§9). Interim design so no data is lost:

- `cx_state` (Supabase) becomes the temporary system of record for everything r4 aimed at HubSpot: messages log, `cx_health`, feedback verbatims/scores, renewal candidates.
- CX-W4's output goes to the daily internal digest (Lark DM to CX owner) only.
- When D-4 is eventually executed, a one-time sync replays cx_state into the new HubSpot properties — nothing is orphaned.
- Rasayel's HubSpot integration continues logging raw WhatsApp conversations to HubSpot contacts independently, so client conversations are still visible in HubSpot during the deferral.

## A4. Checklist (r4 §18) as amended

1. ~~D-1 ManyChat outbound~~ → **DONE as Rasayel outbound (2026-07-23)**
2. Deferred per DEC-004 (secret) · V-1 and V-2 still open and still block CX-W1 ship / first send respectively
3. ~~HubSpot properties~~ → deferred per DEC-005
4. ~~project_number backfill~~ → deferred per DEC-005
5. Supabase `cx_state` migration — **next build step**
6. CX-W1 inactive + 2-day soak — next after 5
7. Pilot set (D-2) + wa_phone mapping in cx_state.clients — **needs Hakim/CEO decision**
8. Hakim review card test · 8a. T4 wording sign-off (DEC-001) — pending
9. First live pilot send approved by Hakim — pending
10. CX-W2..W5 rollout — pending
11. Autonomy review (D-5) — future
