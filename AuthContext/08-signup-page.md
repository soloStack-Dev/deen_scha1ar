# 08 · Signup Page (Create Account)

Tokens and assets: see `06`. Mirrors the right phone in the reference.

## Wireframe

```
┌──────────────────────────────┐
│ ‹ Back    (shorter gradient)  │
│ ╭──────────────────────────╮ │
│ │   Create your account     │ │
│ │ Start tracking your day.  │ │
│ │ Ready to begin?           │ │
│ │ [ Full name           ]   │ │
│ │ [ Email               ]   │ │
│ │ [ Password          👁 ]   │ │
│ │   password strength ▮▮▯▯  │ │
│ │ ☐ I agree to Terms &      │ │
│ │   Privacy Policy          │ │
│ │ [      Get started     ]  │ │
│ │ ───── Sign up with ─────  │ │
│ │   (f)    (G)    ()        │ │
│ │ Already have an account?  │ │
│ │ Log in                    │ │
│ ╰──────────────────────────╯ │
└──────────────────────────────┘
```

Differences from Login: shorter header (sheet starts ~28% from top), 3 fields, strength meter, terms checkbox, no "Remember me".

## Fields & validation

| Field | Rule | Error text |
|---|---|---|
| Full name | Required, 2–60 chars, trim spaces | "Enter your name." |
| Email | Required, valid format, unique (checked on submit) | "Enter a valid email." / "This email is already registered. Log in instead." |
| Password | Min 8 chars, at least 1 letter and 1 number | "Use 8+ characters with a letter and a number." |
| Terms checkbox | Must be ticked | "Please accept the terms to continue." |

Password strength meter (4 segments): weak `--auth-error` → fair orange → good lime-green → strong `--auth-success`. Based on length + character variety.

## Flow

```
Welcome → [Create account] → Signup
Signup submit → validate → API create user → (optional) email verification
             → save session securely → Onboarding profile (optional) → Home
Signup → "Log in" link → Login
```

## Actions

| Action | Behaviour |
|---|---|
| Get started | Disabled until name, email, password are valid and terms ticked. On tap: spinner → create account → Home. On server error show a banner at the top of the sheet |
| Social sign-up (Facebook / Google / Apple) | Same as login: native SDK → backend exchange. First-time users auto-create account |
| ‹ Back | Return to Welcome |
| Log in (link) | Go to Login |

## Platform rules to remember
- **Apple:** if the iOS app offers Facebook/Google sign-in, App Store rules require **Sign in with Apple** too. Keep all three (as in the reference).
- Social SDKs (Facebook, Google, Apple) need native setup in the Lynx host app + developer console keys. They are not provided by Lynx itself.
- Add a **Privacy Policy** and **Terms** page; link them from the checkbox.

## Backend contract (suggested)

```
POST /auth/register   { name, email, password }  → 201 { user, accessToken, refreshToken }
POST /auth/login      { email, password }        → 200 { user, accessToken, refreshToken }
POST /auth/social     { provider, idToken }      → 200 { user, accessToken, refreshToken }
POST /auth/forgot     { email }                  → 204
POST /auth/refresh    { refreshToken }           → 200 { accessToken }
```
Passwords are hashed server-side (argon2 / bcrypt). Never store the raw password on the device. Store tokens in the **Keychain / Keystore** through a native `SecureStorageModule` (add it to the module list in `05`).

## Component reuse
Same components as Login (`AuthHeader`, `AuthSheet`, `TextField`, `PasswordField`, `GradientButton`, `SocialRow`) plus `PasswordStrengthMeter` and `TermsCheckbox`. Build them once, use in both pages.

## Acceptance checklist
- [ ] Gradient + waves header, white rounded sheet
- [ ] Full name, email, password (eye toggle) fields
- [ ] Live validation and strength meter
- [ ] Terms checkbox gates the button
- [ ] "Get started" gradient button with readable text
- [ ] Facebook, Google, Apple options
- [ ] "Already have an account? Log in" works
- [ ] Duplicate email, offline and server errors handled
- [ ] Session stored securely; user lands on Home
