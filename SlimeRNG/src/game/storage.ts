const SAVE_KEY = "slime-rng-save-v1";

export function loadSave<T>(fallback: T): T {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return fallback;
    return { ...fallback, ...JSON.parse(raw) } as T;
  } catch {
    return fallback;
  }
}

export function writeSave<T>(data: T) {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {
    // Ignore write failures, game remains playable in-memory.
  }
}

export function clearSave() {
  try {
    window.localStorage.removeItem(SAVE_KEY);
  } catch {
    // no-op
  }
}
