-- Card: Monthly Spend / Burn (Aspire) | id: 366 | dashboard: CEO Dashboard (67) | source: finance.aspire_transactions | visualization: bar

SELECT to_char(date_trunc('month', datetime),'YYYY-MM') AS month, round(sum(-amount)) AS spend FROM finance.aspire_transactions WHERE amount<0 GROUP BY 1 ORDER BY 1
