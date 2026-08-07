# Weekly deck v5 — Faiz's review checklist (living document)

Updated 2026-08-06 (evening). ✅ done · 🟡 partly done / waiting on someone · ❌ not built yet.
Dry run: https://koocester-dryrun.pages.dev/weekly

| # | Ask | Status | Where it stands |
|---|---|---|---|
| 1 | PVV (values·purpose·vision) at the beginning | ✅ | Slide 2, canonical wording, live in dry run |
| 2 | Leads counted from the enquiry form only | ✅ | 4 form GUIDs registered (`recvrtS7yu4kfR`, Trusted); headline "Enquiries in: 30 vs 49"; 780 total fills demoted to context |
| 3 | Client Success progress bars + AI analysis | 🟡 | Rule rendered + **per-project bars now live** (137 in-flight projects, first 12 shown, On-Hold amber). AI concerns block lands with the generator |
| 4 | Sales: revenue to date + cash collected | ✅ | S$975,436 invoiced · S$866,753 collected (Xero 2026 YTD) on the Sales slide |
| 5 | Per-person sales leading/lagging (Sarah…) | ❌ | Generator build; data ready via HubSpot deal owners |
| 6 | Producers: shoots next week + done + per-video results loop | ❌ | Generator build; Shoot Date + warehouse views exist |
| 7 | Copywriters closed loop (results of last weeks' carousels) | ❌ | Blocked on the carousel results sync (approved, next build) |
| 8 | Strategists: storyboards done/planned + patterns | 🟡 | Stamping VERIFIED in production (2 videos stamped 6 Aug); slide wiring with generator |
| 9 | Editors: this/next week schedule + results + credits | ❌ | Generator build; Lark stages + warehouse views exist |
| 10 | SMM: on-time posting, planned vs uploaded, ManyChat health | 🟡 | **Upload discipline live on the SMM slide**: intended 249 · uploaded 42 · on-time 39 · missed/late 210 · next week 100. ManyChat still blocked on API key |
| 11 | Marketing funnel: leads→converted→qualified→drop-off + actions | ✅ | **Funnel live on the closing-the-loop slide**: Enquiries 30 → Qualified 1 → Won 1 (converted = deal won, Faiz 6 Aug); drop-offs shown; actions-analysis with generator |
| 12 | Per-page engagement breakdown + 3.4→10 analysis + ≥5-week graphs | ❌ | Generator build; warehouse holds data since 2 Jan |
| 13 | "Why are top videos all Facebook?" | ✅ | They never were — FB just sorted first; sections now ordered by views; Faiz ruled: keep per-platform |
| 14 | Events: efforts, footfall vs target, revenue, budget | 🟡 | Fields created on the Events table (Budget/Expected Revenue/Efforts; Actual Revenue existed). **Waiting: Hakim fills per event** |
| 15 | Closing-the-loop slide before Events | ✅ | Moved; order is Sales→Marketing(→loop→events)→Finance→HR→Tech |
| 16 | Finance: revenue per page + graphs + focus | 🟡 | Client→Page Mapping table built, 249 clients pre-filled (`tbl3gOPoHuZBFayg`). **Waiting: Hakim sets Page+Market dropdowns**, then charts with generator |
| 17 | Tech roadmap + progress + maintenance | ✅ | **Roadmap slide live** (slide 29): 8 items with progress bars from real state + shipped-recently from the CR register |
| 18 | More analysis, make sure it's accurate | 🟡 | Watchdog vets every figure; analysis blocks (3.4→10, project concerns, funnel actions) are generator work |
| 19 | Rename Followers → "People inspired" | ✅ | Live, tagged to Vision 2035 · 1B annually |

**The gate for every ❌ and the generator half of every 🟡: Faiz's sign-off on the dry run.**
Waiting on people: Hakim (events fields · mapping dropdowns), Faiz (sign-off · ManyChat key or drop-it call), Bhavani (application-date answer — optional, else ≈ tag stays).

---

## Renderer port — DONE 2026-08-07 (night)

The v5 renderer now lives in the **V5 Transform** Code node of `t9ZZ7sk9hyWEKNdR`, ported from
`build_weekly_v4.py` + `build_weekly_v42.py`. It is still **preview-gated**: only the
`dryrun-v5-weekly-x9` webhook transforms; the live serve path passes v1 through untouched.
Flipping v5 live = delete the three guard lines under `// ---- preview guard` (Faiz's word only).

**Value-agnostic, not anchored.** The Python hard-coded report-38 numbers. The port takes every
figure from one of two places: parsed back out of the v1 markup it is rewriting (stage tables,
project statuses, role rows, client billing, top-5 rows) or read from `wf` / `v5` (enquiries, SQL,
YTD, watch URLs, HR funnel, in-flight projects, upload discipline, CR register). Nothing is typed in.

**Fails soft.** Each pass is independent; a broken pattern is recorded in `v5_meta.misses` and the
rest of the deck still renders, and the whole node is wrapped so any throw serves the v1 html.
A slide whose source table is genuinely absent (registry withheld it, or the 07:00 snapshot has not
run) is reported as `skipped_no_data` and its honest v1 callout is left alone — that is not an error.

**Verified end to end on the real chain**, 2026-08-07 04:12 UTC (execution 53918, 19s):
30 slides · manifest 5400s · DOM order == manifest order · `misses: []` · 7 charts · 48 podium rows ·
45 watch links · 42 bars · 18 credit chips. `skipped_no_data: [marketing-summary]` — correct, the
Saturday 07:00 throughput snapshot had not run yet; it carries a table from tomorrow.

Slide set and lanes are computed, not hard-coded: `top-*` slides expand to however many countries
Weekly Facts returns, the timing manifest is rebalanced to 5400s for whatever set results, and the
dept filter index sets are derived from the final order. A week with two countries will not break it.

### Deviations from the Python, and why
- **Avatars are initials.** The photo base64 lives on a local disk the node cannot read. Chips render
  initials until the `deck_assets` warehouse row exists. Faiz accepted initials for the first build.
- **Per-video attribution table is not printed.** The Python's rows came from a one-off manual HubSpot
  query. There is no live feed, so the section carries the ≈ tag and says so, rather than shipping a
  stale copy. The funnel above it *is* live.
- **Roadmap bars are a maintained constant in the node**; the "Shipped recently" list under them is
  read live from the CR register. Deriving bar progress from branch state is still phase 2.

### Two defects found and fixed during the live dry run
- **Negative drop-off.** Won (4) exceeded Qualified (3) because the three funnel stages are counted
  independently inside the week — a deal won this week can come from an enquiry raised weeks ago.
  It printed `qualified→won -33%`. Now an inverted stage prints `—` plus a line saying the three
  counts are not a cohort. Never print a negative drop-off.
- **Silently dropped project status.** The stage rule names five statuses; a `Cancelled` project
  existed, so the bars summed to 478 while the tile above said 479. Statuses outside the rule now
  render greyed and tagged "not in the rule", and the book-progress caption states the weighted base.

Staged for Faiz: https://koocester-dryrun.pages.dev/weekly-tomorrow (v5 skin, live data, this week).
The signed-off design contract at /weekly is untouched.

### v5 IS LIVE — flipped 2026-08-07 on Faiz's word

The preview guard is removed. The Saturday 8 Aug build and every build after it renders v5 on the
serve path. The try/catch remains: any error still serves the v1 html, so a bad week degrades to the
old skin rather than to no deck.

**The "withheld" tiles were never a data gap.** They come from `team_throughput`, written by
`o4M9V8PYxRT4skvA` (Team Throughput Snapshot) on cron `0 7 * * 6` — Saturday 07:00 SGT. It last ran
1 Aug; this week's row simply had not been written yet on Friday night. Its insert is
`ON CONFLICT (week_start,role,person) DO UPDATE` and Init Table clears the current week first, so it
is idempotent. Ran it early via `/webhook/team-snapshot` to populate the week: every withheld tile
resolved (deck now contains zero "withheld"), and tomorrow's 07:00 run overwrites the same row with
Saturday-morning numbers. Nothing to fix — the deck was simply being built before its source ran.

Numbers now live: carousels 5 (last wk 17) · first drafts 36 (48) · shoots 6 (9) · videos posted 14
(39). Strategists stays "not measured" — the QC-passed timestamp is stamping since 6 Aug but the
throughput job does not yet count it; that is the next wiring job, not a rendering gap.

**Third defect found and fixed:** the marketing-summary role rows matched the role key against the
row label, but v1 labels that row by what is counted — "Social media — videos posted" never contains
"SMM". That row lost its icon and all its credit chips. Matching is now on the wording
(`/social media|smm/`, `/producer/`, …) and an unmatched label reports itself in `misses`.
All five rows now carry the right icon and their people: Esther 11 · Talulla 3 on SMM.
