-- Card: Total Followers | id: 298 | dashboard: Content Performance (100) | source: content_perf.metricool_snapshots | visualization: scalar

WITH complete AS (SELECT snapshot_date FROM content_perf.metricool_snapshots GROUP BY 1 HAVING count(*)>=48)
SELECT sum(followers) AS total_followers FROM content_perf.metricool_snapshots
WHERE snapshot_date=(SELECT max(snapshot_date) FROM complete) AND {{country}} AND {{page}} AND {{platform}}
