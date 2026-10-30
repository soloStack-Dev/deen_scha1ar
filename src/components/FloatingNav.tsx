import type { Page } from '../state/types.js';

interface FloatingNavProps {
  page: Page;
  onChange: (page: Page) => void;
}

const ITEMS: Array<{ id: Page; label: string; center?: boolean }> = [
  { id: 'home', label: 'Home' },
  { id: 'iman', label: 'Iman', center: true },
  { id: 'library', label: 'Library' },
];

function HomeIcon() {
  return (
    <view className="nav-glyph nav-glyph--home">
      <view className="home-icon__roof" />
      <view className="home-icon__body" />
    </view>
  );
}

function ImanIcon() {
  return (
    <view className="nav-glyph nav-glyph--iman">
      <view className="iman-icon__moon" />
      <view className="iman-icon__cutout" />
      <view className="iman-icon__star" />
    </view>
  );
}

function LibraryIcon() {
  return (
    <view className="nav-glyph nav-glyph--library">
      <view className="library-icon__book library-icon__book--one" />
      <view className="library-icon__book library-icon__book--two" />
      <view className="library-icon__book library-icon__book--three" />
    </view>
  );
}

/** Floating dark pill nav; the centre Iman action stays lime. */
export function FloatingNav({ page, onChange }: FloatingNavProps) {
  return (
    <view className="floating-nav">
      {ITEMS.map((item) => (
        <view
          key={item.id}
          className={`nav-item ${page === item.id ? 'nav-item--active' : ''}`}
          bindtap={() => onChange(item.id)}
        >
          <view
            className={`nav-icon ${item.center ? 'nav-icon--center' : ''}`}
          >
            {item.id === 'home' && <HomeIcon />}
            {item.id === 'iman' && <ImanIcon />}
            {item.id === 'library' && <LibraryIcon />}
          </view>
          <text className="nav-label">{item.label}</text>
        </view>
      ))}
    </view>
  );
}
