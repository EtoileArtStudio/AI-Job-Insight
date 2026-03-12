import React, { useState } from 'react';
import Card from '../common/Card';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../../utils/storage';
import { chatWithAI } from '../../services/aiService';
import type { ApiKeyConfig, ProfileData, ChatMessage } from '../../types';
import './ApplicationPage.css';

/**
 * 応募文章作成ページ
 * 
 * エディタ + AI提案型UIで応募文章を作成・改善するページ。
 * チャット形式ではなく、エディタでの編集とAIからの提案を組み合わせた構成。
 */
const ApplicationPage: React.FC = () => {
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
  const [applicationText, setApplicationText] = useState('');
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI提案を取得
  const handleGetSuggestion = async (type: 'initial' | 'improve') => {
    if (!apiConfig) {
      setError('APIキーが設定されていません。設定画面から登録してください。');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const messages: ChatMessage[] = [];
      
      if (type === 'initial') {
        // 初期作成
        messages.push({
          id: `msg-${Date.now()}`,
          role: 'user',
          content: `以下のプロフィールに基づいて、クラウドソーシング案件への応募文章を作成してください。

# プロフィール
自己紹介: ${profileData?.selfIntroduction || ''}
スキル: ${profileData?.skills.join(', ') || ''}
実績: ${profileData?.achievements || ''}
得意分野: ${profileData?.specialty || ''}

プロフェッショナルで丁寧な応募文章を作成してください。`,
          timestamp: Date.now()
        });
      } else {
        // 改善提案
        messages.push({
          id: `msg-${Date.now()}`,
          role: 'user',
          content: `以下の応募文章を改善してください。より魅力的で、採用されやすい文章にしてください。

現在の文章:
${applicationText}

改善のポイントも添えて提案してください。`,
          timestamp: Date.now()
        });
      }

      const context = profileData ? { profile: profileData } : undefined;
      const suggestion = await chatWithAI({ messages, context, config: apiConfig });
      setAiSuggestion(suggestion);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI提案の取得中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  // AI提案を適用
  const handleApplySuggestion = () => {
    if (aiSuggestion) {
      setApplicationText(aiSuggestion);
      setAiSuggestion('');
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

        {/* 右側: AI提案 */}
        <div className="application-right">
          <Card title="AI提案">
            {aiSuggestion ? (
              <div className="suggestion-section">
                <div className="suggestion-content">
                  {aiSuggestion}
                </div>
                <div className="suggestion-actions">
                  <button
                    className="btn-primary"
                    onClick={handleApplySuggestion}
                  >
                    この提案を適用
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setAiSuggestion('')}
                  >
                    破棄
                  </button>
                </div>
              </div>
            ) : (
              <div className="no-suggestion">
                <p>「AI提案で作成」または「改善提案を取得」ボタンをクリックすると、AIによる提案が表示されます。</p>
                <ul className="suggestion-tips">
                  <li><strong>AI提案で作成:</strong> プロフィールに基づいて応募文章を自動生成</li>
                  <li><strong>改善提案を取得:</strong> 現在の文章をより魅力的に改善</li>
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationPage;
