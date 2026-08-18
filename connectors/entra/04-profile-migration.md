# 04 — Profile migration off personal Microsoft accounts

Status: **not started on any machine.** Every joined Indonesia laptop still carries
the personal Microsoft account and its data. This is the phase where rushing destroys
data — read the OneDrive section before touching anything.

## The core problem

Entra join does not convert the existing profile. It creates a **new, empty** one:

```
C:\Users\<old name>     ← all their existing files, untouched
C:\Users\<new name>     ← new work profile, empty
```

Nothing is deleted, but to the user the machine looks factory-reset.

## THE ONEDRIVE TRAP — read before removing any personal account

Staff put company work into their **personal OneDrive**, tied to the personal
Microsoft account.

- With **Files On-Demand** on (the default), much of what looks like files in
  Explorer are **online-only placeholders**. Unlink or remove the account and those
  placeholders die. The real files remain in that person's personal cloud — which the
  company cannot access.
- Check **Known Folder Move**: if Desktop/Documents/Pictures live *inside* the
  OneDrive folder, KFM is on. Unlinking with KFM active strands the real files in the
  OneDrive folder while Windows points Desktop/Documents at fresh empty ones — the
  user sees an empty desktop and panics.

## Correct order, per machine

1. OneDrive → Settings → Sync and backup → Manage backup → **Stop backup** on
   Desktop, Documents, Pictures.
2. Manually move the contents back:
   ```
   C:\Users\<name>\OneDrive\Desktop\*    →  C:\Users\<name>\Desktop\
   C:\Users\<name>\OneDrive\Documents\*  →  C:\Users\<name>\Documents\
   C:\Users\<name>\OneDrive\Pictures\*   →  C:\Users\<name>\Pictures\
   ```
3. Right-click the OneDrive folder → **Always keep on this device**. Wait for solid
   green ticks everywhere — no cloud icons.
4. OneDrive → Settings → Account → **Unlink this PC**.
5. Copy the data somewhere company-owned (Google Drive).
6. Migrate the profile (below).
7. Settings → Accounts → Email & accounts → remove the personal Microsoft account.
8. Access work or school → confirm only Koocester remains.

## Migration options

**A. ForensiT User Profile Wizard — recommended for heavy users.** Re-points the
*existing* profile at the new Entra account: nothing copied, nothing left behind,
`AppData` survives (Chrome profile, Adobe presets, Sticky Notes). Licensing:
**Professional Edition is per technician** — one licence covers all machines done by
hand. Corporate Edition is per-workstation with a 50-licence minimum — wrong tier for
this fleet. The Freeware edition is home-use only — not legal on company machines.
Pricing: `https://shop.forensit.com/`. Sequence: Entra join → run as admin → select
existing profile → target the Entra account → reboot. **Back up or image the first
machine before trusting it** — it modifies the profile in place.

**B. Manual copy — free.** Copy Desktop, Documents, Downloads, Pictures, Videos from
old profile to new. **Never copy AppData** — it breaks app licensing and profile
state. Sign back into Chrome (bookmarks/passwords sync) and Adobe CC (presets sync).
Fine for copywriters/SMM/strategists; editors with heavy custom setups are the
ForensiT case.

## Deleting the old profile

**Not via File Explorer** — that leaves registry entries.

```
Win+R → sysdm.cpl → Advanced → User Profiles → Settings → select → Delete
```

If the old profile must go the same day, copy the whole folder to an external drive
first — satisfies "off the machine today" while keeping a rollback.

## Related security debt

Company data sitting in personal OneDrive accounts means leavers take files with them
and nothing can be revoked or retrieved. Migration closes this per-machine; until a
machine is migrated, treat its data as unprotected.
