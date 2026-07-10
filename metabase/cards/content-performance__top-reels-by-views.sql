-- Card: Top Reels by Views | id: 306 | dashboard: Content Performance (100) | source: content_perf.reels | visualization: table

SELECT video_title AS reel, page, platform, country, views, round(engagement_rate::numeric,2) AS engagement, published_date FROM content_perf.reels WHERE 1=1 AND {{country}} AND {{page}} AND {{platform}} ORDER BY views DESC LIMIT 20
