-- Card: AR Overdue | id: 201 | dashboard: CEO Dashboard (67) | source: xero.invoice | visualization: scalar

select sum(amount_due) as ar_overdue from xero.invoice where type='ACCREC' and status='AUTHORISED' and amount_due>0 and due_date < current_date;
