# 03 · Iman Tracker Page (Page 2)

> You did not have a name for this page. Suggested: **"Iman Tracker"** (alt: *Noor*, *Salah Log*). Used below.

## 1. Purpose
Track the 5 daily prayers, read Quran / Sahih al-Bukhari, and get a motivating ayah every day for 7 days.

## 2. Wireframe

```
┌──────────────────────────────┐
│ ←  Iman Tracker        🗑     │  ← delete icon = finish & start new day
│ Friday, 30 Oct 2026           │
│ 3 of 5 done  ━━━━━━░░░        │
│                               │
│ ┌─────┐┌─────┐┌─────┐┌─────┐┌─────┐
│ │Fajr ││Dhuhr││ Asr ││Magh.││Isha │   ← 5 boxes
│ │ ✓   ││ ✓   ││ ✗   ││ ○   ││ ○   │
│ └─────┘└─────┘└─────┘└─────┘└─────┘
│  green   green   red    grey   grey │
│                               │
│ Reading                       │
│  [ Quran  · Surah 2 · p.14 ]  │
│  [ Sahih al-Bukhari · #12 ]   │
│                               │
│ Ayah of the day   (Day 1 / 7) │
│ ┌──────────────────────────┐ │
│ │ ‹Arabic text›             │ │
│ │ Translation               │ │
│ │ Explanation               │ │
│ │ 94:5–6          [ Copy ]  │ │
│ └──────────────────────────┘ │
│   ◂ Day 1 2 3 4 5 6 7 ▸       │
└──────────────────────────────┘
```
On narrow phones the 5 boxes wrap into 3 + 2, or scroll horizontally. Keep each box ≥ 64px wide.

## 3. Prayer box states (your requirement)

| State | Colour | Icon | How it happens |
|---|---|---|---|
| `pending` | grey `--pending` | empty circle | default |
| `completed` | green `--done` | ✓ fill-up check | user taps once |
| `missed` | red `--missed` | ✗ | user taps again |
| back to `pending` | grey | ○ | user taps a third time (undo) |

Tap cycle: `pending → completed → missed → pending`.
Optional: auto-mark `missed` when the next prayer's time starts and this one is still `pending` (setting, off by default).

Animation: when a box becomes green, the icon "fills" (scale 0.6 → 1, 150ms). This is a response to touch, so it is allowed motion.

## 4. Delete → new day instance (your requirement)

Top-right **trash icon** = "Finish day".

```
onDeletePress:
  if any box is still pending → confirm dialog:
       "3 prayers are not marked. Finish anyway?"  [Cancel] [Finish]
  archive current instance → history (date, 5 statuses, reading done)
  create NEW instance: date = today (or next day), all 5 = pending
  reset reading ticks, keep streak calculation from history
  toast: "New day started"
```

Rules
- Only **one active instance** at a time.
- Archived instances feed the weekly chart on Home and the streak counter.
- Deleting is **archive, not destroy**; add Settings → "Clear history" for a real wipe.
- Also auto-create a new instance at 00:00 local time if the old one was not finished (archive it as-is).

## 5. Data model

```ts
type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';
type PrayerStatus = 'pending' | 'completed' | 'missed';

interface DayInstance {
  id: string;                 // `${yyyy-mm-dd}-${n}`
  date: string;               // ISO date
  prayers: Record<PrayerName, PrayerStatus>;
  quranDone: boolean;
  bukhariDone: boolean;
  createdAt: number;
  archivedAt?: number;
}

interface TrackerState {
  active: DayInstance;
  history: DayInstance[];
}
```

Persistence: needs a **storage native module** (see `05`). Save on every change.

## 6. Quran & Sahih al-Bukhari section

Interpreted as two daily reading items inside the tracker:
- **Quran** – user sets a daily target (pages or minutes) and a bookmark (surah:ayah). Tick = done. Link out to Quran.com / app reader.
- **Sahih al-Bukhari** – "Hadith of the day" (one hadith number + short text + book/number reference) and a tick.

> Rule for the developer/agent: **do not type Arabic Quran or hadith text from memory.** Fetch it from a verified source (Quran.com API, Tanzil, Sunnah.com) and store text + reference together. Wrong Arabic in a religious app is a serious bug.

## 7. Ayah of the day: 7-day set

Each card = Arabic (fetched from verified source) + translation + short explanation + reference + **Copy** button.
Translations below are paraphrased meanings; replace with a licensed translation (e.g. Sahih International via Quran.com) before release.

| Day | Ref | Meaning | Explanation (shown on card) |
|---|---|---|---|
| 1 | 94:5–6 | Indeed, with hardship comes ease. | Difficulty is never the end of the story. Ease is promised alongside it, so keep going. |
| 2 | 2:152 | Remember Me and I will remember you. | A small daily dhikr connects you to Allah; He answers with His remembrance. |
| 3 | 13:28 | Hearts find peace in the remembrance of Allah. | Anxiety is not solved by more noise. Calm comes from remembrance. |
| 4 | 2:286 | Allah does not burden a soul beyond its capacity. | Whatever you face, you are able to carry it. The load fits you. |
| 5 | 65:2–3 | Whoever is mindful of Allah, He makes a way out and provides from where they do not expect. | Taqwa opens doors. Do your part and trust the provision. |
| 6 | 39:53 | Do not despair of the mercy of Allah. | No mistake is too big to return from. Repent and restart today. |
| 7 | 3:139 | Do not lose heart or grieve; you will prevail if you are believers. | Discouragement is the first defeat. Stand up with faith. |

Rotation: show `day = (daysSinceInstall % 7) + 1`; user can swipe through Day 1–7.

### Copy board feature (required on every card)

Copied text format:
```
{arabic}

"{translation}"
— Qur'an {ref}

{explanation}

via Dinam
```
- Button label: **Copy** → after tap shows **Copied** with ✓ for 1.5s.
- Implementation: custom Lynx `Clipboard` native module (core Lynx has no clipboard API). Fallback: show a "Select and copy" bottom sheet.

## 8. Acceptance checklist
- [ ] 5 boxes show Fajr, Dhuhr, Asr, Maghrib, Isha
- [ ] One tap = green + check; second tap = red + cross; third = reset
- [ ] Trash icon archives and creates a fresh instance with all grey
- [ ] Quran and Sahih al-Bukhari rows present with tick
- [ ] 7 ayah cards, each with Copy
- [ ] State survives app restart
- [ ] Home hero card updates instantly after a tap here

## Prayer times (for "next prayer" label)
Use a local calculation library (e.g. `adhan` JS) with the user's coordinates and calculation method (setting). Do not hardcode times.
