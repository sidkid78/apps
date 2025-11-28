"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard,
  TrendingUp,
  MessageSquare,
  Building2,
  PieChart,
  Settings,
  LogOut,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from "lucide-react";

// Mock data
const transactions = [
  { name: "Whole Foods Market", category: "Groceries", date: "10/24/2023", amount: -145.20 },
  { name: "Uber Technologies", category: "Transport", date: "10/23/2023", amount: -24.50 },
  { name: "Tech Corp Payroll", category: "Income", date: "10/23/2023", amount: 4200.00 },
  { name: "Electric Utility", category: "Utilities", date: "10/22/2023", amount: -120.00 },
  { name: "Starbucks", category: "Dining", date: "10/21/2023", amount: -8.50 },
  { name: "Lyft Ride", category: "Transport", date: "10/20/2023", amount: -18.20 },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: TrendingUp, label: "Predictive Plan", active: false },
  { icon: MessageSquare, label: "AI Coach", active: false },
  { icon: Building2, label: "Tax Optimizer", active: false },
  { icon: PieChart, label: "Portfolio", active: false },
];

export default function HolisticFinanceDemo() {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-52 bg-slate-900 text-white flex flex-col min-h-screen fixed left-0 top-0">
        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-sm">Holistic AI</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeNav === item.label
                  ? "bg-blue-600 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 mb-1">Signed in as:</p>
          <p className="text-sm text-slate-300 mb-4">demo@holisticfinance.ai</p>
          <div className="space-y-1">
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
            <Link href="/holistic-finance" className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 rounded-lg hover:bg-slate-800 transition-colors">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-52 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Financial Overview</h1>
          <p className="text-slate-500">Welcome back. Here is your holistic financial snapshot.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Net Worth</p>
                <p className="text-2xl font-bold text-slate-900">$296,301.25</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Assets</p>
                <p className="text-2xl font-bold text-slate-900">$312,951.25</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Total Liabilities</p>
                <p className="text-2xl font-bold text-slate-900">$16,650</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-rose-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 mb-1">Risk Profile</p>
                <p className="text-2xl font-bold text-slate-900">Moderate</p>
                <p className="text-xs text-slate-400">Panic Score: 2/10</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-3 gap-6">
          {/* Net Worth Chart */}
          <div className="col-span-2 bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Net Worth Trajectory</h3>
            <div className="relative h-64">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-slate-400">
                <span>$220k</span>
                <span>$165k</span>
                <span>$110k</span>
                <span>$55k</span>
                <span>$0k</span>
              </div>
              {/* Chart area */}
              <div className="ml-14 h-56 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,180 L30,175 L60,170 L90,160 L120,155 L150,140 L180,120 L210,100 L240,80 L270,60 L300,50 L330,45 L360,40 L400,35"
                    fill="none"
                    stroke="rgb(59, 130, 246)"
                    strokeWidth="2"
                  />
                  <path
                    d="M0,180 L30,175 L60,170 L90,160 L120,155 L150,140 L180,120 L210,100 L240,80 L270,60 L300,50 L330,45 L360,40 L400,35 L400,200 L0,200 Z"
                    fill="url(#chartGradient)"
                  />
                </svg>
              </div>
              {/* X-axis labels */}
              <div className="ml-14 flex justify-between text-xs text-slate-400 mt-2">
                <span>Jan</span>
                <span>Feb</span>
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Aug</span>
                <span>Sep</span>
                <span>Oct</span>
                <span>Nov</span>
                <span>Dec</span>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-xl p-6 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Recent Transactions</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-medium">
                      $
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{tx.name}</p>
                      <p className="text-xs text-slate-400">{tx.category} • {tx.date}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${tx.amount > 0 ? 'text-emerald-500' : 'text-slate-700'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
