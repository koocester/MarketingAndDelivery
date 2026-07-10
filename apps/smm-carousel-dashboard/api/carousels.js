// Vercel Serverless Function: reads the Lark Base "SMM Carousel Tracker" and
// returns clean JSON for the dashboard. Credentials live in env vars (server-side only).
//
// Required env vars (set in Vercel → Project → Settings → Environment Variables):
//   LARK_APP_ID       e.g. cli_xxxxxxxx
//   LARK_APP_SECRET   your app secret  (NEVER put this in the frontend)
//   LARK_APP_TOKEN    the Base app token (from the Base URL: /base/<APP_TOKEN>?table=...)
//   LARK_TABLE_ID     the table id      (from the Base URL: ...?table=<TABLE_ID>)
// Optional:
//   LARK_DOMAIN       defaults to https://open.larksuite.com  (use https://open.feishu.cn for Feishu/China)

const DOMAIN = process.env.LARK_DOMAIN || "https://open.larksuite.com";

// cache the tenant token across warm invocations
let tokenCache = { token: null, exp: 0 };

async function getTenantToken() {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.exp) return tokenCache.token;
  const res = await fetch(`${DOMAIN}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: process.env.LARK_APP_ID, app_secret: process.env.LARK_APP_SECRET }),
  });
  const j = await res.json();
  if (j.code !== 0) throw new Error(`token error ${j.code}: ${j.msg}`);
  tokenCache = { token: j.tenant_access_token, exp: now + (j.expire - 120) * 1000 }; // refresh 2min early
  return tokenCache.token;
}

// Lark Bitable field values come in many shapes — normalise to a plain string / url.
function asText(v) {
  if (v == null) return "";
  if (typeof v === "string") return v.trim();
  if (typeof v === "number") return String(v);
  if (Array.isArray(v)) return v.map(asText).filter(Boolean).join(", ");
  if (typeof v === "object") {
    if (v.text) return String(v.text).trim();          // rich text / link {text,link}
    if (v.name) return String(v.name).trim();          // people / option {name}
    if (v.en_name) return String(v.en_name).trim();
    if (v.link) return String(v.link).trim();
    if (v.value) return asText(v.value);
  }
  return "";
}
function asUrl(v) {
  if (!v) return "";
  if (typeof v === "string") return v.trim();
  if (Array.isArray(v)) { for (const x of v) { const u = asUrl(x); if (u) return u; } return ""; }
  if (typeof v === "object") return (v.link || v.url || v.text || "").trim();
  return "";
}
function asDate(v) {
  // Lark date fields are epoch ms numbers; format to DD/MM/YYYY to match the existing UI
  if (v == null || v === "") return "";
  if (typeof v === "number") {
    const d = new Date(v);
    return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`;
  }
  return asText(v);
}

async function fetchAllRecords(token) {
  const out = [];
  let pageToken = "";
  do {
    const url = new URL(`${DOMAIN}/open-apis/bitable/v1/apps/${process.env.LARK_APP_TOKEN}/tables/${process.env.LARK_TABLE_ID}/records`);
    url.searchParams.set("page_size", "500");
    if (pageToken) url.searchParams.set("page_token", pageToken);
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const j = await res.json();
    if (j.code !== 0) throw new Error(`records error ${j.code}: ${j.msg}`);
    out.push(...(j.data.items || []));
    pageToken = j.data.has_more ? j.data.page_token : "";
  } while (pageToken);
  return out;
}

function mapRecord(rec) {
  const f = rec.fields || {};
  return {
    title:    asText(f["Carousel Title"]) || "(untitled)",
    type:     asText(f["Type"]) || "—",
    owner:    asText(f["Owner"]) || "—",
    page:     asText(f["Page"]) || "—",
    priority: asText(f["Priority"]) || "—",
    date:     asDate(f["Upload Date (link via smm)"]),
    country:  asText(f["Country"]) || "—",
    status:   asText(f["Status"]) || "—",
    collab:   asText(f["Collab With"]),
    canva:    asUrl(f["Canva Link"]),
    frameio:  asUrl(f["Frame IO Link"]),
    post:     asUrl(f["Finished Post"]),
    source:   asText(f["Carousel Source"]),
  };
}

export default async function handler(req, res) {
  try {
    if (!process.env.LARK_APP_ID || !process.env.LARK_APP_TOKEN || !process.env.LARK_TABLE_ID) {
      return res.status(503).json({ error: "not_configured",
        message: "Lark env vars missing. Set LARK_APP_ID, LARK_APP_SECRET, LARK_APP_TOKEN, LARK_TABLE_ID in Vercel." });
    }
    const token = await getTenantToken();
    const records = await fetchAllRecords(token);
    const data = records.map(mapRecord);
    // edge-cache for 30s, serve stale while revalidating — keeps it near-real-time without hammering Lark
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=120");
    res.status(200).json({ updated: new Date().toISOString(), count: data.length, data });
  } catch (e) {
    res.status(500).json({ error: "lark_fetch_failed", message: String(e.message || e) });
  }
}
