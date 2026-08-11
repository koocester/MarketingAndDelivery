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

---

## Saturday 8 Aug — what actually happens, verified 2026-08-07

**The chain, in order.** 07:00 Team Throughput Snapshot (`o4M9V8PYxRT4skvA`, cron `0 7 * * 6`) →
07:30 Metric Watchdog (`CI1wLjRA8U8PvIUX`) → **08:45 Portal Report Archiver (`db8jcaHxVUWmYOPT`,
cron `45 8 * * 6`) fetches `/webhook/mgmt-slides` and INSERTs the deck into `public.reports`** →
08:50 Manager Updates (`bhBTXc9o47wQ2nVZ`) → 09:00 Weekly Slides → Hakim (`STzSYqQAmqDflniT`).

**The archive step is real and proven**, not theoretical: report id 38 was inserted 2026-08-01
08:45 SGT by exactly this path. The insert is `ON CONFLICT (kind, dated) DO NOTHING` — immutable,
first write wins. Confirmed no row exists for `dated = 2026-08-02`, so tomorrow's insert is unblocked.

### Defect found and fixed: the archiver was still on Monday–Friday
`Prep Weekly` computed its week keys with an ISO-Monday anchor and no −2d offset — it was never
updated when the week boundary moved to Sun→Sat on 5 Aug. It would have filed tomorrow's deck as
**"Week of 3 August 2026 · 3–7 August 2026", `dated=2026-08-03`, window "Monday–Friday"**, wrapping
a deck whose own title reads "Week of 2 August 2026 · 2–8 August 2026". The portal list and the deck
contents would have disagreed on which week it was.

Now uses the identical anchor as Build Deck (`now +8h − 2 days`, Sunday of that week). Verified by
simulation at Sat 8 Aug 08:45 SGT: title `Week of 2 August 2026 · 2–8 August 2026`,
`dated=2026-08-02`, end `2026-08-08` — byte-identical to the deck title. `Upsert Weekly` metadata
updated to match (`reporting_week_end` = +6 not +4, window `Sunday–Saturday`).

This is the same class of drift as Leadership Meeting Intake's `reporting_monday`, which is a
SEPARATE and still-unfixed instance. One-off artifact: report 38 stays keyed `2026-07-27` under the
old Mon–Fri scheme; it is immutable and not worth rewriting. The new scheme starts at `2026-08-02`.

### Month-end monthly edition — NOT built
Faiz's Option B (the first Saturday build of a new month reports the just-closed calendar month
MoM) is **not implemented anywhere in the weekly chain**. Build Deck has no monthly branch, the
Weekly Facts SQL has no MoM keys, and V5 Transform has none. The archiver's "Month-end 6pm SGT"
trigger feeds Fetch/Upsert **Townhall** only — that is the Town Hall deck, a different workstream.
First firing of the weekly monthly edition would be **Sat 5 Sep 2026**. Roughly four weeks to build it.

### Still needs a human to type the numbers
- **Events economics** (Hakim) — Marketing Budget / Expected Revenue / Marketing Efforts fields exist
  on `tblA7Ick2xpH4T5H`; entry is manual. Actual Revenue existed already.
- **Vertical + Market per invoiced client** (Hakim) — `tbl3gOPoHuZBFayg` dropdowns; 76 of 283 already
  filled on Clients & Vendor and should be auto-copied rather than retyped.
- **ManyChat API key** (Faiz) — into an n8n Header-Auth credential, or the call to drop ManyChat health.
- **Storyboard "done" definition** (Hakim) — so its NOW() stamp can be wired like QC Passed At.
- **Application-date confirmation** (Bhavani) — flips HR row `recvrpysnZYlxO` to Trusted and drops the ≈ tag.

Not manual, but still missing: **Strategist output**. QC Passed At has been stamping since 6 Aug, but
the throughput job does not count it, so that row still reads "not measured". Next wiring job.

---

## Strategist output is now measured — wired 2026-08-11, TEAM TOTAL (Faiz's call)

Item 8 on this checklist and item 6 of the 8 Aug audit are now closed.

**Why it said "not measured" before.** Three separate hardcodes, not one:
1. `Compute Throughput` carried `NO_OUT={Strategists:1}`, forcing output to 0.
2. `Build Deck`'s strategists `mktDept({... measured:false ...})` printed the literal string.
3. `Build Deck`'s marketing-summary special-cased `isStrat` to 'not measured' and '—'.

