import { useState, useEffect } from 'react';
import type { ApiKeyConfig } from '../types';
import { isDemoMode } from '../utils/storage';

interface Props {
  config: ApiKeyConfig | null;
  onChange: (config: ApiKeyConfig | null) => void;
}

// モデル候補の定義
const MODEL_OPTIONS = {
  openai: [
    { value: 'gpt-4o-mini', label: 'gpt-4o-mini（推奨）', isRecommended: true },
    { value: 'gpt-4o', label: 'gpt-4o' },
    { value: 'gpt-4-turbo', label: 'gpt-4-turbo' },
    { value: 'gpt-4', label: 'gpt-4' },
    { value: 'o1-mini', label: 'o1-mini' },
    { value: 'o1', label: 'o1' },
  ],
  gemini: [
    { value: 'gemini-1.5-flash', label: 'gemini-1.5-flash（推奨）', isRecommended: true },
    { value: 'gemini-1.5-pro', label: 'gemini-1.5-pro' },
    { value: 'gemini-2.0-flash-exp', label: 'gemini-2.0-flash-exp' },
    { value: 'gemini-exp-1206', label: 'gemini-exp-1206' },
  ],
} as const;

// デフォルトモデルの定義
const DEFAULT_MODELS = {
  openai: 'gpt-4o-mini',
  gemini: 'gemini-1.5-flash',
} as const;

// モデル一覧ページのURL
const MODEL_DOCS_URLS = {
  openai: 'https://platform.openai.com/docs/models',
  gemini: 'https://ai.google.dev/gemini-api/docs/models/gemini',
} as const;

function ApiKeySettings({ config, onChange }: Props) {
  const [service, setService] = useState<'openai' | 'gemini'>(config?.service || 'openai');
  const [apiKey, setApiKey] = useState(config?.apiKey || '');
  const [modelName, setModelName] = useState(config?.modelName || '');
  const isDemo = isDemoMode();

  // props変化時にstateを更新
  useEffect(() => {
    if (config) {
      setService(config.service);
      setApiKey(config.apiKey);
      setModelName(config.modelName);
    } else {
      setService('openai');
      setApiKey('');
      setModelName('');
    }
  }, [config]);

  // サービス変更時にデフォルトモデルを設定（モデル名が空の場合のみ）
  const handleServiceChange = (newService: 'openai' | 'gemini') => {
    setService(newService);
    // 現在のモデル名が空、または前のサービスのデフォルトモデルの場合は新しいデフォルトに変更
    if (!modelName || modelName === DEFAULT_MODELS[service]) {
      setModelName(DEFAULT_MODELS[newService]);
    }
  };

  const handleSave = () => {
    // APIキーとモデル名が両方空の場合はデモモード設定として保存可能
    // どちらか一方だけ入力されている場合はエラー
    if ((apiKey && !modelName) || (!apiKey && modelName)) {
      alert('APIキーとモデル名の両方を入力するか、両方とも空にしてください');
      return;
    }

    // 両方空の場合はnullとして保存（デモモード）
    if (!apiKey && !modelName) {
      onChange(null);
      alert('デモモードで動作します');
      return;
    }

    onChange({
      service,
      apiKey,
      modelName,
    });
    
    alert('APIキーを保存しました');
  };

  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
        APIキー設定
      </h2>

      {/* デモモードメッセージ */}
      {isDemo && (
        <div style={{
          backgroundColor: '#FEF3C7',
          border: '1px solid #F59E0B',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '16px',
        }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400E', lineHeight: '1.5' }}>
            ※ AI応答サービスで使用するAPIキーが設定されていないため、デモモードとして動作しています。<br />
            デモモードでは、AI応答処理が模擬的な固定応答になります。<br />
            <br />
            APIキーの取得方法などについては、
            <a 
              href="/guidance.html" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#1D4ED8', textDecoration: 'underline' }}
            >
              こちら
            </a>
            をご覧ください。
          </p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* AIサービス選択 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            AIサービス
          </label>
          <select
            value={service}
            onChange={(e) => handleServiceChange(e.target.value as 'openai' | 'gemini')}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Google Gemini</option>
          </select>
        </div>

        {/* APIキー入力 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            APIキー（任意）
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-... （空欄の場合はデモモードで動作します）"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
        </div>

        {/* モデル名入力 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            モデル名（任意）
          </label>
          <input
            type="text"
            list="model-options"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder={`例: ${DEFAULT_MODELS[service]}`}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          {/* datalist要素でモデル候補を提供 */}
          <datalist id="model-options">
            {MODEL_OPTIONS[service].map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </datalist>
          {/* モデル一覧リンク */}
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6B7280' }}>
            モデル一覧は
            <a
              href={MODEL_DOCS_URLS[service]}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#3B82F6', textDecoration: 'underline', marginLeft: '4px' }}
            >
              公式ドキュメント
            </a>
            をご確認ください
          </div>
        </div>

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3B82F6',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            alignSelf: 'flex-start',
          }}
        >
          保存
        </button>
      </div>
    </div>
  );
}

export default ApiKeySettings;
