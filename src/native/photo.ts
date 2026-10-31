import { getNativeModule } from './getNativeModule.js';

interface PhotoModule {
  pickPhoto?: (callback: (uri: string | null) => void) => void;
  chooseImage?: (callback: (uri: string | null) => void) => void;
}

/**
 * Asks the host for a device photo. Returns null when the host has not
 * registered a picker, so the profile sheet can show a graceful fallback.
 */
export function pickDevicePhoto(): Promise<string | null> {
  const photoModule =
    getNativeModule<PhotoModule>('PhotoPickerModule') ??
    getNativeModule<PhotoModule>('ImagePickerModule');

  const pick = photoModule?.pickPhoto ?? photoModule?.chooseImage;
  if (!photoModule || !pick) return Promise.resolve(null);

  return new Promise((resolve) => {
    let settled = false;
    const finish = (uri: string | null) => {
      if (settled) return;
      settled = true;
      resolve(uri || null);
    };

    try {
      pick.call(photoModule, finish);
    } catch (error) {
      console.warn('Device photo picker failed', error);
      finish(null);
    }

    setTimeout(() => finish(null), 30_000);
  });
}
