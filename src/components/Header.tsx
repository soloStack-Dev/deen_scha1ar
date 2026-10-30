interface HeaderProps {
  name?: string;
  onNotifications?: () => void;
  onRedirect?: () => void;
}

export function Header({
  name = 'Faleel',
  onNotifications,
  onRedirect,
}: HeaderProps) {
  return (
    <view className="header">
      <view className="header__avatar">
        <text className="header__avatar-text">{name.slice(0, 1)}</text>
      </view>
      <view className="header__copy">
        <text className="header__greeting">Assalamu Alaikum,</text>
        <text className="header__name">{name}</text>
      </view>
      <view className="header__actions">
        <view className="header__redirect" bindtap={onRedirect}>
          <text className="header__redirect-icon">&#8592;</text>
        </view>
        <view className="header__bell" bindtap={onNotifications}>
          <view className="header__bell-shape" />
          <view className="header__bell-base" />
          <view className="header__bell-clapper" />
        </view>
      </view>
    </view>
  );
}
