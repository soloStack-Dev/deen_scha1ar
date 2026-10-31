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

export async function readStoredItem(key: string): Promise<string | null> {
  const storage = getStorage();
  if (!storage) return memory.get(key) ?? null;

  return new Promise((resolve) => {
    let settled = false;
    const finish = (value: string | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    try {
      storage.getStorageItem(key, (value) => finish(value || null));
    } catch (error) {
      console.warn('Storage read failed, using in-memory fallback', error);
      finish(memory.get(key) ?? null);
    }

    setTimeout(() => finish(memory.get(key) ?? null), 1_000);
  });
}

export async function writeStoredItem(key: string, value: string): Promise<void> {
  memory.set(key, value);
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setStorageItem(key, value);
  } catch (error) {
    console.warn('Storage write failed, using in-memory fallback', error);
  }
}

export async function removeStoredItem(key: string): Promise<void> {
  memory.delete(key);
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setStorageItem(key, '');
  } catch (error) {
    console.warn('Storage clear failed', error);
  }
}

export function readPersistedState(): Promise<string | null> {
  return readStoredItem(STORAGE_KEY);
}

export function writePersistedState(value: string): Promise<void> {
  return writeStoredItem(STORAGE_KEY, value);
}

export function clearPersistedState(): Promise<void> {
  return removeStoredItem(STORAGE_KEY);
}

/** Test-only helper; keeps state isolated between Rstest cases. */
export function __resetMemoryStorageForTests(): void {
  memory.clear();
}
