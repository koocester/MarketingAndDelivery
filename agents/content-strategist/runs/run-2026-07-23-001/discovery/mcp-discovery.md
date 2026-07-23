# MCP Discovery Results — Storyboard Copilot (run-2026-07-23-001)

Snapshot date: 2026-07-23. All findings below are `FACT_FROM_APPROVED_SOURCE` (live Lark M&D base and live n8n instance via MCP) unless marked otherwise.

## 1. Lark M&D Base

- Base app_token: `BG8PbaZFna1NQksNWkglTN85gSf` (21 tables).
- Video table: `tbl8wIByJQwhIUei` ("Videos", 124 fields, revision 16957).

### Video table — fields that matter to the copilot

| Field | field_id | Type | Role in the copilot |
|---|---|---|---|
| Video ID | fldxdr9y7A | AutoNumber `VID-####` | Join key, used by Post Campaign Report too |
| Video Title | fldr2OOB00 | Formula (primary) | Read-only display name |
| Page | fld0JVDqxo | Link → Pages | Determines vertical, country, defaults |
| Vertical | flduw4nmvv | Formula from Page | Research scoping (Homes/Business/Autos/Wealth/Foodie) |
| Objective | fldpyAIYtH | SingleSelect | Lead Generation vs Brand Awareness |
| Lead/View/Community/Attendance Targets | fldJQWYgO3 etc. | Number | Win metric for the Video Details block |
| Video Success Looks Like | fld1FzNUnZ | Formula | Auto success sentence from targets |
| Video Stage | fldoWWWmFe | SingleSelect (18 options) | Pipeline status driver; storyboarding happens in `Planning` |
| Strategist | fldsm8LLGV | User | Review owner; notification target |
| Guest Name / IG / Business Handle / Profession | fldEORbzmT etc. | Text | Guest facts (from Producer) |
| Client/Vendor | fldz1JUutv | Lookup via Project | Paid-video detection |
| Meeting Transcript (TXT file) | fldGr1y7Sw | Attachment | Discovery-call transcript — primary input |
| Video TXT (Transcript) | fldp1UKaL5 | Attachment | Video transcript (post-edit; used for captions) |
| **Storyboard (Lark Doc)** | **fldv0yaIgF** | **Url** | **The write target.** Field description: strategist creates a Lark Doc, drafts the storyboard there, pastes the URL; the team reviews via inline comments in the doc |
| Storyboard Done and Checked | fldCATAq9c | Button | The human approval mechanic (strategist-only) |
| Lead Magnet Library | fldbPcxrns | DuplexLink → tblHACGPIPBfGUxj | The offer, **linked by reference** — matches the brief's no-duplication rule |
| CTA Word / Landing Page Link / Lead Magnet ID | fldwCM0Pzc / fldVrBSN41 / fldN4l2Dps | Lookups | Offer CTA data pulled from Lead Magnet Library |
| Template | fldognbqib | Formula from Project | Project template (Sensational / Stories & Trust / etc.) |
| Shoot Date / Shoot Venue | fldIi1Lyjz / fldfsZcsAN | DateTime / Text | Logistics context for the board |
| Instagram/TikTok/Facebook/YouTube Post URL | fldZxyvqmP etc. | Url | Attribution join keys (downstream; copilot never touches) |
| Performance | fldBGLW2ze | DuplexLink → Content Performance | Metricool-synced metrics per video |
| Caption (AI) vs Reviewed Caption (final) | fldiC67Ryz / fldRRUc0S0 | Text | House pattern: AI writes only the AI field, never the human field — the copilot follows the same pattern |
| Last Video Stage Updated | fldTG6p5XW | ModifiedTime (type 1002) | Record-level auto modified-time ("used as the stage-change timestamp that drives all the Lead Time SLA clocks", per its live field description). Because it is record-level, ANY write to the record — including the storyboard URL — refreshes it. Captured in the live field listing this run; recorded here per QA-001 |

### Base tables relevant to the mission

- `Pages (link to Metricool)` tblUscIBwxElzzXi — 16 live pages: KOOCESTER (Main/Regional) plus Homes/Business/Autos/Wealth/Foodie × SG/MY/ID. This resolves the brief's "exact list of pages" unknown.
- `Lead Magnet Library` tblHACGPIPBfGUxj — offers with LM-#### IDs, CTA Word, Landing Page Link.
- `Content Performance (connect Metricool)` tblzJ6NURzH6QVxt and `Content Performance (Reels)` tblIypxKaOsakPxu — synced performance metrics.
- `Storyboard Templates` tbltAvfRbbfOub7R — exists but is essentially empty (2 fields: Template Category 1 text, Template Category 2 select Sales/Marketing; revision 2). Available as a future home for GUIDE scene templates; not required day one.
- `Post Interview Contact`, `Projects (Delivery)`, `Carousels`, `Content Calendar` — adjacent, read-only context.

