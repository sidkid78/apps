
import React, { useState } from 'react';
import { Subscription, SubscriptionCategory } from '../types';
import { Search, ChevronRight, Plus, ArrowUpDown } from 'lucide-react';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onSelectSubscription: (id: string) => void;
}

type SortOption = 'cost-high' | 'cost-low' | 'date-soon' | 'date-late' | 'name-asc';

export const SubscriptionList: React.FC<SubscriptionListProps> = ({ subscriptions, onSelectSubscription }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<SubscriptionCategory | 'All'>('All');
  const [sortOption, setSortOption] = useState<SortOption>('date-soon');

  const filteredSubs = subscriptions
    .filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            sub.merchant.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || sub.category === categoryFilter;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case 'cost-high': return b.amount - a.amount;
        case 'cost-low': return a.amount - b.amount;
        case 'date-soon': return new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
        case 'date-late': return new Date(b.nextRenewalDate).getTime() - new Date(a.nextRenewalDate).getTime();
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

  const handleManualAdd = () => {
    // In a real implementation this would open a modal form
    alert("Manual subscription entry form would appear here.");
  };

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 sticky top-0 z-10 space-y-4 transition-colors">
        {/* Header Row with Search and Add */}
        <div className="flex space-x-2">
           <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search subscriptions..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={handleManualAdd}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            title="Add Manual Subscription"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Filters and Sort Row */}
        <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-3">
          <div className="flex-1 overflow-x-auto pb-2 hide-scrollbar flex space-x-2">
            <button 
              onClick={() => setCategoryFilter('All')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                categoryFilter === 'All' 
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All
            </button>
            {Object.values(SubscriptionCategory).map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === cat 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[160px]">
             <select 
               value={sortOption}
               onChange={(e) => setSortOption(e.target.value as SortOption)}
               className="w-full appearance-none pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
             >
               <option value="date-soon">Renewing Soon</option>
               <option value="date-late">Renewing Later</option>
               <option value="cost-high">Highest Cost</option>
               <option value="cost-low">Lowest Cost</option>
               <option value="name-asc">Name (A-Z)</option>
             </select>
             <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredSubs.map(sub => (
          <div 
            key={sub.id} 
            onClick={() => onSelectSubscription(sub.id)}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between cursor-pointer hover:border-blue-200 dark:hover:border-blue-700 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <img src={sub.logoUrl} alt={sub.merchant} className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 object-cover" />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">{sub.name}</h4>
                <div className="flex items-center space-x-2">
                   <p className="text-sm text-slate-500 dark:text-slate-400">{sub.category}</p>
                   {sub.isTrial && <span className="text-[10px] bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">TRIAL</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="font-bold text-slate-900 dark:text-white">${sub.amount.toFixed(2)}</p>
                <p className="text-xs text-slate-400">
                  {new Date(sub.nextRenewalDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <ChevronRight className="text-slate-300 dark:text-slate-600 w-5 h-5" />
            </div>
          </div>
        ))}
        
        {filteredSubs.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-600">
            No subscriptions found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};