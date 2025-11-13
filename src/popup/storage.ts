type Key =
  | "is24HourFormat"
  | "lastSelectedDays"
  | "alarms"
  | "closedAlarms"
  | "trashedAlarms";

export const getFromStorage = <T = unknown>(key: Key): Promise<T | null> => {
  return new Promise(resolve => {
    chrome.storage.local.get(key, result => {
      resolve(result[key] ?? null);
    });
  });
};

export const setToStorage = <T = unknown>(
  key: Key,
  value: T
): Promise<void> => {
  return new Promise(resolve => {
    chrome.storage.local.set({ [key]: value }, () => {
      resolve();
    });
  });
};
