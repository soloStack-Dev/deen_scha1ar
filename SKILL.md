---
name: dinam-lynx-app
description: Build and extend the Dinam daily-routine app (Home, Iman Tracker, Library) using the Lynx framework (ReactLynx + Rspeedy). Use whenever the task mentions Dinam, prayer tracker, ayah cards, copy-to-clipboard cards, free book library, philosopher thoughts, or Lynx UI in this repo.
---

# Dinam · Lynx app skill

## Read first (in order)
1. `01-image-analysis-and-design-system.md` – tokens, mood, app map
2. The spec for the page you are touching: `02` Home · `03` Iman Tracker · `04` Library
3. `05-lynx-architecture-and-setup.md` – folder layout, Lynx rules, native modules

## Non-negotiable rules

### Lynx
- Use `<view>`, `<text>`, `<image>`, `<scroll-view>`, `<list>`. **Never** `<div>`, `<span>`, `<img>`. All visible words go inside `<text>`.
- Events are `bindtap` / `bindlongpress`, not `onClick`.
- Styling is a CSS subset: class selectors + flexbox. No `*`, no complex combinators, no web-only features. Check lynxjs.org if unsure; do not guess APIs.
- No `localStorage` or `navigator.clipboard`. Use `src/native/storage.ts` and `src/native/clipboard.ts` only.
- Long lists use `<list>`. Animations that follow touch use main-thread functions.

### Product behaviour
- Prayer box cycle is exactly `pending → completed → missed → pending`; colours grey / green / red **plus** ✓ / ✗ icons.
- Trash icon on the tracker = **archive current DayInstance, then create a fresh one with all `pending`**. Confirm if any box is pending. Never hard-delete history silently.
- Exactly one active DayInstance at a time. Home reads the same store (no duplicate state).
- Every ayah card, hadith card and philosopher card has a Copy button using the shared `CopyButton`; label changes to "Copied" for ~1.5s.
- Day cards rotate over 7 days: `(daysSinceInstall % 7) + 1`.

### Religious & content integrity
- **Never write Arabic Quran or hadith text from memory.** Load from a verified source (Quran.com, Tanzil, Sunnah.com) and store with the reference. If the source is unavailable, leave a clearly marked TODO, not a guess.
- Always show surah:ayah or hadith collection + number.
- Mark translations as paraphrase until a licensed translation is plugged in.
- Library lists only **public-domain or openly licensed** books, each with `license` and `sourceUrl`. Do not host or scrape copyrighted books.
- Sex-education and adult relationship titles use `adultOnly: true` and sit behind an 18+ confirmation; keep content factual and educational.
- Philosopher quotes: verify wording before using quotation marks; otherwise present as paraphrase.

### Design
- Follow tokens in `01` (lime `#C6F36B`, ink `#111411`, mint `#EEF9DD`, radius 28 cards, pill shapes).
- One focal element per screen (the dark card on Home, the 5 boxes on Tracker, the grid on Library). Keep everything else quiet.
- Sentence-case copy; buttons say what they do ("Copy", "Finish day", "Open book").
- Tap targets ≥ 44px; never rely on colour alone; keep visible focus/pressed states.
- Avoid decorative animation. Only animate in response to touch.

## Workflow for any task
1. Identify the page and open its spec file.
2. Check the acceptance checklist in that spec; implement only what is listed unless asked.
3. Put logic in `state/`, UI in `components/`, copy/data in `data/*.json`.
4. After changes, re-run the page's acceptance checklist and report which items pass.
5. If a Lynx API is uncertain, say so and point to lynxjs.org instead of inventing it.

## Definition of done
- Matches spec wireframe and tokens
- Acceptance checklist ticked
- State persists after app restart
- No web-only elements or APIs used
- Content sources and licences recorded
