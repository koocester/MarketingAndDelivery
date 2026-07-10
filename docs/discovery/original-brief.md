# Original Engineering Brief (the mandate)

The brief this repo was built against, preserved verbatim in substance so future engineers and future Claude Code agents understand **what was asked, what was forbidden, and why the repo looks the way it does.**

---

## Role assigned
Senior software engineer · technical lead · documentation engineer · systems reconstruction specialist.

## Situation
> "The GitHub repo is currently empty or barely documented. The actual working system was created manually on this laptop through Claude Code / desktop control / terminal commands. The CEO is non-technical, but the current setup works."

## Objective
Professionally reconstruct, document, and package the working system into a private GitHub repo so future engineers and future Claude Code sessions fully understand what exists, how it works, and how to safely extend it.

> "The goal is not just to make a README. The goal is to create a professional engineering knowledge base, like a real bank, enterprise, or internal engineering team handover package."

Systems in scope: Lark · HubSpot · Xero · Supabase · Metabase · n8n · MCP connectors · cron jobs · scheduled agents · dashboards · API scripts · webhooks · environment variables · local machine setup · deployment/runtime configuration.

## Critical framing
> "The repo may currently contain nothing. **Do not assume the repo is the source of truth.** The source of truth is the working setup on this laptop."

## Mission
1. Discover where the working automation files, scripts, configs, cron jobs, MCP configs, n8n workflows, Supabase files, Metabase notes, and env files live on the machine.
2. Reconstruct the system architecture from machine state.
3. Create a clean private repo structure.
4. Copy only the correct project files.
5. Export or document n8n workflows safely.
6. Create complete documentation for engineers and future agents.
7. Redact all secrets.
8. Do not break the working setup.

## Absolute rules (honoured throughout)
- Do not delete or overwrite the working setup.
- Do not expose secrets: API keys, tokens, passwords, OAuth credentials, Supabase service-role keys, HubSpot tokens, Xero secrets, Lark secrets, Metabase/n8n credentials, webhook secrets, cookies, SSH keys, private user data.
- **Do not copy personal files** from the CEO's laptop. No Downloads, Desktop files, browser data, chat logs, or private documents.
- Only copy files clearly part of the automation project. If unsure, list as a **candidate** and ask before copying.
- Do not push to GitHub until explicitly approved.
- Work on branch `docs/system-reconstruction`.
- **Do not invent details.** If something is unknown, write it as an open question.
- Preserve the working system first; documentation second.
- Treat n8n workflow credentials as sensitive even when exports mask values.
- Do not trigger production n8n workflows, HubSpot/Xero/Lark/Supabase/Metabase writes without explicit approval.

## Required deliverables
Discovery inventory + reconstruction notes; README; CHANGELOG; CONTRIBUTING; `.env.example`; `.gitignore`; `docs/00–18`; ADR-0001; Mermaid diagrams (system overview, data flow, agent workflow, n8n workflow map, deployment workflow, SDLC); per-connector docs; Supabase/Metabase/n8n setup docs; n8n workflow + credential documentation templates; requirements traceability table; strict operating instructions for future Claude Code sessions.

---

## How this brief was satisfied
| Requirement | Where |
|---|---|
| Discovery before assumption | [inventory.md](inventory.md), [reconstruction-notes.md](reconstruction-notes.md) |
| Architecture reconstruction | [../05-architecture.md](../05-architecture.md), [../adr/ADR-0001-reconstructed-current-architecture.md](../adr/ADR-0001-reconstructed-current-architecture.md) |
| Only correct files copied | `apps/smm-carousel-dashboard/`, `scripts/build_dashboard.py` — business-data files left out as candidates |
| n8n documented, exports deferred | [../09-n8n-setup.md](../09-n8n-setup.md), `n8n/workflows/README.md` |
| Secrets redacted | [../15-security-and-secrets.md](../15-security-and-secrets.md) — S1–S6, values never recorded |
| Working setup untouched | Read-only discovery; no production writes or workflow executions |
| Nothing invented | Unknowns tracked as open questions in [../04-requirements-and-decisions.md](../04-requirements-and-decisions.md) |

## Deviations from the brief (deliberate, with reasons)
1. **Repo lives standalone, not inside the CEO's vault.** The vault is a personal second brain (profile, journals, finances). Building the repo there and pushing would publish personal data — a direct violation of "do not copy personal files." The package was therefore extracted to its own repo.
2. **n8n workflow JSON not exported yet.** Several live workflows hardcode secrets inline; exporting them today would commit secrets. Export is deferred until rotation (procedure documented).
3. **Business-data files not copied** (`SMM Carousel Tracker.csv`, generated `dashboard.html`) — listed as candidates awaiting CEO confirmation, per the "if unsure, ask" rule.
