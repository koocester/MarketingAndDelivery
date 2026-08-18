# 20 — Device & identity (Entra ID / Intune)

Staff laptops are moving off personal Microsoft accounts onto company-managed
identities: Windows 11 Pro + Microsoft Entra join + Intune enrolment (Macs: Entra
registered + Intune; iPhones stay in Mosyle).

All detail lives in the per-system folder, following the same convention as
`connectors/lark/`:

- [`connectors/entra/README.md`](../connectors/entra/README.md) — tenant facts, hard rules
- [`connectors/entra/01-device-onboarding.md`](../connectors/entra/01-device-onboarding.md) — runbooks, rollout state, traps
- [`connectors/entra/02-licensing-and-invoices.md`](../connectors/entra/02-licensing-and-invoices.md) — seats, billing, invoices

Live per-person rollout state is in the Lark Tech Base table "Windows 11 Pro & Entra
Onboarding" (`tblbhm9qVI0GNxuK`); the staff-facing policy layer is the portal training
pages (`portal/src/device-access-admin-training.html`,
`portal/src/device-management-training.html`).

Nothing Entra/Intune/device-rollout related should be recorded anywhere else in this
repo — in particular not in deck build logs.
