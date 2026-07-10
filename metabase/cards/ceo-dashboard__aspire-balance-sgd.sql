-- Card: Aspire Balance (SGD) | id: 331 | dashboard: CEO Dashboard (67) | source: finance.aspire_accounts | visualization: scalar

SELECT round(available_balance,2) AS balance FROM finance.aspire_accounts WHERE currency_code='SGD' ORDER BY snapshot_at DESC LIMIT 1
