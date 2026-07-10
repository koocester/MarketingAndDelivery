-- Card: Open Pipeline (SGD) | id: 265 | dashboard: CEO Dashboard (67) | source: hubspot.deal | visualization: scalar

SELECT round(sum(property_amount_in_home_currency)::numeric,0) AS open_pipeline_sgd
FROM hubspot.deal
WHERE (_fivetran_deleted IS NULL OR _fivetran_deleted=false)
  AND (is_deleted IS NULL OR is_deleted=false)
  AND property_hs_is_closed IS NOT TRUE
  AND property_amount_in_home_currency IS NOT NULL
