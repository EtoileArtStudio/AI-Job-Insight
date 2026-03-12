import { useState, useEffect } from 'react';
import type { ApiKeyConfig } from '../types';

interface Props {
  config: ApiKeyConfig | null;
  onChange: (config: ApiKeyConfig | null) => void;
}

function ApiKeySettings({ config, onChange }: Props) {
  const [service, setService] = useState<'openai' | 'gemini'>(config?.service || 'openai');
  const [apiKey, setApiKey] = useState(config?.apiKey || '');
  const [modelName, setModelName] = useState(config?.modelName || '');

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

  const handleSave = () => {
    if (!apiKey || !modelName) {
      alert('APIキーとモデル名を入力してください');
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* AIサービス選択 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            AIサービス <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <select
            value={service}
            onChange={(e) => setService(e.target.value as 'openai' | 'gemini')}
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
            APIキー <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
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
            モデル名 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <input
            type="text"
            value={modelName}
            onChange={(e) => setModelName(e.target.value)}
            placeholder={service === 'openai' ? 'gpt-4' : 'gemini-pro'}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
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
