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
