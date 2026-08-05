# Weekly slides — department stats handoff (for the session building Weekly v2)

Written **2026-08-05**. Faiz's instruction: the department numbers now proven for the Town Hall
must also appear in the **Weekly Management slides**, inside the department-segmented views
(Sales · Marketing · Finance · HR · Tech nav). Where a number is not yet wired, the slide shows
it with a **"currently being worked on"** tag rather than omitting the section.

Read first: [WEEKLY-MANAGEMENT-SLIDES.md](WEEKLY-MANAGEMENT-SLIDES.md) (the contract, incl. the
v2 requirements + generation rules) and [README.md](README.md) (framework + engineering loop).
**All work is dry-run only, staged to scratch rows; nothing touches the live weekly, main, or
production workflows without Faiz's explicit approval.**

---

## 1. Numbers that are READY — wire them in

### Finance (already native to the weekly — keep, and add MoM on the month-end edition)
- The weekly fact pack already computes `cash_inv` / `cash_coll` (Xero) per week.
- Registry row for the monthly variant: **"Finance dept stat — cash collected (month)"**
  (`recvrpuloU1psN`, Trusted). Exact rule in the row. Month-end edition uses the month window.
- Jul 2026 reference: collected S$107,001 (Jun 96,100, +11%) · invoiced S$85,901 (Jun 86,983).

### HR (NEW — the weekly deck has NO HR section today; this is its content)
- Registry row: **"HR dept stat — hiring funnel (month)"** (`recvrpysnZYlxO`, **Approximate**).
- Source: Lark HR base `KQp7bmn5WaztcZsILUalm4bjgOf`
  - **Hiring Pipeline** `tblKpRZ34y7DkYcd` — field `Interview Status`
    (Fail / Pass - Screening / Pass - Who Interview / Pass - Reference / Qualify for Interview /
    Pending to Hire / Hired). **Application date = record `created_time`** (request
    `automatic_fields: true` in the search call — there is no explicit applied-on field).
  - **Employee Data** `tbletkzlOHyUIzOX` — `Contract Start Date` for joins.
  - **HARD PRIVACY RULE:** fetch only name / status / dates. This base holds salary, IC and
    bank columns — never select them.
- Weekly numbers: same rules on the Sun→Sat week window (see §3). Monthly on month-end.
- Jul 2026 reference: 1 new applicant (unprocessed) · 5 in pipeline (all stale from May–Jun) ·
  0 hired in Jul (3 in May–Jun) · 4 contracts started.
- **Until the two confirmations below land, render HR numbers with the
  "currently being worked on" tag** (Approximate status):
  1. Confirm with HR (Bhavani) that record `created_time` ≈ application date.
  2. Confirm whether `Contract Start Date` is a RENEWAL date or first joining —
     Audrey/Wendi/Esther/Jaydon show 6 Jul starts despite months of prior output.
  When confirmed, flip registry row to Trusted and drop the tag.

## 2. Numbers still MISSING — obtain them (this is the ask)

| Dept | Status | What to do |
|---|---|---|
| **Tech** | no stat defined | Propose to Faiz (candidates: n8n workflows shipped/active, executions used vs quota, watchdog verdicts passed, incidents). Whatever he picks: registry row first, then slide. |
| **Admin / Ops** | no stat defined | Propose to Faiz (candidates: claims processed, events run, devices deployed — Device Owner Tracker `tblm17RQmNvE2Fbw` exists in the HR base). Registry row first, then slide. |

Until defined, their department views show the section header with
**"currently being worked on — stat not yet defined"**. Never invent a number.

## 3. Reminders that bind this work (from the main contract)

- **Week window = Sunday → Saturday SGT** (HubSpot convention) — the fix to the current
  Monday-based `date_trunc('week', …)` is part of the Weekly v2 task. Friday must stop being
  cut off.
- Every figure needs its comparison (WoW; MoM on the month-end edition) — charts per the v4 UI
  language, not bare numbers.
- Any new metric appears on a slide **only after** its Metric Registry row exists.
- Dry-run staging: POST `/webhook/dryrun-stage-x7q3` (workflow `9MO1cYmHZ2ZidbIf`), review at
  `koocester-dryrun.pages.dev` (Cloudflare Pages project `koocester-dryrun`, deploy with
  wrangler from the scratchpad `dryrun-site` folder — account `c0f219bfdf73a474abb1c5de3a2d5586`).

## Change log

| Date | Who | Change |
|---|---|---|
| 2026-08-05 | Faiz | HR + Finance numbers proven on the Town Hall must flow into the weekly department views; missing stats marked "currently being worked on"; Tech + Admin/Ops stats still to be defined. |
