-- Card: Avg Engagement Rate by Platform | id: 238 | dashboard: CEO Dashboard (67) | source: content_perf.metricool_snapshots | visualization: bar

SELECT platform, round(avg(engagement_rate)::numeric,2) AS avg_engagement
FROM content_perf.metricool_snapshots
WHERE engagement_rate IS NOT NULL
[[ AND platform = {{platform}} ]]
[[ AND page = {{page}} ]]
GROUP BY platform ORDER BY 2 DESC
