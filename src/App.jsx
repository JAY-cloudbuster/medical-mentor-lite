import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TerminologyExplorer from './pages/TerminologyExplorer';
import QuizConfigurator from './pages/QuizConfigurator';
import QuizEngine from './pages/QuizEngine';
import AnatomyVisualizer from './pages/AnatomyVisualizer';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import ProtectedRoute from './components/ProtectedRoute';
import useAppStore from './store/useAppStore';
import useAuthStore, { setQueryClient } from './store/useAuthStore';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUserManagement from './pages/admin/AdminUserManagement';
import AdminAiAnalytics from './pages/admin/AdminAiAnalytics';
import AdminSearchAnalytics from './pages/admin/AdminSearchAnalytics';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const { darkMode, fontScale } = useAppStore();
  const { initialize } = useAuthStore();

  useEffect(() => {
    setQueryClient(queryClient);
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Apply font scaling by adjusting the root font-size
    const sizes = { small: '14px', medium: '16px', large: '18px' };
    document.documentElement.style.fontSize = sizes[fontScale] || '16px';
  }, [fontScale]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
              <Route path="/admin/overview" element={<AdminOverview />} />
              <Route path="/admin/users" element={<AdminUserManagement />} />
              <Route path="/admin/ai-analytics" element={<AdminAiAnalytics />} />
              <Route path="/admin/search-analytics" element={<AdminSearchAnalytics />} />
            </Route>
          </Route>

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/terminology" element={<TerminologyExplorer />} />
              <Route path="/quiz" element={<QuizConfigurator />} />
              <Route path="/quiz/engine" element={<QuizEngine />} />
              <Route path="/anatomy" element={<AnatomyVisualizer />} />
              <Route path="/history" element={<History />} />
              <Route path="/graph/:term" element={<KnowledgeGraphPage />} />
            </Route>
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
