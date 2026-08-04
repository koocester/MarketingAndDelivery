# Management weekly slides — format contract (v1)

Written **2026-08-04** from the live pipeline and the deck for week of 27 July 2026 (report id 38).
Read [README.md](README.md) first — this file is the input to the next build, and changes are
appended here before they are built.

> **Scope note.** This deck already existed and runs weekly. This file records the contract it
> is running to, so rebuilds stop re-deciding it. Sections marked *(verified)* were read from the
> live pipeline or the stored deck; anything not marked is a rule to confirm with Faiz before
> relying on it.

## 1. The meeting

- **Weekly**, built Saturday morning SGT, reviewed by managers over the weekend, used in the
  **Monday leadership meeting**.
- **Audience: management.** Unlike the Town Hall, finance and commercial detail belong here.

## 2. Saturday build chain *(verified)*

| Time (SGT) | What | Workflow |
|---|---|---|
| 07:00 | Team throughput snapshot for the week | `o4M9V8PYxRT4skvA` |
| 07:30 | Team impact leaderboard | `vyXc1pIXnQUNQKVx` |
| 07:30 | **Metric Watchdog** — verifies dashboard numbers against source, report-only, DMs Faiz | `CI1wLjRA8U8PvIUX` |
| 08:50 | Manager update to the Manager Updates Lark group: slides ready + QC ask + edit link | `bhBTXc9o47wQ2nVZ` |
| 09:00 | Slides link to Hakim | `STzSYqQAmqDflniT` |

The 08:50 message is deliberately blunt about AI: managers are told to QC the numbers before
Monday because AI-generated slides can be inaccurate, and are given the edit link to fix them
themselves. Keep that framing — it is what makes the QC loop work.

## 3. Data source and governance *(verified)*

- The deck reads the **dashboard's own snapshot**, `content_perf.command_cache`, written by
  "Koocester Command (live dashboard)" `ePDPNKpgKdz4SUMZ`. It does not recompute numbers
  independently — that is what keeps the deck and the dashboard from disagreeing.
- It then calls the **Metric Registry Guard** (`NUagDICPo979PHaO`) in **enforce mode**. Metrics
  that are not registry-approved for this surface are withheld, and the withholding is recorded
  in the report metadata (`unapproved_management_metrics_withheld`).
- The Metric Registry itself is the Lark table `tblSfp4fLYS02iRp` (base `BG8PbaZFna1NQksNWkglTN85gSf`):
  Metric · Status (Trusted / Approximate / Broken / Not measured) · Appears on · Exact rule ·
  Known issue · Source · Keyed on · Window · Last verified.
- **Rule: for any reporting-number question, check the Metric Registry first**, then the source
  it names. Do not re-derive a number from a fresh query and assume it is right.

Underlying sources behind the cache: Metricool (`content_perf.*`), HubSpot (`hubspot.*`),
Xero (`xero.*`), Lark M&D base, Aspire (`finance.aspire_*`).

## 4. Running order *(verified — week of 27 July 2026, 28 slides)*

Same sequence every week; only the numbers change.

| # | Slide |
|---|---|
| 1 | Week of <date> — cover, with the week's framing line |
| 2 | How to read this deck |
| 3 | Governed scoreboard |
| 4 | Sales |
| 5 | Where the open deals actually sit |
| 6 | Client Success — the project book |
| 7 | Producers |
| 8 | Copywriters |
| 9 | Content strategists |
| 10 | Video editors |
| 11 | Social media |
| 12 | Where every video is sitting right now |
| 13 | Marketing — all roles at a glance |
| 14 | Engagement, posts and views — week over week |
| 15 | Closing the gap to target |
| 16 | Audience growth |
| 17 | Top 5 videos — Singapore |
| 18 | Top 5 videos — Malaysia |
| 19 | Top 5 videos — Indonesia |
| 20 | Communities |
| 21 | Events |
| 22 | Per-video lead attribution |
| 23 | The numbers now reconcile |
| 24 | The plumbing is stable |
| 25 | Next week's build |
| 26 | What needs attention |
| 27 | Finance |
| 28 | Who we invoiced last week |

Shape of it: **scoreboard → commercial → delivery by role → marketing performance → per-market
content → community/events → attribution and data health → what's next → finance.**

Per-market content gets its own slide per country (17–19) for the same reason the Town Hall has a
per-market recognition slide: one pooled ranking would be dominated by Indonesia and would make
Singapore and Malaysia invisible.

## 5. Weekly fact pack *(verified)*

The generator's `Weekly Facts` query builds a single JSON fact pack. Week boundary is
`date_trunc('week', now() AT TIME ZONE 'Asia/Singapore' - interval '1 day')` — i.e. the week
being reported is the one that just closed, in SGT.

Contents: current vs prior week posts/views/engagement · per-country posts, views, engagement and
top 5 videos · followers per platform now vs prior snapshot · team throughput per role (output,
active, roster) plus prior week · top 3 people per role · leads this week vs prior
(excluding `tech+%@koocester.com`) · invoiced and collected cash this week vs prior · top clients
by invoice · deals created, deals won and won value · open pipeline by stage.

