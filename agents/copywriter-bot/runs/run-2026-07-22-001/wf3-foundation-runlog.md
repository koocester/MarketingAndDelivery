# WF-3 Foundation — Build & Run Log (2026-07-27)

**Workflow:** `Du7lxhgeTFe0NvOy` "WF-3 Wealth Carousel Engine v1 (foundation)" (n8n, inactive — manual trigger only, no schedule)
**Vertical chosen for foundation:** Wealth × Singapore (discovery quality proven first; strongest hook archetypes)
**Cadence:** 2 drafts/page/day (CEO-set starting limit — untouched)

## Pipeline (14 nodes, all validated live)
webhook → Lark token → **load used topics (Postgres, 30-day dedup memory)** → **discover** (Google News RSS, `when:7d`, 6 hook-archetype queries, region-locked SG) → **pick 2** (Claude: hook-strength-first scoring, multi-source corroboration preferred, dedup exclusion, must be 2 different subjects, aspirational>scandal) → **notify "sourcing done"** (Lark group) + fetch article text (best-effort) → **write copy** (Claude, reworded-only, source-cited) → **generate covers** (gpt-image-1, no-text editorial images — licensed-stock/generated only per CEO D2; dall-e-3 unavailable on this key) → to-binary → **upload covers to Lark** (multipart via HTTP node; Code-node helpers can't do multipart on n8n cloud) → **store** (Postgres `wf3_drafts`, upsert on topic_key, status `ready_for_review`) → **notify drafts + images** (Lark group).

## Verification runs
- **23489**: 8/9 nodes green; dall-e-3 rejected ("model does not exist") → switched gpt-image-1.
- **23500** (65s): full success, 2 drafts stored + Lark-notified (coffee-run PE millionaire; Forbes self-made women). Images generated (~1MB b64 each) but Lark upload silently failed (Code-node formData unsupported).
- **23521** (64s): **dedup proven** — picked different topics (S Alam). Exposed 2 issues: both picks were angles of ONE story; negative-news bias. Prompt rules added.
- **23540** (79s): **FULL END-TO-END SUCCESS** — 2 distinct topics, copy written, covers generated, uploaded to Lark, posted in group with images, stored. `image: true` on both.
- Post-run tightening: dedup rule upgraded to "same subject/person/company/event = repeat, even re-angled".

## Progress visibility — decision
**Lark group over a custom GUI.** Created group **"Carousel Bot — Content Engine"** (`oc_626942fc82966904546d22adde32df55`, owner Faiz, bot is manager). Rationale: the team already lives in Lark; stage messages (sourcing done → drafts ready, with cover images inline) arrive with zero new hosting/auth/maintenance; Postgres `wf3_drafts.status` is the machine-readable source of truth; a Metabase dashboard (already in stack) can be layered on later if visual reporting is wanted. A custom GUI adds surface area with no reviewer benefit at this stage.

## Supporting assets created
- **Wealth master** `DAHQi69L3SE` "MASTER — Wealth Carousel Template v1" (tokenized, koocesterwealth handles; imagery still placeholder — designer to restyle).
- Postgres `public.wf3_drafts` — drafts + provenance (sources jsonb) + dedup memory + status.

## Known gaps / next
1. Canva population stage (fill Wealth master from wf3_drafts) — same integration gap as WF-1.
2. 1:1 master only; 4:5 (IG/FB) + 9:16 (TikTok) variants pending (CEO D5: render once per unique ratio, reuse).
3. Article-text fetch is best-effort (Google News redirects); synthesis falls back to headlines when blocked.
4. Roll out to Autos/Homes/Foodie/Business after CEO reviews Wealth foundation output quality.

## Addendum 2026-07-27 — Image policy v2: REAL photos (CEO: AI images not good enough)
- CEO instructed real photos "no matter what, press photos, AP, Reuters". **Press/agency photos REFUSED** (unlicensed AP/Reuters/Getty republication = systematic copyright infringement; agencies actively enforce). Licensed-real-photo path built instead.
- Image stage rewired: gpt-image-1 generation REMOVED -> **Openverse API** (Wikimedia Commons/Flickr etc., commercial-use CC licenses, no API key, real photographs, >=1200px, largest-first). Synthesis now emits an image_query per draft (concrete scene, never person names). Full attribution (license|creator|source URL) stored in wf3_drafts.image_provenance and echoed in Lark notify; photo credit to be added at publish where license requires.
- Run 23633 (51s): dedup held under tightened same-subject rule (2 fresh topics: Gen-Z property millionaires; hawker-to-seven-figures). Draft 2 got a real CC-BY Wikimedia photo, uploaded + posted in Lark group. Draft 1 found no suitable photo -> correctly flagged "NONE FOUND - needs manual image". TODO: multi-query retry/broadening to raise hit rate; ratio crops (4:5/9:16) happen at Canva master population from the stored hi-res original.

## Addendum 2026-07-27 (2) — v3: local outlets, 5 images/carousel, dashboard cards
- CEO feedback: 1 image insufficient (need 5, per-slide relevance like b-roll placement); Google RSS alone insufficient (want Mothership/ST/CNA direct + MY/ID locals at rollout); Lark updates must be structured dashboard cards with a Canva button, not text.
- Clarified: crediting (watermark) does NOT license press photos - attribution-based use is only legal for CC-licensed works; credits overlay applies to those. Paid agency (Getty/iStock) subscription = legal route to real press photos if wanted.
- Built: discovery now merges Google News hook-queries + DIRECT feeds (CNA outbound RSS, ST Business, ST Singapore, Mothership /feed) with 7d + topical filter; synthesis emits image_queries[5] (per-slide relevant scenes) + relevance rule; image stage fetches up to 5 CC photos per draft (broaden-retry, 1.1s pacing); wf3_drafts gains images jsonb + canva_link; Lark notify now sends INTERACTIVE CARDS: red header, slide-by-slide markdown (headline, slides 2-5 title+body, hook, caption), embedded photos with credits, source buttons, Canva button (placeholder until population stage), per-slot missing-image warnings, credit note.
- Run 23920 (91s, success): 2 fresh topics (EV-charger career pivot; retail private markets) - dedup held 5th consecutive run. Images 2/5 per draft: free CC pool is thin for specific scenes. Options to raise hit rate: free Pexels/Unsplash API keys (huge real-photo libraries, credit-friendly), or paid stock/agency. Canva button is placeholder until the population stage is built.

## Addendum 2026-07-27 (3) — subject-specific images (CEO: no stock; show the actual person/company)
- Reviewed production carousel imagery in Canva (Daniel Lim Wealth): page 1 = the subject himself, p3 = SpectacleX's actual store/signage, p7 = the brand's own campaign photos. Subject-specific, not stock.
- Verified Openverse HAS this for public figures: "Jensen Huang Nvidia" -> 36 real photos incl. 4032px CES 2025 keynote shots, CC0/CC-BY. The pipeline's own "never use person names" rule was causing the generic results - removed.
- New rule: image queries MUST name the story's subject (person/company/place) when they are a public figure; cover must feature the subject. Generic scene only for private individuals.
- Sourcing tiers going forward: (1) public figures/companies -> CC event/press photos via name search, automated with credit; (2) big-brand assets -> official newsroom/press-kit media where provided; (3) private local subjects (SME owners etc.) -> bot flags "needs manual image" and the copywriter drops in subject photos exactly as today (their editorial call). Press/agency photos remain excluded.

## Addendum 2026-07-27 (4) — foundation reset: single-draft mode, clean slate
- CEO: one solid draft only; wipe the group; foundations (sourcing + pictures) before execution.
- Group wiped via one-off cleanup workflow qtIjjMkl8vv2BHwv (24/26 messages deleted; 2 undeletable Lark system notices). Engine set to 1 draft/run.
- Foundation run 24414 (53s): ONE card posted - "HSBC's Singapore Hiring Spree: 100 AI Experts, 100 Wealth Managers Wanted", sourced DIRECT from Straits Times Business feed (new direct-outlet path working). Copy quality solid: specific headline, 4 substantive slides naming real execs (Elhedery, Wong Kee Joo, David Rice), hook, CTA caption - all traceable to the article. Subject-specific image queries per new rule ("HSBC Singapore office building" etc.).
- Images 2/5 posted; run exposed 2 defects, both fixed: (1) single broaden-retry insufficient -> now 3-tier query broadening + try top-3 candidates; (2) Lark 10MB image limit silently killed an oversized Wikimedia skyline photo after successful download -> now size guard + thumbnail fallback. Fixes apply from next run (not re-run today to keep exactly one card in the group).

## Addendum 2026-07-27 (5) — FOUNDATION LOCKED: 5/5 real subject photos
- CEO caught an AI/concept image in prior card (Flickr CC0 "Disruptions on the Horizon" - policy-report concept art, zero HSBC relevance). Root causes: abstract queries + Flickr CC0 pool contaminated with AI dumps.
- Fixes: Wikimedia-first sourcing; junk/AI/concept filters (title regex + suspicious-creator heuristic); queries must name photographable real things anchored to the story subject; guaranteed-fill tier ladder (exact -> broadened -> subject anchors -> vertical defaults, never empty); no image reuse across slides; robust JSON extraraction for single-story mode; Code-node 60s timeout fixed via parallel per-slide processing + mid-size photo preference.
- Final run 24535 (42s, success): ONE card in clean group, HSBC topic re-done, **5/5 real licensed photos**: HSBC HQ building (Bjoertvedt/Wikimedia), HSBC building alt views for exec/RM slides (no CC photo of Wong Kee Joo exists - subject-anchored fallback), HSBC technology office (Phuan Yan Penh), Raffles Place (Calvin Teo). All CC-BY-SA with credits recorded for the bottom-right credit overlay at Canva stage.

## Addendum 2026-07-27 (6) — ground rules: no image reuse ever; source dates visible
- CEO caught duplicate images within one carousel. Root cause OWNED: parallel per-slide processing raced the used-image check. Fixed: sequential claiming + triple dedup (image URL, source page, AND photographer - one photographer max per carousel, so no near-identical series repeats).
- Source freshness made visible: pipeline was already 7-day-limited (when:7d + feed pubDate filter, now belt-and-braces on ALL candidates incl. Google items); cards now display each source's publication date, and image alt-text shows each photo's actual title + credit.
- Title-relevance ranking added after catching a Jewel Changi photo standing in for "HSBC office" (real photo, wrong subject).
- Verification run 25088 (42s): ONE card, HSBC topic, source "Straits Times Business - Mon 27 Jul 2026" (published same day), 5/5 DISTINCT images / 5 different photographers: HSBC Building Collyer Quay (cover), Jewel Changi (weak), HK street (weak), HSBC Private Bank interior, Marina Bay financial district. 3 strong / 2 weak.
- Final tightening: non-default search tiers now REQUIRE the subject token (or a meaningful non-'singapore' query word) in the photo title; otherwise slot falls through to on-theme vertical defaults (Raffles Place, financial district, SGD notes) - so "as close as possible" fallbacks are always on-theme, never loosely-matched randoms. Applies from next run.

## Addendum 2026-07-27 (7) — EXECUTION STAGE: first full carousel built in Canva
- Built the first end-to-end WF-3 carousel: **DAHQpQZOfkY** "Wealth SG - HSBC Singapore Opens 200 New Jobs" (7 slides), copied from Wealth master DAHQi69L3SE, all tokens filled from wf3_drafts, all 7 image frames filled with real licensed photos.
- **Key blocker solved:** Canva's asset fetcher is blocked by Wikimedia (403 - Wikimedia requires a descriptive User-Agent), and also failed on picsum/openverse-thumb. Verified the fetcher itself works (gstatic OK). Fix: fetch the already-public CC images through the images.weserv.nl image CDN with `&output=jpg`. Note: inner URLs containing commas/ampersands break the proxy query string -> prefer clean filenames or encode. Also learned Openverse URLs must be quoted exactly (summarised fetches can hallucinate paths) - verify before upload.
- Images: 7 distinct photos, 7 distinct photographers (Bjoertvedt HSBC Collyer Quay SG cover, Calvin Teo Raffles Place, Jachimova data centre, Clive Power HSBC Tower, JeCCo SG skyline, Chensiyuan SG sunset, WiNG HSBC HK). No reuse anywhere.
- Design work beyond token-fill that the automated stage must replicate: body font 64->28/30 (template default overflows), reposition/resize body boxes to fit 1080 canvas, white text on dark, inserted a 50% black scrim on slide 4 for contrast, deleted the inherited guest-portrait circle (no guest in a news story), rewrote the CTA line ("Full story and sources in the caption").
- Compliance: consolidated credits block + "Source: The Straits Times, 27 Jul 2026" bottom-right on the final slide.
- wf3_drafts.canva_link set; status = in_canva_ready_for_review; review card with working Canva button posted to the Lark group.
- Remaining: 4:5 (IG/FB) + 9:16 (TikTok) ratio variants; automating this fill inside n8n (Canva edit API is only reachable via the MCP connector today, so this stage is agent-driven).

## Addendum 2026-07-28 — Autos consistency run, Canva link bug, and JOB 1 B-ROLL BREAKTHROUGH
- **WF-3 parameterised**: vertical + region now come from webhook query (?vertical=Autos&region=SG). Hook archetypes, topical filters and image fallbacks defined for all 5 verticals; MY (The Star, Malay Mail) and ID (Detik) feeds wired for rollout. Autos run 30722: "COE Shake-Up: What Merging Car Categories Could Mean for Your Next Ride", 5/5 images, distinct from Wealth topics. Consistency across verticals confirmed.
- **BUG FIXED - dead Canva link**: I had constructed `canva.com/design/{id}/edit` by hand; Canva's real link is the `edit_url` it returns (`canva.com/d/AdQz-aQa8HhadsE`). DB corrected, working link reposted to Lark. RULE: always persist the edit_url returned by copy-design/read-design, never build the URL.
- **JOB 1 B-ROLL SOLVED (no Frame.io, no ffmpeg)**: b-rolls live at `<Raw File Link folder>/B rolls/*.mov` (copywriter hand-picked clips). Built WF-1 B-roll Extractor (n8n iZtU1ORkvwICClP8): Drive API lists the video folder -> finds the "B rolls" subfolder by name -> lists clips -> uses Drive's AUTO-GENERATED VIDEO THUMBNAIL (`thumbnailLink`, upscaled =s220 -> =s1600) as the still frame. Run 30793 on VID-0218 Soto Tangkar: 35 clips found, **35/35 with usable stills**, metadata incl. duration + resolution (1080x1920, some 4K).
- Verified end of chain: a Drive still uploaded to Canva successfully (asset MAHQpykBsGo, 900x1600) and Canva's own tagging read it as "restaurant, cafe, food" - i.e. genuine on-topic footage from the shoot. Job 1 can therefore use real b-roll imagery with no video processing at all.
- Note: b-roll folders contain duplicate filenames (same clip, different file IDs) - dedup by name when selecting.

## Addendum 2026-07-28 (2) — JOB 1 COMPLETE END-TO-END (CAR-1264 Soto Tangkar)
- Built n8n **VF55P3O7QpwBRjbM "WF-1 Job 1 End-to-End"**: pending queue -> transcript attachment download+parse -> Claude copy (language matched to transcript) -> Drive b-roll folder -> Drive video thumbnails as stills -> Postgres `wf1_drafts` -> Lark card. Run 31013 success (34s).
- Perf fix: first version made 1 Lark call per queue record and hit the 60s Code-node cap. Rewritten to 2 bounded calls (all transcript-bearing videos once, queue once, intersect in memory).
- Result: **CAR-1264 (Business, Indonesia)** drafted from VID-0218 transcript (3,761 chars). Copy is in Bahasa Indonesia matching the interview, with real specifics: Rp300rb/day -> Rp10jt across 3 cabang, Iga Hot Plate recipe, SDM struggles, ibadah framing.
- Canva build **DAHQqL37ylE** (edit_url https://www.canva.com/d/0ok-dbTjbwO5k2o) from the Business master: 6 distinct real b-roll stills from the 35 clips the copywriter hand-picked; no stock, no AI, no reuse. Cover shows the actual warung with customers.
- **Written back to Lark on CAR-1264: Canva Link + Caption** (existing fields only, no schema changes). Stage deliberately NOT changed - brief says "In Review" which does not exist; awaiting CEO mapping (recommend Amendments Needed).
- Template lessons for automation: delete the layered duplicate cover rect (causes a visible seam with portrait stills); master pages 6-7 backgrounds must also be filled (need 6-7 stills, not 5) or inherited Autos imagery shows; slide-6 crop needs a sensible default.
