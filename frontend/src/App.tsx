import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import DSASheets from './pages/DSASheets';
import Contests from './pages/Contests';
import AIAnalyzer from './pages/AIAnalyzer';
import GitHub from './pages/GitHub';
import Resume from './pages/Resume';
import Heatmap from './pages/Heatmap';

function ProtectedLayout() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900">
        <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-dark-900">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected with sidebar */}
          <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/sheets" element={<DSASheets />} />
            <Route path="/contests" element={<Contests />} />
            <Route path="/ai" element={<AIAnalyzer />} />
            <Route path="/github" element={<GitHub />} />
            <Route path="/resume" element={<Resume />} />
            <Route path="/heatmap" element={<Heatmap />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
