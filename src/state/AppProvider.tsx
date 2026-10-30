import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from '@lynx-js/react';
import type { ReactNode } from '@lynx-js/react';

import { toDateKey } from '../lib/date.js';
import { readPersistedState, writePersistedState } from '../native/storage.js';
import { createInitialState } from './defaults.js';
import { rootReducer } from './rootReducer.js';
import { parsePersistedState } from './schema.js';
import type { AppAction, AppState } from './types.js';

interface AppContextValue {
  state: AppState;
  dispatch: (action: AppAction) => void;
  hydrated: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

/**
 * One provider owns the whole app state. Home, Iman Tracker and Library read
 * from the same reducer, which guarantees the hero card and the tracker can
 * never disagree. Persistence is debounced to avoid a native write per tap.
 */
export function AppProvider({ children }: { children?: ReactNode }) {
  const [state, dispatch] = useReducer(rootReducer, undefined, () =>
    createInitialState(),
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    'background only';
    let cancelled = false;

    async function hydrate() {
      const raw = await readPersistedState();
      if (cancelled) return;
      const stored = parsePersistedState(raw);
      if (stored) {
        dispatch({ type: 'HYDRATE', state: stored, today: toDateKey(new Date()) });
      }
      setHydrated(true);
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    'background only';
    if (!hydrated) return undefined;
    const timer = setTimeout(() => {
      void writePersistedState(JSON.stringify(state));
    }, 150);
    return () => clearTimeout(timer);
  }, [state, hydrated]);

  useEffect(() => {
    'background only';
    if (!hydrated) return undefined;
    const timer = setInterval(() => {
      dispatch({ type: 'ENSURE_TODAY', today: toDateKey(new Date()) });
    }, 60_000);
    return () => clearInterval(timer);
  }, [hydrated]);

  const value = useMemo(
    () => ({ state, dispatch, hydrated }),
    [state, hydrated],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside <AppProvider>');
  return value;
}
