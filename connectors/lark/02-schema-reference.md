# Lark — Schema Reference

Videos = **107 fields**, Carousels = **63 fields** (pulled live this session). This captures the **load-bearing fields by function** and the exact stage/button sets; regenerate the full list with `bitable_v1_appTableField_list` (see [README](README.md)).

## Videos — `tbl8wIByJQwhIUei`
| Function | Field | id | Type |
|---|---|---|---|
| Identity | Video ID (`VID-####`) / Video Title (formula) | `fldxdr9y7A` / `fldr2OOB00` | AutoNumber / Formula |
| **Stage** | Video Stage | `fldoWWWmFe` | SingleSelect |
| SLA | Lead Time / Time Left / Overdue | `fld7O5g5nI` / `fldzaR7bnz` / `fldLpjT3sz` | Formula |
| SLA clock | Last Video Stage Updated | `fldTG6p5XW` | ModifiedTime |
| Aging | Content Age (days) / Content Stale | `fldlrUTIto` / `fldWaJexTJ` | Formula |
| Edit SLA | Editing Started At / Edit Deadline / Editing Time Left | `fldLQ979ZE` / `fldIuS1uIe` / `fldaRo5QbU` | Date / Formula |
| Roles | Producer / Strategist / Video Editor / SMM | `fldbaf4e8R` / `fldsm8LLGV` / `fldFcP4tCz` / `fldVl7tNyS` | User |
| Approvers | Head of Growth / Head Video Editor (organic) | `fldDT7nlmS` / `fldLIixeqV` | User |
| Links | Page / Project / Carousels | `fld0JVDqxo` / `fldwxszgsk` / `fldrj7oNoZ` | Link |
| Derived | Vertical / Country | `flduw4nmvv` / `fldja7PvUH` | Formula / Lookup |
| **Join keys** | IG / TikTok / FB Post URL | `fldZxyvqmP` / `fldiYuUfub` / `fldsQXtOXW` | Url |
| Publish | Actual Upload Date / Posted Flag | `fldXcWTwtD` / `fldcXgBgZp` | Date / Formula |
| Lead magnet | Manychat Status / Lead Magnet Library | `fldUvcwdig` / `fldbPcxrns` | Select / Link |
| Targets | Lead / View / Community / Attendance Target | `fldJQWYgO3` / `flddJeQNQc` / `fldjAEkvOO` / `fldiaEmO8V` | Number |

**`Video Stage` options:** Not Started · Sourcing · Approval · Planning · Ready to Shoot · Ready to Edit · Editing · Strategist QC · Amendments Needed · Amendments (Marketing) · Final Approval (Marketing/Client) · Ready To Upload · Completed · On Hold · To Reupload · Rejected/DO NOT POST · Taken Down · Rejected Contact.

**Buttons (type 3001):** Storyboard Done, Approve QC, Request Amendment, Approve to Plan, Reject to Plan, Approve/Reject Organic, Shoot Done?, Submit/Resubmit Video, Approve to Upload, Confirm all Uploaded, Start Editing, ManyChat built, Request Changes, Add to Producer Calendar, Submit Entry, Confirm Submission, Resubmit Contact.

## Carousels — `tblnMZctdGYfXjYL`
| Function | Field | id | Type |
|---|---|---|---|
| Identity | Carousel ID (`CAR-####`) / Title | `fldFmGTusN` / `fldsJXyiXn` | AutoNumber / Formula |
| **Stage** | Carousel Stage | `fldzQLk4Wf` | SingleSelect |
| SLA | Lead Time / Time Left / Overdue | `fldsMb1cEi` / `fld2VdNvrI` / `fld7sdkDnl` | Formula |
| SLA clock | Last Carousel Stage Updated | `fldgwWfX7s` | ModifiedTime |
| Aging | Content Age / Content Stale | `fldGOuRqdy` / `fld5KNFK0G` | Formula |
| Roles | Copywriter / Content Strategist / SMM | `fldENRIYR0` / `fld2U8TND2` / `fldWCvJeGk` | User |
| Approver | Head Copywriter (Approver) | `fldF7z0YNB` | User |
| Links | Source Video / Project / Page | `fldmHyq4cS` / `flddBtSzDS` / `fldKhXJh3x` | Link |
| **Join keys** | IG / TikTok / FB Post URL | `fldTBz2xW1` / `fldz2haE2O` / `fldNMTO4y5` | Url |
| Publish | Actual Upload Date / Posted Flag | `fldzHuIU1H` / `fldbITNavZ` | Date / Formula |
| Design | Canva Link / Article Source | `fldV6jdXXd` / `fldGCcxuVu` | Text / Url |

**`Carousel Stage` options:** Not Started · Pending Copywriting · Copywriting · Amendments Needed · Final Approval (Head Copywriter/Client) · Ready to Upload · Completed · On Hold · To Reupload · Reject/DO NOT POST · Taken Down.

**Buttons:** All Uploaded, ManyChat Built, Reject Carousel, Submit/Resubmit Carousel, Approve Carousel, Send to Copywriter, Start Copywriting.
