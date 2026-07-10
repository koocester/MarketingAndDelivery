#!/usr/bin/env python3
"""Generate a self-contained interactive dashboard from the SMM Carousel Tracker CSV."""
import csv, json, os

SRC = "SMM Carousel Tracker - Masterlist.csv"
OUT = "dashboard.html"

rows = list(csv.DictReader(open(SRC, encoding="utf-8-sig")))

def g(r, k):
    return (r.get(k) or "").strip()

records = []
for r in rows:
    title = g(r, "Carousel Title")
    if not title and not g(r, "Owner") and not g(r, "Status"):
        continue
    records.append({
        "title": title or "(untitled)",
        "type": g(r, "Type") or "—",
        "owner": g(r, "Owner") or "—",
        "page": g(r, "Page") or "—",
        "priority": g(r, "Priority") or "—",
        "date": g(r, "Upload Date (link via smm)"),
        "country": g(r, "Country") or "—",
        "status": g(r, "Status") or "—",
        "collab": g(r, "Collab With"),
        "canva": g(r, "Canva Link"),
        "frameio": g(r, "Frame IO Link"),
        "post": g(r, "Finished Post"),
        "source": g(r, "Carousel Source"),
    })

data_json = json.dumps(records, ensure_ascii=False)

TEMPLATE = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Koocester · SMM Carousel Dashboard</title>
<style>
  :root{
    --bg:#0f1115; --panel:#161a22; --panel2:#1b2029; --border:#262c38;
    --text:#e9ecf2; --muted:#98a2b3; --gold:#c9a25a; --gold-soft:#e7cf9b;
    --s-await:#f0b429; --s-rev:#ef5753; --s-ready:#5b8def; --s-fin:#2bb673; --s-down:#8a93a3;
    --shadow:0 8px 28px rgba(0,0,0,.35);
  }
  *{box-sizing:border-box}
  body{margin:0;background:radial-gradient(1200px 600px at 80% -10%, #1a2030 0%, var(--bg) 55%);
    color:var(--text);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased;padding:28px 30px 60px}
  h1{font-family:Georgia,"Times New Roman",serif;font-weight:600;font-size:26px;margin:0;letter-spacing:.2px}
  .sub{color:var(--muted);font-size:13px;margin-top:6px}
  .gold{color:var(--gold)}
  header{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:14px;
    border-bottom:1px solid var(--border);padding-bottom:18px;margin-bottom:22px}
  .badge{font-size:12px;color:var(--muted);border:1px solid var(--border);border-radius:999px;padding:6px 12px;background:var(--panel)}
  /* KPI */
  .kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px;margin-bottom:22px}
  .kpi{background:linear-gradient(180deg,var(--panel2),var(--panel));border:1px solid var(--border);
    border-radius:14px;padding:16px 18px;box-shadow:var(--shadow);position:relative;overflow:hidden}
  .kpi .v{font-size:30px;font-weight:700;line-height:1}
  .kpi .l{color:var(--muted);font-size:12px;margin-top:8px;text-transform:uppercase;letter-spacing:.6px}
  .kpi .bar{height:3px;border-radius:3px;margin-top:12px;background:var(--border);overflow:hidden}
  .kpi .bar>span{display:block;height:100%}
  /* grid panels */
  .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}
  .card{background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:18px;box-shadow:var(--shadow)}
  .card h3{margin:0 0 14px;font-size:13px;letter-spacing:.7px;text-transform:uppercase;color:var(--muted);font-weight:600}
  .col-4{grid-column:span 4}.col-6{grid-column:span 6}.col-8{grid-column:span 8}.col-12{grid-column:span 12}
  @media(max-width:980px){.col-4,.col-6,.col-8{grid-column:span 12}}
  /* bars */
  .row{display:flex;align-items:center;gap:10px;margin:9px 0;cursor:pointer;user-select:none}
  .row:hover .lab{color:var(--text)}
  .lab{width:160px;font-size:13px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:none}
  .track{flex:1;background:#0e1219;border-radius:6px;height:22px;position:relative;overflow:hidden}
  .fill{height:100%;border-radius:6px;transition:width .5s cubic-bezier(.2,.8,.2,1)}
  .num{width:34px;text-align:right;font-variant-numeric:tabular-nums;font-size:13px;color:var(--text);flex:none}
  .row.dim{opacity:.38}
  /* donut */
  .donutwrap{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
  .legend{font-size:13px;display:flex;flex-direction:column;gap:7px}
  .legend div{display:flex;align-items:center;gap:8px;cursor:pointer;color:var(--muted)}
  .legend div:hover{color:var(--text)}
  .dot{width:10px;height:10px;border-radius:3px;flex:none}
  /* filter chips */
  .chips{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 16px}
  .chip{background:var(--panel);border:1px solid var(--gold);color:var(--gold-soft);border-radius:999px;
    padding:6px 12px;font-size:12px;display:flex;gap:8px;align-items:center}
  .chip b{color:#fff;font-weight:600}
  .chip span{cursor:pointer;opacity:.7}.chip span:hover{opacity:1}
  .controls{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:8px}
  input[type=search]{background:var(--panel);border:1px solid var(--border);color:var(--text);
    border-radius:10px;padding:9px 13px;font-size:13px;min-width:240px;outline:none}
  input[type=search]:focus{border-color:var(--gold)}
  /* table */
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--border);vertical-align:top}
  th{color:var(--muted);font-size:11px;text-transform:uppercase;letter-spacing:.5px;cursor:pointer;position:sticky;top:0;background:var(--panel)}
  th:hover{color:var(--text)}
  tr:hover td{background:#10141c}
  .pill{font-size:11px;padding:3px 9px;border-radius:999px;white-space:nowrap;font-weight:600}
  .tlinks a{color:var(--gold);text-decoration:none;margin-right:8px;font-size:12px}
  .tlinks a:hover{text-decoration:underline}
  .muted{color:var(--muted)}
  .tablewrap{max-height:560px;overflow:auto;border-radius:10px}
  .empty{color:var(--muted);text-align:center;padding:30px}
  footer{color:var(--muted);font-size:12px;margin-top:26px;text-align:center}
</style>
</head>
<body>
<header>
  <div>
    <h1>Koocester <span class="gold">·</span> SMM Carousel Dashboard</h1>
    <div class="sub">Social-media carousel production tracker — live pipeline, workload &amp; publishing view</div>
  </div>
  <div class="badge" id="meta"></div>
</header>

<div id="chips" class="chips"></div>

<div class="kpis" id="kpis"></div>

<div class="grid">
  <div class="card col-8">
    <h3>Production pipeline · by status</h3>
    <div id="c-status"></div>
  </div>
  <div class="card col-4">
    <h3>By vertical (page)</h3>
    <div id="c-page" class="donutwrap"></div>
  </div>

  <div class="card col-4">
    <h3>Owner workload</h3>
    <div id="c-owner"></div>
  </div>
  <div class="card col-4">
    <h3>By country</h3>
    <div id="c-country" class="donutwrap"></div>
  </div>
  <div class="card col-4">
    <h3>By priority</h3>
    <div id="c-priority"></div>
  </div>

  <div class="card col-12">
    <h3>Carousels</h3>
    <div class="controls">
      <input type="search" id="q" placeholder="Search title, owner, source…">
      <span class="muted" id="tcount"></span>
    </div>
    <div class="tablewrap">
      <table id="tbl">
        <thead><tr>
          <th data-k="title">Title</th>
          <th data-k="page">Page</th>
          <th data-k="owner">Owner</th>
          <th data-k="country">Country</th>
          <th data-k="priority">Priority</th>
          <th data-k="date">Upload</th>
          <th data-k="status">Status</th>
          <th>Links</th>
        </tr></thead>
        <tbody id="tbody"></tbody>
      </table>
    </div>
  </div>
</div>

<footer id="foot"></footer>

<script>
const DATA = __DATA__;

const STATUS_ORDER = ["Awaiting Review","Needs Revision","Ready to Schedule","Carousel Finished","Taken Down"];
const STATUS_COLOR = {
  "Awaiting Review":"var(--s-await)","Needs Revision":"var(--s-rev)",
  "Ready to Schedule":"var(--s-ready)","Carousel Finished":"var(--s-fin)","Taken Down":"var(--s-down)","—":"#5b6270"};
const PALETTE = ["#c9a25a","#5b8def","#2bb673","#f0b429","#ef5753","#a77bd6","#46c4c4","#8a93a3"];

const state = {status:null, page:null, country:null, owner:null, priority:null, q:"", sort:"date", dir:1};

const parseDate = s => { if(!s) return null; const m=s.match(/(\d{2})\/(\d{2})\/(\d{4})/); return m? new Date(+m[3],+m[2]-1,+m[1]) : null; };
const fmtDate = s => { const d=parseDate(s); return d? d.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}) : '<span class="muted">—</span>'; };

