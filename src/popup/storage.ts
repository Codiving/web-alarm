export const getFromStorage = <T = unknown>(key: string): Promise<T | null> => {
  return new Promise(resolve => {
    chrome.storage.local.get(key, result => {
      resolve(result[key] ?? null);
    });
  });
};
