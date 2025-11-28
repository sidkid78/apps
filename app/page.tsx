"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Brain,
  PiggyBank,
  Bell,
  ChartLine,
  Wallet,
  Target
} from "lucide-react";

const apps = [
  {
    id: "holistic-finance",
    name: "Holistic Finance AI",
    tagline: "Your AI-Powered Wealth Architect",
    description: "A comprehensive AI-powered financial advisor featuring predictive wealth forecasting, proactive tax optimization, and a generative AI financial coach.",
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    bgGradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    iconBg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    icon: TrendingUp,
    features: [
      { icon: Brain, label: "AI Coach" },
      { icon: ChartLine, label: "Wealth Forecast" },
      { icon: Target, label: "Tax Optimization" },
    ],
    badges: ["Gemini 2.0", "Plaid API", "Real-time"],
    href: "/holistic-finance",
    status: "Live",
  },
  {
    id: "subscription-guardian",
    name: "Subscription Guardian",
    tagline: "Never Overpay for Subscriptions Again",
    description: "A proactive personal finance tool using AI to detect, manage, and optimize recurring expenses. Take control of your subscriptions.",
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    bgGradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    iconBg: "bg-gradient-to-br from-violet-500 to-purple-600",
    icon: Shield,
    features: [
      { icon: Bell, label: "Smart Alerts" },
      { icon: PiggyBank, label: "Savings Finder" },
      { icon: Wallet, label: "Expense Tracker" },
    ],
    badges: ["AI Detection", "Bank Sync", "Analytics"],
    href: "/subscription-guardian",
    status: "Live",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Main Content */}
      <main className="relative max-w-6xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <header className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-zinc-400 font-medium tracking-wide">AI-Powered Applications</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-white via-zinc-300 to-zinc-500 bg-clip-text text-transparent">
              My Apps
            </span>
          </h1>
          
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
            Crafting intelligent solutions for modern finance. 
            <span className="text-zinc-300"> Built with AI at the core.</span>
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-12 pt-8">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">2</div>
              <div className="text-sm text-zinc-500 font-medium">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">AI</div>
              <div className="text-sm text-zinc-500 font-medium">Powered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">∞</div>
              <div className="text-sm text-zinc-500 font-medium">Possibilities</div>
            </div>
          </div>
        </header>

        {/* Apps Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {apps.map((app, index) => (
            <Card
              key={app.id}
              className={`group relative bg-zinc-900/50 border-zinc-800/50 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-zinc-700/50 hover:shadow-2xl hover:shadow-${app.gradient.split('-')[1]}-500/5 hover:-translate-y-2`}
              style={{
                animationDelay: `${index * 150}ms`,
              }}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${app.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${app.gradient} opacity-50`} />

              <CardHeader className="relative space-y-4 pb-4">
                <div className="flex items-start justify-between">
                  {/* Icon */}
                  <div className={`${app.iconBg} p-4 rounded-2xl shadow-lg shadow-${app.gradient.split('-')[1]}-500/20 transition-transform duration-300 group-hover:scale-110`}>
                    <app.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Status badge */}
                  <Badge 
                    variant="outline" 
                    className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5 animate-pulse" />
                    {app.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <CardTitle className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-300" 
                    style={{ backgroundImage: `linear-gradient(to right, white, var(--tw-gradient-stops))` }}>
                    {app.name}
                  </CardTitle>
                  <p className={`text-sm font-medium bg-gradient-to-r ${app.gradient} bg-clip-text text-transparent`}>
                    {app.tagline}
                  </p>
                </div>

                <CardDescription className="text-zinc-400 leading-relaxed">
                  {app.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="relative space-y-6">
                {/* Features */}
                <div className="grid grid-cols-3 gap-3">
                  {app.features.map((feature, i) => (
                    <div 
                      key={i}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 transition-colors duration-300 hover:bg-white/10"
                    >
                      <feature.icon className="w-5 h-5 text-zinc-400" />
                      <span className="text-xs text-zinc-500 font-medium">{feature.label}</span>
                    </div>
                  ))}
                </div>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2">
                  {app.badges.map((badge, i) => (
                    <Badge 
                      key={i} 
                      variant="secondary"
                      className="bg-zinc-800/50 text-zinc-400 border-zinc-700/50 hover:bg-zinc-700/50 transition-colors"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* CTA Button */}
                <Button 
                  className={`w-full bg-gradient-to-r ${app.gradient} text-white border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group/btn`}
                  size="lg"
                >
                  <span>Explore App</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Button>
              </CardContent>

              {/* Corner decoration */}
              <div className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${app.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <section className="mt-24 text-center space-y-6">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
              <Sparkles className="w-5 h-5 text-zinc-600" />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />
            </div>
            <p className="text-zinc-500 text-sm">
              More apps coming soon. Building the future of personal finance.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-20 pt-10 border-t border-zinc-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
            <p>© 2024 · Built with Next.js, Tailwind CSS & AI</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">GitHub</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