function filtered(){
  const q=state.q.toLowerCase();
  return DATA.filter(r=>{
    if(state.status && r.status!==state.status) return false;
    if(state.page && r.page!==state.page) return false;
    if(state.country && r.country!==state.country) return false;
    if(state.owner && r.owner!==state.owner) return false;
    if(state.priority && r.priority!==state.priority) return false;
    if(q && !(r.title.toLowerCase().includes(q)||r.owner.toLowerCase().includes(q)||(r.source||"").toLowerCase().includes(q)||(r.collab||"").toLowerCase().includes(q))) return false;
    return true;
  });
}
function counts(rowsArr,key,order){
  const m=new Map();
  rowsArr.forEach(r=>{const k=r[key]||"—"; m.set(k,(m.get(k)||0)+1)});
  let arr=[...m.entries()];
  if(order){ arr.sort((a,b)=> order.indexOf(a[0])-order.indexOf(b[0])); }
  else arr.sort((a,b)=>b[1]-a[1]);
  return arr;
}

function setFilter(key,val){ state[key] = (state[key]===val? null : val); render(); }

function kpis(rowsArr){
  const total=rowsArr.length;
  const pub=rowsArr.filter(r=>r.post).length;
  const ready=rowsArr.filter(r=>r.status==="Ready to Schedule").length;
  const fin=rowsArr.filter(r=>r.status==="Carousel Finished").length;
  const await_=rowsArr.filter(r=>r.status==="Awaiting Review").length;
  const rev=rowsArr.filter(r=>r.status==="Needs Revision").length;
  const cards=[
    {v:total,l:"Carousels",c:"var(--gold)",p:1},
    {v:pub,l:"Published",c:"var(--s-fin)",p:total?pub/total:0},
    {v:ready,l:"Ready to schedule",c:"var(--s-ready)",p:total?ready/total:0},
    {v:fin,l:"Finished",c:"var(--s-fin)",p:total?fin/total:0},
    {v:await_,l:"Awaiting review",c:"var(--s-await)",p:total?await_/total:0},
    {v:rev,l:"Needs revision",c:"var(--s-rev)",p:total?rev/total:0},
  ];
  document.getElementById("kpis").innerHTML = cards.map(c=>`
    <div class="kpi"><div class="v" style="color:${c.c}">${c.v}</div>
    <div class="l">${c.l}</div><div class="bar"><span style="width:${Math.round(c.p*100)}%;background:${c.c}"></span></div></div>`).join("");
}

