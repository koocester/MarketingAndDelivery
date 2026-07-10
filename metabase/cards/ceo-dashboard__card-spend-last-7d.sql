-- Card: Card Spend (last 7d) | id: 332 | dashboard: CEO Dashboard (67) | source: finance.aspire_transactions | visualization: scalar

SELECT round(sum(-amount),2) AS spend FROM finance.aspire_transactions WHERE amount<0
