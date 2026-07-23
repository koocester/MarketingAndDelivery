# MCP Discovery Results — CX Client Journey Agent (run-2026-07-23-001)

Snapshot date: 2026-07-23. All findings are `FACT_FROM_APPROVED_SOURCE` (live Lark M&D base and live n8n instance via MCP) unless marked otherwise. All access this run was read-only.

## 1. Lark M&D Base

- Base app_token: `BG8PbaZFna1NQksNWkglTN85gSf` (21 tables).
- Projects table: `tblAJKbb2UZRh8rn` ("Projects (Delivery)", 48 fields, revision 6700 at snapshot).
- Client table: `tblWpq8b0uo1vBtX` ("Clients & Vendor (Sales)", 19 fields, revision 1396 at snapshot).
- Videos table: `tbl8wIByJQwhIUei` ("Videos", revision 17077 at snapshot) — returned in this run's 21-table listing; the target of Projects.Videos (fldUquxnRr). Its per-video post URL field_ids were not field-listed this run (open item V-1 in the engineering package). Row added in snapshot amendment per QA-101.

### Projects (Delivery) — fields that matter to the CX agent

| Field | field_id | Type | Role for CX |
|---|---|---|---|
| Project ID | fldcNp57bP | AutoNumber `PRJ-####` | **The unique Project Number from the brief.** System-assigned, not editable |
| Project Name | fldestdFuX | Formula (primary) | Display name: Project ID · Client · Short Description |
| Client | fldb9ACuyR | DuplexLink → Clients & Vendor | Client scoping anchor |
| HubSpot Deal Record ID | fldBc2WlbO | Text | **Join key to the HubSpot deal already exists.** Field description: "Dashboard (Vercel) connects money (HubSpot) + delivery (Lark) on this" |
| Customer Success | fldAarYRS6 | User | CX owner per project, copied from Client's Customer Success on create |
| Status (Manual) | fldtUY2tmv | SingleSelect | Not Started / Planning / In Production / Delivered / On Hold / Completed |
| Deliverables Progress | fldvkQcFgi | Formula (Progress %) | (Videos Done + Carousels Done) / contracted deliverables |
| Videos Done / Videos Total | fld71XrrhL / fldgm26l7N | Lookup / Formula | Delivery counts vs Video Deliverables (fldlBrGC0l) |
| Carousels Done / Total | fldEwvedPp / fldVqIl3F4 | Lookups | Same for carousels (Carousel Deliverables fldROnk7h4) |
| Pace | fldQOVmmLm | Formula | "On track" / "Behind" vs elapsed working days |
| Days to Due | fldAGCTeDg | Formula | Days remaining; negative = overdue |
| Success Looks Like | fldCjOLwv1 | Formula | Auto success sentence from Lead/View/Community/Attendance targets + Due Date |
| Campaign Objective | fldMnNPJ0w | SingleSelect | Lead Generation vs Brand Awareness |
| Lead / View / Community / Attendance targets | fld3kcdagC / fldA0mqwKp / fldeEJ2GLv / fld8qTpqWV | Number | The measurables the brief said "already live in Lark" |
| Deal Type | fldM35BHCa | SingleSelect | One Off / Package / **Retainer (Monthly)** — renewal-relevant |
| Engagement | fldDtjUdOl | Formula select | Client vs Internal Campaign — CX only touches Engagement=Client |
| Project Owner / Sales Owner | fldSlxD7nn / fldu7kHbmF | User / Lookup | Delivery owner vs closer; distinct from Customer Success |
| Start / Due Date | flditBezu0 / fldJ7XC7GC | DateTime | Timeline context |
| Videos / Carousels | fldUquxnRr / fld1sgZxDC | DuplexLink | Child content records (Video ID VID-#### is the video numbering from the brief) |
| 💰 Money-Confirmed (Jul 2026) | fldr8BtpqQ | Checkbox | Verified paying clients — candidate pilot filter |

### Clients & Vendor (Sales) — fields that matter to the CX agent

| Field | field_id | Type | Role for CX |
|---|---|---|---|
| Client Name | fldq9N1rB4 | Text (primary) | Account name |
| Client ID | fldC2pJm8P | AutoNumber `CLI-####` | Client key |
| HubSpot Company ID | fldEvLHvRo | Text | **Company-level HubSpot join already modelled** |
| Customer Success | fldKobTRZ7 | User | "Owns all client communication, sign-off collection" — one owner per client; Projects inherit it |
| Status | fldMKSYkjB | SingleSelect | New / Active - Delivery in Action / Paused / Completed / Cancelled |
| Projects + rollups | fldGf9bY8b, Total/Ongoing/Completed, Progress | Links/Formulas | Account-level delivery picture |
| Salesperson | fldGD0EDqV | User | Sales owner (distinct from CX) |
| Service Agreement | fld0IfwwAb | Attachment | Scope reference |

### Resolved unknowns (from brief §17)

| Unknown | Resolution | Class |
|---|---|---|
| "Project Number is not yet keyed into HubSpot" | Partially resolved: Lark already carries `HubSpot Deal Record ID` per project and `HubSpot Company ID` per client. The join exists Lark→HubSpot; what remains is confirming/backfilling values and (optionally) mirroring PRJ-#### onto the HubSpot deal as a custom property | FACT + DERIVED |
| Which view | Not needed: record-level reads are view-independent | UNKNOWN, immaterial |
| Measurables for client success | Confirmed in Lark: targets + Success Looks Like + Deliverables Progress + Pace, all computed | FACT_FROM_APPROVED_SOURCE |
| CX owner identity | `Customer Success` user fields exist at client and project level — the human-in-the-loop routing target | FACT_FROM_APPROVED_SOURCE |
| HubSpot CX properties (health, last update sent, feedback, renewal date) | Confirmed absent from Lark; must be created in HubSpot. No HubSpot MCP connector is available in this session — HubSpot work happens via n8n HTTP nodes or the HubSpot UI | UNKNOWN, confirmed still open |
| WhatsApp via ManyChat | Unconfirmed, see §2 — current ManyChat n8n footprint is a test webhook only | FACT (state), UNKNOWN (capability) |
| Pilot client set | Not resolvable via MCP; `💰 Money-Confirmed (Jul 2026)` checkbox is a strong candidate filter. CEO decision | UNKNOWN, needs human |
| Claude API / cost model | Business decision, not discoverable | UNKNOWN, needs human |

## 2. n8n instance

59 workflows discovered. Relevant to CX:

| Workflow | id | Active | Relevance |
|---|---|---|---|
| ManyChat Sync (Koocester) | PQ89Q6xBTPaCXrve | yes | **Only a 3-node test**: Test Webhook → ManyChat: Page Info → Respond. Proves ManyChat API credential/connectivity, nothing more. WhatsApp send capability is NOT yet demonstrated |
| ManyChat Leads → Supabase (attribution) | aTQN0VUvzUYszLai | yes | Inbound ManyChat lead capture to Postgres — proven ManyChat→n8n direction |
| Post Campaign Report Generator | fNPWAIlcdv1Uso7k | yes | Webhook → GetData → GetTemplate → Build HTML → Render (PDF) → upload/send to Lark chat + Update Record. **Reuse as the client-facing report engine** |
| Post Campaign Report Data (by Video ID) | Qlo9PWJ7f3PqwF9i | yes | Metrics join: Video post URLs → Postgres `content_perf.reels`. **Reuse as the live-numbers source.** Known pre-existing security finding (hardcoded Lark app secret) recorded in the CS run 2026-07-23-001 |
| Metricool Lark Reels Sync SG/MY/ID | 54vD7rU5KNMCjVq1 / IB2XF3NMrsyzqVAy / qnhcgiVUB6jgqnwM | yes | Land per-post metrics in Postgres `content_perf.reels` — the performance source of truth |
| Error Handling | ReSF67JnUkuFRkCZ | yes | House error workflow; CX workflows must set it as errorWorkflow |
| Auto-stamp Upload Date (every 15m) | KxebTkw9GfV6Icqr | yes | House pattern for scheduled 15-minute polls with safe Lark reads/writes — the template for CX change detection (returned in this run's workflow list; row added in snapshot amendment per QA-001) |
| Finance Collections Nudge / CEO Daily Brief / Weekly Management Report | b6zxIN2n33Tu31Cn / c3OAv5oJRanDv8UH / yv5Pz0hpX3kHKvVE | yes | House patterns for scheduled Lark-message digests — template for the weekly client recap |

House patterns (carried over from CS run discovery, re-confirmed applicable): Lark tenant token via `Get Lark Token` HTTP node with credential `Lark App Secret (Koocester)` (3HvLTgbxXknIviCu); timezone Asia/Singapore; Postgres credential `Postgres account` (iLlaPQLaICzc44cH) on Supabase; idempotent write loops with ~320ms pacing.

## 3. HubSpot

No HubSpot MCP connector exists in this session. HubSpot state (properties, deal records, pipeline) could not be inspected directly. Design must therefore treat the HubSpot property schema as build-work with a small write surface (per CEO context §19), executed through n8n HTTP nodes with credentials, after the properties are created. Brief's caution stands: offline-created deal records make raw pipeline counts unreliable; the agent must not present raw pipeline figures as fact.

## 4. Security findings

1. No suspected prompt injection encountered in any Lark or n8n content read during this discovery.
2. Pre-existing finding (from CS run, still open): hardcoded Lark app secret in `Post Campaign Report Data (by Video ID)`. CX reuses this workflow, so the fix (move to shared credential + rotate secret) should be scheduled before CX steady state.

## 5. Out of scope confirmations

- No Lark writes, no n8n changes, no HubSpot access, no ManyChat sends were performed in this run. Reads: 1 table list, 2 field listings, 1 workflow list, 2 workflow structure reads.
