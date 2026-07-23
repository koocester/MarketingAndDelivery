# QA Report — Revision 1 (fresh-context independent review)

Verdict: NEEDS_REVISION. No blockers. 4 MAJOR, 8 MINOR.

| ID | Sev | Finding (condensed) | Required change |
|---|---|---|---|
| QA-001 | MAJOR | `fldTG6p5XW` cited in package §11/§15 but absent from the discovery snapshot; traceability claim false | Add the field to the snapshot with live evidence, or mark UNVERIFIED |
| QA-002 | MAJOR | Brief §10/§12 music/footage IP clearance and sensitive-content flagging mapped nowhere | Matrix row + template flags + W1 self-check gate |
| QA-003 | MAJOR | PatternProvider fallback mode (3) has no pattern **read** path; pilot would block or violate brief §8 (never from taste alone) | Define mode-3 read behaviour (human-exported pattern snapshot, staleness flagged) |
| QA-004 | MAJOR | §7 "complete write surface" omits Poppy upload, fallback staging doc, ledger; contract D3 disagrees with package | Enumerate all write targets; reconcile D3 |
| QA-005 | MINOR | "§8.4 sequence" dangling reference | Own numbered subsection; fix references |
| QA-006 | MINOR | W2 missing Logging element (D7) | Add logging row |
| QA-007 | MINOR | Paid-video stop wording ambiguous (stop entirely vs draft without offer) | State exact behaviour and how §11 is satisfied |
| QA-008 | MINOR | Question set: "you may show the template" could be read as showing the GUIDE | Reword: storyboard output only, never the GUIDE SOP |
| QA-009 | MINOR | D5 evidence points to a consolidated prohibited-actions section that does not exist | Add the section |
| QA-010 | MINOR | Snapshot typo: garbled Auto-stamp workflow id | Correct line |
| QA-011 | MINOR | Concurrency lock exists only after doc creation; overlapping runs can duplicate docs/DMs | Pre-generation claim marker + single-concurrency setting |
| QA-012 | MINOR | Matrix rows R7, R14–R18, R21 lack section citations (D1 evidence) | Add citations |

Full findings narrative retained in the run log. Revision 2 must address all MAJORs; MINORs addressed in the same pass.
