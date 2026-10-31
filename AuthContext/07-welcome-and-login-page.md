# 07 · Welcome Screen & Login Page

Tokens and assets: see `06`.

## A. Welcome screen (entry point when not signed in)

```
┌──────────────────────────────┐
│  (full gradient + wave lines) │
│                               │
│        Welcome =)             │
│   Hi there! Build your day    │
│   around prayer, reading and  │
│   reflection. Log in or       │
│   create an account.          │
│                               │
│        [ illustration ]       │
│                               │
│  ( Create account )  ← white  │
│  ( Log in )          ← outline│
│           ▬▬▬                 │
└──────────────────────────────┘
```

| Element | Spec |
|---|---|
| Title | "Welcome =)" 32/700, `--auth-ink`, centred |
| Subtitle | 14/400, 2–3 lines, bold on "Log in" and "create an account" |
| Illustration | bundled PNG/SVG, centred, ~45% height |
| Primary button | white fill, ink text, 56px, pill → goes to **Signup** |
| Secondary button | transparent fill, 1px white 70% border, white text (bold) → goes to **Login** |
| Logic | If a valid session exists, skip this screen and go to Home |

## B. Login page

```
┌──────────────────────────────┐
│ ‹ Back    (gradient + waves)  │
│ ╭──────────────────────────╮ │
│ │      Welcome back         │ │
│ │ Ready to continue your    │ │
│ │ day? Your routine is      │ │
│ │ right here.               │ │
│ │ [ Email               ]   │ │
│ │ [ Password          👁 ]   │ │
│ │ ☐ Remember me  Forgot pw? │ │
│ │ [        Log in        ]  │ │
│ │ ───── Sign in with ─────  │ │
│ │   (f)    (G)    ()        │ │
│ │ Don't have an account?    │ │
│ │ Sign up                   │ │
│ ╰──────────────────────────╯ │
└──────────────────────────────┘
```

### Fields

| Field | Type | Rules |
|---|---|---|
| Email | `<input>` keyboard type email, no auto-capitalise | Required, valid email format |
| Password | `<input>` password mode, eye toggle | Required, min 8 chars (do not reveal the exact rule at login, only "Check your email or password") |
| Remember me | checkbox | If on, keep the refresh token; if off, session ends when app is closed |

### Actions

| Action | Behaviour |
|---|---|
| Log in | Validate → disable button + show spinner → call auth API → store tokens securely → go to Home. On failure show inline error: "Email or password is incorrect." |
| Forgot password? | Opens reset flow: enter email → "We sent a reset link" confirmation |
| Facebook / Google / Apple | Native SDK sign-in → exchange token with backend → Home |
| Sign up (link) | Go to Signup |
| ‹ Back | Return to Welcome |

### States
- **Default:** button gradient, enabled when both fields are non-empty.
- **Focus:** input border `--auth-violet` 1.5px.
- **Error:** input border `--auth-error`, message under the field (13px).
- **Loading:** button shows spinner, inputs disabled.
- **Offline:** banner "No internet. Check your connection."

### Component list
`AuthHeader` (gradient + waves + back) · `AuthSheet` (white rounded sheet) · `TextField` · `PasswordField` · `GradientButton` · `OutlineButton` · `SocialRow` · `Divider` (line + "Sign in with" + line) · `InlineError`.

### Lynx notes
- Use `<input>` for fields (`bindinput`, `bindfocus`, `bindblur`); keep value in state.
- Sheet = `<view>` with `border-top-left-radius` / `border-top-right-radius: 32px`, `margin-top: -32px` overlapping the header.
- Keyboard handling: wrap sheet in `<scroll-view>` so fields are not hidden by the keyboard.
- Gradient: use `linear-gradient` background on `<view>`; verify support on your Lynx version, otherwise use a bundled gradient image.

### Acceptance checklist
- [ ] Gradient header with wave texture + white rounded sheet
- [ ] Email + password with working eye toggle
- [ ] Remember me and Forgot password present
- [ ] Gradient Log in button with readable text
- [ ] Facebook, Google, Apple buttons
- [ ] "Don't have an account? Sign up" navigates to Signup
- [ ] Inline errors for empty/invalid/wrong credentials
- [ ] Tokens stored via secure storage, not plain storage
