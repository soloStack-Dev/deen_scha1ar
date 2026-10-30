import type { Ayah, Thought } from '../data/types.js';

interface DailySparkRowProps {
  ayah: Ayah;
  thought: Thought;
  onOpenAyah: () => void;
  onOpenThought: () => void;
}

export function DailySparkRow({
  ayah,
  thought,
  onOpenAyah,
  onOpenThought,
}: DailySparkRowProps) {
  return (
    <scroll-view className="spark-row" scroll-x>
      <view className="spark-row__inner">
        <view className="spark-card spark-card--ayah" bindtap={onOpenAyah}>
          <text className="spark-card__eyebrow">Ayah · Day {ayah.day}/7</text>
          <text className="spark-card__title">{ayah.translation}</text>
          <text className="spark-card__ref">Qur&apos;an {ayah.reference}</text>
        </view>
        <view className="spark-card spark-card--thought" bindtap={onOpenThought}>
          <text className="spark-card__eyebrow">Thought · Day {thought.day}/7</text>
          <text className="spark-card__title">{thought.thought}</text>
          <text className="spark-card__ref">{thought.philosopher}</text>
        </view>
      </view>
    </scroll-view>
  );
}
