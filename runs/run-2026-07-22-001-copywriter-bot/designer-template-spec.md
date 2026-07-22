# Carousel Master Template — Designer Spec (Placeholder Tokens)

**For:** M&D design team · **From:** Copywriter Bot project · **Date:** 2026-07-22 · **Version:** 1.0

## Why you're getting this

The Copywriter Bot creates each carousel draft by **copying a master template and replacing text/images through the Canva API**. The validation test on the current `Autos Carousel Template` proved this works — but only on pages where the copy is a real Canva text layer. On that master, pages 2–5 have the slide copy **baked into exported images**, which the bot cannot rewrite.

We need one rebuilt master per vertical where every piece of copy the bot should write is a native, editable Canva text element containing a **placeholder token**.

## The one golden rule

> **If the bot should be able to change it, it must be a native Canva text element (or an image frame) — never text flattened into an image.**

Test yourself: if you can click it in Canva and edit the words directly, it's fine. If you'd have to open Photoshop/another design to change the words, it's wrong.

## Placeholder tokens

Each replaceable text element contains exactly one token, written literally as text:

```
{{PAGE1_HEADLINE}}
```

- Double curly braces, ALL CAPS, underscores, no spaces inside the braces.
- **Every token must be unique within the design** (the bot finds elements by searching for the token text).
- Don't add any extra characters inside the text box beyond the token (no quotes, no trailing spaces).
- Style the text box exactly as final copy should look (font, size, colour, alignment). The bot replaces the words only — **all your styling is preserved** (verified in the spike).

## Standard 7-page carousel token map

Keep the current 1080×1080, 7-page structure. Tokens per page:

| Page | Purpose | Text tokens | Image swap frames |
|---|---|---|---|
| 1 | Cover | `{{PAGE1_HEADLINE}}` (max ~55 chars over 2 lines) | `[IMG_COVER]` main photo, `[IMG_GUEST]` circle portrait |
| 2 | Content | `{{PAGE2_TITLE}}` (~40 chars), `{{PAGE2_BODY}}` (~220 chars) | `[IMG_P2]` |
| 3 | Content | `{{PAGE3_TITLE}}`, `{{PAGE3_BODY}}` | `[IMG_P3]` |
| 4 | Content | `{{PAGE4_TITLE}}`, `{{PAGE4_BODY}}` | `[IMG_P4]` |
| 5 | Content | `{{PAGE5_TITLE}}`, `{{PAGE5_BODY}}` | `[IMG_P5]` |
| 6 | CTA | `{{PAGE6_CTA}}` (~60 chars; e.g. "Check out the full interview on our page!") | background only |
| 7 | Hook/outro | `{{PAGE7_HOOK}}` (~90 chars over 2 lines) | background only |

Fixed elements that need **no** token (bot never touches them): the `koocesterautos`-style handle lockup, "SWIPE FOR MORE" pill, "Read caption.", "Follow @…" line, logos, decorative shapes. If a vertical's layout needs a different page count or extra text slots, that's fine — follow the same naming pattern (`{{PAGE<N>_<ROLE>}}`) and tell us the final token list.

### Character limits

The counts above are guides — you set the real ones. Type a worst-case string at the token's font size and make sure the box fits it without overflowing or auto-shrinking below legibility. Whatever limits you land on, write them in the token list you hand back; the bot will enforce them when generating copy.

## Image swap frames

- Each image the bot may replace must be its **own frame/element** (photo dropped into a frame is ideal), one image per frame.
- Fill each swap frame with an obvious placeholder image (flat grey with the frame's label, e.g. "IMG_P2") so swaps are visually verifiable.
- **Leave swap frames unlocked.** The spike confirmed locked elements are invisible to the bot's edit API (`editable: false`) — which is exactly how we protect fixed elements, and exactly what breaks a swap frame if you lock it.

## Locking policy (this is how the template stays "locked")

- **Lock** everything the bot and copywriters must never move: brand lockups, logos, decorative shapes, backgrounds, the fixed text listed above.
- **Leave unlocked** only: token text elements and image swap frames.
- Brand rules still apply throughout: Maroon `#C02025`, Helvetica, white-dominant, **no gold**.

## Naming & delivery

- Name each master: `MASTER — <Vertical> Carousel Template v1 (DO NOT EDIT)` — one for **Autos, Homes, Wealth, Foodie, Business** (start with Autos).
- Keep masters in a dedicated folder (suggest: `Carousel Masters`) and never post from a master — the bot always works on copies.
- When a master is ready, send back: the design link + the final token list with character limits.

## Acceptance check (we run this, ~2 minutes per master)

1. Bot copies the master and opens an edit session.
2. Every token in your list must appear as an editable text element; every swap frame must appear as an editable image fill.
3. Bot replaces every token with max-length sample text and checks the render for overflow.
4. Any token missing from the API's element map = text is flattened or locked → back to fix.

Questions → Faiz. First master to rebuild: **Autos** (use the existing `Autos Carousel Template` as the visual reference; pages 1, 6, 7 are already correctly built with native text — pages 2–5 are the ones that need real text layers).
