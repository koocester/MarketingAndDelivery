# Lark Base — Full Field Schema Reference

> **Snapshot date:** 2026-07-10
> **Base app_token:** `BG8PbaZFna1NQksNWkglTN85gSf` (Marketing & Delivery — "M&D")
> **Coverage:** all 19 tables listed; full field-by-field schema for the 4 core tables (Videos, Carousels, Projects, Pages).

## Regenerate this file

```
# 1. List all tables
bitable_v1_appTable_list(app_token=BG8PbaZFna1NQksNWkglTN85gSf, page_size=100)

# 2. List fields for a table (repeat per table_id; useUAT=true)
bitable_v1_appTableField_list(
  app_token=BG8PbaZFna1NQksNWkglTN85gSf,
  table_id=<tbl…>, page_size=200, useUAT=true)
```
Videos returns `has_more:true` on the first page even at page_size 200 — follow the `page_token` to get the last ~14 fields.

---

## 1. All tables (19)

| # | Table name | table_id |
|---|---|---|
| 1 | Pages (link to Metricool) | `tblUscIBwxElzzXi` |
| 2 | Platforms | `tbl2lJiJ98uj0H5o` |
| 3 | Business Units | `tblmmGMuFQfuFiSi` |
| 4 | Clients & Vendor (Sales) | `tblWpq8b0uo1vBtX` |
| 5 | Post Interview Contact | `tblDRfrSDADUCoQ7` |
| 6 | Lead Magnet Library | `tblHACGPIPBfGUxj` |
| 7 | Rejected Contacts | `tblFDIJXYU8YR2Fu` |
| 8 | Project Templates | `tblf09npA9UyrrTL` |
| 9 | Storyboard Templates | `tbltAvfRbbfOub7R` |
| 10 | Projects (Delivery) | `tblAJKbb2UZRh8rn` |
| 11 | Videos | `tbl8wIByJQwhIUei` |
| 12 | Carousels | `tblnMZctdGYfXjYL` |
| 13 | Content Calendar | `tbloHYnoMujaalce` |
| 14 | Ad Boosts (connect Meta) | `tblXuRdBYYIpUvGZ` |
| 15 | Video IP Innovation | `tblCyMiE2vGn09F5` |
| 16 | Content Performance (connect Metricool) | `tblzJ6NURzH6QVxt` |
| 17 | Events | `tblA7Ick2xpH4T5H` |
| 18 | Overdue Log | `tblnLjmsk6iWRBNj` |
| 19 | Content Performance (Reels) | `tblIypxKaOsakPxu` |

Core tables detailed below: **Videos (113 fields), Carousels (64), Projects (46), Pages (20).** The other 15 tables are lookups / link targets / connector-fed and are not expanded here.

---

## 2. Videos — `tbl8wIByJQwhIUei` (113 fields)

Primary field: **Video Title** (formula). Stage driver: **Video Stage**.

