# Portal 05 — Change Process (the SDLC, applied to the portal)

The portal follows the same 8-phase SDLC as the rest of the repo ([../docs/03-sdlc-process.md](../docs/03-sdlc-process.md)). This page makes each phase concrete **for a portal change**, because the portal has two things the other layers don't: an edge security boundary that can fail open, and a deploy that can lock out 35 people if it ships broken.

## The 8 phases, applied

| Phase | For a portal change, this means | Home |
|---|---|---|
| 1 · Requirement | Who asked, what staff-facing outcome? (a new tool tile, a role gains a dashboard, a new deck) | [docs/04](../docs/04-requirements-and-decisions.md) |
| 2 · Analysis | Which gate does it touch — edge, a hard Function, or a soft client guard? Does it expose money/salary/PII? If yes → it must be a **hard** gate. | [01](01-access-and-gates.md) |
| 3 · Design | Is it access (data) or behaviour (code)? Access changes are a **row edit**, not a deploy. Anything touching the gate model gets written down first. | [04](04-academy-auth.md) |
| 4 · Implementation | Edit in the vault (`04. Resources/Training/`). Small, reversible. **Never inline a new secret** — use a managed store. **Bump `?v=`** on any shared include you touch. | [src/](src/README.md) |
| 5 · Testing | Signed-out `curl` must be refused. Signed-in-wrong-role must 403 on the hard endpoints. `file://` preview for decks. No production identity writes without approval. | [../docs/14](../docs/14-testing-and-validation.md) |
| 6 · Deployment | **`./deploy.sh` only** (never `wrangler` directly). Four gates must pass. Then **re-sweep the edge until two clean runs** — Cloudflare serves the old build for minutes. | [03](03-deploy-nav-ops.md) |
| 7 · Monitoring | Confirm the change on the live domain, not just locally. Watch for the two classic failures: spinner-hang (an inline script threw) and stale-cache lockout (missing `?v=`). | [03](03-deploy-nav-ops.md) |
| 8 · Maintenance | Update these docs + re-sync `portal/src/` (sanitized) in the same PR. Rotate the inline Function creds when the n8n secrets rotate. | [../CHANGELOG.md](../CHANGELOG.md) |

## Agile vs Waterfall — the portal cut

- **Agile (default):** a new training deck, a new tool tile, granting a role a dashboard, copy fixes. Iterate → `deploy.sh` → verify live.
- **Waterfall (design + sign-off first):** anything that changes **the gate model** (what fails open vs closed, the edge allowlist, a new hard Function), the **identity schema** (`profiles` columns, the RPCs), or **credential handling**. These can either leak financials or lock out the whole company, so they get designed fully and approved before execution — same rule as a Lark data-model migration.

## The two portal-specific invariants (never regress these)

1. **Hard gate = fail closed; soft gate = fail open.** If a change makes a soft gate the only thing between a user and money/salary/PII, it is wrong by construction. Move it behind a Function.
2. **The three access lists must mirror each other** — `portal.html`, `dash.js` (`EMAIL_FEEDS`), `mgmt-deck.js` (`MANAGER_EMAILS`). They are frozen break-glass behind the `profiles` columns; if you must touch one, touch all three, or someone gets a tile that 403s. Prefer editing the `profiles` column instead.

## Portal PR checklist (extends the repo checklist in docs/03)

- [ ] Ran `./deploy.sh`; all four gates passed.
- [ ] Re-swept the live edge until two consecutive clean runs.
- [ ] No new inline secret; any shared include bumped its `?v=`.
- [ ] If a hard gate changed: signed-out `curl` refused, wrong-role 403 confirmed.
- [ ] `portal/src/` re-synced (sanitized — mantras + anon key as placeholders) and docs updated.
- [ ] CHANGELOG entry with rollback ([ROLLBACK-academy-server-gate.md](src/ROLLBACK-academy-server-gate.md) for the edge gate).
