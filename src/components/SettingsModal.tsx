import { removeStorageItem, STORAGE_KEYS, getContextualStorageKey } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onProfileCleared: () => void;
  onJobCleared: () => void;
  onApplicationCleared: () => void;
  onGeneratedProfileCleared: () => void;
  onAllDataCleared: () => void;
}

function SettingsModal({ isOpen, onClose, onProfileCleared, onJobCleared, onApplicationCleared, onGeneratedProfileCleared, onAllDataCleared }: Props) {
  if (!isOpen) return null;

  const handleClearProfile = () => {
    if (window.confirm('プロフィールデータを削除してもよろしいですか?')) {
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.PROFILE_DATA));
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.GENERATED_PROFILE));
      onProfileCleared();
      onGeneratedProfileCleared();
    }
  };

  const handleClearJob = () => {
    if (window.confirm('案件データを削除してもよろしいですか?\n\n※分析結果も一緒に削除されます')) {
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.JOB_DATA));
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.ANALYSIS_RESULT));
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.ANALYSIS_HISTORY));
      onJobCleared();
    }
  };

  const handleClearApplication = () => {
    if (window.confirm('応募文データを削除してもよろしいですか?')) {
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_TEXT));
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_DRAFTS));
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_CHAT_HISTORIES));
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_TEXT_GENERIC));
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.APPLICATION_GENERIC_CHAT));
      removeStorageItem(getContextualStorageKey(STORAGE_KEYS.ANALYSIS_CHAT_HISTORIES));
      onApplicationCleared();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('すべてのデータを削除してもよろしいですか?\n\n※APIキーは削除されません')) {
      onAllDataCleared();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '32px',
          width: '600px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '24px',
            height: '24px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#6B7280',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '24px' }}>
          設定
        </h2>

        {/* データ管理セクション */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            データ管理
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>プロフィールデータ</div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  自己紹介、スキル、実績などのデータを削除
                </div>
              </div>
              <button
                onClick={handleClearProfile}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                削除
              </button>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>案件データ</div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  案件情報、分析結果、分析履歴を削除
                </div>
              </div>
              <button
                onClick={handleClearJob}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                削除
              </button>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>応募文データ</div>
                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  作成した応募文、チャット履歴を削除
                </div>
              </div>
              <button
                onClick={handleClearApplication}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                }}
              >
                削除
              </button>
            </div>
          </div>
        </div>

        {/* 全データ削除セクション */}
        <div style={{
          padding: '20px',
          backgroundColor: '#FEF2F2',
          borderRadius: '8px',
          border: '1px solid #FCA5A5',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px', color: '#DC2626' }}>
            すべてのデータを削除
          </h3>
          <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
            プロフィール、案件データ、分析結果をすべて削除します。<br />
            APIキーは削除されません。
          </p>
          <button
            onClick={handleClearAll}
            style={{
              padding: '10px 20px',
              backgroundColor: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%',
            }}
          >
            すべてのデータを削除
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
