interface ConfirmSheetProps {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmSheet({
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmSheetProps) {
  return (
    <view className="sheet-backdrop" bindtap={onCancel}>
      <view className="sheet-card" catchtap={() => {}}>
        <text className="sheet__title">{title}</text>
        <text className="sheet__message">{message}</text>
        <view className="sheet__actions">
          <view className="button button--ghost" bindtap={onCancel}>
            <text className="button__label">{cancelLabel}</text>
          </view>
          <view
            className={`button ${danger ? 'button--danger' : 'button--dark'}`}
            bindtap={onConfirm}
          >
            <text className="button__label button__label--light">{confirmLabel}</text>
          </view>
        </view>
      </view>
    </view>
  );
}
