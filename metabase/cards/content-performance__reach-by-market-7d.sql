-- Card: Reach by Market (7d) | id: 368 | dashboard: Content Performance (100) | source: content_perf.reels | visualization: bar

SELECT CASE WHEN page='Koocester' THEN 'Regional' ELSE country END AS market, sum(views) AS views, min(CASE WHEN page='Koocester' THEN 4 WHEN country='Singapore' THEN 1 WHEN country='Malaysia' THEN 2 WHEN country='Indonesia' THEN 3 ELSE 5 END) AS sort FROM content_perf.reels WHERE published_date >= current_date - interval '7 days' GROUP BY 1 ORDER BY sort
