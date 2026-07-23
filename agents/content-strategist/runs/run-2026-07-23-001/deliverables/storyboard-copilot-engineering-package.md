# Storyboard Copilot — Engineering Package (revision 1)

Run: run-2026-07-23-001 · Role: Automation Engineer · Status at end of package: READY_FOR_QA

---

## 1. Executive Summary

The Storyboard Copilot is three connected systems, all anchored on the existing M&D base Video table — no new base, no schema change on day one:

1. **Storyboard drafting pipeline.** When a video record in `Planning` has a discovery-call transcript attached and no storyboard yet, the copilot researches that page's recent winners, pulls the offer from the linked Lead Magnet Library record, drafts the full GUIDE-structure storyboard as a new Lark Doc, writes the doc URL into the record's `Storyboard (Lark Doc)` field, and DMs the record's Strategist. The strategist reviews in the doc (inline comments — the existing review surface) and approves with the existing `Storyboard Done and Checked` button. The copilot never approves, never shares, never touches offer or pricing on paid videos.
2. **Discovery-call extraction question set.** A living document (v1 in the kit) the strategist runs on the call; the transcript it produces is the copilot's primary input. Maintained per-vertical over time from what winning boards actually needed.
3. **Winners-to-Poppy-AI feedback loop.** A weekly automated job ranks the trailing-90-day posts per page from the Metricool data already synced to Postgres (`content_perf.reels`), joins them back to their Video records, packages stats + storyboard + hooks, and uploads to Poppy AI so its pattern library keeps improving. Fully automated once Poppy AI access exists; until then the package is staged and the upload is browser-assisted.

The single unresolved dependency is Poppy AI access (API key vs paid plan vs Playwright automation) — owned by Faiz per the brief. Everything else was resolved against live systems this run.

## 2. Requirements Matrix

| ID | Requirement (brief §) | Design answer | Status |
|---|---|---|---|
| R1 | Full storyboard in GUIDE structure per video (§6) | Drafting pipeline, storyboard doc template §8 | Designed |
| R2 | Video Details block (§6) | Doc template section 1, fields mapped in §7 | Designed |
| R3 | 3 hooks passing scroll-stop gates, with visual prompt, b-roll, title, tone, remarks (§6, §11, §13.1) | Doc template section 2 + generation prompt gates + self-check | Designed |
| R4 | Full arc set: Establishment, Arcs 1–4, Resolve, Trust + ending CTA (§6, §11) | Doc template sections 3–9 | Designed |
| R5 | Visual prompt per scene: [person]+[action]+[environment]+[emotional state]+[framing] (§6, §11, §13.2) | Enforced by generation schema + self-check regex | Designed |
| R6 | Offer + lead magnet to Hormozi standard; CTA type from 24-type taxonomy; shortest CTA wording (§6, §11) | Read from Lead Magnet Library by reference; Hormozi checklist in prompt; taxonomy is a config list | Designed |
| R7 | Never duplicate offer into lead-magnet table (§12) | Copilot has no write path to tblHACGPIPBfGUxj | Designed |
| R8 | Remarks flags for graph/chart/animation visualisation (§6, §11) | Doc template Remarks column; prompt instruction on every explanation | Designed |
| R9 | Standing body-language reminder on every board (§6, §11) | Fixed block in doc template footer | Designed |
| R10 | Comprehensive discovery-call extraction question set (§6, §19) | Kit file v1, validated; maintenance loop §10 step 6 | Delivered v1 |
| R11 | Winning-video feedback loop, automated, AI-driven (§6, §19) | Architecture C, workflow W2 | Designed |
| R12 | Research: page winners last 90 days, Poppy patterns, current offer, guest's business, call transcript (§8) | Pipeline stages 2–3; hooks first, visuals second | Designed |
| R13 | Write only to M&D Video table staging surface; nothing leaves automatically (§12) | Write surface = one URL field + new doc + DM (§7) | Designed |
| R14 | Never auto-approve; strategist-only approval (§12, §16) | Approval stays on existing button; copilot has no path to it | Designed |
| R15 | GUIDE confidentiality; storyboard shareable only with client/interviewee for rehearsal, by a human (§12, §18) | GUIDE never embedded in any output doc; sharing is a human action | Designed |
| R16 | No invented facts/numbers; source or transcript or stop-and-ask (§12, §18) | Claim-to-source map required per draft; missing fact → question to strategist, not invention | Designed |
| R17 | Paid-video offer/pricing → human approval (§12, §16) | Paid detection via Client/Vendor lookup; pipeline stops and asks | Designed |
| R18 | Brand and tone rules incl. NLP, no dashes, English only (§10) | Generation prompt constraints + self-check | Designed |
| R19 | Pilot with one/both strategists; daily-use tool (§14, §19) | Rollout plan §14; pilot pick escalated | Designed |
| R20 | Cost-efficient model path (§14) | Model choice is a config parameter; recommendation in §10 | Designed |
| R21 | Attribution integrity: post URL join key untouched (§18) | Copilot never writes any Post URL field | Designed |

