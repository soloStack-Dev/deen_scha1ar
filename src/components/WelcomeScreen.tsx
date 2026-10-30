import './WelcomeScreen.css';

import { HomeGallery } from './HomeGallery.js';

interface WelcomeScreenProps {
  onEnter: () => void;
}

export function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  return (
    <view className="welcome">
      <view className="welcome__glow welcome__glow--one" />
      <view className="welcome__glow welcome__glow--two" />

      <view className="welcome__content">
        <text className="welcome__eyebrow">A daily rhythm</text>
        <text className="welcome__wordmark">Deensch1ar</text>
        <text className="welcome__tagline">Pray. Read. Reflect. Repeat.</text>

        <HomeGallery />

        <view className="welcome__cta" bindtap={onEnter}>
          <text className="welcome__cta-label">Go to page</text>
          <view className="welcome__cta-arrow">
            <text className="welcome__cta-arrow-text">&#8594;</text>
          </view>
        </view>
      </view>
    </view>
  );
}
