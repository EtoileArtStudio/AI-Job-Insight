import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../common/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/storage';
import { chatWithAI } from '../../services/aiService';
import type { ApiKeyConfig, ProfileData, ChatMessage, JobData, AnalysisResult, HistoryItem } from '../../types';
import './ApplicationPage.css';

/**
 * 応募文章作成ページ
 * 
 * エディタ + AI提案型UIで応募文章を作成・改善するページ。
 * チャット形式ではなく、エディタでの編集とAIからの提案を組み合わせた構成。
 * 案件ごとに応募文を管理し、案件間のナビゲーションが可能。
 */
const ApplicationPage: React.FC = () => {
  const location = useLocation();
  const state = location.state as { jobData?: JobData; analysisResult?: AnalysisResult } | null;
  
  // ストレージから設定を取得
  const [apiConfig] = useLocalStorage<ApiKeyConfig | null>(
    STORAGE_KEYS.API_KEY_CONFIG,
    null
  );
  const [profileData] = useLocalStorage<ProfileData | null>(
    STORAGE_KEYS.PROFILE_DATA,
    null
  );
  const [analysisHistory] = useLocalStorage<HistoryItem[]>(
    STORAGE_KEYS.ANALYSIS_HISTORY,
    []
  );

  // 案件ごとの応募文と汎用スロットを永続化
  const [applicationDrafts, setApplicationDrafts] = useLocalStorage<Record<string, string>>(
    STORAGE_KEYS.APPLICATION_DRAFTS,
    {}
  );
  const [applicationChatHistories, setApplicationChatHistories] = useLocalStorage<Record<string, ChatMessage[]>>(
    STORAGE_KEYS.APPLICATION_CHAT_HISTORIES,
    {}
  );
  const [genericApplicationText, setGenericApplicationText] = useLocalStorage<string>(
    STORAGE_KEYS.APPLICATION_TEXT_GENERIC,
    ''
  );
  const [genericChatHistory, setGenericChatHistory] = useLocalStorage<ChatMessage[]>(
    STORAGE_KEYS.APPLICATION_GENERIC_CHAT,
    []
  );
  
  // 連動モードと現在の案件インデックスを永続化
  const [isLinkedMode, setIsLinkedMode] = useLocalStorage<boolean>(
    STORAGE_KEYS.APPLICATION_LINKED_MODE,
    true
  );
  const [currentJobIndex, setCurrentJobIndex] = useLocalStorage<number>(
    STORAGE_KEYS.CURRENT_JOB_INDEX,
    0
  );

  // ローカルステート（案件切り替え時に更新される）
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 案件IDを生成（案件説明の最初の50文字のハッシュ）
  const getJobId = (job: JobData | null): string => {
    if (!job) return '';
    return job.description.substring(0, 50);
  };
  
  // stateから案件情報が渡された場合、その案件を表示
  useEffect(() => {
    if (state?.jobData && state?.analysisResult) {
      // 履歴から該当案件のインデックスを探す
      const index = analysisHistory.findIndex(
        h => h.job.description === state.jobData?.description
      );
      if (index >= 0) {
        setCurrentJobIndex(index);
        setIsLinkedMode(true);
      }
    }
  }, [state, analysisHistory, setCurrentJobIndex, setIsLinkedMode]);
  
  // 現在の案件情報を取得
  const currentHistoryItem = isLinkedMode && analysisHistory.length > 0 
    ? analysisHistory[currentJobIndex] 
    : null;
  const linkedJobData = currentHistoryItem?.job || null;
  const linkedAnalysisResult = currentHistoryItem?.result || null;
  
  // 案件切り替え時にチャット履歴を切り替え
  useEffect(() => {
    if (isLinkedMode && linkedJobData) {
      const jobId = getJobId(linkedJobData);
      setChatMessages(applicationChatHistories[jobId] || []);
    } else {
      setChatMessages(genericChatHistory);
    }
  }, [currentJobIndex, isLinkedMode, linkedJobData, applicationChatHistories, genericChatHistory]);
  
  // 現在の応募文を取得・設定
  const currentJobId = getJobId(linkedJobData);
  const applicationText = isLinkedMode && currentJobId
    ? (applicationDrafts[currentJobId] || '')
    : genericApplicationText;
  
  const setApplicationText = (text: string) => {
    if (isLinkedMode && currentJobId) {
      setApplicationDrafts({ ...applicationDrafts, [currentJobId]: text });
    } else {
      setGenericApplicationText(text);
    }
  };
  
  // 案件ナビゲーション
  const handlePreviousJob = () => {
    if (currentJobIndex > 0) {
      setCurrentJobIndex(currentJobIndex - 1);
    }
  };
  
  const handleNextJob = () => {
    if (currentJobIndex < analysisHistory.length - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
    }
  };
  
  // 連動モードトグル
  const handleToggleLinkedMode = () => {
    setIsLinkedMode(!isLinkedMode);
  };

  // 応募文を抽出する関数（説明文を除く）
  const extractApplicationText = (aiResponse: string): string => {
    // AIの応答から応募文のみを抽出
    // パターン1: マークダウンのコードブロック内
    const codeBlockMatch = aiResponse.match(/```(?:text)?\s*\n([\s\S]*?)\n```/);
    if (codeBlockMatch) {
      return codeBlockMatch[1].trim();
    }
    
    // パターン2: 「応募文：」「応募文章：」などのラベルの後
    const labelMatch = aiResponse.match(/(?:応募文章?|提案文章?)[:：]\s*\n([\s\S]*?)(?:\n\n|$)/);
    if (labelMatch) {
      return labelMatch[1].trim();
    }
    
    // パターン3: 改善ポイントや説明を除外（最初の段落のみ抽出）
    const lines = aiResponse.split('\n');
    const contentLines: string[] = [];
    let inContent = false;
    
    for (const line of lines) {
      // 説明文の開始を検出（「改善」「ポイント」「提案」などのキーワード）
      if (line.match(/^(改善|ポイント|提案|注意|補足|説明|以下|上記)/)) {
        break;
      }
      // 空行をスキップ
      if (line.trim() === '') {
        if (inContent) {
          contentLines.push('');
        }
        continue;
      }
      inContent = true;
      contentLines.push(line);
    }
    
    if (contentLines.length > 0) {
      return contentLines.join('\n').trim();
    }
    
    // どのパターンにも一致しない場合は全文を返す
    return aiResponse.trim();
  };

  // ボタンからのAI提案取得
  const handleGetSuggestion = async (type: 'initial' | 'improve') => {
    if (!apiConfig) {
      setError('APIキーが設定されていません。設定画面から登録してください。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: type === 'initial' 
          ? `以下のプロフィールに基づいて、クラウドソーシング案件への応募文章を作成してください。

# プロフィール
自己紹介: ${profileData?.selfIntroduction || ''}
スキル: ${profileData?.skills.join(', ') || ''}
実績: ${profileData?.achievements || ''}
得意分野: ${profileData?.specialty || ''}`
          : `以下の応募文章を改善してください。

現在の文章:
${applicationText}`,
        timestamp: Date.now()
      };

      const newMessages = [...chatMessages, userMessage];
      setChatMessages(newMessages);

      const context = {
        ...(profileData && { profile: profileData }),
        ...(linkedJobData && { job: linkedJobData }),
        ...(linkedAnalysisResult && { analysisResult: linkedAnalysisResult })
      };
      
      const suggestion = await chatWithAI({ 
        messages: [...chatMessages, userMessage], 
        context, 
        config: apiConfig 
      });
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: suggestion,
        timestamp: Date.now()
      };
      
      const updatedMessages = [...newMessages, aiMessage];
      setChatMessages(updatedMessages);
      
      // チャット履歴を永続化
      if (isLinkedMode && linkedJobData) {
        const jobId = getJobId(linkedJobData);
        setApplicationChatHistories({ ...applicationChatHistories, [jobId]: updatedMessages });
      } else {
        setGenericChatHistory(updatedMessages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI提案の取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // チャット送信
  const handleSendChat = async () => {
    if (!chatInput.trim() || !apiConfig) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content: chatInput,
        timestamp: Date.now()
      };

      const newMessages = [...chatMessages, userMessage];
      setChatMessages(newMessages);
      setChatInput('');

      const context = {
        ...(profileData && { profile: profileData }),
        ...(linkedJobData && { job: linkedJobData }),
        ...(linkedAnalysisResult && { analysisResult: linkedAnalysisResult }),
        currentText: applicationText
      };
      
      const suggestion = await chatWithAI({ 
        messages: [...chatMessages, userMessage], 
        context, 
        config: apiConfig 
      });
      
      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'ai',
        content: suggestion,
        timestamp: Date.now()
      };
      
      const updatedMessages = [...newMessages, aiMessage];
      setChatMessages(updatedMessages);
      
      // チャット履歴を永続化
      if (isLinkedMode && linkedJobData) {
        const jobId = getJobId(linkedJobData);
        setApplicationChatHistories({ ...applicationChatHistories, [jobId]: updatedMessages });
      } else {
        setGenericChatHistory(updatedMessages);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AIとの会話中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // 最新のAIメッセージから応募文を適用
  const handleApplySuggestion = () => {
    const lastAiMessage = [...chatMessages].reverse().find(m => m.role === 'ai');
    if (lastAiMessage) {
      const extractedText = extractApplicationText(lastAiMessage.content);
      setApplicationText(extractedText);
    }
  };

  // チャットクリア
  const handleClearChat = () => {
    setChatMessages([]);
    
    // 永続化も更新
    if (isLinkedMode && linkedJobData) {
      const jobId = getJobId(linkedJobData);
      setApplicationChatHistories({ ...applicationChatHistories, [jobId]: [] });
    } else {
      setGenericChatHistory([]);
    }
  };

  // テキストをコピー
  const handleCopyText = () => {
    navigator.clipboard.writeText(applicationText);
    alert('応募文章をクリップボードにコピーしました');
  };

  return (
    <div className="application-page">
      <h1 className="page-title">応募文章作成</h1>
      
      {/* 案件情報表示 */}
      {isLinkedMode && (
        <Card>
          <div className="job-card-header">
            <div className="job-card-title">
              <h3>対象案件情報</h3>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={isLinkedMode}
                  onChange={handleToggleLinkedMode}
                  className="toggle-checkbox"
                />
                <span className="toggle-text">案件連動モード</span>
              </label>
            </div>
            {linkedJobData && (
              <div className="job-navigation">
                <button
                  className="btn-nav"
                  onClick={handlePreviousJob}
                  disabled={currentJobIndex === 0}
                >
                  ← 前の案件
                </button>
                <span className="job-counter">
                  {currentJobIndex + 1} / {analysisHistory.length}
                </span>
                <button
                  className="btn-nav"
                  onClick={handleNextJob}
                  disabled={currentJobIndex === analysisHistory.length - 1}
                >
                  次の案件 →
                </button>
              </div>
            )}
          </div>
          
          {linkedJobData && linkedAnalysisResult ? (
            <div className="linked-job-info">
              <div className="job-summary">
                <div className="job-description-preview">
                  <strong>案件説明:</strong>
                  <p>{linkedJobData.description.substring(0, 150)}{linkedJobData.description.length > 150 ? '...' : ''}</p>
                </div>
                {linkedJobData.jobUrl && (
                  <div className="job-url">
                    <strong>URL:</strong> <a href={linkedJobData.jobUrl} target="_blank" rel="noopener noreferrer">{linkedJobData.jobUrl}</a>
                  </div>
                )}
              </div>
              <div className="analysis-summary">
                <strong>分析結果:</strong> おすすめ度 {linkedAnalysisResult.recommendationScore}/5
              </div>
            </div>
          ) : (
            <div className="no-job-info">
              <p>分析履歴がありません。案件分析ページで案件を分析してください。</p>
            </div>
          )}
        </Card>
      )}
      
      {!isLinkedMode && (
        <Card>
          <div className="job-card-header">
            <div className="job-card-title">
              <h3>汎用応募文作成</h3>
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={isLinkedMode}
                  onChange={handleToggleLinkedMode}
                  className="toggle-checkbox"
                />
                <span className="toggle-text">案件連動モード</span>
              </label>
            </div>
          </div>
          <div className="generic-mode-info">
            <p>案件に紐付かない汎用的な応募文を作成します。</p>
          </div>
        </Card>
      )}
      
      <div className="application-container">
        {/* 左側: エディタ */}
        <div className="application-left">
          <Card title="応募文章エディタ">
            <div className="editor-section">
              <textarea
                className="application-editor"
                value={applicationText}
                onChange={(e) => setApplicationText(e.target.value)}
                placeholder="応募文章をここに入力するか、AI提案を使用してください..."
              />
              
              <div className="editor-actions">
                <button
                  className="btn-primary"
                  onClick={() => handleGetSuggestion('initial')}
                  disabled={isLoading || !profileData}
                >
                  {isLoading ? '生成中...' : 'AI提案で作成'}
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => handleGetSuggestion('improve')}
                  disabled={isLoading || !applicationText}
                >
                  {isLoading ? '改善中...' : '改善提案を取得'}
                </button>
                <button
                  className="btn-copy"
                  onClick={handleCopyText}
                  disabled={!applicationText}
                >
                  コピー
                </button>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* 右側: AIチャット */}
        <div className="application-right">
          <Card title="AI提案チャット">
            <div className="chat-section">
              <div className="chat-messages">
                {chatMessages.length === 0 ? (
                  <div className="chat-empty">
                    <p>左側のボタンまたは下のメッセージ入力欄から、AIに指示してください。</p>
                    <p>例：「もう少し短めにしてください」「もっと自然な表現にしてください」</p>
                  </div>
                ) : (
                  chatMessages.map(msg => (
                    <div key={msg.id} className={`chat-message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`}>
                      <div className="message-header">
                        {msg.role === 'user' ? 'あなた' : 'AI'}
                      </div>
                      <div className="message-content">
                        {msg.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="chat-actions">
                <button
                  className="btn-apply"
                  onClick={handleApplySuggestion}
                  disabled={chatMessages.length === 0 || !chatMessages.some(m => m.role === 'ai')}
                >
                  最新の提案を適用
                </button>
                <button
                  className="btn-clear-chat"
                  onClick={handleClearChat}
                  disabled={chatMessages.length === 0}
                >
                  会話をクリア
                </button>
              </div>
              
              <div className="chat-input-section">
                <textarea
                  className="chat-input"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendChat();
                    }
                  }}
                  placeholder="AIに指示を入力してください（Enterで送信、Shift+Enterで改行）"
                  rows={3}
                  disabled={isLoading}
                />
                <button
                  className="btn-send"
                  onClick={handleSendChat}
                  disabled={isLoading || !chatInput.trim()}
                >
                  {isLoading ? '送信中...' : '送信'}
                </button>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
