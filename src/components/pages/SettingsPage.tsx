import React from 'react';
import Card from '../common/Card';
import ApiKeySettings from '../ApiKeySettings';
import SettingsModal from '../SettingsModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS, clearStorageByPrefix, getContextualStorageKey } from '../../utils/storage';
import type { ApiKeyConfig } from '../../types';
import './SettingsPage.css';

/**
 * 設定ページ
 * 
 * APIキー設定とデータ管理を行うページ。
 */
const SettingsPage: React.FC = () => {
  const [apiConfig, setApiConfig] = useLocalStorage<ApiKeyConfig | null>(
    STORAGE_KEYS.API_KEY_CONFIG,
    null
  );

  const [showDataSettings, setShowDataSettings] = React.useState(false);

  // データクリアコールバック
  const handleProfileCleared = () => {
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.PROFILE_DATA));
    // ページをリロードして状態を更新
    window.location.reload();
  };

  const handleJobCleared = () => {
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.JOB_DATA));
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.ANALYSIS_RESULT));
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.ANALYSIS_HISTORY));
    // ページをリロードして状態を更新
    window.location.reload();
  };

  const handleApplicationCleared = () => {
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_TEXT));
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_DRAFTS));
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_CHAT_HISTORIES));
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_TEXT_GENERIC));
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_GENERIC_CHAT));
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.ANALYSIS_CHAT_HISTORIES));
    // ページをリロードして状態を更新
    window.location.reload();
  };

  const handleGeneratedProfileCleared = () => {
    localStorage.removeItem(getContextualStorageKey(STORAGE_KEYS.GENERATED_PROFILE));
    // ページをリロードして状態を更新
    window.location.reload();
  };

  const handleAllDataCleared = () => {
    const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY_CONFIG);
    clearStorageByPrefix();
    if (apiKey) {
      localStorage.setItem(STORAGE_KEYS.API_KEY_CONFIG, apiKey);
    }
    // ページをリロードして状態を更新
    window.location.reload();
  };

  return (
    <div className="settings-page">
      <h1 className="page-title">設定</h1>
      
      <Card title="API設定">
        <ApiKeySettings 
          config={apiConfig}
          onChange={setApiConfig}
        />
      </Card>

      <Card title="データ管理">
        <div className="data-management">
          <p>保存されているデータの削除や管理を行います。</p>
          <button 
            className="btn-secondary"
            onClick={() => setShowDataSettings(true)}
          >
            データ管理を開く
          </button>
        </div>
      </Card>

      {showDataSettings && (
        <SettingsModal
          isOpen={showDataSettings}
          onClose={() => setShowDataSettings(false)}
          onProfileCleared={handleProfileCleared}
          onJobCleared={handleJobCleared}
          onApplicationCleared={handleApplicationCleared}
          onGeneratedProfileCleared={handleGeneratedProfileCleared}
          onAllDataCleared={handleAllDataCleared}
        />
      )}
    </div>
  );
};

export default SettingsPage;
