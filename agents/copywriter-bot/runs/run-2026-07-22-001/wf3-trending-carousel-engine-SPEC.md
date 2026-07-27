# WF-3 — Daily Trending-Article Carousel Engine (PROPOSAL / needs sign-off)

**Status:** DRAFT — not built. Captured 2026-07-24 from CEO verbal brief. Distinct from WF-1 (which drafts from *approved sources already linked in Lark*). This engine **discovers its own sources from the open web**, which is a deliberate change to the "approved sources only" guarantee and needs explicit CEO approval + legal sign-off (see Decisions).

## Goal
Each day, auto-produce **5 carousel drafts per page**, per that page's niche, so copywriters only *check* (photos + context + grammar) rather than create.

## Pipeline (proposed)
1. **Per page → niche.** Each Koocester IG page has a vertical/niche (Homes, Autos, Wealth, Foodie, Business × country). Drive discovery off that niche.
2. **Discover trending articles** for the niche from multiple reputable sources (e.g. via SerpAPI Google News — credential already in n8n — and/or curated RSS per niche).
3. **Cluster by topic across sources.** Only proceed on a topic when **2+ independent sources cover it** (e.g. BBC + CNN both on the same story). Never build a carousel from a single article — combine the matching ones for a fuller, corroborated piece.
4. **Synthesize the carousel** from the combined sources: hook + slides + caption, with the token schema of the page's Canva master. Cite/record every source URL as provenance.
5. **Images:**
   - Prefer image references *within the chosen articles* (take the image URL from the article).
   - If none suitable, find a complementary image that fits the carousel's context.
   - (⚠️ copyright gate — see Decisions D2.)
6. **Aspect ratios:** produce Instagram ratio (carousel 4:5 = 1080×1350, or 1:1) and the ratios other target platforms expect. Masters/templates per ratio, or Canva resize.
7. **Populate the page's locked Canva master** (per-vertical tokenized master — same mechanism as WF-1). "Stick to the template for each carousel."
8. **Hand to copywriter** for review (photos + context + grammar); human approves before publish. Bot never publishes.

## What already exists to build this
- **SerpAPI** credential in n8n (`JjuDwN40V66Djiaj`) → Google News / trending queries per niche.
- Per-vertical **tokenized Canva masters** + template registry (Autos `DAHFXgXxLJA`, Business `DAHQSvU43Cs`) and the copy-and-edit population path (proven).
- Anthropic credential for synthesis; Postgres drafts table; Lark write-back pattern.
- Pages table in Lark (`tblUscIBwxElzzXi`) maps page → vertical/country/niche.

## Decisions required before build (material)
- **D1 — Approved-sources policy shift.** Original brief = approved sources only. This engine pulls from the open web. Confirm the bot may use external news sources for drafts, with mandatory human review as the safeguard.
- **D2 — 🚩 Photo copyright (highest risk).** BBC/CNN/press images are almost always copyrighted; reusing them (even by hotlink) on Koocester's socials is a licensing/legal exposure, not just a technical step. Options: (a) use only license-cleared/stock/owned imagery + a licensed stock API; (b) generate images; (c) restrict to sources that grant reuse. **Recommend NOT republishing press photos.** Needs your explicit direction.
- **D3 — Factual/repro risk.** Synthesizing news = making claims + paraphrasing copyrighted text. Rules: substantially reworded (no copy-paste), source-cited, human-verified. Bot marks anything uncertain.
- **D4 — Volume.** 5/page/day × number of live pages could far exceed the original ~27/day target and Canva/API quotas. Confirm which pages are in scope and the true daily total.
- **D5 — Aspect-ratio set.** Which platforms/ratios exactly (IG 4:5 + 1:1? TikTok 9:16? FB?), and do we build a master per ratio or use Canva resize?
- **D6 — "Trending" definition & recency window.** How is trending judged (news volume, recency, region), and how fresh must a story be?

## Note
This is a net-new workflow (WF-3), parallel to WF-1. It does not change WF-1. Build only after D1–D6 are answered; D2 (photo rights) is a hard gate.
