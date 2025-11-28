import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PredictiveModeler from './components/PredictiveModeler';
import TaxOptimizer from './components/TaxOptimizer';
import AICoach from './components/AICoach';
import Portfolio from './components/Portfolio';
import Settings from './components/Settings';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { Loader2 } from 'lucide-react';

const ProtectedLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
           <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
           <p className="text-sm text-slate-500 font-medium">Loading secure session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DataProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-6xl">
             <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/planning" element={<PredictiveModeler />} />
                <Route path="/tax" element={<TaxOptimizer />} />
                <Route path="/coach" element={<AICoach />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/settings" element={<Settings />} />
             </Routes>
          </div>
        </main>
      </div>
    </DataProvider>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;