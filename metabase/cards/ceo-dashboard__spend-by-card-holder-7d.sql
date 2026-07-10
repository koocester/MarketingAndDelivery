-- Card: Spend by Card Holder (7d) | id: 334 | dashboard: CEO Dashboard (67) | source: finance.aspire_transactions | visualization: bar

SELECT COALESCE(NULLIF(card_holder,''),'Transfers / Bills') AS who, round(sum(-amount),2) AS spend FROM finance.aspire_transactions WHERE amount<0 GROUP BY 1 ORDER BY 2 DESC
