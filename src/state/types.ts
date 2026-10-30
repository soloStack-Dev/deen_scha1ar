export type Page = 'home' | 'iman' | 'library';

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type PrayerStatus = 'pending' | 'completed' | 'missed';

export type ReadingKey = 'quranDone' | 'bukhariDone';

export type CalculationMethodId =
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'NorthAmerica';

export interface DayInstance {
  id: string;
  date: string;
  prayers: Record<PrayerName, PrayerStatus>;
  quranDone: boolean;
  bukhariDone: boolean;
  createdAt: number;
  archivedAt?: number;
}

export interface TrackerState {
  active: DayInstance;
  history: DayInstance[];
}

export interface RoutineItem {
  id: string;
  label: string;
  done: boolean;
  createdAt: number;
}

export interface UserLocation {
  label: string;
  latitude: number;
  longitude: number;
}

export interface Settings {
  installDate: string;
  location: UserLocation;
  calculationMethod: CalculationMethodId;
}

export interface AppState {
  version: 1;
  tracker: TrackerState;
  routine: RoutineItem[];
  settings: Settings;
}

export type AppAction =
  | { type: 'HYDRATE'; state: AppState; today: string }
  | { type: 'ENSURE_TODAY'; today: string }
  | { type: 'CYCLE_PRAYER'; prayer: PrayerName }
  | { type: 'TOGGLE_READING'; key: ReadingKey }
  | { type: 'FINISH_DAY'; today: string }
  | { type: 'TOGGLE_ROUTINE'; id: string }
  | { type: 'ADD_ROUTINE'; item: RoutineItem }
  | { type: 'DELETE_ROUTINE'; id: string }
  | { type: 'CLEAR_HISTORY' };
