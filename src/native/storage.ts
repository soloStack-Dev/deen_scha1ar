import { getNativeModule } from './getNativeModule.js';

const STORAGE_KEY = 'dinam.appState.v1';

interface StorageModule {
  setStorageItem(key: string, value: string): void;
  getStorageItem(key: string, callback: (value: string) => void): void;
  clearStorage(): void;
}

const memory = new Map<string, string>();

/** Accepts either the host name or the generic name from the setup doc. */
function getStorage(): StorageModule | undefined {
  return (
    getNativeModule<StorageModule>('NativeLocalStorageModule') ??
    getNativeModule<StorageModule>('StorageModule')
  );
}

export async function readPersistedState(): Promise<string | null> {
  const storage = getStorage();
  if (!storage) return memory.get(STORAGE_KEY) ?? null;

  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    try {
      storage.getStorageItem(STORAGE_KEY, (value) => finish(value || null));
    } catch (error) {
      console.warn('Storage read failed, using in-memory fallback', error);
      finish(memory.get(STORAGE_KEY) ?? null);
    }

    setTimeout(() => finish(memory.get(STORAGE_KEY) ?? null), 1_000);
  });
}

export async function writePersistedState(value: string): Promise<void> {
  memory.set(STORAGE_KEY, value);
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setStorageItem(STORAGE_KEY, value);
  } catch (error) {
    console.warn('Storage write failed, using in-memory fallback', error);
  }
}

export async function clearPersistedState(): Promise<void> {
  memory.delete(STORAGE_KEY);
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.clearStorage();
  } catch (error) {
    console.warn('Storage clear failed', error);
  }
}

/** Test-only helper; keeps state isolated between Rstest cases. */
export function __resetMemoryStorageForTests(): void {
  memory.clear();
}
