// TEST_WRITE_OK
"use client";

import React, { useState, useMemo } from "react";
import { 
    Search, Plus, Shield, Cpu, Network, History, ArrowRightLeft, 
    X, Power, ChevronRight, Activity, Globe, Info, 
    ShieldCheck, ShieldAlert, Zap, DollarSign, Users, 
    Trash2, LogOut, RefreshCw, MessageSquareCode, 
    ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock, 
    Server, HardDrive, Terminal, Smartphone, Lock, Database
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DetailPanel from "../components/DetailPanel";



export default function NodlrsCRM() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNodlr, setSelectedNodlr] = useState<null | any>(null);
    const [nodlrDetails, setNodlrDetails] = useState<null | any>(null);
    const [message, setMessage] = useState<{type: 'success'|'error', text: string}|null>(null);
    const [nodlrs, setNodlrs] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [nodlrsRes, statsRes] = await Promise.all([
                fetch('/api/nodlrs/all'),
                fetch('/api/stats')
            ]);
            if (nodlrsRes.ok) setNodlrs(await nodlrsRes.json());
            if (statsRes.ok) setStats(await statsRes.json());
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchData();
    }, []);

    const fetchDetails = async (id: string) => {
        try {
            const res = await fetch(`/api/nodlrs/${id}`);
            if (res.ok) setNodlrDetails(await res.json());
        } catch (error) {
            console.error('Failed to fetch details:', error);
        }
    };

    React.useEffect(() => {
        if (selectedNodlr) {
            fetchDetails(selectedNodlr.id);
        } else {
            setNodlrDetails(null);
        }
    }, [selectedNodlr]);

    const handleAction = async (action: string, extraData?: any) => {
        if (action === 'resolve_flag') {
            try {
                const res = await fetch(`/api/admin/nodlr/${selectedNodlr.id}/resolve-flag`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: extraData, hardwareDNA: extraData === 'clear' ? 'ALL' : 'MOCK' }),
                });
                if (res.ok) {
                    setMessage({ type: 'success', text: `Flag resolved: ${extraData}` });
                    fetchData();
                }
            } catch (e) {
                setMessage({ type: 'error', text: 'Action failed' });
            }
        } else {
            setMessage({ type: 'error', text: `Action [${action}] is not implemented in the backend.` });
        }
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto pb-24 relative custom-scrollbar h-full">
            <header className="flex flex-col gap-2 mb-10">
                <div className="flex items-center justify-start gap-6">
                    <h1 className="text-xl font-normal tracking-tight text-white uppercase tracking-widest">Nodl'r Registry Operations</h1>
                    
                    <AnimatePresence>
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-[5px] border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                            >
                                {message.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                <span className="text-[11px] font-normal uppercase tracking-wider">{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <p className="text-[14px] text-slate-500 font-normal">Global nodl'r index and compliance oversight.</p>
            </header>

            {/* Summary Box */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
                {[
                    { label: "Total Nodl'rs", value: stats?.totalNodlrs || 0, icon: Users, color: "text-white" },
                    { label: "Total Active Nodes", value: stats?.activeNodes || 0, icon: CheckCircle2, color: "text-green-400" },
                    { label: "Flagged Nodes", value: stats?.flaggedNodes || 0, icon: ShieldAlert, color: "text-orange-400" },
                    { label: "Inactive Nodes", value: (stats?.totalNodes || 0) - (stats?.activeNodes || 0), icon: Clock, color: "text-blue-400" },
                    { label: "Total Node Fleet", value: stats?.totalNodes || 0, icon: Database, color: "text-[#22D3EE]" },
                    { label: "Risk Baseline", value: "Optimal", icon: Zap, color: "text-white" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white/[0.02] border border-white/10 rounded-[5px] p-5 flex flex-col gap-3 group hover:border-white/20 transition-all">
                        <div className="flex items-center justify-start gap-4">
                            <stat.icon className={`w-4 h-4 ${stat.color} opacity-40 group-hover:opacity-100 transition-opacity`} />
                            <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Global Overview</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[20px] text-white font-mono">{isLoading ? '...' : stat.value}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card-sovereign p-6 flex items-center gap-6 mb-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22D3EE] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by ID, Hardware, or Account..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-[400px] w-full bg-black/50 border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-slate-700"
                    />
                </div>
                <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3 rounded-[5px] flex items-center gap-3 text-[13px] font-bold uppercase tracking-widest transition-all">
                    <Plus className="w-4 h-4" />
                    New Nodl'r
                </button>
            </div>

            <div className="card-sovereign overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/[0.04] text-[11px] text-slate-500 uppercase tracking-widest border-b border-white/10">
                        <tr>
                            <th className="px-6 py-5 font-normal">Nodl'r Profile</th>
                            <th className="px-6 py-5 font-normal">Security Status</th>
                            <th className="px-6 py-5 font-normal">Active nodl's</th>
                            <th className="px-6 py-5 font-normal">Verification Status</th>
                            <th className="px-6 py-5 font-normal">Liquid payout to nodl'r</th>
                            <th className="px-6 py-5 font-normal">Stability</th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-slate-300 divide-y divide-white/5">
                        {nodlrs.filter(r => 
                            (r.displayName || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (r.email || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (r.protocolId || "").toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((row) => (
                            <tr 
                                key={row.id} 
                                onClick={() => setSelectedNodlr(row)}
                                className="hover:bg-white/[0.02] cursor-pointer group transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-[5px] bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:text-[#22D3EE] transition-colors relative">
                                            <Users className="w-5 h-5" />
                                            {row.isFounder && (
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#22D3EE] rounded-full border border-black shadow-[0_0_5px_#22D3EE]" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-medium">{row.displayName || row.email}</span>
                                                {row.isFounder && <span className="text-[8px] bg-[#22D3EE]/10 text-[#22D3EE] px-1 rounded-[2px] font-bold tracking-widest border border-[#22D3EE]/20">FNDR</span>}
                                            </div>
                                            <span className="text-[11px] text-[#22D3EE] font-mono tracking-tighter font-bold">{row.protocolId}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-1.5 h-1.5 rounded-full ${
                                            row.status === 'active' ? 'bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]' : 'bg-slate-700'
                                        }`} />
                                        <span className="text-[12px] uppercase tracking-wide">{row.status || 'pending'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-white font-mono">{row.nodeCount}</td>
                                <td className="px-6 py-4">
                                    <span className={`text-[10px] px-2 py-0.5 rounded-[2px] uppercase tracking-widest font-bold border ${row.stripeVerification ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                        {row.stripeVerification ? 'Stripe verified' : 'Stripe pending'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-white font-mono text-[13px]">
                                    {row.accruedFounderBalance !== undefined ? `$${(row.accruedFounderBalance / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '$0.00'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-start gap-2">
                                        <span className="text-[12px] font-mono text-[#22D3EE]">{row.stability !== undefined ? `${row.stability.toFixed(1)}%` : '--%'}</span>
                                        <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#22D3EE]" style={{ width: `${row.stability || 0}%` }} />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Redesigned Detail Panel (Aligned with Cockpit) */}
            <DetailPanel
                isOpen={!!selectedNodlr}
                onClose={() => setSelectedNodlr(null)}
                title="Nodl'r Profile Intelligence"
                subtitle={`Universal Protocol ID: ${selectedNodlr?.protocolId}`}
                footer={
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            disabled
                            className="py-2.5 px-3 bg-red-500/5 text-red-500/30 border border-red-500/10 rounded-[3px] text-[10px] font-bold uppercase tracking-widest cursor-not-allowed"
                        >
                            Suspend (N/A)
                        </button>
                        <button 
                            disabled
                            className="py-2.5 px-3 bg-green-500/5 text-green-400/30 border border-green-500/10 rounded-[3px] text-[10px] font-bold uppercase tracking-widest cursor-not-allowed"
                        >
                            Authorize (N/A)
                        </button>
                        <button 
                            onClick={() => handleAction('resolve_flag', 'clear')}
                            className="py-2.5 px-3 bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 text-[#22D3EE] border border-[#22D3EE]/20 rounded-[3px] text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            Clear Flags
                        </button>
                        <button 
                            onClick={() => handleAction('resolve_flag', 'shadow-bench')}
                            className="py-2.5 px-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-[3px] text-[10px] font-bold uppercase tracking-widest transition-all"
                        >
                            Shadow Bench
                        </button>
                    </div>
                }
            >
                {selectedNodlr && (
                    <div className="space-y-10">
                        {/* Status Blocks (Machine Readable) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-5 bg-white/[0.02] border border-white/10 rounded-[5px] space-y-3">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Activity className="w-3.5 h-3.5 text-[#22D3EE]" /> Account Health
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className={`text-[20px] font-mono tracking-tighter ${selectedNodlr.status === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {selectedNodlr.accountHealth || nodlrDetails?.profile?.accountHealth || "N/A"}
                                    </span>
                                </div>
                            </div>
                            <div className="p-5 bg-white/[0.02] border border-white/10 rounded-[5px] space-y-3">
                                <span className="text-[10px] text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <ShieldCheck className="w-3.5 h-3.5 text-[#22D3EE]" /> Trust Score
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[24px] font-mono text-white">{nodlrDetails?.profile?.integrityScore ?? 950}</span>
                                    <span className="text-[12px] text-slate-600 font-normal">/1000</span>
                                </div>
                            </div>
                        </div>

                        {/* Identity & Compliance */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-slate-500" />
                                <h4 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Identity & Compliance</h4>
                            </div>
                            <div className="bg-black/40 border border-white/5 rounded-[5px] divide-y divide-white/5 overflow-hidden">
                                <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-all">
                                    <span className="text-[13px] text-slate-500">Official Email</span>
                                    <span className="text-[14px] text-white font-mono">{selectedNodlr.email || nodlrDetails?.profile?.email || "N/A"}</span>
                                </div>
                                <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-all">
                                    <span className="text-[13px] text-slate-500">Region / Geo Root</span>
                                    <span className="text-[14px] text-white uppercase tracking-wider font-mono">
                                        {selectedNodlr?.region || nodlrDetails?.profile?.region || "Unknown"}
                                    </span>
                                </div>
                                <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-all">
                                    <span className="text-[13px] text-slate-500">Contact Interface</span>
                                    <span className="text-[12px] text-[#22D3EE] font-mono">
                                        {selectedNodlr?.contactInfo?.telegram || nodlrDetails?.profile?.contactInfo?.telegram || "N/A"}
                                    </span>
                                </div>
                                <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-all">
                                    <span className="text-[13px] text-slate-500">Stripe Verification</span>
                                    <span className={`text-[11px] uppercase tracking-widest font-bold ${selectedNodlr.stripeVerification ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {selectedNodlr.stripeVerification ? 'Verified' : 'Pending'}
                                    </span>
                                </div>
                                <div className="p-4 flex justify-between items-center hover:bg-white/[0.02] transition-all">
                                    <span className="text-[13px] text-slate-500">Registry Date</span>
                                    <span className="text-[14px] font-mono text-white">
                                        {selectedNodlr?.createdAt ? new Date(selectedNodlr.createdAt).toLocaleDateString() : (nodlrDetails?.profile?.createdAt ? new Date(nodlrDetails.profile.createdAt).toLocaleDateString() : "N/A")}
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Fleet Intelligence */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Database className="w-4 h-4 text-[#22D3EE]" />
                                <h4 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Fleet Intelligence</h4>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="bg-white/5 p-4 rounded-[5px] text-center space-y-1">
                                    <span className="text-[20px] font-mono text-white block">{selectedNodlr.nodeCount}</span>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Total Nodes</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-[5px] text-center space-y-1">
                                    <span className="text-[20px] font-mono text-green-400 block">{nodlrDetails?.fleet?.length || selectedNodlr.nodeCount}</span>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Active</span>
                                </div>
                                <div className="bg-white/5 p-4 rounded-[5px] text-center space-y-1">
                                    <span className="text-[20px] font-mono text-slate-600 block">
                                        {nodlrDetails?.fleet ? nodlrDetails.fleet.filter((n: any) => n.status !== 'online' && n.status !== 'active').length : 0}
                                    </span>
                                    <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Offline</span>
                                </div>
                            </div>
                        </section>

                        {/* Financial Ledger */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-400" />
                                <h4 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Financial Ledger</h4>
                            </div>
                            <div className="bg-[#22D3EE]/5 border border-[#22D3EE]/20 p-6 rounded-[5px] flex justify-between items-center">
                                <div className="space-y-1 text-left">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block">Accrued Founder Balance</span>
                                    <span className="text-[32px] font-mono text-white leading-none">
                                        {selectedNodlr?.accruedFounderBalance !== undefined 
                                            ? `$${(selectedNodlr.accruedFounderBalance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
                                            : (nodlrDetails?.profile?.accruedFounderBalance !== undefined 
                                                ? `$${(nodlrDetails.profile.accruedFounderBalance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}` 
                                                : "N/A")}
                                    </span>
                                </div>
                                <div className="w-12 h-12 rounded-full bg-[#22D3EE]/10 flex items-center justify-center">
                                    <Activity className="w-6 h-6 text-[#22D3EE] opacity-40" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1 text-left">
                                    <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold block">Frequency</span>
                                    <p className="text-[14px] text-white uppercase tracking-wider">{nodlrDetails?.profile?.payoutFrequency || "Weekly"}</p>
                                </div>
                                <div className="space-y-1 text-left">
                                    <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold block">Method</span>
                                    <p className="text-[14px] text-white">
                                        {nodlrDetails?.profile?.stripeConnectId || selectedNodlr.stripeVerification ? "Stripe Connect" : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </DetailPanel>
        </div>
    );
}
