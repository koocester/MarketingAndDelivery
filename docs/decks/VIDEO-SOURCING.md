# Town Hall inspirational video — monthly sourcing procedure (v1)

Written **2026-08-05** after the August 2026 pick was reviewed and approved in dry run.
This file is the **hard hold**: every month, the Town Hall's opening video is sourced by
running this procedure exactly. It is not a vibe check — every step produces an artefact
(a theme, a candidate list, a transcript, two timestamps, a log row) that the build consumes.

Read [TOWN-HALL-SLIDES.md](TOWN-HALL-SLIDES.md) for where the slide sits in the deck and its
rendering rules (plain player, `start`/`end` clip window, no autoplay, no facade).

---

## The idea in one line

**Don't search for "inspirational videos." Start from Koocester's own words, and find the
talk that says the same thing better.**

The canonical Purpose · Values · Vision text (in the Town Hall spec) is the source of themes.
August's pick worked because the purpose paragraph — *"We exist to be the growth partner
businesses trust to deliver outcomes that matter"* — **is a Why statement**, and Sinek's
golden circle is the definitive talk about leading with Why. The video wasn't found; it was
*matched*.

## Monthly procedure

### 1. Pick the month's anchor line

Take ONE line from the canonical PVV text to anchor the month. Rotate so the year covers the
whole page — the five GUIDE values, the purpose statements, and Vision 2035:

| Anchor pool | Example lines |
|---|---|
| **G** — Growth & Curiosity | "find their true north" |
| **U** — Uniting through trust and relationships | "Win the hearts of people, win everything." |
| **I** — Impact through inspiration | "Symbol of Inspiration." |
| **D** — Dare to be bold and innovate | "To get something you never had, you have to do something you never did." |
| **E** — Empathy and Giving | "Powered by People." / "Our culture is the product." |
| Purpose | "the growth partner businesses trust to deliver outcomes that matter" |
| Vision 2035 | "inspiring over 1 billion people annually" |

Tie-breaker: if the month had a clear theme (the went-wrong slide, a big rollout), prefer the
anchor that speaks to it — the video should feel like it was chosen for *this* month.

### 2. Generate three candidates

Three talks whose **core idea matches the anchor line** (not the mood — the idea). Prefer, in
order: TED / TEDx official uploads · official speaker or institution channels · reputable
conference channels. Note for each: speaker, talk, channel, YouTube id, and one line on why
it matches the anchor.

### 3. Verify embeddability — empirically, never assumed

- YouTube rejects embeds whose page sends no Referer (error 153), and some owners disable
  embedding entirely. A curl of the embed page **always** shows "configuration error" (curl
  sends no Referer) — that tells you nothing.
- **The only real test:** load the embed on a real-origin page (the `koocester-dryrun.pages.dev`
  review host, or the staff portal) and see the player render. Do this before investing in the
  transcript.
- Known dead ends: Jobs' Stanford address (owner disabled embedding); anything rendered from
  n8n webhooks or Supabase Edge Functions (platform CSP sandbox → null origin → no Referer,
  ever). See TOWN-HALL-SLIDES.md § Video playback.

### 4. Pull the transcript, with timestamps

```bash
pip install youtube-transcript-api
python - <<'EOF'
from youtube_transcript_api import YouTubeTranscriptApi
tr = YouTubeTranscriptApi().fetch("<VIDEO_ID>", languages=["en"])
for s in tr:
    print(f"{int(s.start//60)}:{int(s.start%60):02d}  {s.text}")
EOF
```

Every sentence arrives with its exact second. This is the ground truth — **never set
timestamps from memory** (the August window was first guessed at 2:30–6:00 from memory; the
transcript proved the real hook runs 1:40–5:52).

### 5. Find the hook

The hook is **3–5 contiguous minutes** satisfying all of:

1. **Starts where the idea is first stated** — not the wind-up, not the speaker's biography.
2. **Ends on the strongest line**, the one the room should sit with — and *before* the talk
   changes register (August: end before the brain-biology section).
3. **Standalone** — someone who never sees the rest of the talk still gets the whole point.

Record: start second, end second, and the exact closing line.

### 6. Build the slide

- **Use the YouTube IFrame Player API, not a bare embed** (found 2026-08-05: the plain
  `end` URL parameter is unreliable, and a hidden slide keeps its iframe playing). The slide
  loads `https://www.youtube.com/iframe_api` and creates the player
  (`host: youtube-nocookie.com`, `playerVars: {start, end, rel:0}`) with two guards:
  1. **Hard stop:** on PLAYING, a 250ms watchdog reads `getCurrentTime()` and calls
     `pauseVideo()` at the end second — belt and braces on top of the `end` param.
  2. **Slide-change pause:** a MutationObserver on the video slide's `class` pauses the
     player the moment the slide loses `active` — no audio bleeding into the next slide.
  Both verified mechanically in Chrome (stop landed at exactly the end second; player state
  PAUSED after slide change). No autoplay, no facade, no fallback link.
- This is the deck's one permitted external script — video requires the network anyway.
- Caption: why this clip this month (name the anchor line) + the hook's closing line +
  "timestamps taken from the talk's transcript."

### 7. Log the pick (below) — the no-repeat register

A video is never reused within 24 months. The log is also where next month's builder sees
which anchors are already covered.

---

## Pick log

| Month | Anchor | Talk | Video id | Clip | Ends on |
|---|---|---|---|---|---|
| Aug 2026 | Purpose — "the growth partner businesses trust…" (a Why statement) | Simon Sinek, *How Great Leaders Inspire Action* (TEDx) | `qp0HIF3SfI4` | 1:40 → 5:52 (`start=100&end=352`) | "The goal is to do business with people who believe what you believe." |

## Change log

| Date | Who | Change |
|---|---|---|
| 2026-08-05 | Faiz | Procedure engraved after approving the August pick: source from the PVV anchor line, verify embeddability empirically, transcript-derived hook, clip window enforced by the player, monthly log as no-repeat register. |
