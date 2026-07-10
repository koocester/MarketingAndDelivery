# 09 — n8n Setup

*Verified live via `n8n-mcp`, 2026-07-10, read-only. Nothing was created, modified, activated, or executed.*

## Instance
- **Purpose:** the scheduler + outbound layer + the Command dashboard API.
- **Hosting mode:** **n8n Cloud** (SaaS). **Local path:** none. **Docker:** not installed. **Version:** n8n Cloud (via `n8n-mcp` v2.63.2).
- **URL:** `https://koocester.app.n8n.cloud` · **Owner project:** `LTEF9CFjbRXTH9hr` (2 workflows in `fD5BQ2QOv2cZxwFT`).
- **Workflow storage:** in n8n Cloud (managed DB). **Credential storage:** n8n Cloud managed **Credentials** — *except* several workflows that hardcode secrets inline (🔴 see below).
- **Webhook URLs:** base `…/webhook/…`. Command dashboard: `GET /command /growth /sales /finance /hr /tech` (Basic-Auth). Open: Candidate Analysis (form), Pre-Marketing Brief (`/26401dd5-…`), AI Video Summary — **no auth**.
- **Backup/export/import:** via n8n Cloud UI (Download workflow JSON) or the API. Redacted exports go in `n8n/workflows/`; credentials are **never** exported. See `n8n/workflows/README.md`.
- **Env vars:** `N8N_BASE_URL`, `N8N_WEBHOOK_URL`, `N8N_API_KEY` (MCP). Encryption key + creds are managed inside n8n Cloud.
- **Totals:** 26 workflows — **15 active, 7 inactive, 4 archived**; 24 managed credentials.

## 🔴 Security summary
Six secrets are hardcoded inline (S1–S6) across ~9 workflows; the Error Handling workflow is a stub (silent failures); 3 webhooks are unauthenticated. Full detail + remediation in [15-security-and-secrets.md](15-security-and-secrets.md). **Treat all n8n credentials as sensitive even though JSON exports mask values.**

## Cron cluster (07:00–09:00 SGT)
Followers 07:00 · Aspire 23:00 UTC(=07:00) · Reels SG/MY/ID 08:00/08:30/09:00 · CEO Brief + AI Cache 08:00 · Weekly Mon 08:00 · Monthly 1st 08:00 · 1-to-1 Rotator biweekly Mon 09:00 · Interviewee Remover every 5 days.

## Active workflows (per-workflow)

Template fields: **name · id · purpose · trigger · inputs → outputs · key nodes · creds · env · writes/reads · errors · safe test · prod-risk · owner.**

1. **Metricool Followers Sync** · `0jSBKXJuzwfzciWH` · followers → Lark Pages + Supabase · cron 07:00 · Metricool→Lark+`content_perf.metricool_snapshots` · creds `Postgres`; 🔴 Lark(S5)+Metricool(S6) inline · writes snapshots (append) · errors: silent · safe test: read last execution · **risk: med** (writes Supabase+Lark) · <OWNER>.
2–4. **Reels Sync SG/MY/ID** · `54vD7rU5KNMCjVq1`/`IB2XF3NMrsyzqVAy`/`qnhcgiVUB6jgqnwM` · reel metrics → Lark + `content_perf.reels` · cron 08:00/08:30/09:00 · same creds/secrets as #1 · **risk: med**.
5. **CEO Daily Brief → Lark** · `c3OAv5oJRanDv8UH` · cross-schema Postgres query → CEO+manager brief → Haiku → Hakim + 2 chats · cron 08:00 · creds `Postgres`,`Anthropic`; 🔴 Lark token inline (S4) · reads Supabase+Lark, writes Lark messages · **risk: med** (sends messages) · <OWNER>.
6. **Monthly Briefs → Lark** · `c3bYweWzK8Q4xlFe` · 6 role briefs + CEO monthly · cron 1st 08:00 · creds `Postgres`,`Anthropic`; 🔴 S4 · **risk: med**.
7. **Koocester Command (dashboard)** · `ePDPNKpgKdz4SUMZ` · role-scoped HTML dashboards · 6 Basic-Auth webhooks · reads Supabase+Lark+`command_ai_cache` · creds: 6 Basic-Auth, Lark httpCustomAuth, Postgres · ✅ **no inline secrets — reference pattern** · **risk: low** (read-only render) · <OWNER>.
8. **Command AI Cache** · `m7n7555E2t6Wlvkk` · metrics → Haiku → `public.command_ai_cache` · cron 08:00 · creds Lark(managed),Postgres,Anthropic · ✅ clean · **risk: low**.
9. **Weekly Management Report → Lark** · `yv5Pz0hpX3kHKvVE` · sales/finance + M&D → Haiku → CEO+mgmt · cron Mon 08:00 · creds `Postgres`,`Anthropic`; 🔴 S4 · **risk: med**.
10. **Aspire → Supabase Sync** · `r6PNZZURAXZA9sNI` · accounts + 7-day txns → `finance.*` · cron 23:00 UTC · creds `Aspire`(OAuth2),`Postgres` · ✅ clean · **risk: med** (writes finance).
11. **Candidate Analysis** · `MkbIUyAqel4ciIGg` · AI hiring pipeline → Drive/Docs → HR chat · **form webhook (no auth)** · creds Google Drive/Docs; 🔴 **Anthropic key ×4 nodes (S1) + Lark (S2)** · **risk: HIGH** (public endpoint + secrets) · <OWNER>.
12. **Interviewee Duplicate Remover** · `fdDm5oUOSR6IJY0M` · **DELETEs** flagged Lark rows · every 5 days · 🔴 Lark inline (S3) · **risk: HIGH** (destructive on hardcoded token).
13. **1-to-1 Rotator** · `kNQPrrS3tGaNbv0z` · pairs employees, DMs each · biweekly Mon 09:00 · 🔴 S3 · **risk: med** (sends DMs).
14. **Error Handling** · `ReSF67JnUkuFRkCZ` · ⚠️ **stub — 1 node, nothing downstream. Failures are silent.** · **risk: n/a but a gap**.
15. **Pre-Marketing Brief** · `ZkWP6YHhnC7PfdWb` · research agent → interview brief PDF · **webhook (no auth)** · creds OpenAI, SerpAPI, Google, API2PDF · ✅ no inline secrets · **risk: med** (public endpoint; holds a pinned real lead in sample data).

## Inactive (7) / Archived (4)
AI Video Summary ×4 (`7RoGbhmWamvW4pmp`,`mzXpe5ge5eItzCum`,`l4iG9BlqJsJmFFlt`,`PEDljjvly3ZSX1fd`—last has 🔴 S2) · Marketing Planner `slwrf4zMHB10Bi67` (clean) · Aspire Probe `BWnY7Pfz0BjinywI` · AI Agent demo `9mnNGKxUehiQW9kg` (delete) · Pre-Marketing Brief copy `wkOR2t6LqgIyWeeX` + 3 empty "My workflow" stubs (delete).

## External infra (not secrets, undocumented)
AWS API Gateway `2yz0y5otal.execute-api.us-east-1.amazonaws.com/default/sync-video-queuer` + S3 `gdrive-video` (video pipeline); paid services API2PDF, SerpAPI, Assembly AI, Metricool.

## Export/import procedure
- **Export:** n8n → open workflow → ⋯ → Download. **Inspect JSON for inline secrets/webhook tokens/test payloads → redact → save to `n8n/workflows/`.** Never commit credential values.
- **Import:** n8n → Import from File → then **recreate credentials** from `n8n/credentials/README.md` templates (values entered in n8n, never in the repo).
