# Build Log — 2026-07-23 (post-approval session)

Approvals received: E3 yes (Postgres tables), E2 pilot = Wendi Amalia, E4 build go-ahead. E1 pending (Faiz), E5/E6 parked.

## E1 investigation (via Chrome, logged-in Poppy AI session)

- Account is logged in at app.getpoppy.ai; boards exist per vertical (Koocester Business, Koocester Homes seen).
- The "APIs" nav item routes to getpoppy.ai/api-launch: **the API requires the Power User plan**.
- Current plan: 2,000 credits/month (876 used at check time).
- Plan ladder seen in the in-app upgrade modal: Starter $99/mo ($1,188 annually, 2x limit) · Creator $189/mo ($2,268 annually, 4x limit, "most popular") · **Power User $399/mo, 8x limit (16,000 credits/month), includes APIs, Chatbots/Agents, 5 team members, unlimited brand profiles, "save $40/mo with bulk pricing"**.
- No public API docs found on the launch page; support contact support@getpoppy.ai.
- No purchase was made. Decision for Faiz: upgrade ($399/mo) for the direct API, or run Playwright/assisted mode on the current plan.

## Built (inactive, dry-run defaults)

- n8n `BGwVPFaCAK2o4zoB` — "Storyboard Copilot — W1 Drafting (pilot: Wendi)", 25 nodes, validation clean. dryRun=true (creates draft doc, does NOT touch the Video record), pilot-gated to Strategist "Wendi Amalia", claim-table concurrency, self-check + one regen pass, conflict-checked URL write, strategist DM. Anthropic credential `Anthropic API – Koocester`, model claude-sonnet-5 (config).
- n8n `Wn8b9rOQcDRhqF6E` — "Storyboard Copilot — W2 Winners → Poppy AI (weekly)", 13 nodes, validation clean. Assisted mode: joins content_perf.reels winners to Video records by post-URL keys, stages a weekly package doc, ledger-deduped, optional digest DM.
- Both: errorWorkflow ReSF67JnUkuFRkCZ, Asia/Singapore, created inactive.

## Blocked / outstanding before dry-run