No requirement dropped.

## 3. Architecture

Three components, smallest viable write surface:

```text
                       ┌──────────────────────────────────────────────┐
                       │                 LARK M&D BASE                │
                       │  Videos ── Lead Magnet Library ── Pages      │
                       │     │            (reference only)            │
                       └──┬──┴───────────────▲──────────────▲─────────┘
     transcript attached, │ read             │ write:        │ read
     Stage = Planning     │                  │ Storyboard    │
                          ▼                  │ (Lark Doc) URL│
                  ┌───────────────┐          │               │
  A. DRAFTING     │  n8n W1:      │──────────┘               │
     PIPELINE     │  Storyboard   │──► new Lark Doc (draft)  │
                  │  Copilot      │──► DM to Strategist      │
                  └──────┬────────┘                          │
                         │ context: winners, patterns        │
                         ▼                                   │
                  ┌───────────────┐        ┌─────────────────┴─────┐
                  │   Poppy AI    │◄───────│  n8n W2: Winners loop │
  C. FEEDBACK     │ (pattern lib) │ upload │  weekly, automated    │
     LOOP         └───────────────┘        └───────────▲───────────┘
                                                       │ read
                                           ┌───────────┴───────────┐
                                           │ Postgres content_perf │
                                           │ .reels (Metricool     │
                                           │  syncs, existing)     │
                                           └───────────────────────┘
  B. QUESTION SET: kit markdown → strategist runs call → transcript → attached to Video record (human step, by design)
```

Key decisions:

- **A1. Storyboard = Lark Doc, not a text field.** The live field description mandates it: the doc is the commentable review surface. The copilot creates the doc (markdown import), then writes only its URL into `Storyboard (Lark Doc)`.
- **A2. No schema change day one.** `Video Stage` already models the workflow (Planning → strategist button → Ready to Shoot). A `Storyboard Draft Status` select (Drafting / Draft Ready / In Review / Approved) is proposed as an enhancement behind the schema-change approval gate.
- **A3. Winners data from Postgres, not Metricool API.** The Metricool→Postgres sync already exists and is the same source the Post Campaign Report trusts. One source of truth, no second Metricool integration.
- **A4. Poppy AI behind an adapter.** The pipeline calls a single "PatternProvider" boundary with three implementations, switchable by config: (1) Poppy API if a key exists, (2) Playwright MCP browser automation, (3) staged-package + human-assisted upload. Pilot can start on (3) without blocking on Faiz's identifier.
- **A5. House patterns reused.** Tenant-token auth via the shared `Lark App Secret (Koocester)` credential, shared error workflow `ReSF67JnUkuFRkCZ`, Asia/Singapore timezone, ~320ms write pacing, "AI field vs human field" separation (per the Caption (AI) / Reviewed Caption precedent).

## 4. Workflow Design (n8n standard)

### W1 — Storyboard Copilot (drafting)

