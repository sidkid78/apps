
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { useData } from '../contexts/DataContext';
import PlaidLink from './PlaidLink';
import { Landmark, CreditCard, Building2, Wallet, RefreshCcw, ArrowRightLeft, Zap } from 'lucide-react';

const Portfolio: React.FC = () => {
  const { accounts, totalAssets, totalLiabilities, netWorth, tradeInstructions, targetAllocation, simulateDividend } = useData();

  const getIcon = (type: string) => {
    switch(type) {
      case 'checking': return <Wallet className="h-5 w-5 text-blue-600" />;
      case 'savings': return <Building2 className="h-5 w-5 text-green-600" />;
      case 'credit': return <CreditCard className="h-5 w-5 text-purple-600" />;
      case 'investment': return <Landmark className="h-5 w-5 text-indigo-600" />;
      default: return <Wallet className="h-5 w-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio Management</h1>
          <p className="text-slate-500">Manage connected institutions and automated rebalancing.</p>
        </div>
        <PlaidLink />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary Card */}
        <Card className="lg:col-span-1 h-fit">
           <CardHeader>
             <CardTitle>Overview</CardTitle>
           </CardHeader>
           <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                 <span className="text-sm text-slate-600">Connected Accounts</span>
                 <span className="font-bold text-slate-900">{accounts.length}</span>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Assets</span>
                    <span className="font-medium text-green-600">${totalAssets.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Total Liabilities</span>
                    <span className="font-medium text-red-600">${totalLiabilities.toLocaleString()}</span>
                 </div>
                 <div className="pt-2 border-t border-slate-100 flex justify-between font-bold">
                    <span>Net Worth</span>
                    <span>${netWorth.toLocaleString()}</span>
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Rebalancing Center */}
        <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="flex items-center gap-2">
                    <RefreshCcw className="h-5 w-5 text-blue-600" />
                    Automated Rebalancing
                </CardTitle>
                <button 
                  onClick={simulateDividend}
                  className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium px-2 py-1 rounded hover:bg-purple-50 transition-colors"
                  title="Simulate income to trigger DRIP logic"
                >
                  <Zap className="h-3 w-3" />
                  Simulate Dividend (DRIP)
                </button>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Allocation Targets */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-slate-700">Target Allocation</h4>
                        <div className="space-y-3">
                            {Object.entries(targetAllocation.allocation).map(([asset, pct]) => (
                                pct > 0 && (
                                    <div key={asset}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="capitalize">{asset.replace('_', ' ')}</span>
                                            <span className="font-medium">{(pct * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-blue-500" 
                                                style={{ width: `${pct * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            ))}
                        </div>
                    </div>

                    {/* Trade Instructions */}
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                        <h4 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                            <ArrowRightLeft className="h-4 w-4" />
                            Pending Trades
                        </h4>
                        {tradeInstructions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-32 text-slate-400 text-xs">
                                <CheckCircleIcon />
                                <span className="mt-2">Portfolio is Balanced</span>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                                {tradeInstructions.map(trade => (
                                    <div key={trade.id} className="flex justify-between items-center bg-white p-2 rounded shadow-sm text-sm border border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trade.type === 'BUY' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {trade.type}
                                            </span>
                                            <span className="capitalize text-slate-700">{trade.assetClass}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-medium">${trade.amount.toFixed(0)}</div>
                                            <div className="text-[10px] text-slate-400">{trade.reason}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>

        {/* Account List */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Connected Institutions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                         {getIcon(account.type)}
                      </div>
                      <div>
                         <h4 className="font-semibold text-slate-900">{account.name}</h4>
                         <p className="text-xs text-slate-500 capitalize">{account.institution} • {account.type}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`font-mono font-medium ${['credit', 'loan'].includes(account.type) ? 'text-slate-900' : 'text-green-700'}`}>
                        ${account.balance.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400">Updated just now</p>
                   </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Portfolio;
