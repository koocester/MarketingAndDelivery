---
title: Koocester Academy — curriculum map (what each role goes through)
type: reference
created: 2026-07-09
updated: 2026-07-19
tags: [training, onboarding, academy]
---

# Koocester Academy — curriculum map

Roles are **assigned, not chosen**. A person signs in, the Academy reads their role, and their path loads. Nobody picks a character.

The path: **Foundations (everyone)** → **their role modules** → **leadership layer** if they manage people → **Command Track** when they rise.

This file describes what is actually live. It is generated from the same arrays the Academy ships, so it stays true.

**Source of truth:** Lark HR base `Academy Role` field. **Employment status:** HR base `Active?`. **Sync:** n8n `Academy Role Sync (nightly)`, `gZOLjKFdpogOiT8f`, 3:15am SGT.

---

## Foundations — every role, 13 modules

Everyone goes through all thirteen before anything role-specific. All are built.

| # | Module | File |
|---|--------|------|
| 1 | Company and values | company-values-training.html |
| 2 | Brand guideline | brand-guideline-training.html |
| 3 | Tools and accounts | tools-accounts-training.html |
| 4 | Policies, leave and compliance | policies-compliance-training.html |
| 5 | Your first 90 days | first-90-days-training.html |
| 6 | Offboarding and handover | offboarding-handover-training.html |
| 7 | Rewards and consequences | rewards-consequences-training.html |
| 8 | Communication and meetings | communication-meetings-training.html |
| 9 | One-to-ones | one-to-ones-training.html |
| 10 | Security and IT access | security-it-access-training.html |
| 11 | The org and who to ask | org-who-to-ask-training.html |
| 12 | Working AI-native | how-we-use-ai-training.html |
| 13 | Company devices | device-management-training.html |

---

## Role paths (Foundations + these)

| Role | Slug | Adds |
|------|------|------|
| Marketing coordinator | `mc` | How the base works · Marketing coordinator · Offer creation · Landing pages · Amending videos · Storytelling · Reading your dashboard |
| Content strategist | `cs` | How the base works · Content strategist · How to storyboard · Storytelling · Poppy AI · Offer creation · Landing pages · Amending videos |
| Producer | `producer` | How the base works · Producer · Sourcing and networking · How to shoot · How to storyboard · Storytelling |
| Social media manager | `smm` | How the base works · Social media manager · Lead flow and community · Storytelling |
| Copywriter | `copywriter` | How the base works · Copywriter · Captions and carousels · Storytelling · Offer creation |
| Video editor | `videoeditor` | How the base works · Video editing the Koocester way · Editing fundamentals · CapCut · How to storyboard · Storytelling · Amending videos |
| Events | `events` | How the base works · Events |
| Community manager | `community` | Community manager · Lead flow and community · Events · Storytelling |
| Trainer | `trainer` | Storytelling · Offer creation · Events · Discovery and qualifying |
| Tech | `tech` | How the base works · Tech maintainer · Automations and AnyCross · n8n and integrations · Automations and monitoring · Device and access administration |
| Sales | `sales` | Sales · The 7-step sales process · HubSpot · Storytelling · Discovery and qualifying · Closing and handoff |
| Finance | `finance` | Finance · Xero · Aspire · Reading your dashboard |
| HR | `hr` | HR · Admin · Performance management and PIP |
| Customer success | `cssuccess` | Customer success |
| Manager | `manager` | How the base works · Leading the Koocester way · The coaching rhythm |
| Head of Department | `hod` | How the base works · Leading · Coaching · Department strategy · Owning a P&L |
| C-Suite | `csuite` | Leading · Coaching · Vision and direction · Capital and growth · Org design and culture · Building a scalable company |

---

## Leadership layer — granted on top, it does not replace the role

A manager keeps their own craft curriculum and **adds** the leadership modules. Thaddeus stays a Producer and gains Leading plus Coaching.

Source: two Lark groups. **Manager Updates** = every manager and HOD. **Koocester Management** = the HODs, except Rina who is a manager.

- **Managers (5):** Thaddeus, Sari, Iman, Rina, Fa-aiz → Leading, Coaching
- **HODs (4):** Mike, Mishkat, Cheryl, Bhavani → Leading, Coaching, Department strategy, Owning a P&L
- Hakim is C-Suite, not HOD.
- Mike additionally holds the Marketing coordinator modules by grant.

---

## Gating

- A person can open their Foundations, their role modules, and anything granted to them. Nothing else.
- The gate lives in `koo-auth-guard.js`, so it covers **every deck**, not just the hub. Hiding a tile is not a gate.
- It gates only files the database lists in `academy_decks`, so non-training pages are never stranded.
- **It fails open when the database is unreachable.** A network fault must never block training. This is a routing and focus mechanism, not a security boundary. Confidential material does not belong behind it.

---

## Retraining

Each deck carries a version in `academy_decks`. Bump a version and that deck returns to everyone's outstanding list. Nine decks currently sit above version 1.

The portal shows **what is outstanding**, never a completion count.

---

## Not in any curriculum

- **`how-we-use-lark-training.html`** — removed from the Academy 2026-07-19 by Hakim. Still gated so the URL stays blocked. Not deleted.
- **`sales-admin-training.html`** — built, gated, versioned, reaches nobody. Open question: attach to Sales, or remove.

---

## Still to build

- **Teaching and facilitation** — the one real gap in the Trainer path. A Growth Academy trainer needs it and it does not exist.
- **Manager track depth** — Managing people, Running your team in the base, Performance and growth conversations, Hiring and onboarding your team, Manager's offboarding playbook.
- **Head of Department depth** — Budget and resource ownership, Reporting up and cross-department coordination.
- **Offboarding for the leaver** — exit checklist, knowledge handover, exit interview.

---

## What changed on 2026-07-19

The previous version of this file said Foundations was six modules and listed "Welcome and your first week", which has no file. It was written on 9 July when only two Foundations were live. The code had moved on and this document had not. Rewritten against what actually ships.

Related: [[mnd-training-base-structure]], [[academy-build-state]], [[staff-portal-live]]
