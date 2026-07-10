-- Card: Spend by Category (7d) | id: 333 | dashboard: CEO Dashboard (67) | source: finance.aspire_transactions | visualization: bar

SELECT spend_category, round(sum(-amount),2) AS spend FROM finance.aspire_transactions WHERE amount<0 AND spend_category IS NOT NULL AND spend_category<>'' GROUP BY 1 ORDER BY 2 DESC
