# CEO Mission Brief

## Brief Metadata

-   **Prepared for:** Faiz
-   **Role:** Copywriter Bot
-   **Mission Name:** Automate the Copywriting Stage of the M&D Carousel
    Workflow
-   **Priority:** High
-   **Status:** Draft (Some implementation details pending)

------------------------------------------------------------------------

# 1. Executive Summary

Automate the copywriting stage of the existing Marketing & Delivery
(M&D) carousel workflow using an n8n bot.

The bot should generate draft carousel content and populate a locked
Canva template automatically. Human copywriters become reviewers and
approvers only---they no longer draft the initial carousel.

The workflow must extend the existing Lark workflow and must not create
a new base.

------------------------------------------------------------------------

# 2. Business Objective

Replace manual first-draft copywriting with an automated Copywriter Bot
that:

-   Produces complete carousel drafts.
-   Uses approved source material.
-   Maintains brand consistency.
-   Logs provenance.
-   Hands work to a human reviewer.
-   Supports approximately 27 completed carousel drafts per day.

------------------------------------------------------------------------

# 3. Business Reason

Increase production capacity while improving consistency.

Copywriters should spend their time reviewing and improving content
instead of writing every carousel from scratch.

------------------------------------------------------------------------

# 4. Target Audience

Internal Marketing & Delivery team.

Primary users include:

-   Copywriters
-   Social Media Managers
-   Marketing Operations

The end audience of each carousel depends on the original source
content.

------------------------------------------------------------------------

# 5. Required Deliverables

For every eligible carousel record:

-   Research source content.
-   Generate carousel copy.
-   Select or generate supporting visuals.
-   Autofill the approved Canva template.
-   Save the Canva design.
-   Record provenance.
-   Update the Lark record.
-   Move the record to **In Review**.

------------------------------------------------------------------------

# 6. Workflow

## Trigger

Status: `Pending Copywriting`

Each record contains one source type:

-   Article
-   Video
-   Infographic

## Article Workflow

-   Retrieve article text.
-   Retrieve related images.
-   Use approved image assets where required.
-   Generate carousel copy.

## Video Workflow

-   Retrieve transcript.
-   Retrieve supporting imagery.
-   Retrieve b-roll frames (if available).
-   Generate carousel copy.

## Infographic Workflow

-   Generate explanatory visuals using AI.
-   Create explanatory graphics, not decorative filler.

## Canva Generation

Populate an approved locked Canva template.

Replace only:

-   Text placeholders
-   Image placeholders

Never redesign layouts.

Brand rules:

