import { addDaysKey, dayOfMonth, toDateKey, weekDates, weekdayShort } from '../lib/date.js';
import { PRAYER_NAMES } from './constants.js';
import type { AppState, DayInstance, PrayerStatus } from './types.js';

export function completedCount(day: DayInstance): number {
  return PRAYER_NAMES.filter((name) => day.prayers[name] === 'completed').length;
}

export function hasPendingPrayer(day: DayInstance): boolean {
  return PRAYER_NAMES.some((name) => day.prayers[name] === 'pending');
}

export function isPerfectDay(day: DayInstance): boolean {
  return completedCount(day) === PRAYER_NAMES.length;
}

/** The newest instance per date wins when a user finished a day more than once. */
export function latestInstanceByDate(state: AppState): Map<string, DayInstance> {
  const map = new Map<string, DayInstance>();
  for (const instance of [...state.tracker.history, state.tracker.active]) {
    const current = map.get(instance.date);
    if (!current || current.createdAt <= instance.createdAt) {
      map.set(instance.date, instance);
    }
  }
  return map;
}

export function currentStreak(state: AppState, today: string): number {
  const byDate = latestInstanceByDate(state);
  let cursor = today;
  if (!byDate.get(cursor) || !isPerfectDay(byDate.get(cursor)!)) {
    cursor = addDaysKey(cursor, -1);
  }

  let streak = 0;
  while (true) {
    const day = byDate.get(cursor);
    if (!day || !isPerfectDay(day)) break;
    streak += 1;
    cursor = addDaysKey(cursor, -1);
  }
  return streak;
}

export interface WeekDay {
  date: string;
  weekday: string;
  dayOfMonth: number;
  statuses: PrayerStatus[];
  completed: number;
  missed: number;
  pending: number;
}

export function weekData(state: AppState, today: string): WeekDay[] {
  const byDate = latestInstanceByDate(state);
  return weekDates(today).map((date) => {
    const instance = byDate.get(date);
    const statuses = PRAYER_NAMES.map(
      (name) => instance?.prayers[name] ?? 'pending',
    );
    return {
      date,
      weekday: weekdayShort(date),
      dayOfMonth: dayOfMonth(date),
      statuses,
      completed: statuses.filter((status) => status === 'completed').length,
      missed: statuses.filter((status) => status === 'missed').length,
      pending: statuses.filter((status) => status === 'pending').length,
    };
  });
}

export function progressPercent(day: DayInstance): number {
  return Math.round((completedCount(day) / PRAYER_NAMES.length) * 100);
}

export function todayKey(now: Date = new Date()): string {
  return toDateKey(now);
}
