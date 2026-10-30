import { toDateKey } from '../lib/date.js';
import { DEFAULT_ROUTINE_LABELS, PRAYER_NAMES } from './constants.js';
import type {
  AppState,
  DayInstance,
  PrayerName,
  PrayerStatus,
  RoutineItem,
  Settings,
} from './types.js';

export function createEmptyPrayers(): Record<PrayerName, PrayerStatus> {
  return PRAYER_NAMES.reduce(
    (prayers, name) => {
      prayers[name] = 'pending';
      return prayers;
    },
    {} as Record<PrayerName, PrayerStatus>,
  );
}

export function createDayInstance(
  date: string,
  index: number,
  now: number = Date.now(),
): DayInstance {
  return {
    id: `${date}-${index}`,
    date,
    prayers: createEmptyPrayers(),
    quranDone: false,
    bukhariDone: false,
    createdAt: now,
  };
}

export function createDefaultRoutine(now: number = Date.now()): RoutineItem[] {
  return DEFAULT_ROUTINE_LABELS.map((label, index) => ({
    id: `seed-${index + 1}`,
    label,
    done: false,
    createdAt: now,
  }));
}

export function createDefaultSettings(today: string): Settings {
  return {
    installDate: today,
    location: {
      label: 'Mecca (default)',
      latitude: 21.4225,
      longitude: 39.8262,
    },
    calculationMethod: 'UmmAlQura',
  };
}

export function createInitialState(now: Date = new Date()): AppState {
  const today = toDateKey(now);
  return {
    version: 1,
    tracker: {
      active: createDayInstance(today, 1, now.getTime()),
      history: [],
    },
    routine: createDefaultRoutine(now.getTime()),
    settings: createDefaultSettings(today),
  };
}
