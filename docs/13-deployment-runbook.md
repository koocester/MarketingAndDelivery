# 13 — Deployment Runbook

## What "deploy" means here
- **Vercel app** → a real deploy (git/CLI).
- **n8n workflows** → changes are made in the **n8n Cloud UI** (there is no CI deploy).
- **Metabase** → changes are made in Metabase (cards/dashboards).
- **Supabase schema** → Fivetran/dbt managed; no local deploy path found.

## Deploy the Vercel dashboard
```bash
cd apps/smm-carousel-dashboard
npx vercel               # first time: link/create project
# set env (Production + Preview), values never in git:
npx vercel env add LARK_APP_ID
npx vercel env add LARK_APP_SECRET
npx vercel env add LARK_APP_TOKEN
npx vercel env add LARK_TABLE_ID
npx vercel --prod        # deploy
```
**Verify:** `/api/carousels` returns data; dashboard badge shows "● live". **Rollback:** Vercel dashboard → Deployments → promote a previous deployment.

## Change an n8n workflow (approval required for prod)
1. Duplicate or version the workflow first. 2. Edit in a **draft/inactive** copy. 3. Test with a **test chat/table** (never prod). 4. Move secrets to **managed credentials** (never inline). 5. Activate only after sign-off. **Rollback:** n8n workflow version history → restore previous; or re-disable.

## Metabase change
1. Duplicate the card. 2. Edit SQL; preserve the deleted-row guards and the `>= 48` rule. 3. Validate against a direct `SELECT`. 4. Swap into the dashboard. **Rollback:** revert to the duplicated original.

## Pre-deploy checklist
- [ ] Branch + PR reviewed. [ ] No secrets / `.env` / raw creds. [ ] `.env.example` updated. [ ] Docs updated. [ ] Read-only validation done. [ ] Rollback written. [ ] Owner + monitoring confirmed.

## Post-deploy verification
- Vercel: endpoint + badge. n8n: next scheduled execution succeeds (check Executions). Metabase: card totals sane. Briefs: arrived in the correct Lark chat.

> **Never** trigger production writes (Lark/HubSpot/Xero/Supabase/Metabase/n8n) as part of "testing a deploy" without explicit approval.
