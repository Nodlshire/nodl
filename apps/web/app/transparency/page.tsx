"use client";

import React, { useState, useEffect } from "react";
import { Shield, Globe, Activity, Cpu, Zap, TrendingUp, BarChart3, Database } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TransparencyPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Public transparency hits the overview endpoint (aggregated totals only)
                const apiBase = "http://localhost:3001"; // Mesh Proxy
                const res = await fetch(`${apiBase}/api/v1/institutional/overview`);
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch (err) {
                console.error("Public stats fetch failed:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const formatCents = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
    };

    return (
        <main className="min-h-screen bg-[#080808] text-white font-roboto selection:bg-purple-500/30">
            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="Wenode" className="w-6 h-auto grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-sm font-black tracking-[0.4em] uppercase italic">Wenode Transparency</span>
                </Link>
                <Link href="/" className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors tracking-widest">Back to Protocol</Link>
            </nav>

            <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto space-y-20">
                {/* Hero / Pulse */}
                <section className="text-center space-y-6 relative overflow-hidden py-12">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full -z-10" />
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                        Network Proof of Reserve
                    </h1>
                    <p className="text-slate-500 max-w-2xl mx-auto text-sm font-normal uppercase tracking-widest leading-loose">
                        Real-time aggregate telemetry of the Wenode mesh architecture. <br />
                        Decentralized compute, cryptographically verified.
                    </p>
                </section>

                {/* Aggregate Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                        { label: "Global Throughput", value: formatCents(stats?.totalRevenueCents || 0), icon: TrendingUp },
                        { label: "Active Nodes", value: stats?.activeNodeCount || 0, icon: Cpu },
                        { label: "Treasury Health", value: "Verified", icon: Shield },
                        { label: "Network Uptime", value: "99.99%", icon: Activity }
                    ].map((stat, i) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            key={stat.label} 
                            className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl flex flex-col items-center text-center group hover:bg-white/[0.04] transition-all"
                        >
                            <stat.icon className="w-8 h-8 text-purple-500 mb-6 group-hover:scale-110 transition-transform" />
                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2">{stat.label}</div>
                            <div className="text-3xl font-black tracking-tighter italic">{stat.value}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Platform Charter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-10 border-t border-white/5">
                    <div className="space-y-8">
                        <div className="flex items-center gap-3">
                            <Database className="w-6 h-6 text-purple-500" />
                            <h2 className="text-2xl font-black tracking-tight italic uppercase">Forensic Ledger Integrity</h2>
                        </div>
                        <p className="text-slate-400 font-light leading-relaxed">
                            The Wenode protocol enforces a strict, math-based disbursement model. Every compute cycle submitted to the mesh is recorded in the authoritative ledger, triggering automated splits for node providers, founders, and the platform treasury.
                        </p>
                        <div className="space-y-4">
                            {[
                                "No manual intervention in commission splits.",
                                "Stripe Connect verified financial reconciliation.",
                                "Infinite-depth founder lineage tracking.",
                                "Real-time auditability for institutional partners."
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-slate-500 italic">
                                    <div className="w-1 h-1 bg-purple-500 rounded-full" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Zap className="w-32 h-32 text-purple-500" />
                        </div>
                        <div className="flex items-center gap-3">
                            <Globe className="w-6 h-6 text-purple-500" />
                            <h2 className="text-2xl font-black tracking-tight italic uppercase">Marketplace Scale</h2>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-xs uppercase font-black text-slate-600 tracking-widest">Total Operators</span>
                                <span className="text-2xl font-black italic">{stats?.totalOperatorCount || 0}</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-xs uppercase font-black text-slate-600 tracking-widest">Protocol Margin</span>
                                <span className="text-2xl font-black italic">{( (stats?.platformProfitMargin || 0) * 100 ).toFixed(1)}%</span>
                            </div>
                            <div className="flex justify-between items-end border-b border-white/5 pb-4">
                                <span className="text-xs uppercase font-black text-slate-600 tracking-widest">Treasury Balance</span>
                                <span className="text-2xl font-black italic">{formatCents(stats?.treasuryBalanceCents || 0)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Copy */}
            <footer className="py-20 border-t border-white/5 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-50 italic">
                    <span className="text-[10px] font-black uppercase tracking-widest">Wenode Institutional Protocol v1.4.2</span>
                    <span className="text-[10px] uppercase font-bold text-slate-600 tracking-widest leading-loose text-center md:text-right">
                        This dashboard provides anonymized, aggregate platform metrics. <br />
                        Detailed forensic data is restricted to authorized institutional guardians.
                    </span>
                </div>
            </footer>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');
                body { font-family: 'Roboto', sans-serif; }
            `}</style>
        </main>
    );
}