The data existed the whole time — the 8 Aug build carried `v5.qcWk = 8` unused. But 8 was a
**partial** figure: stamping only began 5 Aug, so Sun 2 – Tue 4 Aug had no QC records at all.
Publishing it would have read as a bad week when the instrument simply did not exist yet, so
"not measured" was the correct output for that week.

**What changed.** Reported as a **team total, no individual credit** — the QC Passed At stamp
records *when* a video passed, not *who* passed it, so per-person attribution would be an inference.
- `Compute Throughput` fetches `QC Passed At`, counts stamps inside the week, and emits ONE row
  `role=Strategists, person='(team)', metric='qc passed'`. Individual strategist rows stay at 0.
- `Weekly Facts` excludes `person = '(team)'` from the per-person credit list, so the synthetic row
  can never surface as a name chip.
- `mktDept` now falls back to 'not measured' when `teamNow(role)` is **null** — a missing row still
  reads honestly instead of printing a fabricated zero.
- marketing-summary shows the number with **"team total"** in the who-did-the-work column.
- Registry `recvpPy7jVCuh0` flipped **Not measured → Trusted**, rule records the team-total decision,
  the (team) row mechanism, and that weeks before 9 Aug are partial and must not be compared against.
- Guard manifest now declares it: **23 metrics**, up from 22 (and 9 before the 8 Aug work).

**Verified live.** Throughput re-run wrote `(team) = 22, metric 'qc passed'` for week 2026-08-09 with
both named strategists at 0. Deck rebuild: strategists slide reads **"Approved through QC last week:
22"**, marketing-summary reads "Strategists — approved through QC · 22 · team total", no `(team)`
string anywhere in the html, and the guard passed in enforce mode with the new Trusted metric.

No week-over-week pill is shown for this metric yet: the prior week sums to 0 because the instrument
was not running, and a "▲ +22" against that would be meaningless. It appears from the week of 16 Aug.

**Note on slide count.** The rebuild produced **29 slides, not 30** — the current week has posts in
Singapore and Indonesia but not Malaysia, so that country slide is absent and the timing manifest
rebalanced to 5400s on its own. That is the value-agnostic design working, not a regression.
The week beginning 9 Aug closes Saturday 15 Aug and is the first fully measured strategist week.

---

## Copywriters slide — mislabelled tile hid a 289-carousel backlog (fixed 2026-08-11)

Faiz flagged that "Not started 59" looked far too low and that "7 posted last week" did not tally.
Two separate things, only one of them a bug.

### The bug: the tile was showing the wrong bucket
`Koocester Command (live dashboard)` → Compute node builds two things:
```
carousel:[['Pending',cPend],['Copywriting',cCw],['Amendments',cAmend],['Final approval',cFinal],['Ready',cReady]]
carousel_reservoir: cNS
```
where `cPend = cC('Carousel Stage','Pending Copywriting')` and `cNS = cC('Carousel Stage','Not Started')`.

Build Deck rendered `carouselVal('Pending')` under the label **"Not started"**. So the tile was
showing the **Pending Copywriting** count, while the genuine Not Started backlog sat in
`carousel_reservoir` and was **never rendered anywhere on the deck**.

Counted live against Lark (all 659 carousel records, not a 500-row first page):

| Carousel Stage | true count | deck showed |
|---|---|---|
| Not Started | **289** | not rendered at all |
| Pending Copywriting | **66** | 59, labelled "Not started" |
| Copywriting | **0** | 0 ✓ |
| Final Approval (Head Copywriter/Client) | **7** | 7 ✓ |
| Ready to Upload | 91 | not on this slide |

(59 vs 66 is snapshot age, not a second bug.)

**Fix.** The tile is now labelled **"Pending copywriting"** for what it actually counts, and the
reservoir is surfaced as its own tile, **"Unstarted shells — 289 · generated backlog not yet in
copywriting"**. Verified on rebuild: 66 / 0 / 7 / 289, matching Lark exactly.

The reservoir is deliberately excluded from *active* work by the dashboard
(`active = stage not terminal && stage !== 'Not Started'`) because these are auto-generated shells
from the Monthly Content Engine. That exclusion is fine — hiding the number entirely was not.

