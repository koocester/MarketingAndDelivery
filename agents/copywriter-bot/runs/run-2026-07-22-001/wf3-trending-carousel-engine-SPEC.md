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

## Decisions (CEO-resolved 2026-07-24)
- **D1 — Approved-sources policy shift → APPROVED.** Bot may use external web/news sources for WF-3 drafts; mandatory human review (copywriter checks context) is the safeguard.
- **D2 — Photos → RESOLVED: licensed stock OR generated images only. NEVER press/article photos.** No republishing BBC/CNN or any article imagery. Use a licensed-stock API and/or image generation, keyed to the carousel topic.
- **D3 — Factual/repro rules (standing).** Synthesis must be substantially reworded (no copy-paste of article text), source-cited in provenance, and human-verified. Bot flags anything uncertain; never invents claims.
- **D4 — Pages in scope → ALL five verticals:** Autos, Homes, Business, Foodie, Wealth. 5 carousels per page per day. (True daily total = 5 × number of live pages across these verticals/countries — size against Canva/API quotas at build.)
- **D5 — Aspect ratios → Instagram, TikTok, Facebook.** Render once per UNIQUE ratio and reuse across any platform sharing it (dedupe). Working set: 4:5 portrait (IG feed + FB) and 9:16 (TikTok); confirm exact per-platform ratios at build. NOTE: current tokenized masters are 1:1 (1080×1080) — WF-3 needs 4:5 and 9:16 master variants per vertical (Canva resize + re-tokenize).
- **D6 — "Trending" definition & recency window.** STILL OPEN: how trending is judged (news volume / recency / region) and how fresh a story must be. Propose at build.

## Note — TWO PARALLEL JOBS (both human-reviewed, bot never publishes)
- **Job 1 = WF-1 (original brief):** carousels from APPROVED sources already in Lark — video transcript (needs the Frame.io/AssemblyAI transcript stage) or a Marketing-linked article; images = copywriter's hand-picked b-roll from the Google Drive folder. Per-vertical tokenized masters, 1:1 today.
- **Job 2 = WF-3 (this spec):** daily 5-per-page carousels from web-discovered trending articles, clustered across 2+ sources, synthesized, with licensed-stock/generated images, in IG/TikTok/FB ratios.
WF-3 is net-new and does not change WF-1. Only D6 remains open; D2 photo-rights gate is now resolved (stock/generated only).
