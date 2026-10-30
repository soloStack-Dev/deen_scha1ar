import { getNativeModule } from './getNativeModule.js';

type CopyMethod = (
  text: string,
  callback?: (ok?: boolean) => void,
) => void;

interface ClipboardModule {
  copy?: CopyMethod;
  setString?: CopyMethod;
}

interface WebClipboard {
  writeText?: (text: string) => Promise<void>;
}

function copyWithNative(method: CopyMethod, text: string): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };

    try {
      method(text, (ok) => finish(ok !== false));
    } catch (error) {
      console.warn('Clipboard copy failed', error);
      finish(false);
    }

    setTimeout(() => finish(false), 1_000);
  });
}

/**
 * Core Lynx has no clipboard API, so the host must register a clipboard
 * module. Web preview can use the browser clipboard instead. Resolving `false`
 * lets the CopyButton show a selectable fallback sheet.
 */
export async function copyText(text: string): Promise<boolean> {
  const webClipboard = (
    globalThis as {
      navigator?: { clipboard?: WebClipboard };
    }
  ).navigator?.clipboard;

  if (webClipboard?.writeText) {
    try {
      await webClipboard.writeText(text);
      return true;
    } catch (error) {
      console.warn('Web clipboard copy failed', error);
    }
  }

  for (const name of ['ClipboardModule', 'Clipboard', 'NativeClipboardModule']) {
    const clipboard = getNativeModule<ClipboardModule>(name);
    if (!clipboard) continue;

    if (clipboard.copy) return copyWithNative(clipboard.copy, text);
    if (clipboard.setString) return copyWithNative(clipboard.setString, text);
  }

  return false;
}
