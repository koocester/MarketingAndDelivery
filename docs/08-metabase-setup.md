# 08 — Metabase Setup

*Verified live via Metabase MCP, 2026-07-10.*

> 🔴 **SUBSCRIPTION RISK — check this first.** Instance `koocester.metabaseapp.com`. On **2026-07-21** the app showed *"last day of your trial."* If the paid plan wasn't started, the trial lapses and **every dashboard/card here goes dark** (CEO 67, Content 100, all cards). The n8n briefs + Command dashboard read Supabase directly and survive; all Metabase BI does not. **Confirm the subscription is active before relying on any Metabase number.**

## Purpose
Business-intelligence layer over the Supabase warehouse — finance, sales, and content dashboards for leadership.

## Connection to Supabase
- Metabase database **id 34** = "Koocester Group" (PostgreSQL 17.6, Supabase pooler, SSL required).
- Also present but irrelevant: db 2 (ClickHouse, Metabase-internal), db 1 (H2 sample — **archive**).
- Connection details use placeholders: `METABASE_SITE_URL`, `METABASE_DATABASE_ID=34`, `METABASE_API_KEY` (MCP). Real DB credentials live in Metabase admin only.

## Dashboards & cards

### CEO Dashboard (id 67) — 23 cards
Filters: Group-by (week/month), Platform, Page.
- **Finance / Xero** (`xero.invoice`, `xero.payment`): Invoiced Revenue/Month, Cash Collected/Month, AR Outstanding, AR Overdue.
- **Finance / Aspire** (`finance.*`): Card Spend, Spend by Category, by Card Holder, Largest Transactions, Monthly Burn, Aspire Balance SGD.
- **Sales / HubSpot** (`hubspot.deal`,`contact`): Open Pipeline SGD, Won Revenue by Market, Open Pipeline by Market, Deals Created/Week (MBQL), New Leads/Month (MBQL).
- **Content** (`content_perf.metricool_snapshots`): Total Audience, Follower Growth MoM %, Followers Trend, Followers by Page, Reach, Views Gained, Avg Engagement, by Platform — all ≥48-gated.

### Content Performance (id 100) — 13 cards
Filters: Country, Page, Platform, Group-by.
- `content_perf.reels`: Top Reels by Views, Reels Published, Total Views/Reels, Avg Engagement (+ by Platform/Market), Reach by Period/Market.
- `content_perf.metricool_snapshots`: Followers Trend, Total Followers, Followers by Market (≥48-gated).

## How dashboard data is fed
- **Not by Metabase directly** — Metabase only reads Supabase.
- Content data ← **n8n Metricool syncs**; finance ← **n8n Aspire** + **Fivetran Xero**; sales ← **Fivetran HubSpot**.
- Freshness: content/finance ~daily (07:00–09:00 SGT n8n runs); HubSpot/Xero per Fivetran cadence.

## Rebuild / reconnect
1. In Metabase admin, (re)add the Supabase Postgres connection (db 34) with SSL.
2. Cards are **native SQL** (except 2 MBQL count cards) created by the `Claude MCP` API user — edits require SQL.
3. Preserve patterns: HubSpot amounts via `property_amount_in_home_currency` + `_fivetran_deleted`/`is_deleted` guards; follower metrics via `HAVING count(*) >= 48`.

## Verify dashboard data
- Cross-check a card total against a direct `SELECT` (see [07](07-supabase-setup.md) validation queries).
- Confirm `max(snapshot_date)` is current for follower cards.

## Common troubleshooting
- **Follower charts look low / drop days** → the `>= 48` rule dropped an incomplete snapshot day, or a new page/platform changed the expected count. Recalc 48.
- **Sales numbers off** → check `_fivetran_deleted` filtering and currency split.
- **Everything stale** → check the relevant loader (n8n for content/finance, Fivetran for CRM/accounting), not Metabase.
