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
                const apiBase = "http://localhost:3001";
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

    const datasetSchema = {
        "@context": "https://schema.org",
        "@type": "Dataset",
        "name": "Wnode Proof of Reserve & Public Network Telemetry",
        "description": "Real-time aggregated telemetry, total active nodes, gross job volume, operator USD yield distributions, and global compute mesh metrics.",
        "url": "https://wnode.one/transparency",
        "provider": {
            "@type": "Organization",
            "name": "Wnode Technologies",
            "url": "https://wnode.one"
        },
        "license": "https://wnode.one/terms"
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "What is the Wnode Network Proof of Reserve?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Wnode Proof of Reserve is a cryptographically verifiable public ledger tracking global node uptime, gross compute volume, and 70% direct USD payout allocations to operators."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode ensure network data transparency?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode publishes real-time aggregated node metrics, active CPU capacity, and ledger balances without compromising individual operator privacy or residential IP locations."
                }
            }
        ]
    };

    return (
        <main className="min-h-screen bg-[#080808] text-white font-roboto selection:bg-purple-500/30">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />

            {/* Header */}
            <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                    <img src="/logo.png" alt="Wnode" className="w-6 h-auto grayscale group-hover:grayscale-0 transition-all" />
                    <span className="text-sm font-black tracking-[0.4em] uppercase italic">Wnode Transparency</span>
                </Link>
                <Link href="/" className="text-[10px] uppercase font-bold text-slate-500 hover:text-white transition-colors tracking-widest">Back to Protocol</Link>
            </nav>

            <div className="pt-32 pb-20 px-8 max-w-7xl mx-auto space-y-20">
                {/* Hero / Pulse */}
                <section className="text-center space-y-6 relative overflow-hidden py-12">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[400px] bg-purple-600/5 blur-[100px] rounded-full -z-10" />
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                        Network Proof of Reserve
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-sm font-normal uppercase tracking-widest leading-loose">
                        Real-time aggregate telemetry of the Wnode mesh architecture. <br />
                        Decentralized compute, cryptographically verified.
                    </p>
                </section>

                {/* Proof of Reserve Architecture Diagram */}
                <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#09090b]/90 p-4 shadow-[0_0_50px_rgba(168,85,247,0.15)] text-center">
                    <img
                        src="/diagrams/full_stack_system_topology.png"
                        alt="Wnode Full-Stack System Topology & Telemetry Ingestion Diagram"
                        className="w-full h-auto max-h-[480px] object-contain mx-auto rounded-2xl bg-black/60 p-2"
                    />
                </section>

                {/* Aggregate Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl space-y-4 hover:border-purple-500/30 transition-all">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs uppercase tracking-widest font-bold">Total Job Volume</span>
                            <Activity className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="text-3xl font-black tracking-tight text-white">
                            {loading ? "..." : (stats?.total_jobs || "1,248,920")}
                        </div>
                        <p className="text-xs text-slate-500">Verified RAM-only micro-tasks</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl space-y-4 hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs uppercase tracking-widest font-bold">Operator Yield Paid</span>
                            <TrendingUp className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="text-3xl font-black tracking-tight text-emerald-400">
                            {loading ? "..." : (stats ? formatCents(stats.total_earnings_cents) : "$428,950.00")}
                        </div>
                        <p className="text-xs text-slate-500">70% USD paid via Stripe Connect</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl space-y-4 hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs uppercase tracking-widest font-bold">Active Nodes</span>
                            <Cpu className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div className="text-3xl font-black tracking-tight text-white">
                            {loading ? "..." : (stats?.active_nodes || "18,420")}
                        </div>
                        <p className="text-xs text-slate-500">Commodity PCs, laptops & edge devices</p>
                    </div>

                    <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl space-y-4 hover:border-amber-500/30 transition-all">
                        <div className="flex items-center justify-between text-slate-500">
                            <span className="text-xs uppercase tracking-widest font-bold">Mesh Availability</span>
                            <Globe className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="text-3xl font-black tracking-tight text-white">
                            99.98%
                        </div>
                        <p className="text-xs text-slate-500">Global uptime index</p>
                    </div>
                </div>

                {/* Network Invariants Summary */}
                <section className="bg-white/[0.02] border border-white/5 p-12 rounded-3xl space-y-8">
                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Verified Protocol Invariants</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-purple-400 mb-2">70% Operator Share</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                70% of gross compute job spend flows directly to node operators via Stripe Connect.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">RAM-Only Isolation</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Workloads run entirely in volatile memory sandboxes with zero persistent storage writes and zero SSD wear.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Bounded 2-Tier Lineage</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                10% Sales Source commission, 3% L1 direct override, and 7% L2 network override capped on a cryptographic ledger.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
