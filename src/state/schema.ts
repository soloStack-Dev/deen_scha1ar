import { z } from 'zod';
import type { AppState } from './types.js';

const prayerStatusSchema = z.enum(['pending', 'completed', 'missed']);

const prayersSchema = z.object({
  fajr: prayerStatusSchema,
  dhuhr: prayerStatusSchema,
  asr: prayerStatusSchema,
  maghrib: prayerStatusSchema,
  isha: prayerStatusSchema,
});

const dayInstanceSchema = z.object({
  id: z.string(),
  date: z.string(),
  prayers: prayersSchema,
  quranDone: z.boolean(),
  bukhariDone: z.boolean(),
  createdAt: z.number(),
  archivedAt: z.number().optional(),
});

const routineItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  done: z.boolean(),
  createdAt: z.number(),
});

const settingsSchema = z.object({
  installDate: z.string(),
  location: z.object({
    label: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
  calculationMethod: z.enum([
    'MuslimWorldLeague',
    'Egyptian',
    'Karachi',
    'UmmAlQura',
    'NorthAmerica',
  ]),
});

export const appStateSchema = z.object({
  version: z.literal(1),
  tracker: z.object({
    active: dayInstanceSchema,
    history: z.array(dayInstanceSchema),
  }),
  routine: z.array(routineItemSchema),
  settings: settingsSchema,
});

/**
 * Persisted JSON is untrusted input. Invalid or old shapes fall back to a fresh
 * state instead of crashing the app. This is why zod is a runtime dependency.
 */
export function parsePersistedState(raw: string | null): AppState | null {
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    const result = appStateSchema.safeParse(parsed);
    return result.success ? (result.data as AppState) : null;
  } catch {
    return null;
  }
}
