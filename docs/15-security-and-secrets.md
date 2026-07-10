# 15 — Security & Secrets

Read before editing any workflow or connector. Contains **no secret values** — only names, locations, and actions.

## Principles
- Never commit a secret. Reference credentials by name/id/type only.
- Never paste tokens into chat, docs, or node parameters.
- `.gitignore` blocks `.env`, MCP configs (`.claude.json`, `claude_desktop_config.json`), keys, and raw n8n credential/DB files. Keep it that way.
- Treat n8n credentials as sensitive even though JSON exports mask values.

## Where real secrets live (never copied)
| Store | Holds |
|---|---|
| `~/.claude.json` | `metabase`, `n8n-mcp` MCP tokens (global) |
| `claude_desktop_config.json` | Lark MCP auth token (npx arg) |
| claude.ai connector settings | HubSpot, Xero, Brevo, Canva OAuth |
| n8n Cloud Credentials | Postgres, Anthropic, Lark httpCustomAuth, Aspire, Google, dashboard Basic-Auth |
| Vercel project env | `LARK_*` for the dashboard app |
| Fivetran | HubSpot + Xero read credentials |

## 🔴 Finding: hardcoded inline secrets in n8n (rotate + migrate)
| ID | Secret (redacted) | Location (workflow → node) | Action |
|---|---|---|---|
| S1 | Anthropic key `sk-ant-***` (~108) | Candidate Analysis (`MkbIUyAqel4ciIGg`) → Hiring Scorer / Counter-Check 75+ / Hiring Auditor / Hiring Adversary (`x-api-key` header) | Rotate; use managed `sg4na3c3HYfSK4zM` |
| S2 | Lark app_secret `***` (32), app `cli_a9c90133f0f8deee` | Candidate Analysis → Get Lark Token; AI Video Summary (Lark Drive) `PEDljjvly3ZSX1fd` → HTTP Request5 | Rotate; managed httpCustomAuth |
| S3 | Lark app_secret `***` (32), app `cli_a9d78cfa8bb8ded0` | Interviewee Remover `fdDm5oUOSR6IJY0M` → Call Lark Base; 1-to-1 Rotator `kNQPrrS3tGaNbv0z` → Get Token | Rotate; managed cred |
| S4 | Lark app_secret `***` (32), app `cli_aa914316d6b8deed` | CEO Daily `c3OAv5oJRanDv8UH`, Monthly `c3bYweWzK8Q4xlFe`, Weekly `yv5Pz0hpX3kHKvVE` → Get Lark Token | Migrate to existing managed `3HvLTgbxXknIviCu` |
| S5 | Lark app_secret `***` (32), app `cli_aaab8a2fc3391ed2` | Followers + 3 Reels syncs → Get Lark Token | Rotate; managed cred |
| S6 | Metricool `X-Mc-Auth: ***` (64) | inline in ~28 + ~18×3 httpRequest nodes across the 4 Metricool workflows | Rotate; managed httpHeaderAuth (touches many nodes) |

> The `cli_…` app IDs are identifiers (not secrets) and are listed so the engineer knows which Lark apps to rotate. The app_secret values are **not**, and must never be, recorded here.

## Remediation order
1. Rotate every secret at source (assume compromised once seen in logs).
2. Recreate as managed n8n Credentials; repoint nodes.
3. Delete inline strings; clear old execution logs if possible.
4. Re-verify each workflow.

## Other security items
- **Unauthenticated webhooks:** Candidate Analysis (form), Pre-Marketing Brief (`/26401dd5-…`), AI Video Summary. Add auth or restrict.
- **No error alerting:** `Error Handling` (`ReSF67JnUkuFRkCZ`) is a stub — failures silent. Wire to Lark/email.
- **Command dashboard** webhooks are Basic-Auth but public-URL — rotate the password; treat as internet-reachable.
- **n8n Cloud login** is the highest-value target (keys to Lark write-back, Supabase, Anthropic) — enforce 2FA.

## If you find a new secret
Do not print or copy it. Record only the variable name + file path here, add the file to `.gitignore`, and recommend rotation if it may have been exposed. For n8n, never export raw credentials; inspect workflow JSON for embedded tokens/webhook secrets/test payloads before committing.
