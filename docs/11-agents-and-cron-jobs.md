# 11 — Agents & Cron Jobs

**Important:** there are **no local cron jobs and no standalone agent daemons**. All scheduling lives in **n8n Cloud**; "agents" are Claude Code sessions via MCP + the AnyCross automations inside Lark.

## Scheduled automations (all in n8n) — see [09](09-n8n-setup.md)
| Job | Type | Trigger | In → Out | Files | Env | Failure handling | Owner |
|---|---|---|---|---|---|---|---|
| Metricool Followers Sync | n8n | cron 07:00 | Metricool → Lark+`content_perf` | — | S5,S6 | none (silent) | <OWNER> |
| Reels Sync ×3 | n8n | cron 08:00/08:30/09:00 | Metricool → Lark+`content_perf.reels` | — | S5,S6 | none | <OWNER> |
| Aspire → Supabase | n8n | cron 23:00 UTC | Aspire → `finance` | — | Aspire OAuth | none | <OWNER> |
| CEO Daily Brief | n8n | cron 08:00 | Supabase+Lark → Lark msg | — | S4,Anthropic | none | <OWNER> |
| Weekly Report | n8n | cron Mon 08:00 | Supabase+Lark → Lark msg | — | S4 | none | <OWNER> |
| Monthly Briefs | n8n | cron 1st 08:00 | Lark+Supabase → Lark msg | — | S4 | none | <OWNER> |
| Command AI Cache | n8n | cron 08:00 | Supabase → `command_ai_cache` | — | Anthropic | none | <OWNER> |
| 1-to-1 Rotator | n8n | biweekly Mon 09:00 | Lark → Lark DMs | — | S3 | none | <OWNER> |
| Interviewee Remover | n8n | every 5 days | Lark → **DELETE** rows | — | S3 | none | <OWNER> |

## Real-time automations (AnyCross, in Lark) — see the ADR & history
Project fan-out, role auto-assign, stage-gated buttons, role notifications, Content-Calendar sync, SLA overdue scans. **No MCP** for AnyCross — confirm specifics in-console; ~78 automations total on the M&D base.

## "Agents"
- **Claude Code sessions** operate the system via MCP (`lark`, `n8n-mcp`, `metabase`, Xero/HubSpot). They are **not** deployed processes. Rules for them: [18](18-future-claude-code-instructions.md).
- The `agents/` folder documents this and holds any future agent code.

## Manual / safe run
- **Manual run:** in n8n, open a workflow → *Execute Workflow* (⚠️ this may send messages / write data — use a test chat/table first).
- **Safe test:** read the last execution (`n8n_executions`) or `n8n_get_workflow` — no side effects.

## Template — adding a future Agent / Cron / n8n workflow
```
Business goal:
Automation type:        (n8n workflow | Claude agent | AnyCross automation)
Trigger:                (cron expr | webhook | record change)
Inputs:
Outputs:
Systems touched:
Secrets needed:         (must be a managed credential, never inline)
Data safety concerns:   (does it write/delete production data?)
Test plan:              (read-only first; test chat/table before prod)
Rollback plan:
Monitoring:             (how will failure be seen? wire the error branch)
Documentation updates:  (which docs/README to update)
Owner:
```
