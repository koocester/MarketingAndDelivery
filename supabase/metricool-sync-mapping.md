# Metricool → Supabase Sync — Rebuildable Field Mapping

The exact mapping the n8n Metricool syncs use to land social metrics in Supabase `content_perf`. Enough to **rebuild the sync from scratch**. Secrets (`X-Mc-Auth`, Lark `app_secret`, Postgres connection) redacted — names/paths only.

- **Metricool account:** `userId=3748116`, per-page `blogId`; auth via `X-Mc-Auth` request header (value redacted).
- **Postgres:** n8n credential "Postgres account" (`iLlaPQLaICzc44cH`).
- Both syncs also write a parallel branch to a Lark base (out of scope here).

---

## 1. Reels Sync — `54vD7rU5KNMCjVq1`  (cron `0 8 * * *`)
**Metricool endpoints (path only), params `userId,blogId,from=2026-01-01T00:00:00,to=2026-12-31T23:59:59`, response `raw.data[]`:**
- `GET /api/v2/analytics/reels/instagram`
- `GET /api/v2/analytics/reels/facebook`
- `GET /api/v2/analytics/posts/tiktok`  (filtered to `type === "VIDEO"`)

**Write:** `content_perf.reels` via `INSERT … ON CONFLICT (post_url) DO UPDATE`. **Key: `post_url`** (trimmed, trailing `/` stripped, blank rows skipped). Node path: `Combine All Reels` → `Ensure Reels Table` → `Build Reels Rows` → `Insert Reels`.

| Metricool field (fallback order) | transform | Supabase column | notes |
|---|---|---|---|
| `url`→`reelUrl`→`shareUrl`→`link`→`permalink_url`; FB fallback `facebook.com/reel/{reelId}` | trim, strip trailing `/`, dedupe | `post_url` (text, PK) | conflict key; blank → skip |
| constant | `'Singapore'` | `country` | hardcoded |
| account label via PAGE map | `Homes→Koocester Homes`, `Business→…`, etc. | `page` | raw account if unmapped |
| per source node | `Instagram`/`Facebook`/`TikTok` | `platform` | set by node, not payload |
| `publishedAt.dateTime`→`created.dateTime`→`createTime` | date part before `T` | `published_date` (date) | |
| `content`→`message`→`videoDescription`→`description`→`title`→`story` | first line, ≤200 chars | `video_title` | |
| `blueReelsPlayCount`→`views`→`viewCount`→`plays`→0 | Number | `views` (bigint) | |
| `postImpressionsUnique`→`reach`→0 | Number | `reach` (bigint) | |
| `postImpressionsUnique`→`impressionsTotal`→`impressions`→0 | Number | `impressions` (bigint) | shares primary source with reach |
| `postVideoReactions`→`likes`→`likeCount`→`reactions`→0 | Number | `likes` (bigint) | |
| `comments`→`commentCount`→0 | Number | `comments` (bigint) | |
| `shares`→`postVideoSocialActions`→`reposts`→`shareCount`→0 | Number | `shares` (bigint) | |
| `saved`→`saves`→0 | Number | `saves` (bigint) | |
| `interactions`→`postVideoSocialActions`→0 | Number | `interactions` (bigint) | |
| `engagement`→0 | Number (Metricool sends 0 in practice) | `engagement_rate` (double) | |
| — | `now()` | `loaded_at` (timestamptz) | |

**`content_perf.reels` columns (all written):** post_url · page · country · platform · published_date · video_title · views · reach · impressions · likes · comments · shares · saves · interactions · engagement_rate · loaded_at. **No unwritten columns.**

---

## 2. Followers Sync — `0jSBKXJuzwfzciWH`  (cron `0 7 * * *`)
**Endpoint:** `GET /api/v2/analytics/timelines` — **48 calls** (16 pages × IG/FB/TT). Params `userId,blogId,network,metric,subject=account,timezone=Asia/Singapore,from=now−14d,to=today`. Response `raw.data[0].values[]` → sort by `dateTime` desc → take **latest** `value`.
- **`metric` per platform:** Instagram `Followers` · Facebook `pageFollows` · TikTok `followers_count`.

**Write:** `content_perf.metricool_snapshots` via `INSERT … ON CONFLICT (record_id) DO UPDATE`. **Key: `record_id`** = `{snapshot_date}_{page}_{platform}_{country}` (the page+platform+date grain). Node path: 48 HTTP → `Combine All Followers` → `Build Supabase Rows` → `Insert to Supabase`.

| Metricool field | transform | Supabase column | notes |
|---|---|---|---|
| derived | `snapshot_date_page_platform_country` | `record_id` (text) | conflict key |
| run date | `now()+8h` → `YYYY-MM-DD` | `snapshot_date` (date) | SGT date |
| page label via MAP | `KOOCESTER (Main)→Koocester`, `Homes *→Koocester Homes`, … | `page` | unmapped → skip (logged) |
| field slot | `Instagram`/`Facebook`/`TikTok` | `platform` | one row per platform |
| page label via MAP | `SG→Singapore`,`MY→Malaysia`,`ID→Indonesia` | `country` | |
| latest `values[].value` | `Number()||0` | `followers` (bigint) | 0 if none |
| — | `now()` | `loaded_at` (timestamptz) | |

**INSERT writes:** `record_id, snapshot_date, page, platform, country, followers, loaded_at`. **ON CONFLICT updates:** `followers, snapshot_date, loaded_at`.

**⚠️ Unwritten columns to know about:** `metricool_snapshots` also has `total_followers`, `viewership_increase`, `engagement_rate`, `followers_pct_increase`, `week_of_month` — **the sync does NOT populate these** (computed/filled downstream or manually). A rebuild must not assume the sync writes them.

---
## Rebuild checklist
1. Recreate the Metricool credential (`X-Mc-Auth`) as a **managed** n8n header-auth cred (not inline — see [../docs/15-security-and-secrets.md](../docs/15-security-and-secrets.md)).
2. Ensure both tables exist with the columns above (reels PK `post_url`; snapshots PK `record_id`).
3. Preserve the upsert keys — they are what keep the sync idempotent and (for snapshots) **append dated rows** so dashboard history survives.
4. Point Metabase Content dashboards at these tables (see [../docs/08-metabase-setup.md](../docs/08-metabase-setup.md)).
