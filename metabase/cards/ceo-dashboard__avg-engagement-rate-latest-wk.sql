-- Card: Avg Engagement Rate (latest wk) | id: 234 | dashboard: CEO Dashboard (67) | source: content_perf.metricool_snapshots | visualization: scalar

WITH complete AS (SELECT snapshot_date FROM content_perf.metricool_snapshots GROUP BY 1 HAVING count(*)>=48)
SELECT round(avg(engagement_rate)::numeric,2) AS avg_engagement
FROM content_perf.metricool_snapshots
WHERE snapshot_date=(SELECT max(snapshot_date) FROM complete) AND engagement_rate IS NOT NULL
[[ AND platform = {{platform}} ]]
[[ AND page = {{page}} ]]
