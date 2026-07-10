-- Card: Reach (Views) by Period | id: 303 | dashboard: Content Performance (100) | source: content_perf.reels | visualization: bar

SELECT date_trunc({{grain}}, published_date) AS period, sum(views) AS views FROM content_perf.reels WHERE published_date IS NOT NULL AND {{country}} AND {{page}} AND {{platform}} GROUP BY 1 ORDER BY 1