function hbars(elId,arr,colorFn,filterKey){
  const max=Math.max(1,...arr.map(a=>a[1]));
  document.getElementById(elId).innerHTML = arr.map(([k,v])=>{
    const active = filterKey && state[filterKey] && state[filterKey]!==k;
    return `<div class="row ${active?'dim':''}" onclick="setFilter('${filterKey}',${JSON.stringify(k).replace(/"/g,'&quot;')})">
      <div class="lab" title="${k}">${k}</div>
      <div class="track"><div class="fill" style="width:${(v/max*100)}%;background:${colorFn(k)}"></div></div>
      <div class="num">${v}</div></div>`;
  }).join("");
}

function donut(elId,arr,filterKey){
  const total=arr.reduce((s,a)=>s+a[1],0)||1;
  let acc=0; const R=52,C=2*Math.PI*R, cx=64,cy=64;
  const segs=arr.map(([k,v],i)=>{
    const frac=v/total, len=frac*C, off=acc*C; acc+=frac;
    const col=PALETTE[i%PALETTE.length];
    const dim = filterKey && state[filterKey] && state[filterKey]!==k;
    return {k,v,col,len,off,dim};
  });
  const circles=segs.map(s=>`<circle r="${R}" cx="${cx}" cy="${cy}" fill="none" stroke="${s.col}"
     stroke-width="${s.dim?12:20}" stroke-dasharray="${s.len} ${C-s.len}" stroke-dashoffset="${-s.off}"
     transform="rotate(-90 ${cx} ${cy})" opacity="${s.dim?.35:1}" style="cursor:pointer;transition:.3s"
     onclick="setFilter('${filterKey}',${JSON.stringify(s.k).replace(/"/g,'&quot;')})"></circle>`).join("");
  const legend=segs.map(s=>`<div onclick="setFilter('${filterKey}',${JSON.stringify(s.k).replace(/"/g,'&quot;')})" style="opacity:${s.dim?.45:1}">
     <span class="dot" style="background:${s.col}"></span>${s.k} <b style="color:var(--text);margin-left:auto">${s.v}</b></div>`).join("");
  document.getElementById(elId).innerHTML =
    `<svg width="128" height="128" viewBox="0 0 128 128">${circles}
       <text x="64" y="60" text-anchor="middle" fill="var(--text)" font-size="22" font-weight="700">${total}</text>
       <text x="64" y="78" text-anchor="middle" fill="var(--muted)" font-size="10">total</text></svg>
     <div class="legend">${legend}</div>`;
}

