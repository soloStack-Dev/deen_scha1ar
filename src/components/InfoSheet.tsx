import { useState } from '@lynx-js/react';

interface InfoSheetProps {
  onClose: () => void;
  onOpenLink: (url: string, label: string) => void;
  onClearHistory: () => void;
}

const SOURCES = [
  { label: "Qur'an text", url: 'https://quran.com' },
  { label: 'Hadith references', url: 'https://sunnah.com' },
  { label: 'Project Gutenberg', url: 'https://www.gutenberg.org' },
  { label: 'OpenStax', url: 'https://openstax.org' },
];

export function InfoSheet({
  onClose,
  onOpenLink,
  onClearHistory,
}: InfoSheetProps) {
  const [askClear, setAskClear] = useState(false);

  function openSource(url: string, label: string) {
    onOpenLink(url, label);
  }

  return (
    <view className="sheet-backdrop" bindtap={onClose}>
      <view className="sheet-card sheet-card--tall" catchtap={() => {}}>
        <text className="sheet__title">About Deensch1ar</text>
        <text className="sheet__message">
          Deensch1ar keeps your prayer log, routine and reading in one place.
          Your data stays on this device.
        </text>

        <text className="sheet__section-title">Content sources</text>
        {SOURCES.map((source) => (
          <view
            key={source.url}
            className="sheet__row"
            bindtap={() => openSource(source.url, source.label)}
          >
            <text className="sheet__row-label">{source.label}</text>
            <text className="sheet__row-action">Open</text>
          </view>
        ))}
        <text className="sheet__note">
          Qur&apos;an translations are paraphrased until a licensed translation
          is added. Hadith wording is never bundled: it opens from Sunnah.com.
        </text>

        <text className="sheet__section-title">History</text>
        {askClear ? (
          <view className="sheet__confirm">
            <text className="sheet__message">
              Clear archived days? The active day stays.
            </text>
            <view className="sheet__actions">
              <view className="button button--ghost" bindtap={() => setAskClear(false)}>
                <text className="button__label">Cancel</text>
              </view>
              <view
                className="button button--danger"
                bindtap={() => {
                  onClearHistory();
                  setAskClear(false);
                }}
              >
                <text className="button__label button__label--light">Clear history</text>
              </view>
            </view>
          </view>
        ) : (
          <view className="sheet__row" bindtap={() => setAskClear(true)}>
            <text className="sheet__row-label">Clear history</text>
            <text className="sheet__row-action">Open</text>
          </view>
        )}

        <view className="button button--dark sheet__wide-button" bindtap={onClose}>
          <text className="button__label button__label--light">Close</text>
        </view>
      </view>
    </view>
  );
}
