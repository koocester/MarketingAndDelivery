# n8n/credentials/

**Documentation templates only. NEVER store real credential values here.** These describe what must be recreated in n8n when importing workflows.

Template:
```
Credential name:
Used by workflows:
Credential type:
System:
Required values:      (names only)
Where to create it:   (n8n → Credentials → New)
Rotation process:
Owner:
Notes:
```

---
**Postgres account** (`iLlaPQLaICzc44cH`)
- Used by: all sync + brief + dashboard workflows
- Type: postgres · System: Supabase
- Required values: host, port, db, user, password, SSL
- Rotation: rotate DB password in Supabase → update cred
- Owner: <OWNER>

**Lark App Secret (Koocester)** (`3HvLTgbxXknIviCu`)
- Used by: Koocester Command, Command AI Cache (correct pattern)
- Type: httpCustomAuth · System: Lark (app `cli_aa914316d6b8deed`)
- Required values: app_id, app_secret
- Rotation: rotate in Lark console → update cred → migrate S4 workflows onto this
- Owner: <OWNER>

**Anthropic API – Koocester** (`sg4na3c3HYfSK4zM`)
- Used by: briefs, Command AI Cache (correct); **Candidate Analysis bypasses it (S1)**
- Type: anthropicApi · System: Anthropic
- Required values: API key
- Rotation: rotate key in Anthropic console → update cred → repoint S1 nodes
- Owner: <OWNER>

**Aspire** (`26k5mZGkexthAm67`)
- Used by: Aspire → Supabase Sync · Type: oAuth2Api · System: Aspire
- Required values: client id/secret, OAuth tokens · Rotation: re-auth in n8n · Owner: <OWNER>

**Dashboard Basic-Auth ×6** (`M0B8m21bo5LYRGrY`, `qqERNugcM5usi70F`, `phy9jiBIgdIDpcgZ`, `w2mXZ83n9wWtiAEg`, `a6vJS7bHX0XqMDiB`, `3w6qSIaQyZn5q49d`)
- Used by: Koocester Command webhooks (command/growth/sales/finance/hr/tech)
- Type: httpBasicAuth · Required values: user, password · Rotation: change password → update cred → notify dashboard users · Owner: <OWNER>

**Others (managed, document as needed):** Gmail ×2, Google Docs/Drive/Sheets, OpenAI ×2, SerpAPI, AWS, API2PDF/Header Auth, Assembly AI.

---
## Credentials that must be created manually on import
Any workflow currently using an **inline** secret (S1–S6) must, on import, be pointed at a **managed** credential recreated here — never re-enter the inline value.
