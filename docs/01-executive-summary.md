# 01 — Executive Summary

## In one paragraph
Koocester Group runs a content-automation and analytics system that plans, produces, approves, publishes, and measures social content across markets, and pushes automated intelligence to leadership. It is built on **Lark Base** (system of record), **AnyCross** (real-time automation), **n8n Cloud** (scheduled jobs + outbound briefings + a Command dashboard API), **Supabase** (data warehouse), and **Metabase** (BI dashboards), with **HubSpot** and **Xero** feeding in via **Fivetran** and **Metricool**/**Aspire** via n8n. It works today; this repo documents it for safe handover and extension.

## What it delivers to the business
- **Governed content pipeline** with enforced SLAs — nothing silently stalls.
- **Automated briefings** — CEO daily, weekly management, monthly role briefs, delivered to Lark.
- **Live dashboards** — a founder Command dashboard + Metabase CEO/Content dashboards + a Vercel carousel dashboard.
- **A measurement loop** for the lead-gen pivot — performance + finance data in one warehouse.

## Current state (2026-07-10)
- **Operational plane (Lark + AnyCross + n8n): mature and live.** 26 n8n workflows (15 active).
- **Analytics plane (Supabase + Metabase): built and live**, with the outcome/target layer not yet wired (`marts.targets` orphaned).
- **Top risk: secret hygiene** — n8n hardcodes several live secrets inline (documented; rotation is the #1 task).

## Biggest risks to know
1. **Inline secrets in n8n** (6 distinct) — rotate + move to managed credentials.
2. **No error alerting** — the n8n error-handler is an empty stub; failures are silent.
3. **Unauthenticated webhooks** — 3 public n8n endpoints.
4. **Key-person dependency** — the system is operated by the CEO + Claude Code; this repo is the first step to decoupling.

## What "done well" looks like next
Rotate secrets → wire error alerts → close the targets/outcome layer → enable team self-serve. See [04-requirements-and-decisions.md](04-requirements-and-decisions.md) and [16-troubleshooting.md](16-troubleshooting.md).
