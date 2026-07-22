# Copywriter Bot — Engineering Package (Revision 1)

**Run:** `run-2026-07-22-001-copywriter-bot` · **Role:** Automation Engineer Worker · **Status:** `ESCALATE`
**Mission:** Automate the copywriting stage of the M&D carousel workflow (n8n bot → Canva autofill → Lark write-back → human review).

---

## 1. Executive Summary

MCP discovery is complete across Lark, n8n, and Canva. Most of the brief's "Known Unknowns" are now resolved with evidence: the exact base, tables, fields, status values, queue volume, transcript location, and the established n8n integration pattern are all documented below.

**The mission cannot proceed to build yet.** Three findings require CEO decisions:

1. **BLOCKER — No Canva brand template exists.** The connected Canva account has one brand kit but **zero brand templates** (verified via API, unfiltered listing). The "approved locked Canva template" that the entire Canva-autofill stage depends on either doesn't exist or isn't shared with the connected account/integration scope. Brand-template autofill also requires Canva Enterprise-tier API access — tier unconfirmed.
2. **CONFLICT — The brief's target workflow doesn't match the live schema.** The brief says "move the record to *In Review*"; no such stage exists. The live pipeline is `Pending Copywriting → Copywriting → Amendments Needed → Final Approval → Ready to Upload → Completed`, driven by existing stage buttons and SLA clocks (Copywriting has a 3h SLA). The bot must map onto these real stages — proposed mapping in §6.
3. **APPROVAL NEEDED — Schema additions.** Provenance, amendment-round counting, and a bot-status/error field don't exist on the Carousels table. Adding fields is a schema change requiring explicit approval under the Orchestrator's Lark contract.

Everything that can be validated without those decisions has been validated. The architecture, field mapping, state machine, risk register, test plan, and rollback plan below are build-ready once the blockers clear.

---

## 2. Requirements Matrix

