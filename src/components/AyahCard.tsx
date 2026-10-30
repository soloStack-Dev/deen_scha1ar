import { formatAyahForCopy } from '../data/content.js';
import type { Ayah } from '../data/types.js';
import { CopyButton } from './CopyButton.js';

interface AyahCardProps {
  ayah: Ayah;
}

export function AyahCard({ ayah }: AyahCardProps) {
  return (
    <view className="ayah-card">
      <text className="ayah-card__arabic">{ayah.arabic}</text>
      <text className="ayah-card__translation">&quot;{ayah.translation}&quot;</text>
      <text className="ayah-card__explanation">{ayah.explanation}</text>

      <view className="ayah-card__footer">
        <view className="ayah-card__meta">
          <text className="ayah-card__ref">Qur&apos;an {ayah.reference}</text>
          <text className="ayah-card__note">{ayah.translationNote}</text>
        </view>
        <CopyButton text={formatAyahForCopy(ayah)} />
      </view>
    </view>
  );
}
