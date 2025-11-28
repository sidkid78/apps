import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { generateNetWorthHistory } from '../services/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Wallet, DollarSign, Activity, AlertTriangle, Loader2 } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Dashboard: React.FC = () => {
  const { 
      accounts, 
      transactions, 
      netWorth, 
      totalAssets, 
      totalLiabilities,
      riskProfile,
      runRiskAnalysis,
      isLoading
  } = useData();
  
  const netWorthData = generateNetWorthHistory(); 

  const getRiskColor = (level: string) => {
      switch(level) {
          case 'conservative': return 'text-blue-600 bg-blue-100';
          case 'moderate': return 'text-yellow-600 bg-yellow-100';
          case 'aggressive': return 'text-purple-600 bg-purple-100';
          default: return 'text-slate-600 bg-slate-100';
      }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
        <p className="text-slate-500">Welcome back. Here is your holistic financial snapshot.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium text-slate-500">Net Worth</p>
              <h2 className="text-2xl font-bold text-slate-900">${netWorth.toLocaleString()}</h2>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Wallet className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Assets</p>
              <h2 className="text-2xl font-bold text-slate-900">${totalAssets.toLocaleString()}</h2>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Liabilities</p>
              <h2 className="text-2xl font-bold text-slate-900">${totalLiabilities.toLocaleString()}</h2>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        {/* Risk Engine Widget */}
        <Card className="relative overflow-hidden border-indigo-100">
          <CardContent className="p-6 flex items-center justify-between space-y-0">
            <div>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1">
                 Risk Profile
                 {riskProfile.panicScore > 4 && <AlertTriangle className="h-3 w-3 text-orange-500" />}
              </p>
              <h2 className="text-xl font-bold text-slate-900 capitalize flex items-center gap-2">
                 {riskProfile.level}
              </h2>
              <p className="text-[10px] text-slate-400 mt-1">Panic Score: {riskProfile.panicScore}/10</p>
            </div>
            <button 
                onClick={runRiskAnalysis}
                disabled={isLoading}
                className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${getRiskColor(riskProfile.level)} hover:opacity-80`}
                title="Run Behavioral Analysis"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Activity className="h-5 w-5" />}
            </button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Chart */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Net Worth Trajectory</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={netWorthData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    itemStyle={{ color: '#0f172a' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Net Worth']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {transactions.map((t) => (
                <div key={t.id} className="flex items-center justify-between border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <DollarSign className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none text-slate-900">{t.description}</p>
                      <p className="text-[10px] text-slate-500 mt-1">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${t.type === 'credit' ? 'text-green-600' : 'text-slate-900'}`}>
                    {t.type === 'credit' ? '+' : '-'}${t.amount.toFixed(2)}
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

export default Dashboard;