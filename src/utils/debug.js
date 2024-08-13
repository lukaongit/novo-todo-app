const DEBUG = true;

export function debug(...args) {
  if (DEBUG) {
    console.log('[DEBUG]', ...args);
  }
}