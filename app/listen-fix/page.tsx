"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Wrench,
    Mic,
    Video,
    Image,
    FileText,
    MapPin,
    AlertTriangle,
    Sparkles,
    ExternalLink
} from "lucide-react";

export default function ListenFixPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            {/* Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-orange-900/20 via-zinc-950 to-black" />
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-950/50 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Apps</span>
                    </Link>
                    <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">
                        <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-1.5 animate-pulse" />
                        Live
                    </Badge>
                </div>
            </header>

            {/* Hero */}
            <main className="max-w-6xl mx-auto px-6 py-16">
                <div className="text-center mb-16 space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-linear-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/25 mb-4">
                        <Wrench className="w-10 h-10 text-white" />
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        <span className="bg-linear-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                            Listen & Fix DIY
                        </span>
                    </h1>

                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Shazam for Engines & Appliances. Record the problem, let AI diagnose it,
                        and get a custom repair guide with local parts availability.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 pt-4">
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Gemini 2.5 Flash</Badge>
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">Multimodal AI</Badge>
                        <Badge variant="secondary" className="bg-zinc-800 text-zinc-300">RAG-Enhanced</Badge>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: Mic, title: "Audio Analysis", description: "Record engine sounds, appliance noises, or any mechanical issues. Our AI identifies problems by sound." },
                        { icon: Video, title: "Video Diagnosis", description: "Capture video of the issue. AI analyzes visual cues, movements, and behaviors to pinpoint problems." },
                        { icon: Image, title: "Image Recognition", description: "Upload photos of error codes, damaged parts, or wear patterns for instant identification." },
                        { icon: FileText, title: "Custom Repair Guides", description: "Get step-by-step repair instructions tailored to your specific issue and skill level." },
                        { icon: MapPin, title: "Local Parts Finder", description: "Find replacement parts at nearby stores or online with real-time availability." },
                        { icon: AlertTriangle, title: "Safety Warnings", description: "Receive equipment-specific safety disclaimers and professional consultation recommendations." },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            className="p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:border-orange-500/30 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                                <feature.icon className="w-6 h-6 text-orange-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                            <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Supported Equipment */}
                <div className="mb-16 p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
                    <h2 className="text-xl font-bold text-white mb-6 text-center">Supported Equipment Types</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { label: "Vehicles", emoji: "🚗" },
                            { label: "Appliances", emoji: "🧊" },
                            { label: "HVAC", emoji: "❄️" },
                            { label: "Plumbing", emoji: "🚿" },
                            { label: "Electrical", emoji: "⚡" },
                            { label: "Power Tools", emoji: "🔧" },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-4 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                                <div className="text-2xl mb-2">{item.emoji}</div>
                                <div className="text-sm text-zinc-400">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center p-12 rounded-3xl bg-linear-to-br from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20">
                    <Sparkles className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-3">Ready to Fix It Yourself?</h2>
                    <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                        Stop guessing what&apos;s wrong. Let AI diagnose the problem and guide you through the repair.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="https://fix-it-tau.vercel.app/" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                className="bg-linear-to-r from-orange-500 to-amber-500 text-white hover:shadow-lg hover:shadow-orange-500/25 transition-all"
                            >
                                Launch App
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}
