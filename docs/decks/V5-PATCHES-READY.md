# Ready-to-apply patches — audit items 1 and 4

Written 2026-08-08 while the n8n MCP connection was down. n8n itself is healthy (root 200, REST 401,
`/webhook/mgmt-slides` 401 — all correct). These are the two items a manager sees on Monday.
Both are single, self-contained edits. Apply in the n8n UI or via MCP; no other change is needed.

---

## Patch 1 — "7 deals still open" must read 20
**Workflow** `t9ZZ7sk9hyWEKNdR` (Management Weekly Slides — served) → **Build Deck** node.

The tile's sub reads `growth.deals` (dashboard snapshot). The stage table on the next slide reads
`wf.open_by_stage`. They disagree. Take both from the same place so they cannot drift again.

FIND (one line, inside the `sales` slide's `twoHalf(...)` leading block):
```js
        {label:'Open pipeline value', value:money(cash.pipeline), sub:num(growth.deals) + ' deals still open'},
```

REPLACE:
```js
        {label:'Open pipeline value', value:money(cash.pipeline), sub:num((Array.isArray(wf.open_by_stage) ? wf.open_by_stage : []).reduce(function (s, r) { return s + Number(r.n || 0); }, 0)) + ' deals still open'},
```

Expected after: sales slide shows `S$34,684 · 20 deals still open`, matching the stage table
(Qualified Prospect 15 + Negotiation 2 + stage-not-set 2 + Follow Up 1).

---

## Patch 2 — restore the governance caveats the v5 prune deleted
**Workflow** `t9ZZ7sk9hyWEKNdR` → **V5 Transform** node, PHASE 1, the caption-prune pass.

v1 carried 2 `APPROXIMATE` markers; v5 ships 0. The prune drops every source line without a credit
chip, which is broader than Faiz's rule — that rule bans *explainer* captions, not registry caveats.

FIND:
```js
// captions: keep the credit-chip lines (truncated after the last chip), drop the rest
h = h.replace(/<p class="source">((?:(?!<\/p>)[\s\S])*)<\/p>/g, function (m0, body) {
  if (body.indexOf('cchip') < 0) return '';
  const cut = body.lastIndexOf('</span>');
  return cut < 0 ? '' : '<p class="source crd">' + body.slice(0, cut + 7) + '</p>';
});
```

REPLACE:
```js
// captions: keep credit-chip lines (truncated after the last chip). Governance caveats are NOT
// explainer captions and must survive the prune — keep only their caveat sentence, drop the prose.
const GOVERNANCE = /APPROXIMATE|Metric Registry|not fully accurate|Broken/i;
h = h.replace(/<p class="source">((?:(?!<\/p>)[\s\S])*)<\/p>/g, function (m0, body) {
  if (body.indexOf('cchip') >= 0) {
    const cut = body.lastIndexOf('</span>');
    return cut < 0 ? '' : '<p class="source crd">' + body.slice(0, cut + 7) + '</p>';
  }
  if (GOVERNANCE.test(body)) {
    const keep = body.replace(/<[^>]*>/g, '').split(/\.\s+/)
      .filter(function (s) { return GOVERNANCE.test(s); })
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
    if (keep.length) return '<p class="source gov">\u26a0 ' + keep.join('. ').replace(/\.?$/, '.') + '</p>';
  }
  return '';
});
```

Also add to the `CSS` string in PHASE 4 (next to the `p.source.crd` rule):
```js
'p.source.gov{color:#8a6d00!important;background:#FBF3D8;border:1px solid #EFE0A6;border-radius:8px;padding:7px 12px;font-size:12.5px!important;margin-top:16px;display:inline-block}' +
```

Expected after: `APPROXIMATE` count back to ≥2 — the followers slide regains its partial-snapshot
caveat (the SG ~79k-low failure mode), overdue regains its note, and the sales slide regains
"never quote a conversion rate from these".

---

## Verify both in one run
```
curl -s "https://koocester.app.n8n.cloud/webhook/dryrun-v5-weekly-x9" -o /tmp/v5.html
grep -c "APPROXIMATE" /tmp/v5.html        # expect >= 2, was 0
grep -o "[0-9]* deals still open" /tmp/v5.html   # expect "20 deals still open", was 7
```
The preview webhook runs the same chain as the live serve path, so a clean preview means a clean
Saturday build. Remaining items 2, 3, 5, 6, 7, 8, 9 are in `V5-AUDIT-2026-08-08.md`.
