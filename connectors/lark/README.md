# connectors/lark

**Lark** is the system of record (M&D base `BG8PbaZFna1NQksNWkglTN85gSf`) and the data source for the Vercel carousel dashboard.

## Where the code is
- Server-side read: [`../../apps/smm-carousel-dashboard/api/carousels.js`](../../apps/smm-carousel-dashboard/api/carousels.js) — tenant-token auth, Bitable pagination, field normalisation.
- Agent access: the `lark` MCP connector (read + write as the user).

## Auth
- Lark app → `tenant_access_token` from `LARK_APP_ID` + `LARK_APP_SECRET` (server-side only).
- Base tokens: `LARK_APP_TOKEN` + `LARK_TABLE_ID` from the Base URL.
- Required scope: `bitable:app:readonly` (add app as Base collaborator).

## Env vars
`LARK_APP_ID`, `LARK_APP_SECRET`, `LARK_APP_TOKEN`, `LARK_TABLE_ID`, `LARK_DOMAIN` — see [../../.env.example](../../.env.example).

## n8n involvement
Many workflows call Lark; several **hardcode the app secret inline** (S2–S5) — see [../../docs/15-security-and-secrets.md](../../docs/15-security-and-secrets.md).

## Safe test
`GET /api/carousels` (Vercel) or MCP `bitable_v1_appTableRecord_search` (read-only).

## Gotchas
- App must be a Base collaborator or reads return empty.
- Publish a new app version after adding scopes.
- Rename a Base column → update `mapRecord` field names.
