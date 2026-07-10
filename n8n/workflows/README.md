# n8n/workflows — sanitized exports

All **15 active** workflows, exported from `koocester.app.n8n.cloud` and verified against the live instance (node counts cross-checked). Structure is **byte-identical**; only **secret values** were replaced with placeholders. Every file validates as JSON.

> Per-workflow narrative (trigger, purpose, risk): [../../docs/09-n8n-setup.md](../../docs/09-n8n-setup.md). How the briefs/dashboard read the base: [../how-briefs-and-command-read-the-base.md](../how-briefs-and-command-read-the-base.md).

## Exported files
| File | Workflow (id) | Nodes | Trigger |
|---|---|---|---|
| `metricool-lark-followers-sync.json` | Metricool Lark Followers Sync (`0jSBKXJuzwfzciWH`) | 60 | cron `0 7 * * *` |
| `metricool-lark-reels-sync-sg.json` | Reels Sync SG (`54vD7rU5KNMCjVq1`) | 31 | cron `0 8 * * *` |
| `metricool-lark-reels-sync-my.json` | Reels Sync MY (`IB2XF3NMrsyzqVAy`) | 28 | schedule 08:30 |
| `metricool-lark-reels-sync-id.json` | Reels Sync ID (`qnhcgiVUB6jgqnwM`) | 28 | cron `0 9 * * *` |
| `pre-marketing-brief.json` | Pre-Marketing Brief (`ZkWP6YHhnC7PfdWb`) | 24 | webhook (no auth) |
| `candidate-analysis.json` | Candidate Analysis (`MkbIUyAqel4ciIGg`) | 23 | form webhook (no auth) |
| `monthly-briefs-lark.json` | Monthly Briefs → Lark (`c3bYweWzK8Q4xlFe`) | 21 | cron `0 8 1 * *` |
| `koocester-command-live-dashboard.json` | Koocester Command (`ePDPNKpgKdz4SUMZ`) | 12 | 6 Basic-Auth webhooks |
| `ceo-daily-brief-lark.json` | CEO Daily Brief → Lark (`c3OAv5oJRanDv8UH`) | 12 | cron `0 8 * * *` |
| `weekly-management-report-lark.json` | Weekly Management Report (`yv5Pz0hpX3kHKvVE`) | 9 | cron `0 8 * * 1` |
| `command-ai-cache-daily-8am.json` | Command AI Cache (`m7n7555E2t6Wlvkk`) | 8 | cron `0 8 * * *` |
| `1-to-1-rotator.json` | 1-to-1 Rotator (`kNQPrrS3tGaNbv0z`) | 6 | biweekly Mon 09:00 |
| `lark-interviewee-duplicate-remover.json` | Interviewee Duplicate Remover (`fdDm5oUOSR6IJY0M`) | 5 | every 5 days |
| `aspire-supabase-sync.json` | Aspire → Supabase Sync (`r6PNZZURAXZA9sNI`) | 5 | cron `0 23 * * *` UTC |
| `error-handling.json` | Error Handling (`ReSF67JnUkuFRkCZ`) | 1 | Error Trigger (**stub**) |

> The **Command dashboard's base64 HTML template** lives inside `koocester-command-live-dashboard.json` — exporting the workflow captured it.

## Placeholders → real credentials
Replace these in n8n **after import** (never in this repo). Details: [../credentials/README.md](../credentials/README.md).

| Placeholder | Occurrences | Real credential to use instead |
|---|---|---|
| `<REDACTED_METRICOOL_API_KEY>` | 96 | Metricool `X-Mc-Auth` → create a managed httpHeaderAuth cred |
| `<REDACTED_LARK_APP_SECRET>` | 10 | Lark app secret → managed `Lark App Secret (Koocester)` (`3HvLTgbxXknIviCu`) |
| `<REDACTED_ANTHROPIC_API_KEY>` | 4 | Anthropic → managed `Anthropic API – Koocester` (`sg4na3c3HYfSK4zM`) |

**Preserved (identifiers, not secrets):** Lark `app_id` (`cli_…`), base/table ids, Metricool `blogId`s, workflow/node ids, credential **name + id** references, webhook paths, node positions, connections, `staticData`, and the disabled legacy branch in the followers sync. Google Drive/Docs `fileId`s are retained — they are document identifiers and still require Google auth to open.

## Privacy
`pre-marketing-brief.json` had `pinData` containing a **real lead's PII** (name, WhatsApp, company/social URLs, IP/headers, full agent output). It was **replaced with `{}`**. All other files ship `pinData: {}`.

## ⚠️ Fidelity caveat
For `pre-marketing-brief.json`, the three long LLM prompt bodies (Research Agent, Questions Agent, Translation) were **transcribed** from decoded API output rather than byte-copied. Content and expressions are reproduced and all structural/load-bearing fields are exact, but **diff against a fresh export before reusing those prompts verbatim** if whitespace/curly-quote fidelity matters. Every other file is a faithful copy.

## Re-import procedure
1. n8n → **Import from File** → select the JSON.
2. Recreate credentials ([../credentials/README.md](../credentials/README.md)) and **repoint each node to the managed credential** — do **not** paste secrets back into node parameters (that is exactly how S1–S6 arose; see [../../docs/15-security-and-secrets.md](../../docs/15-security-and-secrets.md)).
3. Search the workflow for `<REDACTED_` and confirm none remain.
4. **Test on a test chat/table before activating.** Several of these send Lark messages, write to Supabase, or DELETE records.
5. Activate only after sign-off ([../../docs/13-deployment-runbook.md](../../docs/13-deployment-runbook.md)).

## Not exported
The 7 inactive + 4 archived workflows (AI Video Summary ×4, Marketing Planner, Aspire Probe, AI Agent demo, Pre-Marketing Brief copy, 3 empty stubs). Export with the same sanitisation rules if needed — `AI Video Summary (Lark Drive)` carries an inline Lark secret (S2).
