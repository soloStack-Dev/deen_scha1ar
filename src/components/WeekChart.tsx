import { PRAYER_COLORS } from '../theme/tokens.js';
import type { WeekDay } from '../state/selectors.js';

interface WeekChartProps {
  data: WeekDay[];
  selectedDate: string;
  onSelect: (date: string) => void;
}

function summary(day: WeekDay): string {
  return `${day.completed} done · ${day.missed} missed · ${day.pending} pending`;
}

/** Seven stacked bars; tapping a day shows its exact prayer breakdown. */
export function WeekChart({ data, selectedDate, onSelect }: WeekChartProps) {
  const selected = data.find((day) => day.date === selectedDate) ?? data[0];

  return (
    <view className="week">
      <view className="week__bars">
        {data.map((day) => (
          <view
            key={day.date}
            className={`week__column ${day.date === selectedDate ? 'week__column--active' : ''}`}
            bindtap={() => onSelect(day.date)}
          >
            <view className="week__stack">
              {day.statuses.map((status, index) => (
                <view
                  key={`${day.date}-${index}`}
                  className="week__segment"
                  style={{ backgroundColor: PRAYER_COLORS[status] }}
                />
              ))}
            </view>
            <text className="week__weekday">{day.weekday.slice(0, 1)}</text>
            <text className="week__day">{day.dayOfMonth}</text>
          </view>
        ))}
      </view>
      {selected ? (
        <text className="week__caption">
          {selected.weekday} {selected.dayOfMonth} · {summary(selected)}
        </text>
      ) : null}
    </view>
  );
}
