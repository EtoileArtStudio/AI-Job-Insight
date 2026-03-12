import { useState, useEffect } from 'react';
import type { ProfileData } from '../types';

interface Props {
  data: ProfileData | null;
  onChange: (data: ProfileData) => void;
}

function ProfileInput({ data, onChange }: Props) {
  const [selfIntroduction, setSelfIntroduction] = useState(data?.selfIntroduction || '');
  const [skills, setSkills] = useState(data?.skills || '');
  const [achievements, setAchievements] = useState(data?.achievements || '');
  const [specialty, setSpecialty] = useState(data?.specialty || '');
  const [skillLabels, setSkillLabels] = useState(data?.skillLabels || '');

  useEffect(() => {
    onChange({
      selfIntroduction,
      skills,
      achievements,
      specialty,
      skillLabels,
    });
  }, [selfIntroduction, skills, achievements, specialty, skillLabels]);

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
      </div>
    </div>
  );
}

export default ProfileInput;
