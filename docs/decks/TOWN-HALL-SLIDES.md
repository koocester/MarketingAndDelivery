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

### Purpose · Values · Vision — a FOOTER, not a slide (decided by Faiz, 2026-08-04)

Faiz's call: "we're not gonna look at this every single time" — so PVV does **not** get an
opening slide that eats meeting time. Instead it is **engraved into the footer of every slide,
on both decks** (weekly and Town Hall):

- A persistent, unobtrusive footer strip on every slide, bottom-centre (the brandmark owns
  bottom-left and the version stamp owns bottom-right — the three must never collide):
  **"Symbol of Inspiration. Empowering Growth. Powered by People. · G U I D E · Vision 2035"**
  — mono, muted, small. Present on every slide, ignorable, always there.
- When PVV is ever rendered **in full** (onboarding material, a leadership ask, the video
  slide's framing), the engraved layout is the founder-doc look from Faiz's screenshots:
  the five-column **G · U · I · D · E** grid — big letter on top, value phrase beneath —
  and the left-bordered highlight block for the purpose line and the Vision 2035 statement.
  Structure from the doc; colours stay house palette (maroon accent, not the doc's gold).
- The wording is the canonical text below, verbatim, both in the footer and in full renders.

### New opening block (before Part one)

| Slide | Rule |
|---|---|
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

### Canonical Purpose · Values · Vision (supplied by Faiz, 2026-08-04, from the founder's Lark doc)

This is the approved wording for the opening slide. Do not paraphrase it. The source doc calls
itself "a living document, not a poster" — if the Lark doc changes, this section is updated to
match and the change is logged.

**Values — GUIDE:**
- **G**rowth & Curiosity
- **U**niting through trust and relationships
- **I**mpact through inspiration
- **D**are to be bold and innovate
- **E**mpathy and Giving

**Purpose:** *Symbol of Inspiration. Empowering Growth. Powered by People.*
"We exist to be the growth partner businesses trust to deliver outcomes that matter — not vanity
metrics, not impressions for impressions' sake. We turn credible brands into category-defining
ones. We turn ideas into audiences. We turn marketing spend into measurable impact. And none of
that happens without people. Our culture is the product. It always has been."

**Vision 2035:** "To be the world's most trusted and influential growth ecosystem, inspiring
over 1 billion people annually and shaping industries through influential media, impactful
education, and data intelligence." Always aiming for media dominance — market leader in every
country. Headquartered in Singapore.

**Founder's three quotes** (usable on the slide or as the video slide's framing):
1. "To get something you never had, you have to do something you never did."
2. "The harder you work, the luckier you get."
3. "Win the hearts of people, win everything."

**Slide layout:** one slide, three blocks (Purpose / Values as the GUIDE list / Vision 2035),
maroon GUIDE initials, `.cite` line naming the founder's doc as source. The inspirational-video
slide follows it, choosing a video that speaks to one of these three blocks.

### Qualified lead — CONFIRMED and registered (Faiz, 2026-08-04)

> **Qualified lead (month) = a contact that entered HubSpot lifecycle stage
> `salesqualifiedlead` (or skipped past it to `opportunity`/`customer`) during the reporting
> month**, measured by `property_hs_v_2_date_entered_salesqualifiedlead` in SGT, with the
> standard `tech+%@koocester.com` exclusion.

Registered in the Metric Registry (`tblSfp4fLYS02iRp`, record `recvrjoebW6CUp`) as
**"Qualified leads (month)" — Trusted**, appearing on Town hall + Weekly Management Report,
with the exact rule, source, key and known-issue fields filled. The registry row is the
authority; if the rule ever changes, change it there first, then here. Reference numbers at
registration: July 2026 = 9 vs June = 40 (raw leads 2,864 vs 3,982). The slide always shows
raw leads and qualified leads together, MoM, as a chart.

### Client story of the month — source (resolved 2026-08-04, per Faiz: the project feedback forms)

- **Source:** the Project Feedback pipeline — clients rate 1–5 with a comment via the tokenised
  form (`I6Axw8WicVHpexXK`), which writes `Feedback Rating`, `Feedback Comment`,
  `Feedback Received At`, `Feedback Request Status='Received'` onto the project row in
  Projects (Delivery) `tblAJKbb2UZRh8rn`, linked to the Client.
- **Rule:** pick the month's highest-rated received feedback with a usable comment; the slide
  shows the client, the project, the rating and the comment verbatim. **If no real feedback was
  received that month, the slide says so** — a story is never invented and test submissions are
  never used.
- **State at spec time:** mechanics verified end-to-end, but only ONE response exists and it is
  a regression test. The feedback-request emails (`c9ecGsADh9UeDXQ0`, Completed + Paid →
  feedback email) need real completions to flow before this slide has material. Worth watching
  the response rate for a month before the first dry run leans on it.

## Design language v3 (2026-08-04 — Faiz's review of dry run 1, engraved)

Hard rendering rules from the first dry-run review. These apply to every future build:

- **Navigation lives at the top** (arrows + `n / N` counter, top-centre). The bottom edge
  belongs to brandmark (left) · PVV footer (centre) · version stamp (right) — nothing overlaps.
- **Video slide:** the embed must be **verified embeddable at build time** (YouTube error
  150/153 = pick another video) and **clipped with `start`/`end` params to a 2–4 minute
  segment** — nobody watches a 15-minute video in a town hall. The caption names the clip
  length and why it was chosen.
- **Birthdays:** vertical timeline, **earliest → latest** in the month, each row with the
  person's **profile photo** (Lark avatar, fetched at build time and inlined as a data URI so
  the deck stays self-contained), name, role, day+month.
