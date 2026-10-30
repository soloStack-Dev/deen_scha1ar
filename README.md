# Deensch1ar

A ReactLynx mobile app for daily iman tracking, short Qur'an and thought reflections, and a library of free, legal books.

## Features

- **Welcome screen**: centered Deensch1ar wordmark, tagline, auto-advancing photo gallery, and a “Go to page” action that enters Home.
- **Home**: Faleel greeting, return-to-start icon, prayer progress, next prayer, daily spark, editable routine, weekly chart.
- **Iman Tracker**: five-prayer cycle (`pending → completed → missed → pending`), Qur'an/Bukhari reading ticks, finish-day archiving, day selector, streak and weekly history.
- **Library**: searchable book catalog with category filters, source/licence badges, and a browsable seven-day thought card.
- **Persistence**: state is validated with zod and stored through the host storage module, with an in-memory fallback. Day rollover happens on launch and at midnight.
- **Offline content**: seven Qur'an passages, seven hadith links, seven philosophical reflections, and 45 book references are bundled; adult-only entries are excluded from the Library.

## Getting started

```bash
npm install
npm run dev
```

Scan the QR code with LynxExplorer to open the app. Production build and local preview:

```bash
npm run build
npm run preview
```

## Tests

```bash
npm run test
```

The suite covers reducer behaviour, day-id uniqueness, streaks, week data, content rotation, book filtering, copy formats, schema validation, and basic page rendering/navigation.

## Project layout

- `src/App.tsx`: app shell, tab switching, global toast and info sheet.
- `src/pages/`: Home, Iman Tracker and Library screens.
- `src/components/`: reusable Lynx views and bottom sheets, including the home gallery and icon nav.
- `src/assets/gallery/`: compressed copies of the provided `Asserts` photos used by the home gallery.
- `src/state/`: reducer, selectors, defaults, zod schema and provider.
- `src/lib/`: dates, prayer times, clock and id helpers.
- `src/native/`: safe wrappers for storage, clipboard and link opening.
- `src/data/`: bundled content and pure catalog/copy helpers.
- `BUILD_LOG.md`: build errors and preventive fixes, including root cause and rationale.

## Native modules

The JS bundle runs before the host registers native modules, so every wrapper degrades gracefully:

| Module | Methods used |
| --- | --- |
| `NativeLocalStorageModule` or `StorageModule` | `getStorageItem`, `setStorageItem`, `clearStorage` |
| `ClipboardModule`, `Clipboard` or `NativeClipboardModule` | `copy(text, callback)` or `setString(text, callback)`; browser `navigator.clipboard` is used first when available |
| `LinkModule` | `open(url)` |

When the host does not provide `LinkModule`, source buttons open an in-app sheet with the full URL and a copy action instead of showing a dead-end error. If no clipboard module is registered, the fallback text is selectable for manual copying.

## Content and licensing

Qur'an text is stored with its reference from the Quran.com API. Hadith entries link to Sunnah.com rather than quoting text. Books link to their legal source pages (Gutenberg, OpenStax, Open Library, eBible); Deensch1ar does not host or scrape them. Verify each licence on the source page.

# deen_scha1ar
