# 16 — Troubleshooting

## Fast triage: "where do I look?"
| Symptom | Likely cause | Where |
|---|---|---|
| Social/follower numbers stale | Metricool n8n sync failed | n8n `0jSBKXJuzwfzciWH` + reels syncs → Executions |
| Finance numbers stale | Aspire n8n sync failed | n8n `r6PNZZURAXZA9sNI` |
| Sales/CRM stale | Fivetran sync lag/auth | Fivetran (HubSpot) |
| AR/revenue stale | Fivetran (Xero) | Fivetran |
| A brief didn't arrive | brief workflow failed silently | n8n `c3OAv5oJRanDv8UH`/`yv5Pz0hpX3kHKvVE`/`c3bYweWzK8Q4xlFe` |
| Command dashboard blank/old | AI cache didn't run / Basic-Auth | n8n `m7n7555E2t6Wlvkk`, `ePDPNKpgKdz4SUMZ` |
| Vercel dashboard shows "sample data" | Lark env vars missing / app not a Base collaborator | Vercel env + Lark app scopes |
| Follower chart drops days | `>= 48` completeness rule / new page or platform | Metabase card SQL |
| Lark button "does nothing" | wrong-stage silent no-op | the button's stage-gated automation |

## Known issues (open)
0. 🔴 **`Reject Video` button is UNGUARDED** — the `Video - Organic video rejected` automation has an empty conditions block. Clicking it on **any** video at **any** stage (incl. Completed/published) sets `Rejected/DO NOT POST` **and DMs the Producer**. 6 other button automations are also unguarded. **Documented, deliberately not fixed** (owner decision 2026-07-10). See [../connectors/lark/07-button-automation-audit.md](../connectors/lark/07-button-automation-audit.md).
1. **Silent n8n failures** — `Error Handling` is a stub; nothing alerts. Until fixed, check Executions manually.
2. **Inline secrets (S1–S6)** — see [15](15-security-and-secrets.md).
3. **Unauthenticated webhooks** — 3 public endpoints.
4. **`marts.targets` orphaned** — actual-vs-target not wired.
5. **dbt `xero_staging`/`xero_reports` unused** — cards hit raw `xero.*`.
6. **Metricool overwrite risk** — `metricool_snapshots` must append dated rows.
7. **Aspire = card float only** — don't compute runway from `finance`.
8. **Lark automations have no API** — 90 automations / 74 active; auditable only in the UI Automation Center.

## Diagnostics (read-only)
- n8n: `n8n_get_workflow`, `n8n_executions` (inspect last runs).
- Supabase: `select max(snapshot_date) …`; row counts.
- Vercel: `GET /api/carousels`; function logs.
- Metabase: compare card total to a direct `SELECT`.

## Recovery
- **Failed n8n run:** open the execution, read the error node, fix creds/data, re-run on a **test** target first.
- **Vercel:** promote a previous deployment.
- **Bad Metabase card:** revert to a duplicated original.
- **Wrong data in Lark from an automation:** Lark trash retains deletes ~30 days; restore, then fix the automation condition.
