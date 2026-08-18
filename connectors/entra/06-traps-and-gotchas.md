# 06 — Traps & gotchas

Every one of these was hit at least once during the rollout. Do not rediscover them.

| Trap | What happens | Fix |
|---|---|---|
| **Connect vs Join** | The big "Connect" flow only *registers* — device unmanaged, no "Other user" at the lock screen | Use the small **"Join this device to Microsoft Entra ID"** link |
| **Home + activate-only key** | `0xc004f050` — looks like a dead key | Two-step: generic edition-change key offline first (`02-windows-runbook.md`) |
| **Licences after join** | Devices join fine but never auto-enrol into Intune | Buy and assign licences **first** |
| **Usage location missing** | Licence assignment silently fails; user lands under "Members without licences" | Set Usage location on every user at creation |
| **Bulk CSV for one user** | File stages, shows "uploaded successfully", Submit never fires | Users → Add a user, manually |
| **Intune macOS list lags** | Shows 0 while the Mac is enrolled | Trust **Entra → Devices** |
| **APNs missing/expired** | "Account not onboarded" on Mac profile download | Set up / renew the push certificate — same Apple ID, every 12 months |
| **OneDrive online-only files** | Placeholders die when the account is removed | "Always keep on this device" + solid ticks first |
| **Known Folder Move** | Desktop/Documents stranded in OneDrive; user sees empty desktop | Stop backup and move contents back before unlinking |
| **Deleting profile in Explorer** | Registry entries left behind | `sysdm.cpl` → User Profiles → Delete |
| **Group licences via Entra portal** | Entra claims it is M365-admin-only | Assign at **admin.cloud.microsoft → Billing → Licenses** |
| **Hand-me-down machines** | BitLocker recovery key escrowed to the *previous owner's* personal account | Identify the original owner before removing accounts |
| **Empty desktop panic** | First Entra sign-in creates a fresh profile; user thinks their files are gone | Warn beforehand; old profile is untouched (`04-profile-migration.md`) |

## Admin portals under browser automation

Learned the hard way, twice:

- The **Entra admin center is unusable for writes under automation**: blade content
  lives in cross-origin iframes that swallow synthetic clicks and typing — the
  Create-user blade, list search boxes, column sorts and inner list scrolling all
  fail. Reads via screenshot of the first screenful work; nothing else is reliable.
- The **M365 admin center (`admin.cloud.microsoft`) automates well** — accessibility
  tree works, form fields settable, wizards clickable. Use it for user creation,
  group membership, licence checks (user flyout → Devices tab shows per-person
  enrolment), and billing/invoice downloads.
- Bulk imports (CSV upload) are impossible in either portal under automation — the
  file input opens a native OS picker. Do them by hand, or better, not at all (see
  bulk CSV trap above).

## Passwords

- The CSV-created batch (most of the original 19) shared one initial password that
  was **not** force-changed by the portal. Mitigation: each user changes it at first
  sign-in on the machine (Ctrl+Alt+Del → Change a password), which writes to Entra.
  **Confirm-all-changed is still an open item** — until then, "Require MFA to
  register or join devices = No" + "users may join = All" means a guessed credential
  could join a rogue device.
- Accounts created from 18 Aug onward (Sarah) use the M365 wizard's auto-generated
  password with forced change at first sign-in — the shared-password problem does not
  apply to them. Create all future accounts this way.
