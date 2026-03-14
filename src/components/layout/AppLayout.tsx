import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { isDemoMode } from '../../utils/storage';
import './AppLayout.css';

/**
 * アプリケーション全体のレイアウトコンポーネント
 * 
 * サイドバーとメインコンテンツエリアを含む基本レイアウトを提供する。
 * デモモード時はバナーを表示する。
 */
const AppLayout: React.FC = () => {
  const isDemo = isDemoMode();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSettingsClick = () => {
    navigate('/settings');
    setShowTooltip(false);
  };

  return (
    <div className="app-layout">
      {/* デモモードバナー */}
      {isDemo && (
        <div 
          className="demo-mode-banner"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <span>デモモード</span>
          
          {showTooltip && (
            <div className="demo-tooltip">
              <p>
                AI応答サービスで使用するAPIキーが設定されていないため、デモモードとして動作しています。<br />
                デモモードではAI応答処理が模擬的な固定応答になります。
              </p>
              <p>
                通常モードをご利用いただくには、
                <button 
                  className="tooltip-link"
                  onClick={handleSettingsClick}
                >
                  設定パネル
                </button>
                からAPIキーを設定してください。
              </p>
            </div>
          )}
        </div>
      )}
      
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
