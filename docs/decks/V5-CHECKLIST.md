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

---

## Vertical becomes its own slide — restructured 2026-08-11 (Faiz's spec)

**One slide per vertical, three markets on it, top 3 videos under each.** Autos → Singapore /
Malaysia / Indonesia; then Homes → the same three; and so on. Country flags head each block.

The per-country **top 5 by platform** slides are unchanged — Faiz: *"the top five by platform rate
is okay"*. The per-vertical blocks that had briefly been added to those slides are removed, so the
same thing is not said twice.

Running order now: `… top-singapore top-malaysia top-indonesia | vert-autos vert-business
vert-foodie vert-homes vert-koocester vert-wealth | communities …` — **36 slides, manifest still
balances to 5400s** on its own, and the new slides join the Marketing filter lane.

A vertical only lists the markets that actually run it, so **Koocester (the SG-only main account)
shows Singapore alone** rather than two markets it never had. A market that published nothing shows
"Nothing published in <market> this week" rather than being dropped.

### Bug caught on first render: the same video listed twice
Autos ID, Business ID and Wealth SG each burned two of their three slots on one video. TikTok stores
the **whole caption** in `video_title` while Facebook/Instagram store a short title, so
`left(video_title,52)` was not the same string on both platforms and the rows never merged.

Grouping is now on the **normalised first four words**, which is stable across both, and the row
displays the *shortest* title in the group — the clean one, without the caption tail. The merge is
arithmetically verified: Autos ID 6,236 + 3,837 = **10,073**; Wealth SG 2,279 + 1,129 = **3,408**;
Business ID 441 + 272 = **713**. Each now shows once as Facebook/Instagram/TikTok with the real total.

Trade-off worth knowing: two genuinely different videos sharing their first four words would merge.
Given the alternative was duplicate entries eating the top 3, that is the better failure mode — but
if titles ever become templated ("Koocester Homes Episode ..."), this key needs revisiting.

---

## Sales slide — YTD and month, combined and by market (Faiz's 4 asks) 2026-08-11

| Ask | On the slide |
|---|---|
| 1 Total sales Jan → now, 3 markets combined | **S$1,030,270** |
| 2 Sales this month, combined **and per market** | **S$32,301** — SG S$32,301, MY —, ID — |
| 3 Closed won this month, combined **and per market** | **6** — SG 6, MY 0, ID 0 |
| 4 Total closed won Jan → now, combined | **167 deals** |

Plus a by-market table carrying month and YTD side by side, so a market that is quiet this month
still shows its year: Singapore 102 / S$848,598 · Malaysia 48 / S$174,508 · Indonesia 17 / S$7,164.

### Definition, stated because it matters
**"Sales" = the value of closed-won deals**, which is the measure that pairs with the close-won
counts in asks 3 and 4 and comes from the same source. It is deliberately **not** the Xero invoiced
figure already on this slide: YTD closed-won is **S$1,030,270** against Xero invoiced **S$975,436**.
Those are different measures and will never tie — the slide says so rather than leaving two
near-identical millions to be mistaken for each other.

### Country had to be inferred, and the slide admits it
`hubspot.deal` has no country. `property_business_unit` is **NULL on 178 of 192 deals** (only
media_sg 13, media_id 1), so it is unusable. `property_deal_currency_code` is populated on **188 of
192** — SGD 108 / MYR 60 / IDR 20 — so the market is taken from the deal currency and that is
printed on the slide. Values are summed in **home currency** so the three markets are comparable
rather than adding SGD to IDR. A row for deals with no currency set appears only if any exist.

Data quality is good where it counts: all **167** closed-won deals have both an amount in home
currency and a close date, so nothing is silently excluded.

**Upgrade path:** if Business Unit gets filled in on deals, switch the split to it and drop the
currency inference — one expression in the `sales` aggregate.

### Draft rendered on a complete week
Faiz asked to judge this on a full week rather than the 3-day-old current one. `render-lastweek.js`
takes a pristine backup, shifts the week anchor back 7 days, renders once, restores from the backup
in a `finally`, then re-fetches and compares to prove production is byte-identical. Verified twice.
The month/YTD sales figures are NOT shifted — they are always "now", which is what Saturday shows too.
Draft: https://koocester-dryrun.pages.dev/weekly-lastweek

### Sales add-on split onto its own slides (Faiz, 11 Aug)

Faiz confirmed **deals won is the headline**, and that the four sales asks were an *add-on* — so
they get their own slides rather than being packed onto the existing Sales slide, which was
starting to look nothing like the version before it.

Running order is now `sales -> sales-ytd -> sales-market -> sales-pipeline`, **38 slides**, manifest
still balancing to 5400s. Both new slides join the Sales filter lane.

- **Sales** — unchanged from before the add-on: pipeline, deals opened, enquiries, deals won,
  customers, contacts, and the Xero invoiced / collected tiles.
- **Sales — 2026 to date and this month** — the four headline figures, two per row so they read big.
- **Sales by market — month and year to date** — the country table on its own.

The Xero tiles deliberately stay on the main Sales slide: closed-won (S$1,030,270) and Xero invoiced
(S$975,436) are different measures, and separating them across slides makes it less likely they get
read as the same number twice.

---

## Live deck overwritten with the current build — 2026-08-17

Faiz: *"put live and overwrite"*. Done on the **live Staff Academy copy**, not the dry-run site.

Timing mattered: it is Monday 17 Aug, and the week anchor still resolves to **9–15 Aug** until
Tuesday, so the serve path naturally rendered the right week and no anchor shifting was needed.

