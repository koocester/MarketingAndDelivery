# n8n/workflows/

Redacted workflow JSON exports for reference/import. Per-workflow documentation is in [../../docs/09-n8n-setup.md](../../docs/09-n8n-setup.md).

## ⚠️ Not yet populated — on purpose
Several live workflows **hardcode secrets inline** (S1–S6, see [../../docs/15-security-and-secrets.md](../../docs/15-security-and-secrets.md)). Exporting them as-is would commit secrets. **Rotate + migrate those secrets to managed credentials first**, then export.

## Export procedure (per workflow)
1. n8n → open workflow → ⋯ → **Download**.
2. Open the JSON and **remove/redact**: any `x-api-key`/`Authorization`/`app_secret`/`X-Mc-Auth` values, webhook secret paths, and pinned test payloads containing real people/leads.
3. Keep node structure, connections, and **credential names/ids** (names are safe; values are not).
4. Save as `<workflow-name>.redacted.json` here.
5. Run the secret scan ([../../docs/14-testing-and-validation.md](../../docs/14-testing-and-validation.md)) before committing.

## Import procedure
1. n8n → **Import from File**.
2. Recreate credentials from [../credentials/README.md](../credentials/README.md) (values entered in n8n, never from the repo).
3. Re-point nodes to the managed credentials.
4. Test on a **test chat/table** before activating.

## Safe candidates to export first (no inline secrets)
`Koocester Command` (`ePDPNKpgKdz4SUMZ`), `Command AI Cache` (`m7n7555E2t6Wlvkk`), `Aspire → Supabase` (`r6PNZZURAXZA9sNI`), `Marketing Planner` (`slwrf4zMHB10Bi67`).
