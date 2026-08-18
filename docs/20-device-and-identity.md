# 20 — Device & identity (Entra ID / Intune)

Staff laptops are moving off personal Microsoft accounts onto company-managed
identities: Windows 11 Pro + Microsoft Entra join + Intune enrolment (Macs: Entra
registered + Intune; iPhones stay in Mosyle).

All detail lives in the per-system folder, following the same convention as
`connectors/lark/`:

- [`connectors/entra/README.md`](../connectors/entra/README.md) — overview, tenant facts, hard rules, where live state lives
- [`connectors/entra/01-tenant-and-licensing.md`](../connectors/entra/01-tenant-and-licensing.md) — licensing model, seat maths, billing, invoices
- [`connectors/entra/02-windows-runbook.md`](../connectors/entra/02-windows-runbook.md) — Home→Pro, Entra join, first sign-in, diagnosis
- [`connectors/entra/03-macos-runbook.md`](../connectors/entra/03-macos-runbook.md) — Mac registration + Intune via Company Portal
- [`connectors/entra/04-profile-migration.md`](../connectors/entra/04-profile-migration.md) — the OneDrive traps and migration options
- [`connectors/entra/06-traps-and-gotchas.md`](../connectors/entra/06-traps-and-gotchas.md) — every trap hit so far

Live per-person rollout state is deliberately **not** in git — it is the Lark Tech
Base table "Windows 11 Pro & Entra Onboarding" (`tblbhm9qVI0GNxuK`). The staff-facing
policy layer is the portal training pages
(`portal/src/device-access-admin-training.html`,
`portal/src/device-management-training.html`).

Nothing Entra/Intune/device-rollout related should be recorded anywhere else in this
repo — in particular not in deck build logs.