| Element | Design |
|---|---|
| Trigger | Schedule every 30m + manual webhook (strategist-initiated). Claims one record at a time (lock via run marker in doc title; skip if `Storyboard (Lark Doc)` non-empty) |
| Validation | Record must have: Stage = `Planning`, `Meeting Transcript (TXT file)` attached, `Page` linked, `Storyboard (Lark Doc)` empty. Paid video (`Client/Vendor` non-empty) + any offer/pricing change needed → notify strategist, do not proceed on offer content |
| Processing | 1) Download + parse transcript attachment. 2) Read record context (Page, Vertical, Objective, targets, guest fields, Template, Lead Magnet link + CTA Word + Landing Page). 3) Query Postgres for the page's top posts, trailing 90 days, ranked by ER then views. 4) PatternProvider: fetch Poppy AI hook/arc patterns for the vertical. 5) LLM generation against the GUIDE-structure schema. 6) Self-check gates (hooks ×3, visual prompt format per scene, mandatory blocks, banned-claims scan, no dashes, English) |
| Decision nodes | Missing transcript → skip. Missing lead magnet on a Lead Generation video → DM strategist "offer needed", skip. Self-check fail → one internal regeneration, then flag draft as needs-attention in the DM |
| External integrations | Lark (read record, upload doc, write URL, DM), Postgres (read), PatternProvider (read), LLM API |
| Write-back | §8.4 sequence: confirm target record and field → re-read record, verify `Storyboard (Lark Doc)` still empty (conflict check) → import doc → write URL → read back → audit log row |
| Logging | Start/end, record id, VID-####, winners used, pattern-source used, model + token spend, write result |
| Error handling | errorWorkflow `ReSF67JnUkuFRkCZ`; per-node retry 2× with backoff; any Lark write failure → no partial state (doc created but URL not written → DM strategist with doc link) |
| Notifications | DM to record's `Strategist` with doc link + one-line summary + the three hooks |
| Completion | Record untouched except the one URL field; approval remains human |
| Idempotency | Re-runs skip records with a non-empty storyboard URL; doc import keyed by VID-#### in the title; DM deduped per record+revision |

### W2 — Winners → Poppy AI (feedback loop)

| Element | Design |
|---|---|
| Trigger | Weekly (Mon 08:00 SGT) + manual webhook |
| Validation | Skip pages with < N posts in window; skip posts already uploaded (upload ledger) |
| Processing | 1) Postgres: per page, top posts trailing 90 days by ER and by views. 2) Join post URL → Video record (reuse Post Campaign Report key-extraction logic). 3) Package: stats + hooks + storyboard doc text + objective + outcome vs target. 4) PatternProvider.upload() |
| Write-back | Upload ledger (n8n data table or Postgres table `copilot.poppy_uploads`) records VID-####, week, hash — duplicate prevention |
| Error handling / retry | Same house pattern; a failed upload stays un-ledgered and retries next week |
| Notifications | Weekly one-line digest to the strategists' group: "N winners uploaded, top hook styles this week: …" |
| Fallback | While PatternProvider = staged mode: package written to a Lark-accessible staging doc + DM to Faiz/strategist for one-click manual upload |

### W3 (existing, unchanged) — Metricool syncs keep feeding `content_perf.reels`. No modification.

## 5. Data Flow

Transcript (attachment) + record context (Lark) + winners (Postgres) + patterns (Poppy) → LLM → storyboard doc (Lark Doc) → URL on record → strategist review (inline comments) → `Storyboard Done and Checked` (human) → shoot. After posting: SMM fills post URLs → Metricool sync → Postgres → W2 → Poppy AI → better patterns for the next board. The loop closes without the copilot ever writing a post URL or a performance number.

## 6. API Map

| System | Access | Endpoints/objects | Auth | Limits/notes |
|---|---|---|---|---|
| Lark Base | read/write | bitable records search/get/update on `tbl8wIByJQwhIUei`; drive media download (transcript attachment) | tenant token via shared credential | ~320ms pacing per house pattern; conflict check before write |
| Lark Docs | create | docx import (markdown → doc), permissions default internal | tenant token | Doc must NOT be shared externally by the copilot |
| Lark IM | send | DM to Strategist open_id; group digest | tenant token | Notification only |
| Postgres (Supabase) | read + one new ledger table | `content_perf.reels`; new `copilot.poppy_uploads` | existing `Postgres account` credential | Ledger creation is a deploy-time migration, approval-gated |
| Poppy AI | UNKNOWN | UNKNOWN — API key vs browser | pending Faiz | Adapter boundary; unknown capability is never assumed capability |
| LLM API | generate | Claude API (claude-sonnet-5 default for cost-efficiency; claude-fable-5 where hook quality justifies it — config, not code) | existing key mgmt | Token spend logged per run |
| Metricool | none directly | reached only through existing syncs | — | deliberate: one source of truth |

## 7. Data Model & Field Mapping

Write surface (complete list — nothing else is ever written):

| Target | Field/object | Direction | Rule |
|---|---|---|---|
| Videos.`Storyboard (Lark Doc)` (fldv0yaIgF) | Url | write once | Only when empty; conflict-checked; never overwritten on re-run (revision drafts become new docs linked from the DM, strategist decides) |
| New Lark Doc | doc body | create | Title: `Storyboard · VID-#### · <Page> · draft rN`; content = template §8 |
| Strategist DM / group digest | message | send | Notification only |
| `copilot.poppy_uploads` | ledger row | insert | Idempotency ledger |