- **Was:** report 99, archived Sat 15 Aug 08:45, 186KB, **36 slides**, none of the recent work.
- **Now:** report 100, 194KB, **38 slides**, verified to contain the sales-by-market slide, the six
  per-vertical slides, live per-video attribution and the virality blocks.

Same title and date key (`Week of 9 August 2026`, `dated=2026-08-09`), window Sunday–Saturday.
Written by the archiver itself rather than by hand, so metadata and the leadership-intake join
behave exactly as on a normal Saturday. The webhook was isolated to the weekly branch during the
run and the Townhall fan-out restored afterwards.

**Consequence worth recording:** report 99 held the Saturday 08:45 snapshot; report 100 holds the
same week measured on Monday evening. Figures that drift — closed-won, uploads, carousels, coded
leads — now read as of 17 Aug rather than 15 Aug. That is inherent to overwriting an archive and is
the same back-dating behaviour documented earlier in this file.

---

## Producer metric instrumented + tech/HR/finance batch — 2026-08-18

### The producer number was measuring the wrong thing
Faiz supplied `Producer_Production_9-15Aug2026.xlsx`. Its metric: *"video first entered the Editing
Queue (campaign) / Head-Editor Organic Approval (organic) within 9–15 Aug. Verified one-by-one via
record History."* Sheet total **16** (3 internal, 6 paid, 7 organic).

The deck was counting **Shoot Date in the week = 5**. Checked all 16 against the base:
**only 2 of the 16 have a Shoot Date in that window.** The deck's producer output was near-unrelated
to what the business counts as producer production.

What IS reproducible was verified exactly: classifying each of the 16 by
`Organic Video` tick → Organic, else `Client/Vendor` present → Paid, else Internal gives
**16/16 agreement** with the sheet, and Producer attribution is **16/16** too. Only the *date* was
missing — and no field in the 131 on the Videos table could supply it.

**Fix:** new field `Queued to Edit At` (`fldnff7CCb`) plus a poller,
**Producer Queue Stamp (every 15m)**, that stamps it the first time a video sits at Ready to Edit.
Never overwritten, so re-entry after amendments does not double-count.

First run stamped **1 record wrongly** — VID-0857, which entered the queue on 3 Aug and merely moved
*out* of Ready to Edit that morning. The rule had accepted any stage at-or-past Ready to Edit. Stamp
cleared, rule tightened to `stage === 'Ready to Edit'`, re-run confirmed **1,659 scanned, 0 stamped**.
Backlog is protected by a cutover timestamp, so historical records are never back-dated.

The metric therefore starts from **18 Aug**; the 9–15 Aug figures cannot be reproduced automatically
and the sheet remains the record for that week.

### Batch applied
- **Tech slide** now carries Entra ID and Windows 11 Pro onboarding, live from *Windows 11 Pro &
  Entra Onboarding*: Entra account **19/21**, device joined **14**, Pro activated **18**, and the
  outstanding names listed — Zainab (no Entra account), plus Mabdi, Thaddeus, Actorina, Bhavani,
  Mishkat and Zainab not yet device-joined; Bhavani and Zainab without Pro.
- **Phone/MDM enrolment is NOT tracked in Lark.** Neither the onboarding table nor the Device & Asset
  Tracker holds it (a filter for pending returned zero). The slide says so and names the outstanding
  set by hand. Adding an *MDM Enrolled* field to the Device & Asset Tracker makes it automatic.
- **CRs** now scoped to the deck week. **Zero CRs exist for 9–15 Aug** — the register's last entry is
  7 Aug, because the work in that period was never written up while notifications were held.
- **HR slide removed** entirely (data still being set up).
- **Finance** eyebrow flagged *"≈ not yet verified by finance"* pending Mishkat.

### Latent bug this batch exposed
The footer page-number rewrite used `/<strong>\d{2} \/ \d{2,}<\/strong>/` with **no anchor**, so it
replaced the *first* match on the slide. The new tech tile "19 / 21" matched that shape and was
rewritten to the slide number **"34 / 37"** — and because `String.replace` with a non-global regex
replaces once, that slide's real footer was then left un-numbered. Anchored to `</footer>`.
Verified: 37 footers, one per slide, none mis-numbered. Any tile shaped "NN / NN" was at risk.

### Not done in this batch
The editor-by-vertical table (Stanley 9 / Riza 6 / Marvels 6 / Rafli 5 / Maulana 5 / Mabdi 2 = 33,
with the category split, to be rendered in English) is still outstanding.

---

## Report 100 restated in place + metric definitions from Iman — 2026-08-18 (CR-20260818-01)

### HubSpot stopped reaching the warehouse on 9 Aug — every HubSpot figure in this deck was a false zero

Root cause of the attribution slide reading `0 / 0 / 0`. It was never a rendering bug:

| table | last `_fivetran_synced` |
|---|---|
| `hubspot.contact` | 2026-08-09 08:51 UTC |
| `hubspot.contact_form_submission` | 2026-08-09 08:51 UTC |
| `hubspot.deal` | 2026-08-08 20:51 UTC |

Report 100 covers 9–15 Aug, so the build only ever saw **day one** of its own week: 22 contacts in
the warehouse against **236** real form submissions. `enq_wk`, `sql_wk`, `won_wk` and the per-video
`wk` counter all resolved to zero and rendered as honest-looking zeros.

