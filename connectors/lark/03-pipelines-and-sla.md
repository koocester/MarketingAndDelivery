# Lark — Pipelines & the SLA Engine

## Video pipeline (`Video Stage`)
```
Not Started → Sourcing → Approval → Planning → Ready to Shoot → Ready to Edit
→ Editing → Strategist QC → Amendments Needed / Amendments (Marketing)
→ Final Approval (Marketing/Client) → Ready To Upload → Completed
```
Exception states: On Hold · To Reupload · Rejected/DO NOT POST · Taken Down · Rejected Contact.

## Carousel pipeline (`Carousel Stage`)
```
Not Started → Pending Copywriting → Copywriting → Amendments Needed
→ Final Approval (Head Copywriter/Client) → Ready to Upload → Completed
```
Exception states: On Hold · To Reupload · Reject/DO NOT POST · Taken Down.

> **Pending Copywriting** exists so the 3h copywriting clock starts only when a copywriter *picks up* the carousel (via **Start Copywriting**), not when it's queued.

## The SLA / Lead-Time engine

> ⚠️ **Is it actually live?** The Videos table carries a field **`SLA State (activate at go-live)`** (`fldL3s3qz8`) that is a **deliberate blank placeholder** — left empty so migration timestamps don't raise false overdues. Treat the SLA engine below as **built and specified, but verify it is switched on** before relying on `Overdue` in reporting.

Each stage has an allowed duration and a live countdown, all as **formula fields**:

- **`Lead Time`** — hours allowed in the current stage. Examples: video Strategist QC 16h, Amendments 6h, Final Approval 48h (client) / 12h (internal); carousel Copywriting 3h, Amendments 2h, Final Approval 12h client / 4h internal.
- **`Last … Stage Updated`** — a **ModifiedTime** field used as the clock start.
- **`Time Left`** — live "Xh Ym left" / "OVERDUE by …" / "—" when the stage has no deadline.
- **`Overdue`** (+ stage-specific `Amendments Overdue`, `Raw Upload Overdue`, `ManyChat Overdue`) — text `OVERDUE` when past deadline.

### How overdue chasing actually fires
A formula `NOW()` **cannot trigger** a Lark automation. So overdue chasing is built as a **scheduled scan** over the `Overdue` helper flags — a periodic automation reads the flag and nudges the owner. This is why the `Overdue` text fields exist as separate helpers.

### Aging (publish backlog)
- **`Content Age (days)`** and **`Content Stale`** only populate for the **Ready-to-Upload** stage: 🟠 30d+ aging, 🔴 60d+ stale. There is **no** generic "days in current stage" for other stages — see the gotcha below.

## ⚠️ SLA gotchas
- **`Last … Stage Updated` is whole-record ModifiedTime**, not a true stage-entry stamp — **any** field edit can reset the clock. Trust the **stage**, not the raw timestamp, when reasoning about how long something's been stuck.
- Editing has its own clock (`Editing Started At` → `Edit Deadline`) started by the **Start Editing** button, independent of the stage SLA.
