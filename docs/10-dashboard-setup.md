# 10 — Dashboard Setup

There are **three** dashboard surfaces. Keep them distinct.

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

## Data freshness expectations (summary)
| Surface | Latency |
|---|---|
| Metabase content/finance | ~daily (n8n) |
| Metabase HubSpot/Xero | Fivetran cadence |
| Command dashboard | live query + daily AI cache |
| Vercel carousel | ~30–60s |