-   Maroon (#C02025)
-   Helvetica
-   White-dominant
-   No gold

Write back to Lark:

-   Canva design link
-   Copy used
-   Source reference

Set status to **In Review**.

## Human Review

Copywriter reviews in Canva.

Feedback is provided only through Canva comments.

When complete, the copywriter presses **Amendments Submitted**.

The bot:

-   Retrieves unresolved comments.
-   Applies changes.
-   Updates template fields.
-   Resolves processed comments.
-   Increments Amendment Rounds.
-   Returns status to **In Review**.

## Human Approval

Copywriter presses **Approve**.

Status becomes **Ready to Upload**.

The Social Media Manager publishes the carousel and pastes the live post
URL back into Lark.

The live post URL remains the attribution join key.

------------------------------------------------------------------------

# 7. Systems of Record

## Lark

System of record for:

-   Workflow status
-   Metadata
-   Provenance
-   Approvals

## Canva

System of record for:

-   Creative assets
-   Design
-   Reviewer comments
-   Amendment history

------------------------------------------------------------------------

# 8. Approved Sources

Primary sources:

-   Articles
-   Videos
-   Infographics

Additional assets:

-   Approved image library (**UNKNOWN**)
-   Video b-roll library (**UNKNOWN**)

Every generated asset must include provenance.

------------------------------------------------------------------------

# 9. Research Requirements

-   Identify source type.
-   Retrieve source content.
-   Retrieve supporting imagery where applicable.
-   Record source references.
-   Record asset provenance.

------------------------------------------------------------------------

# 10. Brand Guidelines

Use:

-   Maroon (#C02025)
-   Helvetica
-   White-dominant layout

Never use:

-   Gold
-   Free-form AI layouts

Always populate the approved locked Canva template.

------------------------------------------------------------------------

# 11. Operational Rules

The bot must:

-   Extend the existing M&D workflow.
-   Never create a new base.
-   Never approve its own work.
-   Record provenance.
-   Preserve attribution.
-   Keep workflow status inside Lark.
-   Keep review comments inside Canva.

------------------------------------------------------------------------

# 12. Success Criteria

Success means:

-   Approximately 27 carousel drafts per day.
-   Complete Canva drafts generated automatically.
-   Approved source material only.
-   Provenance logged.
-   Human review required.
-   Human approval required before upload.

------------------------------------------------------------------------

# 13. Known Unknowns

-   Exact Lark base, table and field names.
-   Canva subscription tier and Connect API capabilities.
-   Approved image library location.
-   Video b-roll storage and retrieval method.
-   Editorial style guide.
-   Failure and retry behaviour.
-   Amendment round limits.
-   Queue prioritisation rules.
-   Deployment approvals.
-   Security and retention requirements.

------------------------------------------------------------------------

# 14. Immediate Technical Validation

Verify before implementation:

1.  Canva Connect API supports the required template autofill workflow.
2.  Canva integration supports the required comments workflow.
3.  Approved image library location.
4.  Video b-roll location and retrieval method.
5.  Transcript and asset association with source records.

------------------------------------------------------------------------

# 15. Next Step

Load this file together with:

1.  `01-company-agent-orchestrator.md`
2.  `02-copywriter-master-system-prompt.md`

The Orchestrator should validate the brief, generate an execution
contract, identify remaining blockers, and begin planning the Copywriter
Bot workflow.


#RAW TRANSCRIPT HERE:

Task: Automate the Copywriting stage of the M&D carousel lane (Copywriter Bot)

Do NOT build a new base. Extend the existing carousel flow in the Marketing & Delivery (M&D) Lark base. Build a bot in n8n (consistent with our other engines) that runs this loop per carousel record. The bot produces the carousel; copywriters are reviewers/approvers only, they do not draft. Target throughput ~27 carousels/day (25 = 5 pages x 5, + 2 for the Koocester/Ratnasari personal-branding page).

1. TRIGGER on "Pending Copywriting". Each record has a Source Type: Article, Video, or Infographic.

2. SOURCE the content by type. Article -> pull the article text + related images (from the article or our approved image library). Video -> pull the transcript for the copy + b-roll frames for imagery. Infographic -> generate explanatory visuals with AI image generation (explanatory graphics, not decorative fill). Log source + asset provenance on the record.

3. CREATE the carousel in Canva by AUTOFILLING a locked brand template (text + image placeholders only — no free-form AI layout; free-form gives poor results). Brand lock: maroon #C02025 only, NO gold, Helvetica, white-dominant. Write the Canva design link, source reference, and copy used back onto the record. Flip status to In Review.

4. REVIEW: the human copywriter leaves per-slide feedback as Canva comments, then clicks an "Amendments Submitted" button on the base record. That click triggers the bot: it lists all comments on that Canva design, applies each change to the template fields, resolves the comments, increments an Amendment Rounds counter, and flips status back to In Review. The button must be conditioned on status = In Review with a non-empty Canva link.

5. APPROVE: the copywriter clicks Approve in the base -> status "Ready to Upload" -> record enters the SMM queue (a human SMM uploads for now; SMM bot later). SMM pastes the live post URL back onto the record (this is our attribution join key — keep it).

RULES: Base is the system of record for STATUS. Canva is the system of record for CREATIVE + FEEDBACK — one channel each, no duplicate feedback system. The bot never approves its own work; a copywriter does. Log provenance on every record.

BEFORE WRITING ANY CODE, confirm and report back on two things: (a) does our Canva Connect API tier support brand-template autofill AND listing comments on a design? If autofill isn't available, fall back to a duplicate-and-edit template library. (b) Where do the approved image library and the video b-roll materials live, and can we pull b-roll frames per video ID?