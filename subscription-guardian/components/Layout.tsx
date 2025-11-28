
import React from 'react';
import { LayoutDashboard, List, CreditCard, ShieldCheck, Zap, Moon, Sun } from 'lucide-react';
import { UserPlan } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'dashboard' | 'list' | 'connect';
  onNavigate: (view: 'dashboard' | 'list' | 'connect') => void;
  userPlan: UserPlan;
  onOpenUpgrade: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate, userPlan, onOpenUpgrade, isDarkMode, onToggleTheme }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      {/* Mobile-first Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between shadow-sm transition-colors duration-300">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white hidden md:block">Subscription Guardian</h1>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white md:hidden">Guardian</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {userPlan === 'FREE' ? (
            <button 
              onClick={onOpenUpgrade}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full text-sm font-medium hover:opacity-90 transition-opacity shadow-sm"
            >
              <Zap size={16} className="fill-current text-yellow-300" />
              <span>Upgrade</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-bold border border-slate-200 dark:border-slate-700">
              <Zap size={16} className="fill-current" />
              <span>Premium</span>
            </div>
          )}
          
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold text-xs">
            JD
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Sidebar Navigation (Desktop) / Bottom Bar (Mobile) */}
        <nav className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 space-y-2 sticky top-16 h-[calc(100vh-64px)] transition-colors duration-300">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => onNavigate('dashboard')} 
          />
          <NavItem 
            icon={<List size={20} />} 
            label="Subscriptions" 
            active={currentView === 'list'} 
            onClick={() => onNavigate('list')} 
          />
          <NavItem 
            icon={<CreditCard size={20} />} 
            label="Connect Accounts" 
            active={currentView === 'connect'} 
            onClick={() => onNavigate('connect')} 
          />
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
        
        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex justify-around p-3 z-50 pb-safe transition-colors duration-300">
           <MobileNavItem 
            icon={<LayoutDashboard size={24} />} 
            label="Home" 
            active={currentView === 'dashboard'} 
            onClick={() => onNavigate('dashboard')} 
          />
          <MobileNavItem 
            icon={<List size={24} />} 
            label="List" 
            active={currentView === 'list'} 
            onClick={() => onNavigate('list')} 
          />
          <MobileNavItem 
            icon={<CreditCard size={24} />} 
            label="Connect" 
            active={currentView === 'connect'} 
            onClick={() => onNavigate('connect')} 
          />
        </nav>
      </div>
    </div>
  );
};

const NavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium w-full text-left ${
      active 
        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileNavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center space-y-1 ${
      active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'
    }`}
  >
    {icon}
    <span className="text-xs font-medium">{label}</span>
  </button>
);