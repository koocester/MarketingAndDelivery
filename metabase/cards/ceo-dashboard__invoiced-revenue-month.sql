-- Card: Invoiced Revenue / Month | id: 202 | dashboard: CEO Dashboard (67) | source: xero.invoice | visualization: bar

select to_char(date_trunc('month', date),'YYYY-MM') as month, sum(total) as invoiced from xero.invoice where type='ACCREC' group by 1 order by 1;
