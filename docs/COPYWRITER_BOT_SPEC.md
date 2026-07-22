# Copywriter Bot — Implementation Specification (v1)

Grounded implementation spec, prepared **2026-07-22** from repository discovery (no live-system reads — see [CONNECTORS.md](CONNECTORS.md)). Follows the automation intake template in [11-agents-and-cron-jobs.md](11-agents-and-cron-jobs.md). **Nothing here is built yet.** Facts cite repo sources; design choices are marked as recommendations.

## 1. Purpose and exact job

Draft social-post **captions** into the Lark Base fields that were designed for exactly this, so human copywriters review and finalise instead of writing from scratch.

- **v1 scope — Video captions**: generate from `Video TXT (Transcript)` (`fldp1UKaL5`) into **`Caption (AI)` (`fldiC67Ryz`)** on Videos (`tbl8wIByJQwhIUei`). This *revives an existing, currently-inactive capability*: the archived "AI Video Summary ×4" n8n workflows (`7RoGbhmWamvW4pmp`, `mzXpe5ge5eItzCum`, `l4iG9BlqJsJmFFlt`, `PEDljjvly3ZSX1fd`) were this exact path and are not exported to the repo.
- **Explicitly out of scope for v1**: Carousel `Caption` (`fldo12tfmx`) is the *human copywriter's* working field inside an SLA-clocked stage — a bot writing there would collide with the copywriter and reset the SLA clock. A Carousel *suggestion* field is a v2 candidate, added via schema change with approval.
- **Never**: `Reviewed Caption (final)` (`fldRRUc0S0`) — the schema's own rule: "AI never touches this field". No external publishing of any kind.

## 2. Trigger

**Recommended: n8n Cloud schedule (poll), not a Lark edge trigger.**
- The company convention is "AnyCross = real-time; n8n = scheduled" ([04-requirements-and-decisions.md](04-requirements-and-decisions.md)); all existing scheduling lives in n8n Cloud (no local cron).
- Lark edge-triggered automations may not fire on API writes (`connectors/lark/04-automations.md`) — transcripts written by tools would be silently missed by an edge trigger. A poll misses nothing.
- Suggested cadence: **every 30 minutes, 08:00–20:00 SGT** (transcripts arrive during working hours; well inside the 16h Strategist-QC SLA). Cheap no-op when the queue is empty.

## 3. Input source and selection query

Scan Videos where **all** of:
1. `Video TXT (Transcript)` is non-empty (or `Meeting Transcript (TXT file)` attachment exists),
2. `Caption (AI)` is empty ← the idempotency guard,
3. `Video Stage` (`fldoWWWmFe`) ∈ {`Editing`, `Strategist QC`} (caption needed from QC onward; configurable),
4. Stage not in exception states (`Rejected/DO NOT POST`, `Taken Down`, `On Hold`).

Per record, also fetch for prompt context: `Video Idea`, `Topic`, Page link → country + vertical (Pages `tblUscIBwxElzzXi` is the only source of Vertical/Country), `Project/Sales Brief` lookup, `CTA Word` (`fldwCM0Pzc`, lookup from Lead Magnet Library `tblHACGPIPBfGUxj`).

## 4. Brand context and retrieval sources

Encode the existing rules — do not invent a voice. Sources to distil into the system prompt:
- `portal/src/brand-guideline-training.html`: lead with the answer; possibility framing; truth over comfort with numbers; warm not soft; **never lead with rejection words** ("no, don't, can't, won't, never, 'that's a problem', 'unfortunately'") — applies to *every caption*; bold for emphasis, never capitals; lowercase wordmark `koocester`, "Koocester" in prose.
- `portal/src/copywriter-training.html`: **the CTA is inherited from the record's lead magnet, never invented** — the bot must reference the looked-up `CTA Word` and must not fabricate offers; outside material is raw material, not copy to reproduce; match the page's country and vertical.
- The original caption prompt from the archived "AI Video Summary" workflows (recover via n8n export — see Blockers).
- Optional v1.1: few-shot examples from recent `Reviewed Caption (final)` values of the same Page (retrieved live, per-run; not stored).

## 5. Prompt structure and output schema

- System prompt: brand rules above + page country/vertical/language framing (system content is English-only per docs/04; market language nuance is a business decision — see Open questions).
- User content: transcript (truncated to a sane cap), video idea/topic, CTA word, project brief summary if present.
- **Output: strict JSON** (the pattern proven in `command-ai-cache-daily-8am.json`): `{ "caption": str, "hook_options": [str, str, str], "hashtags": [str], "notes_for_reviewer": str }`. Caption text written to `Caption (AI)`; hooks/notes appended in the same field under a separator or (v2, with schema approval) a dedicated field.
- Model: **Anthropic via the existing managed n8n credential** ("Anthropic API – Koocester", `sg4na3c3HYfSK4zM`). Recommend `claude-sonnet-5` for caption quality (the briefs use `claude-haiku-4-5-20251001`; captions are customer-facing and worth the step up — cost is per-video, not per-dashboard-view). Max tokens ~700.

## 6. Destination and review flow

1. Bot writes draft → `Caption (AI)` only.
2. Human copywriter reviews/edits → pastes final into `Reviewed Caption (final)` — the existing convention, no new UI needed.
3. Approval continues through the **existing** stage machine: `Strategist QC` → `Final Approval (Marketing/Client)` → `Ready To Upload`, gated by the existing approver fields/buttons.
4. Optional notification: one summary message per run to a marketing Lark chat ("N captions drafted: [record links]") — mirrors the brief-workflow send pattern. *Requires approval to enable, since it messages staff.*

