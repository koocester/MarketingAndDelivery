# Overdue alert attribution — the "first record found" defect (2026-07-30)

Companion to [03-pipelines-and-sla.md](03-pipelines-and-sla.md) and [04-automations.md](04-automations.md).
Audit style follows [07-button-automation-audit.md](07-button-automation-audit.md).

## The complaint

Mike (Head of Growth) raised the same objection twice in the **Overdue Work Updates** group
(`oc_0632b137e86e79e1e95d8f379adca873`):

- **2026-07-28 10:53** — "above overdues are not accurate, overdue will fall on editors when status is Strategist QC. please enhance and recheck."
- **2026-07-30 09:08** — "above overdues by editors are inaccurate. please enhance and recheck."

## What was actually wrong

**The counts were correct. The names were not.**

Verified against the live base on 2026-07-30: 22 videos and 1 carousel were genuinely past their
stage deadlines. Nothing was invented or double-counted. Breakdown by the stage actually late:

| Stage late | Count | Whose clock |
|---|---|---|
| Strategist QC | 7 | Strategist |
| Approval | 5 | Head of Growth Approver |
| Amendments (Marketing) / Amendments Needed | 5 | Editor |
| Final Approval (Marketing/Client) | 5 | Marketing / client |

17 of the 22 already had a Frame.io link — the editor had delivered. Only **3** videos were in
`Editing` at all, and all 3 were inside SLA.

The `Digest – … Overdue → <owner>` automations **filter correctly** — e.g.
`Digest – Video Strategist QC Overdue → CS` filters `Overdue is OVERDUE AND Video Stage is Strategist QC`.

The defect was **only in the Lark message Title**, which was built as:

```
⏰ Overdue alert: {Video Editor of "the first record found"}
```

Two consequences:

1. **Wrong role named.** An editor's name on a QC, Approval or Final Approval digest — stages
   editors do not own.
2. **Wrong person even within the right role.** Because the token resolves against *the first
   record found*, one arbitrary name is stamped across a digest covering many people's items,
   hiding everyone else behind it. This is why `⏰ Overdue alert: Ulysess Marvels` appeared twice
   on 2026-07-30 — his name was simply first in the result set, not an accusation.

## The responsibility rule (owner: Mike, Head of Growth)

Settled 2026-07-30. His 28 July message naming Strategist QC was retracted in writing:
*"my typo mistake, final comment: listed only Amendments (Marketing) and Amendments Needed."*

> **Editors own an overdue ONLY when Video Stage is `Amendments (Marketing)` or `Amendments Needed`.**
> Strategist QC is **excluded**. Every other stage belongs to the stage owner:
> Approval and Final Approval → `Head of Growth Approver`; Strategist QC → `Strategist`;
> raw footage → `Producer`; carousel Final Approval → `Head Copywriter (Approver)`.

Correct editor count on 2026-07-30 was **5**, not what was posted:
Stanley 2 (VID-1334, VID-0330), Riza 2 (VID-0969, VID-1060), Maulana 1 (VID-0757).

## Rule for all future digests

**A Base digest must never interpolate a person field into its Title.** Any digest that can return
more than one record will pick one arbitrary name and hide the rest. Label the title by *stage*;
list the records in the body, where the per-record fields resolve correctly.

## Audit of all 12 overdue automations

Filter the Automation Center sidebar by **At Scheduled Time** to find these — the name search box
is fuzzy letter-matching and unreliable.

### Changed (5) — all Video-side; all carried the `Video Editor` first-record token

| Automation | Title before | Title after |
|---|---|---|
| Digest – Video Strategist QC Overdue → CS | `⏰ Overdue alert: {Video Editor}` | `⏰ Overdue alert: Strategist QC` |
| Digest – Video Marketing Approval Overdue → Marketing | `⏰ Overdue alert: {Video Editor}` | `⏰ Overdue alert: Video Marketing Approval` |
| Digest – Video Final Approval Overdue → Marketing | `⏰ Overdue alert: {Video Editor}` | `⏰ Overdue alert: Video Final Approval` |
| Digest – Video Amendments Overdue →Editor | `⏰ Amendments overdue: {Video Editor}` | `⏰ Amendments overdue: Video (editors)` |
| Digest – Video ManyChat Overdue → SMM | `⏰ Overdue alert: {Video Editor}` | `⏰ Overdue alert: Video ManyChat build` |

