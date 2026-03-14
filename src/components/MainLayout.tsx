import { useState } from 'react';
import ApiKeySettings from './ApiKeySettings';
import ProfileInput from './ProfileInput';
import JobInput from './JobInput';
import AnalysisButton from './AnalysisButton';
import AnalysisResult from './AnalysisResult';
import ChatInterface from './ChatInterface';
import SettingsModal from './SettingsModal';
import type { ApiKeyConfig, ProfileData, JobData, AnalysisResult as AnalysisResultType, GeneratedProfileText } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS, isDemoMode } from '../utils/storage';
import { analyzeJob } from '../services/aiService';

function MainLayout() {
  // ステート管理
  const [apiConfig, setApiConfig] = useLocalStorage<ApiKeyConfig | null>(
    STORAGE_KEYS.API_KEY_CONFIG,
    null
  );
  const [profileData, setProfileData] = useLocalStorage<ProfileData | null>(
    STORAGE_KEYS.PROFILE_DATA,
    null
  );
  const [generatedProfileText, setGeneratedProfileText] = useLocalStorage<GeneratedProfileText | null>(
    STORAGE_KEYS.GENERATED_PROFILE,
    null
  );
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // 分析実行
  const handleAnalyze = async () => {
    // デモモード時はAPIキーチェックをスキップ
    if (!apiConfig && !isDemoMode()) {
      setError('APIキーが設定されていません');
      return;
    }
    if (!profileData || !profileData.selfIntroduction || !profileData.skills.length || !profileData.achievements || !profileData.specialty) {
      setError('プロフィール情報の必須項目をすべて入力してください');
      return;
    }
    if (!jobData || !jobData.description) {
      setError('案件説明を入力してください');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeJob({
        profile: profileData,
        job: jobData,
        config: apiConfig || { service: 'openai', apiKey: '', modelName: '' }, // デモモード時は空のconfig
      });
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析に失敗しました');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      {/* サイドナビゲーション */}
      <nav style={{
        width: '250px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E5E7EB',
        padding: '24px 16px',
      }}>
        <h1 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '32px' }}>
          AI Job Insight
        </h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button
            style={{
              padding: '12px 16px',
              backgroundColor: '#EFF6FF',
              border: 'none',
              borderRadius: '6px',
              textAlign: 'left',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            📊 案件分析
          </button>
          <button
            onClick={() => setShowSettings(true)}
            style={{
              padding: '12px 16px',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '6px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            ⚙️ 設定
          </button>
        </div>
      </nav>

      {/* メインコンテンツ */}
      <main style={{
        flex: 1,
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* APIキー設定 */}
        <ApiKeySettings
          config={apiConfig}
          onChange={setApiConfig}
        />

        {/* プロフィール入力 */}
        <ProfileInput
          data={profileData}
          onChange={setProfileData}
          apiConfig={apiConfig}
          generatedProfileText={generatedProfileText}
          onGeneratedProfileTextChange={setGeneratedProfileText}
        />

        {/* 案件情報入力 */}
        <JobInput
          data={jobData}
          onChange={setJobData}
        />

        {/* 分析ボタン */}
        <AnalysisButton
          onClick={handleAnalyze}
          isLoading={isAnalyzing}
          disabled={!apiConfig || !profileData || !jobData}
        />

        {/* エラー表示 */}
        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#FEE2E2',
            color: '#EF4444',
            borderRadius: '8px',
            marginTop: '16px',
          }}>
            {error}
          </div>
        )}

        {/* 分析結果とチャット */}
        {analysisResult && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '60% 40%',
            gap: '24px',
            marginTop: '24px',
          }}>
            <AnalysisResult result={analysisResult} />
            <ChatInterface
              profile={profileData}
              job={jobData}
              analysisResult={analysisResult}
              apiConfig={apiConfig}
            />
          </div>
        )}
      </main>

      {/* 設定モーダル */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        onProfileCleared={() => setProfileData(null)}
        onJobCleared={() => setJobData(null)}
        onAnalysisCleared={() => setAnalysisResult(null)}
        onGeneratedProfileCleared={() => setGeneratedProfileText(null)}
        onAllDataCleared={() => {
          setProfileData(null);
          setJobData(null);
          setAnalysisResult(null);
          setGeneratedProfileText(null);
        }}
      />
    </div>
  );
}

export default MainLayout;
