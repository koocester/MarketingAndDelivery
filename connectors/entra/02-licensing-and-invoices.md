# Licensing & invoices — Entra ID P1 + Intune Plan 1

## Model

Two separate products, both required:

- **Microsoft Entra ID P1** — identity: Conditional Access, group-based licensing, and
  the right for devices to auto-enrol into Intune.
- **Microsoft Intune Plan 1** — device management: policies, compliance, remote wipe.

P1 alone means devices join but never enrol. Both licences are assigned to the security
group **`Koocester - Device Onboarding`** (`05a8639b-671c-43a0-9d53-dc7c5d0019f0`) —
never to individuals. Group membership = both licences, automatically.

## What is bought

| Product | Seats | Term | Net | GST 9% | Total (USD) |
|---|---|---|---|---|---|
| Microsoft Entra ID P1 | 19 | 13 Aug 2026 – 12 Aug 2027 | 1,596.00 | 143.64 | **1,739.64** |
| Microsoft Intune Plan 1 | 19 | 13 Aug 2026 – 12 Aug 2027 | 1,824.00 | 164.16 | **1,988.16** |
| | | | | | **3,727.80** |

⚠️ **Billing is annual, charged upfront** — the full year hit the card on 14 Aug 2026
($84/seat/yr P1, $96/seat/yr Intune ≙ $7 + $8 per month). The rollout handover assumed
$285/month drip; the cash reality is one ~$3.7k annual charge. Additional seats bought
mid-term will arrive as pro-rated annual charges.

## Invoices

| Invoice | Product | Date | Amount (USD) | Order number | File |
|---|---|---|---|---|---|
| E0801058YA | Entra ID P1 | 14 Aug 2026 | 1,739.64 | `b9549ca6-ac61-42b9-8adc-a78c5dbac20c` | [`invoices/2026-08-14-E0801058YA-entra-id-p1.pdf`](invoices/2026-08-14-E0801058YA-entra-id-p1.pdf) |
| E0801054B3 | Intune Plan 1 | 14 Aug 2026 | 1,988.16 | `347f944b-ee42-427b-b4ac-d645dc6db1b4` | [`invoices/2026-08-14-E0801054B3-intune-plan-1.pdf`](invoices/2026-08-14-E0801054B3-intune-plan-1.pdf) |

Billed by Microsoft Regional Sales Pte Ltd (Singapore, GST Reg M90002526N) to Koocester
Group, 105 McNair Road. Originals: **M365 admin center → Billing → Bills & payments**
(`tech@koocester.onmicrosoft.com`). Company spend otherwise lives in Aspire/Xero.

## ⚠️ Seat shortfall — open risk

Two expired 25-seat trials (Intune exp. 6 Aug, P1 exp. 10 Aug 2026) still inflate the
console's "available" count. When they deprovision the pool drops to **19 paid seats**
against **23 assigned** (19 original group members + Faiz + Koocester Tech + Zainab +
Sarah): **4 people silently lose licences**, including Faiz, whose Entra-joined laptop
falls out of management.

**Fix: buy 4 more seats (~+$60/month equivalent), or drop the `tech@` service account
from licensing and buy 3.** Purchase at admin center → Marketplace:

- Entra ID P1: `https://admin.cloud.microsoft/#/catalog/offer-details/microsoft-entra-id-p1/A8B0208D-C604-40CE-BEE6-C601C4F41E85`
- Intune Plan 1: `https://admin.cloud.microsoft/#/catalog/offer-details/microsoft-intune-plan-1/64312587-435C-4771-B826-822519581E60`

## Windows 11 Pro product keys

18 retail activate-only keys bought 11 Aug 2026 (keysender/erpvideos); 4 dead, spare
and replacement status tracked by Faiz. **Keys are deliberately not stored in this
repo** — see `docs/15-security-and-secrets.md`. Verify any key's channel with
`slmgr /dlv` (`Retail`/`OEM` = legitimate; `Volume:*` = grey market).
