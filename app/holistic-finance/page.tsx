"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  TrendingUp, 
  Brain, 
  ChartLine, 
  Target,
  Wallet,
  PieChart,
  BarChart3,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function HolisticFinancePage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-black" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-950/50 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back to Apps</span>
          </Link>
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse" />
            Live
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/25 mb-4">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="bg-linear-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Holistic Finance AI
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Your AI-Powered Wealth Architect. Predictive wealth forecasting, proactive tax optimization, 
            and a generative AI financial coach.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Gemini 2.0</Badge>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Plaid API</Badge>
            <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Real-time Analytics</Badge>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Brain, title: "AI Financial Coach", description: "Get personalized advice powered by Gemini 2.0 that understands your complete financial picture." },
            { icon: ChartLine, title: "Wealth Forecasting", description: "Predictive models that project your net worth growth under different scenarios." },
            { icon: Target, title: "Tax Optimization", description: "Proactive strategies to minimize tax burden and maximize after-tax returns." },
            { icon: Wallet, title: "Account Aggregation", description: "Connect all your accounts via Plaid for a unified financial dashboard." },
            { icon: PieChart, title: "Portfolio Analysis", description: "Deep insights into asset allocation, risk exposure, and rebalancing opportunities." },
            { icon: BarChart3, title: "Spending Insights", description: "Intelligent categorization and analysis of your spending patterns." },
          ].map((feature, i) => (
            <div 
              key={i}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                <feature.icon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center p-12 rounded-3xl bg-linear-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Transform Your Finances?</h2>
          <p className="text-zinc-400 mb-6 max-w-md mx-auto">
            Experience the future of personal finance management with AI-powered insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://holistic-finance-ai-1.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button 
                size="lg"
                className="bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
              >
                Launch App
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <Link href="/holistic-finance/demo">
              <Button 
                size="lg"
                variant="outline"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

