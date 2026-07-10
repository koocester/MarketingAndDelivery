# connectors/lark — Lark Base (system of record)

**Lark Base "Marketing & Delivery"** (`BG8PbaZFna1NQksNWkglTN85gSf`, 19 tables) is the source of truth for all content operations, and the data source for the Vercel carousel dashboard. This folder is the deep reference for it.

> **Provenance:** table/field schema and stage option-sets were pulled **live via the `lark` MCP** this session. Automations, dashboards, and conventions are reconstructed from operational history where noted — Lark **automations** are list/toggle-only via API and **dashboards** have no API, so those planes are confirmed in the UI, not exported.

## Index
- ⭐ **[00-END-TO-END-WORKFLOW.md](00-END-TO-END-WORKFLOW.md) — START HERE. How the base works and connects to the dashboards.** This is the core; the rest is reference.
1. [01-data-model.md](01-data-model.md) — the tables, the Page/Project/Video/Carousel model, key IDs.
2. [02-schema-reference.md](02-schema-reference.md) — Videos (107 fields) + Carousels (63 fields) field reference, stages, buttons.
3. [03-pipelines-and-sla.md](03-pipelines-and-sla.md) — stage flows, the Lead-Time/SLA engine, aging.
4. [04-automations.md](04-automations.md) — AnyCross fan-out, auto-assign, stage-gated buttons, notifications, calendar sync.
5. [05-dashboards.md](05-dashboards.md) — the Lark-native Base dashboards.
6. [06-conventions-and-gotchas.md](06-conventions-and-gotchas.md) — coloring/must-fill standards, API limits, trigger pitfalls.

## Auth & access
- Lark app → `tenant_access_token` from `LARK_APP_ID` + `LARK_APP_SECRET` (server-side only).
- Base tokens: `LARK_APP_TOKEN` + `LARK_TABLE_ID` from the Base URL. Scope: `bitable:app:readonly` (+ the app must be a Base collaborator).
- Agent access: the `lark` MCP connector (read **+ write** as the user, `useUAT:true`).
- Env vars: `LARK_APP_ID`, `LARK_APP_SECRET`, `LARK_APP_TOKEN`, `LARK_TABLE_ID`, `LARK_DOMAIN` — see [../../.env.example](../../.env.example).

## Where Lark is used
- **Vercel app:** [`../../apps/smm-carousel-dashboard/api/carousels.js`](../../apps/smm-carousel-dashboard/api/carousels.js) (server-side read).
- **n8n:** many workflows read/write the base; several **hardcode the app secret inline** (S2–S5) — see [../../docs/15-security-and-secrets.md](../../docs/15-security-and-secrets.md).

## Safe test (read-only)
`GET /api/carousels` (Vercel), or MCP `bitable_v1_appTableRecord_search` / `bitable_v1_appTableField_list`.

## Regenerate schema live
```
bitable_v1_appTable_list(app_token=BG8PbaZFna1NQksNWkglTN85gSf)
bitable_v1_appTableField_list(app_token=BG8PbaZFna1NQksNWkglTN85gSf, table_id=<tbl…>, page_size=200)
```
