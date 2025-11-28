import React, { useState } from 'react';
import { Plus, Building, Loader2, CheckCircle, ShieldCheck } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const institutions = [
  { name: 'Chase', logo: 'https://img.logo.dev/chase.com?token=pk_test_123', color: 'bg-blue-600' },
  { name: 'Bank of America', logo: 'https://img.logo.dev/bankofamerica.com?token=pk_test_123', color: 'bg-red-600' },
  { name: 'Wells Fargo', logo: 'https://img.logo.dev/wellsfargo.com?token=pk_test_123', color: 'bg-yellow-600' },
  { name: 'Citi', logo: 'https://img.logo.dev/citi.com?token=pk_test_123', color: 'bg-blue-500' },
];

const PlaidLink: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'select' | 'loading' | 'success'>('select');
  const [selectedInst, setSelectedInst] = useState<string>('');
  const { linkAccount } = useData();

  const handleConnect = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setStep('select');
    setSelectedInst('');
  };

  const handleSelect = async (name: string) => {
    setSelectedInst(name);
    setStep('loading');
    await linkAccount(name);
    setStep('success');
    setTimeout(() => {
        handleClose();
    }, 1500);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={handleConnect}
        className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Link Account
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
             <ShieldCheck className="h-5 w-5 text-green-400" />
             <span className="font-semibold">Secure Connection</span>
          </div>
          <button onClick={handleClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="p-6">
          {step === 'select' && (
            <>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Select your institution</h3>
              <p className="text-sm text-slate-500 mb-4">Uses Plaid to securely verify your account.</p>
              <div className="grid grid-cols-2 gap-3">
                {institutions.map((inst) => (
                  <button
                    key={inst.name}
                    onClick={() => handleSelect(inst.name)}
                    className="flex flex-col items-center justify-center gap-2 p-4 border border-slate-200 rounded-lg hover:border-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <div className={`h-10 w-10 rounded-full ${inst.color} flex items-center justify-center text-white font-bold`}>
                      {inst.name[0]}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{inst.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
               <div className="relative">
                 <div className="h-16 w-16 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
                 <Building className="absolute inset-0 m-auto h-6 w-6 text-slate-400" />
               </div>
               <div className="text-center">
                 <h4 className="font-semibold text-slate-900">Connecting to {selectedInst}...</h4>
                 <p className="text-sm text-slate-500">Exchanging secure tokens</p>
               </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
               <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in">
                 <CheckCircle className="h-8 w-8 text-green-600" />
               </div>
               <div className="text-center">
                 <h4 className="font-semibold text-slate-900">Successfully Linked!</h4>
                 <p className="text-sm text-slate-500">Downloading transactions...</p>
               </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400">Powered by Plaid simulation</p>
        </div>
      </div>
    </div>
  );
};

export default PlaidLink;