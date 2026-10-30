# Deensch1ar build log

This file records every runtime or compile error found while building the app, the root cause, the fix, and why the fix is the right one. It is updated as the build progresses.

## Entry template

```
### [time] <stage> — <error summary>
- Error: <exact message>
- Cause: <why it happened>
- Fix: <what changed>
- Why this fix: <reasoning and trade-offs>
```

## Build started

- Scope: implement Home, Iman Tracker, Library, persistence, clipboard, content data, tests.
- Tooling: ReactLynx + Rspeedy, Rstest, TypeScript strict mode.
- Content rule: Arabic Quran text is fetched from the Quran.com API and stored with its reference. Hadith text is linked out to Sunnah.com instead of being quoted from memory.
- Native rule: storage, clipboard and link open are wrapped in `src/native/*` with safe in-memory/no-op fallbacks so the JS bundle runs before the host app registers native modules.

## Entries

### 2026-10-30 — JSON content imports need `resolveJsonModule`
- Error: none yet; content files are imported directly (`ayahs.json`, `books.json`, `hadith.json`, `thoughts.json`), which strict TypeScript rejects without JSON module resolution.
- Cause: the starter `src/tsconfig.json` used `moduleResolution: "Bundler"` but did not enable JSON modules.
- Fix: added `"resolveJsonModule": true` to `src/tsconfig.json`.
- Why this fix: it keeps the 7-day content bundled and offline-safe without converting verified Arabic text into hand-copied TS strings.

### 2026-10-30 — `TS2322: Property 'value' does not exist on type 'InputProps'`
- Error: `src/components/RoutineList.tsx:59` and `src/pages/Library/Library.tsx:59` failed the build when `value={...}` was passed to `<input>`.
- Cause: Lynx's `<input>` is uncontrolled. `InputProps` exposes `default-value` and `bindinput`, not React DOM's `value`.
- Fix: removed `value`; the Library search is filtered from `bindinput` state. The routine field uses `default-value` plus a changing `key` to remount and clear the native input after "Add task".
- Why this fix: this follows the Lynx API instead of casting around the type. Search does not need a controlled value, and the key remount is the smallest reliable way to reset the native uncontrolled field without a native `setValue` call.

### 2026-10-30 — Test expected the wrong ayah reference
- Error: `expected '...' to contain 'Qur'an 2:286'` in `src/__tests__/logic.test.ts`.
- Cause: the test hard-coded day 1 as 2:286, but day 1 in the verified content set is 94:5-6.
- Fix: asserted against `getAyah(1).reference` data instead of a duplicated literal.
- Why this fix: the bundled content remains the single source of truth, so a future content correction cannot silently break the test.

### 2026-10-30 — Test assumed the copy format contains the translation note
- Error: `expected '...' to contain 'paraphrased'` in the copy-format test.
- Cause: Context/03 defines the copy format as Arabic, translation, reference, explanation, `via Dinam`; the translation note is card UI only.
- Fix: kept `formatAyahForCopy` exactly per spec and tested `translationNote` separately on the `Ayah` object.
- Why this fix: the copied text should match the approved format, while the paraphrase disclosure still needs coverage.

### 2026-10-30 — Build warning: `ObjectRef is not unref, it considered as a memory leak`
- Error: Rspeedy prints this three times after a successful build.
- Cause: toolchain/runtime warning from the native Lynx build pipeline, not from app code; the bundle is still emitted.
- Fix: no app change. Re-ran `npm run build`; it succeeded (`dist\main.lynx.bundle`).
- Why this fix: changing app code cannot address a toolchain warning. It is recorded so a future toolchain upgrade can be checked instead of masked.

## Preventive fixes (found during review)

### Day ids could collide after "Clear history"
- Cause: `finishDay` used `history.length + 1`; after clearing history, the next active day could reuse the id of the day just archived.
- Fix: `nextDayIndex` scans the active day plus history for the highest numeric suffix, then increments it.
- Why this fix: it preserves the documented `${date}-${n}` id shape while guaranteeing uniqueness, which matters for stable React keys and future history features.

### Native storage read fallback was too aggressive
- Cause: `readPersistedState` fell back to memory after 300ms. A slow host storage callback could be ignored and persisted prayers lost on launch.
- Fix: raised the fallback to 1000ms.
- Why this fix: the fallback still protects the app when a module hangs, but gives a real native callback enough time to answer.

