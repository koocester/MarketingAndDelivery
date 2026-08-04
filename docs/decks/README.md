# Recurring meeting decks — the format contract

Two decks in this company repeat forever on a fixed cadence:

| Deck | Cadence | Spec |
|---|---|---|
| Management weekly slides | every week, built Saturday morning SGT | [WEEKLY-MANAGEMENT-SLIDES.md](WEEKLY-MANAGEMENT-SLIDES.md) |
| Town Hall slides | monthly, **first Tuesday, 10:00 SGT** | [TOWN-HALL-SLIDES.md](TOWN-HALL-SLIDES.md) |

> **Note on the name.** The Town Hall used to be "first Wednesday" and is still called that
> in conversation. Hakim moved it on 2026-07-30: the old Wednesday series was terminated and a
> new **first-Tuesday 10:00–11:00** series created. The spec follows the calendar, not the habit.

## Why these files exist

These decks are rebuilt every cycle. Without a written contract, each rebuild re-decides the
running order, the wording, the components and the colours — and the deck drifts. Everyone then
spends the meeting arguing with the layout instead of the numbers.

**So: the spec is the input to the build, not a description written afterwards.**

## The rule

1. **Read the spec before building.** The running order, the slide contract and the render
   rules in these files are authoritative. Build to them.
2. **Only the numbers change between cycles.** Same sections, same order, same components,
   same credit lines — refreshed data. If a section has no data this cycle, it says so; it is
   not silently dropped.
3. **Deviating requires an instruction.** If Hakim or Faiz asks for a change, the change goes
   **into the spec first** — appended to that file's Change log with the date, who asked, and
   what changed — and the deck is then built to the new version. Never the other way round.
4. **Append, don't rewrite.** History is the point. A future build should be able to see when
   a rule appeared and why.
5. **Never invent a number or a name.** Every figure traces to a source named in the spec.
   Where an attribution is missing from the source system, the deck says so in plain words
   rather than guessing or leaving a hole.

## Invariants shared by both decks

These hold regardless of which deck is being built:

- **Brand.** Maroon `#C02025` is the only accent. Wordmark is lowercase `koocester`;
  in prose it is "Koocester". Bold for emphasis, never all-capitals.
- **Self-contained HTML.** One file, inline CSS and JS, no external fetches, no build step.
  It has to open from a database column inside an iframe with no network.
- **Keyboard + click navigation**, a slide counter, and a progress bar.
- **Stored, not generated on view.** The deck is written to `public.reports` (Portal Supabase)
  and served from there, so what a manager reviewed is exactly what the room sees.
- **Every version is attributable.** The deck carries a visible "last edited by / when (SGT)"
  stamp, and every save snapshots the previous version before overwriting.
- **Governed numbers.** Figures come from the warehouse and the Metric Registry, not from
  anyone's memory. See each spec for the enforcement path.

## Where the parts live

- Generators and servers: n8n Cloud (workflow IDs in each spec).
- Storage: Portal Supabase, `public.reports`.
- Viewer + archive: staff portal (`koocester-academy` repo, `src/manager/`).
- Warehouse: Supabase project `wnerzolcmjrsktfqferw` (`content_perf.*`, `hubspot.*`, `xero.*`).
- People/credits: Lark Marketing & Delivery base `BG8PbaZFna1NQksNWkglTN85gSf`.
