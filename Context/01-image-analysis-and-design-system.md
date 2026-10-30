# 01 · Image Analysis & Design System

> Source: `Finance_Service_App.jpg` ("Paytin – Finance Mobile App", 3 phone screens)
> App working name: **Dinam** (தினம் = "day"). Rename freely.

## 1. What the reference image shows

| Screen | What it contains | What we borrow |
|---|---|---|
| Left – Onboarding | Lime-green full screen, line-art character, big bold headline, black circular arrow button, "Skip / Let's Start" | Welcome / splash screen with illustration + one bold sentence |
| Centre – Home | Greeting + avatar + bell, **one dark hero card** with a lime pill on its side, 4 round quick-action buttons, a horizontal avatar row, a "Recent Activity" list, floating dark pill nav with lime centre button | Home layout skeleton |
| Right – Statistics | Period chips (Today/Weekly/Monthly/Yearly), two small stat cards (lime + dark), stacked bar chart with tooltip | Weekly prayer/routine stats |

## 2. Visual DNA (extracted)

- **Mood:** fresh, energetic, rounded, friendly. Lime + black + white.
- **Shapes:** very large radius (24–32px cards, fully round buttons/chips). Nothing sharp.
- **Contrast trick:** one **black card** on a light mint page = the focal point. Lime is the "action" colour.
- **Typography:** geometric rounded sans, heavy weight for headlines, small grey captions.
- **Icons:** thin outline icons inside white circles.
- **Navigation:** floating black pill at bottom, centre action in lime.

## 3. Design tokens

```css
:root {
  --lime:        #C6F36B;  /* primary / action */
  --lime-deep:   #A8E04A;  /* pressed state */
  --mint-bg:     #EEF9DD;  /* page background */
  --ink:         #111411;  /* hero cards, nav, headings */
  --white:       #FFFFFF;
  --grey-text:   #6B7280;
  --done:        #22C55E;  /* prayer completed */
  --missed:      #EF4444;  /* prayer missed */
  --pending:     #E5E7EB;  /* not touched yet */

  --radius-card: 28px;
  --radius-pill: 999px;
  --space: 8px;             /* use multiples: 8 / 16 / 24 */
}
```

Typography: **Plus Jakarta Sans** or **Sora** (bundle the font file; Lynx does not load Google Fonts by URL reliably). Sizes: 28 headline · 20 title · 16 body · 12 caption.
Arabic text: **Amiri** or **Noto Naskh Arabic**, size 24–28, line-height 1.9, `direction: rtl`.

## 4. Product decisions made for you

1. The finance "balance card" becomes a **Today's Iman card** (prayers done out of 5).
2. The "Quick Send" avatar row becomes **Daily Ayah / Thought chips**.
3. "Recent Activity" becomes **Today's Routine** checklist.
4. Bar chart becomes **7-day prayer completion** (green = done, red = missed).
5. Sensitive categories in the Library (relationships, sexual health) sit behind an **18+ confirmation**.

## 5. App map

```
Splash/Onboarding → Home ─┬─ Iman Tracker  (page 2)
                          ├─ Library       (page 3: books + philosopher thoughts)
                          └─ Stats         (weekly chart, can live inside Home)
Bottom pill nav: Home · Iman (centre, lime) · Library
```

## 6. Accessibility floor
- Never use colour alone: completed = green + ✓ icon, missed = red + ✗ icon.
- Tap targets ≥ 44×44 px.
- Contrast: lime text is never placed on white; use `--ink` on lime.
