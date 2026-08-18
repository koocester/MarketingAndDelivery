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

| Product | Seats | Term | Net (USD) | GST 9% | Total (USD) |
|---|---|---|---|---|---|
| Microsoft Entra ID P1 | 19 | 13 Aug 2026 – 12 Aug 2027 | 1,596.00 | 143.64 | **1,739.64** |
| Microsoft Intune Plan 1 | 19 | 13 Aug 2026 – 12 Aug 2027 | 1,824.00 | 164.16 | **1,988.16** |
| | | | | | **3,727.80** |

⚠️ **Billing is annual, charged upfront.** The full year hit the card on 14 Aug 2026
($84/seat/yr P1 + $96/seat/yr Intune ≙ $7 + $8 monthly equivalent). Planning documents
that say "$285/month" describe the run-rate, not the cash flow. Seats added mid-term
arrive as pro-rated annual charges.

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

## ⚠️ Seat shortfall — open risk

Two expired 25-seat trials (Intune trial exp. 6 Aug 2026, P1 trial exp. 10 Aug 2026)
still inflate the console's "available" count (44 shown). When they deprovision the
pool drops to **19 paid seats** against **23 assigned**:

| Assigned | Count |
|---|---|
| Original group members | 19 |
| Muhammad Faaiz | 1 |
| Koocester Tech (admin) | 1 |
| Zainab | 1 |
| Sarah | 1 |
| **Total** | **23** |

**Four people silently lose licences** when the trials die — including Faiz, whose
Entra-joined laptop falls out of management. Fix: **buy 4 more seats** (~+$60/month
equivalent), or drop `tech@` from licensing if the service account doesn't need Intune
and buy 3. Purchase links (verified working):

- Entra ID P1: `https://admin.cloud.microsoft/#/catalog/offer-details/microsoft-entra-id-p1/A8B0208D-C604-40CE-BEE6-C601C4F41E85`
- Intune Plan 1: `https://admin.cloud.microsoft/#/catalog/offer-details/microsoft-intune-plan-1/64312587-435C-4771-B826-822519581E60`

## Windows 11 Pro product keys

18 retail **activate-only** keys bought 11 Aug 2026 from keysender (reply-to
erpvideos). 4 arrived dead (replacements chased), 1 spare remains. **Key values are
deliberately not stored in this repo** — custody is with Faiz. Verify any key's
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
