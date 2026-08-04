# Town Hall slides — format contract (v1)

Written **2026-08-04** from the August 2026 build (report id 52), which was built to Hakim's
stated format and reviewed by him. Read [README.md](README.md) first — the rule is that this
file is the input to the next build, and changes are appended here before they are built.

## 1. The meeting

- **Monthly, first Tuesday, 10:00–11:00 SGT.** Whole company, all three markets.
  Calendar: Company Calendar (Worldwide), series `TOWNHALL - EVERYONE`
  (`1178a044-e778-4402-9f91-c6d41c5c6307`, `FREQ=MONTHLY;BYDAY=1TU`), created by Hakim 2026-07-30.
  It replaced the old first-Wednesday series, which was terminated.
- **Audience: everyone.** This is the constraint that drives every content rule below.

## 2. The format Hakim asked for

Verbatim intent, from his instructions on 2026-08-03:

> "More on recognition of people and recap of the month" · "And updates moving forward" ·
> "the marketing meeting would just require a more in-depth version of this"

So the deck is three parts, in this order, and **recognition comes first** — before the numbers:

1. **Recognition** — the people, and the work that went furthest.
2. **Recap of the month** — what we published, who we reached, where growth came from.
3. **Moving forward** — what is changing and what is being asked of people.

Each part opens with a **dark divider slide** (`.slide.divider`) so the room can see the shape
of the meeting. This is not decoration — it is what stops the deck reading as one long list.

## 3. Running order (locked)

26 slides in the August build. Section counts flex with the data; the **sequence does not**.

| # | Slide | Notes |
|---|---|---|
| 1 | Cover — "The month in review" | month + date + one line on what today covers |
| 2 | **DIVIDER — Part one: The people who made it** | |
| 3 | The people who shipped | per-role leaderboard, top output per role + honourable mentions |
| 4 | Our biggest hits | **top 10** videos, deduped across platforms, with credits; top 3 elevated |
| 5 | The people behind the wins | **top 3 per market** (SG / MY / ID) with credits |
| 6 | **DIVIDER — Part two: How July went** | |
| 7 | What we did in <month> | headline stat tiles + prior-month comparison |
| 8 | Every market contributed | views + posts per market |
| 9 | Where our audience lives | followers per platform |
| 10 | Where the growth came from | growth % per market × platform |
| 11–13 | <Market> — account by account | one slide each SG / MY / ID, every account, status chips |
| 14 | Top-performing Instagram content | lead-in to the vertical detail |
| 15–19 | Business / Autos / Wealth / Homes / Foodie | top 3 reels + top 3 carousels each, with credits |
| 20 | What the data says | 3–5 plain-language reads of the month |
| 21 | **DIVIDER — Part three: Moving forward** | |
| 22 | Our meeting rhythm | how we meet; see §6 |
| 23 | Devices & data protection | rolling security/ops items |
| 24 | AI, the Koocester way | the AI position; see §6 |
| 25 | Trainings on the staff portal | learning + growth |
| 26 | Closing divider — "One team, one direction." | thanks + **next Town Hall date** |

## 4. Recognition rules

Recognition is the point of the first third. It is not a formality.

