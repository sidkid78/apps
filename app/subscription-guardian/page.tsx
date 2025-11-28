"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Shield, 
  Bell, 
  PiggyBank, 
  Wallet,
  Search,
  TrendingDown,
  CreditCard,
  Sparkles,
  ExternalLink,
  AlertTriangle
} from "lucide-react";

export default function SubscriptionGuardianPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-violet-900/20 via-zinc-950 to-black" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-950/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Apps</span>
          </Link>
          <Badge className="bg-violet-500/10 text-violet-400 border-violet-500/30">
            <span className="w-1.5 h-1.5 bg-violet-400 rounded-full mr-1.5 animate-pulse" />
            Live
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25 mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-linear-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Subscription Guardian
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Never overpay for subscriptions again. AI-powered detection, management, 
            and optimization of your recurring expenses.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">AI Detection</Badge>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Bank Sync</Badge>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Smart Analytics</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-16">
          {[
            { value: "$2,847", label: "Avg. Annual Savings", color: "text-emerald-400" },
            { value: "12.3", label: "Avg. Subscriptions Found", color: "text-violet-400" },
            { value: "94%", label: "Detection Accuracy", color: "text-amber-400" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50">
              <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-sm text-zinc-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Search, title: "Smart Detection", description: "AI automatically identifies all recurring charges across your connected accounts." },
            { icon: Bell, title: "Price Alerts", description: "Get notified when subscription prices increase or free trials are ending." },
            { icon: PiggyBank, title: "Savings Finder", description: "Discover unused subscriptions and potential savings opportunities." },
            { icon: TrendingDown, title: "Spend Analysis", description: "Track subscription spending trends over time with detailed analytics." },
            { icon: Wallet, title: "Expense Tracker", description: "Centralized dashboard to view all subscription expenses and payment methods." },
            { icon: CreditCard, title: "One-Click Cancel", description: "Easily manage and cancel subscriptions directly from the dashboard." },
            { icon: AlertTriangle, title: "Duplicate Detection", description: "Identify overlapping services and eliminate redundant subscriptions." },
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-violet-500/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center p-12 rounded-3xl bg-linear-to-br from-violet-500/10 via-purple-500/5 to-transparent border border-violet-500/20">
          <Sparkles className="w-8 h-8 text-violet-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Take Control of Your Subscriptions</h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Stop wasting money on forgotten subscriptions. Let AI guard your recurring expenses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-linear-to-r from-violet-500 to-purple-500 text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all"
            >
              Launch App
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              View Demo
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
