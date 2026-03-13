import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './AppLayout.css';

/**
 * アプリケーション全体のレイアウトコンポーネント
 * 
 * サイドバーとメインコンテンツエリアを含む基本レイアウトを提供する。
 */
const AppLayout: React.FC = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
