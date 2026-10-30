import {
  PRAYER_LABELS,
  PRAYER_STATUS_ICONS,
  PRAYER_STATUS_LABELS,
} from '../state/constants.js';
import type { PrayerName, PrayerStatus } from '../state/types.js';

interface PrayerBoxProps {
  name: PrayerName;
  status: PrayerStatus;
  onChange: (status: PrayerStatus) => void;
}

const NEXT: Record<PrayerStatus, PrayerStatus> = {
  pending: 'completed',
  completed: 'missed',
  missed: 'pending',
};

/** One tap advances pending -> completed -> missed -> pending. */
export function PrayerBox({ name, status, onChange }: PrayerBoxProps) {
  return (
    <view
      className={`prayer prayer--${status}`}
      bindtap={() => onChange(NEXT[status])}
    >
      <text className="prayer__icon">{PRAYER_STATUS_ICONS[status]}</text>
      <text className="prayer__name">{PRAYER_LABELS[name]}</text>
      <text className="prayer__state">{PRAYER_STATUS_LABELS[status]}</text>
    </view>
  );
}
