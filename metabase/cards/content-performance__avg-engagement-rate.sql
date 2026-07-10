-- Card: Avg Engagement Rate | id: 300 | dashboard: Content Performance (100) | source: content_perf.reels | visualization: scalar

SELECT round(avg(engagement_rate)::numeric,2) AS avg_engagement FROM content_perf.reels WHERE engagement_rate IS NOT NULL AND {{country}} AND {{page}} AND {{platform}}
