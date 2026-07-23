# CEO Mission Brief

## Brief Metadata

- Brief date: 2026-07-22
- Prepared for: Faiz
- Role: Customer Success (CX) agent. Note: CX, never CS. In this company CS means Content Strategist.
- Mission name: CX Client Journey and Retention Agent
- Priority: High
- Deadline: This week, alongside completing the ManyChat and HubSpot loop
- Recurring or one-time: Recurring, always on

## 1. Executive Summary

Build a Customer Success (CX) agent that owns the client journey after the sale. It keeps every client constantly updated on their projects, pulls real performance numbers, collects feedback, and keeps the experience at a premium standard. The business goal is revenue: excellent client retention and strong word of mouth, which in turn opens the door to a recurring revenue model the company does not have today. The agent nurtures the journey. A human CX person closes renewals and sales.

## 2. Business Objective

Drive revenue through excellent client retention and strong word of mouth. Every client is fulfilled properly and feels successful, which makes recurring deals closeable.

## 3. Business Reason

The company currently has no recurring revenue model. A great, consistent customer experience is the lever to build one. Done well, it lets us close more recurring work, surfaces the mishaps and inefficiencies in the business so we can fix them, and gathers client feedback along the way.

## 4. Target Audience

Existing Koocester clients who have bought content and services.

- What they struggle with: keeping up with what they bought. They are busy running their own business, and on our side projects are sometimes not handled properly.
- What the agent does for them: stays on top of their projects and keeps them continuously updated on every step, the results, and how we are optimising. It closes the loop every time.
- What they expect: to feel in the loop at every meaningful action.
- Action they take: acknowledge the updates, have a genuinely pleasant experience, and keep working with us.

## 5. Desired Audience Outcome

After experiencing this, the client should feel it is great to work with us, a standout experience. They continue with us for their marketing because they get results, they refer others, they speak well of our service, and they feel we always went the extra mile.

## 6. Required Deliverables

The agent owns the whole customer journey, specifically:

- Proper onboarding
- Ongoing client updates and progress communications
- A structured follow up cadence
- Feedback collection
- Retention management, keeping clients and setting up renewals
- Continuous optimisation of the customer experience

Update cadence: event driven, an update at every meaningful action, plus a weekly recap of what we did.

## 7. Approved Sources

### Lark Sources

- Base: Marketing and Delivery (M&D) base
- Table: Projects table, where client projects live and work is done and tracked. Also the client table in the M&D base as secondary client data once HubSpot is set up.
- View: UNKNOWN
- Record/document: matched by unique Project Number, and video numbering tied to the project
- Relevant fields: Project Number, delivery status, per project progress, post URL, video numbering. Measurables for client success already live in Lark.

### Internal Sources

- HubSpot: source of truth for clients. Holds leads and pipeline. To be the client level system of record for CX status, updates log, and feedback once properties are set up. Caution: HubSpot deal stages and close rate have been unreliable when records are created offline. Trust worked and verified data, not raw pipeline counts.
- Metricool: social content stats across all channels, where content is uploaded from.
- Post Campaign Report (PCR): existing automation that turns social stats into client facing reporting.

### External Sources

- Best practice customer success and retention playbooks, for follow up cadence, health signals, and churn prevention.

## 8. Research Requirements

Before and while communicating, the agent should look into:

- Each client's project history and delivery status
- Content performance stats and analysis from Metricool
- Past feedback
- What success looks like for that specific client and how it is achieved. Measurables already live in Lark.
- Best practice CX follow up and retention approaches
- Continuously, whether the customer experience and journey are at the highest standard

## 9. Lark Output Destination

Primary destination is HubSpot at the client level, reading project status from the M&D Projects table, with WhatsApp as the live client facing update channel, likely delivered through ManyChat.

- Base: HubSpot is the client level log and status system of record. M&D Projects table is read for project status.
- Table: HubSpot client and deal records. M&D Projects table for delivery detail.
- View: UNKNOWN
- Record: keyed on the unique Project Number, present in both HubSpot and the M&D Projects table
- Staging field: UNKNOWN, to be created in HubSpot
- Reference field: link PCR reports and creative from the HubSpot record rather than duplicating them
- QA/status field: a CX health or status property in HubSpot, to be created
- Unknown items: HubSpot properties for CX health, last update sent, feedback, and renewal date do not exist yet and must be created. Project Number is not yet keyed into HubSpot. The field where collected feedback should land is not yet named. WhatsApp delivery via ManyChat needs confirming.

