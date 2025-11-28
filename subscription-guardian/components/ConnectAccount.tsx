
import React, { useState, useEffect } from 'react';
import { Shield, Lock, CheckCircle2, Building, Loader2, ArrowRight, Wallet, ChevronRight, FileText, CheckSquare, Square } from 'lucide-react';
import { Subscription, SubscriptionCategory, PaymentFrequency, UserConsent } from '../types';

interface ConnectAccountProps {
  onConnect: (newSubs: Subscription[]) => void;
  onConsentUpdate: (consent: UserConsent) => void;
}

type OnboardingStep = 'welcome' | 'pledge' | 'consent' | 'select_bank' | 'scanning' | 'review';

const POPULAR_BANKS = [
  { id: 'chase', name: 'Chase', logo: '🛡️' },
  { id: 'boa', name: 'Bank of America', logo: '🏛️' },
  { id: 'wells', name: 'Wells Fargo', logo: '🏦' },
  { id: 'citi', name: 'Citi', logo: '💳' },
];

export const ConnectAccount: React.FC<ConnectAccountProps> = ({ onConnect, onConsentUpdate }) => {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [progress, setProgress] = useState(0);
  const [detectedSubs, setDetectedSubs] = useState<Subscription[]>([]);
  
  // Consent State
  const [consentState, setConsentState] = useState<UserConsent>({
    essential: true,
    aiProcessing: false,
    sharedData: false
  });

  // Mock found subscriptions
  const MOCK_FOUND_SUBS: Subscription[] = [
    {
      id: `new-${Date.now()}-1`,
      name: 'HBO Max',
      merchant: 'WarnerMedia',
      amount: 15.99,
      currency: 'USD',
      frequency: PaymentFrequency.MONTHLY,
      nextRenewalDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
      category: SubscriptionCategory.ENTERTAINMENT,
      logoUrl: 'https://picsum.photos/64/64?random=10',
      usageStats: {
        lastUsed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        hoursThisMonth: 12,
      },
    },
    {
      id: `new-${Date.now()}-2`,
      name: 'Amazon Prime',
      merchant: 'Amazon',
      amount: 14.99,
      currency: 'USD',
      frequency: PaymentFrequency.MONTHLY,
      nextRenewalDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      category: SubscriptionCategory.ENTERTAINMENT,
      logoUrl: 'https://picsum.photos/64/64?random=11',
    }
  ];

  const handleConsentToggle = (key: keyof UserConsent) => {
    if (key === 'essential') return; // Cannot toggle essential
    setConsentState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConsentSubmit = () => {
    onConsentUpdate(consentState);
    setStep('select_bank');
  };

  const handleBankSelect = () => {
    setStep('scanning');
    // Simulate scanning progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 2;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setDetectedSubs(MOCK_FOUND_SUBS);
        setStep('review');
      }
    }, 50);
  };

  const handleConfirm = () => {
    onConnect(detectedSubs);
  };

  const renderWelcome = () => (
    <div className="text-center space-y-6 animate-fade-in">
      <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-xl shadow-blue-200 dark:shadow-none">
        <Wallet className="w-10 h-10 text-white" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Subscription Guardian</h1>
        <p className="text-lg text-slate-500 dark:text-slate-400">Stop paying for forgotten subscriptions.</p>
      </div>
      <button 
        onClick={() => setStep('pledge')}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all flex items-center justify-center"
      >
        Start Saving Now
        <ArrowRight className="ml-2 w-5 h-5" />
      </button>
      <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">Log In</button>
    </div>
  );

  const renderPledge = () => (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto">
        <Shield className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Your Security is Our Priority</h2>
        <p className="text-slate-500 dark:text-slate-400">We use bank-level 256-bit encryption and only ever access read-only data.</p>
      </div>
      
      <div className="space-y-4 text-left bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
        <div className="flex items-start">
          <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 mr-3 shrink-0" />
          <p className="text-sm text-slate-600 dark:text-slate-300"><strong>End-to-End Encryption:</strong> Your data is encrypted in transit and at rest using TLS 1.2+.</p>
        </div>
        <div className="flex items-start">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 mr-3 shrink-0" />
          <p className="text-sm text-slate-600 dark:text-slate-300"><strong>Read-Only Access:</strong> We cannot move money or change account settings.</p>
        </div>
      </div>

      <button 
        onClick={() => setStep('consent')}
        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all"
      >
        Next: Privacy Settings
      </button>
    </div>
  );

  const renderConsent = () => (
    <div className="text-center space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Privacy & Data Permissions</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">We value transparency. Please select how we can use your data to help you save.</p>
      </div>

      <div className="space-y-3 text-left">
        {/* Essential */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 opacity-70">
          <div className="flex items-start space-x-3">
            <CheckSquare className="w-6 h-6 text-slate-500 dark:text-slate-400 mt-0.5" />
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Essential Tracking</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Required to identify subscriptions and renewal dates from your transaction history.</p>
            </div>
          </div>
        </div>

        {/* AI Processing */}
        <div 
          onClick={() => handleConsentToggle('aiProcessing')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            consentState.aiProcessing 
              ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800' 
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-800'
          }`}
        >
          <div className="flex items-start space-x-3">
            {consentState.aiProcessing ? (
              <CheckSquare className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-0.5" />
            ) : (
              <Square className="w-6 h-6 text-slate-300 dark:text-slate-600 mt-0.5" />
            )}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">AI Optimization & Profiling</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Allow our AI to analyze usage patterns (e.g. login frequency) to calculate Usage Scores and recommend savings.</p>
            </div>
          </div>
        </div>

        {/* Shared Data */}
        <div 
          onClick={() => handleConsentToggle('sharedData')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            consentState.sharedData 
              ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800'
          }`}
        >
          <div className="flex items-start space-x-3">
            {consentState.sharedData ? (
              <CheckSquare className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-0.5" />
            ) : (
              <Square className="w-6 h-6 text-slate-300 dark:text-slate-600 mt-0.5" />
            )}
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Shared Subscription Features</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Allow processing of contact details to facilitate shared plan splitting and payment requests.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button 
          onClick={handleConsentSubmit}
          className="w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 dark:hover:bg-blue-700 transition-all"
        >
          Confirm & Connect Bank
        </button>
        <p className="text-xs text-slate-400 mt-3">You can change these permissions at any time in settings.</p>
      </div>
    </div>
  );

  const renderBankSelect = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Select Your Institution</h2>
        <p className="text-slate-500 dark:text-slate-400">Securely connect via Plaid</p>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Search for your bank..." 
          className="w-full pl-4 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
        />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {POPULAR_BANKS.map(bank => (
          <button 
            key={bank.id}
            onClick={handleBankSelect}
            className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{bank.logo}</span>
              <span className="font-semibold text-slate-900 dark:text-white">{bank.name}</span>
            </div>
            <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-blue-500" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderScanning = () => (
    <div className="text-center space-y-8 animate-fade-in py-8">
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <circle 
            className="text-slate-100 dark:text-slate-800 stroke-current" 
            strokeWidth="8" 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
          ></circle>
          <circle 
            className="text-blue-600 progress-ring__circle stroke-current transition-all duration-300 ease-out" 
            strokeWidth="8" 
            strokeLinecap="round" 
            cx="50" 
            cy="50" 
            r="40" 
            fill="transparent" 
            strokeDasharray="251.2" 
            strokeDashoffset={251.2 - (251.2 * progress) / 100}
            transform="rotate(-90 50 50)"
          ></circle>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Analyzing Your Transactions...</h2>
        <p className="text-slate-500 dark:text-slate-400">Scanning 12 months of history for recurring patterns.</p>
      </div>

      <div className="space-y-2 max-w-xs mx-auto">
        <div className={`flex items-center text-sm ${progress > 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
          <CheckCircle2 className="w-4 h-4 mr-2" /> Connected securely
        </div>
        <div className={`flex items-center text-sm ${progress > 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
          <CheckCircle2 className="w-4 h-4 mr-2" /> Downloading history
        </div>
        <div className={`flex items-center text-sm ${progress > 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-600'}`}>
          <CheckCircle2 className="w-4 h-4 mr-2" /> Identifying subscriptions
        </div>
      </div>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">We Found {detectedSubs.length} Subscriptions</h2>
        <p className="text-slate-500 dark:text-slate-400">Review and confirm to add them to your dashboard.</p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {detectedSubs.map((sub, idx) => (
          <div key={sub.id} className={`p-4 flex items-center justify-between ${idx !== detectedSubs.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
             <div className="flex items-center space-x-3">
               <img src={sub.logoUrl} alt={sub.name} className="w-10 h-10 rounded-full bg-white dark:bg-slate-700 shadow-sm" />
               <div>
                 <h4 className="font-semibold text-slate-900 dark:text-white">{sub.name}</h4>
                 <p className="text-sm text-slate-500 dark:text-slate-400">${sub.amount.toFixed(2)} / {sub.frequency.toLowerCase()}</p>
               </div>
             </div>
             <div className="h-6 w-6 bg-blue-600 rounded-full flex items-center justify-center text-white">
               <CheckCircle2 className="w-4 h-4" />
             </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleConfirm}
        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 dark:shadow-none hover:bg-blue-700 transition-all"
      >
        Confirm & Go to Dashboard
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto mt-8 bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 min-h-[500px] flex flex-col justify-center transition-colors">
      {step === 'welcome' && renderWelcome()}
      {step === 'pledge' && renderPledge()}
      {step === 'consent' && renderConsent()}
      {step === 'select_bank' && renderBankSelect()}
      {step === 'scanning' && renderScanning()}
      {step === 'review' && renderReview()}
    </div>
  );
};