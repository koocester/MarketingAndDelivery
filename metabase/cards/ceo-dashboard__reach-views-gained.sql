-- Card: Reach (Views Gained) | id: 237 | dashboard: CEO Dashboard (67) | source: content_perf.metricool_snapshots | visualization: bar

WITH complete AS (SELECT snapshot_date FROM content_perf.metricool_snapshots GROUP BY 1 HAVING count(*)>=48)
SELECT date_trunc({{grain}}, snapshot_date) AS period, sum(viewership_increase) AS reach
FROM content_perf.metricool_snapshots
WHERE snapshot_date IN (SELECT snapshot_date FROM complete)
[[ AND platform = {{platform}} ]]
[[ AND page = {{page}} ]]
GROUP BY 1 ORDER BY 1
