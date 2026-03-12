import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import JobInput from '../JobInput';
import AnalysisButton from '../AnalysisButton';
import AnalysisResult from '../AnalysisResult';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/storage';
import { analyzeJob } from '../../services/aiService';
import type { ApiKeyConfig, ProfileData, JobData, AnalysisResult as AnalysisResultType, HistoryItem } from '../../types';
import './AnalysisPage.css';

/**
 * 案件分析ページ
 * 
 * 案件入力と分析結果を横並びで表示するページ。
 * 左側に案件入力フォーム、右側に分析結果を配置する。
 * 案件入力は永続化され、分析履歴も保存・表示される。
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

  // 案件データと履歴を永続化
  const [jobData, setJobData] = useLocalStorage<JobData | null>(
    STORAGE_KEYS.JOB_DATA,
    null
  );
  const [analysisHistory, setAnalysisHistory] = useLocalStorage<HistoryItem[]>(
    STORAGE_KEYS.ANALYSIS_HISTORY,
    []
  );

  // ローカルステート
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

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
      
      // 履歴に保存
      const historyItem: HistoryItem = {
        id: `history_${Date.now()}`,
        analyzedAt: Date.now(),
        profile: profileData,
        job: jobData,
        result
      };
      setAnalysisHistory([historyItem, ...analysisHistory]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析中にエラーが発生しました');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 新規分析（入力欄クリア）
  const handleNewAnalysis = () => {
    setJobData(null);
    setAnalysisResult(null);
    setError(null);
  };

  // 履歴アイテムを表示
  const handleViewHistory = (item: HistoryItem) => {
    setJobData(item.job);
    setAnalysisResult(item.result);
    setError(null);
  };

  // 履歴から応募文章作成へ遷移
  const handleCreateApplicationFromHistory = (item: HistoryItem) => {
    navigate('/application', {
      state: {
        jobData: item.job,
        analysisResult: item.result
      }
    });
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

  // ページネーション
  const totalPages = Math.ceil(analysisHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedHistory = analysisHistory.slice(startIndex, startIndex + itemsPerPage);

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
              <button
                className="btn-new-analysis"
                onClick={handleNewAnalysis}
                disabled={!jobData}
              >
                新規分析
              </button>
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

      {/* 分析履歴 */}
      {analysisHistory.length > 0 && (
        <div className="history-section">
          <Card title="分析履歴">
            <div className="history-list">
              {displayedHistory.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-header">
                    <div className="history-date">
                      {new Date(item.analyzedAt).toLocaleString('ja-JP')}
                    </div>
                    <div className="history-score">
                      おすすめ度: {item.result.recommendationScore}/5
                    </div>
                  </div>
                  <div className="history-description">
                    {item.job.description.substring(0, 100)}
                    {item.job.description.length > 100 ? '...' : ''}
                  </div>
                  <div className="history-actions">
                    <button
                      className="btn-view-history"
                      onClick={() => handleViewHistory(item)}
                    >
                      結果を表示
                    </button>
                    <button
                      className="btn-application-from-history"
                      onClick={() => handleCreateApplicationFromHistory(item)}
                    >
                      応募文章を作成
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ページネーション */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  前へ
                </button>
                <span className="pagination-info">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="pagination-btn"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  次へ
                </button>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

export default AnalysisPage;
