# 03 — macOS onboarding runbook

Macs **cannot Entra join**. The correct end state is Entra **registered** +
**Intune-enrolled** — that combination feeds Conditional Access. "Registered, not
Joined" in the device list is success, not failure.

Prereq: APNs certificate in place (done 14 Aug 2026 — renewal trap in
`01-tenant-and-licensing.md`), user in the licensing group with
**Assigned licenses: 2**.

## Before starting

1. If the Mac is enrolled in **Mosyle**, un-enrol it there first — **macOS allows
   exactly one MDM**. Check on the Mac: System Settings → General → Device Management.
2. Have the user's Entra password ready (reset it in the admin center if unknown —
   new accounts force a password change at first sign-in, which is fine).
3. The user needs their **Mac's own local admin password** for the profile install.

## Steps on the Mac

1. Download **Company Portal for macOS**:
   ```
   https://go.microsoft.com/fwlink/?linkid=853070
   ```
2. Install and open it.
3. Sign in as `name@koocester.com`.
4. Company Portal walks through enrolment and downloads a **management profile**.
5. **System Settings → Privacy & Security → Profiles → open the downloaded profile →
   Install.** The Mac prompts for its local admin password.

   ⚠️ **Step 5 is where macOS enrolments stall.** Company Portal reports success
   while the profile sits in Downloads uninstalled. Watch the user actually click
   Install — do not take Company Portal's word for it.
6. Back in Company Portal the device shows as registered.

## Verify

- On the Mac: System Settings → General → Device Management lists a **Microsoft
  Intune management profile**.
- **Entra → Devices**: the Mac appears with OS **MacMDM**, Join type **Microsoft
  Entra registered**, MDM **Microsoft Intune**.
- **Do not** conclude failure from Intune → Devices → macOS showing 0 — that list
  lags badly. **Trust Entra.**

## Error signatures

- **"Account not onboarded"** during profile download = the APNs certificate is
  missing/expired. (Resolved 14 Aug 2026; this is what it looks like if the July 2027
  renewal is missed.)

## Why Intune for Macs and not Mosyle

Mosyle is genuinely better at macOS (FileVault escrow, OS update enforcement, DEP,
app deployment). But Mac users already hold paid Intune licences, and **Mosyle cannot
feed compliance state to Entra** — the moment Conditional Access requires a compliant
device, a Mosyle-managed Mac is locked out. Decision: **Macs go to Intune; iPhones
stay in Mosyle.**
