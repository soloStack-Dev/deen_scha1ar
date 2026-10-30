import type { AppState, RoutineItem } from './types.js';

export function toggleRoutine(state: AppState, id: string): AppState {
  return {
    ...state,
    routine: state.routine.map((item) =>
      item.id === id ? { ...item, done: !item.done } : item,
    ),
  };
}

export function addRoutine(state: AppState, item: RoutineItem): AppState {
  const label = item.label.trim();
  if (!label) return state;
  return {
    ...state,
    routine: [...state.routine, { ...item, label }],
  };
}

export function deleteRoutine(state: AppState, id: string): AppState {
  return {
    ...state,
    routine: state.routine.filter((item) => item.id !== id),
  };
}
