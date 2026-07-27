# Sales kit update — ready to publish (2026-07-27)

Prepared by Faiz (with Claude) on branch **`sales-kit-my-rates`**. Everything is
edited, verified and safety-gated. The ONLY missing step is the Cloudflare
upload, which needs a login with access to the **koocester-academy** Pages
project — that login does not exist on Faiz's machine.

## What changed (2 files only)

`portal/src/sales-kits.html` and `portal/src/sales-kit-slides.html`:

1. **Malaysia now has its own fixed rate card** (was auto-converted from SGD
   at 3.1654):
   - Silver Plan **RM13,000** (strikethrough before-price RM15,000)
   - Gold Plan **RM18,000** (before RM20,000)
   - Main Video Package **RM25,000**
   - Homes / Business / Autos **RM8,000** each
   - **New Wealth vertical card** RM6,000 (MY only) · Foodie RM6,000
   - MY bundle discounts now **2 vids −5% · 3 vids −10% · 4+ −20%**, with the
     note "Bundle discounts are valid for à la carte videos."
   - Add-ons unchanged (still FX reference). **SG and ID completely untouched** —
     verified by rendering all three markets.
2. **Hub consolidated to 2 kits**: SME tab shows one Company Sales Kit (the
   à-la-carte price of every vertical is inside it); MNC tab shows one
   Company card marked "coming soon". The four vertical kit cards and their
   engine dropdown entries were removed. Per Faiz, from employee feedback.

## Why the branch also touches 38 other files

The GitHub repo was ~1 week behind the live site (live was deployed from the
vault without a repo sync). To make a full-directory deploy safe, the branch
includes commit `77f7ece` which mirrors those 38 live files into the repo,
byte-verified against the live site. So deploying this branch changes ONLY the
sales kit — nothing rolls back. (`admin/runbook.html` and
`Company sales kit/index.html` serve dynamic bytes and kept repo versions.)

All four deploy.sh gates pass on this tree (280 inline scripts parse, JS
parses, ?v= stamps present, nav rules correct).

## How to publish — pick ONE

**Option A — from the vault (keeps the vault canonical, recommended for Hakim):**
1. Copy the branch's `portal/src/sales-kits.html` and
   `portal/src/sales-kit-slides.html` over the same two files in
   `04. Resources/Training/` in the vault.
2. Run `./deploy.sh` from that folder as usual.

**Option B — from this repo (any machine with Cloudflare access):**
```
git fetch origin && git checkout sales-kit-my-rates
cd portal/src
npx wrangler login      # one-time browser approval
./deploy.sh             # gates + wrangler pages deploy (project koocester-academy)
```

⚠️ If anything else was deployed from the vault after 27 July, re-sync before
using Option B (or just use Option A).

## ⚠️ Standing warning for the vault

The vault still contains the OLD sales kit files. Until step A-1 is done, any
future vault deploy will silently revert the new MY prices. Do A-1 even if you
publish via Option B.

## Verify after publishing (2 minutes)

Portal → Sales Kits: only one kit per tab. Open Company kit → MY → slide 3
shows RM13,000/RM18,000, slide 4 RM25,000, slide 5 five cards ending Wealth
RM6,000 / Foodie RM6,000, slide 6 shows 5/10/20% with the à-la-carte note.
Then switch to SG: must still show SGD 6,000/8,000 and 10/20/30%.
