# apps/

Standalone deployable apps.

| App | Purpose | Stack | Doc |
|---|---|---|---|
| `smm-carousel-dashboard/` | Live SMM Carousel dashboard reading Lark Base server-side | Vercel serverless (Node, ESM) | [../docs/10-dashboard-setup.md](../docs/10-dashboard-setup.md) + app's own README |

Each app is self-contained (its own `README.md`, `.env.example`, `.gitignore`). Secrets live in Vercel project env, never in git. Local dev + deploy: [../docs/12-local-development.md](../docs/12-local-development.md), [../docs/13-deployment-runbook.md](../docs/13-deployment-runbook.md).