- **Name the people, every time.** A hit with no name is a wasted slide.
- **Reels are credited `Produced by X · Edited by Y`.** Producer sources and shoots it, editor cuts it.
- **Carousels are credited `Written by X`** — the copywriter is the author of a carousel.
- **Spread recognition across markets.** Indonesia's numbers dominate any global ranking, so a
  single top-10 hides Singapore and Malaysia entirely. The per-market slide (#5) exists
  specifically to fix that, and must stay even in a month where one market wins everything.
- **Elevate the top three** on the top-10 slide (filled rank badges + a "Top 3 of the month" tag).
- **Never guess a name.** If the source system has no attribution, the card says
  *"credit not recorded in the base"*. That is honest, and it also makes the data gap visible
  to the people who can fix it.

### Where credits come from

| Content | Source | Field |
|---|---|---|
| Reels | Lark Videos `tbl8wIByJQwhIUei` | `Producer`, `Video Editor` |
| Carousels | Lark Carousels `tblnMZctdGYfXjYL` | `Copywriter` |

**Matching, in order of reliability:**
1. Instagram post URL → the record's `Instagram Post URL` (match on the reel shortcode).
2. If that misses: `Video Idea` / `Topic (Must Fill)` keyword. Topic wording rarely matches the
   deck label — e.g. *"Ketua RT Gang Viral"* is the catfish carousel, *"Aris kelapa wealth"* is
   the coconut-exporter carousel, *"Exportir Muda"* is the Razade coconut reel.
3. If that misses: pull every record for the vertical and match on the guest name, which often
   only appears in the platform caption (that is how the Raimy house-tour producer was found).

**Known cause of misses:** records whose post-URL fields were never filled in after posting.
That is a data-hygiene problem in the base, not a deck problem — see §9.

## 5. Data sources

| Slide group | Source |
|---|---|
| Posts, views, engagement, per-market, top content | Warehouse `wnerzolcmjrsktfqferw`, `content_perf.reels` / `content_perf.posts` (Metricool) |
| Followers + growth | Metricool follower snapshots; the monthly Channel Health analysis for per-account start/end |
| Leads | `hubspot.contact`, excluding `tech+%@koocester.com` test addresses |
| People output | `public.team_throughput` (Portal Supabase), weeks inside the month |
| Credits | Lark M&D base (see §4) |

**Growth-rate rule:** a growth % only counts accounts that started the month with **≥100
followers**. Brand-new pages (0 → a few thousand) otherwise produce meaningless percentages.
Their gains still count in the totals. Always state this on the slide.

**Comparison rule:** every headline number shows the prior month beside it. A number with no
comparison tells the room nothing.

## 6. Content rules for the "moving forward" slides

- **Only cleared items.** Leadership items are surfaced to all staff only when explicitly
  cleared for that. The Town Hall does **not** infer announcements, joiners, birthdays or wins.
- **No finance on this surface.** Revenue, collections and margins are management-only. They
  appear in the weekly deck, not here.
- **Meeting rhythm slide** currently states: Monday leadership meeting · first Tuesday Town Hall ·
  **Tuesday huddle** — every department, same day, cascading what came out of the leadership
  meeting and aligning across teams. (Changed 2026-08-04 on Hakim's instruction, replacing
  "department meetings run per the Meeting OS calendar".)
  Do **not** add "raise it at the leadership meeting"-style instructions to this slide.
- **AI slide leads with the reassurance**, not the technology: AI is not a downsizing programme,
  nobody is being replaced, everyone gets upskilled to direct and quality-check agents.

## 7. Rendering contract

House skeleton, inherited from the July 2026 deck and unchanged since:

- **Palette:** `--maroon:#C02025`, `--maroon-tint:#faf3f3`, `--ink:#0a0a0a`, `--body:#333`,
  `--muted:#767676`, `--line:#E4E4E4`, `--line2:#F0F0F0`, `--ok:#1b7f4b`, white background.
  Carousel accent (used only to separate reels from carousels) `#3d3f8f`.
- **Type:** Helvetica Neue / Helvetica / Arial stack; `ui-monospace, Menlo` for every number,
  handle, rank and credit line. Numbers are always mono — that is what makes the deck scan.
- **Structure:** `<section class="slide">` per slide, one `.inner` (max-width 1040px) inside.
  `.slide.tall` when content is long. `.slide.divider` for the dark section breaks.
- **Components** (reuse; do not invent new ones without adding them here):
  `.stats` / `.st` stat tiles · `.ths` / `.thr` ranked rows · `.cwrap` / `.card` two-column
  reels-vs-carousels cards · `.acards` / `.acard` per-account cards with status chips ·
  `.mkt` / `.mcol` per-market recognition columns · `.lbs` / `.lb` leaderboard bars ·
  `.anns` / `.ann` announcement blocks · `ol.pts` numbered points · `.callout` emphasis ·
  `.cite` source line.
- **Every data slide ends with a `.cite` source line** naming the source and the pull date.
- **Status chips:** Thriving ≥ +10%, Growing, Flat < +2%, Declining, Low base (<100 followers).
- **Navigation:** arrows, click, arrow keys / space / page keys; `1 / N` counter; top progress bar.
- **Accessibility:** honour `prefers-reduced-motion`; the deck must be readable with animation off.

## 8. Build, storage, serving and editing

**Storage.** One row in `public.reports` (Portal Supabase) per Town Hall:
`kind='townhall'`, `dated` = meeting date, `title` = "<Month> <Year> Town Hall",
`html_content` = the whole deck.

**Serving** — all three surfaces read that one row, so they can never disagree:

| Surface | URL | Notes |
|---|---|---|
| View (present from this) | `/webhook/townhall-aug` | read-only, no auth |
| Edit | `/webhook/townhall-edit-m4x8` | red EDIT MODE bar |
| Staff portal | `staffacademy.koocester.com/manager/townhall` → `townhall-view.html?id=<id>` | login-gated; reads Supabase directly |

n8n: `eey4OeQlccxfwd8p` (view + edit + save), `F483zF5jDhFDuPC3` (portal serve; serves the stored
deck when one exists, else falls back to the governed all-staff-safe cascade build).

**Editing.** Anyone can click text and change it, add or delete a slide, and save. A name is
required. On save the workflow:
1. strips any existing version stamp from the incoming HTML,
2. snapshots the current version (`kind='weekly_manager_edit'`, `parent_report_id` = the deck),
3. writes the new HTML **and re-injects the stamp inside the same UPDATE**, so the stamp text and
   `metadata.last_edited_at` share one `now()`.

**The stamp is baked in at save time, never injected at serve time.** The portal viewer reads
`html_content` straight from Supabase and never touches n8n, so anything added on the way out is
invisible there. Baking it in is what keeps all surfaces identical.

Timestamp is formatted **in SQL** (`to_char(... AT TIME ZONE 'Asia/Singapore','DD Mon YYYY, HH24:MI')`)
so every surface prints a byte-identical string.

All serving responses send `Cache-Control: no-store` so a second person's browser can never show
a stale copy after someone edits.

## 9. Monthly build checklist

1. Confirm the meeting date from the calendar (first Tuesday) — do not assume.
2. Pull the month's numbers (§5). Compare against the prior month.
3. Pull credits (§4). Log which items could not be matched.
4. Rebuild the deck to the running order in §3 — same sections, new numbers.
5. Verify: slide count, no double version stamp, every data slide has a `.cite`.
6. Save through the edit endpoint (never write `html_content` directly) so a snapshot is taken.
7. Check the view link and the portal render the same byte length.
8. Send the view + edit links to the Manager Updates Lark group with a QC ask before the meeting.
9. Log any missing credits so the base gets fixed before next month.

## v2 requirements (2026-08-04, Faiz) · **PENDING DRY RUN — not yet built**

Target running order for the next Town Hall (first Tuesday of September 2026). Extends §3;
the three-part shape (recognition → recap → moving forward) survives, with a new opening block.
Every item below is a **hard rule** once the dry run passes (see README, Framework v2).

### New opening block (before Part one)

| Slide | Rule |
|---|---|
| **Purpose · Values · Vision** | The company's purpose, values and vision, stated on their own slide at the top of every Town Hall. ⚠ Needs the canonical wording — see Open questions. |
| **Inspirational video** | An embedded, playable video (click play, plays in the deck) chosen fresh each month for its relevance to the purpose, values and vision. The house skeleton already has the `.slide.video` / `.vframe iframe` pattern (used in the July 2026 deck) — reuse it. Selection is part of the monthly build checklist; the chooser records one line on why this video, this month. |
| **Birthdays of the month** | Everyone with a birthday in the meeting month, by name. **Source verified 2026-08-04:** HR base `KQp7bmn5WaztcZsILUalm4bjgOf` / Employees `tbletkzlOHyUIzOX`, field `Birthdate` (`fldPWmKEfO`; there is also a `Next Birthday` formula). Coverage: 35/35 active staff have it filled. **Hard rule: fetch ONLY `Preferred Name`/`Full Name`, `Birthdate`, `Status`, `Department` from that table — never salary, IC, bank, address or any other column. Show day + month only, never the year/age.** The July deck's `.joiners` birthday-chip component exists for exactly this. |

### Part two additions (recap)

- **Department wins — every department**, with accurate statistics from the Lark M&D base
  (videos shipped, carousels written, projects delivered, posts published…). Every department
  appears; a department with a quiet month still gets its line — the slide never silently
  drops one.
- **Leads and qualified leads** are reported explicitly, with MoM comparison, as a chart.
  ⚠ "Qualified" needs a registry definition — see Open questions.
- **MoM everywhere:** every recap number carries its prior-month comparison, charted per
  Framework v2 rule 2.

### Part three additions (moving forward)

- **Company updates and rollouts** — the existing slides (devices, AI, trainings…) formalised
  as a standing "updates & rollouts" section.
- **One client story of the month** — a single customer/client story told properly.
  ⚠ Source to decide — see Open questions.
- **One thing that went wrong + the improvement** — chosen from the month's statistics, told
  without blame, with the concrete change being made. The deck must contain exactly one; zero
  is a spec violation (something always went wrong), more than one dilutes it.

### Open questions (answer before the dry run)

1. **Canonical purpose / values / vision text** — where is the approved wording? (Candidate:
   the brand guideline training page in the portal; needs Hakim's sign-off as the canonical text.)
2. **"Qualified lead" definition** — which HubSpot lifecycle stage / property counts as
   qualified? Must become a Metric Registry row before it appears on a slide.
3. **Client story source** — Project Feedback Intake responses, CX health monitor, or a manual
   pick by CX each month? Needs an owner.
4. Faiz's phrasing "for every slide … it must have the values, company purpose, and vision" is
   interpreted as **a dedicated opening slide**, not a footer repeated on all slides. Confirm.

## Change log

| Date | Who asked | Change |
|---|---|---|
| 2026-08-03 | Hakim | Format set: recognition of people + recap of the month + updates moving forward; marketing meeting is a deeper version of the same. |
| 2026-08-03 | Faiz | Deck must be house-style HTML in the reports pipeline, like the weekly slides — not a slide-tool export. |
| 2026-08-03 | Faiz | Cleared leadership items 1, 3, 7, 9 for the all-staff cascade; item 8 (agent ownership register) dropped. |
| 2026-08-03 | Faiz | Per-account breakdown per country, so it is visible which accounts are thriving and which are not. |
| 2026-08-03 | Faiz | Card layout for top content (numbered rank, big value, engagement pill, market chip), Koocester theme. |
| 2026-08-03 | Faiz | Version stamp — who last edited and when — visible on the deck and identical across all surfaces. |
| 2026-08-04 | Hakim | Producer/editor names on every top-content card. |
| 2026-08-04 | Hakim | "Department meetings" → **Tuesday huddle**, cascading from the leadership meeting and aligning teams. |
| 2026-08-04 | Hakim | More recognition: elevate the top 3 of the top 10, and give each market its own top 3. |
| 2026-08-04 | Faiz | v2 requirements: purpose/values/vision slide, embedded inspirational video, birthdays of the month (HR base verified, 35/35 coverage), department wins for every department, leads + qualified leads, one client story, one thing-that-went-wrong + improvement, MoM charts. Pending dry run. |
