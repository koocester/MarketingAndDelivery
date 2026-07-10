# Supabase — Schema DDL Reference

> **Snapshot date:** 2026-07-10
> **Source:** Supabase Postgres 17.6 (`aws-1-ap-southeast-1.pooler.supabase.com`, db `postgres`), reached read-only via Metabase database id `34` ("Koocester Group").
> **Scope:** application-owned schemas only — `content_perf`, `finance`, `marts`, `public`.
> Fivetran-managed schemas (`hubspot`, `xero`) are intentionally **not** dumped here — see the note at the bottom. The `vault` schema is deliberately excluded (secrets).

## Regenerate this file

Run these two read-only queries against database id 34 (Metabase `execute_query`) and re-render:

```sql
-- 1. Columns
select table_schema, table_name, column_name, data_type, is_nullable,
       character_maximum_length, numeric_precision, numeric_scale
from information_schema.columns
where table_schema in ('content_perf','finance','marts','public')
order by table_schema, table_name, ordinal_position;

-- 2. Keys / constraints
select tc.table_schema, tc.table_name, tc.constraint_type, tc.constraint_name,
       kcu.column_name, kcu.ordinal_position
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
 and tc.table_schema   = kcu.table_schema
where tc.table_schema in ('content_perf','finance','marts','public')
  and tc.constraint_type in ('PRIMARY KEY','UNIQUE','FOREIGN KEY')
order by tc.table_schema, tc.table_name, tc.constraint_type, kcu.ordinal_position;
```

**Constraints found:** only PRIMARY KEYs (one per table, listed below). No UNIQUE or FOREIGN KEY constraints exist in these schemas — referential integrity is handled in the pipeline layer (n8n upserts on the PK), not in the database.

---

## Feed / pipeline overview

| Schema.table | Fed by | Load pattern | PK |
|---|---|---|---|
| `content_perf.metricool_snapshots` | **n8n** (Metricool → Supabase) | dated append/upsert on `record_id` | `record_id` |
| `content_perf.reels` | **n8n** (Metricool reels → Supabase) | upsert on `post_url` | `post_url` |
| `finance.aspire_accounts` | **n8n** (Aspire API → Supabase) | snapshot upsert on `id` | `id` |
| `finance.aspire_transactions` | **n8n** (Aspire API → Supabase) | upsert on `id` | `id` |
| `marts.targets` | **n8n / manual** (planning targets) | upsert on `id` | `id` |
| `public.command_ai_cache` | **n8n** (Command dashboard AI brief cache) | insert per `for_date` | `id` |

---

## content_perf.metricool_snapshots

Per-page/platform follower & engagement snapshots synced from Metricool. This is the **historical** followers table (the live sync elsewhere overwrites current counts; this one keeps dated rows).

| column | type | nullable |
|---|---|---|
| record_id | text | NO (PK) |
| snapshot_date | date | YES |
| page | text | YES |
| platform | text | YES |
| country | text | YES |
| followers | bigint | YES |
| total_followers | bigint | YES |
| viewership_increase | bigint | YES |
| engagement_rate | double precision | YES |
| followers_pct_increase | double precision | YES |
| week_of_month | text | YES |
| loaded_at | timestamptz | YES |

```sql
CREATE TABLE content_perf.metricool_snapshots (
  record_id              text PRIMARY KEY,
  snapshot_date          date,
  page                   text,
  platform               text,
  country                text,
  followers              bigint,
  total_followers        bigint,
  viewership_increase    bigint,
  engagement_rate        double precision,
  followers_pct_increase double precision,
  week_of_month          text,
  loaded_at              timestamptz
);
```

## content_perf.reels

Per-reel performance metrics synced from Metricool. Keyed on the post URL — the same join key used by the Lark Videos post-URL fields.

| column | type | nullable |
|---|---|---|
| post_url | text | NO (PK) |
| page | text | YES |
| country | text | YES |
| platform | text | YES |
| published_date | date | YES |
| video_title | text | YES |
| views | bigint | YES |
| reach | bigint | YES |
| impressions | bigint | YES |
| likes | bigint | YES |
| comments | bigint | YES |
| shares | bigint | YES |
| saves | bigint | YES |
| interactions | bigint | YES |
| engagement_rate | double precision | YES |
| loaded_at | timestamptz | YES |

```sql
CREATE TABLE content_perf.reels (
  post_url        text PRIMARY KEY,
  page            text,
  country         text,
  platform        text,
  published_date  date,
  video_title     text,
  views           bigint,
  reach           bigint,
  impressions     bigint,
  likes           bigint,
  comments        bigint,
  shares          bigint,
  saves           bigint,
  interactions    bigint,
  engagement_rate double precision,
  loaded_at       timestamptz
);
```

