# Koocester SMM Carousel Dashboard — live on Vercel

A real-time(ish) dashboard for the **SMM Carousel Tracker** Lark Base. The browser never
touches Lark directly — a Vercel serverless function reads the Base server-side (credentials
stay in env vars) and the page polls it every 60s.

```
Lark Base ──(tenant token, server-side)──> /api/carousels ──fetch──> public/index.html
```

## Files
- `public/index.html` — the dashboard UI (fetches `/api/carousels`, falls back to `sample-data.json`)
- `public/sample-data.json` — snapshot so the page renders before Lark is wired
- `api/carousels.js` — serverless function: Lark Base → clean JSON (30s edge cache)
- `.env.example` — the four env vars you need

## 1. Prepare the Lark app (one-time)
1. In the **Lark Developer Console** (https://open.larksuite.com) open your app
   (the one whose App ID you'll use).
2. **Permissions & Scopes** → add: `bitable:app:readonly` (read records).
   Then **publish a new version** so the scope takes effect.
3. Open the **SMM Carousel Tracker Base** → `...` → **Add collaborators** → add your app
   (or its bot) with at least *read* access. Without this, the API returns empty.

## 2. Get the Base tokens
From the Base URL:
`https://<your>.larksuite.com/base/<APP_TOKEN>?table=<TABLE_ID>&view=...`
- `LARK_APP_TOKEN` = the `<APP_TOKEN>` segment
- `LARK_TABLE_ID`  = the `table=` value

## 3. Deploy
```bash
cd vercel-app
npx vercel            # first run: link/create the project
# then add env vars (Production + Preview):
npx vercel env add LARK_APP_ID
npx vercel env add LARK_APP_SECRET
npx vercel env add LARK_APP_TOKEN
npx vercel env add LARK_TABLE_ID
npx vercel --prod     # deploy
```
(Or import the folder in the Vercel dashboard and set the four env vars under
Settings → Environment Variables.)

## 4. Verify
- Visit `/api/carousels` — you should see `{ "updated": ..., "count": N, "data": [...] }`.
- The dashboard badge shows **● live · HH:MM** when it's reading Lark, or
  **● sample data** if env vars are missing / the app can't see the Base.

## Local dev
```bash
cp .env.example .env.local   # fill in real values
npx vercel dev               # http://localhost:3000
```

## Notes
- **Security:** the app secret is only ever read server-side via `process.env`. Never put it
  in `public/`. `.env*` is gitignored.
- **Freshness:** edge-cached 30s + `stale-while-revalidate`; the page also auto-polls every 60s.
  For instant push instead of polling, add a Lark Base automation → webhook that writes to
  Vercel KV, and have the function read KV (a later upgrade).
- **Field mapping** lives in `api/carousels.js` (`mapRecord`). If you rename Base columns,
  update the field names there.
