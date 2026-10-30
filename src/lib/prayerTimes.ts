import { CalculationMethod, Coordinates, PrayerTimes } from 'adhan';
import type {
  CalculationMethodId,
  PrayerName,
  Settings,
} from '../state/types.js';
import { PRAYER_LABELS } from '../state/constants.js';
import { addDays } from './date.js';

const METHOD_FACTORY: Record<CalculationMethodId, () => ReturnType<typeof CalculationMethod.MuslimWorldLeague>> = {
  MuslimWorldLeague: CalculationMethod.MuslimWorldLeague,
  Egyptian: CalculationMethod.Egyptian,
  Karachi: CalculationMethod.Karachi,
  UmmAlQura: CalculationMethod.UmmAlQura,
  NorthAmerica: CalculationMethod.NorthAmerica,
};

const PRAYER_ORDER: PrayerName[] = [
  'fajr',
  'dhuhr',
  'asr',
  'maghrib',
  'isha',
];

export interface NextPrayer {
  name: PrayerName;
  label: string;
  at: Date;
}

export function formatTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${minutes < 10 ? `0${minutes}` : minutes} ${suffix}`;
}

/**
 * Computes the next of the five prayers instead of hard-coding times.
 * The schedule is built from today plus tomorrow's Fajr so the label stays
 * correct after Isha and across midnight.
 */
export function getNextPrayer(
  settings: Settings,
  now: Date = new Date(),
): NextPrayer {
  try {
    const coordinates = new Coordinates(
      settings.location.latitude,
      settings.location.longitude,
    );
    const parameters = METHOD_FACTORY[settings.calculationMethod]();
    const today = new PrayerTimes(coordinates, now, parameters);
    const tomorrow = new PrayerTimes(coordinates, addDays(now, 1), parameters);

    const candidates: NextPrayer[] = PRAYER_ORDER.map((name) => ({
      name,
      at: today[name],
      label: `${PRAYER_LABELS[name]} · ${formatTime(today[name])}`,
    }));

    candidates.push({
      name: 'fajr',
      at: tomorrow.fajr,
      label: `${PRAYER_LABELS.fajr} · ${formatTime(tomorrow.fajr)}`,
    });

    const next = candidates.find((item) => item.at.getTime() > now.getTime());
    return next ?? candidates[candidates.length - 1];
  } catch (error) {
    console.warn('Prayer times unavailable', error);
    return {
      name: 'fajr',
      at: now,
      label: 'Prayer times unavailable',
    };
  }
}