## finance.aspire_accounts

Aspire (business card / float) account balances, snapshotted. Note: Aspire is card-float only — not a full burn/runway source.

| column | type | nullable |
|---|---|---|
| id | text | NO (PK) |
| account_status | text | YES |
| account_type | text | YES |
| currency_code | text | YES |
| available_balance_cents | bigint | YES |
| available_balance | numeric | YES |
| account_name | text | YES |
| snapshot_at | timestamptz | YES |

```sql
CREATE TABLE finance.aspire_accounts (
  id                      text PRIMARY KEY,
  account_status          text,
  account_type            text,
  currency_code           text,
  available_balance_cents bigint,
  available_balance       numeric,
  account_name            text,
  snapshot_at             timestamptz
);
```

## finance.aspire_transactions

Aspire card transactions.

| column | type | nullable |
|---|---|---|
| id | text | NO (PK) |
| account_id | text | YES |
| datetime | timestamptz | YES |
| type | text | YES |
| channel | text | YES |
| status | text | YES |
| currency_code | text | YES |
| amount | numeric | YES |
| amount_cents | bigint | YES |
| reference | text | YES |
| counterparty_name | text | YES |
| spend_category | text | YES |
| card_holder | text | YES |
| card_name | text | YES |
| card_number | text | YES |
| card_id | text | YES |
| balance_cents | bigint | YES |
| loaded_at | timestamptz | YES |

```sql
CREATE TABLE finance.aspire_transactions (
  id                text PRIMARY KEY,
  account_id        text,
  datetime          timestamptz,
  type              text,
  channel           text,
  status            text,
  currency_code     text,
  amount            numeric,
  amount_cents      bigint,
  reference         text,
  counterparty_name text,
  spend_category    text,
  card_holder       text,
  card_name         text,
  card_number       text,
  card_id           text,
  balance_cents     bigint,
  loaded_at         timestamptz
);
```

## marts.targets

Planning targets (lead/view/attendance etc.) per metric × market × vertical × month. Feeds dashboard "target vs actual" tiles.

| column | type | nullable |
|---|---|---|
| id | bigint | NO (PK) |
| metric_key | text | NO |
| market | text | YES |
| vertical | text | YES |
| period_month | date | NO |
| target_value | numeric | NO |
| unit | text | NO |
| coverage_ratio | numeric | YES |
| note | text | YES |
| updated_at | timestamptz | YES |

```sql
CREATE TABLE marts.targets (
  id             bigint PRIMARY KEY,   -- consider GENERATED ALWAYS AS IDENTITY on rebuild
  metric_key     text        NOT NULL,
  market         text,
  vertical       text,
  period_month   date        NOT NULL,
  target_value   numeric     NOT NULL,
  unit           text        NOT NULL,
  coverage_ratio numeric,
  note           text,
  updated_at     timestamptz
);
```

## public.command_ai_cache

Cache of the Command dashboard's AI-generated daily brief payload, one row per `for_date`.

| column | type | nullable |
|---|---|---|
| id | bigint | NO (PK) |
| generated_at | timestamptz | NO |
| for_date | date | NO |
| payload | jsonb | NO |

```sql
CREATE TABLE public.command_ai_cache (
  id           bigint PRIMARY KEY,   -- consider GENERATED ALWAYS AS IDENTITY on rebuild
  generated_at timestamptz NOT NULL,
  for_date     date        NOT NULL,
  payload      jsonb       NOT NULL
);
```

---

## Fivetran-managed schemas (NOT dumped here)

The `hubspot` and `xero` schemas are **Fivetran-generated** connector schemas — large, wide, connector-versioned, and **fully re-syncable** by re-running the Fivetran connector. Do not hand-rebuild them from a DDL sketch; on a from-scratch rebuild you re-create the Fivetran connectors (HubSpot CRM + deals; Xero accounting) and let Fivetran recreate and backfill every table. Treat them as read-only source-of-truth mirrors:

- **`hubspot`** — CRM objects (deals, contacts, companies, owners, pipelines, engagements). Join key into Lark delivery: `Projects.HubSpot Deal Record ID`.
- **`xero`** — accounting (invoices, bank transactions, contacts, accounts). Note: Xero bank feed carries no usable balance, so it is not a burn/runway source on its own.

The `vault` schema (secrets) is excluded entirely and must never be dumped.
