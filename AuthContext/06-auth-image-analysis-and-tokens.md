# 06 · Auth Screens: Image Analysis & Design Tokens

> Source: `Elegant_Registration_Pages_UI_UX_Concept_for_Login__.jpg` (Welcome, Log in, Sign up: 3 phones)
> Scope: Welcome screen, Login, Signup for **Dinam**. Specs: `07` (welcome + login), `08` (signup).

## 1. What the image shows

| Screen | Layout | Key details |
|---|---|---|
| Left: Log in | Gradient header with wave-line texture, white sheet with rounded top corners rising over it | "← Back", title, 2 fields (email, password with eye icon), remember me + forgot password, gradient button, "Sign in with" divider, 3 social icons, "Don't have an account? Sign Up" |
| Centre: Welcome | Full-screen gradient, big title, short intro, line-art illustration with small colour blobs, 2 buttons at the bottom | Primary = solid white pill "Create Account", secondary = outlined translucent pill "Log In" |
| Right: Sign up | Same sheet pattern, shorter header | 3 fields (full name, email, password), "Get Started" gradient button, social row, "Already have an account? Log In" |

## 2. Visual DNA
- **Mood:** soft, dreamy, calm, premium. Pastel pink → lavender → peach gradient.
- **Signature texture:** thin **contour / wave lines** over the gradient (topographic feel).
- **Structure:** a **bottom sheet** (white, ~32px top radius) sliding over the gradient header.
- **Shapes:** fully round pill buttons, 14–16px rounded input fields with hairline borders.
- **Illustration:** black line-art figure + a few flat accent blobs (lime and pink).
- **Typography:** geometric sans (Gilroy-like), centred titles, light grey helper text, one bold phrase inside the subtitle.

## 3. Colour tokens (estimated from the image)

```css
:root {
  /* gradient family */
  --auth-pink:      #F7A8C4;
  --auth-peach:     #FFC9B8;
  --auth-lavender:  #B9A0F2;
  --auth-violet:    #9A7BEA;   /* deeper end, used for pressed + links */

  /* surfaces & text */
  --auth-sheet:     #FFFFFF;
  --auth-ink:       #14121A;
  --auth-muted:     #8A8794;
  --auth-border:    #E3DFEA;
  --auth-link:      #3A2E8C;   /* "Sign Up" / "Log In" links */

  /* feedback */
  --auth-error:     #E5484D;
  --auth-success:   #22C55E;

  /* accent shared with the main app */
  --lime:           #C6F36B;   /* from 01; use for illustration blobs */
}

/* gradients */
--bg-welcome: linear-gradient(160deg, #F7A8C4 0%, #FFC9B8 35%, #B9A0F2 100%);
--btn-primary: linear-gradient(90deg, #F7A8C4 0%, #B9A0F2 100%);
```

Shape tokens: sheet radius `32px` (top corners only) · input radius `16px` · button radius `999px` · input height `56px` · button height `56px`.

## 4. Fixes I made to the reference (on purpose)
1. **Button text contrast.** The reference has white text on a pale gradient, which is hard to read. Use `--auth-ink` text on the gradient button, or darken the gradient end to `--auth-violet`.
2. **Link colour** uses `--auth-link`, not the pastel, so it passes contrast on white.
3. **Error states** added (the reference shows none).
4. **Copy** changed from "learning" to Dinam's purpose (prayer, reading, reflection).

## 5. How it fits with the lime Home design
Auth = pastel gradient world. After login the user lands on the lime/black Home (`02`). To tie both together:
- Use **lime** blobs in the welcome illustration.
- Use **ink `#111411`** for text/buttons on auth so it matches the Home hero card.
- If you prefer one single palette across the whole app, say so and I will redo auth in lime/mint.

## 6. Texture asset
Contour lines cannot be built from CSS in Lynx. Export once as an **SVG/PNG** (`assets/auth/waves-header.png`, 1080×720, transparent lines at ~35% white) and place it as an `<image>` layered over the gradient view. Provide 2× and 3× versions.

## 7. Typography
Primary: **Plus Jakarta Sans** (same as Home, for consistency) or **Outfit**. Title 28/700 centred · subtitle 14/400 `--auth-muted` · field text 16 · helper/link 13–14.

## 8. Accessibility floor
- Inputs have visible labels or placeholder + accessible name; error text is shown under the field, not by colour alone.
- Tap targets ≥ 44px (social icons 52px circles).
- Password eye toggle announces "Show password" / "Hide password".
