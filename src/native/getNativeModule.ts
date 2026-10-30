/**
 * Every native access goes through this guard so tests, preview builds and
 * hosts without the module never throw a ReferenceError.
 */
export function getNativeModule<T>(name: string): T | undefined {
  if (typeof NativeModules === 'undefined') return undefined;
  const candidate = NativeModules?.[name];
  return candidate && typeof candidate === 'object' ? (candidate as T) : undefined;
}
