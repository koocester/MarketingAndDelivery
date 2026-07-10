-- Card: Total Reels | id: 301 | dashboard: Content Performance (100) | source: content_perf.reels | visualization: scalar

SELECT count(*) AS reels FROM content_perf.reels WHERE 1=1 AND {{country}} AND {{page}} AND {{platform}}
