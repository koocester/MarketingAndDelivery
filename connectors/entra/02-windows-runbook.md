# 02 — Windows onboarding runbook

Per-machine sequence for joining a Windows laptop to Entra and getting it
Intune-managed. Prereq: the user exists, is in the licensing group, and shows
**Assigned licenses: 2** (see `01-tenant-and-licensing.md`).

## Pre-flight

1. ```
   winver
   ```
   Must say **Windows 11 Pro**. Home cannot Entra join — do the edition upgrade below
   first.
2. ```
   manage-bde -status
   ```
   If **Protection On**, the Device Encryption recovery key is escrowed to the
   signed-in **personal** Microsoft account. Retrieve and save it from
   `account.microsoft.com/devices/recoverykey` **before removing that account**, or
   the user can be permanently locked out of their own disk. Hand-me-down machines:
   the key may be in the *previous owner's* account.
3. The user must be a **local administrator** or the join is never offered.

## Home → Pro edition upgrade (only if `winver` says Home)

The purchased keys are **activate-only** — they cannot change edition. Entering one on
a Home machine fails with `0xc004f050`; **that is expected, not a dead key.**

1. WiFi **OFF**
2. Settings → System → Activation → **Change product key**
3. Enter Microsoft's generic Pro edition-change key: `VK7JG-NPHTM-C97JM-9MPGT-3V66T`
   (public generic key — changes edition only, activates nothing)
4. Let it restart — **even if it shows an error**
5. Confirm it now reads "Windows 11 Pro". It will say Not active with `0x803fa067` —
   normal at this stage
6. WiFi **ON**
7. Change product key again → enter the **purchased** key (from Faiz) → Active

Verify the key is genuine:

```
slmgr /dlv
```

`Product Key Channel` must read `Retail` or `OEM`. `Volume:MAK`/`Volume:GVLK` = grey
market. Cross-check `Partial Product Key` against the assignment list.

## The join

```
Settings → Accounts → Access work or school → Connect
```

**Click the small link "Join this device to Microsoft Entra ID".**

Do **not** type the email into the big Connect box — that performs Entra
*registration*: SSO but unmanaged, and no "Other user" option at the lock screen.

Sign in as `name@koocester.com`, confirm the org reads **Koocester Group**, then
**restart**.

## First sign-in

Lock screen → **Other user** → `name@koocester.com` + their Entra password (reset it
in the admin center beforehand if unknown).

- First profile creation takes **5–10 minutes**.
- They land on an **empty desktop** — expected; their old files live in the old local
  profile untouched (see `04-profile-migration.md`). **Warn them beforehand** or they
  will panic.
- Have them change their password immediately: **Ctrl+Alt+Del → Change a password**.
  On an Entra-joined device this writes straight back to Entra.

Intune auto-enrolment then happens on its own — the device reports Compliant within
minutes. Verify in Entra → Devices.

## Diagnosing a failed join

```
dsregcmd /status
```

| Output | Meaning |
|---|---|
| `AzureAdJoined : YES` | Joined correctly |
| `AzureAdJoined : NO` + `WorkplaceJoined : YES` | Registered only — remove the work account and redo the join via the small link |
| All NO | Join never happened, or the machine is still on Home |
