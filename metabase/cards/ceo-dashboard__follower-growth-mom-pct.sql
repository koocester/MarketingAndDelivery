-- Card: Follower Growth (MoM %) | id: 235 | dashboard: CEO Dashboard (67) | source: content_perf.metricool_snapshots | visualization: scalar

WITH complete AS (SELECT snapshot_date FROM content_perf.metricool_snapshots GROUP BY 1 HAVING count(*)>=48),
me AS (SELECT date_trunc('month',snapshot_date) mon, max(snapshot_date) d FROM complete GROUP BY 1),
tot AS (SELECT me.mon, sum(s.followers) f FROM me JOIN content_perf.metricool_snapshots s ON s.snapshot_date=me.d
        WHERE 1=1 [[ AND s.platform = {{platform}} ]] [[ AND s.page = {{page}} ]] GROUP BY me.mon)
SELECT round((( f - lag(f) OVER (ORDER BY mon)) / lag(f) OVER (ORDER BY mon) * 100)::numeric,1) AS growth_pct
FROM tot ORDER BY mon DESC LIMIT 1
