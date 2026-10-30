/**
 * JS mirror of the CSS design tokens.
 * Use this file when a colour has to be computed in JS (charts, generated
 * book covers) so the palette never drifts from `tokens.css`.
 */
export const COLORS = {
  lime: '#C6F36B',
  limeDeep: '#A8E04A',
  mint: '#EEF9DD',
  ink: '#111411',
  white: '#FFFFFF',
  greyText: '#6B7280',
  greyLine: '#E3E8DC',
  done: '#22C55E',
  missed: '#EF4444',
  pending: '#E5E7EB',
} as const;

export const PRAYER_COLORS = {
  completed: COLORS.done,
  missed: COLORS.missed,
  pending: COLORS.pending,
} as const;

/** Stable, accessible cover colours for the offline book grid. */
export const COVER_COLORS = [
  '#C6F36B',
  '#A8E04A',
  '#BFE3FF',
  '#FFD6A5',
  '#E2D1FF',
  '#BDEBE3',
  '#FFC9C9',
  '#FFE08A',
] as const;

export function coverColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 997;
  }
  return COVER_COLORS[hash % COVER_COLORS.length];
}
