# CEO Mission Brief

## Brief Metadata

- Brief date: 2026-07-22
- Prepared for: Faiz
- Role: Content Strategist (CS). Note: CS means Content Strategist, never Customer Success (that is CX).
- Mission name: Storyboard Copilot for the Content Strategist
- Priority: High
- Deadline: This week
- Recurring or one-time: Recurring, runs per video as shoots get booked

## 1. Executive Summary

Build an AI copilot that assists the Content Strategist in planning and preparing videos for guests and clients. It produces the full storyboard, first frame to last, in the exact structure of the GUIDE - Producer Marketing Plan, so a producer can execute a viral, performance-driven shoot with no back and forth, and an editor can open it and instantly know the intent, the lead magnet, and the call to action.

This is an assist, not an autopilot. The Content Strategist still runs the discovery call with the guest or client and owns review and approval. The copilot removes the administrative, formulaic, repeatable part of storyboarding, so the two strategists move into higher leverage work, plan more videos at a better pace, and carry less brain fog.

The engine is Poppy AI. Poppy AI already holds the storyboard work and learns patterns from the highest performing past videos. The copilot feeds it a structured call transcript, drafts the storyboard from Poppy AI's patterns into the M&D base Video table, and continuously uploads winning videos' stats back into Poppy AI so the system keeps improving itself.

## 2. Business Objective

Better, data-driven video planning that doubles down on what has already worked, so every video drives leads and virality at once, performance and brand awareness in one. Hakim has proven this is achievable manually; the mission is to make it consistent and repeatable at team scale.

## 3. Business Reason

Most of the storyboarding work today is administrative and formula output, the kind that should run like a cron job. Automating it moves the Content Strategist into a higher leverage role, more output at a better pace, better performance, and far less cognitive load. It is a high leverage efficiency move for a two person function.

## 4. Target Audience

Two layers.

Direct users of the output:

- Producers, who execute the storyboards on the shoot.
- Content Strategists, who review and quality check.
- Video editors, who today reference what was discussed, and in future could feed the storyboard to a video editing agent that cuts the video to the board and the questions.

End audience of the videos themselves:

- Followers across all Koocester pages.
- The specific people the lead magnet is meant to attract. The storyboard must pull in the audience that offer targets.

## 5. Desired Audience Outcome

A producer opens the storyboard and can immediately execute a viral, performance-driven shoot with a clean workflow and zero back and forth. They understand the full shoot context and the client instantly, and can carry the guest conversation. The visual prompts are strong enough that the producer knows exactly what the audience will see. The editor opens the same board and instantly knows the topic, the intent, what success looks like, the lead magnet, and the call to action.

## 6. Required Deliverables

For each video:

