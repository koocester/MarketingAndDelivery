-- Card: Total Views (Reach) | id: 299 | dashboard: Content Performance (100) | source: content_perf.reels | visualization: scalar

SELECT sum(views) AS total_views FROM content_perf.reels WHERE 1=1 AND {{country}} AND {{page}} AND {{platform}}
