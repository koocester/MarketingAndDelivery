-- Card: Reach — Latest Month (views gained) | id: 233 | dashboard: CEO Dashboard (67) | source: content_perf.metricool_snapshots | visualization: scalar

WITH complete AS (SELECT snapshot_date FROM content_perf.metricool_snapshots GROUP BY 1 HAVING count(*)>=48)
SELECT sum(viewership_increase) AS reach
FROM content_perf.metricool_snapshots
WHERE snapshot_date IN (SELECT snapshot_date FROM complete)
AND date_trunc('month',snapshot_date)=(SELECT date_trunc('month',max(snapshot_date)) FROM complete)
[[ AND platform = {{platform}} ]]
[[ AND page = {{page}} ]]
