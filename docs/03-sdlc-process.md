# 03 — SDLC Process

A lightweight but real software-delivery process for this repo. It exists because a non-technical owner depends on the system staying up — change discipline is the safety net.

## Lifecycle phases
1. **Requirement gathering** — capture the business goal + who asked; log it in [04-requirements-and-decisions.md](04-requirements-and-decisions.md).
2. **Analysis** — which plane owns it (Lark / AnyCross / n8n / Supabase / Metabase / app)? What data + secrets are touched?
3. **Design** — write it down (an ADR for anything architectural). Prefer the existing plane boundaries.
4. **Implementation** — on a branch; small, reversible changes; never edit live secrets inline.
5. **Testing** — read-only validation first; no production writes without approval ([14](14-testing-and-validation.md)).
6. **Deployment** — Vercel (app) or n8n Cloud UI (workflows); document in [13](13-deployment-runbook.md).
7. **Monitoring** — check n8n executions; today error alerting is a gap (fix it).
8. **Maintenance** — rotate secrets, prune dead workflows, keep docs in sync.

## Agile vs Waterfall — when to use which
- **Agile (default):** small connector tweaks, new cards, new workflows, dashboard changes — iterate, ship, validate.
- **Waterfall (up-front design):** anything touching the **data model**, credential architecture, or a migration — design fully, get sign-off, then execute (migrations are hard to reverse and 21+ people depend on the base).

## Change-request process
Open a short change note: goal → plane → systems touched → secrets → test plan → rollback → docs to update → owner. Get CEO approval for anything that writes to production or changes standing config.

## Checklists

**Pull request**
- [ ] Branch named `type/short-desc`; scope small.
- [ ] No secrets, no `.env`, no raw n8n credential/workflow exports with secrets.
- [ ] `.env.example` updated if env vars changed.
- [ ] Docs updated (connectors/agents/cron/n8n/dashboards/Supabase/Metabase/deploy as relevant).
- [ ] Validation steps added/updated; final diff summary included.

**Release**
- [ ] Change logged in [../CHANGELOG.md](../CHANGELOG.md).
- [ ] Rollback plan written. [ ] Owner assigned. [ ] Monitoring confirmed.

**Rollback**
- [ ] Vercel: redeploy previous deployment. [ ] n8n: revert workflow version / re-disable. [ ] Verify downstream (dashboards/briefs) recovered.

**Security review**
- [ ] No inline secrets introduced. [ ] New secrets → managed store + rotation note. [ ] New webhook has auth. [ ] Least-privilege scopes.

**n8n workflow review**
- [ ] Trigger correct (cron/webhook). [ ] Credentials referenced by managed cred, not inline. [ ] Error branch wired. [ ] Safe manual test done. [ ] Production risk rated.

**Connector review**
- [ ] Auth method documented. [ ] Env vars in `.env.example`. [ ] Read vs write scope minimal. [ ] Failure modes + safe test noted.

**Cron/scheduled review**
- [ ] Built in n8n (not local). [ ] Schedule + timezone correct. [ ] Idempotent/safe on retry. [ ] Failure visible.

**Agent (Claude Code) review**
- [ ] Read-only unless approved. [ ] No production writes without sign-off. [ ] Facts vs assumptions separated. [ ] Docs + diff summary produced.

> Mermaid mind-map of this process: [diagrams/sdlc-process.mmd](diagrams/sdlc-process.mmd).
