# 10 — Dashboard Setup

There are **five** dashboard surfaces. Keep them distinct. (A) Metabase BI, (B) the n8n Command cockpit, (C) the Vercel carousel app, (D) the Lark-native Base dashboards, and (E) the Staff Portal, which is the **access layer** staff actually use to reach B (and the management deck + HR overview).

## A. Metabase dashboards (BI) — CEO (67) + Content Performance (100)
- **Purpose:** finance/sales/content BI for leadership.
- **Data source:** Supabase db 34 (SQL cards). Fed by Fivetran (HubSpot/Xero) + n8n (Metricool/Aspire).
- **Freshness:** ~daily (n8n 07:00–09:00 SGT) + Fivetran cadence.
- **n8n/cron/agent involvement:** none direct — Metabase only reads Supabase; the *loaders* are n8n/Fivetran.
- **Validate:** compare a card total to a direct `SELECT` ([07](07-supabase-setup.md)).
- **Rebuild:** re-add the Supabase connection; cards are native SQL (see [08](08-metabase-setup.md)).
- **Risks:** the "magic 48" completeness rule; deleted-row filters on HubSpot; stale metadata.

## B. Command dashboard (founder cockpit) — served by n8n
- **Purpose:** role-scoped live cockpit (`/command /growth /sales /finance /hr /tech`).
- **Data source:** n8n workflow `ePDPNKpgKdz4SUMZ` queries Supabase + Lark + `public.command_ai_cache`; renders HTML.
- **Fed by:** the `Command AI Cache` workflow (`m7n7555E2t6Wlvkk`, cron 08:00) pre-generates AI text.
- **Auth:** Basic-Auth per role (managed n8n creds). **Validate:** load a webhook with its Basic-Auth; check the timestamp + tiles.
- **Rebuild:** the HTML template lives base64-encoded in the workflow's Code node; edit there.
- **Risks:** public URL (internet-reachable); AI cache must complete before first read.

## C. Vercel SMM Carousel dashboard (`apps/smm-carousel-dashboard`)
- **Purpose:** live(ish) view of the SMM Carousel Tracker Lark Base.
- **Data source:** Lark Base read **server-side** by `/api/carousels` (env-var creds); page polls every 60s; 30s edge cache.
- **n8n/cron/agent:** none — self-contained Vercel function.
- **Validate:** `GET /api/carousels` → `{updated, count, data}`; badge shows "● live" vs "● sample data".
- **Rebuild/redeploy:** `cd apps/smm-carousel-dashboard && npx vercel --prod`; set the 4 `LARK_*` env vars in Vercel. Field mapping in `api/carousels.js` (`mapRecord`) — update if Base columns are renamed.
- **Risks:** app must be a Base collaborator with `bitable:app:readonly`; secret only ever server-side.

## D. Lark-native Base dashboards (operational)
Built **inside** the Lark M&D base via computer-use — **Lark Base dashboards have no API**, so they are UI-only to build/edit.
- **⚠️ Ops Health & Bottlenecks** — an isolated dashboard of alert tiles for the backlog/gap numbers (videos/projects Not Started, finished-but-unposted videos & carousels, missing-objective data gaps).
- **Main + per-market dashboards** (Regional / SG / MY / ID) — "Videos by Stage" distribution, active workload by Producer/Editor/Copywriter, vertical + country donuts, publish-queue tiles, uploads-over-time.
- **Where each intelligence lives (decision):** pipeline health / bottlenecks / "where is it stuck" → **Lark** (data lives here); content performance / lead-gen feedback → **Supabase + Metabase**. A **Sankey** flow diagram is **not possible in Lark** (no such chart type) — the insight is covered by the stage bars + an aging view.
- **Parked build:** a set of "Stuck / aging" grid views (grouped by stage, sorted by Overdue/age, active-only) — API-buildable and non-overlapping; parked pending go-ahead. See [discovery/work-log.md](discovery/work-log.md).

## E. Staff Portal — the access layer over B (`staffacademy.koocester.com`)
Staff do **not** hit the raw n8n Command webhooks. They sign in once to the portal, which proxies the right feed to the right person.
- **Purpose:** one door for training + role tools + the manager dashboards; scope B's role webhooks and the management deck / HR overview to who is asking.
- **Data source:** none of its own — it verifies a Supabase token, resolves the role from `profiles`, and proxies the live n8n feed server-side (Basic-Auth never sent to the browser).
- **Auth:** hard-gated Cloudflare Pages Functions `/dash`, `/mgmt-deck`, `/hr-overview` (fail-closed 403). Founder → full Command; each manager → only their department feed.
- **Access control:** `profiles.is_manager` / `profiles.dashboard` (one row edit, no redeploy). **Validate:** sign in as a department manager → see only that department; signed out → 401.
- **Rebuild/redeploy:** `./deploy.sh` from `04. Resources/Training/` (four gates; never `wrangler` directly).
- **Risks:** inline n8n Basic-Auth creds in the Functions (server-side, redacted here — rotate to env vars); Cloudflare edge propagation (re-sweep until two clean).
- **Full doc:** [19-staff-portal.md](19-staff-portal.md) · [../portal/](../portal/README.md).

## Data freshness expectations (summary)
| Surface | Latency |
|---|---|
| Metabase content/finance | ~daily (n8n) |
| Metabase HubSpot/Xero | Fivetran cadence |
| Command dashboard | live query + daily AI cache |
| Vercel carousel | ~30–60s |
| Lark Base dashboards | live (read the base directly) |
| Staff Portal | live proxy (same freshness as the feed it fronts) |
