import { CopyButton } from './CopyButton.js';

interface SourceLinkSheetProps {
  label: string;
  url: string;
  onClose: () => void;
}

export function SourceLinkSheet({ label, url, onClose }: SourceLinkSheetProps) {
  return (
    <view className="sheet-backdrop" bindtap={onClose}>
      <view className="sheet-card" catchtap={() => {}}>
        <text className="sheet__title">Open source</text>
        <text className="sheet__message">
          This host cannot open external links. Copy the address below and paste
          it into your browser. If copying is unavailable, long-press the
          address and choose Select All.
        </text>

        <text className="sheet__section-title">{label}</text>
        <scroll-view className="link-sheet__url-wrap" scroll-y>
          <text className="link-sheet__url" text-selection={true} flatten={false}>
            {url}
          </text>
        </scroll-view>

        <view className="link-sheet__actions">
          <view className="button button--ghost" bindtap={onClose}>
            <text className="button__label">Close</text>
          </view>
          <CopyButton text={url} label="Copy link" fallback="hint" />
        </view>
      </view>
    </view>
  );
}
