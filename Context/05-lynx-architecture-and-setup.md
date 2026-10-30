# 05 · Lynx Architecture & Setup

> Lynx (by ByteDance) renders native UI from web-like code. Use **ReactLynx** (React + TypeScript) with **Rspeedy** as the build tool.
> Always cross-check commands and APIs against the official docs at **lynxjs.org**: Lynx is young and APIs change.

## 1. Create the project

```bash
npm create rspeedy@latest dinam
cd dinam
npm install
npm run dev      # prints a QR code → scan with Lynx Explorer on your phone
npm run build    # production bundle (.lynx.bundle)
```
Install **Lynx Explorer** (Android/iOS) to preview. For a store-ready app you embed Lynx in a native host app (Android Studio / Xcode).

## 2. Lynx rules that differ from web React

| Web | Lynx |
|---|---|
| `<div>`, `<span>`, `<p>` | `<view>`, `<text>` (all words MUST be inside `<text>`) |
| `<img>` | `<image src=... />` |
| `onClick` | `bindtap` (also `bindlongpress`) |
| scrolling div | `<scroll-view>` or `<list>` (virtualised, use for book grid) |
| CSS everything | CSS **subset**: class selectors, flexbox (column by default), no `*`, limited combinators |
| `localStorage` | **not available** → custom native module |
| `navigator.clipboard` | **not available** → custom native module |
| single thread | **dual thread**: UI/main thread + background (React) thread. Smooth animations go on the main thread (`main-thread:` functions) |

## 3. Folder structure

```
src/
  index.tsx                 # root, router, providers
  app/
    App.tsx
    routes.tsx
  pages/
    Home/            Home.tsx  Home.css
    ImanTracker/     ImanTracker.tsx  ImanTracker.css
    Library/         Library.tsx  Library.css
  components/
    FloatingNav.tsx
    ImanHeroCard.tsx
    PrayerBox.tsx           # 3-state box
    AyahCard.tsx            # includes CopyButton
    ThoughtCard.tsx
    CopyButton.tsx
    BookCard.tsx
    CategoryChips.tsx
    WeekChart.tsx
    ConfirmSheet.tsx
  state/
    trackerStore.ts         # DayInstance, history, actions
    routineStore.ts
    settingsStore.ts
  data/
    ayahs.json  thoughts.json  books.json  hadith.json
  native/
    storage.ts              # wrapper over NativeModules.StorageModule
    clipboard.ts            # wrapper over NativeModules.ClipboardModule
  theme/
    tokens.css              # from 01-design-system
  assets/  fonts/  icons/
```

## 4. Navigation
Three tabs (Home · Iman · Library). Use a memory-based router (`react-router` `MemoryRouter` works in ReactLynx per Lynx docs) or a simple `useState<'home'|'iman'|'library'>` for v1. Keep `FloatingNav` outside the routed area.

## 5. State
Plain React Context + `useReducer` is enough. Persist through `storage.ts` on every action.

```ts
// state/trackerStore.ts (shape only)
type Action =
 | { type: 'CYCLE_PRAYER'; prayer: PrayerName }     // pending→completed→missed→pending
 | { type: 'TOGGLE_READING'; key: 'quranDone'|'bukhariDone' }
 | { type: 'FINISH_DAY' };                          // archive + new instance
```

## 6. PrayerBox example (ReactLynx)

```tsx
import { useState } from '@lynx-js/react';
import './PrayerBox.css';

const NEXT = { pending: 'completed', completed: 'missed', missed: 'pending' } as const;

export function PrayerBox({ name, status, onChange }: Props) {
  return (
    <view className={`prayer prayer--${status}`} bindtap={() => onChange(NEXT[status])}>
      <text className="prayer__icon">
        {status === 'completed' ? '✓' : status === 'missed' ? '✗' : '○'}
      </text>
      <text className="prayer__name">{name}</text>
    </view>
  );
}
```
```css
.prayer { width: 64px; height: 88px; border-radius: 20px; align-items: center; justify-content: center; }
.prayer--pending   { background-color: #E5E7EB; }
.prayer--completed { background-color: #22C55E; }
.prayer--missed    { background-color: #EF4444; }
```

## 7. Native modules you must provide
Core Lynx has no storage/clipboard. Create small custom modules (Android Kotlin / iOS Swift) exposing:

| Module | Methods |
|---|---|
| `StorageModule` | `get(key, cb)`, `set(key, value)`, `remove(key)` |
| `ClipboardModule` | `copy(text, cb)` |
| `LinkModule` | `open(url)` (in-app browser) |

Register them in the host app; call from JS via `NativeModules.<Name>`. Wrap each in `src/native/*.ts` so the rest of the code never touches `NativeModules` directly, and add a safe fallback when a module is missing.

## 8. Performance
- Book grid → `<list>` with `item-key`.
- Keep images small; bundle covers or lazy-load.
- Animate only on the main thread.

## 9. Build order (recommended)
1. Tokens + fonts + FloatingNav
2. Storage/Clipboard native modules (test with a dummy button)
3. Iman Tracker (core feature) + store
4. Home (reads tracker store)
5. Library + data JSON
6. WeekChart, polish, empty states
7. Test on Android and iOS devices

## 10. Testing
Unit-test reducers (`CYCLE_PRAYER`, `FINISH_DAY`). Manual checklist = acceptance lists in `03` and `04`.
