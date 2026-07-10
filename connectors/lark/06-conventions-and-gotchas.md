# Lark — Conventions & Gotchas

## Data conventions
- **Must-fill coloring standard.** Empty cells in required fields turn **bright yellow** (cell-scoped) across the grid views. The load-bearing case: the **Post-URL fields** — an empty Post URL breaks the analytics join (Path B in [00-END-TO-END-WORKFLOW.md](00-END-TO-END-WORKFLOW.md)), so the yellow sweep is what protects the feedback loop, not cosmetics.
- **English-only.** All base content Claude creates (tables/fields/views/docs) is English.
- **Records born at Not Started** (client videos at Planning); Project Owner is not the content strategist.
- **Working table = active only;** Completed lives in a Completed view.

## API limits (know before you build)
- **Dashboards: no API** — build/edit in the UI (computer-use) only.
- **Automations: list/toggle only** — cannot be created via API. Native = UI; API-driven automation = n8n.
- **Fields:** API-created fields auto-appear in **all** views. Referencing a formula field that can return `BLANK()` inside another formula throws a client "unavailable formulas" error — inline the math instead.
- **Stage field (legacy source):** older Video Tracker "Status" was a Stage type (24) that read empty via API — irrelevant to the current base, but noted for migration work.

## Automation gotchas (repeat offenders)
- **Edge vs level:** "matches conditions" triggers fire only on *entering* the state and **ignore API writes**; use "when a record updates" for reflect-on-change.
- **Silent button no-op:** wrong-stage button clicks do nothing, with no log — read the automation's conditions first.
- **Scroll to the bottom** of an automation's action panel ("Add action") before judging it — captions undercount steps.
- **NOW() can't trigger** — overdue chasing is a scheduled scan over `Overdue` flags.
- **ModifiedTime clocks** (`Last … Stage Updated`) reset on *any* edit — trust the stage, not the timestamp.

## Field-edit gotchas (MCP)
- `appTableField_update`: description must be an object; skip lookups/buttons; editing a link renames the reciprocal field; rating display is UI-only.
- The automation **record-picker** only lists already-used records — API-tag a record, then reopen the editor to pick it.

## Timezone
- Automation `NOW()` = +8h vs formula `NOW()` = UTC. Stamp `NOW()-8/24` where needed; avoid `ROUND` for minutes.
