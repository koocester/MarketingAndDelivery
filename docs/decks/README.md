# Recurring meeting decks — the format contract

Two decks in this company repeat forever on a fixed cadence:

| Deck | Cadence | Spec |
|---|---|---|
| Management weekly slides | every week, built Saturday morning SGT | [WEEKLY-MANAGEMENT-SLIDES.md](WEEKLY-MANAGEMENT-SLIDES.md) |
| Town Hall slides | monthly, **first Tuesday, 10:00 SGT** | [TOWN-HALL-SLIDES.md](TOWN-HALL-SLIDES.md) |
| — opening video sourcing | every Town Hall | [VIDEO-SOURCING.md](VIDEO-SOURCING.md) |

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

## Framework v2 — hard rules (2026-08-04, Faiz) · **PENDING DRY RUN**

Faiz's requirement: both decks run on **one solid framework**, and every rule below is a
**hard rule** — the generator must satisfy all of them before a deck is considered built.
Status: specified on this branch, **not yet merged to main**. A dry-run build against these
rules must pass and be reviewed before this section becomes binding (see Dry-run gate).

1. **Continuous improvement is always visible.** Every reported number carries its comparison:
   **week-on-week (WoW)** on the weekly deck, **month-on-month (MoM)** on the Town Hall and on
   the month-end weekly edition. A number without its comparison is a spec violation.
2. **Soft numbers are charts, not prose.** Trends and comparisons (views, engagement, followers,
   leads, output) render as proper visualisations — bar chart or equivalent — inline SVG, no
   external chart libraries (the self-contained-HTML invariant still applies). Single headline
   figures may stay as stat tiles; anything with a time axis or a comparison gets a chart.
3. **Month-end consolidation.** The weekly deck built on the **last Saturday of the month** is
   the monthly edition: same running order, but every section consolidates the month and
   compares MoM instead of WoW. The Town Hall then draws from that consolidated month.
4. **The spec is machine-followable.** Each deck spec keeps a `## Generation rules` section
   written as explicit, checkable statements — the fixed set of rules the generator reads
   before building. Prose explains; the rules section governs.
5. **Dry-run gate.** Before this framework (or any future format change) merges to main:
   build a **dry run** of the deck to a scratch report row (never the live row), review it
   against the rules, and only then merge the spec and switch the live build over.
6. **Purpose · Values · Vision footer** (Faiz, 2026-08-04). Every slide of **both decks**
   carries the PVV footer strip, bottom-centre, muted:
   *"Symbol of Inspiration. Empowering Growth. Powered by People. · G U I D E · Vision 2035"*.
   It shares the bottom edge with the brandmark (left) and the version stamp (right) — the
   three must never collide. Canonical wording and the full-render layout live in
   [TOWN-HALL-SLIDES.md](TOWN-HALL-SLIDES.md).

## The engineering loop (Faiz, 2026-08-04) · **PENDING DRY RUN**

Generation is not one shot — it is an orchestrated loop with a **non-human number vet**:

```
ORCHESTRATOR (scheduled)
   │ reads the spec (this folder) — running order, hard rules, registered definitions
   ▼
BUILD — iteration 1 of the deck, from governed sources only, to a scratch/staging row
   ▼
SLIDE WATCHDOG (cron, not a human)
   │ extracts every figure from the BUILT deck, recomputes each one from its
   │ registered source (Metric Registry rule → warehouse SQL), and compares
   ├─ all match → stamps a "numbers vetted" verdict into the report metadata
   └─ mismatch → diff report to the Tech/Manager Lark channel; deck is NOT promoted
   ▼
PROMOTE — only a vetted build becomes the live report row (the governed save path,
   which snapshots + stamps as usual)
   ▼
HUMANS — managers QC wording and judgement calls via the edit link, as today.
   The watchdog vets arithmetic; people vet meaning.
```

This extends a pattern **already running in production**: the *Metric Watchdog —
pre-weekly verification* (n8n `CI1wLjRA8U8PvIUX`, Sat 07:30 SGT) already does
schedule → SQL checks → change report → DM Faiz → **Record Verdict** — today against the
dashboard cache, before the weekly build. The slide watchdog is stage 2 of that same dog:
same skeleton, pointed at the built deck instead of the cache. A deck without a recorded
verdict is not presentable.

## The dry run (scope set by Faiz, 2026-08-04)

The dry run does **not** invent new decks. It takes the **existing** decks — the live August
Town Hall and the latest weekly — and rebuilds them under the v2 framework (footer, charts,
department nav, WoW/MoM everywhere, new town hall sections), with the same underlying data,
to **scratch rows production never reads**. Deliverables:

1. The v2 rebuild of each deck, side by side with the existing version.
2. A pass/fail sheet: every Framework-v2 hard rule, checked against the v2 build.
3. A first run of the slide-watchdog check against the v2 build — the loop above, exercised
   end to end on staging.

Improvement is judged against the existing deck, rule by rule. Only after Faiz signs off does
the spec merge to main and the live builders switch over.

## Where the parts live

- Generators and servers: n8n Cloud (workflow IDs in each spec).
- Storage: Portal Supabase, `public.reports`.
- Viewer + archive: staff portal (`koocester-academy` repo, `src/manager/`).
- Warehouse: Supabase project `wnerzolcmjrsktfqferw` (`content_perf.*`, `hubspot.*`, `xero.*`).
- People/credits: Lark Marketing & Delivery base `BG8PbaZFna1NQksNWkglTN85gSf`.