**This is not confined to the attribution slide.** Every HubSpot-derived number in report 100 is
understated — sales, scorecard, deals opened, deals won. Only the figures Faiz's lead-report export
could prove were restated; the rest still stand as built and are wrong.

Second-order lesson: the guard cannot catch this. A stale-but-present feed returns a valid number,
so the Metric Registry sees a real value and passes it. **A freshness assertion on
`max(_fivetran_synced)` per source table belongs at the entrance of the Saturday build**, alongside
the watchdog verdict gate.

`enq_wk` is also pinned to four hard-coded form GUIDs — Website Get Qualified Buyers, Business Growth
Form SG, GROW MY, MAJU ID. That is why "our forms" reads **28** for the week while all 30 active
forms carry **236**. The four are correct as a definition of *our* enquiries; the slide now shows
both lines so the gap is visible rather than implied.

### Producer metric — Iman's method, verbatim

Recorded as stated, because this is the definition the business is counting to and the automated
stamp (`Queued to Edit At`, from 18 Aug) has to reproduce it exactly:

> * Set Prompt Date: August 9–15
> * Internal Campaign & Paid Campaign: The duration is calculated from the first time the status
>   changes from Ready to Shoot to Ready to Edit. This is checked through the Project History.
> * Organic Content: The duration is calculated from the first time the Producer submits the form and
>   it enters Head Editor – Organic Approval.

Worked example supplied by Iman — VID-0848 (Rachel Ingrid Saidbun, Business ID). Its History shows
`Video Stage: Ready to Shoot → Ready to Edit` on **1 Aug**, outside the window, so the video is
**excluded** even though it was actively edited during 9–15 Aug (Ready to Edit → Editing on 13 Aug,
Editing → Strategist QC and First Draft Submitted on 13–14 Aug). This is the backlog-exclusion rule
working as intended and is the single clearest illustration of why the deck's Shoot-Date count of 5
and Iman's 16 were never going to tie.

### Editor metric — Iman's proposed benchmark, NOT yet adopted

> Suggestion for the Editor data: the benchmark for **First Draft Submitted** can be the first time
> the video stage changes from **"Editing" to "QC."** This timestamp can be used as the point when
> the first draft is considered completed and submitted for the QC process.

Iman confirms he still counts editors **by hand**. That matters, because the hand count and the
system disagree for 9–15 Aug:

| editor | hand count | deck `First Draft Submitted At` | Δ |
|---|---|---|---|
| Stanley | 9 | 11 | +2 |
| Ulysess Marvels | 6 | 8 | +2 |
| Riza Ismail | 6 | 6 | — |
| Rafli Fahrizal | 5 | 5 | — |
| Maulana | 5 | 5 | — |
| Mabdi Rizqi Rofi | 2 | 1 | −1 |
| **total** | **33** | **36** | **+3** |

Unreconciled. The likely cause is exactly what Iman's suggestion addresses: `First Draft Submitted At`
is a stamped field that can be written more than once (or late, by automation) whereas an
`Editing → Strategist QC` **transition** is a single unambiguous event in History. VID-0848 above
shows both landing in the same run, which is the agreeable case — the disagreement will be in the
records where they do not.

**Next step when this is picked up:** derive the transition timestamp for the week, compare against
`First Draft Submitted At` per editor, and expect the difference to explain Stanley +2 / Marvels +2 /
Mabdi −1 before changing the definition. Do not switch the deck to the new benchmark until that
reconciliation is done — swapping definitions mid-dispute would hide the discrepancy rather than
settle it.

### Pushed to report 100 (live, in place)

The v5 generator was deliberately **not** re-run: the serve path builds the *current* week, so
regenerating today would produce 16–22 Aug, not the meeting week. Edits were written straight to
`public.reports.html_content` for id 100. Original preserved in `public.reports_backup_20260818`.

- **Attribution (30/38)** — funnel restated from the lead-report export: all lead forms 236, our four
  business forms 28, Qualified and Won rendered `n/a` rather than 0 because the export cannot supply
  them. Top-10 form leaderboard added beside the per-video table. Per-video "this week" column
  removed — it cannot be counted past 9 Aug.
- **Editors (13/38)** — merged table now carries queue, drafts sent (36, system) and videos (33, hand
  count) side by side with the category split in English, plus a line naming the disagreement.
- **Producers (10/38)** — "Videos into production 16" tile added, by-producer table from the sheet
  (Aji 6, Fajrin 4, Amrel 3, Jordan 2, Thaddeus 1, Jaydon/Bestian/Al Hakim 0), Iman's method printed
  as the proofline. "Shoots done last week 5" kept alongside, explicitly labelled a different measure.
- **Tech (35/38)** — Entra 19/21, device joined 14/21, Pro activated 18/21, outstanding names listed,
  plus the six phones with no MDM stated by hand. Sarah confirmed **on a Mac** (18 Aug) — the Lark
  record still says "confirm Windows or Mac" and should be corrected at source.
- **Roadmap (37/38)** — CRs scoped to the week: **none raised 9–15 Aug**, last register entry is
  CR-20260807-01. The five most recent are listed under a heading that dates them honestly.
- **HR (34/38)** — banner: NOT REPORTABLE, data still being set up. Slide left in place rather than
  removed, because deleting it would renumber all 38 footers under meeting pressure.
- **Finance (32/38) and Client revenue (33/38)** — banner: NOT YET VERIFIED BY FINANCE, pending
  Mishkat.

### Carried debt from this batch

