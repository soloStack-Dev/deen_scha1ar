import { formatThoughtForCopy } from '../data/content.js';
import type { Thought } from '../data/types.js';
import { CopyButton } from './CopyButton.js';

interface ThoughtCardProps {
  thought: Thought;
}

export function ThoughtCard({ thought }: ThoughtCardProps) {
  return (
    <view className="thought-card">
      <text className="thought-card__quote">&quot;{thought.thought}&quot;</text>
      <text className="thought-card__author">- {thought.philosopher}</text>
      <view className="thought-card__action">
        <text className="thought-card__action-label">Try this today</text>
        <text className="thought-card__action-text">{thought.action}</text>
      </view>
      <view className="thought-card__footer">
        <text className="thought-card__note">
          Presented as a paraphrase; verify exact wording before quoting.
        </text>
        <CopyButton text={formatThoughtForCopy(thought)} />
      </view>
    </view>
  );
}
