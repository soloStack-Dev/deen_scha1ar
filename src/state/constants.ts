import type { PrayerName, PrayerStatus } from './types.js';

export const PRAYER_NAMES: PrayerName[] = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

export const PRAYER_LABELS: Record<PrayerName, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export const PRAYER_STATUS_LABELS: Record<PrayerStatus, string> = {
  pending: 'Not marked',
  completed: 'Completed',
  missed: 'Missed',
};

export const PRAYER_STATUS_ICONS: Record<PrayerStatus, string> = {
  completed: '✓',
  missed: '✗',
  pending: '○',
};

export const PRAYER_CYCLE: Record<PrayerStatus, PrayerStatus> = {
  pending: 'completed',
  completed: 'missed',
  missed: 'pending',
};

export const DEFAULT_ROUTINE_LABELS = [
  'Fajr prayer',
  'Read Quran 10 min',
  'Read 20 pages',
  'Walk 20 min',
  'Evening dhikr',
];