### Not a bug: "7 posted last week"
True count for week 2–8 Aug is **9** (Ratnasari 5, Farrel 2, Aisha 2 — all three are active
Copywriters in the HR base, so the HR role gate dropped nobody, and every one had a Copywriter set,
so `if(!p)return` dropped nobody either).

Pulling `last_modified_time` on all nine shows exactly **two records were edited 2026-08-11 at
10:38 and 10:39 SGT** — after the Saturday build *and* after the Monday 06:00 re-run. At the moment
of every snapshot, 7 was correct. The number moved because carousels were back-dated two days later.

This is the third instance of the same pattern (HubSpot contacts settling after build, throughput
missing Saturday, carousels back-dated). The weekly figure is never final at build time. Worth a
decision on whether the immutable archive should be written later than the Saturday send.

---

## Planning split (paid vs internal) + editors by name — added 2026-08-11

Both requested by Faiz off the live deck.

### Strategists: the 204 in planning is now segmented
**Paid vs internal follows `Client/Vendor`**, which is the signal the base itself already uses —
the Videos `Lead Time` formula reads `IF(COUNTA(Client/Vendor)>0, 48, 8)`, i.e. 48h approval for
client work and 8h for internal. Using the same field means the deck and the base agree on what
"paid" means rather than inventing a second definition.

Renders as two bars under the leading tiles: **Paid (client work) 160 · 78%** and
**Internal (our own content) 44 · 22%**, summing to the 204 tile above them.

### Video editors: queue and drafts broken down by name
Per-editor rows showing waiting / editing / drafts sent this week, sorted by drafts then queue.
Drafts are credited to `Draft Submitted By`, falling back to the assigned `Video Editor` — the same
attribution the throughput job uses, so the slide and the leaderboard cannot disagree.

### The reason both needed a second fix: two sources on one slide again
The new breakdowns come from the live Lark pass in V5 Facts; the tiles above them came from the
dashboard snapshot. The two fetches race **inside the same build**, so on first render the editors
slide showed "Waiting to edit 45" above rows summing to 44, and "Editing now 5" above rows summing
to 6. Same class of defect as the "7 deals still open" bug from the 8 Aug audit.

Both tiles are now **pinned to `v5.stages`**, the same pass that produces the rows, so tile and rows
are arithmetically identical by construction. Verified: waiting 44 = 9+5+19+1+0+9+1, editing 6 = six
editors at 1, drafts 9 = 3+3+1+1+1. Strategist tiles pinned the same way (QC queue 19, planning 204).

### Two notes for whoever edits this next
- Credit chips took initials from raw word starts, so `Maulana_Homes & Business` rendered as **"M&"**
  and `(unassigned)` as **"("**. Initials now strip punctuation and the underscore renders as a
  separator: **MH · Maulana · Homes & Business**, **U · (unassigned)**.
- When generating JS that contains a regex literal, use `new RegExp('...')`. A literal needs `\/`
  inside the patcher's own string, and `\/` collapses to `/` when that string is parsed, which
  silently produces `Invalid regular expression flags` at the syntax gate.

---

## Virality + two render bugs — 2026-08-11

### Virality per country, by platform and by vertical
**Definition: shares per 1,000 views.** Reach is the textbook denominator for virality, but for the
week it is populated on only **66 of 153 reels rows (43%)** while shares is **153 of 153**. A
reach-based rate would silently drop more than half the posts, so the metric uses the sharing
behaviour that actually pushes a post past its own followers. Stated on the slide itself.

Added to every country top-5 slide: bars for **virality by platform** and **virality by vertical**,
plus an overall line with the raw shares and views behind it. Live figures on first render —
Singapore overall 3.8/1k (Instagram 8.1, TikTok 7.4, Facebook 0.4; Business 5.9, Wealth 3.5,
Homes 0.9), Indonesia overall 2.5/1k. Computed in the Weekly Facts SQL so it follows the same
Sun–Sat window as everything else.

If reach coverage improves, switching the denominator is a one-line change in that aggregate — but
it needs a Metric Registry row first; this is currently an undeclared metric.

### Bug: the editor name column rendered blank
The by-editor table put the name chip in a `.t5pr` cell, and the `@media(max-width:850px)` rule
hides `.t5pg, .t5pr, .t5e`. At any viewport under 850px — which includes how the deck was being
viewed — the whole Editor column vanished while the three number columns stayed. Now uses `.t5t`.