Read surface: Videos record fields listed in the discovery snapshot; Lead Magnet Library via the record's link (reference only); Pages via link; `content_perf.reels`.

Explicit never-write list: Video Stage, any approval button/field, Reviewed Caption, all Post URL fields, Lead Magnet Library table, Pages table, any schema object.

## 8. Storyboard Doc Template (output schema)

Structure only — the confidential GUIDE document itself is never embedded, only the structure named in the mission brief:

1. **Video Details** — page featured in; video objective; target audience persona; dream outcome (viewer's win); win metric (company win, from targets / Video Success Looks Like); interviewee winning picture; offer CTA (CTA Word + Landing Page, by reference); proposed caption; interviewee outfit (colour-cluster guidance from question 38).
2. **Hooks ×3** — each: hook line, visual prompt, b-roll, title in video, tone, remarks. Each must pass the three scroll-stop gates; gate self-check recorded.
3. **Establishment** · 4. **Arc 1 People First** · 5. **Arc 2 Value of the Tour** · 6. **Arc 3 Mid CTA Scene** · 7. **Arc 4 Short Celebratory Scene** · 8. **Resolve** · 9. **Trust + ending CTA** — each scene row: script/beat, question to ask, visual prompt in `[person] + [action] + [environment] + [emotional state] + [framing]`, b-roll, remarks (visualisation flags: graph/chart/animation wherever there is an explanation).
10. **Offer & lead magnet** — LM-#### reference, CTA type (from the 24-type taxonomy config), shortest CTA wording.
11. **Claim-to-source appendix** — every guest fact/number mapped to transcript line or record field; anything unsourced is listed as an open question, never stated in the board.
12. **Standing footer** — body-language reminder verbatim: no arms tucked in, no arms behind the back or hiding, conversational with a sincere outlook and tone.

Copy rules enforced: no dashes, no unexplained abbreviations, English only, lead with the point, speak from abundance, no unverifiable claims, NLP framing in questions and captions.

## 9. State Machine (per video)

```text
PLANNING_ELIGIBLE (Stage=Planning ∧ transcript ∧ no storyboard URL)
→ CONTEXT_GATHERED → PATTERNS_FETCHED → DRAFT_GENERATED
→ SELF_CHECK_PASSED | SELF_CHECK_FLAGGED (one regen, then flag)
→ DOC_CREATED → URL_WRITTEN → STRATEGIST_NOTIFIED
→ [human] IN_REVIEW (inline comments) → [human] revisions r2..r3 (new doc per revision, on request)
→ [human] Storyboard Done and Checked → READY_TO_SHOOT (existing pipeline)
Terminal copilot state is STRATEGIST_NOTIFIED — everything after is human.
```

## 10. Implementation Plan

1. **Config pack** (day 1): 24-type CTA taxonomy list, scroll-stop gate definitions, arc gating checklists, banned-claims list, colour-cluster outfit rules — extracted from the GUIDE by a human (confidential doc stays out of the repo), stored as n8n workflow static config / Lark-restricted doc.
2. **W1 skeleton** (day 1–2): triggers, validation, Lark read path, transcript download/parse; dry-run mode writing the draft doc only, no URL write.
3. **Winners query + generation prompt** (day 2): Postgres query, prompt with GUIDE structure schema, self-check code node. Pilot generation on 2–3 past videos with known-good storyboards; strategist compares.
4. **Write-back + notifications** (day 3): §8.4 sequence, DM, audit log. Human approval to enable the URL write.
5. **W2 winners loop** (day 3–4): query, join, package, ledger; staged-upload fallback live immediately; PatternProvider swaps to API/Playwright when Faiz supplies the identifier.
6. **Question-set maintenance loop** (ongoing): after each shoot, strategist notes which answers the board lacked; monthly prompt-set revision committed to this repo.
7. **Pilot** (this week per deadline): one strategist (CEO picks), 2–3 real videos, 2–3 review rounds each; measure draft-acceptance rate and time saved.
- Model/cost: default claude-sonnet-5 for drafting, escalate hooks-only pass to claude-fable-5 if hook quality misses the bar — config parameter, revisit after pilot.

## 11. Risk Register

| Risk | Impact | Mitigation | Owner |
|---|---|---|---|
| Poppy AI access unresolved | Feedback loop degraded to assisted mode | Adapter + staged fallback ships anyway; escalated to Faiz for the identifier | Faiz |
| GUIDE confidentiality leak | High (brief §18) | GUIDE never in repo/doc/prompt-logs; only structure names used; config pack extraction done by a human; storyboard docs internal-permission only | Strategist + engineer |
| Hardcoded Lark app secret in existing PCR workflow | Credential exposure (pre-existing) | Move to shared credential + rotate; approval-gated fix proposed | Faiz |
| Invented guest facts | Trust/brand damage | Claim-to-source appendix mandatory; unsourced → open question | Copilot design |
| Draft overwrites human work | Data integrity | Write-once on empty field + conflict re-read; revisions are new docs | Copilot design |
| Strategist QC bypassed by habit | Human-in-loop erosion | Copilot cannot touch Stage or buttons; DM framing says "draft for your review" | Strategist |
| Lock/duplicate runs | Duplicate docs/DMs | Idempotency: URL-empty check, doc title key, DM dedupe, upload ledger | Copilot design |
| Attribution join key broken | Downstream reporting | Copilot has no write path to any Post URL field | Design |
| SLA formula side effects (Last Video Stage Updated is a ModifiedTime field — ANY record write touches it) | False SLA resets on the Planning clock | Verified: fldTG6p5XW is record-level ModifiedTime, so writing the storyboard URL resets the stage clock. Acceptable (writing the storyboard IS planning progress); noted for the strategists | Noted |

## 12. Test Plan

Happy path: eligible record → doc created, URL written, DM received; content passes all self-checks; strategist can comment and approve.
Invalid data: missing transcript; corrupt/empty TXT; record with no Page; Lead Gen video with no lead magnet; paid video offer case → stops and asks.
Duplicates: run W1 twice on the same record → exactly one doc, one URL, one DM. Run W2 twice same week → ledger blocks re-upload.
API failures: Lark 429/5xx mid-sequence → retry then clean abort with DM fallback; Postgres down → skip with alert; LLM timeout → retry once, then flag.
Permission failures: doc import forbidden, field write forbidden → error workflow alert, no partial URL write.
Malformed payloads: transcript in unexpected encoding; lead magnet with empty CTA Word.
Partial failure: doc created but URL write fails → DM contains doc link and needs-attention flag; second run must not duplicate the doc.
Rollback drill: clear URL field on a test record, archive doc → record returns to eligible state cleanly.
Evidence: each test logged with execution id in `runs/<run-id>/test-evidence.md` at deployment time.

## 13. Rollback Plan

W1: deactivate workflow; for any bad draft, strategist clears the `Storyboard (Lark Doc)` URL (one field) and archives the doc — record returns to the eligible pool. No other record state is ever modified, so rollback is always one field per record.
W2: deactivate; delete ledger rows for the affected week (Poppy-side removal is manual until API confirms delete capability — logged in the ledger either way).
Schema enhancement (if later approved): field deletion restores prior state; no formulas reference it.

## 14. Deployment Checklist

- [ ] CEO picks pilot strategist (escalation E2)
- [ ] Config pack extracted from GUIDE by a human and loaded
- [ ] `copilot.poppy_uploads` ledger migration approved and applied
- [ ] W1 deployed inactive → dry-run on 2–3 past videos → strategist sign-off → URL-write enabled → active
- [ ] W2 deployed in staged-fallback mode → active
- [ ] Poppy AI identifier from Faiz → PatternProvider switched → E2E upload verified
- [ ] Secret rotation for the PCR workflow approved and done
- [ ] Error-workflow alerts confirmed firing to the right group
- [ ] Pilot review after 3 videos: acceptance rate, revision count, time saved

## 15. QA Handoff

- Artifacts: this package, `discovery/mcp-discovery.md`, `execution-contract.md`, `manifest.json`, kit question set.
- Claim-to-source: every field name/ID in this package traces to the field listing captured in the discovery snapshot; every workflow claim traces to the two workflow reads; page list traces to the Pages table search. No Lark writes were made this run.
- Uncertainty list: Poppy AI path (escalated, Faiz); pilot strategist identity (escalated, CEO); exact view (immaterial to record-level writes); GUIDE config pack contents (human extraction step, by design).
- Requested QA focus: requirements coverage vs brief §6/§11/§12, factual schema accuracy, confidentiality handling, absence of auto-approval, feasibility of fallback paths.

Report: **READY_FOR_QA**