function chips(){
  const active=[["status","Status"],["page","Page"],["country","Country"],["owner","Owner"],["priority","Priority"]]
    .filter(([k])=>state[k]);
  document.getElementById("chips").innerHTML = active.length? active.map(([k,lbl])=>
    `<div class="chip">${lbl}: <b>${state[k]}</b><span onclick="setFilter('${k}',${JSON.stringify(state[k]).replace(/"/g,'&quot;')})">✕</span></div>`).join("")
    + `<div class="chip" style="border-color:var(--border);color:var(--muted)" onclick="clearAll()"><span>Clear all</span></div>` : "";
}
function clearAll(){ state.status=state.page=state.country=state.owner=state.priority=null; state.q=""; document.getElementById("q").value=""; render(); }

function table(rowsArr){
  const arr=[...rowsArr].sort((a,b)=>{
    let x,y;
    if(state.sort==="date"){ x=parseDate(a.date)||0; y=parseDate(b.date)||0; }
    else { x=(a[state.sort]||"").toLowerCase(); y=(b[state.sort]||"").toLowerCase(); }
    return x<y? -state.dir : x>y? state.dir : 0;
  });
  const link=(u,t)=> u? `<a href="${u}" target="_blank" rel="noopener">${t}</a>` : "";
  document.getElementById("tbody").innerHTML = arr.length? arr.map(r=>`<tr>
    <td>${r.title}${r.collab?`<div class="muted" style="font-size:11px">+ ${r.collab}</div>`:""}</td>
    <td>${r.page}</td><td>${r.owner}</td><td>${r.country}</td>
    <td class="muted">${r.priority.replace(" (1st Tier Guests)","")}</td>
    <td>${fmtDate(r.date)}</td>
    <td><span class="pill" style="background:${(STATUS_COLOR[r.status]||'#333')}22;color:${STATUS_COLOR[r.status]||'#999'}">${r.status}</span></td>
    <td class="tlinks">${link(r.canva,"Canva")}${link(r.frameio,"Frame.io")}${link(r.post,"Post")}</td>
  </tr>`).join("") : `<tr><td colspan="8" class="empty">No carousels match these filters.</td></tr>`;
  document.getElementById("tcount").textContent = `${arr.length} of ${DATA.length} shown`;
}

function render(){
  const rowsArr=filtered();
  chips();
  kpis(rowsArr);
  hbars("c-status", counts(rowsArr,"status",STATUS_ORDER), k=>STATUS_COLOR[k]||"#555", "status");
  donut("c-page", counts(rowsArr,"page"), "page");
  hbars("c-owner", counts(rowsArr,"owner"), ()=>"var(--gold)", "owner");
  donut("c-country", counts(rowsArr,"country"), "country");
  hbars("c-priority", counts(rowsArr,"priority"), ()=>"#5b8def", "priority");
  table(rowsArr);
}

document.getElementById("q").addEventListener("input",e=>{state.q=e.target.value;table(filtered());});
document.querySelectorAll("#tbl th[data-k]").forEach(th=>th.addEventListener("click",()=>{
  const k=th.dataset.k; if(state.sort===k) state.dir*=-1; else {state.sort=k;state.dir=1;} table(filtered());
}));

const dates=DATA.map(r=>parseDate(r.date)).filter(Boolean).sort((a,b)=>a-b);
const span = dates.length? `${dates[0].toLocaleDateString("en-GB",{day:"2-digit",month:"short"})} – ${dates[dates.length-1].toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}` : "—";
document.getElementById("meta").innerHTML = `${DATA.length} carousels · upload window ${span}`;
document.getElementById("foot").textContent = "Generated from SMM Carousel Tracker — Masterlist.csv · click any bar or segment to filter · click again to clear";
render();
</script>
</body>
</html>"""

html = TEMPLATE.replace("__DATA__", data_json)
open(OUT, "w", encoding="utf-8").write(html)
print(f"wrote {OUT} with {len(records)} records ({len(html)//1024} KB)")
