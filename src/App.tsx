import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import AppLayout from './components/layout/AppLayout';

// ページコンポーネントを遅延ロード（コード分割）
const AnalysisPage = lazy(() => import('./components/pages/AnalysisPage'));
const ProfilePage = lazy(() => import('./components/pages/ProfilePage'));
const ApplicationPage = lazy(() => import('./components/pages/ApplicationPage'));
const SettingsPage = lazy(() => import('./components/pages/SettingsPage'));

/**
 * アプリケーションのルートコンポーネント
 * 
 * ルーティングと画面構成を定義する。
 * ページコンポーネントは遅延ロード（lazy loading）により、
 * 必要な時にのみ読み込まれ、初期バンドルサイズを削減する。
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/analysis" replace />} />
          <Route 
            path="analysis" 
            element={
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>}>
                <AnalysisPage />
              </Suspense>
            } 
          />
          <Route 
            path="profile" 
            element={
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>}>
                <ProfilePage />
              </Suspense>
            } 
          />
          <Route 
            path="application" 
            element={
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>}>
                <ApplicationPage />
              </Suspense>
            } 
          />
          <Route 
            path="settings" 
            element={
              <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>読み込み中...</div>}>
                <SettingsPage />
              </Suspense>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
