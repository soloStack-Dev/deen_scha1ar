import type { ReactNode } from '@lynx-js/react';

import './Auth.css';

interface AuthFrameProps {
  art: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  onBack: () => void;
  children?: ReactNode;
}

export function AuthFrame({
  art,
  eyebrow,
  title,
  subtitle,
  onBack,
  children,
}: AuthFrameProps) {
  return (
    <view className="auth">
      <image className="auth__art" src={art} mode="aspectFill" />
      <view className="auth__veil" />

      <view className="auth__topbar">
        <view className="auth__back" bindtap={onBack}>
          <text className="auth__back-glyph">&#8592;</text>
        </view>
        <text className="auth__brand">Deensch1ar</text>
        <view className="auth__topbar-spacer" />
      </view>

      <view className="auth__hero">
        <text className="auth__eyebrow">{eyebrow}</text>
        <text className="auth__title">{title}</text>
        <text className="auth__subtitle">{subtitle}</text>
      </view>

      <view className="auth__sheet">
        <scroll-view className="auth__scroll" scroll-y>
          <view className="auth__form">{children}</view>
        </scroll-view>
      </view>
    </view>
  );
}