1. **Migration not applied** — Supabase write blocked by the local permission layer. SQL saved at `deliverables/migration-copilot-tables.sql` (target project wnerzolcmjrsktfqferw). W1's claim node and W2's ledger nodes need it.
2. **Config fills** (in each workflow's Config node): `patternSnapshotDocs` (vertical → Lark doc_id of the human-exported Poppy pattern snapshot), `docUrlBase` (tenant Lark docs domain), W2 `digestReceiveId`.
3. **winnersQuery scoping** — content_perf.reels page/date column names unverified (read also blocked); queries default to top-by-views with no window. Tighten to per-page + trailing 90 days once columns are confirmed.
4. Poppy pattern snapshot export per vertical by Wendi (assisted-mode read path prerequisite).

## 2026-07-23 session 2 — migration applied, queries tightened

- E3 migration APPLIED to Supabase project wnerzolcmjrsktfqferw after Faiz allowed write actions: `copilot.storyboard_claims` and `copilot.poppy_uploads` verified present.
- `content_perf.reels` columns verified: page ("Koocester <Vertical>"), country (full name), published_date, engagement_rate, interactions. Data fresh through 2026-07-22, ~4,000 rows across 16 page-country combos.
- W1 Query Winners now scoped: page + country from the record, trailing 90 days, ranked by engagement_rate then views. Find node also pulls Country. Validation clean (0 errors).
- W2 winnersQuery tightened the same way; digestReceiveId set to Faiz (ou_736421e1336c81d49c44a784a641f621).
- Discovery: the 19 existing storyboard links in the Videos table are all GOOGLE DOCS, not Lark docs, despite the field description mandating Lark docs. Open question for Wendi/Faiz: keep W1 creating Lark docs (documented intent) or switch to Google Docs (actual practice; n8n has the "Koocester Docs" credential). If Lark: still need the tenant docs domain for docUrlBase.
- No records currently eligible for dry-run (0 in Planning with transcript + empty storyboard); dry-run waits for Wendi's next planned video.

## 2026-07-23 session 3 — Google Docs switch, Poppy snapshots bootstrapped

- Faiz decisions: storyboard output = Google Docs (matches the 19 existing gdoc storyboards); E1 = assisted mode for now, with an API-necessity assessment requested; snapshot bootstrap approved.
- W1 rewired: draft doc now created via Google Docs nodes ("Koocester Docs" credential, My Drive root), URL format docs.google.com/document/d/<id>/edit. W2 package doc likewise. Both validate clean (27 and 16 nodes, 0 errors).
- Poppy pattern snapshots bootstrap v0: extracted all five Poppy boards via Chrome (Business, Homes, Wealth, Autos, Foodie), distilled framework + benchmarks + hook/CTA patterns into five Lark docs (tenant vsgnkzk9zjnt.sg.larksuite.com), tokens wired into W1 Config patternSnapshotDocs. Read path verified via tenant-token raw_content.
  - Business MIM6dg6RroEguax416JllFlrgVb · Homes OsvCdITeyoPbJJxtlijlQj3HgH6 · Wealth HCKEd44xTogFKPxpxYDlzNtigLh · Autos VpNJd1FjVoYXaTxQK3VlknhNg4f · Foodie Hsg6dXTTXoYDiAxFjGMl5gdVgnf
- Boards discovery: each board carries the same operating system — benchmark groups (virality, lead-gen, gold standard incl. the Snoopy formula), losing-video groups, past storyboards, the GUIDE + template PDFs, and a per-vertical strategist prompt with Step 0 Lead-Gen/Awareness classification, CTA tiers, per-section gating checklists and a compliance checkbox. The snapshots encode this.
- Remaining before pilot: a real Planning-stage video with transcript (Wendi's next one) → trigger W1 dry-run.

## 2026-07-24 — eligibility check

- 183 videos in Planning (majority Wendi's), ZERO with a transcript attached — nothing eligible for the dry-run yet. Transcript upload is evidently not part of the strategists' current flow; the pilot introduces it.
- Nearest shoot: VID-0543 Homes SG Key Concept SG, shoot date Sun 26 Jul — natural first pilot once Wendi attaches her discovery-call transcript. VID-0570..0572 (Soulbrix, Lead Generation) are good early candidates to exercise the offer path.

## 2026-07-27 — DM blocker found (bot availability scope)

- Re-checked eligibility: still 0 Planning records with a transcript attached.
- Attempted to DM Wendi (ou_1385847fff7c4a3a3fb456dbbc40a699) the transcript reminder via the Lark bot (app cli_aa914316d6b8deed). FAILED: code 230013 "Bot has NO availability to this user." The app's availability scope does not include Wendi.
- IMPACT ON PILOT: W1's "Notify Strategist (DM)" node uses the same bot and will fail the same way until scope is fixed. Wendi would never receive the "storyboard ready" DM. BLOCKER for the pilot notification path (new E-item).
- FIX (admin, Faiz): Lark Admin Console → app cli_aa914316d6b8deed → availability scope → include Wendi or all employees. Then W1 DMs work and the reminder can be resent.
- Reminder to Wendi: Faiz will pass it to her directly this round; no DM sent by the bot.

## 2026-07-27 (later) — WORKFLOW MISMATCH found: transcripts live in Poppy, not the Lark record

- Wendi reported placing "Transcript & Meeting notes" in the Content Planner box of the Koocester Business Poppy board. Verified via Chrome: the board's Content Planner group holds:
  - Karen (Drapery and Co / The Vinyl House): "Meeting transcript_ ...2026-07-27.docx" + "AI notes_ ...Jul 27 2026.docx"
  - Dongpeng: "Meeting transcript_ Dongpeng Storyboard Discussion 2026-07-23.pdf" + "AI notes_ ...pdf"
- Cross-checked Lark Videos table: Dongpeng = VID-1800 (Business MY, Audrey, Planning) — record EXISTS but transcript is NOT attached to it (only in Poppy). Karen/Drapery/Vinyl House = NO Lark Video record at all.
- KEY FINDING: the strategists' real habit is to drop the transcript + AI notes (PDF/DOCX) into Poppy's Content Planner group on the board — NOT as a TXT on the Lark Video record's "Meeting Transcript (TXT file)" field, which is what W1's current trigger watches. This matches the mission brief's spirit ("Poppy AI already holds the storyboard work") but not W1's plumbing.
- CONSEQUENCE: the current build will not auto-trigger from what Wendi actually did. Fork to decide with Faiz: (A) keep W1, ask strategists to also drop a TXT on the Lark record; (B) re-point the copilot to read transcripts from Poppy's Content Planner (matches habit, needs browser automation, fuzzy file→VID match); (C) manual proof dry-run now using an existing transcript to demonstrate draft quality regardless of trigger.
- Format note: transcripts are PDF/DOCX, not TXT — the drafting input handling must parse those, not assume TXT.

## 2026-07-27 (later 2) — proof-draft attempt + two big findings

- Faiz decisions: (1) re-point copilot to READ transcripts from Poppy Content Planner (match strategists' real habit); (2) produce a proof draft now.
- Opened the Business board Content Planner via Chrome. Confirmed the transcript files (Karen: Drapery and Co / The Vinyl House, .docx + AI notes; Dongpeng: .pdf). Karen = a Homes-vertical business (curtains/vinyl flooring), fits Wendi's SG patch better than Dongpeng (Audrey, Business MY, VID-1800).
- FINDING A (blocks clean automation): Poppy renders transcript files in a viewer that does NOT expose text to browser automation (get_page_text/read_page return the board, not the doc). Poppy has no API. So the "read from Poppy" re-point is technically hard — extracting a transcript programmatically from Poppy is not straightforward. Likely need the transcript via its original source (AI notetaker / Lark / download), not scraped from Poppy.
- FINDING B (strategic): Poppy Chat on these boards is ALREADY generating full, high-quality GUIDE-structure storyboards (saw complete outputs for Jackeline, Felicia/Yuanyii, Lumiere Wellness, ~Jul 20, "Claude 5 Sonnet"), with Step 0 classification, arc checklists, consolidated compliance flags. The strategists' real flow: drop transcript into Content Planner → run Poppy Chat (wired to GUIDE + benchmarks) → storyboard out. This means W1 (re-implementing generation in n8n with Claude + snapshots) partly DUPLICATES what Poppy already does well. The copilot's non-duplicative value is orchestration (get transcript in, trigger, capture output, write to Lark record, move stage) + the winners→Poppy loop, not re-doing generation.
- OPEN DECISION for Faiz: proof draft is blocked on getting the transcript text out of Poppy. Fastest reliable path = Faiz/Wendi hands over the Karen transcript (paste or drop the .docx into the CS folder) and the copilot drafts from it immediately. Alternatively drive Poppy Chat itself (matches real flow, uses Poppy credits). Bigger architecture question raised by Finding B to settle separately.

## 2026-07-27 (course-correction) — re-grounded in the mission brief

- Faiz challenged whether we drifted. He is right. Re-read the brief (Section 1): "The engine is Poppy AI. Poppy AI already holds the storyboard work... The copilot feeds it a structured call transcript, drafts the storyboard from Poppy AI's patterns into the M&D base Video table, and continuously uploads winning videos' stats back into Poppy AI."
- DRIFT ACKNOWLEDGED: W1 was built to re-generate the storyboard independently in n8n (Claude + scraped pattern snapshots). That was meant to be the no-API FALLBACK (brief §18), but it was being treated as the primary engine — turning the copilot into a second generator that competes with Poppy. Not the brief's intent.
- CORRECT ROLE (per brief): copilot = feed transcript to Poppy → Poppy (the engine) generates → place storyboard into the Lark Video record → push winners back to Poppy. Human runs the call + approves. Where Poppy has no API, a human-assisted click is explicitly sanctioned (brief §18).
- TRANSCRIPT SOURCE CLARIFIED by Faiz: transcripts are born in the Lark video meeting-assistant bot, then uploaded into Poppy's Content Planner by the strategist. So the copilot should read the transcript FROM LARK (the source), NOT scrape Poppy. My earlier attempt to extract from Poppy was going downstream; Poppy's viewer hides text + no API, which is moot once we read from Lark.
- NEXT STEP: locate where the Lark meeting-assistant bot stores transcripts (Lark Minutes / a Lark doc / drive) and confirm the Lark MCP can read one directly. That is the real input tap for the mission-brief version. Then reconsider whether to keep the n8n generator at all vs. orchestrating Poppy's own generation.

## 2026-07-27 (transcript source FOUND in Lark) — mission-brief-faithful input tap confirmed

- Faiz confirmed transcripts are born in the Lark video meeting-assistant bot. VERIFIED: that bot stores each session as Lark docx documents named "Meeting transcript: <title> <date>" and "AI notes: <title>".
- PROVEN read access: docx_builtin_search (useUAT true) finds them; docx rawContent (useUAT true) returns the FULL transcript (speaker names, timestamps, dialogue). Read a complete example end to end.
- This is the clean input the brief means ("feeds it a structured call transcript"). The copilot should read the transcript from LARK, not scrape Poppy. Poppy scraping is abandoned.
- ACCESS CAVEAT (only open item): search/read is scoped to what the connected Lark identity can access. Faiz's own meeting transcripts were readable; Wendi's Karen (Drapery/Vinyl House) transcript did NOT appear — it is not shared to that identity. So the copilot needs access to the strategists' meeting transcripts. Cleanest low-friction option: the strategist links the Lark transcript doc onto the Video record (copilot reads it by token, no broad access grant needed); alternative: share the meeting docs / a folder to the copilot's identity.
- FILE→VIDEO matching: transcripts are titled by meeting name + date + attendees; matching to a VID is a design detail (title/date match, or the linked-doc approach makes it explicit).
- MISSION-BRIEF FLOW now unblocked at the input: Lark transcript (read) → feed Poppy → Poppy generates → storyboard into Lark Video record → winners back to Poppy. No independent n8n generation needed as the primary path.

## 2026-07-27 (ACCESS CONFIRMED) — copilot read Karen transcript from Lark by link

- Faiz supplied the Karen transcript link (docx AGhzdoLqFoKNCdxF0t9lRwh7guG). The copilot read the FULL transcript via docx rawContent (useUAT). NO permission problem. The earlier search miss was a search-scope/indexing quirk, not an access wall — direct read by the doc link works.
- MISSION-BRIEF INPUT STEP SOLVED: the copilot reads the discovery-call transcript directly from Lark (the meeting bot's doc). No Poppy scraping, no TXT re-upload, no broad access grant. The strategist just needs to give the copilot the transcript doc (link on the Video record, or matched by title/date).
- Karen transcript substance (real): Karen, The Vinyl House + sub-brand Drapery and Co; laid off 2024 after 15y corporate marketing; one-stop shop flooring/curtains/blinds (vinyl, engineered wood, composite decking, wallpaper/panels, Venetian/motorized/roller/zip-track blinds, invisible grills); films her OWN HOME near Bedok, Wed 4pm; National Day theme (flag at door, red/white outfit); agreed hook = retrenchment→reinvention story (producer Jordan concurred); objective awareness + lead gen; Wendi building the storyboard. Producer on the call = Jordan; Wendi joined at the end.
- NEXT (on brief): copilot now holds the transcript → feed Poppy (engine) → Poppy generates storyboard → land in Lark Video record → winners back to Poppy. Note: no Lark Video record exists yet for Drapery/Vinyl House; National Day video shooting Wed.

## 2026-07-27 (PROOF DRAFT produced) — Karen storyboard, mission-brief §1 flow

- Judgment call: driving Poppy's canvas to generate + capture a full storyboard is fragile and burns credits (no API); the board itself warns against blind chatting. Opened Poppy Chat (Sonnet 5) but a fresh chat is not wired to the GUIDE/benchmarks/transcript, and wiring it reliably via browser was not worth the credit risk. Exited without sending (no credits spent).
- Instead followed mission brief §1 verbatim ("the copilot drafts the storyboard from Poppy AI's patterns into the M&D base Video table") and §16 (drafting is the copilot's job). Inputs used: real transcript read from Lark, Homes pattern snapshot, live Homes SG winners (last 90d, by engagement_rate).
- Homes SG winners strongly matched Karen: top performer "This 4-room resale flat does not feel like a typical HDB" (12.9% ER, homeowner designed his own home) and "7 rooms, 9 toilets... started from having no place to stay" (121K views, adversity origin). Karen = laid off 2024, designed her own home, now runs the business — same winning shape.
- DELIVERED: full GUIDE-structure storyboard (Video Details, 3 gated hooks, Establishment, Arc 1-4, Resolve, Trust+CTA, per-scene visual prompts in [person]+[action]+[environment]+[emotional state]+[framing], remarks/visualisation flags, IP+sensitive flags, body-language footer, claim-to-source appendix). Client-video offer correctly held as PROPOSED, PENDING KAREN SIGN-OFF (brief §12/§16). Markdown: deliverables/proof-storyboard-karen-vinyl-house.md. Shareable Lark doc: https://vsgnkzk9zjnt.sg.larksuite.com/docx/Dgj5doxYEoon13xgq3Wl1d9hg7b
- Status: PROOF for Faiz + Wendi to judge quality. Not approved/published/shared. No Lark Video record exists for Drapery/Vinyl House yet.
