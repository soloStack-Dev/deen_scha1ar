import type { Page } from '../state/types.js';

interface QuickActionsProps {
  onNavigate: (page: Page) => void;
  onMore: () => void;
}

const ACTIONS: Array<{
  label: string;
  glyph: string;
  page?: Page;
  more?: boolean;
}> = [
  { label: 'Iman', glyph: 'I', page: 'iman' },
  { label: 'Quran', glyph: 'Q', page: 'iman' },
  { label: 'Books', glyph: 'B', page: 'library' },
  { label: 'More', glyph: 'M', more: true },
];

export function QuickActions({ onNavigate, onMore }: QuickActionsProps) {
  return (
    <view className="quick-actions">
      {ACTIONS.map((action) => (
        <view
          key={action.label}
          className="quick-action"
          bindtap={() => {
            if (action.more) {
              onMore();
            } else if (action.page) {
              onNavigate(action.page);
            }
          }}
        >
          <view className="quick-action__circle">
            <text className="quick-action__glyph">{action.glyph}</text>
          </view>
          <text className="quick-action__label">{action.label}</text>
        </view>
      ))}
    </view>
  );
}