### Resolved unknowns (from brief §17)

| Unknown | Resolution | Class |
|---|---|---|
| Storyboard staging field | `Storyboard (Lark Doc)` Url field; the storyboard itself is a Lark Doc (commentable review surface) | FACT_FROM_APPROVED_SOURCE |
| Status field / drafted→reviewed→approved workflow | `Video Stage` already carries it: Planning (storyboarding) → Ready to Shoot after strategist presses `Storyboard Done and Checked`. Day one needs **no schema change**; a `Storyboard Draft Status` select is proposed as an approval-gated enhancement | FACT + DERIVED |
| Hooks/arcs/transcript: own fields or one field? | Hooks and arcs live inside the storyboard Lark Doc; the transcript already has its own attachment field. No new fields | FACT + DERIVED |
| Exact list of pages | 16 pages listed above | FACT_FROM_APPROVED_SOURCE |
| Exact view | Not resolved via MCP (view listing not needed for writes; record-level writes are view-independent) | UNKNOWN, immaterial |
| Two Content Strategists' identities | Not resolved this run; `Strategist` user field exists per record, so the copilot addresses whoever owns the record. Pilot pick is a CEO decision | UNKNOWN, needs human |
| Poppy AI integration path | Not resolvable via MCP — no Poppy AI connector exists. Faiz to supply the identifier/API key; Playwright browser automation is the fallback | UNKNOWN, escalated |

## 2. n8n instance

56 workflows discovered. House patterns the copilot must follow:

- **Lark auth pattern**: `Get Lark Token` HTTP node → tenant_access_token, app_id `cli_aa914316d6b8deed`, secret held in credential `Lark App Secret (Koocester)` (id 3HvLTgbxXknIviCu).
- **Error handling**: shared error workflow `ReSF67JnUkuFRkCZ` ("Error Handling") set as errorWorkflow.
- **Timezone**: Asia/Singapore.
- **Idempotent write loop** with rate-limit pacing (~320ms between Lark writes) as in `Auto-stamp Upload Date`.

Directly reusable neighbours:

| Workflow | id | Relevance |
|---|---|---|
| Metricool Lark Reels Sync (SG/MY/ID) | 54vD7rU5KNMCjVq1 / IB2XF3NMrsyzqVAy / qnhcgiVUB6jgqnwM | Already lands per-post metrics in Postgres `content_perf.reels` (platform, post_url, views, reach, likes, comments, shares, saves) — the winners data source |
| Post Campaign Report Data (by Video ID) | Qlo9PWJ7f3PqwF9i | Proven join: Video record post URLs → `content_perf.reels` rows; reuse the URL-key extraction logic |
| Auto-stamp Upload Date | KxebTkw9GfV6Icqr | Reference for safe scheduled Lark writes against the Videos table |
| AI Video Summary family | 7RoGbhmWamvW4pmp etc. | Prior art for transcript-driven AI content generation |
| Monthly Content Engine (shells generator) | G073XJeZikGaEWUR | Creates the video shells the copilot will later plan against |

Postgres credential in use: `Postgres account` (iLlaPQLaICzc44cH) — Supabase per `Aspire → Supabase Sync` and `ManyChat Leads → Supabase (attribution)`.

## 3. Security findings

1. **Hardcoded Lark app secret** (severity: high, pre-existing): the `Get Lark Token` node in `Post Campaign Report Data (by Video ID)` (Qlo9PWJ7f3PqwF9i) embeds the Lark `app_secret` in plaintext in the HTTP body instead of using the `Lark App Secret (Koocester)` credential like the other workflows. The secret value is not reproduced in this repo. Recommendation: move the node to the shared credential and rotate the app secret, since it is visible to anyone with workflow read access.
2. No suspected prompt injection encountered in any Lark or n8n content read during discovery.

## 4. Out of scope confirmations

- No Lark writes were performed in this run. All access was read-only (field listings, table listings, one record search on the Pages table, two workflow reads).
- The GUIDE - Producer Marketing Plan document was referenced by the brief as "kept alongside this brief in the kit" but is not present in this working directory. Its structure is used only as named in the mission brief (Video Details block, 3 hooks, Establishment, Arcs 1–4, Resolve, Trust + ending CTA). Flagged in the risk register.
