
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Subscription, SubscriptionCategory } from '../types';
import { AlertTriangle, TrendingUp, AlertCircle, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  subscriptions: Subscription[];
  onSelectSubscription: (id: string) => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

export const Dashboard: React.FC<DashboardProps> = ({ subscriptions, onSelectSubscription }) => {
  const totalMonthlySpend = subscriptions.reduce((acc, sub) => acc + sub.amount, 0);
  
  // Prepare data for chart
  const categoryData = Object.values(SubscriptionCategory).map(cat => {
    const value = subscriptions
      .filter(s => s.category === cat)
      .reduce((acc, s) => acc + s.amount, 0);
    return { name: cat, value };
  }).filter(d => d.value > 0);

  // Identify alerts
  const upcomingRenewals = subscriptions
    .filter(s => {
      const days = (new Date(s.nextRenewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime());

  const trialsEnding = subscriptions.filter(s => s.isTrial);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Key Metrics Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between transition-colors">
          <div>
            <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">Total Monthly Spend</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-4xl font-bold text-slate-900 dark:text-white">${totalMonthlySpend.toFixed(2)}</span>
              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">/mo</span>
            </div>
          </div>
          <div className="mt-6 flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-medium">
            <TrendingUp size={16} className="mr-1" />
            <span>Projected Annual: ${(totalMonthlySpend * 12).toFixed(2)}</span>
          </div>
        </div>

        {/* Chart Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 col-span-1 lg:col-span-2 transition-colors">
          <h3 className="text-slate-900 dark:text-white text-lg font-semibold mb-4">Spending by Category</h3>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => `$${value.toFixed(2)}`} 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" wrapperStyle={{ color: '#94a3b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center">
          <AlertCircle className="w-5 h-5 mr-2 text-rose-500" />
          Attention Needed
        </h3>
        
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
          {upcomingRenewals.map(sub => {
             const daysLeft = Math.ceil((new Date(sub.nextRenewalDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
             return (
              <div 
                key={sub.id} 
                onClick={() => onSelectSubscription(sub.id)}
                className="min-w-[280px] bg-white dark:bg-slate-900 p-4 rounded-xl border border-l-4 border-l-rose-500 border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:shadow-md transition-all snap-start"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{sub.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{sub.merchant}</p>
                  </div>
                  <span className="text-xs font-bold bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 px-2 py-1 rounded-full">
                    {daysLeft} days left
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-bold text-slate-900 dark:text-white">${sub.amount}</span>
                  <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Review <ArrowUpRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
            );
          })}
          
          {trialsEnding.map(sub => (
             <div 
                key={sub.id} 
                onClick={() => onSelectSubscription(sub.id)}
                className="min-w-[280px] bg-white dark:bg-slate-900 p-4 rounded-xl border border-l-4 border-l-amber-500 border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:shadow-md transition-all snap-start"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">{sub.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Trial Ending</p>
                  </div>
                  <AlertTriangle className="text-amber-500 w-5 h-5" />
                </div>
                <div className="mt-4 flex justify-between items-center">
                   <p className="text-xs text-slate-500 dark:text-slate-400">Auto-renews at ${sub.amount}</p>
                   <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                    Cancel <ArrowUpRight size={14} className="ml-1" />
                  </div>
                </div>
              </div>
          ))}
          
          {upcomingRenewals.length === 0 && trialsEnding.length === 0 && (
             <div className="w-full bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-900 text-center">
               <p className="text-emerald-800 dark:text-emerald-400 font-medium">You're all caught up! No upcoming renewals in the next 7 days.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};