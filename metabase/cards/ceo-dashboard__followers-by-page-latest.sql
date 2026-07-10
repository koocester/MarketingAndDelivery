-- Card: Followers by Page (latest) | id: 239 | dashboard: CEO Dashboard (67) | source: content_perf.metricool_snapshots | visualization: row

WITH complete AS (SELECT snapshot_date FROM content_perf.metricool_snapshots GROUP BY 1 HAVING count(*)>=48)
SELECT page, sum(followers) AS followers
FROM content_perf.metricool_snapshots
WHERE snapshot_date=(SELECT max(snapshot_date) FROM complete)
[[ AND platform = {{platform}} ]]
[[ AND page = {{page}} ]]
GROUP BY page ORDER BY 2 DESC
