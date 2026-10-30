const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function pad(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/** Local-time date key (YYYY-MM-DD). Never use toISOString here: it shifts days. */
export function toDateKey(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function fromDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, amount: number): Date {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

export function addDaysKey(key: string, amount: number): string {
  return toDateKey(addDays(fromDateKey(key), amount));
}

function utcDayNumber(key: string): number {
  const [year, month, day] = key.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

/** Whole calendar days between two local date keys. */
export function daysBetween(startKey: string, endKey: string): number {
  return Math.round((utcDayNumber(endKey) - utcDayNumber(startKey)) / 86_400_000);
}

/**
 * Seven-day content rotation: `(daysSinceInstall % 7) + 1`.
 * Negative values are clamped so a clock change cannot produce day 0.
 */
export function dayNumberForDate(installDate: string, today: string): number {
  const elapsed = Math.max(0, daysBetween(installDate, today));
  return (elapsed % 7) + 1;
}

export function formatLongDate(date: Date): string {
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function weekdayShort(key: string): string {
  return WEEKDAYS_SHORT[fromDateKey(key).getDay()];
}

export function dayOfMonth(key: string): number {
  return fromDateKey(key).getDate();
}

/** Monday-first week that contains `today`. */
export function weekDates(today: string): string[] {
  const date = fromDateKey(today);
  const offsetFromMonday = (date.getDay() + 6) % 7;
  const monday = addDays(date, -offsetFromMonday);
  return Array.from({ length: 7 }, (_, index) =>
    toDateKey(addDays(monday, index)),
  );
}

export function isToday(key: string, now: Date): boolean {
  return key === toDateKey(now);
}
