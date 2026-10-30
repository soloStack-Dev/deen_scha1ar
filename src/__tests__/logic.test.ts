import { expect, test } from '@rstest/core';

import {
  BOOKS,
  filterBooks,
  formatAyahForCopy,
  getAyah,
} from '../data/content.js';
import { dayNumberForDate, toDateKey, weekDates } from '../lib/date.js';
import { createInitialState } from '../state/defaults.js';
import { parsePersistedState } from '../state/schema.js';
import {
  currentStreak,
  isPerfectDay,
  weekData,
} from '../state/selectors.js';
import { PRAYER_NAMES } from '../state/constants.js';
import {
  clearHistory,
  cyclePrayer,
  ensureToday,
  finishDay,
} from '../state/trackerReducer.js';

function completeAllPrayers(state: ReturnType<typeof createInitialState>) {
  return PRAYER_NAMES.reduce(
    (next, name) => cyclePrayer(next, name),
    state,
  );
}

test('a prayer advances pending -> completed -> missed -> pending', () => {
  const state = createInitialState(new Date(2026, 9, 30));
  const completed = cyclePrayer(state, 'fajr');
  const missed = cyclePrayer(completed, 'fajr');
  const reset = cyclePrayer(missed, 'fajr');

  expect(completed.tracker.active.prayers.fajr).toBe('completed');
  expect(missed.tracker.active.prayers.fajr).toBe('missed');
  expect(reset.tracker.active.prayers.fajr).toBe('pending');
});

test('finishing a day archives it and starts a fresh pending day', () => {
  const state = completeAllPrayers(createInitialState(new Date(2026, 9, 30)));
  const next = finishDay(state, '2026-10-30', 1234);

  expect(next.tracker.history).toHaveLength(1);
  expect(next.tracker.history[0].archivedAt).toBe(1234);
  expect(isPerfectDay(next.tracker.history[0])).toBe(true);
  expect(isPerfectDay(next.tracker.active)).toBe(false);
  expect(next.tracker.active.id).not.toBe(state.tracker.active.id);
});

test('clearing history then finishing still creates a unique day id', () => {
  let state = finishDay(createInitialState(new Date(2026, 9, 30)), '2026-10-30', 100);
  state = clearHistory(state);
  const next = finishDay(state, '2026-10-30', 200);

  expect(next.tracker.history).toHaveLength(1);
  expect(next.tracker.active.id).not.toBe(next.tracker.history[0].id);
});

test('ensureToday is a no-op on the same day and rolls over on a new day', () => {
  const state = createInitialState(new Date(2026, 9, 30));
  expect(ensureToday(state, '2026-10-30')).toBe(state);

  const next = ensureToday(state, '2026-10-31');
  expect(next.tracker.active.date).toBe('2026-10-31');
  expect(next.tracker.history).toHaveLength(1);
});

test('streaks count perfect consecutive days', () => {
  let state = completeAllPrayers(createInitialState(new Date(2026, 9, 29)));
  state = finishDay(state, '2026-10-30', 100);
  state = completeAllPrayers(state);

  expect(currentStreak(state, '2026-10-30')).toBe(2);
});

test('weekData always returns seven days including empty past days', () => {
  const state = createInitialState(new Date(2026, 9, 30));
  const week = weekData(state, '2026-10-30');

  expect(week).toHaveLength(7);
  expect(week[0].date).toBe('2026-10-26');
  expect(week[4].statuses.every((status) => status === 'pending')).toBe(true);
});

test('content rotation is one-based and wraps every seven days', () => {
  expect(dayNumberForDate('2026-10-30', '2026-10-30')).toBe(1);
  expect(dayNumberForDate('2026-10-30', '2026-10-31')).toBe(2);
  expect(dayNumberForDate('2026-10-30', '2026-11-06')).toBe(1);
  expect(weekDates('2026-10-30')[0]).toBe('2026-10-26');
});

test('local date keys do not shift across days', () => {
  expect(toDateKey(new Date(2026, 0, 1, 23, 59))).toBe('2026-01-01');
});

test('adult books are excluded from the library', () => {
  const visible = filterBooks({ category: 'all', query: '' });
  const finance = filterBooks({ category: 'finance', query: '' });

  expect(BOOKS.some((book) => book.adultOnly)).toBe(true);
  expect(visible.some((book) => book.adultOnly)).toBe(false);
  expect(visible.length).toBe(BOOKS.filter((book) => !book.adultOnly).length);
  expect(finance.every((book) => book.category === 'finance')).toBe(true);
});

test('copy text keeps the reference, note and app credit', () => {
  const ayah = getAyah(1);
  const text = formatAyahForCopy(ayah);
  expect(text).toContain("Qur'an 94:5-6");
  expect(text).toContain('via Deensch1ar');
  expect(text).toContain(ayah.translation);
  expect(ayah.translationNote.toLowerCase()).toContain('paraphrased');
});

test('persisted state is validated before it is trusted', () => {
  const state = createInitialState(new Date(2026, 9, 30));
  const parsed = parsePersistedState(JSON.stringify(state));

  expect(parsed?.tracker.active.date).toBe('2026-10-30');
  expect(parsePersistedState('{"bad":true}')).toBeNull();
  expect(parsePersistedState('not json')).toBeNull();
  expect(parsePersistedState(null)).toBeNull();
});