Engagement averages exclude rows with `engagement_rate >= 100` (bad data guard). Keep that guard.

## 6. Rendering contract *(verified structure)*

- Stored deck is self-contained HTML: **28 `<section class="slide" data-slide=...>`**, one `<h1>`
  per slide as the slide title, `<article>` blocks for the content units (70 in the July build).
- `metadata.presentation_format = "Koocester Academy"`, `metadata.contract = "meeting_fact_pack.v1"`.
- Brand rules from [README.md](README.md) apply: maroon `#C02025`, mono for numbers, no external assets.

> The weekly deck's CSS is **not** the same skeleton as the Town Hall deck (it does not use the
> `--maroon` custom-property sheet). Before restyling either deck to match the other, get an
> explicit instruction and record it here — they are allowed to differ.

## 7. Storage, serving, editing *(verified)*

- **Storage:** `public.reports`, `kind='weekly'`, one **immutable** row per week
  (`metadata.immutable`), with `reporting_week_start` / `reporting_week_end`, `reporting_window`,
  `display_title`, `jarvis_intake_ids`, `leadership_items`, `townhall_items`.
- **Serving:** n8n `t9ZZ7sk9hyWEKNdR` "Management Weekly Slides (served)", webhook path
  `mgmt-slides`, basic auth "Command Dashboard Login"; portal at
  `staffacademy.koocester.com/manager/weekly/`.
- **Editing:** `Eqmd0mEmyxkuPGxL` "Weekly Slides — Manager Edit", edit link
  `/webhook/slides-edit-k8w2`. Manager types their name, edits in place, saves; the edit
  **updates the live weekly report in place** and the editor's name is stored on the change so
  they own that correction. A pre-edit snapshot is written as `kind='weekly_manager_edit'`.
  - **Caution:** because the edit path writes to the live report, a test run mutates the real
    deck. Use a scratch row when testing.
  - `reports_kind_check` must allow `weekly_manager_edit` (fixed 2026-07-31).

## 8. Two intake lanes into the weekly report

- `leadership_items` — items raised through Jarvis during the week, for the Monday meeting.
- `townhall_items` — the subset explicitly cleared as **all-staff-safe**, which is what the
  governed Town Hall cascade reads.

> **Open gap (2026-08-04).** No workflow and no named human performs the clearance step, so
> `townhall_items` has been empty on every weekly report ever closed. Until an owner exists, the
> governed cascade produces an empty deck and the Town Hall is built directly (see the Town Hall
> spec). Assigning that owner is the fix.

## 9. Weekly build checklist

1. Confirm the Saturday chain ran (throughput → leaderboard → watchdog → build).
2. Read the Metric Watchdog output before trusting the deck.
3. Verify the fact pack's week boundary matches the week you intend to report.
4. Build to the running order in §4 — same sections, new numbers.
5. Confirm the Registry Guard ran in enforce mode and check what it withheld.
6. Confirm the manager update went out at 08:50 with the QC ask and the edit link.
7. Monday: check whether managers edited anything, and who.

## v2 requirements (2026-08-04, Faiz) · **PENDING DRY RUN — not yet built**

Hard rules once the dry run passes (see README, Framework v2):

1. **Department navigation.** Fixed buttons at the **top-left** of the deck — **Sales ·
   Marketing · Finance · HR · Tech** — each jumping to that department's slides. The deck
   becomes one consolidated report you can enter by department instead of only paging through.
   The running order in §4 already groups by department; the nav indexes those groups.
   (Same self-contained rule: plain anchors/JS in the deck, no external assets.)
2. **Month-end consolidated edition.** The deck built on the **last Saturday of the month**
   reports the **month, not the week**: same running order, every section consolidates the
   month's numbers and compares **MoM**. All other weeks compare **WoW**. The Town Hall then
   draws its recap from that month-end edition — one number set, two audiences.
3. **Charts for soft numbers.** Week-over-week / month-over-month series (engagement, posts,
   views, followers, leads, output per role) render as bar charts or equivalent inline SVG —
   not sentences, not bare tables. Stat tiles stay for single headline figures.
4. **WoW / MoM on every number.** A figure without its comparison is a spec violation.

### Generation rules (machine-followable — the fixed set the generator reads)

- `edition = (last Saturday of month) ? "monthly" : "weekly"`
- `comparison_window = monthly ? prior month : prior week` — applied to **every** metric.
- Render: series/comparison → inline-SVG chart; single figure → stat tile; list → ranked rows.
- Department nav: Sales, Marketing, Finance, HR, Tech → anchor links to those slide groups,
  top-left, present on every slide.
- All numbers come from `command_cache` + Metric Registry enforce (§3). No fresh ad-hoc queries
  at build time.
- Build target for any dry run: a **scratch report row**, never the live `kind='weekly'` row.

## Change log

| Date | Who asked | Change |
|---|---|---|
| 2026-07-31 | Faiz | Manager edit MVP: managers edit the live deck in place, name required, name stored on the change. |
| 2026-08-04 | Faiz | Contract written down so weekly rebuilds follow a fixed format and only refresh numbers. |
