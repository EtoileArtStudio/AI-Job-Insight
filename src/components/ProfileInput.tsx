import { useState, useEffect, useRef } from 'react';
import type { ProfileData, ApiKeyConfig, GeneratedProfileText } from '../types';
import { generateProfileText } from '../services/aiService';
import { isDemoMode } from '../utils/storage';
import { demoProfile } from '../data/demoData';

interface Props {
  data: ProfileData | null;
  onChange: (data: ProfileData) => void;
  apiConfig: ApiKeyConfig | null;
  generatedProfileText: GeneratedProfileText | null;
  onGeneratedProfileTextChange: (text: GeneratedProfileText | null) => void;
}

function ProfileInput({ data, onChange, apiConfig, generatedProfileText, onGeneratedProfileTextChange }: Props) {
  // デモモード時の初期値を設定（遅延初期化）
  const [selfIntroduction, setSelfIntroduction] = useState(() => {
    if (data?.selfIntroduction) return data.selfIntroduction;
    if (isDemoMode()) return demoProfile.selfIntroduction;
    return '';
  });
  
  const [skills, setSkills] = useState<string[]>(() => {
    if (data?.skills) {
      return Array.isArray(data.skills) ? data.skills : [data.skills];
    }
    if (isDemoMode()) return demoProfile.skills;
    return [];
  });
  
  const [skillInput, setSkillInput] = useState('');
  
  const [achievements, setAchievements] = useState(() => {
    if (data?.achievements) return data.achievements;
    if (isDemoMode()) return demoProfile.achievements;
    return '';
  });
  
  const [specialty, setSpecialty] = useState(() => {
    if (data?.specialty) return data.specialty;
    if (isDemoMode()) return demoProfile.specialty;
    return '';
  });
  
  const [profileTextLimit, setProfileTextLimit] = useState(() => {
    if (data?.profileTextLimit) return data.profileTextLimit;
    if (isDemoMode()) return demoProfile.profileTextLimit || 1000;
    return 1000;
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState('');
  const [proposedText, setProposedText] = useState('');
  const [showProposal, setShowProposal] = useState(false);

  // onChangeの最新参照を保持
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 初回レンダリングかどうかを追跡
  const isFirstRender = useRef(true);

  // props変化時にstateを更新
  useEffect(() => {
    if (data) {
      setSelfIntroduction(data.selfIntroduction);
      const newSkills = data.skills ? (Array.isArray(data.skills) ? data.skills : [data.skills]) : [];
      setSkills(newSkills);
      setAchievements(data.achievements);
      setSpecialty(data.specialty);
      setProfileTextLimit(data.profileTextLimit || 1000);
    }
  }, [data]);

  // 状態変化時にonChangeを呼び出す（初回レンダリングは除外）
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    onChangeRef.current({
      selfIntroduction,
      skills,
      achievements,
      specialty,
      profileTextLimit,
    });
  }, [selfIntroduction, skills, achievements, specialty, profileTextLimit]);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    // カンマ区切りで複数スキルを分割
    const newSkills = trimmed
      .split(',')
      .map(s => s.trim())
      .filter(s => s && !skills.includes(s));

    if (newSkills.length > 0) {
      setSkills([...skills, ...newSkills]);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleGenerate = async () => {
    if (!apiConfig) {
      setGenerationError('APIキーが設定されていません');
      return;
    }

    if (!selfIntroduction || skills.length === 0 || !achievements || !specialty) {
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
          <div style={{
            padding: '8px',
            border: '1px solid #E5E7EB',
            borderRadius: '6px',
            minHeight: '80px',
            backgroundColor: '#FFFFFF',
          }}>
            {/* スキルタグ表示 */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: skills.length > 0 ? '8px' : '0',
            }}>
              {skills.map((skill, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    backgroundColor: '#3B82F6',
                    color: '#FFFFFF',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: '500',
                  }}
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      padding: '0',
                      fontSize: '16px',
                      lineHeight: '1',
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            {/* スキル入力フィールド */}
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={handleSkillKeyDown}
              onBlur={addSkill}
              placeholder={skills.length === 0 ? "スキルを入力してEnterまたはカンマで追加" : "さらに追加..."}
              style={{
                width: '100%',
                padding: '4px 8px',
                border: 'none',
                outline: 'none',
                fontSize: '14px',
              }}
            />
          </div>
          <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
            スキルはレーダーチャートの軸として使用されます
          </p>
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
            className={isGenerating ? 'btn-loading' : ''}
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
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isGenerating && <span className="loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '2px' }}></span>}
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
