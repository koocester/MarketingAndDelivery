# 18 — Instructions for Future Claude Code Sessions

You are operating a **live company system** that a non-technical owner depends on. Behave like a careful senior engineer.

## Always
1. **Read [../README.md](../README.md) and [00-start-here.md](00-start-here.md) first.**
2. **Inspect `git status`** before doing anything.
3. **Create a branch** before changes (`git checkout -b type/desc`). Never work on `main` directly.
4. **Verify live via MCP** before asserting facts — this repo is a 2026-07-10 snapshot; the cloud systems move.
5. **Separate discovered facts from assumptions** in everything you write.
6. **Identify which plane owns the automation** (n8n / cron-in-n8n / script / AnyCross / agent) *before* modifying it.
7. **Update docs** whenever you change a connector, agent, cron/automation, n8n workflow, dashboard, Supabase, Metabase, or deployment logic.
8. **Update `.env.example`** when adding an env var.
9. **Add/update validation steps** and **produce a final diff summary**.
10. **Document unknowns** as open questions.
11. **Protect the CEO's laptop privacy** — never pull personal vault files into the repo.

## Never
- Expose or print a secret; commit `.env`, MCP configs, or raw n8n credential/workflow exports containing secrets.
- Commit an n8n workflow export **without** scanning it for inline secrets/webhook tokens/test payloads first.
- Overwrite working code blindly or make large refactors without approval.
- Trigger production writes — Lark/HubSpot/Xero/Supabase/Metabase writes, or n8n workflow executions/activations — **without explicit approval**.
- Assume business requirements. Ask or mark as open.
- **Push** unless explicitly told.

## Before you finish any task
- [ ] Secret scan clean (see [14](14-testing-and-validation.md)).
- [ ] Docs + `.env.example` + CHANGELOG updated as needed.
- [ ] Facts vs assumptions separated; unknowns listed.
- [ ] Final diff summary produced.
- [ ] Stated whether it is safe to commit / push (default: do **not** push).

## Handy read-only entry points
`n8n_list_workflows` · `metabase list_dashboards` / `execute_query` · Lark `bitable_v1_appTableRecord_search` · Xero `get_contacts_and_receivables`. All read-only — keep it that way unless approved.