- **Podium recognition:** top-3 recognition uses the portal-leaderboard podium: **gold /
  silver / bronze** blocks (1 centre-tallest, 2 left, 3 right), circular photo with
  metal-coloured ring, crown on #1, points line. Metal palette: gold `#EFC94C→#D4A017`,
  silver `#C6CBD1→#9AA0A6`, bronze `#DA9A59→#B5722F`.
- **Rank badges:** in any top-N list, ranks 1–3 get filled metal badges; the rest maroon.
- **Top-10 pedestal (Faiz, 2026-08-04):** the biggest-hits slide puts **ranks 1–3 on a
  pedestal** — three cards standing on gold / silver / bronze blocks, #1 centre and tallest —
  with title, flag, views, credit chips and watch link on each card, and **ranks 4–10 as the
  compact list below**. The podium metaphor is the same one the people slide uses; people and
  work are celebrated in the same visual language.
- **Flags, not country codes:** SG / MY / ID are rendered as inline-SVG mini-flags wherever
  they label data (lists, cards, growth rows). Emoji flags are banned — Windows renders them
  as letters. Codes may remain inside prose/titles.
- **Platform logos, not abbreviations:** Instagram / TikTok / Facebook rows carry their
  inline-SVG logo marks instead of IG/TT/FB text.
- **Growth figures as pills:** percentage deltas render as right-aligned rounded pills —
  green for growth, muted for flat, maroon-tinted for decline — never bare text in a column.
- **Account cards:** the ALL row is emphasised on a tinted band; platform rows get logos;
  generous padding; one growth pill per row right-aligned.
- **Credit chips:** creator credits render as metal-coded chips — **Produced = gold, Edited =
  silver, Written = bronze** — each with a role-initial disc and the person's name.
- **Charts fill the space:** comparison charts use the 2-column large grid (`chgrid big`),
  not four cramped tiles in a sea of white.
- **Department slide is a card grid:** one card per department — big number, what it counts,
  who drove it; departments without a registered stat get a muted card, honestly labelled.

**Two build lessons from dry-run iteration 2 (2026-08-04) — now rules:**

- **CSS class names must be unique across the whole deck.** The podium's `.pod` class collided
  with the top-10 rows' existing `thr t10 pod` marker and flattened that slide into a 174px
  column. New components get distinct names (`.pdm`), and the build check must fail if a new
  CSS class name already appears anywhere in the deck's HTML.
- **YouTube can never autoplay-embed on n8n-served pages.** n8n cloud sends
  `Content-Security-Policy: sandbox` (without `allow-same-origin`) on all webhook responses,
  so the page has a null origin, YouTube gets no referrer, and every embed dies with error 153
  regardless of the video. Rule: the video slide is a **thumbnail facade** (thumbnail inlined
  as a data URI, house play button) that injects the player on click — it plays inline on the
  portal viewer (real origin) — with a **permanent fallback link** "open the clip on YouTube
  (starts at m:ss)" for the n8n-served links. Never ship a bare `<iframe>` embed.

- **The video slide is exempt from click-to-advance.** The deck's click-anywhere navigation
  must ignore clicks inside `.vframe`, and the facade's click handler stops propagation —
  otherwise pressing play also flips the slide (found by Hakim/Faiz in dry-run iteration 3).
- **Cut straight to the hook.** The monthly video selection process is: pull the talk's
  transcript, find the hook — the 3–5 minutes that carry the idea — and set the player's
  `start`/`end` to exactly that segment, tied to the purpose/values/vision. The caption names
  the hook. Nobody gets the wind-up, everybody gets the point. (August: Sinek's golden circle,
  2:30–6:00, "people don't buy what you do, they buy why you do it".)

## UI language v4 (2026-08-05 — Faiz's second design review, engraved)

- **Video slide (final form):** a plain, always-present player embedded with the clip window
  (`start`/`end`) — no facade, no autoplay, no fallback link. The viewer presses the player's
  own play button; the clip starts at the hook and stops when the point lands.
