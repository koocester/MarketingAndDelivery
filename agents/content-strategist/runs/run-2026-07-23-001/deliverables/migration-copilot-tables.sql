-- E3-approved migration for the Storyboard Copilot (run-2026-07-23-001)
-- Target: Supabase project "Godmode Dashboard" (wnerzolcmjrsktfqferw) — the same
-- database n8n's "Postgres account" credential uses (where content_perf.reels lives).
-- Status: NOT YET APPLIED — the agent's direct DB write was blocked by the local
-- permission layer. Run this in the Supabase SQL editor, or re-ask the agent with
-- the Supabase write permission allowed.

create schema if not exists copilot;

-- W1 pre-generation concurrency claim: one drafting run per video at a time
create table if not exists copilot.storyboard_claims (
  vid text primary key,
  record_id text not null,
  claimed_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '45 minutes',
  claimed_by text not null default 'w1-storyboard-copilot',
  released boolean not null default false
);

-- W2 upload idempotency ledger: which winners went to Poppy AI, when, and how
create table if not exists copilot.poppy_uploads (
  id bigint generated always as identity primary key,
  vid text not null,
  page text not null,
  week_start date not null,
  package_hash text not null,
  mode text not null check (mode in ('api','playwright','assisted')),
  uploaded_at timestamptz not null default now(),
  unique (vid, week_start)
);
