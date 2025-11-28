import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, TrendingUp, MessageSquareText, Landmark, PieChart, Settings, LogOut } from 'lucide-react';
import { clsx } from 'clsx';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Predictive Plan', path: '/planning', icon: TrendingUp },
  { name: 'AI Coach', path: '/coach', icon: MessageSquareText },
  { name: 'Tax Optimizer', path: '/tax', icon: Landmark },
  { name: 'Portfolio', path: '/portfolio', icon: PieChart },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-r border-slate-200 bg-slate-900 text-white">
      <div className="px-4 py-6">
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">Holistic AI</span>
        </div>
        
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-800 text-blue-400"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 space-y-2">
        {user && (
            <div className="px-3 py-2 text-xs text-slate-500 truncate">
                Signed in as: <br />
                <span className="text-slate-300 font-medium">{user.email}</span>
            </div>
        )}
        <button 
          onClick={() => navigate('/settings')}
          className={clsx(
             "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
             location.pathname === '/settings' ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
          )}
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
        <button 
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;