# 02 · Home Page (designed by me from the reference)

## Goal
In 3 seconds the user sees: **how many prayers are done today, what is next, and today's routine.**

## Wireframe

```
┌──────────────────────────────┐
│ (avatar)  Assalamu Alaikum,   🔔│
│           Arun 👋              │
│ ┌──────────────────────────┐ │
│ │ TODAY'S IMAN        [ ◉ ] │ │  ← dark hero card, lime side pill
│ │  3 / 5 prayers            │ │    (pill = "Open tracker")
│ │  ● ● ● ○ ○   Next: Maghrib│ │
│ │  Streak 12 days           │ │
│ └──────────────────────────┘ │
│  (Iman) (Quran) (Books) (More)│  ← 4 round quick actions
│ Daily Spark          See all >│
│  [Ayah of the day] [Thought]  │  ← 2 horizontal chips/cards
│ Today's Routine      See all >│
│  ▢ Fajr prayer        ✓       │
│  ▢ Read Quran 10 min          │
│  ▢ Read 20 pages              │
│ This Week                     │
│  ▮ ▮ ▮ ▮ ▮ ▮ ▮  (stacked bars)│
│                               │
│   ╭────[ ▣ ][ ◉ ][ ⊞ ]────╮   │  ← floating dark pill nav
└──────────────────────────────┘
```

## Components

| Component | Spec |
|---|---|
| `Header` | 48px avatar, greeting (caption + 20px bold name), bell button in white circle |
| `ImanHeroCard` | `--ink` background, 28px radius, 5 dots (green/red/grey), big "3 / 5", next-prayer label, lime vertical pill on the right edge that navigates to tracker |
| `QuickActions` | 4 white circles 64px with outline icon + 12px label: Iman, Quran, Books, More |
| `DailySparkRow` | horizontal `scroll-view`: Ayah card (lime) + Philosopher card (white). Tap opens full card |
| `RoutineList` | white rows, 16px radius, checkbox on the right. Tap toggles. Strike-through when done |
| `WeekChart` | 7 bars (Mon–Sun). Green = prayers done, red = missed, grey = pending. Tooltip on tap, like the reference |
| `FloatingNav` | Black pill, 3 icons, centre lime circle (Iman). Floats 16px above the safe-area |

## Behaviour
- Hero card dots read from the same state as the Iman tracker (single source of truth).
- "Next prayer" is computed from prayer times (see `03`, section "Prayer times").
- Routine items are user-editable (add / delete). Default seeds: Fajr, Quran 10 min, Read 20 pages, Walk 20 min, Evening dhikr.
- Empty state: "No routine yet. Add your first task." + lime button.

## Onboarding (optional, from left screen)
Lime screen · line-art illustration · headline **"Build your day around what matters."** · sub: "Pray, read, reflect and track it all." · `Skip` / `Let's start` (black circle arrow).

## Copy rules
Sentence case. Buttons say what happens: "Add task", "Copy ayah", "Start new day".
