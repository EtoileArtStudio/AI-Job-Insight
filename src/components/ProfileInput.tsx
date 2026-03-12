import { useState, useEffect } from 'react';
import type { ProfileData, ApiKeyConfig, GeneratedProfileText } from '../types';
import { generateProfileText } from '../services/aiService';

interface Props {
  data: ProfileData | null;
  onChange: (data: ProfileData) => void;
  apiConfig: ApiKeyConfig | null;
  generatedProfileText: GeneratedProfileText | null;
  onGeneratedProfileTextChange: (text: GeneratedProfileText | null) => void;
}

function ProfileInput({ data, onChange, apiConfig, generatedProfileText, onGeneratedProfileTextChange }: Props) {
  const [selfIntroduction, setSelfIntroduction] = useState(data?.selfIntroduction || '');
  const [skills, setSkills] = useState(data?.skills || '');
  const [achievements, setAchievements] = useState(data?.achievements || '');
  const [specialty, setSpecialty] = useState(data?.specialty || '');
  const [skillLabels, setSkillLabels] = useState(data?.skillLabels || '');
  const [profileTextLimit, setProfileTextLimit] = useState(data?.profileTextLimit || 1000);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [proposedText, setProposedText] = useState('');
  const [showProposal, setShowProposal] = useState(false);

  useEffect(() => {
    onChange({
      selfIntroduction,
      skills,
      achievements,
      specialty,
      skillLabels,
      profileTextLimit,
    });
  }, [selfIntroduction, skills, achievements, specialty, skillLabels, profileTextLimit]);

  const handleGenerate = async () => {
    if (!apiConfig) {
      setGenerationError('APIキーが設定されていません');
      return;
    }

    if (!selfIntroduction || !skills || !achievements || !specialty) {
      setGenerationError('必須項目をすべて入力してください');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');
    setShowProposal(false);

    try {
      const text = await generateProfileText({
        profile: {
          selfIntroduction,
          skills,
          achievements,
          specialty,
          skillLabels,
          profileTextLimit,
        },
        config: apiConfig,
        existingText: generatedProfileText?.text,
      });

      setProposedText(text);
      setShowProposal(true);
    } catch (error) {
      console.error('Profile text generation error:', error);
      setGenerationError('プロフィール文の生成に失敗しました');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = () => {
    onGeneratedProfileTextChange({
      text: proposedText,
      generatedAt: Date.now(),
    });
    setShowProposal(false);
    setProposedText('');
  };

  const handleReject = () => {
    setShowProposal(false);
    setProposedText('');
  };

  const handleCopy = () => {
    if (generatedProfileText?.text) {
      navigator.clipboard.writeText(generatedProfileText.text);
      alert('プロフィール文をコピーしました');
    }
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
        1. プロフィール入力
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* 自己紹介 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            自己紹介 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={selfIntroduction}
            onChange={(e) => setSelfIntroduction(e.target.value)}
            placeholder="あなたの経歴や強みを入力してください"
            rows={5}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* スキル */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            スキル <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, Node.js, AWS など"
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* 実績 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            実績 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={achievements}
            onChange={(e) => setAchievements(e.target.value)}
            placeholder="過去の案件やプロジェクト実績を入力してください"
            rows={5}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* 得意分野 */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            得意分野 <span style={{ color: '#EF4444' }}>*</span>
          </label>
          <textarea
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="フロントエンド開発、UI/UX設計など"
            rows={4}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
              resize: 'vertical',
            }}
          />
        </div>

        {/* スキル項目ラベル */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
            スキル項目ラベル（カンマ区切り）
          </label>
          <input
            type="text"
            value={skillLabels}
            onChange={(e) => setSkillLabels(e.target.value)}
            placeholder="フロントエンド, バックエンド, インフラ, UI/UX, プロジェクト管理"
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              fontSize: '14px',
            }}
          />
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            レーダーチャート表示用の軸ラベル
          </p>
        </div>

        {/* プロフィール文生成 */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          paddingTop: '20px',
          marginTop: '8px',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>
            プロフィール文生成
          </h3>

          {/* 文字数上限設定 */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              文字数上限
            </label>
            <input
              type="number"
              value={profileTextLimit}
              onChange={(e) => setProfileTextLimit(Number(e.target.value))}
              min={100}
              max={3000}
              style={{
                width: '200px',
                padding: '8px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
            <span style={{ marginLeft: '8px', fontSize: '14px', color: '#6B7280' }}>文字</span>
          </div>

          {/* 生成ボタン */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !apiConfig}
            style={{
              padding: '8px 16px',
              backgroundColor: isGenerating || !apiConfig ? '#9CA3AF' : '#3B82F6',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isGenerating || !apiConfig ? 'not-allowed' : 'pointer',
              marginBottom: '16px',
            }}
          >
            {isGenerating ? '生成中...' : generatedProfileText ? 'プロフィール文を再生成' : 'プロフィール文を生成'}
          </button>

          {/* エラー表示 */}
          {generationError && (
            <div style={{
              padding: '12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '6px',
              color: '#DC2626',
              fontSize: '14px',
              marginBottom: '16px',
            }}>
              {generationError}
            </div>
          )}

          {/* AI提案表示 */}
          {showProposal && (
            <div style={{
              padding: '16px',
              backgroundColor: '#EFF6FF',
              border: '1px solid #BFDBFE',
              borderRadius: '8px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1E40AF' }}>
                  AI提案
                </h4>
              </div>
              <div style={{
                padding: '12px',
                backgroundColor: '#FFFFFF',
                borderRadius: '6px',
                marginBottom: '12px',
                whiteSpace: 'pre-wrap',
                fontSize: '14px',
                lineHeight: '1.6',
              }}>
                {proposedText}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleApprove}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  承認して保存
                </button>
                <button
                  onClick={handleReject}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6B7280',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  キャンセル
                </button>
              </div>
            </div>
          )}

          {/* 生成済みプロフィール文表示 */}
          {generatedProfileText && !showProposal && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{ fontWeight: '500' }}>
                  生成されたプロフィール文
                </label>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#FFFFFF',
                    color: '#3B82F6',
                    border: '1px solid #3B82F6',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  📋 コピー
                </button>
              </div>
              <textarea
                value={generatedProfileText.text}
                readOnly
                rows={8}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  resize: 'vertical',
                }}
              />
              <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '8px' }}>
                生成日時: {new Date(generatedProfileText.generatedAt).toLocaleString('ja-JP')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfileInput;
