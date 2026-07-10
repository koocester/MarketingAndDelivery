# Lark — Data Model

Base `BG8PbaZFna1NQksNWkglTN85gSf` — 19 tables. The settled model (do not re-derive):

## The core entities
| Table | table_id | Role |
|---|---|---|
| **Pages (link to Metricool)** | `tblUscIBwxElzzXi` | The 16 market×vertical handles. **Vertical + Country live HERE only.** Holds the default team per page. |
| **Projects (Delivery)** | `tblAJKbb2UZRh8rn` | A *harness* for one client deal's content. Carries **no** vertical and **no** page link itself. |
| **Videos** | `tbl8wIByJQwhIUei` | The video production pipeline (107 fields). |
| **Carousels** | `tblnMZctdGYfXjYL` | The carousel production pipeline (63 fields). |

Supporting tables: Clients, Content Calendar, Content Performance (Metricool link), Lead Magnet Library, Post Interview Contact, Ad Boosts, Business Units, and the People/roster — 19 total.

## The mental model
- **A Page is the unit of identity.** Vertical (Homes/Business/Autos/Wealth/Foodie/Main) and Country (SG/MY/ID/Regional) live on the Page. A Video/Carousel **inherits** vertical + country + default roles via its Page link.
- **A Project is just a container** for one client deal's content. It has no vertical/page of its own; a client's content can span multiple pages — that's normal.
- **Growth KPI is a Page×month number**, not a project number — and lead *targets break down by lead type* (the offer / lead-magnet level), not a flat "leads" count.
- **Working set = active only.** Not active → mark Completed; Completed lives in a Completed view, never the working table.

## Key field IDs (the load-bearing ones)
- Video Stage `fldoWWWmFe` · Carousel Stage `fldzQLk4Wf`
- Video Last-Stage-Updated `fldTG6p5XW` · Carousel Last-Stage-Updated `fldgwWfX7s` (both ModifiedTime — see gotchas)
- Video Project link `fldwxszgsk` · Carousel Project link `flddBtSzDS` · Page links `fld0JVDqxo` (video) / `fldKhXJh3x` (carousel)
- **Post-URL join keys** (to Supabase `content_perf`): Video IG/TikTok/FB `fldZxyvqmP`/`fldiYuUfub`/`fldsQXtOXW`; Carousel `fldTBz2xW1`/`fldz2haE2O`/`fldNMTO4y5`

## Integration role
The **six Post-URL fields** are the join keys linking a Lark content record to its published metrics in Supabase `content_perf`. Keeping them filled (the must-fill standard, see [06-conventions-and-gotchas.md](06-conventions-and-gotchas.md)) is what makes the analytics loop work. See [../../docs/07-supabase-setup.md](../../docs/07-supabase-setup.md).
