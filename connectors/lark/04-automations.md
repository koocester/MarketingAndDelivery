# Lark — Automations, Buttons & Notifications

> Lark **automations have no API** at all (not even list) — the fan-out/real-time plane is confirmed in the UI, not exported. **Audited in-UI 2026-07-10: 90 automations, 74 active, 16 inactive** (36 Record Added-or-Updated · 28 Button is Clicked · 15 Scheduled · 6 New Record · 5 Record Updated). The guard-by-guard button audit — including **7 unguarded buttons** and one high-risk finding — is in **[07-button-automation-audit.md](07-button-automation-audit.md)**.

## Categories
1. **Project fan-out** — on Project creation, its videos/carousels are spawned/linked. **Idempotency is derived from link-count**, not rollups, with only-when-empty guards. AnyCross is the live fan-out engine.
2. **Auto-assign roles** — on record creation, role fields are copied from the **Page defaults** (Producer, Strategist, Editor, SMM, approvers; carousel Copywriter/Head Copywriter/Strategist). Records are born at **Not Started** — **client videos at Planning** via a backstop automation. Project Owner is *not* inherited as content strategist.
3. **Stage-gated buttons** — each button binds to **one** automation with stage preconditions (see below).
4. **Role notifications** — "<Role> Updates" group chats + a DM to the assignee on relevant transitions.
5. **SLA overdue scans** — scheduled scans over the `Overdue` helper flags (because `NOW()` can't trigger). See [03-pipelines-and-sla.md](03-pipelines-and-sla.md).
6. **Content Calendar sync** — videos/carousels sync to Content Calendar rows on the right transition.

## The button model (critical)
- A button binds to **one automation**; an **automation may be bound to more than one button** (e.g. Approve QC fires from `Approved` and `✅ Approve QC`). Fork on data *after* the click, never on the button.
- **A wrong-stage click on a GUARDED button no-ops SILENTLY** — no error, no log entry. If "a button does nothing," read its stage conditions first; the record is likely not in the required stage. That silence is the guard working.
- ⚠️ **7 of 28 button automations have NO conditions and always fire** — see [07-button-automation-audit.md](07-button-automation-audit.md).
- Carousel routing example: **Send to Copywriter** → Pending Copywriting; **Start Copywriting** starts the clock. Editor resubmits route by amendment type (Amendments Needed → Strategist QC; Amendments (Marketing) → Final Approval) via two stage-specific Notify automations.

## Engineer cautions (verified pattern)
- **Edge-vs-level triggers:** "matches conditions" triggers are **edge-triggered** (fire only on *entering* the state) and **ignore API writes**. For reflect-on-change, use "when a record updates" watching the specific field.
- **API writes may not fire** edge-triggered automations — relevant when an agent mutates records via MCP.
- **Duplicated automations** can carry corrupted card buttons that block activation — turn OFF "Add buttons" to activate.
- Before judging an automation, **scroll its action panel to the bottom** ("Add action") — summary captions undercount steps.
- **Automation record-picker** lists only already-used records; API-tag a record then reopen the editor to pick it.

## Audit status
✅ The **guard-by-guard button audit is DONE** (2026-07-10) — [07-button-automation-audit.md](07-button-automation-audit.md). Remaining: transcribing the exact stage value inside each of the 21 guarded automations (inferable from names; open to confirm).
