# 01 — Tenant & licensing

## The two products

These are **two different products, not tiers of one thing** — both are required:

- **Microsoft Entra ID P1** — identity. Conditional Access, group-based licensing,
  and the right for devices to **auto-enrol into Intune**.
- **Microsoft Intune Plan 1** — device management. Policies, compliance, remote wipe.

P1 alone means devices join but never enrol.

## Group-based licensing

Both licences are assigned to the security group
**`Koocester - Device Onboarding`** (`05a8639b-671c-43a0-9d53-dc7c5d0019f0`) — never
to individuals. Adding a person to the group grants both automatically; removing them
revokes both. Group licence assignment lives in the **M365 admin centre**
(admin.cloud.microsoft → Billing → Licenses), not the Entra portal.

New-user sequence: create manually (Users → Add a user; never the bulk CSV), set
**Usage location**, add to the group, wait for **Assigned licenses: 2**, only then
touch their device. The M365 Add-user wizard's "auto-generate password + require
change at first sign-in" defaults are the correct ones — leave them ticked.

## What is bought

**22 seats of each product** (19 bought 13 Aug 2026, +3 on 18 Aug 2026 under
CR-20260818-03), term 13 Aug 2026 – 12 Aug 2027:

| Product | Seats | Rate | Annual net (USD) |
|---|---|---|---|
| Microsoft Entra ID P1 | 22 | $84/seat/yr | 1,848.00 |
| Microsoft Intune Plan 1 | 22 | $96/seat/yr | 2,112.00 |
| | | | **3,960.00 + 9% GST ≈ 4,316.40** |

⚠️ **Billing is annual, charged upfront.** The original 19-seat year hit the card on
14 Aug 2026 (invoices below); the +3 seats arrive as pro-rated annual charges.
Run-rate equivalent ≈ $330/month ($7 + $8 per seat) — planning documents quoting a
monthly figure describe the run-rate, not the cash flow.

## Invoices

| Invoice | Product | Date | Total (USD) | Order number | PDF |
|---|---|---|---|---|---|
| E0801058YA | Entra ID P1 | 14 Aug 2026 | 1,739.64 | `b9549ca6-ac61-42b9-8adc-a78c5dbac20c` | [`invoices/2026-08-14-E0801058YA-entra-id-p1.pdf`](invoices/2026-08-14-E0801058YA-entra-id-p1.pdf) |
| E0801054B3 | Intune Plan 1 | 14 Aug 2026 | 1,988.16 | `347f944b-ee42-427b-b4ac-d645dc6db1b4` | [`invoices/2026-08-14-E0801054B3-intune-plan-1.pdf`](invoices/2026-08-14-E0801054B3-intune-plan-1.pdf) |

Billed by Microsoft Regional Sales Pte Ltd (Singapore, GST Reg M90002526N) to
Koocester Group, 105 McNair Road, Singapore 328568. Marked "DO NOT PAY" — charged to
the stored payment method automatically. Originals: **M365 admin center → Billing →
Bills & payments** under `tech@koocester.onmicrosoft.com`. Wider company spend lives
in Aspire/Xero; these PDFs are kept here because the rollout is documented here.

## ✅ Seat shortfall — RESOLVED 18 Aug 2026 (CR-20260818-03)

Historical context: the original purchase covered only the 19 group members, while
23 people were assigned — the gap silently floated on two expired 25-seat trials
(Intune exp. 6 Aug, P1 exp. 10 Aug) still pooled in the console. Fix applied:

1. The `tech@` service account was **unlicensed** (its Global Administrator role
   needs no licence; it never enrolled a device).
2. Both subscriptions were raised **19 → 22 seats** via Billing → Your products →
   Buy more licenses.

Verified 18 Aug: **Purchased 22 / Assigned 22 on both products** — the expired trials
can deprovision with zero impact. The maths: 15 Indonesia + 6 Malaysia + Faiz = 22
people. **Seats are per person, not per device** (up to 50 devices per user), so new
laptops never need new seats — only new *people* do. To add seats later: tick the
subscription under Billing → Your products → Buy more licenses (pro-rated annual
charge), then add the person to the licensing group.

Ignore the console's "Available licenses" column while the expired trials linger —
it counts their ghost seats. **"Purchased quantity" is the only number that matters.**

## Windows 11 Pro product keys

18 retail **activate-only** keys bought 11 Aug 2026 from keysender (reply-to
erpvideos); 4 arrived dead (replacements chased). Live spare/failed key state is the
**SPARE rows at the bottom of the Lark rollout tracker** — do not trust counts written
in docs. **Key values are deliberately not stored in this repo** — custody is with
Faiz and the tracker. Verify any key's
channel with `slmgr /dlv`: `Retail`/`OEM` = legitimate; `Volume:MAK`/`Volume:GVLK` =
grey market and will likely be blocked later. Cross-check `Partial Product Key`
against the assignment list to prove the right person used the right key.

## Apple MDM Push (APNs) certificate

Set up 14 Aug 2026 — the one-time blocker for Mac/iPhone enrolment is gone. It
**expires every 12 months** and must be renewed with the **exact same Apple ID**.
Renew with a different Apple ID, or lose access to that account, and every enrolled
Apple device drops out and must be re-enrolled by hand. There is no recovery path.
**Owed: record which Apple ID was used + where its password lives, and set a
July 2027 renewal reminder.**
