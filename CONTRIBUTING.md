# Contributing

This repo documents and packages a **live** company system. Change discipline protects a non-technical owner.

## Branch naming
`type/short-desc` — e.g. `docs/…`, `feat/…`, `fix/…`, `chore/…`, `security/…`. Never commit to `main` directly.

## Commit style
Conventional-ish: `type(scope): summary` — e.g. `docs(n8n): document reels sync`, `security(n8n): note S1 rotation`. Present tense, imperative.

## Pull request checklist
- [ ] Scope small and reversible.
- [ ] **No secrets**, no `.env`, no MCP configs, no raw n8n credential/workflow exports with secrets.
- [ ] Secret scan clean (see [docs/14](docs/14-testing-and-validation.md)).
- [ ] `.env.example` updated if env vars changed.
- [ ] Docs updated (connectors/agents/cron/n8n/dashboards/Supabase/Metabase/deploy as relevant).
- [ ] CHANGELOG entry added.
- [ ] Validation steps + final diff summary included.
- [ ] Rollback plan noted; owner assigned.

## Testing checklist
Read-only by default; no production writes/executions without explicit approval. See [docs/14](docs/14-testing-and-validation.md).

## Documentation checklist
Every change updates the doc that owns it. A change isn't done until code **and** docs **and** CHANGELOG are consistent.

## Security checklist
- No inline secrets introduced. New secrets → managed store + rotation note. New webhook has auth. Least-privilege scopes. See [docs/15](docs/15-security-and-secrets.md).

## Review checklists (use the relevant one)
- **n8n workflow:** trigger correct; credentials managed (not inline); error branch wired; safe manual test done; production risk rated.
- **Connector:** auth documented; env vars in `.env.example`; minimal scope; failure modes + safe test noted.
- **Cron/scheduled:** built in n8n (not local); schedule + timezone correct; idempotent on retry; failure visible.
- **Agent (Claude Code):** read-only unless approved; facts vs assumptions separated; docs + diff summary produced.

## How to add …
- **A connector** → [docs/06](docs/06-connectors-and-integrations.md) + `connectors/<name>/README.md`.
- **An n8n workflow** → [docs/09](docs/09-n8n-setup.md) + `n8n/workflows/README.md` (scan JSON before commit).
- **A cron job** → build it *in n8n*; document in [docs/11](docs/11-agents-and-cron-jobs.md).
- **An agent** → [docs/18](docs/18-future-claude-code-instructions.md) + `agents/README.md`.

## Never push without explicit approval from the owner.