## 7. Status lifecycle

No new statuses in v1. The implicit lifecycle is: `Caption (AI)` empty = queued → filled = drafted → `Reviewed Caption (final)` filled = reviewed/approved → stage `Completed` + post URLs = published. Rejection = reviewer clears/ignores the draft; `Reason for Rejection` (`fldMFuoQ2T`) already exists on Videos.

## 8. Idempotency and duplicate prevention

- Guard: **only select records where `Caption (AI)` is empty; never overwrite a non-empty value** (protects both against re-runs and against clobbering human edits made in that field).
- Upsert semantics identical to the Metricool syncs (fetch → filter → write once).
- Concurrency: single n8n workflow, no parallel instances (n8n default queue).

## 9. Retry and failure handling

- Per-record try/continue: one bad transcript must not sink the batch (match `onError` continue used by existing AI workflows) — **but unlike them, failures must not be silent**:
- **Dedicated error branch → Lark message to the tech/ops chat** with record link + error. The global Error Handling workflow (`error-handling.json`) is a 1-node stub; do not rely on it.
- Anthropic/ Lark API failures: n8n built-in retry (2 attempts, backoff), then error branch.
- A run that drafts zero captions is a normal outcome, not an error.

## 10. Logging and audit trail

- n8n execution history is the primary log (retained by n8n Cloud).
- Each draft is self-auditing: `Caption (AI)` filled + record ModifiedTime. Optional: prefix drafts with nothing (clean copy) but include model + date in `notes_for_reviewer`.
- ⚠️ Known side effect to document for the team: any bot write updates the record's ModifiedTime, which is what `Last Video Stage Updated` (`fldTG6p5XW`) reads — **the SLA clock resets on draft delivery**. Acceptable if the SLA engine is not yet live (see Blockers); if it is live, move SLA stamping to a true stage-entry timestamp first.

## 11. Permissions and secret handling

- Lark: existing managed credential ("Lark App Secret (Koocester)", `3HvLTgbxXknIviCu`) — needs Bitable record read/write on the M&D base only.
- Anthropic: existing managed credential. **No inline secrets in the workflow JSON** — the Command dashboard workflow is the clean reference pattern; the S1–S6 findings are the anti-pattern.
- No new credentials, no service-role keys, no external endpoints. If a manual-trigger webhook is added for testing, it must carry Basic-Auth (three no-auth webhooks are already an open finding in docs/15).

## 12. Testing strategy

1. **Read-only dry run** (per [14-testing-and-validation.md](14-testing-and-validation.md)): run selection query + prompt, output drafts to the n8n execution log only. Review quality with the Head Copywriter.
2. **Single-record pilot**: one designated test Video record (created for this purpose), verify the write lands in `Caption (AI)` only, verify no automation fires unexpectedly, verify idempotency by re-running.
3. **Golden-set check**: run the prompt against 5 past transcripts whose `Reviewed Caption (final)` is known; Head Copywriter (Ratnasari — company-wide approver per Pages defaults) scores usefulness before activation.
4. Activation with the 30-min schedule; monitor first week via error branch + spot checks.
5. Rollback: deactivate the workflow in n8n (one click); drafts already delivered are inert text in an AI-designated field.

## 13. Deployment location and ownership

- **Where:** n8n Cloud (`koocester.app.n8n.cloud`), built in the UI per [13-deployment-runbook.md](13-deployment-runbook.md); export the sanitized JSON to `n8n/workflows/` in the same PR that updates this spec (repo convention).
- **Owner:** whoever owns the other content workflows (open question — n8n account owner today is the CEO's login). Named owner required before activation per docs/11 template.

## 14. Performance feedback loop (v2+)

The join already exists: Lark post-URL fields ↔ `content_perf.reels.post_url` (Supabase). v2 can retrieve, per Page, the captions of its top-N reels by engagement (via the same query surface Metabase card "Top Reels by Views" uses) and feed them as few-shot examples — closing the loop the system was built for. Not in v1.

## 15. Blockers (must clear before build)

1. **Export the archived "AI Video Summary ×4" workflows from live n8n** — recovers the original caption prompt and the Lark node wiring; one of them contains inline secret S2, so sanitize on export. Needs n8n access (MCP or UI).
2. **Confirm the SLA engine state** (`SLA State (activate at go-live)` placeholder) — decides whether the ModifiedTime side effect matters now or later.
3. **Live Lark schema verification** — repo schema is a 2026-07-21 snapshot; verify the field IDs above before writing to them. Needs Lark access.
4. **Business decisions (the only questions discovery could not answer):**
   - Caption language per market (SG/MY/ID): English-only, or market language? (System content is English-only; captions are customer-facing.)
   - Which stages should trigger drafting (proposed: Editing + Strategist QC)?
   - Should the per-run Lark chat notification be enabled?
5. **Repo ownership/visibility** should be fixed first ([GITHUB_OWNERSHIP.md](GITHUB_OWNERSHIP.md)) so the bot's exported workflow JSON lands in a private company-owned repo.

## 16. Smallest next implementation step

Connect n8n access (MCP or UI session) and **export + sanitize the four archived AI Video Summary workflows into `n8n/workflows/`**. That single read-only step recovers the original prompt, confirms the Lark node pattern, and turns this spec's §5 from "recommended" into "grounded" — with zero production risk.
