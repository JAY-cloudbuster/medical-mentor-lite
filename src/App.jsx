import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MainLayout from './layouts/MainLayout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import TerminologyExplorer from './pages/TerminologyExplorer';
import QuizConfigurator from './pages/QuizConfigurator';
import QuizEngine from './pages/QuizEngine';
import AnatomyVisualizer from './pages/AnatomyVisualizer';
import KnowledgeGraphPage from './pages/KnowledgeGraphPage';
import useAppStore from './store/useAppStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  const { darkMode } = useAppStore();

  // Sync dark mode class on initial mount and whenever it changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/terminology" element={<TerminologyExplorer />} />
            <Route path="/quiz" element={<QuizConfigurator />} />
            <Route path="/quiz/engine" element={<QuizEngine />} />
            <Route path="/anatomy" element={<AnatomyVisualizer />} />
            <Route path="/graph/:term" element={<KnowledgeGraphPage />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
