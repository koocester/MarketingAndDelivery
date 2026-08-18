# Device onboarding — Windows 11 Pro + Entra join + Intune

Moving staff laptops off personal Microsoft accounts onto company-managed identities:
Home → Pro upgrade, Entra **join** (Windows) or Entra **register** (macOS — Macs cannot
join), Intune enrolment via auto-enrol, then profile migration off the personal account.

Live per-person state: Lark Tech Base → "Windows 11 Pro & Entra Onboarding"
(`tblbhm9qVI0GNxuK`). This file records the process and the traps, not the day-to-day
tick-list.

## State as of 18 Aug 2026

- **Indonesia (15 + Faiz):** all Entra-joined and Intune-managed except **Mabdi** (last
  Windows machine outstanding). Okky is on a Mac — registered + Intune-enrolled, which
  is the correct Mac end state.
- **Malaysia:** accounts exist for Thaddeus, Rina, Bhavani, Mishkat, Zainab (created
  14 Aug); **Sarah created 18 Aug (CR-20260818-01)** — licensed via the group, her Mac
  enrolment is the next step. No Malaysia devices have been touched; Home-vs-Pro is
  unconfirmed for the four Windows machines.
- **Out of scope, decision owed:** Amrel, Mike.
- **Profile migration on the 14 Indonesia machines: NOT started.** This is the
  data-loss-risk phase — see the OneDrive section below before touching anything.
- Intune auto-enrolment verified ON (MDM user scope = All). Apple MDM Push (APNs)
  certificate set up 14 Aug 2026 — **expires every 12 months and must be renewed with
  the same Apple ID**, or every enrolled Apple device drops out with no recovery path.

## Windows runbook (per machine)

1. `winver` must say Pro. Home machines need the two-step edition change first
   (generic Pro key offline, then the purchased activate-only key — keys live with
   Faiz, not in this repo).
2. `manage-bde -status` — if Protection On, save the recovery key from the **personal**
   Microsoft account *before* removing it, or the disk can be permanently lost.
3. Settings → Accounts → Access work or school → Connect → **click the small "Join this
   device to Microsoft Entra ID" link**. The big Connect box only *registers* the
   device — unmanaged, no "Other user" at the lock screen.
4. Sign in as `name@koocester.com`, confirm org = Koocester Group, restart.
5. Lock screen → Other user. First profile creation takes 5–10 min and lands on an
   empty desktop — warn the user beforehand.
6. Verify with `dsregcmd /status` → `AzureAdJoined : YES`. Registered-only shows
   `WorkplaceJoined : YES` — redo the join.

## macOS runbook

1. Confirm the account is in the licensing group and shows **Assigned licenses: 2**.
2. If the Mac is in Mosyle, un-enrol it there first — **macOS allows one MDM only**.
3. Install Company Portal, sign in, download the management profile.
4. **System Settings → Privacy & Security → Profiles → Install** — this is where
   enrolments stall; Company Portal claims success while the profile sits uninstalled.
5. Verify in **Entra → Devices** (OS MacMDM, Join type Registered, MDM Intune).
   "Registered" is correct for a Mac. The Intune macOS device list lags — trust Entra.

## Profile migration (not started)

Entra join creates a **new empty profile**; nothing is deleted, but the machine looks
factory-reset. Before unlinking any personal Microsoft account:

1. OneDrive → Stop backup (Known Folder Move) on Desktop/Documents/Pictures and move
   the contents back to the local folders.
2. Right-click the OneDrive folder → **Always keep on this device**; wait for solid
   ticks. Online-only placeholders die when the account is unlinked.
3. Unlink the PC, copy data somewhere company-owned, then migrate the profile —
   ForensiT User Profile Wizard (Professional, per-technician licence) re-points the
   existing profile; manual copy (no AppData) is the free fallback.
4. Delete old profiles via `sysdm.cpl` → User Profiles, never File Explorer.

## Traps (all hit once already — do not rediscover)

| Trap | Fix |
|---|---|
| Connect vs Join | Use the small "Join this device" link |
| Home + activate-only key → `0xc004f050` | Two-step edition change first |
| Licences after join → no auto-enrol | Licence **before** joining devices |
| Missing usage location → silent licence failure | Set it on every user |
| Bulk CSV for one user → Submit never fires | Create manually |
| Intune macOS list shows 0 | Trust Entra → Devices |
| OneDrive online-only files | "Always keep on this device" first |
| Entra admin portal under browser automation | Blade iframes swallow input — use the M365 admin center (`admin.microsoft.com`) instead |

## Open security items

- Require MFA to register/join devices = **No**; users may join = All; registering user
  becomes local admin; LAPS disabled.
- CSV-created users shared one initial password that was not force-changed — being
  cleaned up person-by-person; new accounts (Sarah onward) are created with
  auto-generated passwords + forced change at first sign-in.
- Stanley's laptop is a hand-me-down from Aji Satria — if Device Encryption was on,
  the recovery key is in **Aji's** personal account.
