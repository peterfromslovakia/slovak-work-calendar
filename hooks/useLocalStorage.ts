import { useState, useEffect } from 'react';

function getStorageValue<T,>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
        const parsed = JSON.parse(saved);
        if (defaultValue instanceof Set && Array.isArray(parsed)) {
            return new Set(parsed) as T;
        }
        if (defaultValue instanceof Map && Array.isArray(parsed)) {
            return new Map(parsed) as T;
        }
        return parsed;
    }
  }
  return defaultValue;
}

export const useLocalStorage = <T,>(key: string, defaultValue: T) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    if (value instanceof Set) {
        localStorage.setItem(key, JSON.stringify(Array.from(value)));
    } else if (value instanceof Map) {
        localStorage.setItem(key, JSON.stringify(Array.from(value.entries())));
    } else {
        localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue] as const;
};
