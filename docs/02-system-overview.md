# 02 — System Overview

## The four planes + one app

| Plane | Tech | Job | Hosting |
|---|---|---|---|
| System of record | **Lark Base** (M&D `BG8PbaZFna1NQksNWkglTN85gSf`) | Truth: projects, videos, carousels, pages, people, SLAs | Lark Cloud |
| Real-time fan-out | **AnyCross** | Webhook automations on record change (assign/notify/calendar) | In-Lark |
| Scheduled + outbound | **n8n Cloud** (`koocester.app.n8n.cloud`) | Cron briefs, metric syncs, Command dashboard API | n8n Cloud |
| Analytics | **Supabase** + **Metabase** | Warehouse + BI | Supabase / Metabase Cloud |
| Live app | **Vercel** (`apps/smm-carousel-dashboard`) | Read-only carousel dashboard off Lark | Vercel |
| Front end | **Staff Portal** (`staffacademy.koocester.com`) | One sign-in: training + role tools + manager dashboards | Cloudflare Pages |

## How a piece of content flows
1. A **Project** spawns **videos/carousels**; each advances through stage buttons (Sourcing → … → Ready to Upload → Completed).
2. **AnyCross** reacts to changes — assigns roles from Page defaults, notifies role chats, syncs the Content Calendar.
3. **SLA formulas** compute `Overdue`; **scheduled scans** chase breaches (a `NOW()` formula can't trigger an automation).
4. On publish, **post-URL fields** are filled — these are the **join keys** to performance data.

## How data reaches the warehouse
- **Fivetran** → `hubspot`, `xero` schemas (managed replicas).
- **n8n** → `content_perf` (Metricool followers + reels), `finance` (Aspire card spend).
- **Metabase** reads Supabase for the CEO Dashboard (67) and Content Performance (100).

## How leadership sees it
- **n8n Command workflow** serves 6 Basic-Auth webhooks (`/command /growth /sales /finance /hr /tech`) → role-scoped HTML.
- **n8n brief workflows** push CEO daily / weekly / monthly summaries to Lark Messenger (summarised by Anthropic).
- **Vercel app** shows the SMM carousel tracker live.

## How staff reach it — the Staff Portal
- **One sign-in** (Supabase auth, project `lfppmsppvqtjyusfrlkf`) fronts training, role tools, and the manager dashboards.
- **Edge middleware** gates every request before delivery; three hard-gated Cloudflare Functions (`/dash`, `/mgmt-deck`, `/hr-overview`) verify the token, resolve the role, and **proxy the n8n feeds server-side** so the Basic-Auth logins never reach the browser.
- **Access is data, not code:** `profiles.is_manager` / `profiles.dashboard` decide who sees what (one row edit, no redeploy). The Lark HR base syncs nightly into the `hr_directory` view behind the People page.
- Full model: [19-staff-portal.md](19-staff-portal.md) and [../portal/](../portal/README.md).

## What is NOT in this system (so you don't go looking)
- No local cron, Docker, or n8n install.
- No standalone agent daemon — "agents" are Claude Code sessions via MCP.
- No dbt semantic layer in use by BI (a `xero_staging` dbt layer exists but is bypassed).

## Boundaries to respect
- Model operational state **only** in Lark.
- **AnyCross = real-time; n8n = scheduled** — don't rebuild one as the other.
- Analytics is downstream/read-mostly; Supabase is not written back into Lark.
