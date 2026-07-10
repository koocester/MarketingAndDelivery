# ⭐ End-to-End Workflow — M&D Base → Dashboards

**This is the core document.** Everything else in this folder is reference; this explains how the Marketing & Delivery base actually *works* and, most importantly, **how it connects to the dashboards at the end.**

One sentence: *content is created and driven through a stage pipeline in the Lark base; operational dashboards read that base live, and performance dashboards are fed from the base's **Post-URL fields** out through Metricool → n8n → Supabase → Metabase.*

---

## The whole flow at a glance

```mermaid
flowchart TB
  subgraph BASE["🗂️ Marketing & Delivery base (Lark) — the workflow lives here"]
    P["Project created"] -->|AnyCross fan-out<br/>(idempotent by link-count)| V["Videos + Carousels spawned<br/>auto-assigned from Page defaults"]
    V --> STAGE["STAGE PIPELINE (stage-gated buttons + SLA clocks)<br/>Not Started → … → Ready to Upload → Completed"]
    STAGE -->|SMM posts| PUB["Publish:<br/>Actual Upload Date + POST URLs (IG/TikTok/FB)<br/>Stage → Completed, Posted Flag = 1"]
  end

  PUB -->|the POST URL is the JOIN KEY| MC["Metricool tracks each post"]

  subgraph PATHA["Path A — OPERATIONAL (live read, no pipe)"]
    LARKDASH["Lark-native dashboards<br/>Ops Health & per-market"]
    CMD["n8n Command dashboard<br/>+ CEO/Weekly/Monthly briefs"]
    VERCEL["Vercel carousel dashboard"]
  end

  subgraph PATHB["Path B — PERFORMANCE (synced)"]
    N8N["n8n Metricool syncs<br/>(cron 07–09h)"] --> SUPA["Supabase content_perf<br/>reels + metricool_snapshots"] --> META["Metabase<br/>CEO(67) + Content(100)"]
  end

  BASE -->|read live| LARKDASH
  BASE -->|n8n queries base| CMD
  BASE -->|server-side token read| VERCEL
  MC --> N8N
```

---

## Step by step

### 1. Creation & fan-out (work enters the base)
A **Project** is created → **AnyCross** fans out and spawns/links its **Videos** and **Carousels** (idempotent by link-count, only-when-empty guards). Each new record **auto-assigns its roles from the Page** (Producer, Strategist, Editor, SMM, approvers / carousel Copywriter, Head Copywriter). Records are born **Not Started** (client videos at **Planning**).

### 2. The stage pipeline (the workflow engine)
Each record advances through its stages via **stage-gated buttons** (a wrong-stage click silently no-ops). Every stage has an **SLA clock** (`Lead Time` → `Time Left` → `Overdue`); scheduled scans nudge on breaches. See [03-pipelines-and-sla.md](03-pipelines-and-sla.md).
- Video: `Not Started → Sourcing → Approval → Planning → Ready to Shoot → Ready to Edit → Editing → Strategist QC → (Amendments) → Final Approval → Ready To Upload → Completed`
- Carousel: `Not Started → Pending Copywriting → Copywriting → (Amendments) → Final Approval → Ready to Upload → Completed`

### 3. Publish — where the workflow produces the KEY
When the SMM posts, they fill **Actual Upload Date** and the **Post URLs (Instagram / TikTok / Facebook)**, and the stage goes **Completed** (`Posted Flag = 1`). **The Post URL is the single most important field for the dashboard connection** — it is the **join key** that ties this operational record to its published performance.

### 4. The connection to dashboards — two paths

**Path A — Operational dashboards read the base LIVE (no pipeline to build):**
- **Lark-native Base dashboards** (Ops Health & Bottlenecks, per-market) read the base directly → stage counts, bottlenecks, workload, publish queue. Real-time.
- **n8n Command dashboard** and the **CEO/Weekly/Monthly briefs** query the base for ops/team-load and bottleneck counts.
- **Vercel app** reads the base server-side (tenant token) for the live carousel view.
> These need nothing but the base itself — the data *is* the operational state.

**Path B — Performance dashboards are FED from the base via the join key:**
1. The **Post URL** filled in step 3 identifies the post in **Metricool**.
2. **n8n Metricool syncs** (cron 07:00–09:00 SGT) pull followers + per-reel metrics.
3. They land in **Supabase** `content_perf` (`reels`, `metricool_snapshots`).
4. **Metabase** (CEO Dashboard 67, Content Performance 100) reads Supabase → the performance dashboards.
> The base doesn't push metrics; it provides the **key** (the Post URL) that lets Metricool→Supabase→Metabase attribute performance back to the exact video/carousel.

---

## Why this is the whole game
- **Keep the Post-URL fields filled** (the must-fill yellow standard) — an empty Post URL breaks the join, and Path B silently loses that piece's performance. This is the operational reason behind the coloring sweep. See [06-conventions-and-gotchas.md](06-conventions-and-gotchas.md).
- **Operational vs performance are two different questions with two different homes:** "where is work stuck?" → the base + Lark dashboards (live). "did it produce leads/views?" → Metabase over Supabase (synced).
- If a **dashboard is wrong**, trace it back along its path: Lark dashboards → the base records; Metabase → Supabase → the n8n Metricool sync → the Post URL on the base record.

## Deep dives (the exact, rebuildable mechanics of each hop)
- **How the base was built** (sources → migration → base): [../../docs/discovery/build-provenance.md](../../docs/discovery/build-provenance.md)
- **Metricool → Supabase sync** (column-by-column, rebuildable): [../../supabase/metricool-sync-mapping.md](../../supabase/metricool-sync-mapping.md)
- **How briefs & the Command dashboard read the base** (per-workflow): [../../n8n/how-briefs-and-command-read-the-base.md](../../n8n/how-briefs-and-command-read-the-base.md)

Cross-refs: [../../docs/05-architecture.md](../../docs/05-architecture.md), [../../docs/07-supabase-setup.md](../../docs/07-supabase-setup.md), [../../docs/08-metabase-setup.md](../../docs/08-metabase-setup.md), [../../docs/10-dashboard-setup.md](../../docs/10-dashboard-setup.md).
