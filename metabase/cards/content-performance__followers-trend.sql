-- Card: Followers Trend | id: 302 | dashboard: Content Performance (100) | source: content_perf.metricool_snapshots | visualization: line

WITH complete AS (SELECT snapshot_date FROM content_perf.metricool_snapshots GROUP BY 1 HAVING count(*)>=48),
pr AS (SELECT date_trunc({{grain}}, snapshot_date) period, max(snapshot_date) d FROM content_perf.metricool_snapshots WHERE snapshot_date IN (SELECT snapshot_date FROM complete) GROUP BY 1)
SELECT pr.period, sum(content_perf.metricool_snapshots.followers) AS total_followers
FROM pr JOIN content_perf.metricool_snapshots ON content_perf.metricool_snapshots.snapshot_date=pr.d
WHERE {{country}} AND {{page}} AND {{platform}}
GROUP BY pr.period ORDER BY pr.period