- A full storyboard in the GUIDE - Producer Marketing Plan structure, containing:
  - Video Details block: page featured in, video objective, target audience persona, dream outcome (viewer's win), win metric (company win), interviewee winning picture, offer CTA, proposed caption, interviewee outfit.
  - 3 hooks, each passing the three scroll-stop gates, with visual prompt, b-roll, title in video, tone, remarks.
  - Establishment, then Arc 1 (People First), Arc 2 (Value of the Tour), Arc 3 (Mid CTA Scene), Arc 4 (Short Celebratory Scene), Resolve, and Trust plus ending CTA.
  - A visual prompt for every scene: [person] + [action] + [environment] + [emotional state] + [framing].
  - The offer and lead magnet, and the CTA type from the 24-type CTA taxonomy.
  - Remarks flags on anything needing better visualisation (graph, chart, animation).
  - A standing body-language reminder on every board: no arms tucked in, no arms behind the back or hiding, conversational with a sincere outlook and tone.
- A comprehensive discovery-call extraction question set: a structured, intelligent interview the Content Strategist runs with the guest or client to extract everything needed to design the lead magnet, the offer, the hooks, and the whole storyboard. Modelled on the way this very mission brief was interviewed. Comprehensive is the standard; a static form is not sufficient.
- The winning-video feedback loop: identify high performing videos and upload their stats back into Poppy AI so its storyboard generation keeps improving. This step is automated (AI driven), not a human gate.

## 7. Approved Sources

### Lark Sources

- Base: Marketing and Delivery (M&D) base
- Table: Video table
- View: UNKNOWN, resolve against the live base
- Record/document: the video record for the shoot being planned
- Relevant fields: Storyboard field (primary write target). Confirm the status field and any hook/arc/transcript fields against the live Video table before writing.

### Internal Sources

- Poppy AI: the storyboard engine and system of record for the storyboard work. Holds the pattern library learned from the highest performing past videos. The copilot reads patterns from it and drafts against them.
- Metricool: past video performance stats, read to inform planning, and the source of the winning-video stats that get uploaded back into Poppy AI.
- The guest or client discovery-call transcript, produced by the Content Strategist using the extraction question set.
- GUIDE - Producer Marketing Plan (kept alongside this brief in the kit): the confidential storyboard structure and quality gates. This is the output template and the QC standard.

### External Sources

- Alex Hormozi offer principles ($100M Offers, $100M Leads): the reference standard for designing the offer and lead magnet. Every offer must be genuinely strong, measured against these.
- Neuro-Linguistic Programming (NLP) technique for the questions and captions: emotional framing, curiosity loops, sensory and embedded language, pattern-interrupts.

## 8. Research Requirements

Before drafting each storyboard, the copilot investigates:

- The highest performing past videos for that page and vertical, and the hook styles and angles that actually went viral in the recent window (last 90 days preferred).
- The patterns Poppy AI has learned from those winners. Examples are drawn from Poppy AI, grounded in the best performers, never from taste alone.
- The current offer or lead magnet running for that client or page.
- The guest's own business, so questions pull authority through lesson, insight, or story, never raw stat or self-praise.
- The call transcript for that specific guest or client.

Hooks are the priority research target, followed by visual prompting.

## 9. Lark Output Destination

- Base: Marketing and Delivery (M&D) base
- Table: Video table
- View: UNKNOWN, resolve against the live base
- Record: the video record being planned
- Staging field: Storyboard field
- Reference field: link the offer or lead magnet by reference, do not duplicate it into the lead-magnet table
- QA/status field: UNKNOWN. The drafted to reviewed to approved workflow is intended but the exact status field and mechanic are to be designed for best fit against the live Video table.
- Unknown items: exact view, exact status field and workflow, and whether hooks, arcs, and the transcript get their own fields or all sit inside the Storyboard field.

## 10. Brand and Tone

- Sincere, genuine, conversational. Never presentational or pitchy.
- Authority pulled through lesson, insight, or story, never raw stat or self-praise. Data becomes a story and comes off educational, not flexing.
- Apply Neuro-Linguistic Programming (NLP) technique in questions and captions to move the viewer emotionally and hold attention.
- No unverifiable claims (for example, the best in Singapore). Music and footage IP cleared. Sensitive content flagged.
- Standing Koocester rules on any copy: no dashes, no unexplained abbreviations, English only, lead with the point, speak from abundance.
- Follow the Koocester brand guideline and the vault voice reference.

## 11. Mandatory Content

Every storyboard must carry:

- The full Video Details block.
- 3 hooks, each passing the scroll-stop gates. Hooks are the single highest priority element.
- The full arc structure, Establishment through Trust and ending CTA, each passing its own gating checklist.
- A visual prompt for every scene in the [person] + [action] + [environment] + [emotional state] + [framing] format. Visual prompting is the second highest priority element.
- The offer and lead magnet, designed to Hormozi standard, and the CTA type. Keep the CTA wording as short as possible. Do not duplicate the offer or lead magnet into the lead-magnet table; reference it and keep note of it.
- Remarks flags for better visualisation wherever there is an explanation: how to show it as a graph, chart, or animation.
- The standing body-language reminder for producer and interviewee.

## 12. Restrictions and Prohibited Actions

- Never auto-approve. Only the Content Strategist marks a storyboard reviewed or approved.
- No external publishing. The copilot only writes the storyboard into the M&D base Video table. Nothing leaves the building automatically.
- Do not share the GUIDE SOP. It is confidential, verified and approved recipients only. The storyboard output may be shared with the client or interviewee so they can rehearse and see the flow, and not otherwise.
- Never write unverifiable claims. Never use uncleared music or footage IP.
- Never duplicate the offer or lead magnet into the lead-magnet table.
- Never invent a number or a guest fact. Pull from source or the call transcript, or stop and ask.
- Anything touching the offer or pricing on a paid client video stops for human approval.

## 13. Success Criteria

1. The hook is insanely good: natural, not scripted, a genuine pattern-interrupt that stops the scroll and pulls people in. This is the first thing Hakim looks at.
2. The visual prompts are on point and the producer's energy and conversation direction are crystal clear, because the visual prompts decide what the audience sees, which drives retention.
3. The questions are concise and value-packed, extracting maximum information while delivering maximum value, so the whole narrative lands more powerfully.

Through-line: hooks plus visual prompts plus question quality drive retention, which drives performance. Every video stays viral and performance-driven and fits the GUIDE values, purpose, and vision.

## 14. Limits

- Number of pages/pieces: 3 hooks and the fixed arc set per the GUIDE. Pilot with one or both of the two Content Strategists first.
- Research limits: read the relevant performance history and Poppy AI patterns for the page in question.
- Time: needed this week.
- Budget: do the best output on the most cost-efficient path. Model and cost choice is an efficiency requirement, not a fixed decision.
- Revision limits: 2 to 3 review rounds with the strategist, depending on how accurate the draft lands.

## 15. Routine Actions That May Proceed

- Research past performance and pull Poppy AI patterns.
- Draft the full storyboard into the Video table Storyboard field.
- Propose hooks, offers, lead magnets, and CTAs; flag visualisation needs in Remarks.
- Self-check the draft against every arc gating checklist and the final checks.
- Upload winning videos' stats back into Poppy AI (automated).
- Generate and refine the discovery-call extraction question set.

## 16. Major Actions Requiring Approval

- Marking a storyboard reviewed or approved (Content Strategist only).
- Sharing the storyboard with a client or interviewee for rehearsal.
- Anything touching the offer or pricing on a paid client video.

Division of labour: the copilot does research, drafting, pattern work, visualisation flags, and the stats-to-Poppy-AI loop. The Content Strategist runs the discovery call and owns review, approval, and paid-offer decisions.

## 17. Known Unknowns

- Poppy AI integration path: whether it exposes an API key, requires a paid plan, or must be driven via Playwright MCP browser automation. Faiz to find the unique identifier needed to connect to Poppy AI and upload videos.
- The exact status field and drafted to reviewed to approved workflow on the Video table, to be designed for best fit.
- Whether hooks, arcs, and the transcript get their own fields or all sit inside the Storyboard field.
- The exact list of pages in scope, resolve from the live M&D base Video table.
- Confirmation of the two Content Strategists' identities against the live HR roster, and which one pilots first.
- Where the upload-winners-to-Poppy-AI step is triggered from.

## 18. Risks or Sensitive Areas

- Confidentiality. The GUIDE - Producer Marketing Plan is confidential. The copilot must not surface it to unapproved recipients. The storyboard output is shareable only with the client or interviewee for rehearsal.
- Human-in-the-loop is load-bearing. This assists the strategist, it does not replace the discovery call or the approval. The discovery call is where the real signal is extracted and must stay human.
- Data quality and provenance. Guest facts and numbers must come from source or the transcript, never invented. Do not present a claim the source cannot support.
- Third-party dependency. The mission's depth of automation depends on Poppy AI access. If no API is available, fall back to assisted browser automation and a human upload step.
- Attribution integrity. Keep the post URL join key intact downstream; the storyboard sits upstream of the piece that later carries it.

## 19. Additional CEO Context

- This copilot sits at the top of the content machine. It feeds the producers who shoot, and downstream the copywriter and CX bots and, eventually, a video-editing agent that cuts to the storyboard.
- Poppy AI is the brain to keep smart. The single most important ongoing behaviour is the feedback loop: winners in, better storyboards out. Prioritise wiring that loop reliably.
- The discovery-call extraction question set is as important as the storyboard itself. It should be as thorough as the interview that produced this brief, and tuned to design the lead magnet, the offer, and the hooks.
- Only two Content Strategists exist today, so the efficiency gain per person is large. Build for their daily use, not a one-off.
- Recommend orchestrating the reliable, always-on parts (the winners-to-Poppy-AI loop, the base writes) consistently with the company's other engines. Keep the copilot's write surface small and well defined on day one.
