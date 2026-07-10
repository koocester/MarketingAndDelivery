# Build Provenance — How the M&D Base Was Constructed

The paper trail of how the live **Marketing & Delivery** base (`BG8PbaZFna1NQksNWkglTN85gSf`) came to exist — the source systems, the migration method, and the verified result. This is history (the migration completed **2026-07-02/03**); it explains *why the base looks the way it does* and how to reason about legacy records.

> Reconstructed from the migration records. Source-base tokens/field IDs are identifiers, not secrets.

## Source systems (where the data came from)
| Source | Token / location | Migrated into |
|---|---|---|
| **Marketing base** (PRIMARY) | `ClxtbgreEaGMRMsBeYul8TOrglg` — Video Tracker `tblBYFqYku8h6H87`, Copywriter Tracker `tblEI3GTiCEZVAPd`, Project Mgmt, Client Account Manager, Deals, Leads | Videos, Carousels, Clients |
| **SMM base** | (Pages Tracker, Carousel Tracker, Project Fulfillment) | Pages (key parent), Carousels (merge) |
| **Google Sheet "PAID CAMPAIGN TRACKER"** | id `1e16tUFL3-OdN1Hh4mCF0ICuMV9v_bQFfkflQKGBIsT4`, tabs MY/SG/SG2025/ID | Projects (authoritative) |
| **Events base** | commercial/attendance | Clients (merge), later Events tracker |
| **Metricool / HubSpot** | — | Not hand-migrated — wired as live feeds |

## The staging method (how the migration ran safely)
1. **Staging base** — "Migration Map — Koocester (review)" `SKcdbyyBAaHHrlsvOyclSpRVgge` with STAGING·Videos / ·Carousels / ·Projects tables (all plain text = raw buffer; normalise on import).
2. **`Source Ref`** on every staged row (`VID-####`, `SHEET-MY-*`, etc.) = the idempotency key so re-runs never duplicate.
3. **Pages migrated FIRST** so video/carousel Page links resolve.
4. **The CSV trick** — the old Video Tracker "Status" was a Stage field (type 24) that returns **empty via API and via formula**. Solution: export the table to CSV (Stage exports as text), then join CSV↔API by a composite key (Frame.io / raw link / title) to recover each record's stage. Same trick works for the Google Sheet: `curl ".../gviz/tq?tqx=out:csv&sheet=<TAB>"` returns a link-accessible sheet as CSV with no browser.
5. **Bulk create via a Workflow** — agents read payload slices and call `appTableRecord_create` verbatim; **idempotency via `params.client_token` (uuid per record)** so agent retries double-report but table totals stay exact.
6. **Automations OFF during load**, re-enabled at the Monday briefing after a manager check.

## Verified result (real run, 2026-07-02/03)
**207 clients · 366 projects · 324 videos · 262 carousels — 0 failures.** Idempotency held (zero duplicates despite retries).

## Post-migration cleanup (2026-07-04)
- **68 empty carousel shells deleted** (dedup — content already present in the real carousels; root cause = the two pre-load purges hadn't run).
- **85 video shells created** for 30 projects short of their Video Deliverables target (born Not Started; safe re: fan-out since it's edge-triggered on *new* projects).
- **30 Ad Boost rows** created from the sheet's boost columns.

## Key migration decisions (so legacy data makes sense)
- **Scope = 298 migrate-active videos** (of 2,001 total in the old tracker) — flagged by `✅ Migrate (active)`. Archived source videos were intentionally left behind (so ~92 old carousels have no source-video link — expected).
- **Projects = Google Sheet, MY + SG2025 tabs** (SG2025 chosen over SG; ID empty). The Lark "Project Management" table was an internal dept tracker, **not** the projects.
- **Producer = record CreatedUser** (may differ from true shooter); Editor/Copywriter/SMM resolved live from source **User** fields (staging text had dropped identities). **SMM = Talulla** across carousels.
- **Default Objective = Lead Generation** where blank; **project owners defaulted to Mike**, reassigned per salesperson later.
- **Leads NOT imported;** contacts only where PDPA consent ticked.
- **Historical video↔project links** are not auto-tieable (organic content had no project key); going forward the fan-out links them on creation.

## Full lineage (source → base → dashboard)
```
Marketing/SMM bases + Google Sheet
        │  (staging + Source Ref + CSV-status trick + client_token idempotency)
        ▼
   M&D Lark base  ──live read──────────────►  Lark dashboards / n8n Command / Vercel app
        │  (Post-URL join key)
        ▼
   Metricool ─► n8n sync ─► Supabase content_perf ─► Metabase dashboards
```
See the live end-to-end workflow: [../../connectors/lark/00-END-TO-END-WORKFLOW.md](../../connectors/lark/00-END-TO-END-WORKFLOW.md).