| ID | Requirement (from brief) | Status | Evidence / Note |
|----|--------------------------|--------|-----------------|
| R1 | Trigger on status `Pending Copywriting` | ✅ Validated | Stage option `optoqMdiTk` exists; 17 records queued today |
| R2 | Handle Article / Video / Infographic sources | ⚠️ Partial | No "Source Type" field. Derivable: `Source Video` link → video; `Article Source` URL → article/infographic. CAR-1038 sampled with neither → needs fallback rule |
| R3 | Retrieve article text | ✅ Feasible | `Article Source` (URL field) + HTTP fetch in n8n |
| R4 | Retrieve video transcript | ✅ Validated | Videos table: `Video TXT (Transcript)` (text) and `Meeting Transcript (TXT file)` (attachment) |
| R5 | Retrieve b-roll frames | ❌ Unavailable | Only `Raw File Link (Google Drive)` full raw footage exists. No frame library. Recommend descoping v1 |
| R6 | Approved image library | ❓ Unknown | Not found in Lark base or Canva. CEO must point to it or descope |
| R7 | Generate carousel copy | ✅ Feasible | LLM node in n8n; transcript/article as source; `Caption (AI)` precedent exists on Videos |
| R8 | Autofill locked Canva template | 🛑 BLOCKED | Zero brand templates in account; autofill API requires a brand template with a dataset |
| R9 | Save Canva design, write link to Lark | ✅ Feasible* | `Canva Link` field exists (*once R8 clears) |
| R10 | Record provenance | ⚠️ Needs schema | No provenance fields; needs approved new fields (§7) |
| R11 | Move record to "In Review" | ⚠️ Conflict | Stage doesn't exist; mapped to `Amendments Needed`/`Final Approval` per §6 — CEO to confirm |
| R12 | Amendment loop via Canva comments | ⚠️ Partial | Canva `list-comments`/`reply-to-comment` available to the connector; **no comment webhook** → polling required; "resolve comment" API capability unconfirmed |
| R13 | "Amendments Submitted" button | ⚠️ Needs build | `Resubmit Carousel` button exists and can be repurposed/mirrored — confirm with CEO |
| R14 | Increment Amendment Rounds | ⚠️ Needs schema | No such field; new number field required |
| R15 | Approve → `Ready to Upload` | ✅ Validated | `Approve Carousel` button + stage exist today |
| R16 | Live post URL as attribution key | ✅ Validated | `Instagram/TikTok/Facebook Post URL` fields + `Post URL Missing (alert)` already enforce this |
| R17 | ~27 drafts/day capacity | ✅ Feasible | Current queue 17; n8n handles far larger volumes in this instance (60-node syncs) |
| R18 | Extend existing workflow, never create a new base | ✅ Honored | All writes target existing base `BG8PbaZFna1NQksNWkglTN85gSf` |
| R19 | Bot never approves its own work | ✅ Designed | Bot can only set `Amendments Needed`/`Final Approval` entry stage; `Approve Carousel` stays human-only |
| R20 | Brand rules (Maroon #C02025, Helvetica, white-dominant, no gold) | 🛑 Depends on R8 | Enforced by the locked template itself; cannot verify until template exists |

---

## 3. MCP Discovery Results (source snapshot)

### Lark — M&D Base `BG8PbaZFna1NQksNWkglTN85gSf` (21 tables)

**Carousels — `tblnMZctdGYfXjYL`** (69 fields). Key fields:

| Field | ID | Type | Role in bot |
|---|---|---|---|
| Carousel ID | `fldFmGTusN` | AutoNumber CAR-#### | Run idempotency key |
| Carousel Stage | `fldzQLk4Wf` | SingleSelect | Trigger + state machine |
| Source Video | `fldmHyq4cS` | Link → Videos | Video-source path |
| Article Source | `fldGCcxuVu` | URL | Article/infographic path |
| Topic (Must Fill) | `fldn1HYOzw` | Text | Copy brief input |
| Objective | `fldjSfrvxu` | SingleSelect (Lead Gen / Brand Awareness) | Copy angle |
| CTA Word / Landing Page Link / Lead Magnet ID | lookups | — | CTA slide content |
| Canva Link | `fldV6jdXXd` | Text | Bot writes design URL |
| Caption | `fldo12tfmx` | Text | Bot writes caption draft |
| Copywriter / Head Copywriter (Approver) | user fields | — | Reviewer notification |
| Priority | `fldyYAHdLW` | SingleSelect | Queue ordering |
| Batch Month | `fldSqStCDz` | Text | FIFO batching (Monthly Content Engine) |

Stage options (live): `Not Started, Copywriting, Amendments Needed, Final Approval (Head Copywriter/Client), Ready to Upload, Completed, On Hold, To Reupload, Reject/DO NOT POST, Taken Down, Pending Copywriting`.
Existing stage buttons: `Start Copywriting, Submit Carousel, Resubmit Carousel, Approve Carousel, Reject Carousel, All Uploaded, Send to Copywriter`.
SLA clocks already live: Copywriting 3h, Amendments 6h (per formula, brief said 2h — schema wins), Final Approval 8h internal / 16h client.

**Videos — `tbl8wIByJQwhIUei`** (124 fields). Relevant: `Video TXT (Transcript)` (text), `Meeting Transcript (TXT file)` (attachment), `Frame.io Link` (URL), `Raw File Link (Google Drive)` (URL), `Caption (AI)` (text, precedent for AI-drafted copy), `Carousel Worthy?` (checkbox → spawns carousels).

**Queue snapshot (2026-07-22):** 17 records in `Pending Copywriting`; 14/15 sampled are video-derived; CAR-1038 has no source at all (validation gap the bot must handle → skip + flag).

### n8n — instance `Koocester Group <ceo@koocester.com>`

- 55 workflows; house pattern = Code nodes calling Lark REST with tenant token (app `cli_aa914316d6b8deed`, credential `Lark App Secret (Koocester)` / `3HvLTgbxXknIviCu`), page_size 500 pagination, guard counters, batch_update chunks of 100, ~320ms write pacing.
- Shared error workflow: `ReSF67JnUkuFRkCZ` (used as `errorWorkflow` by M&D jobs).
- Adjacent workflows that must not conflict: `Auto-stamp Upload Date` (15m, Videos), `Carousel Contributors Extract` (nightly, Carousels — includes a stamping step), `Monthly Content Engine` (creates carousel shells + FIFO backlog dates).

### Canva

- Brand kits: 1 (`kAGyYlLbSCs`). **Brand templates: 0** (unfiltered listing). Autofill requires a brand template with a non-empty dataset → hard blocker.
- Connector supports: create-design-from-brand-template, get-brand-template-dataset, export, comments (list/reply), folders, asset upload. No webhook for comments (polling only). Comment *resolution* via API unconfirmed.

---

## 4. Architecture (proposed)

Three n8n workflows extending the existing M&D pattern — no new base, no schema edits until approved:

```
WF-1  Copywriter Bot — Draft Generator (every 10m + manual webhook)
  Schedule/Webhook → Lark token → Claim queue (search: Stage=Pending Copywriting,
  order by Priority, limit N) → per record:
    Idempotency check (Canva Link empty? bot-status field?) →
    Source resolver (Source Video → fetch transcript from Videos;
                     Article Source → HTTP fetch + extract;
                     neither → skip + flag to Copywriter) →
    LLM copy generation (slides JSON + caption; CTA from Lead Magnet lookups;
                         objective-aware) →
    Canva: create-design-from-brand-template + autofill dataset →
    Lark write-back (Canva Link, Caption, provenance fields) →
    Stage → [review stage per CEO mapping decision] →
  Summary → notify (Lark IM) → errorWorkflow ReSF67JnUkuFRkCZ

WF-2  Amendment Processor (poll every 15m, or button-triggered webhook)
  Records in review stage with amendments requested →
  Canva list-comments (unresolved) → LLM revision → autofill update /
  new design version → reply to processed comments ("Applied ✔ by bot") →
  increment Amendment Rounds → back to review stage → notify Copywriter

WF-3  Job Health (reuse existing n8n Job Health Monitor + Error Handling)
```

**Design decisions** (following house standards): tenant-token HTTP pattern (not a Lark community node) for consistency; idempotency via `Carousel ID` + empty-`Canva Link` guard + client_token on record updates; retries idempotent (re-running never duplicates designs — check `Canva Link` before create); 27/day ≈ 2-3 per 10-minute cycle — well within rate limits; all writes read-back-verified per Orchestrator §8.4.

**State machine (bot's view of Carousel Stage):**
`Pending Copywriting` →(bot claims)→ `Copywriting` →(draft saved)→ *review stage* →(human: Approve Carousel)→ `Ready to Upload` — with `Amendments Needed` ⇄ *bot revision* loop in between. Bot never sets `Ready to Upload` or `Completed`.

---

## 5. Error Matrix, Reliability, Rollback (abridged)

| Failure | Handling |
|---|---|
| Source missing/unfetchable | Skip record, set bot-status = `Needs Human — no source`, notify assigned Copywriter; never invent content |
| Canva API failure mid-record | No Lark stage change (stage only advances after Canva Link write-back verified); retry next cycle; idempotent by Canva Link guard |
| Lark version conflict | `ignore_consistency_check:false`; on conflict, stop and log per Orchestrator §8.4 |
| LLM output malformed | Schema-validate slides JSON; 1 retry; then Needs Human |
| Duplicate trigger (schedule + webhook) | Queue claim = stage transition to `Copywriting` acts as lock; re-check stage before processing |
| Rollback | Bot writes only `Canva Link`, `Caption`, new bot fields, and stage. Rollback = clear those fields + return stage to `Pending Copywriting`; Canva designs are additive (drafts in a bot folder), never destructive |

**Test plan:** happy path per source type; no-source record (CAR-1038 is a live fixture); duplicate trigger; Canva 4xx/5xx; Lark 91403 permission; malformed transcript; amendment round-trip with seeded comments; verify SLA clocks behave when bot changes stages (ModifiedTime fields will reset — verify acceptable). Evidence to be recorded per run in `runs/<id>/test-evidence/`.

---

## 6. Decisions Required (CEO)

| # | Decision | Recommendation |
|---|---|---|
| D1 | **Canva template**: have a designer build the locked carousel brand template (with named text/image placeholders as a dataset) in the connected account, and confirm the plan supports Brand Template autofill API | Required before any build. I can generate a placeholder-schema spec for the designer |
| D2 | **Review-stage mapping**: brief's "In Review" → use existing `Amendments Needed` (copywriter works it like today) or insert nothing new and send drafts to `Final Approval`? | Use `Amendments Needed` as the reviewer stage; no schema change |
| D3 | **Schema additions** (needs approval): `Amendment Rounds` (number), `Source Reference` (text), `Bot Status` (single-select), optional `Copy Used` (text) | Approve 3 fields; skip `Copy Used` (Canva design is the copy record) |
| D4 | **Descope v1**: b-roll frames (no library exists) and AI-generated infographic visuals (needs image-gen provider + approved asset policy) | Descope both; v1 = text autofill + approved image placeholders |
| D5 | **Image library**: confirm location of approved image assets, or approve template-embedded imagery only for v1 | Template-embedded for v1 |
| D6 | **Git home for artifacts**: this folder is not a git repo. Commit run artifacts to `Documents/GitHub/MarketingAndDelivery` (note: previously flagged public-repo risk) or init a private repo? | Private repo or confirm MarketingAndDelivery visibility first |
| D7 | Amendment loop: Canva comment **polling** (no webhooks available) at 15m acceptable? Max amendment rounds? | 15m polling, max 3 rounds then escalate to Head Copywriter |

---

## 7. Risk Register (top items)

1. **Canva tier/API mismatch** (High): autofill needs Enterprise-tier Connect API; unverified. Mitigate: verify before designer builds template.
2. **SLA clock interference** (Medium): bot stage changes reset `Last Carousel Stage Updated`, driving existing overdue alerts — copywriters could be paged for bot-owned stages. Mitigate: keep bot dwell in `Copywriting` short; review alert scans.
3. **Comment-resolution API gap** (Medium): if the API can't resolve comments, bot replies "processed ✔" instead — humans resolve. Confirm in build spike.
4. **Prompt injection via source articles** (Medium): article text is untrusted; copy generator prompt must treat it as data; no tool access from within the generation step.
5. **Concurrent writers** (Low): nightly Contributors Extract and 15m Auto-stamp touch the same tables but different fields/stages; no overlap with bot writes identified.

---

## 8. Status

**Report: `ESCALATE`** — MCP discovery complete, architecture and plans ready, build blocked on D1 (Canva template) and approvals D2–D7. No production writes were made in this run; all Lark/Canva/n8n access was read-only.

---

# Addendum — Revision 2 (2026-07-22, after CEO responses)

**CEO decisions received:** (a) verify whether Enterprise is truly required; (b) inventory existing Canva projects; (c) **NO schema modifications whatsoever** — map onto existing fields only. D3 is closed: no new fields.

## A1. Canva Enterprise verification (double-confirmed against canva.dev)

- **Autofill API**: Enterprise IS required — "To use the Autofill APIs, your integration must act on behalf of a user who is a member of a Canva Enterprise organization." Paid plans get only a limited trial while an integration is in development. (canva.dev/docs/connect/api-reference/autofills)
- **Brand Templates API**: only needs Pro/Teams/Enterprise. (canva.dev/docs/connect/api-reference/brand-templates)
- **However, Enterprise is NOT needed for this mission.** The connected Canva integration supports a **copy-and-edit path** that bypasses the Autofill API entirely:
  `copy-design` (duplicate a master carousel design) → `start-editing-transaction` → `perform-editing-operations` (`replace_text` / `find_and_replace_text` per element; `update_fill` to swap images with uploaded assets) → `commit-editing-transaction`.
  This replaces only text/image content in an existing layout — functionally equivalent to "populate the locked template, never redesign" — and matches how the team already produces carousels (copy-per-carousel).

**Revised recommendation:** adopt copy-and-edit as the v1 mechanism. No Enterprise upgrade, no brand template build required. R8/R20 blocker downgraded to a validation spike: one test run on a copy of the master design to confirm element IDs are stable and text replacement behaves on all pages.

## A2. Existing Canva projects (verified inventory)

The account is active and already works on a copy-per-carousel pattern:

- **Master/template designs found:** `Autos Carousel Template` (DAHFXgXxLJA, 7 pages, 4:5), `Carousel Omah Library` (DAHFsJZ3sP0, 10 pages). No masters found named for Homes/Wealth/Foodie/Business verticals — CEO/designer to confirm which design is the approved master per vertical.
- **Dozens of per-carousel production designs** (4:5, 8–13 pages) matching Lark records by name: La Hilir, Puyo, Surety, Merry Riana Wealth, Daniel Lim Wealth, Volkswagen Beetle 1303, Sambal Bu Rudy, Kylian Mbappe Wealth, Srisun Express, etc.
- Folders: Hyrox, Uploads, Interior Design, Logos. Reference doc: `Copywriter Guidelines` (DAHHAV46ESU, 49 pages) — should feed the copy-generation prompt.

## A3. Revised design consequences of "no schema changes"

- Bot writes ONLY to existing fields: `Canva Link`, `Caption`, `Carousel Stage`.
- Provenance → recorded in n8n execution logs + run artifacts (and optionally appended as a footer line in `Caption`), not in new Lark fields.
- Amendment rounds → counted from Canva comment history / n8n executions, no Lark counter; max-rounds escalation enforced in workflow logic.
- Bot status/errors → n8n error workflow `ReSF67JnUkuFRkCZ` + Lark IM notification, no Lark field.

## A4. Remaining open items before build

1. CEO/designer: name the approved master design per vertical (only Autos + Omah Library identified).
2. Approve a one-design **validation spike** (copy `Autos Carousel Template`, run one text-replacement transaction, delete/keep the test copy) to confirm the copy-and-edit path end-to-end.
3. D2 (review-stage mapping: recommend `Amendments Needed`), D6 (git home), D7 (polling cadence + max rounds) still open.

**Status after addendum: `BLOCKED` on A4 items only — no technical blockers remain.**

---

# Addendum — Revision 3: Validation Spike Results (2026-07-22, CEO-approved)

**Spike executed end-to-end. The copy-and-edit path WORKS on the current (non-Enterprise) plan.**

| Step | Result | Evidence |
|---|---|---|
| `copy-design` from master `Autos Carousel Template` (DAHFXgXxLJA) | ✅ | Copy `DAHQGEfUOtg` created; original untouched |
| `start-editing-transaction` | ✅ | Returned full element map: 7 fixed pages, text element IDs with current text, image-fill element IDs, positions |
| `update_title` → "TEST — Copywriter Bot Spike (safe to delete)" | ✅ | edit_operation_results: success |
| `replace_text` (page 1 headline → "Inside Ahmad Faiz's RM2.5M Restored Skyline GT-R") | ✅ | Rendered thumbnail shows new headline in template styling (font/weight/red bars preserved) |
| `find_and_replace_text` (page 7 hook line) | ✅ | success; rest of element text untouched |
| `commit-editing-transaction` | ✅ | status: committed |
| Read-back via `get-design-content` | ✅ | Both replacements persisted |

**Findings that shape the build:**

1. **F1 — Master template gap (needs designer action):** on this master, editable text exists ONLY on pages 1, 6, 7. Pages 2–5 are full-bleed images with the slide copy baked into the image — the bot cannot rewrite those. The master must be rebuilt (or a new master made) with native Canva text layers on every content page, ideally with placeholder tokens (e.g. `{{SLIDE_2_HEADLINE}}`) so the bot can target them by text match.
2. **F2 — Element IDs are per-design:** IDs change on each copy, so the bot must call `start-editing-transaction` on each new copy and locate targets by placeholder text / position, not hard-coded IDs. `find_and_replace_text` on placeholder tokens is the robust mechanism.
3. **F3 — Not yet tested:** image swap (`update_fill`) needs an uploaded asset (`upload-asset-from-url`) — deferred to build phase; comment listing/replying also untested pending a design with comments.
4. **Cleanup:** test design `DAHQGEfUOtg` remains in the account, titled "TEST — Copywriter Bot Spike (safe to delete)" (the connector has no delete capability — trash it from the Canva UI at leisure).

**Status: technical path VALIDATED. Build can start once the per-vertical masters are rebuilt with text layers (F1) and the remaining A4 decisions (review-stage mapping, polling cadence, max rounds, git home) are confirmed.**
