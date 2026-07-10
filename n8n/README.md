# n8n/

Documentation + redacted exports for the n8n Cloud instance (`koocester.app.n8n.cloud`). Full setup + per-workflow detail: [../docs/09-n8n-setup.md](../docs/09-n8n-setup.md).

```
n8n/
├── README.md          ← this file
├── workflows/         ← REDACTED workflow JSON exports (secret-scanned) + import guide
└── credentials/       ← credential DOC TEMPLATES only (never real values)
```

## Rules
- **Never** export or commit credential values. Treat n8n creds as sensitive even in masked exports.
- Before committing any workflow JSON: scan for inline secrets, webhook tokens, and pinned test payloads → redact.
- Changes to production workflows require approval and testing on a test chat/table (see [../docs/13-deployment-runbook.md](../docs/13-deployment-runbook.md)).

## Current status
26 workflows (15 active). Redacted exports are **not yet added** — see `workflows/README.md` for the procedure (deferred because several workflows embed inline secrets that must be rotated first).
