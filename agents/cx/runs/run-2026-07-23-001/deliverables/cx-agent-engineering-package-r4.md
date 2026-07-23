# CX Client Journey and Retention Agent — Engineering Package (Revision 004)

Run: run-2026-07-23-001 · Role: Automation Engineer Worker · Status target: READY_FOR_QA
Supersedes revision 003. Addresses QA-201 and QA-202 from `../qa/qa-report-r3.md` per human decision DEC-001 (`../decision-log.md`, Faiz, Option B); revision 004 authorized beyond the 3-revision cap solely to apply that decision. All prior fixes retained.
All system identifiers in this package come from `../discovery/mcp-discovery.md` (committed snapshot, amended per QA-001 and QA-101 to record identifiers returned by this run's live n8n and Lark listings). No identifier is invented.

---

## 1. Executive Summary

The CX agent is an n8n-orchestrated system that keeps every Koocester client continuously informed about their own projects, with real numbers pulled live at send time, and that surfaces retention signals to the human Customer Success owner. It reads delivery truth from the Lark M&D Projects table, performance truth from the Metricool-synced Postgres store already used by the Post Campaign Report, and logs client-level CX state into a deliberately small set of new HubSpot properties. WhatsApp delivery goes through ManyChat, which is connected to n8n but whose outbound WhatsApp send is not yet proven; that is the single hard dependency this week. During pilot, every message passes a Hakim review gate before sending. The agent never closes renewals, never touches pricing, and routes any sign of unhappiness or sales intent to the human CX owner recorded in Lark.

Six workflows deliver the whole journey (QA-006): onboarding (CX-W0), the event-driven update engine (CX-W1), the weekly recap (CX-W2), the feedback loop (CX-W3), the health and retention monitor (CX-W4), and inbound reply triage (CX-W5). Total new HubSpot write surface: seven properties (QA-004). Total new Lark write surface: none.

## 2. Requirements Matrix

| ID | Requirement (brief §) | Disposition | Where satisfied |
|---|---|---|---|
| R-01 | Own post-sale journey: onboarding, updates, cadence, feedback, retention, CX optimisation (§6) | Designed | §4 workflows CX-W0..W5 |
| R-02 | Event-driven updates at every meaningful action (§6) | Designed | CX-W1 change detection |
| R-03 | Weekly recap of what we did (§6) | Designed | CX-W2 |
| R-04 | Numbers pulled live at send time, never hardcoded or repeated (§11) | Designed | §7 data flow; templates carry placeholders only |
| R-05 | Mandatory update content: status, week's work, waiting-on, numbers, next steps + CTA, client name and contact (§11) | Designed | §10 templates T1/T2 |
| R-06 | Tone: direct, warm, premium, concise, bullets, no dashes, no unexplained abbreviations, English only, no buzzwords; **speaks from abundance, always on the client's side, makes them feel great (QA-104)**; **follows the Koocester brand guidelines and the vault voice reference** (§10) | Designed | §10 template rules incl. voice calibration (QA-003); §9 validation gate; §12 step 5 |
| R-07 | HubSpot is client-level system of record for CX status, updates log, feedback (§7, §9) | Designed | §6 HubSpot property spec |
| R-08 | Read project status from M&D Projects table, keyed by Project Number (§9) | Designed | §8 field mapping (Project ID fldcNp57bP) |
| R-09 | WhatsApp delivery via ManyChat, to be confirmed (§9, §17) | Designed + open dependency | §5 architecture; D-1 in §14 |
| R-10 | Reuse PCR for client reporting, do not rebuild (§19) | Designed | CX-W2 calls PCR workflows fNPWAIlcdv1Uso7k / Qlo9PWJ7f3PqwF9i |
| R-11 | Never lie, never invent numbers or status; unsure → stop and ask (§12) | Designed | §9 state machine ESCALATED path; source-only data rule |
| R-12 | No promises not committed; no confidential or cross-client data; no pricing or discounts (§12) | Designed | §11 guardrails; scope checks |
| R-13 | Pilot: Hakim reviews every message pre-send; steady state autonomous later (§14, §15) | Designed | §9 PENDING_REVIEW gate, feature-flagged |
| R-14 | Unhappiness, renewals, pricing, deep sales questions → human CX person (§16) | Designed | CX-W5 triage + routing to Customer Success owner (fldAarYRS6 / fldKobTRZ7) |
| R-15 | Strict scoping by Project Number and video numbering, no cross-client leakage (§12, §18) | Designed | §11 leakage controls |
| R-16 | Do not trust raw HubSpot pipeline counts (§7, §18) | Designed | §6 rule: agent reads only its own CX properties + verified fields |
| R-17 | Small, well-defined HubSpot write surface on day one (§19) | Designed | §6: seven properties, nothing else |
| R-18 | Most cost-efficient path; Claude API undecided (§14, §17) | Dispositioned | §12 implementation plan, decision D-3 |
| R-19 | Pilot client set undecided (§14, §17) | Dispositioned | Decision D-2; candidate filter 💰 Money-Confirmed |
| R-20 | Full client history read from relationship start (§14) | Designed | CX-W0 onboarding context build |
| R-21 | Best practice CX cadence and health signals (§7, §8) | Designed | §4 health model in CX-W4 (QA-005) |
| R-22 | Surface business mishaps and inefficiencies (§3) | Designed | CX-W4 internal digest to CX owner + management |
| R-23 | Link PCR reports and creative from the HubSpot record rather than duplicating them (§9) | Designed | §6 timeline-note rule: links only, never file duplicates (QA-007) |

No requirement from the brief is dropped. Unknowns are carried in §14.

## 3. Architecture

```text
                        ┌────────────────────────────────────────────┐
                        │                  n8n (SGT)                 │
                        │                                            │
  Lark M&D base ──read──▶ CX-W1 Update Engine (every 15m poll+diff)  │
  Projects tblAJKbb2UZRh8rn │      │                                 │
  Clients tblWpq8b0uo1vBtX  │      ├──first project for a client──▶ CX-W0 Onboarding
                        │      ▼                                     │
                        │  cx_state (Supabase, run ledger + dedupe)  │
  Postgres content_perf ──▶ CX-W2 Weekly Recap (Fri) ── PCR reuse ──▶ PDF/report link
  (Metricool syncs)     │      │                                     │
                        │      ▼                                     │
                        │  Draft builder (template + LLM assist,     │
                        │  voice calibrated to brand guidelines +    │
                        │  vault voice reference)                    │
                        │      │                                     │
                        │      ▼                                     │
                        │  PILOT GATE: Hakim approve (Lark card)     │
                        │      │approved                             │
                        │      ▼                                     │
  ManyChat API ◀──send───  WhatsApp delivery                         │
       │                │      │                                     │
       ▼                │      ▼                                     │
  Client WhatsApp       │  HubSpot write-back (7 CX properties,      │
       │reply           │  timeline note with report links)          │
       ▼                │                                            │
  CX-W5 Inbound Triage ─▶ sentiment: negative/sales/pricing → Lark DM│
                        │  to Customer Success owner (human)         │
                        │                                            │
                        │ CX-W4 Health Monitor (daily) → CX owner    │
                        │ CX-W3 Feedback Loop (milestone-triggered)  │
                        └────────────────────────────────────────────┘
```

Principles: Lark stays delivery truth (read-only to CX). HubSpot holds client-level CX state (small write surface). Postgres `cx_state` is the agent's own ledger (dedupe, idempotency, audit) so retries never double-send. All workflows set errorWorkflow `ReSF67JnUkuFRkCZ` and run Asia/Singapore.

## 4. Workflow Designs

### CX-W0 — Onboarding (triggered on new Client project)

Trigger: CX-W1 diff detects a first project for a client entering Planning or In Production.
Steps: read full client history (Clients & Vendor record + all linked projects + service agreement reference) → build onboarding context pack → draft welcome message (T0) introducing cadence and point of contact → pilot gate → send → write HubSpot `cx_last_update_sent`, timeline note.

### CX-W1 — Event-Driven Update Engine (every 15 minutes)

House pattern: Auto-stamp Upload Date (KxebTkw9GfV6Icqr) style scheduled poll (identifier recorded in the amended discovery snapshot, QA-001).
Steps:
1. Search Projects (Delivery) where Engagement = Client (and pilot filter during pilot).
2. Diff against `cx_state.project_snapshot` on meaningful fields: Status (Manual), Videos Done, Carousels Done, Deliverables Progress, Pace, Due Date, new linked Video post URLs.
3. Meaningful change → enqueue one update event per client per day maximum (batching multiple changes into one message; anti-spam rule).
4. Pull live numbers for that client's projects via PCR data workflow (Qlo9PWJ7f3PqwF9i pattern) scoped to the project's video IDs.
5. Build draft from template T1 with claim-to-source map attached.
6. Pilot gate → ManyChat send → HubSpot write-back (`cx_last_update_sent`, timeline note with message body) → mark event SENT in cx_state.

### CX-W2 — Weekly Recap (Friday 15:00 SGT)

Per pilot client: aggregate the week's delivered work from the Projects/Videos diff history in cx_state, pull live performance via the PCR pair (reusing fNPWAIlcdv1Uso7k for the client-facing report when a full report is warranted), draft T2 recap, pilot gate, send, write-back. If nothing happened that week, the recap says what is planned next instead of going silent; the client is never in the dark.

### CX-W3 — Feedback Loop (milestone-triggered)

Trigger: project Status (Manual) transitions to Delivered or Completed (from CX-W1 diff).
Steps: wait 2 working days after the milestone message → draft T3 feedback ask (one question, reply-in-thread) → **pilot gate (QA-102: same PENDING_REVIEW gate as every other outbound; steady state per D-5)** → send → capture reply via CX-W5 inbound → store verbatim in HubSpot `cx_feedback_last` + score in `cx_feedback_score` → negative feedback also routes to the human CX owner immediately.

### CX-W4 — Health and Retention Monitor (daily 09:00 SGT)

Health model (computed per client, written to `cx_health`):
- GREEN: Pace on track, updates acknowledged, no negative feedback, no overdue deliverables.
- AMBER: any of — Pace "Behind", Days to Due negative on any live project, no client acknowledgement for 14 days, feedback score dipping.
- RED: negative feedback, explicit unhappiness, or two AMBER signals concurrently.
Actions: write `cx_health` to HubSpot; RED or AMBER→RED transition sends a Lark DM to the project's Customer Success owner (fldAarYRS6) with evidence, never to the client. For Deal Type = Retainer (Monthly) or approaching Due Date on Package deals, compute `cx_renewal_date` candidate and notify the CX owner 30 days ahead. The daily internal digest also lists detected mishaps (behind pace, overdue, unacknowledged) for management visibility, satisfying R-22.

### CX-W5 — Inbound Reply Triage (ManyChat webhook)

Pattern: ManyChat Leads → Supabase (aTQN0VUvzUYszLai) inbound direction.
Steps: receive reply → identify client by ManyChat subscriber mapping in cx_state → classify: acknowledgement (log it), question about own project (answer from Lark/PCR data, through pilot gate), negative sentiment or complaint (RED path: human CX owner DM within minutes, agent replies only with template T4), renewal/pricing/sales intent (route to human, template T4, never answered by agent).

**T4 gate exemption (QA-201, per DEC-001 Option B):** T4 is a fixed, Hakim pre-approved template with no variable content beyond the client's first name and the CX owner's name. It sends immediately without a per-message PENDING_REVIEW gate, while the human CX owner is alerted in parallel, because an immediate warm acknowledgement plus fast human takeover beats gated silence when a client is unhappy. Hakim approves the exact T4 wording once before first pilot send (deployment checklist item 8a); any wording change requires re-approval. All other CX-W5 outbound (the answer branch) remains gated.

## 5. API Research

| API | Status | What is verified | What is not |
|---|---|---|---|
| Lark Bitable | Proven in production (many house workflows) | Auth via tenant token credential `Lark App Secret (Koocester)`; search/read on Projects and Clients tables; rate pacing ~320ms | Nothing outstanding for read-only use |
| ManyChat | Credential connected; Page Info call proven (PQ89Q6xBTPaCXrve); inbound leads proven (aTQN0VUvzUYszLai) | API reachability, inbound webhooks | **Outbound WhatsApp template/session messages: NOT proven. WhatsApp has a 24-hour session window; out-of-window sends need approved template messages. Must be confirmed before CX-W1 can ship (D-1)** |
| HubSpot | No MCP; no live inspection this run | — | Property creation (needs portal admin), contact/deal read, timeline notes API, auth method for n8n (private app token). All gated build-work (D-4) |
| Metricool | Indirect via existing syncs to Postgres `content_perf.reels` | Per-post views, reach, likes, comments, shares, saves | No direct Metricool calls needed day one |
| PCR pair | Live workflows | Data join by Video ID; report render + Lark delivery | Parameterising delivery target for client WhatsApp instead of Lark chat (small change, listed in implementation plan) |

Unknown capability is never assumed capability: CX-W1/W2 sends are blocked behind D-1 confirmation.

## 6. HubSpot Write Surface (minimal, day one)

Seven custom properties (QA-004): six client-level CX properties plus one deal-level join key. All created manually by a human with portal admin before deployment (approval-gated):

| Property | Level | Type | Written by | Meaning |
|---|---|---|---|---|
| `cx_health` | company | enum GREEN/AMBER/RED | CX-W4 | Current client health |
| `cx_last_update_sent` | company | datetime | CX-W1/W2 | Last outbound update |
| `cx_last_ack` | company | datetime | CX-W5 | Last client acknowledgement |
| `cx_feedback_last` | company | text | CX-W3 | Latest verbatim feedback |
| `cx_feedback_score` | company | number 1–5 | CX-W3 | Latest feedback score |
| `cx_renewal_date` | company | date | CX-W4 (candidate), human confirms | Renewal horizon |
| `project_number` | deal | text PRJ-#### | one-time backfill, then sales process | Mirror of Lark Project ID for the join |

Plus timeline notes (engagement API) for the updates log — append-only, no schema. **Reference rule (R-23, brief §9): campaign reports and creative are linked from the timeline note (PCR report URL, post URLs), never duplicated as files into HubSpot.** The agent reads back only these seven properties and verified identity fields; it never reads or reports pipeline aggregates (R-16). Everything else in HubSpot stays out of the write surface per CEO context §19.

## 7. Data Model and Data Flow

New Supabase schema `cx_state` (agent-owned ledger; keeps production systems clean):

| Table | Key columns | Purpose |
|---|---|---|
| `clients` | client_id (CLI-####), lark_record_id, hubspot_company_id, manychat_subscriber_id, wa_group_ref, cx_owner_email, pilot boolean | Identity map — the only place channel identity lives |
| `project_snapshot` | project_id (PRJ-####), fields hash, status, videos_done, carousels_done, progress, pace, due_date, snapshot_at | Diff base for CX-W1 |
| `events` | event_id, project_id, client_id, type, detected_at, state, message_id, idempotency_key | Event ledger; unique(idempotency_key) prevents double-send |
| `messages` | message_id, client_id, direction, template, body, numbers_source_refs (json), approved_by, sent_at | Full audit of every client-facing message with its claim-to-source map |
| `feedback` | client_id, project_id, score, verbatim, received_at | Local mirror of feedback before HubSpot write |

Numbers flow (R-04): template placeholder → CX workflow queries Postgres `content_perf.reels` scoped by the client's video post URLs (PCR join logic) at send time → values injected → `numbers_source_refs` records query + timestamp. A message with any unresolved placeholder hard-fails validation and cannot reach the send node.

## 8. Field Mapping (Lark → agent → HubSpot)

| Lark source (field_id) | Agent use | HubSpot target |
|---|---|---|
| Projects.Project ID (fldcNp57bP) | Join key everywhere | deal.project_number |
| Projects.Status (Manual) (fldtUY2tmv) | Update trigger + status line | timeline note content |
| Projects.Deliverables Progress (fldvkQcFgi), Videos Done (fld71XrrhL), Videos Total (fldgm26l7N), Carousels Done (fldEwvedPp) | Progress statements | timeline note content |
| Projects.Pace (fldQOVmmLm), Days to Due (fldAGCTeDg) | Health inputs | cx_health (derived) |
| Projects.Success Looks Like (fldCjOLwv1), targets (fld3kcdagC, fldA0mqwKp, fldeEJ2GLv, fld8qTpqWV) | "What success looks like" framing in onboarding and recaps | — |
| Projects.Customer Success (fldAarYRS6) | Human routing target | — |
| Projects.HubSpot Deal Record ID (fldBc2WlbO) | Lark→HubSpot deal join | deal id |
| Projects.Deal Type (fldM35BHCa) | Renewal logic (Retainer/Package) | cx_renewal_date (derived) |
| Projects.Engagement (fldDtjUdOl) | Client-only filter | — |
| Clients.Client Name (fldq9N1rB4), Client ID (fldC2pJm8P) | Identity, personalisation | company match |
| Clients.HubSpot Company ID (fldEvLHvRo) | Lark→HubSpot company join | company id |
| Clients.Customer Success (fldKobTRZ7) | Account-level human owner | — |
| Clients.Status (fldMKSYkjB) | Lifecycle filter (Active etc.) | — |
| Videos link (Projects.Videos fldUquxnRr → Videos tbl8wIByJQwhIUei, table id per amended snapshot — QA-101) | Performance join: per-video post URL fields → content_perf.reels. **Exact post URL field_ids are open verification item V-1 (QA-002): confirmed at build time from a Videos field listing in this repo before CX-W1 ships; the PCR data workflow (Qlo9PWJ7f3PqwF9i) already performs this join in production, so the mechanism is proven** | — |

## 9. State Machine (per outbound update)

```text
DETECTED → DRAFTED → VALIDATED → PENDING_REVIEW → APPROVED → SENT → LOGGED
                        │              │(pilot only; steady state skips to APPROVED
                        │              │ once autonomy is granted, D-5)
                        │              └─ REJECTED → archived with reason
                        └─ VALIDATION_FAILED → ESCALATED (CX owner DM, never auto-fix numbers)
Any step, on uncertainty about a fact, number, or status → ESCALATED. Uncertainty is the escalation trigger (R-11).
Exception (DEC-001): T4 handover sends skip PENDING_REVIEW by standing human pre-approval — the template is fixed wording approved once by Hakim; the send still passes VALIDATED (scope + identity checks) and is logged like every other message.
```

Validation gate checks: all placeholders resolved from live source, scope check passed (every project/video reference belongs to the addressed client), tone lint passed (no dashes, no prohibited wording, length cap, checked against the brand guidelines and vault voice reference terminology lists — QA-003), no promise/pricing/renewal language (regex + classifier), client name and CX contact present.

## 10. Message Templates (client-facing rules: no dashes, no unexplained abbreviations, English only, bullets over paragraphs)

Template rules bind all templates: placeholders in {braces} are resolved live at send time and never carry defaults; any unresolved placeholder fails validation (R-04). "PCR" is never used with a client; say "your campaign report". **Voice calibration (QA-003): the draft builder is loaded with the Koocester brand guidelines and the vault voice reference as its style source; final phrasing is linted against their terminology and prohibited wording lists. The voice speaks from abundance, always on the client's side, and makes the client feel great (QA-104) — the lint rejects scarcity framing, blame framing, and apology-first phrasing. Locating the current copies of both documents is open item V-2 (§14) — templates below ship only after they are checked against them.**

**T0 Onboarding (excerpt):**
> Hi {first_name}, welcome aboard. I am {cx_owner_name}'s project assistant at Koocester, and {cx_owner_name} is your point of contact throughout.
> Here is how we will keep you in the loop:
> • An update at every meaningful step on {project_name}
> • A short recap every Friday with your numbers
> • One place to reply: right here
> First up: {next_step}. Nothing needed from you right now.

**T1 Event update:**
> Hi {first_name}, quick update on {project_name}.
> • Status: {status_line}
> • Done this week: {work_done_bullets}
> • Your numbers so far: {live_numbers_line}
> • Waiting on you: {waiting_on_or_none}
> • Next: {next_step}
> {cta_line} {cx_owner_name} and the team are on it.

**T2 Weekly recap:** same mandatory elements as T1, aggregated across the client's projects, with the campaign report link when CX-W2 generated one: "Full report: {report_link}".

**T3 Feedback ask:**
> Hi {first_name}, {milestone_line}. One quick question: how has the experience been for you so far, from 1 to 5? A one line reply is perfect. Anything below great, tell us and we fix it.

**T4 Human handover (fixed, Hakim pre-approved per DEC-001; QA-202):**
> Thanks {first_name}, that is one for {cx_owner_name} personally. Passing it over now, and you will hear from {cx_owner_name} shortly today.
The closing phrase "shortly today" is fixed wording inside the pre-approved template, not a live placeholder, and is signed off by Hakim in the one-time T4 approval (checklist item 8a). The only placeholders in T4 are {first_name} and {cx_owner_name}, both resolved from Lark identity fields.

Every template ends with the client's point of contact identified (R-05). No template contains a performance number, a price, a promise, or a date not sourced from Lark.

## 11. Security and Leakage Controls

1. Query-level scoping: every data query is parameterised by the addressed client's Client ID and its linked Project IDs from the Lark link structure. There is no query shape that can return another client's rows.
2. Pre-send scope check (validation gate): every PRJ-#### and VID-#### referenced in the drafted message must belong to the addressed client's set; mismatch → VALIDATION_FAILED → ESCALATED. No cross-client leakage (R-15).
3. Prompt injection: client replies and Lark/HubSpot text are untrusted data. The triage classifier output is constrained to an enum; free-text from clients is never executed as instructions and never echoed into other clients' contexts.
4. Secrets: all credentials in n8n credential store; no secrets in workflow JSON (and the pre-existing hardcoded Lark secret in Qlo9PWJ7f3PqwF9i is fixed before CX reuses it, see deployment checklist).
5. Least privilege: HubSpot private app scoped to the seven properties + notes (QA-004); Lark reads only the two tables (plus the Videos field listing for V-1); ManyChat send scoped to mapped subscribers.
6. Logging: every send, write, approval, and escalation lands in cx_state.messages/events with actor and timestamp. Credentials never logged.

## 12. Implementation Plan (build order)

1. **Gate D-1 first**: prove one ManyChat WhatsApp outbound to an internal test number (template + session message). Blocked → escalate; alternative is Lark client group or WhatsApp Business API direct.
2. Create Supabase `cx_state` schema (migration file, reversible). Resolve V-1 (Videos post URL field_ids) and V-2 (brand guidelines + vault voice reference documents) and record both in this repo.
3. Human creates HubSpot properties (§6) + private app token; backfill `project_number` on active deals from Lark `HubSpot Deal Record ID` values (one-time, human-approved list).
4. Build CX-W1 inactive: poll + diff + event ledger only (no sends). Soak 2 days; verify events match reality.
5. Add draft builder + validation gate + Hakim review card (Lark interactive card to Hakim, house digest pattern). Voice calibration from the V-2 documents (QA-003). Model choice per D-3: templates do the structure, an LLM only smooths phrasing; cheapest capable model, temperature low; a pure-template fallback keeps the system alive with zero LLM spend.
6. Wire ManyChat send + HubSpot write-back. Pilot on D-2 client set with Hakim gate ON.
7. Build CX-W2 (reusing PCR), CX-W3, CX-W4, CX-W5 in that order, each soaking before the next.
8. Steady state: autonomy decision D-5 flips the pilot gate off per client, not globally.

## 13. Reliability

- Retries: HTTP nodes 3 tries exponential backoff; sends are idempotent via `events.idempotency_key` (unique constraint; a retried execution reuses the key and cannot double-send).
- Timeouts: 30s per external call; workflow-level continue-on-fail only into the error path.
- Duplicate triggers: diff-based detection is naturally idempotent; the one-update-per-client-per-day batch rule caps volume.
- Failure notifications: errorWorkflow ReSF67JnUkuFRkCZ + CX owner DM on any failed send affecting a client.
- Recovery: cx_state is the resume point; replaying a window re-diffs snapshots without resending (SENT events are terminal).

## 14. Decisions, Unknowns, Dependencies

| ID | Item | Owner | State |
|---|---|---|---|
| D-1 | ManyChat WhatsApp outbound capability (template messages, session window) | Faiz, this week | OPEN, blocks sends |
| D-2 | Pilot client set (candidate: 💰 Money-Confirmed checkbox) | Hakim/CEO | OPEN |
| D-3 | LLM/cost model (Claude API vs template-only) | Faiz + CEO | OPEN; design works in both modes |
| D-4 | HubSpot property creation + private app + project_number backfill | Human admin | OPEN, gated |
| D-5 | Steady-state autonomy (per-client gate removal) | Hakim | FUTURE |
| D-6 | Feedback landing field confirmed as `cx_feedback_last`/`cx_feedback_score` | Hakim | PROPOSED, needs sign-off |
| V-1 | Videos post URL field_ids verified from a Videos field listing recorded in this repo (QA-002) | Faiz, build step 2 | OPEN, blocks CX-W1 ship |
| V-2 | Koocester brand guidelines + vault voice reference documents located and loaded into the draft builder (QA-003) | Faiz + Hakim, build step 2 | OPEN, blocks first send |
| — | WhatsApp group vs 1:1 subscriber mapping in ManyChat | Faiz | OPEN, part of D-1 |

## 15. Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Reputational: wrong/robotic message in live client WhatsApp | High | Pilot gate (Hakim), validation gate, tone lint, one-update-per-day cap, T4 human handover |
| Cross-client leakage | High | §11 controls 1–2; QA tests it explicitly |
| ManyChat WhatsApp send unproven | High (schedule) | D-1 first in build order; fallback channels named |
| HubSpot side of this week's loop incomplete: CX properties and project_number join key must exist before the agent can run (brief §18) — QA-105 | High (schedule) | D-4 gated build step; deployment checklist items 3–4 block everything downstream; agent cannot ship without them |
| HubSpot data quality (offline deals) | Medium | Agent writes only its own properties; never reports pipeline; project_number backfill is human-verified |
| HubSpot schema churn | Medium | Seven-property surface; everything else via timeline notes |
| Double-send / spam on retry | Medium | Idempotency keys, batch rule |
| Hardcoded Lark secret in reused PCR data workflow | Medium (pre-existing) | Fix + rotate before CX steady state (deployment checklist step 2) |
| Cost creep | Low | Template-first design; LLM optional per D-3 |
| Silent weeks eroding "never in the dark" | Low | CX-W2 always sends (plan-ahead variant) |

## 16. Test Plan

| Case | Method | Pass condition |
|---|---|---|
| Happy path event update | Staged project change on a test record | One event, one draft, gate, send to test number, HubSpot write-back verified by read-back |
| Invalid data (missing numbers) | Blank content_perf rows for scoped URLs | VALIDATION_FAILED, escalated, nothing sent |
| Duplicate trigger | Re-run CX-W1 twice on same snapshot | Zero new events (idempotency) |
| API failure (ManyChat 5xx) | Mock failure | Retry ×3 then error workflow + CX owner DM; no partial HubSpot write marked SENT |
| Permission failure (HubSpot 403) | Revoked scope, tested pre-send (property read probe) and post-send | Pre-send failure: event stays APPROVED, nothing sent, alert raised. Post-send failure: identical to partial-failure case below (SENT with pending write-back retry queue) — QA-103 |
| Malformed payload (inbound reply without subscriber map) | Unknown subscriber webhook | Quarantined to review queue, no auto-reply |
| Cross-client scope | Draft artificially seeded with another client's PRJ-#### | VALIDATION_FAILED (scope check) |
| Partial failure (send ok, write-back fails) | Mock HubSpot down after send | Event SENT with pending write-back retry queue; no re-send |
| Rollback | Run rollback runbook on staging | All CX artifacts removed/deactivated cleanly, evidence recorded |
| Tone lint | Template rendered with dash/buzzword injected | Lint fails the draft |

Evidence for each case is captured as n8n execution links + cx_state rows in the QA package at build time.

## 17. Rollback Plan

1. Deactivate CX-W0..W5 in n8n (workflows kept, inactive).
2. ManyChat: no standing automations are created by CX; nothing to unwind beyond stopping sends.
3. HubSpot: seven properties retained but frozen (no writes); optionally hidden from views. Timeline notes are append-only history and stay.
4. Supabase: `cx_state` schema dropped by reverse migration if a full unwind is wanted; otherwise retained as audit.
5. Lark: nothing to roll back (read-only).
6. Clients: if mid-pilot, the human CX owner sends a personal note taking over updates; no silent disappearance.

## 18. Deployment Checklist (every deploy step is human-approved)

1. [ ] D-1 ManyChat WhatsApp outbound proven to internal number (evidence: execution link)
2. [ ] Fix hardcoded Lark secret in Qlo9PWJ7f3PqwF9i + rotate app secret; resolve V-1 and V-2 into this repo
3. [ ] HubSpot: seven properties created (six company-level + project_number on deals), private app token issued, scopes verified (D-4)
4. [ ] project_number backfill list generated from Lark, human-verified, applied
5. [ ] Supabase migration applied (staging then prod), reverse migration tested
6. [ ] CX-W1 deployed inactive, 2-day soak, diff accuracy reviewed
7. [ ] Pilot set confirmed (D-2), subscriber mapping filled in cx_state.clients
8. [ ] Hakim review card tested end to end with a dry-run draft
8a. [ ] T4 exact wording (including the fixed "shortly today" phrase) signed off by Hakim once, recorded in this repo (DEC-001)
9. [ ] First live pilot send approved by Hakim
10. [ ] CX-W2..W5 rolled out one at a time with soak between
11. [ ] Autonomy review (D-5) scheduled after pilot evidence accumulates

## 19. QA Handoff

QA receives: this package, the execution contract, the DoD, the amended discovery snapshot, the mission brief, qa-reports r1–r3, and the decision log (DEC-001). Revision: 004. Claim-to-source: every Lark field_id, table id, and n8n workflow id cited here appears verbatim in `../discovery/mcp-discovery.md` (as amended this revision); the two items that could not be verified from the snapshot are explicitly carried as open verification items V-1 and V-2, not asserted as fact. Requirements trace to `../../../mission-brief.md` sections cited in §2 (QA-008, corrected depth).

Revision 002 changes: QA-001 snapshot amended + citation annotated; QA-002 V-1 open item replaces cross-run sourcing; QA-003 voice calibration added to R-06, §9, §10, §12 + V-2; QA-004 seven properties reconciled across §1, §6, §11.5, §17.3, §18.3; QA-005 R-21 reference fixed to §4; QA-006 six workflows in §1 + CX-W0 in diagram; QA-007 R-23 added + explicit links-not-duplicates rule in §6.

Revision 003 changes: QA-101 Videos table id recorded in amended snapshot (returned by this run's live 21-table listing) + §8 row annotated; QA-102 pilot gate added explicitly to CX-W3 steps; QA-103 permission-failure test split into pre-send and post-send expectations, post-send aligned with the partial-failure case; QA-104 abundance voice element added to R-06 and §10 lint; QA-105 HubSpot dependency risk row added to §15; QA-008 mission-brief path corrected to three levels up.

Revision 004 changes (per DEC-001, Faiz, Option B): QA-201 T4 documented as a fixed Hakim pre-approved template exempt from per-message review by explicit human decision — exemption recorded in §4 CX-W5, §9 state machine, and deployment checklist item 8a; QA-202 `{handover_window}` replaced with fixed pre-approved wording "shortly today", leaving only identity placeholders in T4.

Status: **READY_FOR_QA**
