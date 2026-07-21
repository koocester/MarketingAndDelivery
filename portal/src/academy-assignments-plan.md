# Academy role assignments — confirmed plan

Decisions from Hakim, 2026-07-19. This is the source list for populating
`academy_assignments` (email -> role_slug) in the portal Supabase
(lfppmsppvqtjyusfrlkf) via the n8n role sync.

RLS blocks inserts from the browser/anon key (42501). Writes must go through
n8n with the Postgres credential WAYd0ZoUy5xrkZGE.

## Confirmed assignments (15 of 17 profiles)

| Person | Email | Job title | role_slug |
|---|---|---|---|
| Hakim | ceo@koocester.com | Founder | csuite |
| Mike | mike@koocester.com | Head of Growth | mc |
| Shahrukh Ameer | shahrukh@koocester.com | Marketing | cs |
| Jaydon Choo | jaydon@koocester.com | Producer | producer |
| Jordan | jordan@koocester.com | Producer | producer |
| Thaddeus | thaddeus@koocester.com | Producer | producer |
| Cheryl | cheryl@koocester.com | Sales | sales |
| Akiel | akiel@koocester.com | Sales | sales |
| Ratnasari Cenreng | ratnasari@koocester.com | Copywriter | copywriter |
| Rina | rina@koocester.com | Customer Success | cssuccess |
| Faiz | faiz@koocester.com | Tech (IT) | tech |
| Talulla | tpradian@koocester.com | Social Media Manager | smm |
| Iman Arifin | imanarifin@koocester.com | Head Editor | videoeditor |
| Stanley Jayalie | stanleyjayalie@koocester.com | Video Editor - Autos | videoeditor |
| Zainab | zainab@koocester.com | Events | events |
| K. Bhavani Karupiah | bhavani@koocester.com | HR | hr |

## Missing profiles — cannot sign in until created

These people exist in the leaderboard/HR data but have NO row in `profiles`,
so they cannot log in and will get nothing on launch. Create the profile
first, then assign.

| Person | role_slug | Note |
|---|---|---|
| Wendi Amalia | cs | Content strategist. Currently number 1 on the leaderboard. |
| Maulana | videoeditor | Video editor. |

## RESOLVED 2026-07-19

- `finance@koocester.com` -> `finance`. Hakim confirmed Mishkat is finance.
  Add `full_name: Mishkat` and `department/role: Finance` to that profile
  while assigning, since the row currently has no name or department.

## How to actually create Wendi and Maulana (not a plain insert)

`profiles` is keyed by `id` = the Supabase **auth user id**, not by email
(see portal.html loadProfile: `.eq('id', userId)`). Their auth user does not
exist yet, so there is no id to insert against. A plain insert is not possible.

Login is `signInWithOtp` with `shouldCreateUser: true`, so **both can already
sign in today** and an auth user is created on first magic link. What they
lack is the `profiles` row, which is why they would land with no role.

Two workable paths:

1. Have each sign in once (creates the auth user), then the n8n sync upserts
   their `profiles` row by looking up auth.users by email with the service
   role, and sets department/role. Simplest, no admin API needed.
2. n8n calls the Supabase Admin API (`auth.admin.createUser`) to mint the
   auth user, then inserts `profiles` with that returned id.

## HR BASE CHECKED 2026-07-19 — hypothesis was WRONG, HR is fine

Employee Data (`KQp7bmn5WaztcZsILUalm4bjgOf` / `tbletkzlOHyUIzOX`) has both
people, both **Active**, both Status **Existing**:

| Person | Full name | Work email | Academy Role (already in HR) |
|---|---|---|---|
| Wendi | Amalia Wendiari Layzaputri | amalia@koocester.com | Content strategist |
| Maulana | Maulana Akbar | maul@koocester.com | Video editor |

They are missing from `profiles` only because their work emails are
`amalia@` and `maul@` and **they have never signed in**. A profiles row only
exists once someone authenticates. No HR fix needed.

### KEY: HR already carries an `Academy Role` field

Employee Data has an `Academy Role` column and it is populated and correct.
The role sync should read that field as the source of truth instead of a
hand-built mapping. Before writing assignments, validate the manual map
above against HR `Academy Role` for every employee. Where they disagree,
surface it rather than silently picking. Hakim asked for the two to tally.

## Root cause worth checking

The other 17 profiles were populated from the Lark HR roster sync
(see memory people-hr-base, n8n 8XEtLLl63t3oEhcq). Wendi and Maulana being
absent suggests they are missing from that HR source or filtered out by the
Active flag. Wendi is currently number 1 on the leaderboard, so the HR record
is likely wrong. Fix the HR source rather than hand-patching the portal, or
they will vanish again on the next sync.

## Admin / developer access

Hakim: "The extra access only goes to tech. They're supposed to see the
development and then just reassign."

So dev/admin view = founder (Hakim, is_admin already true) + Tech department
(Faiz). Note the earlier memory said "founder + Fa-aiz only", which agrees.

## Do not deploy until

`academy_assignments` is non-empty AND `academy_me` resolves a non-null row
for at least one real non-admin user. Deploying the gate with an empty
assignments table locks the entire company out, because `can()` returns
false for every curriculum deck when `assigned` is false.
