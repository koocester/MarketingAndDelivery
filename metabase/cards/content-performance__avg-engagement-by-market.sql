-- Card: Avg Engagement by Market | id: 369 | dashboard: Content Performance (100) | source: content_perf.reels | visualization: bar

SELECT CASE WHEN page='Koocester' THEN 'Regional' ELSE country END AS market, round(avg(engagement_rate)::numeric,2) AS engagement, min(CASE WHEN page='Koocester' THEN 4 WHEN country='Singapore' THEN 1 WHEN country='Malaysia' THEN 2 WHEN country='Indonesia' THEN 3 ELSE 5 END) AS sort FROM content_perf.reels WHERE engagement_rate IS NOT NULL GROUP BY 1 ORDER BY sort
