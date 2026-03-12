import { useState } from 'react';
import { getStorageItem, setStorageItem } from '../utils/storage';

/**
 * localStorageと同期するuseStateフック
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // 初期値を取得
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getStorageItem<T>(key);
    return item !== null ? item : initialValue;
  });

  // 値を更新してlocalStorageに保存
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setStorageItem(key, valueToStore);
    } catch (error) {
      console.error(`Error saving to localStorage (${key}):`, error);
    }
  };

  return [storedValue, setValue];
}