| field_name | field_id | ui_type | description (trimmed) | formula / options |
|---|---|---|---|---|
| Video Title | fldr2OOB00 | Formula (primary) | Auto-built display name: ID · Page · Guest · Client · (Video Idea) · Objective · Organic | `Video ID & IF(Page)…&IF(Guest)…&IF(Client)…&IF(no guest/client, LEFT(Video Idea,40))…&IF(Objective)…&IF(Organic," · Organic")` |
| Social Media Manager | fldVl7tNyS | User | SMM who posts finished video & fills Actual Upload Date; defaults from Page | |
| CTA Word | fldwCM0Pzc | Lookup | | lookup → Lead Magnet Library `fld2OBD9xK`, filtered by Lead Magnet link |
| Page | fld0JVDqxo | SingleLink | Social handle (vertical×country) posted to; drives default roles, Country, Vertical | → Pages `tblUscIBwxElzzXi` (multiple) |
| Project | fldwxszgsk | DuplexLink | Related delivery project | ↔ Projects `tblAJKbb2UZRh8rn` (back: Videos) |
| Client/Vendor | fldz1JUutv | Lookup | | lookup → Projects `fldb9ACuyR` (Client) |
| Carousels | fldrj7oNoZ | DuplexLink | Carousels spawned from this video | ↔ Carousels `tblnMZctdGYfXjYL` (back: Source Video) |
| Performance | fldBGLW2ze | DuplexLink | Content Performance rows (Metricool metrics) | ↔ Content Performance `tblzJ6NURzH6QVxt` (back: Video) |
| Lead Magnet Library | fldbPcxrns | DuplexLink | Lead-magnet offer(s), per-video (Marketing-owned) | ↔ Lead Magnet Library `tblHACGPIPBfGUxj` (back: Video) |
| Country | fldja7PvUH | Lookup | | lookup → Pages `fldlu5z0U7` |
| Posted Flag | fldcXgBgZp | Formula | 1 if posted (SMM Status=Completed) else 0; feeds Projects rollup | `IF(Video Stage="Completed",1,0)` |
| Contact Number | fldaS8SsCG | Lookup | | lookup → Post Interview Contact `fld70XZRQ2` |
| Business Handle (if any) | fldYptxawH | Lookup | | lookup → Post Interview Contact `fldaXOhaUc` |
| Instagram Handle | fldhUmMY54 | Lookup | | lookup → Post Interview Contact `fldTLbcHHc` |
| Video Stage | fldoWWWmFe | SingleSelect | Current pipeline stage; resets Last Video Stage Updated & SLA clock | Not Started · Sourcing · Approval · Planning · Ready to Shoot · Ready to Edit · Editing · Strategist QC · Amendments Needed · Amendments (Marketing) · Final Approval (Marketing/Client) · Ready To Upload · Completed · On Hold · To Reupload · Rejected/DO NOT POST · Taken Down · Rejected Contact |
| Producer | fldbaf4e8R | User | Sources contact, runs shoot, uploads raw; defaults from Page | |
| Video Editor | fldFcP4tCz | User | Editor; defaults from Page; clock starts at Editing Started At | |
| Intended Upload Date | fldpPhS5h3 | DateTime | Planned posting date | fmt yyyy-MM-dd HH:mm |
| Shoot Date | fldIi1Lyjz | DateTime | Shoot date/time; starts producer 16h raw-footage SLA | fmt yyyy/MM/dd HH:mm |
| Video Due Date | fldY4p8O36 | DateTime | Hard delivery deadline (manual) | fmt dd/MM/yyyy |
| Objective | fldpyAIYtH | SingleSelect | Why the video exists | Lead Generation · Brand Awareness · (2 legacy blank options) |
| Lead Target | fldJQWYgO3 | Number | Target leads (Lead Gen videos) | fmt 0 |
| View Target | flddJeQNQc | Number | Target views (Brand Awareness) | fmt 1,000 |
| Community Sign-ups Target | fldjAEkvOO | Number | Target community sign-ups | fmt 0 |
| Attendance Target | fldiaEmO8V | Number | Target event attendees | fmt 0 |
| Frame.io Link | fldxNxAQXH | Url | Edited cut URL; filling it stops Edit clock (Delivered) | |
| Video TXT (Transcript) | fldp1UKaL5 | Text | Transcript; source for AI caption & lead-magnet copy | |
| Priority | fldOuYSFXf | SingleSelect | Queue triage | Urgent (1st Tier Guest/Internal)) · Paid & Urgent · Normal · Not Urgent · (2 blank) |
| Video Success Looks Like | fld1FzNUnZ | Formula | Auto success sentence from targets + Due Date | concatenates `Lead Target&" qualified leads"`, views, community sign-ups, attendees, `"by "&TEXT(Video Due Date,"DD/MM/YYYY")` |
| Strategist | fldsm8LLGV | User | Plans video, storyboard, shoot date/venue, QC; defaults from Page | |
| Storyboard (Lark Doc) | fldv0yaIgF | Url | Lark Doc storyboard URL (commentable review surface) | |
| Reason for Rejection | fldMFuoQ2T | SingleSelect | Why rejected at a Marketing gate | Off-brand / wrong tone · Wrong page / audience fit · Credibility Issues · Guest not suitable · Capacity / timing |
| Post Interview Feedback Contact | fldxn5Hk6n | DuplexLink | Guest sourced by Producer; feeds handle lookups | ↔ Post Interview Contact `tblDRfrSDADUCoQ7` (back: Videos) |
| Raw File Link (Google Drive) | fld3NPrUuL | Url | Raw footage URL; empty 16h+ after Shoot Date → Raw Upload Overdue | |
| Caption (AI) | fldiC67Ryz | Text | AI-drafted caption from transcript | |
| Manychat Status | fldUvcwdig | SingleSelect | Lead-magnet ManyChat flow build state | Built (ready) · Need to Build · Not needed |
| Video ID | fldxdr9y7A | AutoNumber | System unique ID | pattern `VID-` + number |
| Carousel Worthy? | fldEFCmeGZ | Checkbox | Tick to spawn a carousel | |
| Organic Video | fldlAq4GsE | Checkbox | Non-guest organic post; drives organic approval path | |
| Video Idea | fldKzEVtLl | Text | Concept/pitch captured early | |
| Editing Started At | fldLQ979ZE | DateTime | Stamped by Start Editing button; starts Edit SLA | fmt yyyy/MM/dd HH:mm |
| Vertical | flduw4nmvv | Formula | Vertical pulled from linked Page; sets Edit SLA | lookup-style FILTER → Pages `fldKuUsJ07` |
| Editing Lead Time | fldhquXXP0 | Formula (Number) | Hours allowed in Editing by Vertical | `IF Wealth=4, Foodie=4, Business=8, Homes=8, Autos=4, else 8` |
| Edit Deadline | fldIuS1uIe | Formula | Editing Started At + SLA hours | `Editing Started At + Editing Lead Time/24` |
| Editing Time Left | fldaRo5QbU | Formula | Live countdown / OVERDUE / Delivered | `IF no start "Not started"; IF no Frame.io → countdown vs Edit Deadline; else "Delivered"` |
| Post Shoot Remarks | fldV9CsXor | Text | Free-text notes | |
| Guest Name (MUST HAVE) | fldEORbzmT | Text | Featured guest full name | |
| Guest IG Handle | fldvUrF3qb | Text | Guest personal IG handle | |
| Guest Business Handle | fldT555eRq | Text | Guest business/brand IG handle | |
| Guest Profession / Industry | fldIhgqma3 | Text | Guest profession/industry | |
| Overdue Explanation | fldy9GoYtV | Text | Editor note for late edit; suppresses Overdue text | |
| Overdue (alert) | fld6pv0CzJ | Formula | "OVERDUE" when edit past deadline, no Frame.io, no explanation | `IF Video Stage="Editing" AND past Edit Deadline AND no Frame.io AND no Explanation → "OVERDUE"` |
| Meeting Transcript (TXT file) | fldGr1y7Sw | Attachment | Interview transcript file | |
| Storyboard Done and Checked | fldCATAq9c | Button | | action button |
| Guest Number (if have) | fld237gpdc | Phone | Guest phone/WhatsApp | |
| Approve QC | fldpHHfnyD | Button | | |
| Request Amendment | fldkYCZoNe | Button | | |
| Approve to Plan | fldqcisU7a | Button | | |
| Reject to Plan | fldUzRpwZ1 | Button | | |
| Approve Organic | flddfINCqq | Button | | |
| Reject Organic | fldt22gO9q | Button | | |
| Shoot Done? | fld8VSYZXv | Button | | |
| Landing Page Link (fill in Lead Magnet Library) | fldVrBSN41 | Lookup | | lookup → Lead Magnet Library `fldtVINcJe` |
| Submit Video | fldM7i84Gd | Button | | |
| Resubmit Video | fldVESZ6mv | Button | | |
| Approve to Upload | fldckixZ5x | Button | | |
| Confirm all Uploaded | fldrzi4ePz | Button | | |
| Start Editing | fldnUdKTnC | Button | | |
| ManyChat built | fldsjhoQ2t | Button | | |
| Instagram Post URL | fldZxyvqmP | Url | Live IG post URL (SMM); join key to Content Performance | |
| TikTok Post URL | fldiYuUfub | Url | Live TikTok post URL | |
| Facebook Post URL | fldsQXtOXW | Url | Live Facebook post URL | |
| Project/Sales Brief | fldTj4gqZf | Lookup | | lookup → Projects `fldoZP4aG0` (Project Brief) |
| Confirm Submission | fldLUWGDQ4 | Button | | |
| Resubmit Contact | fldpmPnhjo | Button | | |
| Last Video Stage Updated | fldTG6p5XW | ModifiedTime | Stage-change timestamp; drives all Lead Time SLA clocks | fmt yyyy/MM/dd HH:mm |
| Last ManyChat Updated | fldgk3m6Sm | ModifiedTime | Reference for ManyChat Overdue alert | fmt yyyy/MM/dd HH:mm |
| Lead Time | fld7O5g5nI | Formula (Number) | Deadline standard for current stage, hours | `IF Approval → (Organic?3:12); Strategist QC=16; Amendments Needed=6; Amendments (Marketing)=6; Final Approval → (Client?48:12); else 0` |
| Time Left | fldzaR7bnz | Formula | Live countdown for current stage / OVERDUE / — | `IF Lead Time=0 or no timestamp "—"; else countdown vs (Last Video Stage Updated + Lead Time/24)` |
| Overdue | fldLpjT3sz | Formula | "OVERDUE" once current stage past deadline | `IF Lead Time>0 AND past (Last Stage Updated + Lead Time/24) → "OVERDUE"` |
| ManyChat Overdue (alert) | flduNJiFNe | Formula | "OVERDUE" when Need to Build 6h+ (desc says 12h) since Last ManyChat Updated | `IF Manychat="Need to Build" AND NOW()>Last ManyChat Updated+6/24 → "OVERDUE"` |
| Content Age (days) | fldlrUTIto | Formula (Number) | Days waiting in Ready To Upload | `IF Video Stage="Ready To Upload" → INT(NOW()-Last Stage Updated) else 0` |
| Content Stale | fldWaJexTJ | Formula | Aging badge for Ready To Upload | `≥60d "🔴 60d+ stale"; ≥30d "🟠 30d+ aging"` |
| Resubmit Requested | fld6nzpwRz | Checkbox | Helper set by Request Changes/Resubmit | |
| Request Changes | fldtuvMBP7 | Button | | |
| Amendments Overdue (alert) | fldtP7U6U6 | Formula | "OVERDUE" when in Amendments stages past Lead Time deadline | `IF (Amendments Needed OR Amendments (Marketing)) AND past deadline → "OVERDUE"` |
| Sourcing Requested | fld1ORGT41 | Checkbox | LEGACY helper (being retired) — don't build new automations on it | |
| Submit Entry | fldlm5epy5 | Button | | |
| Add to Producer Calendar | fld0pcmDLk | Button | | |
| Shoot Venue | fldfsZcsAN | Text | Shoot location; used to build calendar event | |
| Shoot Duration (hrs) | fldIKKTmxl | Number | Shoot length (defaults 2h in event) | fmt 0 |
| Calendar Event Created | fldQDFo398 | Checkbox | Set by Create Shoot Event automation | |
| Calendar Requested | fldRjuEPCx | Checkbox | Helper set by Add to Calendar button | |
| Raw Upload Overdue (alert) | fldwatklM6 | Formula | "OVERDUE" when shoot 16h+ ago but no Raw File Link (Ready to Shoot/Edit) | `IF (Ready to Shoot OR Ready to Edit) AND no Raw File AND NOW()>Shoot Date+16/24 → "OVERDUE"` |
| Calendar Entry | fldOg485NT | DuplexLink | Content Calendar row (automation-created) | ↔ Content Calendar `tbloHYnoMujaalce` (back: Video) |
| Actual Upload Date | fldXcWTwtD | DateTime | Real posted date (SMM) | fmt dd/MM/yyyy |
| Head of Growth Approver | fldDT7nlmS | User | Marketing-gate approver; auto-assigned from Page Default Head of Growth | |
| Head Video Editor (Approver) | fldLIixeqV | User | Organic-video approver; auto-assigned from Page | |
| Project Success Looks Like | fldNFUICec | Lookup | | lookup → Projects `fldCjOLwv1` |
| Sourcing Needed? | fldo38XWc2 | Checkbox | Tick to route into Producer Sourcing queue | |
| Project Due Date | fldv3yn5OK | Lookup | | lookup → Projects `fldJ7XC7GC` |
| Engagement | fldNqSvGYJ | Lookup | Client vs Internal Campaign | lookup → Projects `fldDtjUdOl` |
| Raw Upload Left | fldz1nX4Vj | Formula | Countdown to 16h raw-footage deadline / OVERDUE | `IF no Shoot Date or Raw File filled → ""; else countdown vs Shoot Date+16/24` |
| ManyChat Time Left | fldOm7Famg | Formula | Live 6h ManyChat build countdown | `IF Manychat="Need to Build" → countdown vs Last ManyChat Updated+6/24 else "—"` |
| SLA State (activate at go-live) | fldL3s3qz8 | Formula | Placeholder, intentionally blank until go-live (avoids false overdues from migration timestamps) | `""` |
| Project Idea | fldGI2rYQN | Lookup | | lookup → Projects `fldFs8Pkts` |
| Template | fldognbqib | Formula | Project Template cascaded from linked Project | FILTER → Projects `fldxvzerl6` |
| First Draft Submitted At | fldyGyLbEH | DateTime | Timestamp of FIRST draft submission; set once, never overwritten — editor-output leading metric | fmt yyyy/MM/dd HH:mm |
| Draft Submitted By | flduVseiCM | User | Editor who submitted the first draft; set once | |
| Reviewed Caption (final) | fldRRUc0S0 | Text | Human-finalised caption; AI never touches this field | |
| Send to Guest/Client | fldXjZKv4k | Checkbox | Ticked once finished link sent to guest/client | |
| Upsold? | fldUiKCwBm | Checkbox | Producer upsold on the shoot | |
| Upsold Deal | fldIQt0XEo | SingleSelect | What was upsold | Extra Video · Extra Carousel · Ad Boost / Paid Promo · Extended Usage Rights · Other |