### Clipboard fallback fired before slow native callbacks
- Cause: `copyText` resolved `false` after 400ms, so a slow host callback could be mistaken for a failed copy.
- Fix: raised the guard to 1000ms.
- Why this fix: it keeps the selectable fallback for a missing module without showing it over a copy that actually succeeded.

### Clock labels could go stale while the app stayed open
- Cause: "next prayer" and "today" were computed only when reducer state changed.
- Fix: added `useNow()` (one-minute clock, no persistence writes) and used it on Home, Iman Tracker and Library.
- Why this fix: prayer times change without user interaction; a local clock keeps labels correct without polluting the persisted store.

### The 18+ gate was unreachable
- Cause: `filterBooks` removed adult-only titles while locked, so no card could open the confirmation sheet.
- Fix: kept the titles filtered, but added a locked "18+ educational section" card that opens the gate. Unlocking persists and reveals the titles.
- Why this fix: it keeps sensitive titles hidden by default while giving the user a discoverable way to consent, which is the behaviour the spec requires.

### Page scroll position carried across tabs
- Cause: one `scroll-view` stayed mounted while its child page changed, so switching tabs kept the old offset.
- Fix: keyed the `scroll-view` by page name so each tab starts at the top.
- Why this fix: it matches normal tab navigation without adding imperative scroll-to-top calls.

### Storage host module name is not guaranteed
- Cause: the setup doc calls the host module `StorageModule`, while the Dinam host name is `NativeLocalStorageModule`.
- Fix: `getStorage()` tries both names, then falls back to the in-memory map.
- Why this fix: the JS bundle must run in both environments without a build-time alias or a crash.

### Unused starter code removed
- Cause: `src/lib/flappy.ts` remained from the starter demo after `useFlappy.ts` was removed.
- Fix: deleted the unused file.
- Why this fix: an unreferenced physics engine adds review noise and could be bundled by a future glob import.

### Source links dead-ended when the host lacked `LinkModule`
- Error: tapping "Open book" in the Library, "Open on Sunnah.com", or a source row in About showed `Link opening is unavailable. Register the host LinkModule.`
- Cause: external URL opening is a native host capability. The preview/Explorer host used for development does not register `LinkModule`, and Lynx exposes no portable built-in browser API.
- Fix: kept `LinkModule.open(url)` as the primary path; when it is missing, `App` now opens a `SourceLinkSheet` showing the full URL with a copy action. Library books, hadith links, and About sources all route through the same `openSource` handler.
- Why this fix: the JS bundle cannot open an external browser without host support. Showing the source URL preserves access to the legal text and gives the user a useful next step, while hosts that do register `LinkModule` keep the direct-open behaviour.

### Home landing gallery and icon navigation
- Error: the latest UI pass needed a centered app-name landing section, animated use of the provided `Asserts` photos, and icon-based tab buttons.
- Cause: the home page opened straight into the dashboard, the bottom nav used letter glyphs, and the source JPGs are 8-13 MP originals that should not be bundled for a phone screen.
- Fix: added a full-screen `WelcomeScreen` (Dinam wordmark, tagline, auto-advancing `HomeGallery`) before the app shell; generated 1000px JPEG copies under `src/assets/gallery/`; added `*.jpg` module declarations; replaced nav letters with CSS-drawn home, crescent and book-spine icons. “Go to page” enters the Home page, and the header name is now Faleel.
- Why this fix: the landing moment is now centered and modern without shipping multi-megabyte camera originals, and the tab bar reads as navigation rather than initial letters.

### Deensch1ar rebrand, Home redirect and 18+ removal
- Request: add a Home icon that returns to the starting screen, remove the 18+ books section, and rename the app to Deensch1ar.
- Fix: added a back-arrow control beside the Home bell wired to `entered=false`; changed the welcome wordmark and About/copy credit to Deensch1ar; removed the Library gate, adult badges, adult detail branch and `adultUnlocked` state; `filterBooks` now always excludes `adultOnly` entries and the empty sex-education chip is hidden.
- Why this fix: the start screen is reachable from Home, the Library no longer exposes an 18+ flow, and the visible product name is consistent without breaking the existing save key.

## Current verification
- `npm run build` passes (type checker enabled); bundle is 362.3 kB plus five gallery images totalling 442 kB (804.1 kB total).
- `npm run test` passes: 16 tests across 2 files (tracker cycle/archive/rollover/id uniqueness, streaks, week data, rotation, date keys, book filtering, copy format, schema validation, welcome-to-Home entry, Home redirect, quick-action navigation, source-link fallback).
