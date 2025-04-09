import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { Participants } from './pages/Participants';
import { SettingsPage } from './pages/SettingsPage';
import { Header } from './components/Header';
import { GeneratePage } from './pages/GeneratePage';
import { ReadPage } from './pages/ReadPage';
import { Home } from './pages/Home';
import { LoginPage } from './pages/LoginPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppWrapper() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register', '/forgot', '/reset-password'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col h-screen dark:bg-gray-900">
      {showHeader && (
        <div className="flex-none">
          <Header />
        </div>
      )}
      <div className="flex-1 overflow-y-auto">
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/qrcode" element={<GeneratePage />} />
            <Route path="/leitor" element={<ReadPage />} />
            <Route path="/participantes" element={<Participants />} />
            <Route path="/configuracoes" element={<SettingsPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
