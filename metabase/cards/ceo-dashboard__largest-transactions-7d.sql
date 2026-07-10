-- Card: Largest Transactions (7d) | id: 335 | dashboard: CEO Dashboard (67) | source: finance.aspire_transactions | visualization: table

SELECT datetime::date AS date, counterparty_name AS merchant, round(-amount,2) AS amount, spend_category, card_holder FROM finance.aspire_transactions WHERE amount<0 ORDER BY -amount DESC LIMIT 15
