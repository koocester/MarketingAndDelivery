# Rollback — Academy server-side gate

Written BEFORE any code was changed. Date: 2026-07-19.

## Known-good state to return to

- Production deployment: `eb9b2dd5-e4e5-4939-94c0-bbbdd644bef1` (commit `2ed688a`)
- Live URL of that build: https://eb9b2dd5.koocester-academy.pages.dev
- Git branch: `docs/system-reconstruction`
- `functions/` at that state contains ONLY `dash.js` and `hr-feed.js`. No `_middleware.js`.

## The undo, one command

Run from `04. Resources/Training`:

```
rm -f functions/_middleware.js && npx wrangler pages deploy . --project-name koocester-academy --branch main --commit-dirty=true
```

Deleting `_middleware.js` removes the gate entirely. Cloudflare Pages serves static
assets directly when no middleware is present, so the site returns to exactly the
pre-change behaviour: every deck public, client-side guard only.

Takes about 60 seconds to propagate. Verify with:

```
curl -sL -o /dev/null -w "%{http_code}\n" "https://staffacademy.koocester.com/capital-growth-training?z=$(date +%s%N)"
```

Expect `200`.

## Second lever, if wrangler itself is unavailable

Cloudflare dashboard -> Workers & Pages -> koocester-academy -> Deployments ->
find `eb9b2dd5` -> "Rollback to this deployment". No CLI needed. Works from a phone.

## Why login.html cannot lock anyone out on its own

The login page change only ADDS a cookie write. It does not gate anything. If the
middleware is removed but the login cookie change stays, the site is simply back to
the old open behaviour. The two changes are independent, so rolling back the
middleware alone is always sufficient and always safe.

## Cache caveat

The custom domain caches hard. When verifying a rollback, bust with
`?z=$(date +%s%N)`. A plain `?cb=` gave false readings in a previous session.