---

## 3. Carousels — `tblnMZctdGYfXjYL` (64 fields)

Primary field: **Carousel Title** (formula). Stage driver: **Carousel Stage**.

| field_name | field_id | ui_type | description (trimmed) | formula / options |
|---|---|---|---|---|
| Carousel Title | fldsJXyiXn | Formula (primary) | Auto: ID · Page · Topic · Client · Objective | `Carousel ID & IF(Page)…&IF(Topic)…&IF(Client)…&IF(Objective)…` |
| Carousel Stage | fldzQLk4Wf | SingleSelect | Workflow stage; drives SLA timers & buttons | Not Started · Copywriting · Amendments Needed · Final Approval (Head Copywriter/Client) · Ready to Upload · Completed · On Hold · To Reupload · Reject/DO NOT POST · Taken Down · Pending Copywriting |
| Source Video | fldmHyq4cS | DuplexLink | Video this carousel is derived from | ↔ Videos `tbl8wIByJQwhIUei` (back: Carousels) |
| Article Source | fldGCcxuVu | Url | Source article/infographic URL (non-video carousels) | |
| Topic (Must Fill) | fldn1HYOzw | Text | Required short topic; used in title when no Source Video | |
| Canva Link | fldV6jdXXd | Text | Canva design URL | |
| Project | flddBtSzDS | DuplexLink | Delivery project | ↔ Projects `tblAJKbb2UZRh8rn` (back: Carousels) |
| Page | fldKhXJh3x | SingleLink | Page(s) posted to; drives Country/Vertical | → Pages `tblUscIBwxElzzXi` |
| Vertical | flds6CfQfI | Lookup | | lookup → Pages `fldKuUsJ07` |
| Country | fldMLC2hnv | Lookup | | lookup → Pages `fldlu5z0U7` |
| Copywriter | fldENRIYR0 | User | Assigned copywriter | |
| CTA Word | fldP20WUHr | Lookup | | lookup → Lead Magnet Library `fld2OBD9xK` |
| Priority | fldyYAHdLW | SingleSelect | Queue priority | Urgent (1st Tier Guest) · Paid & Urgent · Normal · Not Urgent |
| Caption | fldo12tfmx | Text | Post caption (Copywriter) | |
| Lead Target | fldchZ02P8 | Number | Target leads | fmt 0 |
| View Target | fldDg7Jnho | Number | Target views | fmt 1,000 |
| Community Sign-ups Target | fld9Ay28JE | Number | Target community sign-ups | fmt 0 |
| Attendance Target | fldYx0UbWo | Number | Target event attendees | fmt 0 |
| Performance | fldNNxqtb8 | DuplexLink | Content Performance rows | ↔ Content Performance `tblzJ6NURzH6QVxt` (back: Carousel) |
| Lead Magnet Library | fld2fhaJSK | DuplexLink | Lead-magnet offer(s) | ↔ Lead Magnet Library `tblHACGPIPBfGUxj` (back: Carousel) |
| Success Looks Like | fldFv67H5K | Formula | Auto success sentence from targets + Due Date | concatenates leads/views/community/attendees + `"by "&TEXT(Due Date)` |
| Objective | fldjSfrvxu | SingleSelect | Primary goal; used in title when no Source Video | Lead Generation · Brand Awareness |
| Post Interview Contact Name | fldDLzruQL | DuplexLink | Interviewed contact; drives handle lookups | ↔ Post Interview Contact `tblDRfrSDADUCoQ7` (back: Carousels) |
| Social Media Manager | fldWCvJeGk | User | Posts carousel & fills Actual Upload Date | |
| Instagram Handle | fldn4D2RbW | Lookup | | lookup → Post Interview Contact `fldTLbcHHc` |
| Business Handle (if any) | fldIq5s5LQ | Lookup | | lookup → Post Interview Contact `fldaXOhaUc` |
| Manychat Status | fldlkooE29 | SingleSelect | ManyChat flow build state | Built (ready) · Need to Build · Not needed |
| Posted Flag | fldbITNavZ | Formula (Number) | 1 when Completed else 0; feeds Projects rollup | `IF(Carousel Stage="Completed",1,0)` |
| Carousel ID | fldFmGTusN | AutoNumber | System unique ID | pattern `CAR-` + number |
| Instagram Post URL | fldTBz2xW1 | Url | Published IG post | |
| TikTok Post URL | fldz2haE2O | Url | Published TikTok post | |
| Facebook Post URL | fldNMTO4y5 | Url | Published Facebook post | |
| All Uploaded | fldBn2NyYJ | Button | | |
| ManyChat Built | fldFmXW8mf | Button | | |
| Reject Carousel | fldLYLuMul | Button | | |
| Submit Carousel | fldkSnjSJM | Button | | |
| Resubmit Carousel | fldGEyEE9d | Button | | |
| Approve Carousel | fldzlwQWtT | Button | | |
| Landing Page Link | fldp6uBnKI | Lookup | | lookup → Lead Magnet Library `fldtVINcJe` |
| Client | fldozQkuBl | Lookup | | lookup → Projects `fldb9ACuyR` |
| Project Brief | fldIHvgTNI | Lookup | | lookup → Projects `fldoZP4aG0` |
| Project Idea | fld9R6LTrW | Lookup | | lookup → Projects `fldFs8Pkts` |
| Project Due Date | fldlAhszda | Lookup | | lookup → Projects `fldJ7XC7GC` |
| Due Date | fldjP1idK6 | DateTime | Deadline the carousel should be ready | fmt dd/MM/yyyy |
| Intended Upload Date | fldKH9D3WT | DateTime | Planned posting date | fmt dd/MM/yyyy |
| Actual Upload Date | fldzHuIU1H | DateTime | Real posted date | fmt yyyy/MM/dd |
| Last Carousel Stage Updated | fldgwWfX7s | ModifiedTime | Stage-change timestamp; SLA clock start | fmt yyyy/MM/dd HH:mm |
| Last ManyChat Updated | fld4uxF3Mk | ModifiedTime | ManyChat overdue clock start | fmt yyyy/MM/dd HH:mm |
| Lead Time | fldsMb1cEi | Formula (Number) | Deadline standard for current stage, hours | `Not Started=0; Copywriting=3; Amendments Needed=24; Final Approval=24; else 0` |
| Time Left | fld2VdNvrI | Formula | Live countdown / OVERDUE / — | countdown vs (Last Carousel Stage Updated + Lead Time/24) |
| Overdue | fld7sdkDnl | Formula | "OVERDUE" once stage deadline passes | `IF Lead Time>0 AND past deadline → "OVERDUE"` |
| ManyChat Overdue (alert) | fldXjB3QAx | Formula | "OVERDUE" when Need to Build past 6h | `IF Need to Build AND NOW()>Last ManyChat Updated+6/24 → "OVERDUE"` |
| Content Age (days) | fldGOuRqdy | Formula (Number) | Days waiting in Ready to Upload | `IF Ready to Upload → INT(NOW()-Last Stage Updated) else 0` |
| Content Stale | fld5KNFK0G | Formula | Aging badge (30d/60d) for Ready to Upload | `≥60d "🔴 60d+ stale"; ≥30d "🟠 30d+ aging"` |
| Send to Copywriter | fld0qLVUTD | Button | | |
| Calendar Entry | fldoGYhq0s | DuplexLink | Content Calendar row (automation-created) | ↔ Content Calendar `tbloHYnoMujaalce` (back: Carousel) |
| Head Copywriter (Approver) | fldF7z0YNB | User | Final Approval gate; auto-assigned from Page | |
| Content Strategist | fld2U8TND2 | User | On client work collects sign-off at Final Approval; auto-assigned from Page | |
| Engagement | fldsoYgzaJ | Lookup | Client vs Internal Campaign | lookup → Projects `fldDtjUdOl` |
| ManyChat Time Left | fldV27S5vO | Formula | Live 6h ManyChat build countdown | countdown vs Last ManyChat Updated+6/24 |
| Template | fld9cxgY6o | Formula | Project Template cascaded from linked Project | FILTER → Projects `fldxvzerl6` |
| Project Success Looks Like | fld2AzmpdK | Lookup | | lookup → Projects `fldCjOLwv1` |
| Start Copywriting | fldv2bkwU4 | Button | | |
| Video Frame.io Link | fldhsNhx73 | Lookup | | lookup → Videos `fldxNxAQXH` (via Source Video) |

