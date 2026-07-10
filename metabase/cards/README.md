# Metabase Cards — SQL Export

Rebuildable source-of-truth for every card on the two live Metabase dashboards.
One file per card. Native-SQL cards are `.sql`; the two MBQL (query-builder) cards
are `.json` (they have no raw SQL — the query is a structured definition).

- **Database:** Metabase database id `34` — "Koocester Group" (Postgres on Supabase). Read-only here.
- **Export scope:** CEO Dashboard (id 67) — 23 cards; Content Performance (id 100) — 12 cards. Total 35.
- No connection strings, passwords, or API keys are stored in this repo.

## Cards

| Card | id | Dashboard | Source table | Viz | File |
|------|----|-----------|--------------|-----|------|
| Invoiced Revenue / Month | 202 | CEO Dashboard (67) | xero.invoice | bar | `ceo-dashboard__invoiced-revenue-month.sql` |
| Cash Collected / Month | 199 | CEO Dashboard (67) | xero.payment | bar | `ceo-dashboard__cash-collected-month.sql` |
| AR Outstanding | 200 | CEO Dashboard (67) | xero.invoice | scalar | `ceo-dashboard__ar-outstanding.sql` |
| AR Overdue | 201 | CEO Dashboard (67) | xero.invoice | scalar | `ceo-dashboard__ar-overdue.sql` |
| Deals Created / Week | 166 | CEO Dashboard (67) | hubspot.deal | line | `ceo-dashboard__deals-created-week.json` (MBQL) |
| New Leads / Month | 133 | CEO Dashboard (67) | hubspot.contact | line | `ceo-dashboard__new-leads-month.json` (MBQL) |
| Open Pipeline (SGD) | 265 | CEO Dashboard (67) | hubspot.deal | scalar | `ceo-dashboard__open-pipeline-sgd.sql` |
| Won Revenue by Market | 364 | CEO Dashboard (67) | hubspot.deal | bar | `ceo-dashboard__won-revenue-by-market.sql` |
| Open Pipeline by Market | 365 | CEO Dashboard (67) | hubspot.deal | bar | `ceo-dashboard__open-pipeline-by-market.sql` |
| Total Audience (Followers) | 232 | CEO Dashboard (67) | content_perf.metricool_snapshots | scalar | `ceo-dashboard__total-audience-followers.sql` |
| Reach — Latest Month (views gained) | 233 | CEO Dashboard (67) | content_perf.metricool_snapshots | scalar | `ceo-dashboard__reach-latest-month-views-gained.sql` |
| Avg Engagement Rate (latest wk) | 234 | CEO Dashboard (67) | content_perf.metricool_snapshots | scalar | `ceo-dashboard__avg-engagement-rate-latest-wk.sql` |
| Follower Growth (MoM %) | 235 | CEO Dashboard (67) | content_perf.metricool_snapshots | scalar | `ceo-dashboard__follower-growth-mom-pct.sql` |
| Total Followers (Trend) | 236 | CEO Dashboard (67) | content_perf.metricool_snapshots | line | `ceo-dashboard__total-followers-trend.sql` |
| Reach (Views Gained) | 237 | CEO Dashboard (67) | content_perf.metricool_snapshots | bar | `ceo-dashboard__reach-views-gained.sql` |
| Avg Engagement Rate by Platform | 238 | CEO Dashboard (67) | content_perf.metricool_snapshots | bar | `ceo-dashboard__avg-engagement-rate-by-platform.sql` |
| Followers by Page (latest) | 239 | CEO Dashboard (67) | content_perf.metricool_snapshots | row | `ceo-dashboard__followers-by-page-latest.sql` |
| Aspire Balance (SGD) | 331 | CEO Dashboard (67) | finance.aspire_accounts | scalar | `ceo-dashboard__aspire-balance-sgd.sql` |
| Card Spend (last 7d) | 332 | CEO Dashboard (67) | finance.aspire_transactions | scalar | `ceo-dashboard__card-spend-last-7d.sql` |
| Spend by Category (7d) | 333 | CEO Dashboard (67) | finance.aspire_transactions | bar | `ceo-dashboard__spend-by-category-7d.sql` |
| Spend by Card Holder (7d) | 334 | CEO Dashboard (67) | finance.aspire_transactions | bar | `ceo-dashboard__spend-by-card-holder-7d.sql` |
| Largest Transactions (7d) | 335 | CEO Dashboard (67) | finance.aspire_transactions | table | `ceo-dashboard__largest-transactions-7d.sql` |
| Monthly Spend / Burn (Aspire) | 366 | CEO Dashboard (67) | finance.aspire_transactions | bar | `ceo-dashboard__monthly-spend-burn-aspire.sql` |
| Total Followers | 298 | Content Performance (100) | content_perf.metricool_snapshots | scalar | `content-performance__total-followers.sql` |
| Total Views (Reach) | 299 | Content Performance (100) | content_perf.reels | scalar | `content-performance__total-views-reach.sql` |
| Avg Engagement Rate | 300 | Content Performance (100) | content_perf.reels | scalar | `content-performance__avg-engagement-rate.sql` |
| Total Reels | 301 | Content Performance (100) | content_perf.reels | scalar | `content-performance__total-reels.sql` |
| Followers Trend | 302 | Content Performance (100) | content_perf.metricool_snapshots | line | `content-performance__followers-trend.sql` |
| Reach (Views) by Period | 303 | Content Performance (100) | content_perf.reels | bar | `content-performance__reach-views-by-period.sql` |
| Avg Engagement by Platform | 304 | Content Performance (100) | content_perf.reels | bar | `content-performance__avg-engagement-by-platform.sql` |
| Reels Published by Period | 305 | Content Performance (100) | content_perf.reels | bar | `content-performance__reels-published-by-period.sql` |
| Top Reels by Views | 306 | Content Performance (100) | content_perf.reels | table | `content-performance__top-reels-by-views.sql` |
| Followers by Market | 367 | Content Performance (100) | content_perf.metricool_snapshots | bar | `content-performance__followers-by-market.sql` |
| Reach by Market (7d) | 368 | Content Performance (100) | content_perf.reels | bar | `content-performance__reach-by-market-7d.sql` |
| Avg Engagement by Market | 369 | Content Performance (100) | content_perf.reels | bar | `content-performance__avg-engagement-by-market.sql` |

