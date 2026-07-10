-- Card: Cash Collected / Month | id: 199 | dashboard: CEO Dashboard (67) | source: xero.payment | visualization: bar

select to_char(date_trunc('month', date),'YYYY-MM') as month, sum(amount) as cash_collected from xero.payment where payment_type='ACCRECPAYMENT' and status='AUTHORISED' group by 1 order by 1;