### Bug: titles shipped the literal text `&quot;`
v1 renders table cells through `esc()`, so a title containing a real quote arrives as `&quot;`.
The podium rebuild then ran `esc()` over it again, turning `&` into `&amp;` and printing
`&quot;Namanya mobil itu jodoh-jodohan!&quot;` on the deck. Cells are now unescaped before being
re-escaped. Same fix applied to page and producer.

### Answered, no change needed
- **"Posts published 99" does not include carousels.** It counts distinct (title, publish date) in
  `content_perf.reels`, fed by the Metricool *Reels* syncs. Carousels and static posts land in a
  separate table, `content_perf.posts` (395 rows, SG only — the MY/ID carousel syncs are not built).
- **Why SMM "videos posted 36" is far below 99.** Different populations, not an error:
  36 = Lark video records with an Actual Upload Date inside the week and a named SMM;
  99 = distinct pieces Metricool observed published. For that week Lark now holds **41** such
  records (Talulla 30, Esther 11 — it was 36 at build, the rest back-dated later), against **107**
  distinct titles in Metricool. **So roughly 60 pieces went live with no matching Lark upload
  record.** That gap is real and worth a decision: either the pipeline is being bypassed, or upload
  dates are not being filled. The deck currently shows both numbers without reconciling them.

---

## Malaysia restored + top 5 by views per vertical — 2026-08-11

### Malaysia was silently dropping out of the deck
The country list came from `SELECT DISTINCT country FROM rk`, i.e. only markets that published
something that week. A market with nothing live lost its slide entirely, so the deck went from 30
slides to 29 and nobody could tell whether Malaysia had a bad week or had been removed.

The three markets are now **fixed** (`unnest(ARRAY['Singapore','Malaysia','Indonesia'])`). A market
with no posts keeps its slide and states it plainly: *"No videos went live in Malaysia this week —
the slide is kept so the gap is visible rather than the market quietly dropping out of the deck."*
Back to 30 slides, manifest still balances to 5400s.

### Top 5 by views per vertical, per country
New `vtop` aggregate in Weekly Facts, rendered under the existing per-platform blocks.

**Deduped by title and summed across platforms**, so a cross-posted video appears once with its real
combined total instead of three times with a third of its views each. Columns: rank, title,
platforms it ran on, watch link, total views, average engagement. The per-platform top 5 keeps its
own ranking and its producer chips — Faiz's earlier ruling to keep per-platform still stands, this
sits alongside it.

Verified against source for the week of 9 Aug: Singapore Business 1, Homes 1, Koocester 2, Wealth 2
(6 rows) and Indonesia Autos 2, Business 2 (4 rows) — matching the rendered slides exactly. The
counts are small only because that week was three days old at render time; a full week fills each
vertical closer to five.

### Note on slide length
Each country slide now carries up to 4 platform blocks + up to 5 vertical blocks + 2 virality bar
groups. On a full week that is a lot of vertical scroll on one slide. If it reads as too much in the
room, the natural split is a second slide per country (platforms on one, verticals + virality on the
next) — that is a layout decision, not a data one, and the timing manifest rebalances automatically.

### Every vertical now appears, published or not (Faiz, 11 Aug)

The first cut only rendered verticals that had posts that week, so a quiet vertical vanished the
same way Malaysia's whole slide had. Faiz set the expected shape: **SG 6 — Autos, Business, Foodie,
Homes, Koocester, Wealth** (Koocester is the main account, SG only); **MY and ID 5 each — Autos,
Business, Foodie, Homes, Wealth**.

Rather than hardcode that, the grid is derived from **every (country, page) pair that has ever
published** in `content_perf.reels`, LEFT JOINed to the week's top 5. Queried against source it
returns exactly SG 6 / MY 5 / ID 5, matching Faiz's spec — and a new page added later appears on
its own without a code change.

A vertical with nothing that week renders its header and the line *"Nothing published in this
vertical this week"*. A market with nothing at all (Malaysia this week) additionally carries the
callout at the top, then still lists all five verticals underneath.

Verified on rebuild: Singapore 6 verticals (2 empty), Malaysia 5 (5 empty), Indonesia 5 (3 empty),
30 slides, manifest 5400s.

---

## Per-video lead attribution is LIVE — 2026-08-11 (was the last ≈ placeholder)

