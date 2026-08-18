# Microsoft Entra ID / Intune — device & identity

System docs for the company-managed identity and device-management layer: Windows 11
Pro upgrades, Entra join, Intune enrolment, and the migration of staff laptops off
personal Microsoft accounts. This folder is the **single home** for this material —
do not scatter it into deck logs, portal pages, or chat threads.

## Files

| File | Contents |
|---|---|
| [`01-tenant-and-licensing.md`](01-tenant-and-licensing.md) | Tenant facts, group-based licensing, seat maths, billing, invoices |
| [`02-windows-runbook.md`](02-windows-runbook.md) | Home→Pro upgrade, Entra join, first sign-in, join diagnosis |
| [`03-macos-runbook.md`](03-macos-runbook.md) | Mac registration + Intune enrolment via Company Portal |
| [`04-profile-migration.md`](04-profile-migration.md) | Moving data off personal Microsoft accounts — the OneDrive traps |
| [`06-traps-and-gotchas.md`](06-traps-and-gotchas.md) | Every trap hit so far, with fixes |
| `invoices/` | Microsoft tax invoice PDFs |

There is deliberately no `05-roster-and-status.md`: **live per-person state belongs in
the Lark tracker, not in git**, where it would go stale within weeks. See below.

## Live state — where to look, not this repo

- Rollout tracker: Lark Tech Base (`OTjWbsC3JaqH3ms1tmDlYraGgNe`) → table
  **"Windows 11 Pro & Entra Onboarding"** (`tblbhm9qVI0GNxuK`)
- Device inventory: **Device & Asset Tracker** (`tblVINk4aagWJafd`)
- Enrolment truth: **Entra admin center → Devices** (not the Intune device list — it lags)
- Per-user check: M365 admin center → user → **Devices** tab

Snapshot as of 18 Aug 2026 for orientation only: 18 devices Entra-joined/registered,
Intune-managed, all Compliant. Indonesia complete except Mabdi. Malaysia: Mishkat,
Rina, Thaddeus joined 17 Aug; Zainab and Bhavani laptops outstanding; Sarah (Mac)
account created 18 Aug, enrolment pending. Profile migration not started anywhere.

## Tenant facts

| Item | Value |
|---|---|
| Tenant | **Koocester Group** |
| Admin account | `tech@koocester.onmicrosoft.com` |
| Verified domain | `koocester.com` |
| Mail platform | Google Workspace — the tenant has **no Exchange**; identity + device management only |
| Licensing group | `Koocester - Device Onboarding` (Security, Assigned membership) |
| Group Object ID | `05a8639b-671c-43a0-9d53-dc7c5d0019f0` |

UPNs follow the HR Base **"Work Email"** field (HR Base `KQp7bmn5WaztcZsILUalm4bjgOf`,
table `tbletkzlOHyUIzOX`) — that field is the source of truth. Display names use the
government name from HR "Full Name".

## Hard rules

1. Licences are assigned **to the group, never to individuals**. Membership in
   `Koocester - Device Onboarding` grants Entra ID P1 + Intune Plan 1 automatically.
2. Set **Usage location** on every new user, or licence assignment silently fails.
3. Create single users manually — the bulk CSV flow stages, claims success, and never
   submits.
4. Wait for **Assigned licenses: 2** on the user before touching their device.
5. Licence **before** join — devices that join unlicensed never auto-enrol into Intune.
6. **No product keys, passwords, or recovery material in this repo** (see
   `docs/15-security-and-secrets.md`). Key custody: Faiz. Recovery keys: the owning
   user's Microsoft account.
7. Every change to this system carries a CR number into the commit and branch name.

## Staff-facing layer

The portal training pages are the policy layer staff actually see:
`portal/src/device-access-admin-training.html` (admins) and
`portal/src/device-management-training.html` (staff). They are vendor-agnostic; this
folder is the vendor-specific operational truth.
