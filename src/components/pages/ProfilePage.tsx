import React from 'react';
import Card from '../common/Card';
import ProfileInput from '../ProfileInput';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { STORAGE_KEYS, isDemoMode } from '../../utils/storage';
import { demoProfile } from '../../data/demoData';
import type { ProfileData, GeneratedProfileText, ApiKeyConfig } from '../../types';
import './ProfilePage.css';

/**
 * プロフィールページ
 * 
 * ユーザーのプロフィール情報を管理するページ。
 */
const ProfilePage: React.FC = () => {
  const [profileData, setProfileData] = useLocalStorage<ProfileData | null>(
    STORAGE_KEYS.PROFILE_DATA,
    isDemoMode() ? demoProfile : null
  );
  const [generatedProfileText, setGeneratedProfileText] = useLocalStorage<GeneratedProfileText | null>(
    STORAGE_KEYS.GENERATED_PROFILE,
    null
  );
  const [apiConfig] = useLocalStorage<ApiKeyConfig | null>(
    STORAGE_KEYS.API_KEY_CONFIG,
    null
  );

  return (
    <div className="profile-page">
      <h1 className="page-title">プロフィール管理</h1>
      
      <Card title="プロフィール情報">
        <ProfileInput 
          data={profileData}
          apiConfig={apiConfig}
          generatedProfileText={generatedProfileText}
          onChange={setProfileData}
          onGeneratedProfileTextChange={setGeneratedProfileText}
        />
      </Card>
    </div>
  );
};

export default ProfilePage;
