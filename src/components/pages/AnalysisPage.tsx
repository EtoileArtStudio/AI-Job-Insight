import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import JobInput from '../JobInput';
import AnalysisButton from '../AnalysisButton';
import AnalysisResult from '../AnalysisResult';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS, isDemoMode } from '../../utils/storage';
import { analyzeJob, chatWithAI } from '../../domains/job/services';
import { demoProfile, demoJob } from '../../data/demoData';
import type { ApiKeyConfig, ProfileData, JobData, AnalysisResult as AnalysisResultType, HistoryItem, ChatMessage } from '../../types';
import './AnalysisPage.css';

/**
 * 案件分析ページ
 * 
 * 左側に案件情報入力と分析結果のタブUI、右側にAIチャット相談エリアを配置。
 * タブ状態とチャット履歴を永続化し、案件ごとに管理する。
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
    isDemoMode() ? demoProfile : null
  );

  // 案件データと履歴を永続化
  const [jobData, setJobData] = useLocalStorage<JobData | null>(
    STORAGE_KEYS.JOB_DATA,
    isDemoMode() ? demoJob : null
  );
  const [analysisHistory, setAnalysisHistory] = useLocalStorage<HistoryItem[]>(
    STORAGE_KEYS.ANALYSIS_HISTORY,
    []
  );
  const [analysisResult, setAnalysisResult] = useLocalStorage<AnalysisResultType | null>(
    STORAGE_KEYS.ANALYSIS_RESULT,
    null
  );

  // タブ状態の永続化
  const [activeTab, setActiveTab] = useLocalStorage<'input' | 'result'>(
    STORAGE_KEYS.ANALYSIS_ACTIVE_TAB,
    'input'
  );

  // チャット履歴の永続化（案件ごと）
  const [analysisChatHistories, setAnalysisChatHistories] = useLocalStorage<Record<string, ChatMessage[]>>(
    STORAGE_KEYS.ANALYSIS_CHAT_HISTORIES,
    {}
  );

  // ローカルステート
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // チャット関連のstate
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // 現在の案件IDを生成（URLと説明文全体からハッシュを生成し衝突を回避）
  const getCurrentJobId = React.useCallback((): string => {
    if (!jobData || !jobData.description) return 'default';
    const text = jobData.jobUrl ? jobData.jobUrl + '\n' + jobData.description : jobData.description;
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return `job_${Math.abs(hash)}_${text.length}`;
  }, [jobData]);

  // 分析結果が削除された場合、タブを「案件情報入力」に切り替え
  useEffect(() => {
    if (analysisResult === null && activeTab === 'result') {
      setActiveTab('input');
    }
  }, [analysisResult, activeTab, setActiveTab]);

  // チャット履歴を案件ごとに切り替え
  useEffect(() => {
    const jobId = getCurrentJobId();
    setChatMessages(analysisChatHistories[jobId] || []);
  }, [getCurrentJobId, analysisChatHistories]);

  // チャット履歴の自動スクロール
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // チャット送信
  const handleSendChat = async () => {
    // デモモード時はAPIキーチェックをスキップ
    if (!chatInput.trim() || (!apiConfig && !isDemoMode()) || !profileData || !jobData) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: chatInput.trim(),
      timestamp: Date.now()
    };

    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatSending(true);

    try {
      // AI応答を取得
      const aiResponse = await chatWithAI({
        config: apiConfig || { service: 'openai', apiKey: '', modelName: '' }, // デモモード時は空のconfig
        messages: newMessages,
        context: {
          profile: profileData,
          job: jobData,
          analysisResult: analysisResult || undefined
        },
        mode: 'consultation'
      });

      const aiMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'ai',
        content: aiResponse,
        timestamp: Date.now()
      };

      const updatedMessages = [...newMessages, aiMessage];
      setChatMessages(updatedMessages);

      // 案件ごとのチャット履歴を保存
      const jobId = getCurrentJobId();
      setAnalysisChatHistories({
        ...analysisChatHistories,
        [jobId]: updatedMessages
      });
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}`,
        role: 'ai',
        content: `エラーが発生しました: ${err instanceof Error ? err.message : '不明なエラー'}`,
        timestamp: Date.now()
      };
      const updatedMessages = [...newMessages, errorMessage];
      setChatMessages(updatedMessages);

      const jobId = getCurrentJobId();
      setAnalysisChatHistories({
        ...analysisChatHistories,
        [jobId]: updatedMessages
      });
    } finally {
      setIsChatSending(false);
    }
  };

  // チャット履歴クリア
  const handleClearChat = () => {
    if (window.confirm('このチャット履歴を削除しますか？')) {
      setChatMessages([]);
      const jobId = getCurrentJobId();
      const newHistories = { ...analysisChatHistories };
      delete newHistories[jobId];
      setAnalysisChatHistories(newHistories);
    }
  };

  // 分析実行
  const handleAnalyze = async () => {
    // デモモード時はAPIキーチェックをスキップ
    if (!apiConfig && !isDemoMode()) {
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
        config: apiConfig || { service: 'openai', apiKey: '', modelName: '' }, // デモモード時は空のconfig
        profile: profileData,
        job: jobData
      });
      setAnalysisResult(result);

      // 分析結果が出たらタブを「result」に切り替え
      setActiveTab('result');

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
        {/* 左側: 案件情報入力 / 分析結果のタブ切り替え */}
        <div className="analysis-left">
          <div className="tab-header">
            <button
              className={`tab-button ${activeTab === 'input' ? 'active' : ''}`}
              onClick={() => setActiveTab('input')}
            >
              案件情報入力
            </button>
            <button
              className={`tab-button ${activeTab === 'result' ? 'active' : ''}`}
              onClick={() => setActiveTab('result')}
              disabled={!analysisResult}
            >
              分析結果
            </button>
          </div>

          {activeTab === 'input' ? (
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

              <div className="clear-form-wrapper">
                <button
                  className="btn-clear-form"
                  onClick={handleNewAnalysis}
                  disabled={!jobData}
                >
                  入力フォームのクリア
                </button>
              </div>
            </Card>
          ) : (
            <Card title="分析結果">
              {analysisResult ? (
                <AnalysisResult result={analysisResult} />
              ) : (
                <div className="no-result">
                  <p>まだ分析結果がありません。</p>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* 右側: AI相談チャット（常に表示） */}
        <div className="analysis-right">
          <Card title="AI相談チャット">
            <div className="chat-container">
              <div className="chat-messages">
                {chatMessages.length === 0 ? (
                  <div className="chat-empty">
                    <p>この案件について気になることを質問してみましょう</p>
                  </div>
                ) : (
                  <>
                    {chatMessages.map((message) => (
                      <div key={message.id} className={`chat-message ${message.role}`}>
                        <div className="chat-message-header">
                          <img
                            src={message.role === 'user' ? '/assets/images/user_chat_icon_v2_1773390525713.png' : '/assets/images/ai_chat_icon_v2_1773390422689.png'}
                            alt={`${message.role} avatar`}
                            className="chat-avatar"
                          />
                          <div className="chat-message-info">
                            <span className="chat-message-role">
                              {message.role === 'user' ? 'あなた' : 'AI'}
                            </span>
                            <span className="chat-message-time">
                              {new Date(message.timestamp).toLocaleTimeString('ja-JP')}
                            </span>
                          </div>
                        </div>
                        <div className="chat-message-content">
                          {message.content}
                        </div>
                      </div>
                    ))}

                    {/* タイピングインジケーター（思考中アニメーション） */}
                    {isChatSending && (
                      <div className="chat-message ai typing-indicator">
                        <img src="/assets/images/ai_chat_icon_v2_1773390422689.png" alt="ai avatar" className="chat-avatar" />
                        <div className="chat-message-info">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      </div>
                    )}
                    <div ref={chatMessagesEndRef} />
                  </>
                )}
              </div>

              <div className="chat-input-area">
                <textarea
                  className="chat-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="質問を入力してください..."
                  rows={3}
                  disabled={isChatSending || !jobData}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                />
                <div className="chat-actions">
                  <button
                    className="btn-clear-chat"
                    onClick={handleClearChat}
                    disabled={chatMessages.length === 0}
                  >
                    履歴をクリア
                  </button>
                  <button
                    className="btn-send-chat"
                    onClick={handleSendChat}
                    disabled={!chatInput.trim() || isChatSending || !jobData}
                  >
                    {isChatSending ? '送信中...' : '送信'}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 応募文章作成ボタン */}
      {analysisResult && jobData && (
        <div className="application-button-section">
          <button
            className="btn-create-application"
            onClick={handleCreateApplication}
          >
            この案件の応募文章を作成
          </button>
        </div>
      )}

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
