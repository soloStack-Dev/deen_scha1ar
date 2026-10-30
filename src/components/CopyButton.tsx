import { useEffect, useRef, useState } from '@lynx-js/react';

import { copyText } from '../native/clipboard.js';

interface CopyButtonProps {
  text: string;
  label?: string;
  fallback?: 'sheet' | 'hint';
}

/**
 * Shared by ayah, thought and card copy actions. Native clipboard support is
 * optional, so a failed copy opens a selectable fallback instead of silently
 * doing nothing.
 */
export function CopyButton({
  text,
  label = 'Copy',
  fallback = 'sheet',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    'background only';
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleTap() {
    'background only';
    void (async () => {
      const ok = await copyText(text);
      if (ok) {
        setFailed(false);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), 1500);
      } else if (fallback === 'hint') {
        setFailed(true);
      } else {
        setShowFallback(true);
      }
    })();
  }

  function closeFallback() {
    setShowFallback(false);
  }

  const labelText = copied
    ? 'Copied'
    : failed
      ? 'Long-press above'
      : showFallback
        ? 'Select & copy'
        : label;

  return (
    <view className="copy-wrap">
      <view
        className={`copy-button ${copied ? 'copy-button--copied' : ''}`}
        bindtap={handleTap}
      >
        <text className="copy-button__label">{labelText}</text>
      </view>

      {failed && fallback === 'hint' ? (
        <text className="copy-hint">
          This host cannot copy automatically. Long-press the address above,
          choose Select All, then Copy.
        </text>
      ) : null}

      {showFallback ? (
        <view className="copy-fallback">
          <view className="copy-fallback__card">
            <text className="copy-fallback__title">Select and copy</text>
            <text className="copy-fallback__hint">
              Long-press the text below, choose Select All, then Copy.
            </text>
            <scroll-view className="copy-fallback__scroll" scroll-y>
              <text className="copy-fallback__text" text-selection={true} flatten={false}>
                {text}
              </text>
            </scroll-view>
            <view className="button button--dark copy-fallback__close" bindtap={closeFallback}>
              <text className="button__label button__label--light">Close</text>
            </view>
          </view>
        </view>
      ) : null}
    </view>
  );
}
