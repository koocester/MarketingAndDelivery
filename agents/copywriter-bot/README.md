# Copywriter Bot — Carousel draft-generator kit

The prompt stack and run record for the Carousel Copywriter Bot mission (M&D carousel workflow).

- **Purpose:** an n8n bot that drafts the Instagram carousel copy stage automatically — claims `Pending Copywriting` records, writes slide copy + caption from the approved source (video transcript or article), populates the tokenized Canva master via copy-and-edit, and hands to a human reviewer. Humans review and approve; the bot never approves or publishes.
- **Operating stack:** `01-company-agent-orchestrator.md` (control layer) → `02-automation-engineer-master-system-prompt-v3.md` (role worker) → `mission-brief.md` (CEO Mission Brief, 2026-07-22).
- **Systems touched:** Lark M&D base Carousels/Videos tables (reads + `Caption` write-back only — **no schema changes**, CEO-mandated), Canva (copy-and-edit on tokenized masters; Autos master `DAHFXgXxLJA` done), Postgres `public.carousel_bot_drafts` (drafts + provenance), n8n workflow `EiG0qebUKiiRGK5m` (inactive; webhook-triggered, schedule disabled).
- **Status:** built and test-run (execution 6713, success). Zero eligible records until transcripts exist — all 7 Autos-vertical queue records have Frame.io cuts but empty `Video TXT (Transcript)` (359/391 carousel-worthy videos lack transcripts). Gating dependency: Frame.io API token → AssemblyAI transcription stage. Non-Autos verticals wait on tokenized masters per `runs/run-2026-07-22-001/designer-template-spec.md`.
- **Key findings:** Canva Autofill API needs Enterprise, but copy-and-edit path does not (validated end-to-end); copy language must match the transcript language (MY = EN/CN/Malay), never country-mapped; carousel shells carry no Page link — vertical/country inherit from the Source Video.
- **Secrets:** none in this kit; the workflow uses existing managed n8n credentials (Lark `3HvLTgbxXknIviCu`, Anthropic `sg4na3c3HYfSK4zM`, Postgres `iLlaPQLaICzc44cH`).
- **Owner:** Faiz (faiz@koocester.com).