Note the last one posts to **SMM Updates**, so SMMs were being shown an editor's name against a
ManyChat build task. The fourth is the case where editors *do* own the stage — it still needed the
fix, because "first record found" hid every editor but one.

### Verified correct, unchanged (7)

- `Video - Overdue edit alert (daily Mon-Fri 9am)` — filters on `Overdue (alert)` (the true editor
  SLA field: stage = Editing, no Frame.io link, no Overdue Explanation) and has no name token.
  Correctly found zero records on 2026-07-30 and stayed silent.
- `Digest – Carousel Not Started Overdue → Marketing`
- `Digest – Carousel Copywriting Overdue → Copywriter`
- `Digest – Carousel Amendments Overdue → Copywriter`
- `Digest – Carousel Final Approval Overdue → Marketing`
- `Digest – Carousel ManyChat Overdue → SMM`
- `Digest – Carousel Content Stale → SMM`

The carousel digests were never affected: their `Select fields` contains only `Carousel Title`, so
no person token was ever available to the title.

`Notify - Producer Raw Upload Overdue` was not opened — it is an event-driven Notify addressed to
the Producer, which is the correct owner for raw-footage overdue.

## Known issue still open — the SLA clock resets

`Last Video Stage Updated` and `Last Carousel Stage Updated` are **record-level ModifiedTime**
fields, not stage-change timestamps. Any write resets them, including scheduled n8n jobs that touch
records every 15 minutes.

Evidence: 274 videos sit in the terminal `Completed` stage — their stage cannot change again — yet
their "stage updated" value keeps advancing (VID-0226 uploaded 13 Jul, stage-updated 29 Jul 10:41;
VID-0196 uploaded 8 Jul, stage-updated 27 Jul 16:24).

**Direction of the error: durations UNDERSTATE lateness.** A record that anything touches restarts
at zero. Conversely the multi-day figures (VID-0243 at 13.6 days, VID-0191 at 12.7 days) mean
nothing has touched those records at all since mid-July — they are real, not artefacts.

Fix requires immutable per-stage entry timestamps stamped by the existing stage buttons. Not started.

This is the same root cause already flagged in the CHANGELOG against
`SLA State (activate at go-live)`, and in the Metric Registry against *Strategist QC cycle time*.

## Metric Registry changes

| Metric | Change |
|---|---|
| Content overdue count | **Trusted → Approximate.** Total is sound; per-person split is not, and durations understate. |
| Overdue by person (responsibility attribution) | **New row, status Broken.** Full rule recorded, owner Mike. Must not be used for performance, pay or promotion. |

## Jarvis

n8n workflow `c2RpBCrqU20PLu7h`, node `Fetch Read-Only Live Context`, computed
`overdue_by_editor` from the same raw stage `Overdue` field and never fetched the editor field at
all — so Jarvis reproduced the identical mis-attribution when asked. Corrected: the tally is now
restricted to the two amendment stages, `overdue_by_stage` / `_strategist` / `_approver` were added,
and the responsibility rule is passed to the model as an explicit instruction. Fetch list gained
`Head of Growth Approver`, `Overdue (alert)` and `Amendments Overdue (alert)`.

Jarvis is a single-shot completion with no tools, so it cannot re-query or self-correct — its
"I don't have live access" reply on 2026-07-30 was a context-fetch failure, not a permission denial
(the group *is* in its management allowlist).

## Rollback

Per automation: re-add the `Video Editor` token to the Title field.
Jarvis: revert the tally line to `overdue_by_editor:tally(overdueRows,'Video Editor')`.
Metric Registry: restore `Content overdue count` to Trusted and delete the new row.

## Owner

Faiz — attribution fix. Mike — the responsibility rule and the Approval/Final Approval queue.
