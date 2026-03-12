/**
 * localStorageのキープレフィックス
 */
const KEY_PREFIX = 'aijobinsight_';

/**
 * localStorageのキー定義
 */
export const STORAGE_KEYS = {
  API_KEY_CONFIG: `${KEY_PREFIX}api_key_config`,
  PROFILE_DATA: `${KEY_PREFIX}profile_data`,
  GENERATED_PROFILE: `${KEY_PREFIX}generated_profile`,
  JOB_DATA: `${KEY_PREFIX}job_data`,
  ANALYSIS_RESULT: `${KEY_PREFIX}analysis_result`,
  ANALYSIS_HISTORY: `${KEY_PREFIX}analysis_history`,
  APPLICATION_TEXT: `${KEY_PREFIX}application_text`,
  LINKED_JOB_INFO: `${KEY_PREFIX}linked_job_info`,
  TEMPLATES: `${KEY_PREFIX}templates`,
  PLANNED_APPLICATIONS: `${KEY_PREFIX}planned_applications`,
  SETTINGS: `${KEY_PREFIX}settings`,
} as const;

/**
 * localStorageからデータを取得
 */
export function getStorageItem<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * localStorageにデータを保存
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * localStorageからデータを削除
 */
export function removeStorageItem(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * 特定のプレフィックスを持つすべてのキーを削除
 */
export function clearStorageByPrefix(prefix: string = KEY_PREFIX): boolean {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage with prefix (${prefix}):`, error);
    return false;
  }
}

/**
 * すべてのアプリデータを初期化
 */
export function initializeStorage(): boolean {
  return clearStorageByPrefix(KEY_PREFIX);
}