---

## 4. Projects (Delivery) — `tblAJKbb2UZRh8rn` (46 fields)

Primary field: **Project Name** (formula). Note: Project is a delivery harness — vertical/page live on Pages, not here.

| field_name | field_id | ui_type | description (trimmed) | formula / options |
|---|---|---|---|---|
| Business Unit | fldvAFVFdL | SingleLink | | → Business Units `tblmmGMuFQfuFiSi` (multiple) |
| Client | fldb9ACuyR | DuplexLink | | ↔ Clients & Vendor `tblWpq8b0uo1vBtX` (back: Projects) |
| Project Name | fldestdFuX | Formula (primary) | Auto: Project ID · Client(or Business Unit) · Short Description | `Project ID&" · "&IF(no Client, Business Unit, Client)&IF(Short Description)…` |
| Project Brief | fldoZP4aG0 | Attachment | Brief document(s) | |
| Event | fldgHoUPYn | SingleLink | Event Types (for Event-type projects) | → Events `tblA7Ick2xpH4T5H` |
| Template | fldxvzerl6 | SingleLink | Project Template (spec doc); Videos inherit Content Style | → Project Templates `tblf09npA9UyrrTL` |
| Project Type | fldILWl9mn | SingleSelect | Kind of engagement | Media (Videos & Carousels) · Lead Sale (leads only) · Event · Internal Campaign - (Database / Community / Both) |
| Campaign Objective | fldMnNPJ0w | SingleSelect | Primary goal | Lead Generation · Brand Awareness |
| Status (Manual) | fldtUY2tmv | SingleSelect | Lifecycle stage; born Not Started | Not Started · Planning · In Production · Delivered · On Hold · Completed |
| Start Date | flditBezu0 | DateTime | Kickoff date; used with Due Date for Pace | fmt dd/MM/yyyy |
| Due Date | fldJ7XC7GC | DateTime | Delivery deadline; feeds Days to Due & Pace | fmt dd/MM/yyyy |
| Project Owner | fldSlxD7nn | User | Accountable for delivery (≠ strategist, ≠ Sales Owner) | |
| Videos | fldUquxnRr | DuplexLink | | ↔ Videos `tbl8wIByJQwhIUei` (back: Project) |
| Carousels | fld1sgZxDC | DuplexLink | | ↔ Carousels `tblnMZctdGYfXjYL` (back: Project) |
| Video Deliverables | fldlBrGC0l | Number | Contracted video count | fmt 0 |
| Carousel Deliverables | fldROnk7h4 | Number | Contracted carousel count | fmt 0 |
| Project Idea | fldFs8Pkts | Text | | |
| Deal Type | fldM35BHCa | SingleSelect | Commercial structure | One Off · Package · Retainer (Monthly) |
| Lead Target | fld3kcdagC | Number | Target leads (lead-gen); Outcome Progress denom | fmt 0 |
| View Target | fldA0mqwKp | Number | Target views (awareness); Outcome Progress denom | fmt 1,000 |
| Days to Due | fldAGCTeDg | Formula | Days remaining to Due Date (negative=overdue) | `IF no Due Date ""; else DATEDIF(TODAY(), Due Date)` |
| Event Progress | fldG35JYJz | Formula (Progress) | Event projects: Attendance Actual ÷ Target | `IF Event AND Target>0 → Actual/Target else 0` |
| Videos Total | fldgm26l7N | Formula | Count of linked Videos | `COUNTA(Videos filtered by Project)` |
| Videos Done | fld71XrrhL | Lookup (rollup SUM) | | SUM → Videos `fldcXgBgZp` (Posted Flag) |
| Carousels Done | fldEwvedPp | Lookup (rollup SUM) | | SUM → Carousels `fldbITNavZ` (Posted Flag) |
| Carousels Total | fldVqIl3F4 | Lookup (rollup COUNTA) | | COUNTA → Carousels `fldbITNavZ` |
| Deliverables Progress | fldvkQcFgi | Formula (Progress) | (Videos Done + Carousels Done) ÷ total deliverables | `IF deliverables=0 →0; else (Videos Done+Carousels Done)/(Video Del+Carousel Del)` |
| Project ID | fldcNp57bP | AutoNumber | System unique ID | pattern `PRJ-` + number |
| Attendance Target | fld8qTpqWV | Number | Target attendance (Event) | fmt 0 |
| Attendance Actual | fldpeG9gpm | Number | Actual attendance | fmt 0 |
| HubSpot Deal Record ID | fldBc2WlbO | Text | Join key to HubSpot deal (money↔delivery) | |
| Deal Description | fldAjBDcrI | Text | Deal/scope summary (often from HubSpot) | |
| Sales Owner | fldu7kHbmF | Lookup | Salesperson who closed (≠ Project Owner) | lookup → Clients & Vendor `fldGD0EDqV` |
| Short Description | fldTmGs2zC | Text | Short label; feeds Project Name | |
| Country | fldk7sJfvi | Lookup | | lookup → Business Units `fldRFLiZqX` |
| Completed Project | fld4VNtU8s | Formula (Number) | 1 if Status=Completed | `IF(Status="Completed",1,0)` |
| Ongoing Project | fldSjHSMeM | Formula (Number) | 1 if Status≠Completed | `IF(Status="Completed",0,1)` |
| Records Created | fldHeeYo9t | Checkbox | Migration helper: fan-out done (stops re-fire) | |
| Pace | fldQOVmmLm | Formula | Schedule health On track / Behind | compares Deliverables Progress vs elapsed (Start→Due) with -0.1 buffer |
| Success Looks Like | fldCjOLwv1 | Formula | Auto success sentence from targets + Due Date | concatenates leads/views/community/attendees + `"by "&TEXT(Due Date)` |
| Engagement | fldDtjUdOl | Formula (SingleSelect) | Client vs Internal Campaign — the source split | `IF COUNTA(Client)=0 "Internal Campaign" else "Client"` |
| Date Created | fldQt8nt0D | CreatedTime | | fmt dd/MM/yyyy |
| Community Sign-ups Target | fldeEJ2GLv | Number | Target community sign-ups (North Star) | fmt 0 |
| Fill Target (alert) | fldhwiZHfz | Formula | Objective↔target mismatch flag (yellow must-fill) | `IF Lead Gen no Lead Target "FILL LEAD TARGET"; IF Brand Awareness no View Target "FILL VIEW TARGET"` |
| 💰 Money-Confirmed (Jul 2026) | fldr8BtpqQ | Checkbox | Client verified live via HubSpot 2026 / Xero (2026-07-05) | |
| Created By | fld4fYt6vB | CreatedUser | Who submitted record; powers My Submissions view | |