1. **Restore the HubSpot → warehouse sync.** Nothing else on this list matters as much.
2. **Freshness gate** on `max(_fivetran_synced)` before the Saturday build.
3. Report 100 is flagged `metadata.immutable = true` and was edited directly, bypassing the
   manager edit-and-sign flow. **No signed history and no `kooEditedBy` stamp exists for any of the
   above.** If in-place restatement is going to be normal, it needs to go through that flow.
4. The Saturday archiver (`db8jcaHxVUWmYOPT`) is the one job that could overwrite these edits.
5. No Lark post and no CR register row was written for CR-20260818-01 — notifications are still held
   at Faiz's instruction. The number is carried in this commit only.

### Correction — Shoot Date on the 16 is mostly absent, not mostly earlier

The note above ("only 2 of the 16 have a Shoot Date in that window") is true but materially
incomplete, and a slide was briefly published claiming the rest "were shot before this week."
**That claim was wrong and was not verified before it was written.** Checked against
`Shoot Date` (`fldIi1Lyjz`) on all 16:

| | count | detail |
|---|---|---|
| Shot inside 9–15 Aug | 2 | VID-2429 (10 Aug), VID-2470 (13 Aug) |
| Shot before the week | 3 | VID-0843 (27 Jul), VID-2458 (30 Jul), VID-2463 (5 Aug) |
| **No Shoot Date at all** | **11** | 7 organic + **4 campaign videos with the field blank** |

The 7 organic are correct by design — organic has no scheduled shoot, the producer submits
footage straight into Head-Editor approval. The **4 campaign videos (VID-0739, VID-0885,
VID-2061, VID-2464)** moved through to editing with `Shoot Date` never filled in.

Two consequences:

1. **"Shoots done this week" is a floor, not a count.** It selects on `Shoot Date` being in
   range, and the field is patchily populated, so the deck's 5 understates by an unknown amount.
   Any comparison drawn between it and the 16 is therefore soft on both sides.
2. **A blank `Shoot Date` silently disables the raw-footage SLA.** `Raw Upload Overdue (alert)`
   (`fldwatklM6`) returns empty when `Shoot Date` is blank, so those four videos could never have
   raised the 16h alert. This is a live gap in the alerting, not just a reporting one.
   `Shoot Date` should be mandatory on non-organic videos leaving Ready to Shoot.

### Limitation — 4 of the 16 rest on record creation date

Faiz's objection, confirmed: record creation is an admin artifact, not a production event.
A paid record is created when Sales closes the deal; an internal one about two weeks before the
month begins. The sheet counts four videos with the qualifier *"created in-window"* because they
had no prior stage history to read:

| VID | record created (SGT) | Shoot Date (SGT) | gap |
|---|---|---|---|
| VID-2458 | 10 Aug 17:44 | 30 Jul 11:30 | created 11 days **after** the shoot |
| VID-2463 | 12 Aug 13:22 | 5 Aug 15:30 | created 7 days **after** the shoot |
| VID-2464 | 12 Aug 17:28 | (none) | — |
| VID-2470 | 13 Aug 11:47 | 13 Aug 13:30 | created ~2h **before** the shoot |

Note the observed failure runs the *opposite* way to the one Faiz described: these were created
too **late**, not too early. Creation date is unreliable in both directions.

**The total of 16 still holds, but by luck rather than method** — each of those four records was
created inside the window, so its handover to editing cannot have happened before the record
existed. The method would break on the paid case: a deal closed in June, shot and handed over in
August, would be filed in June with nothing to catch it.

All four were created by the **"Finance" Lark user**, not by a producer or strategist — likely an
automation spawning video records off closed deals. If so, that is the exact mechanism behind the
objection and is worth tracing before anyone leans on creation date again.

**Not carried forward:** `Queued to Edit At` (from 18 Aug) stamps arrival at Ready to Edit and
never reads creation date, so this weakness is confined to the 9–15 Aug hand count.

**Process note:** the wrong claim reached a live slide because an illustration was written as if
it were evidence. Anything asserted on a slide about a specific set of records should be read out
of the base first, even when it seems to follow from arithmetic already done.

---

## Freshness gate — built 2026-08-18 (CR-20260818-02)

Fivetran was restored the same afternoon (account `Koocester_Group` moved to the **Free Plan**;
usage ~100k of 500k MAR, so no paid tier is needed). All three connectors were `Delayed` and did
**not** self-restart — a plan change resumes the *schedule*, not the backlog, so all three were
kicked manually. Backfill landed 05:26 UTC: contacts 7,906 → 8,164, week 9–15 Aug 22 → 230.

### Why the existing guard could never have caught this
The Metric Registry Guard asks whether a number is **approved**. It does not ask whether the data
behind it is **current**. A frozen feed returns a valid, in-range, unflagged number — `0` — and
sails through. That is the whole mechanism by which nine days of missing HubSpot data reached a
leadership meeting looking like a bad week.

### What was built
1. **`Weekly Facts`** (`t9ZZ7sk9hyWEKNdR`) gained a `freshness` key: `max(_fivetran_synced)` for
   `hubspot.contact` / `hubspot.deal` / `hubspot.contact_form_submission` / `xero.invoice` /
   `xero.payment`, plus `max(published_date)` for `content_perf.reels` and `max(snapshot_date)` for
   `content_perf.metricool_snapshots` (neither carries a sync column — these are proxies).
2. **`V5 Transform`** gained a pass before the ordering phase that compares each feed against the
   deck week and stamps a red **"DO NOT TRUST THESE NUMBERS"** banner under the `<h1>` of every
   slide fed by a stale source. `v5_meta.stale_sources` carries the machine-readable list.

