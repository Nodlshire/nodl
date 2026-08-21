"use client";

import React, { useState, useEffect } from "react";
import { 
    Users, Activity, Zap, TrendingUp, Shield,
    UserPlus, Search, Filter, Info, Mail, CreditCard,
    ArrowUpRight, BarChart3
} from "lucide-react";
import DetailPanel from "../components/DetailPanel";
import MetricCard from "@shared/components/MetricCard";
import IdentityHeader from "@shared/components/IdentityHeader";
import { usePageTitle } from "../components/PageTitleContext";
import { Tree } from "./components/Tree";
import { AffiliateNode } from "./components/TreeNode";

export default function AffiliatesPage() {
    usePageTitle("AFFILIATE NETWORK", "Hierarchical network topology and node distribution audit");
    
    const [summary, setSummary] = useState({
        totalAffiliates: 0,
        activeAffiliates: 0,
        totalNodes: 0,
        growth30d: 0,
    });
    
    const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/affiliates/stats');
            if (res.ok) {
                const data = await res.json();
                setSummary(data);
            }
        } catch (err) {
            console.error("Failed to fetch affiliate metrics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleNodeClick = async (node: AffiliateNode) => {
        setSelectedAffiliate(node);
        try {
            // Fetch high-fidelity details for the slide-out
            const res = await fetch(`/api/affiliates/${node.nodlrId}`);
            if (res.ok) {
                const detailed = await res.json();
                setSelectedAffiliate(detailed);
            }
        } catch (err) {
            console.error("Failed to fetch node details:", err);
        }
    };

    return (
        <>
            <main className="flex-1 p-8 pt-24 overflow-y-auto pb-24 relative space-y-12 focus:outline-none">
                {/* Global Identity Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-xl font-bold text-white uppercase tracking-[0.2em] drop-shadow-sm">
                            AFFILIATE NETWORK
                        </h1>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest">
                            Hierarchical network topology and node distribution audit
                        </p>
                    </div>
                    <IdentityHeader />
                </div>

                {/* Summary Indicators */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Affiliates', value: summary.totalAffiliates || '0', icon: Users, color: 'text-white' },
                        { label: 'Active Affiliates', value: summary.activeAffiliates || '0', icon: Activity, color: 'text-emerald-400' },
                        { label: 'Total Nodes', value: summary.totalNodes || '0', icon: Zap, color: 'text-[#22D3EE]' },
                        { label: '30-Day Growth', value: `+${(summary.growth30d || 0).toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-400' },
                    ].map((s) => (
                        <MetricCard 
                            key={s.label}
                            label={s.label}
                            value={s.value}
                            icon={s.icon}
                            statusColor={s.color}
                        />
                    ))}
                </div>

                {/* Genesis Layer Configuration (L0 roots) */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Shield className="w-4 h-4 text-amber-500" />
                        <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Genesis Layer Configuration</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10 gap-2">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="bg-white/[0.02] border border-white/5 p-3 rounded-[3px] text-center space-y-2 group hover:border-amber-500/30 transition-all">
                                <span className="text-[9px] text-slate-600 font-mono uppercase block">Slot 0{i + 1}</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mx-auto shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                                <span className="text-[8px] text-amber-500/40 font-bold uppercase tracking-widest group-hover:text-amber-500 transition-colors">Founder</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Network Topology Visualizer */}
                <Tree onNodeClick={handleNodeClick} />
            </main>

            {/* Intelligence Slide-Out */}
            <DetailPanel
                isOpen={!!selectedAffiliate}
                onClose={() => setSelectedAffiliate(null)}
                title="Affiliate Node Intelligence"
                subtitle={`WUID: ${selectedAffiliate?.nodlrId || 'UNKNOWN'}`}
                footer={
                    <div className="flex items-center gap-3">
                        <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[5px] text-[12px] font-bold text-slate-400 transition-all uppercase tracking-widest">
                            Audit Trail
                        </button>
                        <button className="flex-[2] py-3 bg-[#22D3EE] text-black rounded-[5px] text-[12px] font-bold transition-all shadow-[0_0_30px_rgba(34,211,238,0.2)] uppercase tracking-widest">
                            Authorize Override
                        </button>
                    </div>
                }
            >
                {selectedAffiliate && (
                    <div className="space-y-8">
                        {/* Identity & Status */}
                        <section className="bg-white/[0.02] border border-white/10 rounded-[5px] p-6 relative group overflow-hidden">
                            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/30 to-transparent" />
                            {selectedAffiliate.isFounder && (
                                <div className="absolute top-0 right-0 px-3 py-1 bg-amber-500 text-black text-[9px] font-extrabold uppercase tracking-[0.2em] rounded-bl-[5px]">
                                    Founder Tier
                                </div>
                            )}
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-2xl font-bold text-[#22D3EE]">
                                    {selectedAffiliate.nodlrId?.[0] || '?'}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-lg font-bold text-white">{selectedAffiliate.name || 'Anonymous Partner'}</span>
                                    <span className="text-[11px] text-[#22D3EE] font-mono font-bold uppercase tracking-widest bg-[#22D3EE]/5 px-2 py-0.5 border border-[#22D3EE]/20 rounded-[3px]">
                                        {selectedAffiliate.nodlrId}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Performance Matrix */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="card-sovereign p-4 space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Protocol Tier</span>
                                <span className="text-white font-bold text-[14px]">{selectedAffiliate.isFounder ? 'L0 FOUNDER' : `L${selectedAffiliate.level || '?'}`}</span>
                            </div>
                            <div className="card-sovereign p-4 space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Node Yield</span>
                                <span className="text-emerald-400 font-bold text-[14px]">{selectedAffiliate.yield || '0.00'}%</span>
                            </div>
                            <div className="card-sovereign p-4 space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active Nodes</span>
                                <span className="text-[#22D3EE] font-bold text-[14px]">{selectedAffiliate.nodeCount || 0}</span>
                            </div>
                            <div className="card-sovereign p-4 space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Earnings</span>
                                <span className="text-purple-400 font-bold text-[14px]">${(selectedAffiliate.earnings || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Audit Log / Trace */}
                        <section className="bg-black/60 border border-white/5 rounded-[5px] overflow-hidden">
                            <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Protocol Audit Trace</span>
                                <Activity className="w-3 h-3 text-[#22D3EE]" />
                            </div>
                            <div className="p-4 font-mono text-[11px] text-slate-400 space-y-2">
                                <div className="flex gap-2">
                                    <span className="text-slate-700">[SYSTEM]</span>
                                    <span>Syncing acquisition graph node... [OK]</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-slate-700">[TRACE]</span>
                                    <span>Verifying WUID signature: {selectedAffiliate.nodlrId.substring(0, 12)}...</span>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </DetailPanel>
        </>
    );
}
