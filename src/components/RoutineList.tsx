import { useState } from '@lynx-js/react';

import type { RoutineItem } from '../state/types.js';

interface RoutineListProps {
  items: RoutineItem[];
  onToggle: (id: string) => void;
  onAdd: (label: string) => void;
  onDelete: (id: string) => void;
}

interface InputEvent {
  detail: { value: string };
}

export function RoutineList({ items, onToggle, onAdd, onDelete }: RoutineListProps) {
  const [draft, setDraft] = useState('');
  const [inputKey, setInputKey] = useState(0);

  function handleInput(event: InputEvent) {
    setDraft(event.detail.value);
  }

  function handleAdd() {
    'background only';
    const label = draft.trim();
    if (!label) return;
    onAdd(label);
    setDraft('');
    setInputKey((key) => key + 1);
  }

  return (
    <view className="routine">
      {items.length === 0 ? (
        <view className="routine__empty">
          <text className="routine__empty-text">No routine yet. Add your first task.</text>
        </view>
      ) : (
        items.map((item) => (
          <view
            key={item.id}
            className={`routine__row ${item.done ? 'routine__row--done' : ''}`}
          >
            <view className="routine__main" bindtap={() => onToggle(item.id)}>
              <view className={`routine__check ${item.done ? 'routine__check--done' : ''}`}>
                <text className="routine__check-icon">{item.done ? '✓' : ''}</text>
              </view>
              <text className="routine__label">{item.label}</text>
            </view>
            <view className="routine__delete" bindtap={() => onDelete(item.id)}>
              <text className="routine__delete-text">Remove</text>
            </view>
          </view>
        ))
      )}

      <view className="routine__add">
        <input
          key={inputKey}
          className="routine__input"
          default-value={draft}
          placeholder="Add a task"
          bindinput={handleInput}
        />
        <view className="routine__add-button" bindtap={handleAdd}>
          <text className="routine__add-text">Add task</text>
        </view>
      </view>
    </view>
  );
}
