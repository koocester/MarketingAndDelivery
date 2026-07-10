# Lark — Button Automation Audit (guard-by-guard)

**Audited 2026-07-10 in the Lark UI, read-only.** Nothing was toggled, edited, saved, activated, or deleted. Lark automations have **no API**, so this was done in the Automation Center.

## Base automation totals (corrects earlier "~78")
**90 automations · 74 active · 16 inactive.** By trigger:

| Trigger | Count |
|---|---|
| Record Added or Updated | 36 |
| **Button is Clicked** | **28** (all active) |
| At Scheduled Time | 15 |
| New Record Added | 6 |
| Record Updated | 5 |

> **Refinement to the "one button = one automation" rule:** one *automation* can be bound to **more than one button**. `Video - Approve QC Automation` fires from both **`Approved`** and **`✅ Approve QC`**.

---

## 🔴 The headline finding: 7 of 28 button automations have NO conditions

A guarded automation reads *"When a button is clicked **and all specified conditions are matched**…"*. An unguarded one reads *"When a button is clicked, change the record…"* — it fires from **any stage**, on **any record**.

### Unguarded (fires unconditionally) — ranked by risk
| # | Automation | Button | What it does | Risk |
|---|---|---|---|---|
| 1 | **Video - Organic video rejected** | `Reject Video` | Sets `Video Stage = Rejected/DO NOT POST` **and DMs the Producer** ("Organic Video Rejected" + raw file link) | 🔴 **HIGH** — destructive stage change + an unwanted notification to a person, from *any* stage incl. Completed/published. **Verified: conditions block is empty.** |
| 2 | **Video - Ready to shoot automation** | (video) | Unconditional stage change | 🟠 Med — can jump a video's stage out of order |
| 3 | **Carousel - Start Copywriting (copywriter picks up)** | `Start Copywriting` | Starts the 3h copywriting SLA clock | 🟠 Med — clock can start from a wrong stage |
| 4 | **Notify - Events 1/2 - Need Marketing?** | (events) | Sends Lark messages + 1 more action | 🟠 Med — sends messages unconditionally |
| 5 | **Video - Manychat built Automation** | `ManyChat built` | Sets Manychat Status | 🟡 Low |
| 6 | **Carousel – ManyChat Built → Manychat Status: Built** | `ManyChat Built` | Sets Manychat Status | 🟡 Low |
| 7 | **Add to Calendar button → set Calendar Requested** | `Add to Producer Calendar` | Sets the Calendar Requested flag | 🟡 Low |

> This **confirms and extends** the earlier note that only "Start Copywriting + ManyChat Built" were unguarded — there are in fact **seven**, and the most dangerous (`Reject Video`) was not previously known.

### Verified exact conditions (opened and read)
**`Video - Approve QC Automation`** — guarded ✅
- Trigger: button clicked. Bound to **2 buttons**: `Approved`, `✅ Approve QC` (Videos).
- **Condition:** `Video Stage` **is** `Strategist QC`
- **Action:** Update Videos → `Video Stage = Final Approval (Marketing/Client)`
- Related notifier: `Notify – Content Strategist QC → CS` (sends a Lark message).

**`Video - Organic video rejected`** — **UNGUARDED** 🔴
- Trigger: button `Reject Video` (Videos). **Conditions: none** (panel shows only "Add concurrent condition").
- Action 1: Update Videos → `Video Stage = Rejected/DO NOT POST`
- Action 2: **Send a Lark message → Producer**, title "Organic Video Rejected", body references `Raw File Link (Google Drive)` + "the video was rejected."

---

## Guarded button automations (21 of 28, all active)
All read *"…and all specified conditions are matched…"*. The stage guard is of the form `Video Stage / Carousel Stage is <X>` → set `<Y>`.

**Videos:** Contact approval button approved · Contact approval button reject (+2 actions) · Approve QC · Producer submission to approval · Send to Producer (source request) · Request Changes to Amendments (Marketing) · Resubmit button (sets flag) · Re-Submission Of Producer Contact · SMM All uploaded to videos to complete · Shoot Done to Ready to Edit · Approve Organic Video · Approve Video to Ready to Upload · Reject QC · Submit Video to Strategist QC · Start Editing to Editing

**Carousels:** Send to Copywriter (build request) · All Uploaded → Completed · Resubmit → Final Approval · Submit → Final Approval · Reject → Amendments Needed · Approve → Ready to Upload

> Individual stage values for each guarded automation were **not transcribed one-by-one** (21 editor opens carries real risk of an accidental save on a live base). Each is inferable from its name; open the automation to confirm before relying on an exact value. The two above were opened and verified verbatim.

---

## Why this matters (the silent no-op, restated correctly)
- **Guarded buttons** silently no-op on a wrong stage — no error, no log. That's *safe* behaviour: the guard is protecting you.
- **Unguarded buttons always fire.** There is no protection. `Reject Video` in particular will kill and notify on a *published* video.

## Recommended fix (not applied — read-only audit)
Add a stage condition to the 7 unguarded automations, starting with **`Video - Organic video rejected`**: constrain it to the stages where rejection is legitimate (e.g. `Approval` / `Strategist QC` / `Final Approval`), so it cannot fire on `Completed` / `Ready To Upload`.