I had left this as "≈ currently being worked on" on the grounds that there was no live feed. That
was too cautious: the data was already in the warehouse the whole time, in
`hubspot.contact.property_postcampaign`. Faiz asked for numbers by Saturday; they are in.

**How the join works.** Lead-magnet link codes come in two shapes. Per-video codes lead with the
video number — `0711_kb_ig`, `1790_kfmy_ig`, and one still carrying literal brackets,
`[0100_kbmy_ig]`. Client-campaign codes are words — `elixir_sg_koocesterbusiness`, `MRCA`,
`najahadmire_my`. The regex `^\[?[0-9]{3,4}[_-]` separates them, the leading digits resolve to
`VID-####`, and that joins `public.video_contributors` for country, vertical and producer.

**Live on the slide now** (all-time unless stated):

| | |
|---|---|
| Leads via tracked links | **265** |
| Traced to a specific video | **19** across 7 video links |
| Coded leads this week | 0 (the 9–15 Aug week was 3 days old at render) |

Per-video rows carry code, VID + vertical + country, producer chip, leads, leads this week and the
latest lead date — e.g. `0711_kb_ig · VID-0711 · Homes · Singapore · Sujinraj · 11 leads · 7 Aug`.
Campaign codes are listed underneath, explicitly **not** counted in the per-video figure, so the 265
and the 19 can never be confused for each other.

**Hygiene finding carried onto the slide:** one live link still writes literal brackets
(`[0100_kbmy_ig]`), and that video is the only one that fails to resolve to a vertical/producer —
the brackets are in the stored code. Fix the link builder and it will join like the rest.

A video appears only once its link has produced a lead, so an empty table would mean the link
builder has stopped writing codes — that is now the failure signal, not a placeholder.

---

## Ops breakdowns + an accuracy audit of the questioned numbers — 2026-08-11

Faiz questioned several figures. Checked every one against Lark for **week 2–8 Aug**, the week the
deck he was reading covered.

| Figure | Deck said | Source says | Verdict |
|---|---|---|---|
| Shoots done last week | 6 | **6** | **accurate** |
| Shoots booked ahead | 23 | 64 at Ready to Shoot, **3 with a shoot date already past** | **label was wrong** |
| Carousels posted last week | 7 | **9** | correct at build, 2 back-dated after |
| Carousels Not Started | 289 | **288** | accurate (drift of 1) |
| SMM uploaded | 36 | **40** | correct at build, back-dated after |
| SMM intended | 99 | **47** | **volatile — intended dates get rewritten wholesale** |

### "Shoots booked ahead" was never true
It rendered the **Ready to Shoot stage count**, which includes shoots whose date has already passed —
3 of them. Nothing about it was "ahead". Retitled **"At Ready to Shoot"** with a sub-line reading
*"N already past their shoot date"*, so the overdue tail is visible instead of being folded into a
forward-looking number.

### Shoots by page, organic split out
Organic is the **Organic Video tick on the record**, not an inference. For 2–8 Aug: 6 shoots, **0
organic**, all 6 with a guest — KOOCESTER (Main) 2, Business SG 2, Foodie SG 1, Wealth SG 1.

### SMM: intended vs uploaded, by page
New table on the SMM slide — page, intended, uploaded, and the gap, coloured red when the plan was
missed and green when backlog was cleared. This is what makes the volatile "intended" figure legible:
the total moves because intended dates are rewritten, but the per-page gap shows where.

### Strategists: storyboards and approvals
- **Storyboard uploaded: 3 of 205 videos in Planning — 1%.** The storyboard is the
  `Storyboard (Lark Doc)` link; a video in Planning without one has nothing for the producer to
  shoot against. This is the starkest number found in the whole audit.
- **Waiting at Approval 67** (Head of Growth gate) and **Final approval 29** (marketing/client).

### Still open
- **Top 5 "by pages" layout.** Grouping is already effectively per page — each country slide groups
  by vertical, and page = vertical x country. So "doesn't look good" reads as a layout problem, not
  a grouping one, and the country slides are now very long (4 platform blocks + 5–6 vertical blocks
  + 2 virality groups + attribution). The fix is splitting each country across two slides, which is
  a presentation decision, not a data one. Not actioned pending Faiz's call.
- **Back-dating** now confirmed on carousels, video uploads and HubSpot contacts. Every weekly figure
  is provisional at Saturday build time. Unresolved: whether the immutable archive should be written
  later than the Saturday send.
