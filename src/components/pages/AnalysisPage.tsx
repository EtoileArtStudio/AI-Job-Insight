import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import JobInput from '../JobInput';
import AnalysisButton from '../AnalysisButton';
import AnalysisResult from '../AnalysisResult';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/storage';
import { analyzeJob } from '../../services/aiService';
import type { ApiKeyConfig, ProfileData, JobData, AnalysisResult as AnalysisResultType } from '../../types';
import './AnalysisPage.css';

/**
 * 案件分析ページ
 * 
 * 案件入力と分析結果を横並びで表示するページ。
 * 左側に案件入力フォーム、右側に分析結果を配置する。
 */
const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  
  // ストレージから設定を取得
  const [apiConfig] = useLocalStorage<ApiKeyConfig | null>(
    STORAGE_KEYS.API_KEY_CONFIG,
    null
  );
  const [profileData] = useLocalStorage<ProfileData | null>(
    STORAGE_KEYS.PROFILE_DATA,
    null
  );

  // ローカルステート
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 分析実行
  const handleAnalyze = async () => {
    if (!apiConfig) {
      setError('APIキーが設定されていません。設定画面から登録してください。');
      return;
    }
    if (!profileData || !profileData.selfIntroduction || !profileData.skills.length || !profileData.achievements || !profileData.specialty) {
      setError('プロフィール情報の必須項目をすべて入力してください。');
      return;
    }
    if (!jobData || !jobData.description) {
      setError('案件説明を入力してください。');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await analyzeJob({
        config: apiConfig,
        profile: profileData,
        job: jobData
      });
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析中にエラーが発生しました');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 応募文章作成への遷移
  const handleCreateApplication = () => {
    if (jobData && analysisResult) {
      navigate('/application', {
        state: {
          jobData,
          analysisResult
        }
      });
    }
  };

  return (
    <div className="analysis-page">
      <h1 className="page-title">案件分析</h1>
      
      <div className="analysis-container">
        {/* 左側: 案件入力 */}
        <div className="analysis-left">
          <Card title="案件情報入力">
            <JobInput 
              data={jobData}
              onChange={setJobData}
            />
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="analyze-button-wrapper">
              <AnalysisButton 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobData || !jobData.description}
                isLoading={isAnalyzing}
              />
            </div>
          </Card>
        </div>

        {/* 右側: 分析結果 */}
        <div className="analysis-right">
          {analysisResult ? (
            <Card title="分析結果">
              <AnalysisResult result={analysisResult} />
              
              <div className="result-actions">
                <button 
                  className="btn-create-application"
                  onClick={handleCreateApplication}
                >
                  この案件の応募文章を作成
                </button>
              </div>
            </Card>
          ) : (
            <Card title="分析結果">
              <div className="no-result">
                <p>案件情報を入力して「AI分析を実行」ボタンをクリックしてください。</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
