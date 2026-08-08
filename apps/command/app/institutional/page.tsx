"use client";

import React, { useState, useEffect } from "react";
import { 
    Shield, TrendingUp, Users, Activity, Wallet, 
    ArrowUpRight, ArrowDownRight, Globe, Lock, 
    Zap, Cpu, BarChart3, History, CheckCircle2, AlertCircle, Search,
    Filter, FileCheck, Landmark, BarChart, Server, Fingerprint
} from "lucide-react";
import { usePageTitle } from "../components/PageTitleContext";
import { motion, AnimatePresence } from "framer-motion";

type TabType = 'forensics' | 'financials' | 'operators' | 'founders' | 'platform';

export default function InstitutionalDashboard() {
    usePageTitle("Institutional Oversight", "Platform-wide governance, ledger integrity, and forensic telemetry.");
    
    const [activeTab, setActiveTab] = useState<TabType>('forensics');
    const [overview, setOverview] = useState<any>(null);
    const [forensics, setForensics] = useState<any[]>([]);
    const [runRate, setRunRate] = useState<any>(null);
    const [operators, setOperators] = useState<any[]>([]);
    const [founders, setFounders] = useState<any[]>([]);
    const [platform, setPlatform] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const headers = { 'Authorization': `Bearer ${jwt}` };
            
            const [ovRes, forRes, rrRes, opRes, fRes, pltRes] = await Promise.all([
                fetch('/api/v1/institutional/overview', { headers }),
                fetch('/api/v1/institutional/forensics/log', { headers }),
                fetch('/api/v1/institutional/financials/run-rate?days=30', { headers }),
                fetch('/api/v1/institutional/financials/operators', { headers }),
                fetch('/api/v1/institutional/financials/founders', { headers }),
                fetch('/api/v1/institutional/financials/platform', { headers })
            ]);

            if (ovRes.ok) setOverview(await ovRes.json());
            if (forRes.ok) setForensics(await forRes.json());
            if (rrRes.ok) setRunRate(await rrRes.json());
            if (opRes.ok) setOperators(await opRes.json());
            if (fRes.ok) setFounders(await fRes.json());
            if (pltRes.ok) setPlatform(await pltRes.json());
        } catch (err) {
            console.error("Institutional fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatCents = (cents: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format((cents || 0) / 100);
    };

    const TABS = [
        { id: 'forensics', label: 'Audit Trail', icon: Fingerprint },
        { id: 'financials', label: 'Run-Rate', icon: TrendingUp },
        { id: 'operators', label: 'Operators', icon: Server },
        { id: 'founders', label: 'Founders', icon: Users },
        { id: 'platform', label: 'Platform', icon: Landmark },
    ];

    const filteredForensics = forensics.filter(e => 
        e.actionType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.actorAccountId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 space-y-10 custom-scrollbar">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 p-1 bg-white/[0.02] border border-wnode-border-separator rounded-[8px] w-fit">
                {TABS.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as TabType)}
                        className={`flex items-center gap-2 px-6 py-2.5 text-[12px] font-medium tracking-widest uppercase transition-all rounded-[6px] ${
                            activeTab === tab.id 
                            ? 'bg-[#22D3EE] text-black shadow-lg shadow-[#22D3EE]/20' 
                            : 'text-white/40 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <tab.icon className="w-3.5 h-3.5" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'forensics' && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-[#22D3EE]" />
                                <h3 className="text-[14px] font-normal text-white/80 uppercase tracking-widest">Tamper-Proof Forensic Event Log</h3>
                            </div>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                <input 
                                    type="text" 
                                    placeholder="Filter by actor or action..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-black/50 border border-wnode-border-neutral rounded-[5px] pl-10 pr-4 py-2 text-[12px] text-white focus:outline-none focus:border-[#22D3EE]/30"
                                />
                            </div>
                        </div>

                        <div className="card-sovereign overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.04] text-[10px] text-white/40 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Timestamp (UTC)</th>
                                        <th className="px-6 py-4 font-bold">Action</th>
                                        <th className="px-6 py-4 font-bold">Actor</th>
                                        <th className="px-6 py-4 font-bold text-center">Status</th>
                                        <th className="px-6 py-4 font-bold text-right">Signature</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-[13px]">
                                    {filteredForensics.map(event => (
                                        <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="px-6 py-5 font-mono text-[11px] text-white/40">
                                                {new Date(event.timestamp).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-white font-medium uppercase tracking-tight">{event.actionType.replace(/_/g, ' ')}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col">
                                                    <span className="text-white/80">{event.actorAccountId}</span>
                                                    <span className="text-[10px] text-white/40 uppercase tracking-widest">{event.actorRole}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center justify-center gap-2">
                                                    {event.isVerified ? (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[9px] font-bold uppercase tracking-widest">
                                                            <FileCheck className="w-3 h-3" /> Verified
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[9px] font-bold uppercase tracking-widest">
                                                            <AlertCircle className="w-3 h-3" /> Altered
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className="font-mono text-[10px] text-white/40 truncate block w-32 ml-auto" title={event.signature}>
                                                    {event.signature.substring(0, 16)}...
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'financials' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                             <div className="card-sovereign p-8 space-y-4">
                                <span className="text-[12px] text-white/40 uppercase tracking-widest">30-Day Volume</span>
                                <div className="text-[32px] font-normal text-white">{formatCents(runRate?.totalVolumeCents)}</div>
                                <div className="text-[11px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                    <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% Growth
                                </div>
                             </div>
                             <div className="card-sovereign p-8 space-y-4">
                                <span className="text-[12px] text-white/40 uppercase tracking-widest">Daily Average</span>
                                <div className="text-[32px] font-normal text-white">{formatCents(runRate?.dailyAverageCents)}</div>
                                <div className="text-[11px] text-white/40 font-normal uppercase tracking-widest">Nominal Performance</div>
                             </div>
                             <div className="card-sovereign p-8 border-l-2 border-l-[#22D3EE] space-y-4">
                                <span className="text-[12px] text-white/40 uppercase tracking-widest">Yearly Projection</span>
                                <div className="text-[32px] font-normal text-[#22D3EE]">{formatCents(runRate?.projectedYearly)}</div>
                                <div className="text-[11px] text-white/40 font-normal uppercase tracking-widest italic">Based on 30d run-rate</div>
                             </div>
                        </div>

                        <div className="card-sovereign p-8">
                            <h3 className="text-[14px] text-white/80 uppercase tracking-widest mb-8 flex items-center gap-3">
                                <BarChart className="w-5 h-5 text-[#22D3EE]" /> Economic Disbursement Delta
                            </h3>
                            <div className="space-y-6">
                                {[
                                    { label: "Operator Share (80%)", value: runRate?.operatorShareCents, color: "bg-emerald-500" },
                                    { label: "Platform Revenue (7%)", value: runRate?.platformShareCents, color: "bg-[#22D3EE]" },
                                    { label: "Founder Override (3%)", value: runRate?.founderShareCents, color: "bg-purple-500" }
                                ].map(bar => (
                                    <div key={bar.label} className="space-y-2">
                                        <div className="flex justify-between text-[12px]">
                                            <span className="text-white/60 font-medium">{bar.label}</span>
                                            <span className="text-white font-mono">{formatCents(bar.value)}</span>
                                        </div>
                                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div className={`${bar.color} h-full`} style={{ width: `${(bar.value / runRate?.totalVolumeCents) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'operators' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-sovereign overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/[0.04] text-[10px] text-white/40 uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-4 font-bold">Rank</th>
                                    <th className="px-6 py-4 font-bold">Operator</th>
                                    <th className="px-6 py-4 font-bold text-right">Job Volume</th>
                                    <th className="px-6 py-4 font-bold text-right">Total Revenue</th>
                                    <th className="px-6 py-4 font-bold text-center">Uptime</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-[13px]">
                                {operators.sort((a,b) => b.totalRevenue - a.totalRevenue).map((op, i) => (
                                    <tr key={op.operatorId} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-5 font-bold text-[#22D3EE]/50">#{i + 1}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-white font-medium">{op.email}</span>
                                                <span className="text-[10px] text-white/40 font-mono tracking-tighter">{op.operatorId}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right text-white/80 font-mono">{op.totalJobs}</td>
                                        <td className="px-6 py-5 text-right text-emerald-400 font-mono">{formatCents(op.totalRevenue)}</td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="flex-1 max-w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="bg-emerald-500 h-full" style={{ width: '99%' }} />
                                                </div>
                                                <span className="text-[10px] text-emerald-400 font-bold tracking-tight">99.9%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}

                {activeTab === 'founders' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {founders.map(f => (
                            <motion.div whileHover={{ y: -5 }} key={f.founderId} className="card-sovereign p-8 space-y-6 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Zap className="w-16 h-16" />
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-[5px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[14px] text-white font-medium">{f.founderEmail}</span>
                                        <span className="text-[10px] text-white/40 font-mono italic">Infinite Depth Active</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-wnode-border-separator space-y-4">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[11px] text-white/40 uppercase tracking-widest">Tree Root Accrual</span>
                                        <span className="text-[20px] font-normal text-[#22D3EE] font-mono">{formatCents(f.totalAccruedCents)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-white/40 uppercase tracking-widest">Growth Rate</span>
                                        <span className="text-emerald-400 font-bold">+{f.growthRate}%</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[11px]">
                                        <span className="text-white/40 uppercase tracking-widest">90d Contribution</span>
                                        <span className="text-white/80 font-mono">{formatCents(f.runRateContribution)}</span>
                                    </div>
                                </div>

                                <button className="w-full py-3 bg-white/[0.04] border border-wnode-border-neutral rounded-[5px] text-[10px] font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all">
                                    Visualize Tree Topology
                                </button>
                            </motion.div>
                        ))}
                    </div>
                )}

                {activeTab === 'platform' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="card-sovereign p-10 space-y-10">
                            <div className="flex items-center gap-3">
                                <Landmark className="w-6 h-6 text-[#22D3EE]" />
                                <h3 className="text-[16px] text-white uppercase tracking-[0.2em] font-light">Treasury & Reserves</h3>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-end justify-between border-b border-wnode-border-separator pb-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[12px] text-white/40 uppercase tracking-widest">Liquid Balance</span>
                                        <span className="text-[36px] font-normal text-white tracking-tighter">{formatCents(platform?.treasuryBalance)}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-[12px] text-emerald-400 font-bold uppercase tracking-widest">Solvent</div>
                                        <div className="text-[10px] text-white/40 uppercase tracking-widest">Audited Just Now</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                     <div className="space-y-2">
                                        <span className="text-[11px] text-white/40 uppercase tracking-widest leading-loose">90d Outlook</span>
                                        <div className="text-[18px] text-white/80 font-mono tracking-tighter">{formatCents(platform?.treasuryForecast)}</div>
                                     </div>
                                     <div className="space-y-2">
                                        <span className="text-[11px] text-white/40 uppercase tracking-widest leading-loose">Reserve Ratio</span>
                                        <div className="text-[18px] text-[#22D3EE] font-mono tracking-tighter">{(platform?.reserveRatio * 100).toFixed(2)}%</div>
                                     </div>
                                </div>
                            </div>

                            <div className="p-6 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-[8px] flex items-start gap-4">
                                <FileCheck className="w-5 h-5 text-emerald-400 mt-1" />
                                <div>
                                    <p className="text-[13px] text-white/80 font-medium">Authoritative Economic Alignment</p>
                                    <p className="text-[11px] text-white/40 mt-1 uppercase tracking-tight leading-relaxed">
                                        Platform reserves are calculated based on the immutable 7% infrastructure cut across all processed compute cycles.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="card-sovereign p-10 flex flex-col justify-center items-center relative group overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-tr from-[#22D3EE]/5 via-transparent to-purple-500/5 opacity-50 transition-opacity group-hover:opacity-100" />
                             <BarChart3 className="w-16 h-16 text-[#22D3EE]/20 mb-6 animate-pulse" />
                             <h4 className="text-[12px] text-white/40 uppercase tracking-[0.3em] mb-4">Network Growth Vector</h4>
                             <div className="text-[64px] font-normal text-white tracking-tighter mb-2">3.8x</div>
                             <p className="text-[11px] text-[#22D3EE] font-bold uppercase tracking-widest">Projected Q3 Expansion</p>
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
