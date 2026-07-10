# agents/

"Agents" in this system = **Claude Code sessions** operating via MCP connectors. There is **no deployed agent daemon**.

- Operating rules: [../docs/18-future-claude-code-instructions.md](../docs/18-future-claude-code-instructions.md).
- Control-plane connectors: `lark`, `n8n-mcp`, `metabase`, HubSpot, Xero (see [../docs/06-connectors-and-integrations.md](../docs/06-connectors-and-integrations.md)).
- The n8n **Candidate Analysis** workflow is an *AI pipeline*, not an agent daemon — it lives in n8n ([../docs/09-n8n-setup.md](../docs/09-n8n-setup.md)).

If a standalone agent process is ever built, its code goes here with: purpose, trigger, systems touched, secrets (managed only), test plan, rollback, monitoring, owner — use the template in [../docs/11-agents-and-cron-jobs.md](../docs/11-agents-and-cron-jobs.md).
