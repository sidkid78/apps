
import React from 'react';
import { X, Check, Zap, Sparkles, Users, Bell } from 'lucide-react';

interface UpgradeModalProps {
  onClose: () => void;
  onUpgrade: () => void;
}

export const UpgradeModal: React.FC<UpgradeModalProps> = ({ onClose, onUpgrade }) => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in border border-slate-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-white/20 p-2 rounded-lg">
              <Zap className="w-6 h-6 text-yellow-300" />
            </div>
            <span className="font-bold tracking-wider text-sm uppercase opacity-90">Premium</span>
          </div>
          <h2 className="text-3xl font-bold mb-2">Unlock Proactive Savings</h2>
          <p className="text-indigo-100">Stop wasting money. Let AI optimize your financial life.</p>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <FeatureRow 
              icon={<Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              title="AI Optimization Engine"
              desc="Usage Scores, Tier optimization, and smart savings recommendations."
            />
            <FeatureRow 
              icon={<Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              title="Shared Subscription Manager"
              desc="Automated bill splitting for family plans with Venmo/PayPal."
            />
            <FeatureRow 
              icon={<Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />}
              title="Advanced Alerts"
              desc="Custom alert windows (30, 14, 3 days) and trial tracking."
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-100 dark:border-slate-700 text-center">
             <div className="flex items-end justify-center mb-1">
               <span className="text-4xl font-bold text-slate-900 dark:text-white">$4.99</span>
               <span className="text-slate-500 dark:text-slate-400 mb-1 ml-1">/ month</span>
             </div>
             <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Or save 16% with annual billing ($49.99/yr)</p>
             <button 
               onClick={onUpgrade}
               className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none hover:shadow-xl hover:scale-[1.02] transition-all"
             >
               Upgrade Now
             </button>
             <p className="text-xs text-slate-400 mt-3">Cancel anytime. 100% money-back guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureRow = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
  <div className="flex items-start">
    <div className="mt-1 mr-4 bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-lg">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </div>
  </div>
);