## 10. Brand and Tone

- Direct and warm
- Premium and concise
- Proactive
- No buzzwords
- Anything running long goes to bullets, not walls of text
- Speaks from abundance, always on the client's side, makes them feel great
- Follows the Koocester brand guidelines and the vault voice reference
- Standing client facing rules apply: no dashes, no unexplained abbreviations, English only

## 11. Mandatory Content

Every client update must carry:

- Current project status, how we are doing on it
- What we did this week toward it
- Anything we are waiting on from the client
- Performance numbers
- Next steps with a clear call to action
- The client's name and point of contact

Numbers discipline: any performance number must be pulled live from source (Metricool or PCR) at send time. Never hardcoded, never repeated from an old message.

## 12. Restrictions and Prohibited Actions

- Never lie. Never invent a number or a delivery status. Pull data correctly from source.
- When unsure, stop and ask for approval. Uncertainty is the escalation trigger.
- Never promise anything not committed, including dates and outcomes.
- Never share confidential or internal company information. Only share what pertains to that client's own projects, scoped by their Project Number and the video numbering tied to that project. No cross client leakage.
- Never discount or change pricing. Discounts are out of scope for now.

## 13. Success Criteria

1. The customer is always updated and never in the dark.
2. Clients keep going with us for their marketing because they are getting results.
3. Great word of mouth to everyone they meet.

## 14. Limits

- Length: messages short, simple, concise
- Number of deliverables: pilot with a set of clients first, before rolling out to all
- Research limits: read full client history, from the beginning of the relationship to the present
- Time: needed this week
- Budget: most cost efficient path possible. Whether it runs on the Claude API is not yet decided. Model and cost choice is an efficiency requirement, not a fixed decision.
- Revision limits: during pilot, Hakim reviews messages before they send

## 15. Routine Actions That May Proceed

- Updating clients on status and journey
- Keeping the experience excellent
- Sending client updates. During pilot these are reviewed by Hakim first. Steady state is autonomous sending once trusted.

## 16. Major Actions Requiring Approval

Route to a human, the CX person:

- A client showing unhappiness. A human attends.
- Making or renewing any commitment. The human CX closes the renewal or sale, not the agent.
- Anything touching pricing.
- Deeper sales questions. Even with a sales kit that could answer them, a human handles these first, kept separate for now.

Division of labour: the agent nurtures the journey, the human closes.

## 17. Known Unknowns

- HubSpot properties for CX health, last update sent, feedback, and renewal date are not built yet.
- The unique Project Number is not yet keyed into HubSpot.
- The field or place where collected feedback should land is not named.
- Whether the agent runs on the Claude API and the exact cost model.
- Which specific clients are in the pilot set.
- WhatsApp delivery through ManyChat needs confirming.

## 18. Risks or Sensitive Areas

- The agent posts into live client WhatsApp groups. This is customer facing with real reputational stakes. Guardrail is not a blanket approval gate. Default is autonomous, escalate when unsure, and Hakim reviews during pilot.
- Cross client data leakage. Strict scoping by Project Number and video numbering is required so a client only ever sees their own data.
- HubSpot data quality. Deal stages and close rate have been unreliable when records are created offline. Do not present raw pipeline figures as fact.
- Dependency risk. The agent cannot fully run until the ManyChat and HubSpot loop is complete, including properties and the Project Number join key. This is targeted for this week.

## 19. Additional CEO Context

Hakim asked that architecture be led by whoever knows the sources of truth. System context to guide Faiz:

- Join key. A single unique Project Number must exist in both HubSpot and the M&D Projects table. This is the pattern already used in the company, where a shared key joins systems. Video numbering ties back to the project.
- ManyChat is already live to n8n. It is the likely delivery path for WhatsApp updates.
- PCR is an existing automation. Reuse it rather than rebuilding client reporting.
- Recommend orchestrating in n8n for reliability and always on operation, consistent with the company's other engines.
- Same week setup outside this agent: complete HubSpot and ManyChat, key in the Project Number, create the needed HubSpot properties, and teach sales to use HubSpot properly.
- HubSpot schema will keep changing. Keep the agent's write surface small and well defined on day one rather than modelling everything at once.
