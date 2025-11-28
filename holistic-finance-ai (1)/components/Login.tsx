import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { TrendingUp, ShieldCheck, Lock } from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const isConfigured = isSupabaseConfigured();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signIn();
    // Redirect to dashboard after login
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-slate-200">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-600/20">
            <TrendingUp className="h-7 w-7 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">Holistic Finance AI</CardTitle>
          <p className="text-slate-500 mt-2">Secure AI-powered financial planning</p>
        </CardHeader>
        <CardContent>
           {!isConfigured && (
               <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2 text-sm text-amber-800">
                   <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
                   <div>
                       <span className="font-semibold">Demo Mode:</span> Backend is not configured. 
                       Clicking "Sign In" will grant demo access.
                   </div>
               </div>
           )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Lock className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-md"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-400">
             Protected by Supabase Auth & RLS
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;