**Behaviour is brand-not-halt** (Faiz's call, 18 Aug). A halt fails badly on a quiet Saturday —
nobody sees the alert and Monday has no deck at all. Branding degrades instead of failing: you
always get a deck, and a zero can no longer be mistaken for a real result.

### Two subtleties that took a second pass
- **A running week has no Saturday yet.** Judging a mid-week preview against a future Saturday
  flags *every* feed as stale. The comparison is `min(week's Saturday, now)`.
- **A quiet week is not a broken week.** `content_perf.reels` has no sync column, so freshness is
  inferred from the newest post — and nothing published Thu–Sat would read as stale. A **2-day
  grace** absorbs that without hiding a real outage, which is always days long.

### Verified against three scenarios
| scenario | expected | result |
|---|---|---|
| Live preview, week 16–22 Aug still running, all feeds current | no banners | `[]` |
| **15 Aug build, week 9–15 Aug, the real outage** | catch it | 5 sources flagged, HubSpot 6 days / deals 7 days behind |
| Quiet week, last post Thu 13 Aug, feeds healthy | no false positive | `[]` |

In the real-failure case it would have branded scorecard, sales, sales-ytd, sales-market,
sales-pipeline, attribution, client-success, finance and client-revenue — precisely the slides
that were wrong.

### Still owed
- **No push alert.** The gate is visible in the deck and in `v5_meta` but does not yet message
  anyone; wiring it to the Tech Updates group needs a decision while notifications are held.
- `content_perf.*` freshness is a proxy, not a sync timestamp. A sync-time column on those tables
  would make it exact and let the grace period drop.
- The `ROLE_EMOJI` entry for **Strategists** in `V5 Transform` still holds corrupted bytes and
  renders as mojibake; the rendered slide was fixed by hand in report 100, so it will come back on
  the next build.

### Emoji removed from the deck — 2026-08-18 (CR-20260818-03)

Faiz: strip the emoji rather than repair the corrupt one. Implemented as a **single pass over
the finished HTML** in `V5 Transform`, immediately before `outHtml` is returned — not by editing
the ~40 scattered literals (`ROLE_EMOJI`, the tile-emoji table, and inline labels across sales,
finance, content-stock, client-success, smm, strategists, tech and attribution). One pass cannot
miss a label, and no future edit can quietly reintroduce one.

It strips **both** literal characters and numeric HTML entities. That second half matters: several
labels are written as entities (`&#128203;`) and would have survived a character-only strip
completely intact.

Ranges dropped: `1F000–1FAFF`, `2600–27BF`, `2300–23FF`, `2B00–2BFF`, plus `FE0F` (variation
selector), `200D` (ZWJ) and `FFFD` (replacement char).

**Kept deliberately:**
- `U+26A0` warning sign — functional on the stale-data and governance banners, not decoration.
- `▲ / ▼` (`25B2/25BC`) — outside every dropped range, so the week-over-week pills still read.
- `→ · — ≈` — all outside the ranges.

**Side effect that dropping `FFFD` produced for free:** the corrupt `ROLE_EMOJI.Strategists` entry
rendered as mojibake (`????`) on every build. It is now stripped along with the rest, so the
underlying corrupt bytes no longer need fixing — but they are *still in the source* and would
resurface if the strip were ever removed.

**Known side effect to watch:** the pass also strips emoji out of **video titles** pulled from
social (4 rows in the 18 Aug render, e.g. *"Siapa bilang perubahan harus dimulai dari atas? 👀🇮🇩"*).
That is real source content being altered for presentation. Acceptable for a clean deck; if titles
should keep theirs, the strip has to be scoped to chrome only rather than run over the whole
document.

Verified on a live render: 37 slides, **0** literal emoji, **0** emoji entities, **0** mojibake,
warning sign present 5x, delta arrows present 5x.

### HR slide
Already absent from the generator — the 18 Aug render carries 37 slides and no `hr` id. No change
needed. It survives only in archived **report 100**, which also predates the emoji strip.

---

## Weekly build moved to Sunday 00:00 — 2026-08-18 (CR-20260818-04)

Faiz: sales update their numbers across Saturday, sometimes into the evening. Building at
Saturday 07:00 meant the deck was cut **while its own last day was still running** — the week
never had a complete Saturday in it. Give sales until Saturday 23:59 and build once the week has
actually closed.

**The week itself does not change: still Sunday → Saturday.** Only the build moves.

| Job | Was | Now | Cron |
|---|---|---|---|
| Metric Watchdog (pre-build verification) | Sat 07:30 | **Sun 00:00** | `0 0 * * 0` |
| Portal Report Archiver (**the generator**) | Sat 08:45 | **Sun 00:05** | `5 0 * * 0` |
| Manager Updates (the ping) | Sat 08:50 | **Sun 00:20** | `20 0 * * 0` |

**No SQL change was needed for the week boundary.** The `b` CTE in Weekly Facts anchors on
`(today − 2) − DOW(today − 2)`; run at Sunday 00:00 that still resolves to the Sunday that opened
the week which just closed. Verified: at Sun 30 Aug it returns 23 Aug, i.e. the 23–29 Aug week.
The only behavioural change is that Saturday's data is now fully inside the window.

### Managers are @-mentioned by name
The ping went to the managers chat as plain text, which is easy to scroll past. Each manager is
now mentioned individually — Lark takes `<at user_id="ou_...">Name</at>` inline in a text message,
so it fires a personal notification rather than adding a line to a group. IDs read live from the
membership of `oc_cd23f2473003e47dc2a5db164a12d770`: Al Hakim, Iman Arifin, Thaddeus, Talulla,
Ratnasari Cenreng, Rina, Mishkat Tanin, K.Bhavani Karupiah, Shahrukh Ameer, Faiz.

Faiz's call on timing: **the ping goes out with the build, not the next morning** — "no time to
lose". So managers are notified at ~00:20 Sunday and have all of Sunday to QC before Monday.

### Left alone, needs a decision
`Weekly Slides → Hakim (Sat 9am)` (`STzSYqQAmqDflniT`) is **still on Saturday 09:00** and is now
out of step with the chain: it would fire a day before the deck is rebuilt, pointing at the
previous week's deck. It also duplicates the managers ping, since Hakim is in that chat. Either
move it to Sunday or retire it — not touched without instruction.

### Node names are now stale
The trigger nodes still read "Sat 7:30 SGT", "Weekly Sat 8:45am SGT" and "Sat 8:50 SGT". Renaming
a node rewrites every connection reference, so the crons were changed and the labels left. Read
the cron, not the name.

---

## CR numbering convention + CR feed reads the chat — 2026-08-18

### The clash, and the rule that prevents it recurring
Two Claude sessions raised CRs on the same day and both started at `-01`. The device/Entra
workstream posted `CR-20260818-01` (Sarah Miranda's Entra account) and `CR-20260818-02`
(device-onboarding docs) into Tech Updates; the deck workstream had independently used `-01`
through `-04` in git. That session spotted it and left a note in the group.

**The sequence suffix was the defect.** Two people cannot pick the next number in a shared
sequence without first reading the whole register, and neither did.

**New convention, from 2026-08-18 (Faiz):**

```
CR-DDMMYYYY  followed by the title
e.g.  CR-18082026 — HubSpot + Xero sync restored
```

No sequence number. The **title** is what makes a same-day CR unique, and a title is something
the author already knows without consulting anyone. Note the date is **DDMMYYYY**, deliberately
different from the old `YYYYMMDD-NN`, so the two generations are distinguishable at a glance.

**Renumbering applied:** the deck workstream ceded `-01` and `-02` to the device workstream,
which posted first. `CR-20260818-01` in the Lark CR Register (the sync fix) was renumbered to
**`CR-20260818-03`** and posted to the group under that number.

**Still wrong, and worth knowing:** the four deck commits below carry CR labels that collide with
the device workstream. Their commit messages are unchanged — rewriting pushed history needs a
force-push on a shared branch, which is not worth the risk for a label. This table is the
authoritative mapping:

| Commit | Label in message | Should be read as |
|---|---|---|
| `8c04aee` | CR-20260818-01 | CR-18082026 — HubSpot sync outage + report 100 restatement |
| `e56324f` | (none) | CR-18082026 — Shoot Date correction |
| `4171b60` | CR-20260818-02 | CR-18082026 — freshness gate |
| `02011cb` | CR-20260818-04 | CR-18082026 — weekly build moved to Sunday |

### CR feed now reads the Tech Updates GROUP, not the Base table
Faiz: *"the change request feed is inside the Tech Updates group"*. The `crWeek` fetch in
**V5 Facts** was reading `tblarK2gfipaHTRC`, which lags and is not always written. It now reads
the chat (`oc_1e17c626a19a6ba213abca429d0d13ff`) over a 60-day lookback via
`im/v1/messages`, parses the first CR line out of each message body, de-duplicates by number
(a CR is sometimes reposted after an edit), and filters to the deck week.

The parser accepts **both** generations — `CR-(\d{8})(?:-(\d{1,2}))?` — so historical entries keep
resolving. The separator is matched as `[^A-Za-z0-9]+` rather than a literal dash, because the
group contains em dashes, en dashes and hyphens interchangeably.

Verified on a live render: the tech slide now lists all three CRs raised on 18 Aug, including the
two from the device workstream that the deck had no visibility of before.

### Notifications repointed
Recipients changed from **Manager Updates** (`oc_cd23f247...`, 10 people) to **Koocester
Management** (`oc_7bfdc6d0...`, 7 people) — the people who actually present the deck. Six are
@-mentioned by name: Iman Arifin, Rina, Mishkat Tanin, Cheryl, K.Bhavani Karupiah, Faiz.
**Hakim is in the chat but deliberately not mentioned** — he presents none of it.

`Weekly Slides → Hakim (Sat 9am)` (`STzSYqQAmqDflniT`) is **deactivated**: it duplicated the
group ping and was stranded on Saturday after the build moved to Sunday.

Message body reordered so the **portal link comes first** — open the deck, then QC, then the edit
link. The QC ask used to sit above the link.

---

## Month-on-month + the month-end edition — BUILT 2026-08-18

Previously recorded in this file as *"NOT built ... Build Deck has no monthly branch, the Weekly
Facts SQL has no MoM keys, and V5 Transform has none."* That is now stale — it is built.

### The rule
The **last weekly deck of a calendar month** becomes the monthly edition: same running order,
same slides, but every comparison is **month-on-month against the prior month** instead of
week-on-week. Every other week is untouched.

### How month-end is detected
Not by counting weeks, and not by a maintained calendar. In `Weekly Facts`:

```sql
EXTRACT(MONTH FROM (sun+13)) <> EXTRACT(MONTH FROM (sun+6))
```

*"Is the Saturday after this week's Saturday in a different month?"* If yes, this is the last
full week of the month. It is self-maintaining and cannot fire twice. Verified across 13
consecutive weeks:

| Week (Sun–Sat) | Generated | Edition |
|---|---|---|
| 16–22 Aug | Sun 23 Aug | weekly |
| **23–29 Aug** | **Sun 30 Aug** | **MONTHLY — Aug vs Jul** |
| 30 Aug – 5 Sep | Sun 6 Sep | weekly |
| **20–26 Sep** | **Sun 27 Sep** | **MONTHLY — Sep vs Aug** |
| **25–31 Oct** | **Sun 1 Nov** | **MONTHLY — Oct vs Sep** |

Exactly one per month, always the last full week. **First firing: Sunday 30 August.**

### What the data layer returns
`wf.mom` — `isMonthEnd`, `mLabel`, `pLabel`, `mStart`, `mEnd`, and current-vs-prior month pairs for
**leads, enq, sql, won, won_val, inv, coll, posts, views, eng**. The month is the one containing the
week's Saturday, so the last week of August reports August even though the deck is built in
September.

### How the deck switches
A single `pick(weekPrior, weekCur, momKey)` helper in V5 Transform. On a normal week it returns the
week pair; on the month-end edition it returns the month pair. Axis labels flip `last wk / this wk`
→ `last mth / this mth`. Wired into the sales enquiries chart, all three engagement charts, and both
finance charts.

The opening slide carries a blue **MONTHLY EDITION — <month>** banner naming the comparison basis,
because a reader cannot otherwise tell which basis a chart is on. `v5_meta.month_end_edition` and
`v5_meta.mom_month` expose it machine-readably.

### Verified
Live render on a normal week: 36 slides, **no** monthly banner, all 14 chart axes still read
`last wk / this wk`, no mojibake. The month-end branch was then exercised against the real
warehouse figures:

| | week basis | month basis (Aug vs Jul) |
|---|---|---|
| Enquiries | 27 → 6 | 163 → 70 |
| Invoiced | 3,000 → 1,000 | 85,901 → 45,700 |
| Collected | 0 → 0 | 107,001 → 24,500 |
| Posts | 89 → 9 | 396 → 211 |
| Views | 1,996,156 → 30,886 | 44,444,403 → 4,563,607 |
| Engagement | 3.09 → 3.39 | 3.37 → 2.89 |

August is still partial today, so those figures fill out as the month closes — the structure is
what was being proven.

### Deliberately left on the week basis
`deals_created`, the role-output rows on the marketing summary (`team_throughput` is stored per
week and would need month aggregation), and the top-5 / vertical slides, which are inherently a
"what ran this week" list rather than a comparison. Adding MoM to the role rows is the obvious
next increment.

---

## 2026-08-21 (later) — CR-21082026: Saturday 10:00 generation + ping date-match fix + Google Slides editing dry run

### Schedule moved BACK to Saturday, per Faiz ("hard must: slides generated every Sat morning 10am")
This reverses the Sunday-00:00 decision of CR-20260818-04, with the trade-off now accepted
explicitly: the Sun–Sat week ships with Saturday covered only to 10:00; sales that close later
on Saturday appear in the following week's deck.

| Workflow | Now | Cron |
|---|---|---|
| Metric Watchdog `CI1wLjRA8U8PvIUX` | Sat 09:30 | `30 9 * * 6` |
| Portal Report Archiver (generator) `db8jcaHxVUWmYOPT` | Sat 10:00 | `0 10 * * 6` |
| Manager ping `bhBTXc9o47wQ2nVZ` | Sat 10:10 | `10 10 * * 6` |

All three verified on the PUBLISHED (active) version, timezone Asia/Singapore. Trigger node
labels remain stale ("Sat 8:50" etc.) — read the cron, not the label. The week anchor
(`now −2d − DOW`) needs no change: at Sat 10:00 it resolves to the in-progress week's Sunday.
Month-end MoM edition moves with it — **first firing is now Saturday 29 August**.
First firing of the whole Saturday chain: **Sat 22 Aug 10:00**, week 16–22 Aug.

### Bug fix: manager ping report-check matched the wrong date
`Report Check` looked up the weekly report with `date_trunc('week', now())` = **Monday**, but
weekly reports have been **Sunday-dated since 7 Aug** (verified in `public.reports`: 9 Aug,
2 Aug are Sundays; 27 Jul, 20 Jul are the old Monday-dated rows). Every firing since 8 Aug
would have taken the "slides NOT built" branch. Replaced with the same Sunday anchor as the
generator: `dated = (sgt_date − 2) − DOW(sgt_date − 2)`.

### Dry run for week 16–22 (data through Fri 21) — NOT sent to any group
Rendered from `dryrun-v5-weekly-x9`: 36 slides, no stale-source banners, weekly (not monthly)
edition — all correct. Delivered to Faiz as `DRYRUN_16-21_AUG.html` (scrollfix injected).

### Google Slides as the manager editing surface — dry run built, architecture decided
Faiz wants edits to happen in Google Slides: native version history, named editor
accountability, one live link for everyone. Dry run delivered: the 36-slide deck converted to
`DRYRUN_16-21_AUG_editable.pptx` — per slide, a raster of the rendered HTML (text hidden
before capture) + every text element re-laid as a real editable text box at its measured
position/size/style. Text was extracted mechanically from the rendered DOM, so numbers are
exact by construction. Converter lives in the session scratchpad (`extract.js`, `build.js`,
puppeteer-core + pptxgenjs, headless Chrome at 1280×720, deviceScaleFactor 2).
Drive-import of the .pptx yields an editable Google Slides file.

Automation path (proposed, not built): n8n already holds a working `googleDriveOAuth2Api`
credential ("Koocester Drive", refreshed 31 Jul). Proper build = a Google Slides TEMPLATE deck
+ weekly Drive copy + `replaceAllText` + charts linked to a Google Sheet the pipeline updates —
fully native, no conversion step. The pptx converter is the bridge until that exists.

Known cosmetic limits of the pptx bridge: Arial substitutes for Helvetica Neue (slight width
drift, occasional label/pill overlap), inline bold-within-a-line flattens to the block style,
SVG chart labels stay rasterised (not editable). All numbers and copy are editable text.

---

## 2026-08-21 (evening) — CR-21082026: in-portal slide editing, signed by login (Google Slides idea dropped)

Faiz rejected the Google Slides/PPTX route ("this is not the way"): edits must happen ON the
staff portal, on the slides themselves; whatever is saved becomes the live copy at the same
link; the portal LOGIN is the edit identity; the weekly card should show "Generated <when>"
and "Last edited by <who>".

### What shipped (all n8n — zero portal files deployed)
1. **`Inject Portal Editor`** node in `t9ZZ7sk9hyWEKNdR` (between V5 Transform and Respond):
   every generated deck carries `data-koo-dated="<week sunday>"` plus a self-contained editor
   script. It activates ONLY when a staffacademy Supabase session is present in localStorage
   (report-view.html renders decks in a same-origin srcdoc iframe, so the session is visible);
   on the public dry-run webhook or file:// it stays silent. UI: ✏️ Edit + 🕘 History buttons.
2. **`slides-edit-save-v2`** endpoint in `Eqmd0mEmyxkuPGxL`: verifies the token against
   `auth/v1/user` (identity can NOT be typed or spoofed), resolves `profiles.full_name`,
   requires `is_manager OR is_admin`, snapshots the pre-edit copy as `weekly_manager_edit`,
   diffs per-slide segments to record WHICH slides changed, updates `reports.html_content`
   in place, appends `{by, email, at, slides, pre_edit_snapshot_id}` to
   `metadata.edit_history`, stamps "✏️ Edited by <name> · <when> · slide N" chip.
   CORS locked to `https://staffacademy.koocester.com`.
3. **History panel**: "Generated <closed_at>" + one row per save with editor, time, slides
   changed, link to the version before that edit. This is the Google-Slides-style history,
   done natively.
4. Saturday 10:10 ping now teaches this flow (old type-your-name editor k8w2 left up, unlinked).
5. **Report 100 armed** with the same script as the demo/test bed.

Verified in Faiz's own browser: buttons render inside report-view, edit bar reads
"editing as Faiz" (from login, profiles.full_name), history panel correct, bogus token
rejected with a clean error. The final keystroke+save leg is left for Faiz (automation
was not allowed to type into his browser).

### 🔴 Portal repo is BEHIND live production — do not deploy
Hash-compared all 162 repo files against live (authed fetches): live build = commit
`16853fb` (~14 Aug, not in the GitHub repo). Live-only pages: leave, hr-escalation,
gift-barter, exit-interview, training-record, new-joiner-feedback; newer deploy.sh,
portal.html, koo-nav.js, sales/media kits, brand PNGs. A Pages direct-upload deploy from
the repo would DELETE those pages and may not carry their server Functions.
**Consequence: the weekly-listing card line ("Generated <date> 10:00 AM · Last edited by
<name>") is designed but NOT shipped — it needs manager/weekly/index.html, which cannot be
deployed until the ~14 Aug deploy tree is found and pushed.** Ask Hakim / find the session
that deployed 4× on ~14 Aug. Both files needed (report-view.html, weekly/index.html) are
identical repo↔live, so the change itself is a small diff once deploys are unblocked.

---

## 2026-08-21 (night) — editor bugs found by Faiz's dry run, fixed and SELF-TESTED end-to-end

Faiz's live test of the in-portal editor surfaced three defects; all fixed, all re-verified by
an automated end-to-end run in a real logged-in browser session against dry-run row 103.

1. **Every slide flagged as edited** → the server compared raw markup; the browser re-serialises
   markup and charts render at load, so all slides differed. Fix iterated twice, final: **the
   editor measures the change in the page** — snapshots each slide's textContent at Edit-start,
   sends the changed indexes at Save. The server-side markup diff is gone (legacy decks without
   the field record 'unspecified').
2. **Deck read-only after one save** → the save-cleanup stripped the editor's own <script>.
   Fix: cleanup spares scripts, AND the server transplants the editor block back into any
   submitted copy that lost it (self-healing).
3. **Saves silently "lost"** → root cause is LATENCY, not loss: the endpoint takes ~10–15s
   (n8n cloud). Users navigated away mid-save (aborting the upload) or checked History before a
   slow save landed. Fixes: blocking "💾 Saving — keep this page open (~20s)" state with both
   buttons disabled; server no longer pulls the full ~217KB html out of Postgres per save (only
   the editor block substring); no-change saves now rejected client-side in ~2ms with no round
   trip.

Self-test results (Chrome, real Supabase session, row 103): save 1 → chip/history "slide 2"
only, 11s; save 2 on the once-saved copy → "slide 3", editor still present; no-change → instant
reject, edit mode preserved. DB: 2 history entries [[2],[3]], 2 pre-edit snapshots. Generator
output re-verified carrying editor v5, zero JS errors.
