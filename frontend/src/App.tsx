import { useEffect, useState } from 'react';

import AdminLogin from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import {
  checkAdminSession,
  logoutAdmin,
} from './services/adminApi';

function App() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const loggedIn = await checkAdminSession();

      setAuthenticated(loggedIn);
      setCheckingSession(false);
    };

    checkSession();
  }, []);

  const handleLoginSuccess = () => {
    setAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } finally {
      setAuthenticated(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#080c14] flex items-center justify-center text-slate-400">
        Checking admin session...
      </div>
    );
  }

  if (!authenticated) {
    return (
      <AdminLogin
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <AdminDashboard
      onLogout={handleLogout}
    />
  );
}

export default App;