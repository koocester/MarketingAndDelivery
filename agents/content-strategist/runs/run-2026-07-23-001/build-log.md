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
