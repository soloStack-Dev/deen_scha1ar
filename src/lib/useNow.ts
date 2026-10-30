import { useEffect, useState } from '@lynx-js/react';

/**
 * A minute-level clock for labels that must stay correct while the app is open
 * (next prayer, today's date). Kept out of global state so it never triggers a
 * persistence write.
 */
export function useNow(intervalMs = 60_000): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    'background only';
    const timer = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return now;
}
