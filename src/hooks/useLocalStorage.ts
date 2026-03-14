import { useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, getContextualStorageKey } from '../utils/storage';

/**
 * localStorageと同期するuseStateフック
 * デモモード時は専用のキーでデータを保存
 * モード切替時に自動的にストレージから再読込
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  // デモモードとの分離を考慮したキーを取得
  const contextualKey = getContextualStorageKey(key);
  
  // 初期値を取得
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = getStorageItem<T>(contextualKey);
    return item !== null ? item : initialValue;
  });

  // モード切替時にストレージから再読込
  useEffect(() => {
    const item = getStorageItem<T>(contextualKey);
    if (item !== null) {
      setStoredValue(item);
    } else {
      setStoredValue(initialValue);
    }
  }, [contextualKey, initialValue]);

  // 値を更新してlocalStorageに保存
  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      setStorageItem(contextualKey, valueToStore);
    } catch (error) {
      console.error(`Error saving to localStorage (${contextualKey}):`, error);
    }
  };

  return [storedValue, setValue];
}
