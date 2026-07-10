-- Card: Avg Engagement by Platform | id: 304 | dashboard: Content Performance (100) | source: content_perf.reels | visualization: bar

SELECT platform, round(avg(engagement_rate)::numeric,2) AS avg_engagement FROM content_perf.reels WHERE engagement_rate IS NOT NULL AND {{country}} AND {{page}} AND {{platform}} GROUP BY platform ORDER BY 2 DESC
