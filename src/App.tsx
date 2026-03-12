import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import AnalysisPage from './components/pages/AnalysisPage';
import ProfilePage from './components/pages/ProfilePage';
import ApplicationPage from './components/pages/ApplicationPage';
import SettingsPage from './components/pages/SettingsPage';

/**
 * アプリケーションのルートコンポーネント
 * 
 * ルーティングと画面構成を定義する。
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/analysis" replace />} />
          <Route path="analysis" element={<AnalysisPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="application" element={<ApplicationPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
