-- Card: AR Outstanding | id: 200 | dashboard: CEO Dashboard (67) | source: xero.invoice | visualization: scalar

select sum(amount_due) as ar_outstanding from xero.invoice where type='ACCREC' and status='AUTHORISED' and amount_due>0;
