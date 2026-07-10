# Lark — Native Base Dashboards

Built **inside** the Lark M&D base. **Lark Base dashboards have no API** — they are UI-only to build and edit (computer-use / manual). They read the base live.

## Dashboards
- **⚠️ Ops Health & Bottlenecks** — an isolated dashboard (built new to avoid touching the live per-market ones) with alert tiles for the backlog/gap numbers: videos & projects Not Started, finished-but-unposted videos & carousels (Ready to Upload), and missing-objective data gaps. Tiles are "Number of records" metric blocks, each with one filter.
- **Main + per-market dashboards** (Regional / SG / MY / ID) — "Videos by Stage" distribution (the funnel), active workload by Producer/Editor/Copywriter, vertical + country donuts, publish-queue tiles, uploads-over-time.

## Where each intelligence lives (decision)
- **Pipeline health / bottlenecks / "where is it stuck"** → **Lark** (the data lives here). Stage-count/funnel views already exist on the per-market + Ops Health dashboards.
- **Content performance / lead-gen feedback** (views, leads per piece) → **Supabase + Metabase** (see [../../docs/08-metabase-setup.md](../../docs/08-metabase-setup.md)).
- **Sankey flow diagram is NOT possible in Lark** (no such chart type). The "where does it bulge/narrow" insight is covered by the stage bars + an aging view; a true node/Sankey visual needs Metabase or a custom app.

## Build notes (from prior computer-use builds)
- No dashboard API → every tile is placed by hand. Duplicate a same-source tile via ⋯ → Duplicate → Copy To This Dashboard.
- Chart filters are single-value per condition (AND multiple conditions); no date-bucketing in charts (daily granularity only).
- The filter popover **discards** unsaved rows if you click the canvas — close via the **Filter** button.

## Parked build
A set of **"Stuck / aging" grid views** (grouped by stage, sorted by Overdue/age, filtered active-only) — robust, API-buildable, and non-overlapping with the existing charts. **Parked** pending go-ahead. See [../../docs/discovery/work-log.md](../../docs/discovery/work-log.md).