## Conventions that MUST be preserved

These are the two rules that keep the numbers correct. Do not rewrite queries in a
way that drops them.

1. **HubSpot money = `property_amount_in_home_currency`, always deletion-guarded.**
   All revenue/pipeline figures come from `hubspot.deal` summed on
   `property_amount_in_home_currency` (home currency = SGD), never a per-deal raw
   amount. Every HubSpot query filters out deleted rows with **both** guards:
   `(_fivetran_deleted IS NULL OR _fivetran_deleted=false)` **and**
   `(is_deleted IS NULL OR is_deleted=false)`. Market splits key off
   `property_deal_currency_code` (SGD→Singapore, MYR→Malaysia, IDR→Indonesia, else Other).

2. **Follower/audience metrics use the completeness rule `HAVING count(*) >= 48`.**
   `content_perf.metricool_snapshots` only has a *complete* daily snapshot when all
   48 page×platform rows landed. Every follower/reach/engagement query first builds a
   `complete` CTE — `SELECT snapshot_date ... GROUP BY 1 HAVING count(*) >= 48` — and
   restricts to those dates (usually `snapshot_date = (SELECT max(snapshot_date) FROM complete)`).
   This prevents partial-sync days from dragging totals down. If the number of tracked
   page×platform pairs ever changes, this 48 threshold must change with it.

Also preserved verbatim: Metabase template placeholders. Optional filter clauses use
the `[[ AND col = {{platform}} ]]` bracket syntax (CEO Dashboard); Content Performance
cards use field-filter placeholders `{{country}}`, `{{page}}`, `{{platform}}`, and the
period-grain variable `{{grain}}`. Keep them exactly as written.

## How to rebuild a dashboard from these files

1. **Connect the database.** In Metabase, add the Postgres/Supabase database ("Koocester
   Group"). Note its new database id and swap it in wherever a card references
   `"database": 34` (only the two MBQL `.json` cards hardcode it).
2. **Recreate each card (question).**
   - `.sql` files: New → SQL query → pick the database → paste everything *below* the
     header comment. Re-declare the template variables the SQL references
     (`{{grain}}`, `{{platform}}`, `{{page}}`, `{{country}}`) and set their types
     (field filters for `country/page/platform`; a plain "Field Filter" or text/number
     for `grain`). Set the visualization to the `visualization:` value in the header.
   - `.json` files (MBQL): rebuild in the query builder — pick the `source` table, add
     the aggregation and the date breakout described in `notes`
     (e.g. `count`, breakout on `property_createdate` by week/month). The `dataset_query`
     block is the exact structured definition; field ids (`2663`, `2309`) and the
     table id must be remapped to the ids in the rebuilt database.
3. **Assemble the dashboard.** Create the dashboard, add each card, then wire the
   dashboard filters to the card template tags (Country / Page / Platform / period grain)
   so the `{{...}}` placeholders receive values.
4. **Sanity-check** against the two conventions above — a follower tile that returns a
   too-low number usually means the `>= 48` completeness CTE was dropped; a revenue tile
   that's too high usually means a deletion guard was dropped.

_The header comment at the top of every `.sql` file records: card name, id, dashboard,
source table, and visualization type._
