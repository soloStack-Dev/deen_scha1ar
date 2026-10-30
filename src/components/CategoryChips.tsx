import { CATEGORY_CHIPS } from '../data/content.js';
import type { BookCategory } from '../data/types.js';

interface CategoryChipsProps {
  selected: BookCategory | 'all';
  onSelect: (category: BookCategory | 'all') => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <scroll-view className="chips" scroll-x>
      <view className="chips__inner">
        {CATEGORY_CHIPS.map((chip) => (
          <view
            key={chip.id}
            className={`chip ${selected === chip.id ? 'chip--active' : ''}`}
            bindtap={() => onSelect(chip.id)}
          >
            <text className="chip__label">{chip.label}</text>
          </view>
        ))}
      </view>
    </scroll-view>
  );
}