- **Monthly video selection procedure:** now a standalone hard-hold file —
  **[VIDEO-SOURCING.md](VIDEO-SOURCING.md)** — anchor line from the PVV text → three
  candidates → empirical embeddability check → transcript-derived hook → clip window →
  pick log (no repeats within 24 months). Summary (the file governs):
  1. Shortlist 2–3 talks that speak to the purpose / values / vision (GUIDE).
  2. Pull the transcript of the leading candidate.
  3. Find **the hook** — the 3–5 contiguous minutes that carry the whole idea. Note the exact
     start/stop timestamps and the line the clip must end on.
  4. Verify the video allows embedding; set `start`/`end` to the hook window.
  5. Caption = why this clip, this month + the hook line itself. Log the pick in the build notes.
- **Stat tiles carry emojis** (👀 views · 🎬 posts · ❤️ engagement · 👥 followers · 🧲 leads ·
  📈 growth) — personality, not decoration; one emoji per tile, never in the numbers.
- **Charts are professional, not primitive:** light horizontal gridlines, baseline axis,
  rounded-top bars, maroon gradient for the current period vs neutral grey for the prior,
  value labels above each bar, month labels below, and the % delta in a colour pill placed on
  the empty side of the chart. No bare two-rectangle "PowerPoint" bars.
- **Market comparison is one chart** (three bars, biggest first) with country names and post
  counts under the bars — not three separate stat tiles.
- **Platform tiles carry the platform's icon** (IG / TikTok / FB inline-SVG marks) beside the
  number, replacing text-only labels.
- **Gains carry a rising sparkline** (small stock-style trend line, green up / maroon down)
  next to the +X.XK figure and on growth pills.
- **Per-market winners slide:** three flag-headed columns, metal rank badges, title in large
  type, **views as the highlighted number** (large maroon mono), and the makers as
  **avatar chips — profile photo + name** (producer gold-tinted, editor silver, writer bronze).
- **All creator credits everywhere use avatar chips** (photo + name), replacing initial discs.
  Avatars are fetched at build time and embedded **once each** as a shared CSS class
  (`.av-<key>`), never repeated per chip — repeating data URIs tripled the deck size once.
- **Vertical labels carry icons**: 💼 Business · 🚗 Autos · 💰 Wealth · 🏡 Homes · 🍜 Foodie.
  **Main deliberately has no icon** — it represents the whole, not a vertical.

### Video playback — the full truth (established empirically, 2026-08-05)

- **YouTube rejects embed requests that carry no Referer header** ("Video player
  configuration error" / error 153). This is about the *serving origin*, never the video.
- **Two of our own surfaces can never play embeds:** n8n webhook responses AND Supabase Edge
  Function HTML responses — both platforms stamp a CSP `sandbox` that gives the page a null
  origin, so the browser omits the Referer. Nothing rendered from those URLs will ever play.
- **Surfaces that DO play:** the staff portal (real origin) and the dedicated review host
  **`koocester-dryrun.pages.dev`** (Cloudflare Pages project `koocester-dryrun`, static direct
  upload via `wrangler pages deploy`, `_headers` sets noindex + no-store). Dry-run reviews that
  include video must be hosted there, not on the n8n viewer.
- **Determining the clip window:** pull the talk's transcript **with timestamps**
  (`youtube-transcript-api`), find where the hook begins and the line it must end on, and set
  the player's `start`/`end` (seconds) to exactly that. The player itself enforces the stop.
  August, verified from the transcript: start=100 (1:40 "all the great inspiring leaders…"),
  end=352 (5:52, after "do business with people who believe what you believe").

**Pending from the same review (logged, not yet possible):**
1. **Video thumbnails on the top-content cards** — real IG thumbnails need the Meta Graph API
   path (app "Koocester Reporting" 910717378117369 exists; needs IG tokens wired). Until then
   cards stay text-only; never hotlink instagram CDN URLs (they expire and break the deck).
2. **Client feedback source** — Faiz is checking where feedback should actually be pulled
   from; the Projects-form rule in this spec stands until he says otherwise.

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
| 2026-08-04 | Faiz | Canonical Purpose/Values/Vision text supplied (GUIDE values, purpose statement, Vision 2035, founder's three quotes) — engraved verbatim. Client story source settled: the project feedback forms. Qualified-lead definition proposed (entered `salesqualifiedlead` in month; Jul 9 vs Jun 40) — awaiting confirm + registry row. |
| 2026-08-04 | Faiz | PVV is a **footer on every slide of both decks**, not an opening slide ("we're not gonna look at this every single time"). Full-render layout engraved from the founder-doc screenshots: five-column G·U·I·D·E grid + left-bordered highlight blocks, house palette. Qualified-lead definition **confirmed** and registered in the Metric Registry (`recvrjoebW6CUp`, Trusted). |
