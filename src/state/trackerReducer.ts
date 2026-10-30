import { createDayInstance } from './defaults.js';
import { PRAYER_CYCLE } from './constants.js';
import type { AppState, DayInstance, PrayerStatus, ReadingKey } from './types.js';

export function cycleStatus(status: PrayerStatus): PrayerStatus {
  return PRAYER_CYCLE[status];
}

function archive(state: AppState, archivedAt: number): DayInstance[] {
  return [
    ...state.tracker.history,
    { ...state.tracker.active, archivedAt },
  ];
}

/**
 * Keeps ids unique even after Settings -> Clear history. Reading the highest
 * existing index avoids reusing an id that is still present in history.
 */
function nextDayIndex(state: AppState): number {
  return [...state.tracker.history, state.tracker.active].reduce(
    (highest, day) => {
      const index = Number(day.id.slice(day.id.lastIndexOf('-') + 1));
      return Number.isFinite(index) ? Math.max(highest, index) : highest;
    },
    0,
  ) + 1;
}

/**
 * Archives the current DayInstance and starts a fresh one with every prayer
 * pending. History is preserved: the tracker never destroys past days.
 */
export function finishDay(
  state: AppState,
  today: string,
  now: number = Date.now(),
): AppState {
  const history = archive(state, now);
  return {
    ...state,
    tracker: {
      active: createDayInstance(today, nextDayIndex(state), now),
      history,
    },
  };
}

/**
 * Midnight guard. If the active instance is from an earlier day it is archived
 * as-is and replaced, so the user always sees today when the app opens.
 */
export function ensureToday(
  state: AppState,
  today: string,
  now: number = Date.now(),
): AppState {
  if (state.tracker.active.date === today) return state;
  return finishDay(state, today, now);
}

export function cyclePrayer(state: AppState, prayer: keyof DayInstance['prayers']): AppState {
  const active = state.tracker.active;
  return {
    ...state,
    tracker: {
      ...state.tracker,
      active: {
        ...active,
        prayers: {
          ...active.prayers,
          [prayer]: cycleStatus(active.prayers[prayer]),
        },
      },
    },
  };
}

export function toggleReading(state: AppState, key: ReadingKey): AppState {
  const active = state.tracker.active;
  return {
    ...state,
    tracker: {
      ...state.tracker,
      active: {
        ...active,
        [key]: !active[key],
      },
    },
  };
}

export function clearHistory(state: AppState): AppState {
  return {
    ...state,
    tracker: {
      ...state.tracker,
      history: [],
    },
  };
}
