import React from 'react';
import Card from '../common/Card';
import ApiKeySettings from '../ApiKeySettings';
import SettingsModal from '../SettingsModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/storage';
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
    localStorage.removeItem(STORAGE_KEYS.PROFILE_DATA);
  };

  const handleJobCleared = () => {
    // 案件データは永続化していないため、何もしない
  };

  const handleAnalysisCleared = () => {
    localStorage.removeItem(STORAGE_KEYS.ANALYSIS_HISTORY);
  };

  const handleGeneratedProfileCleared = () => {
    localStorage.removeItem(STORAGE_KEYS.GENERATED_PROFILE);
  };

  const handleAllDataCleared = () => {
    const apiKey = localStorage.getItem(STORAGE_KEYS.API_KEY_CONFIG);
    localStorage.clear();
    if (apiKey) {
      localStorage.setItem(STORAGE_KEYS.API_KEY_CONFIG, apiKey);
    }
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
          onAnalysisCleared={handleAnalysisCleared}
          onGeneratedProfileCleared={handleGeneratedProfileCleared}
          onAllDataCleared={handleAllDataCleared}
        />
      )}
    </div>
  );
};

export default SettingsPage;
