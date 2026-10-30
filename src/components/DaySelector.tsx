interface DaySelectorProps {
  value: number;
  onChange: (day: number) => void;
}

const DAYS = [1, 2, 3, 4, 5, 6, 7];

export function DaySelector({ value, onChange }: DaySelectorProps) {
  return (
    <view className="day-selector">
      {DAYS.map((day) => (
        <view
          key={day}
          className={`day-selector__item ${value === day ? 'day-selector__item--active' : ''}`}
          bindtap={() => onChange(day)}
        >
          <text className="day-selector__text">{day}</text>
        </view>
      ))}
    </view>
  );
}
