"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard,
  List,
  Link2,
  Moon,
  Zap,
  ArrowUpRight,
  AlertTriangle
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: List, label: "Subscriptions", active: false },
  { icon: Link2, label: "Connect Accounts", active: false },
];

const attentionItems = [
  { 
    name: "Peloton App", 
    company: "Peloton",
    amount: 12.99,
    daysLeft: 1,
    type: "expiring",
    color: "border-l-rose-500"
  },
  { 
    name: "Netflix Premium", 
    company: "Netflix",
    amount: 22.99,
    daysLeft: 3,
    type: "expiring",
    color: "border-l-amber-500"
  },
  { 
    name: "Peloton App", 
    company: "Trial Ending",
    amount: 12.99,
    type: "trial",
    color: "border-l-orange-400"
  },
];

export default function SubscriptionGuardianDemo() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-52 bg-white border-r border-slate-200 flex flex-col min-h-screen fixed left-0 top-0">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="font-semibold text-slate-900">Subscription Guardian</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeNav === item.label
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-52">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-end gap-4 sticky top-0 z-10">
          <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Moon className="w-5 h-5" />
          </button>
          <Link href="/subscription-guardian">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              <Zap className="w-4 h-4" />
              Upgrade
            </button>
          </Link>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-medium text-slate-600">
            JD
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Total Monthly Spend */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Total Monthly Spend</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">$127.95</span>
                <span className="text-slate-400">/mo</span>
              </div>
              <div className="mt-6 flex items-center gap-2 text-emerald-600 text-sm">
                <TrendingIcon />
                <span>Projected Annual: $1535.40</span>
              </div>
            </div>

            {/* Spending by Category */}
            <div className="bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-sm font-semibold text-slate-900 mb-4">Spending by Category</p>
              <div className="flex items-center justify-between">
                {/* Donut Chart */}
                <div className="relative w-36 h-36">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Entertainment - Blue */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3B82F6"
                      strokeWidth="12"
                      strokeDasharray="125.6 251.2"
                      strokeDashoffset="0"
                    />
                    {/* Software - Green */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="12"
                      strokeDasharray="100.48 251.2"
                      strokeDashoffset="-125.6"
                    />
                    {/* Wellness - Orange */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#F59E0B"
                      strokeWidth="12"
                      strokeDasharray="25.12 251.2"
                      strokeDashoffset="-226.08"
                    />
                  </svg>
                </div>
                {/* Legend */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-blue-600">Entertainment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-sm text-emerald-600">Software</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="text-sm text-amber-600">Wellness</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attention Needed Section */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-semibold text-slate-900">Attention Needed</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {attentionItems.map((item, i) => (
                <div 
                  key={i}
                  className={`bg-white rounded-xl p-4 border border-slate-200 border-l-4 ${item.color}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-medium text-slate-900">{item.name}</p>
                      <p className="text-sm text-slate-400">{item.company}</p>
                    </div>
                    {item.daysLeft && (
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        item.daysLeft <= 1 
                          ? 'bg-rose-100 text-rose-600' 
                          : 'bg-amber-100 text-amber-600'
                      }`}>
                        {item.daysLeft} days left
                      </span>
                    )}
                    {item.type === 'trial' && (
                      <AlertTriangle className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    {item.type === 'trial' ? (
                      <p className="text-sm text-slate-500">Auto-renews at ${item.amount}</p>
                    ) : (
                      <p className="font-semibold text-slate-900">${item.amount}</p>
                    )}
                    <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
                      {item.type === 'trial' ? 'Cancel' : 'Review'}
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TrendingIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}