---

## 5. Pages (link to Metricool) — `tblUscIBwxElzzXi` (20 fields)

Primary field: **Page** (text). One row per vertical × country. This table is the auto-assign source of truth for default roles/approvers.

| field_name | field_id | ui_type | description (trimmed) | formula / options |
|---|---|---|---|---|
| Page | fldyUumdq4 | Text (primary) | Page name / primary key (e.g. Business SG) | |
| Country | fldlu5z0U7 | SingleSelect | Market | Singapore · Malaysia · Indonesia · Regional |
| Vertical | fldKuUsJ07 | SingleSelect | Content vertical | Main · Homes · Business · Autos · Wealth · Foodie |
| TikTok Handle | fldae57EXF | Text | Page TikTok @handle | |
| Instagram Handle | flddWzEUQd | Text | Page Instagram @handle | |
| Facebook Handle | fldvAX0xqN | Text | Page Facebook handle | |
| Followers (TT) | fldctQQUVr | Number | TikTok follower snapshot | fmt 1,000 |
| Followers (IG) | fldSfvUgz2 | Number | Instagram follower snapshot | fmt 1,000 |
| Followers (FB) | fldKBbXZ9A | Number | Facebook follower snapshot | fmt 1,000 |
| Default Editor | fldw5dAKiz | User | Auto-assign → Video Editor | |
| Default Copywriter | fldLeUoESv | User | Auto-assign copywriter | |
| Default Producer | fldXcpBRng | User | Auto-assign producer | |
| Default SMM | fldTPMXay8 | User | Auto-assign SMM | |
| Default Tech - for Automation | fldup2PDwi | User | Auto-assign tech owner (automation routing) | |
| Default Content Strategist | fldWmKcY8o | User | Auto-assign strategist | |
| Default Head of Growth | fld1ns6WLS | User | SoT: Marketing-gate approver; copied to each record | |
| Default Head Copywriter (Approver) | fldPkxPygy | User | SoT: carousel Final Approval (company-wide = Ratnasari) | |
| Default Head Video Editor (Approver) | fldABORTg1 | User | SoT: organic-video vetting gate | |
| Lead Magnet Library | fldAffstGE | DuplexLink | | ↔ Lead Magnet Library `tblHACGPIPBfGUxj` (back: Page) |
| Default Finance | fldxuyn7dD | User | Default finance owner | |

---

### ui_type → Lark field-type code reference

| ui_type | code | ui_type | code |
|---|---|---|---|
| Text | 1 | Formula | 20 |
| Number | 2 | DuplexLink | 21 |
| SingleSelect | 3 | Phone | 13 |
| DateTime | 5 | Url | 15 |
| Checkbox | 7 | Attachment | 17 |
| User | 11 | SingleLink | 18 |
| Lookup | 19 | AutoNumber | 1005 |
| Button | 3001 | CreatedTime | 1001 |
| ModifiedTime | 1002 | CreatedUser | 1003 |
