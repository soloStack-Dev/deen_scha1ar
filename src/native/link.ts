import { getNativeModule } from './getNativeModule.js';

interface LinkModule {
  open(url: string): void;
}

/**
 * Opens the legal source page in the host browser. Returns false when the host
 * has no link module so the caller can show the copyable URL fallback.
 */
export function openLink(url: string): boolean {
  const link = getNativeModule<LinkModule>('LinkModule');
  if (!link?.open) return false;
  try {
    link.open(url);
    return true;
  } catch (error) {
    console.warn('Link open failed', error);
    return false;
  }
}
