# Microsoft Entra ID / Intune — device & identity

System docs for the company-managed identity and device-management layer. This is the
home for everything Entra/Intune/Windows-rollout related — do not scatter this material
into deck logs or portal pages.

## Tenant facts

| Item | Value |
|---|---|
| Tenant | Koocester Group |
| Admin account | `tech@koocester.onmicrosoft.com` |
| Verified domain | `koocester.com` |
| Mail platform | Google Workspace — the tenant has **no Exchange**; it is identity + device management only |
| Licensing group | `Koocester - Device Onboarding` (Security, Assigned) |
| Group Object ID | `05a8639b-671c-43a0-9d53-dc7c5d0019f0` |

UPNs follow the HR Base **"Work Email"** field (HR Base `KQp7bmn5WaztcZsILUalm4bjgOf`,
table `tbletkzlOHyUIzOX`) — that field is the source of truth.

## Files

| File | Contents |
|---|---|
| `01-device-onboarding.md` | Rollout scope, per-platform onboarding runbooks, current state, known traps |
| `02-licensing-and-invoices.md` | Licensing model, seat maths, billing terms, invoice records |
| `invoices/` | Microsoft tax invoice PDFs |

## Related systems

- **Lark Tech Base** (`OTjWbsC3JaqH3ms1tmDlYraGgNe`): rollout tracker table
  `tblbhm9qVI0GNxuK` ("Windows 11 Pro & Entra Onboarding") and Device & Asset Tracker
  `tblVINk4aagWJafd` — the live per-person/per-device state.
- **Mosyle** (free tier): holds the iPhones. Macs go to Intune — macOS allows one MDM
  only, and Mosyle cannot feed compliance state to Entra Conditional Access.
- **Staff-facing policy layer**: `portal/src/device-access-admin-training.html` (admin)
  and `portal/src/device-management-training.html` (staff).

## Hard rules

- Licences are assigned **to the group, never to individuals**. Adding a person to
  `Koocester - Device Onboarding` grants Entra ID P1 + Intune Plan 1 automatically.
- Set **Usage location** on every new user before expecting licences to apply.
- Create single users manually in the portal — the bulk CSV flow fails silently.
- **No product keys, passwords, or recovery keys in this repo** (see
  `docs/15-security-and-secrets.md`). Keys live with Faiz / Bitwarden; recovery keys in
  the owner's Microsoft account.
