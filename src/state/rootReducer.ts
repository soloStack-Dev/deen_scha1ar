import { clearHistory, cyclePrayer, ensureToday, finishDay, toggleReading } from './trackerReducer.js';
import { addRoutine, deleteRoutine, toggleRoutine } from './routineReducer.js';
import type { AppAction, AppState } from './types.js';

export function rootReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return ensureToday(action.state, action.today);
    case 'ENSURE_TODAY':
      return ensureToday(state, action.today);
    case 'CYCLE_PRAYER':
      return cyclePrayer(state, action.prayer);
    case 'TOGGLE_READING':
      return toggleReading(state, action.key);
    case 'FINISH_DAY':
      return finishDay(state, action.today);
    case 'TOGGLE_ROUTINE':
      return toggleRoutine(state, action.id);
    case 'ADD_ROUTINE':
      return addRoutine(state, action.item);
    case 'DELETE_ROUTINE':
      return deleteRoutine(state, action.id);
    case 'CLEAR_HISTORY':
      return clearHistory(state);
    default:
      return state;
  }
}
