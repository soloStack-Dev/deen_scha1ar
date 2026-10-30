import { PRAYER_COLORS } from '../theme/tokens.js';
import { PRAYER_NAMES, PRAYER_STATUS_ICONS } from '../state/constants.js';
import type { PrayerStatus } from '../state/types.js';

interface ImanHeroCardProps {
  completed: number;
  total: number;
  statuses: PrayerStatus[];
  nextPrayerLabel: string;
  streak: number;
  onOpen: () => void;
}

/** The single focal element on Home: today's prayer state at a glance. */
export function ImanHeroCard({
  completed,
  total,
  statuses,
  nextPrayerLabel,
  streak,
  onOpen,
}: ImanHeroCardProps) {
  return (
    <view className="hero" bindtap={onOpen}>
      <view className="hero__top">
        <text className="hero__eyebrow">Today&apos;s iman</text>
        <view className="hero__pill">
          <text className="hero__pill-text">›</text>
        </view>
      </view>

      <view className="hero__count-row">
        <text className="hero__count">{completed}</text>
        <text className="hero__count-total"> / {total}</text>
        <text className="hero__count-label"> prayers</text>
      </view>

      <view className="hero__dots">
        {statuses.map((status, index) => (
          <view
            key={PRAYER_NAMES[index]}
            className="hero__dot"
            style={{ backgroundColor: PRAYER_COLORS[status] }}
          >
            <text className="hero__dot-icon">{PRAYER_STATUS_ICONS[status]}</text>
          </view>
        ))}
      </view>

      <view className="hero__meta">
        <text className="hero__next">Next: {nextPrayerLabel}</text>
        <text className="hero__streak">Streak {streak} days</text>
      </view>
    </view>
  );
}
