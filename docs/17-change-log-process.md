# 17 — Change-Log Process

Keep [../CHANGELOG.md](../CHANGELOG.md) current so the system's history is legible to the next engineer/agent.

## When to log
Every change that affects a connector, n8n workflow, cron/automation, Supabase, Metabase, a dashboard, the app, deployment, or security posture.

## Format (Keep-a-Changelog)
```
## [Unreleased]
### Added / Changed / Fixed / Removed / Security
- <what changed> — <why> — <who> (<date>)
```
- Group under the right heading; **Security** for anything touching secrets/auth/webhooks.
- Convert relative dates to absolute (YYYY-MM-DD).
- Reference workflow/dashboard IDs where relevant.

## Release flow
1. Accumulate under `[Unreleased]`.
2. On a meaningful milestone, cut a dated version heading.
3. Ensure docs touched by the change were updated in the same PR (see the PR checklist in [03](03-sdlc-process.md)).

## Tie-in with docs
A change is not "done" until: code/config changed **+** relevant doc updated **+** `.env.example` updated if vars changed **+** CHANGELOG entry added **+** validation noted.
