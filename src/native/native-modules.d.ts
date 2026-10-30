/**
 * Lynx exposes host-registered modules on the global `NativeModules` object.
 * The declaration is optional because the same bundle also runs in tests and in
 * a host that has not registered a module yet.
 */
declare const NativeModules: Record<string, unknown> | undefined;
