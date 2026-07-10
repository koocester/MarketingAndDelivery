-- Card: Total Followers (Trend) | id: 236 | dashboard: CEO Dashboard (67) | source: content_perf.metricool_snapshots | visualization: line

WITH complete AS (SELECT snapshot_date FROM content_perf.metricool_snapshots GROUP BY 1 HAVING count(*)>=48),
p AS (SELECT date_trunc({{grain}}, snapshot_date) period, max(snapshot_date) d
      FROM content_perf.metricool_snapshots WHERE snapshot_date IN (SELECT snapshot_date FROM complete) GROUP BY 1)
SELECT p.period, sum(s.followers) AS total_followers
FROM p JOIN content_perf.metricool_snapshots s ON s.snapshot_date=p.d
WHERE 1=1 [[ AND s.platform = {{platform}} ]] [[ AND s.page = {{page}} ]]
GROUP BY p.period ORDER BY p.period
