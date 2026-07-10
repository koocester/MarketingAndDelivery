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
26 workflows (15 active). ✅ **All 15 active workflows are exported** (sanitized) in [`workflows/`](workflows/) — structure byte-identical, secret values replaced by `<REDACTED_*>` placeholders, PII scrubbed, all validated as JSON against live node counts. Also here: [how-briefs-and-command-read-the-base.md](how-briefs-and-command-read-the-base.md). The 7 inactive + 4 archived are not exported (procedure in `workflows/README.md`).
