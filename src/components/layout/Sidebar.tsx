import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

/**
 * サイドバーコンポーネント
 * 
 * アプリケーションの主要な画面へのナビゲーションを提供する。
 */
const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>AI Job Insight</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink 
          to="/analysis" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <span className="nav-icon">📊</span>
          <span className="nav-label">案件分析</span>
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <span className="nav-icon">👤</span>
          <span className="nav-label">プロフィール</span>
        </NavLink>
        <NavLink 
          to="/application" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <span className="nav-icon">✍️</span>
          <span className="nav-label">応募文章作成</span>
        </NavLink>
        <NavLink 
          to="/settings" 
          className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
        >
          <span className="nav-icon">⚙️</span>
          <span className="nav-label">設定</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
