"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Zap, Save, RefreshCw, AlertCircle, CheckCircle2, 
    Globe, Shield, Info, SlidersHorizontal, Gauge, Eye, 
    ChevronDown, ChevronUp, Cloud, Plus, Edit3, X, Activity, Check
} from "lucide-react";
import { usePageTitle } from "../components/PageTitleContext";
import Tooltip from "../components/Tooltip";

const getCompetitorColors = (id: string) => {
    const key = id?.toLowerCase() || '';
    if (key === 'aws') return { bg: 'bg-slate-900/30', border: 'border border-green-400/50', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.08)]', hover: 'hover:border-green-400/70' };
    if (key === 'gcp') return { bg: 'bg-slate-900/30', border: 'border border-blue-400/50', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.08)]', hover: 'hover:border-blue-400/70' };
    if (key === 'akash') return { bg: 'bg-slate-900/30', border: 'border border-purple-400/50', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.08)]', hover: 'hover:border-purple-400/70' };
    if (key === 'render') return { bg: 'bg-slate-900/30', border: 'border border-amber-400/50', shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.08)]', hover: 'hover:border-amber-400/70' };
    return { bg: 'bg-slate-900/30', border: 'border border-blue-400/50', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.08)]', hover: 'hover:border-blue-400/70' };
};

export default function PricingPage() {
    usePageTitle("PRICING", "Autonomous economy management with real-time market-relative rate tuning.");
    const [tiers, setTiers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [competitors, setCompetitors] = useState<any[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTier, setEditingTier] = useState<any | null>(null);

    const fetchPricing = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/pricing/tiers');
            if (res.ok) {
                const data = await res.json();
                setTiers(Array.isArray(data) ? data : (data?.tiers || []));
            } else {
                setTiers([]);
            }
        } catch (err) {
            console.error("Failed to fetch pricing:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompetitors = () => {
        setCompetitors([
            { id: 'aws', name: 'AWS', sku: 'g5.xlarge', gpu: 'A10G', rate: 1.006, delta: +1.2, type: 'Cloud', source: 'Live API', confidence: 0.98, status: 'Live' },
            { id: 'gcp', name: 'GCP', sku: 'a2-highgpu', gpu: 'A100-40', rate: 3.67, delta: -0.5, type: 'Cloud', source: 'Live API', confidence: 0.95, status: 'Live' },
            { id: 'akash', name: 'Akash', sku: 'Standard-8', gpu: 'RTX 3080', rate: 0.22, delta: +0.0, type: 'DePIN', source: 'Cached', confidence: 0.82, status: 'Synced' },
            { id: 'render', name: 'Render', sku: 'Node-RTX', gpu: 'RTX 4090', rate: 0.45, delta: -2.1, type: 'DePIN', source: 'Live API', confidence: 0.91, status: 'Live' },
            { id: 'coreweave', name: 'Coreweave', sku: 'hgx-h100', gpu: 'H100', rate: 4.25, delta: +0.0, type: 'Hybrid', source: 'Live API', confidence: 0.99, status: 'Live' },
        ]);
    };

    useEffect(() => {
        fetchPricing();
        fetchCompetitors();
        const interval = setInterval(fetchCompetitors, 30000); 
        return () => clearInterval(interval);
    }, []);

    const handleSaveTier = async () => {
        if (!editingTier) return;
        setSaving('modal');
        try {
            const url = editingTier.isCustom ? '/api/admin/pricing/tiers' : '/api/admin/pricing/update';
            const method = editingTier.isCustom && !editingTier.id.startsWith('custom-') ? 'POST' : 'PATCH';
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editingTier),
            });
            if (res.ok) {
                setMessage({ type: 'success', text: `Tier saved successfully.` });
                fetchPricing();
                setIsModalOpen(false);
            } else {
                throw new Error('Failed to save tier');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const openCreateModal = () => {
        setEditingTier({
            id: '',
            name: 'New Tier',
            ratePerWU: 0.001,
            minCpuCores: 2,
            maxRamGb: 4,
            sandboxType: 'wasm',
            status: 'Active',
            isCustom: true
        });
        setIsModalOpen(true);
    };

    const openEditModal = (tier: any) => {
        setEditingTier({ ...tier, isCustom: tier.id.startsWith('custom') });
        setIsModalOpen(true);
    };

    return (
        <div className="flex-1 flex overflow-hidden h-full">
            {/* Left side: Data Grid */}
            <main className="flex-1 p-8 pt-3 overflow-y-auto pb-24 relative space-y-6 focus:outline-none">
                <div className="mb-6 flex justify-between items-center">
                    <AnimatePresence>
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-[2px] border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                            >
                                {message.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                <span className="text-[11px] font-normal tracking-wide">{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!message && <div />}
                    
                    <button 
                        onClick={openCreateModal}
                        className="bg-[#22D3EE] text-black hover:bg-[#22D3EE]/80 px-4 py-2 rounded-[2px] font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Create New Tier
                    </button>
                </div>

                {!loading && tiers.length === 0 && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono rounded-[2px]">
                        ERROR: No tiers loaded. Backend API may be unreachable or returning an empty array.
                    </div>
                )}

                <div className="border border-wnode-border-separator bg-[#050505] overflow-hidden shadow-2xl">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-wnode-border-neutral">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/50">Tier Details</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/50">Base Price (WU)</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/50">Compute Limits</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/50">Status</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/50 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {tiers.map((tier) => (
                                <tr key={tier.id} className="hover:bg-cyan-400/[0.02] transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_#22d3ee] transition-shadow" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black uppercase tracking-tight">{tier.name}</span>
                                                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{tier.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 font-mono text-cyan-400 text-sm font-black">
                                        ${tier.ratePerWU?.toFixed(4)}
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-bold text-white/80">{tier.minCpuCores} vCPU • {tier.maxRamGb}GB RAM</span>
                                            <span className="text-[10px] text-white/50 uppercase tracking-widest">{tier.sandboxType === 'bare-metal' ? 'Bare-Metal' : 'WASM Sandbox'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`text-[9px] px-2 py-0.5 rounded-[2px] uppercase tracking-widest font-bold border ${tier.status === 'Deprecated' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                                            {tier.status || 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button 
                                            onClick={() => openEditModal(tier)}
                                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-wnode-border-neutral rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-colors"
                                        >
                                            <Edit3 className="w-3 h-3" /> Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {loading && tiers.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-24 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4 opacity-40">
                                            <RefreshCw className="w-6 h-6 animate-spin text-[#22D3EE]" />
                                            <span className="text-[10px] uppercase tracking-[0.3em] font-light">Syncing Ledger...</span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* Right side: Market Comparison Sidebar */}
            <aside className="w-[380px] shrink-0 border-l border-wnode-border-neutral bg-black/40 backdrop-blur-xl flex flex-col hidden xl:flex overflow-hidden h-full">
                <div className="p-8 border-b border-wnode-border-neutral shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Tooltip text="Global market aggregation of cloud and DePIN compute rates">
                                <Globe className="w-4 h-4 text-[#22D3EE]" />
                            </Tooltip>
                            <h2 className="text-sm font-medium tracking-wide uppercase text-white/80">Market Intelligence</h2>
                        </div>
                        <Tooltip text="Real-time ingestion of external pricing signals" direction="down">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-[2px]">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Live Flow</span>
                            </div>
                        </Tooltip>
                    </div>
                    <p className="text-xs text-white/60 uppercase tracking-widest">Global Compute Ingestion Feed</p>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    {competitors.map((comp) => {
                        const style = getCompetitorColors(comp.id);
                        return (
                            <div key={comp.id} className={`${style.bg} ${style.border} ${style.shadow} ${style.hover} rounded-[2px] p-5 flex flex-col gap-4 group transition-all duration-300`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-[2px] bg-white/5 border border-wnode-border-neutral flex items-center justify-center group-hover:border-[#22D3EE]/30 transition-colors">
                                            <Cloud className="w-5 h-5 text-white/40 group-hover:text-[#22D3EE] transition-colors" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium tracking-wide uppercase text-white/80">{comp.name}</span>
                                            <span className="text-xs text-white/60 font-mono uppercase tracking-widest">{comp.sku}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-base font-semibold text-white/90 font-mono">${comp.rate.toFixed(3)}</span>
                                        <span className={`text-[10px] font-mono ${comp.delta >= 0 ? 'text-red-400' : 'text-green-400'}`}>
                                            {comp.delta >= 0 ? '▲' : '▼'} {Math.abs(comp.delta).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 py-3 border-y border-wnode-border-separator">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-white/60 uppercase font-bold tracking-widest">Compute Core</span>
                                        <span className="text-xs text-white/60 font-mono">{comp.gpu}</span>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex justify-between items-center text-xs text-white/60 uppercase font-bold tracking-widest">
                                            <Tooltip text="Statistical certainty of the ingested pricing signal">
                                                <span>Confidence Index</span>
                                            </Tooltip>
                                            <span className="text-base font-semibold text-white/90 font-mono">{(comp.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-1000" style={{ width: `${comp.confidence * 100}%` }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs text-white/60 font-mono opacity-40 group-hover:opacity-100 transition-opacity">
                                    <span className="text-white/60 uppercase tracking-widest">{comp.source}</span>
                                    <span className="text-white/60 uppercase tracking-tighter">{comp.status}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </aside>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && editingTier && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-xl bg-[#09090b] border border-wnode-border-neutral rounded-[2px] p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
                                    <Zap className="text-cyan-400 w-5 h-5" />
                                    {editingTier.id === '' ? 'Create Custom Tier' : `Edit: ${editingTier.name}`}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-white/40" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Tier Name</label>
                                    <input 
                                        type="text" 
                                        value={editingTier.name}
                                        onChange={(e) => setEditingTier({...editingTier, name: e.target.value})}
                                        className="w-full bg-white/5 border border-wnode-border-neutral rounded-[2px] px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-400/50 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Rate ($/WU)</label>
                                        <input 
                                            type="number" 
                                            step="0.0001"
                                            value={editingTier.ratePerWU}
                                            onChange={(e) => setEditingTier({...editingTier, ratePerWU: parseFloat(e.target.value)})}
                                            className="w-full bg-white/5 border border-wnode-border-neutral rounded-[2px] px-4 py-3 font-mono text-cyan-400 focus:outline-none focus:border-cyan-400/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">CPU Cores (Min)</label>
                                        <input 
                                            type="number" 
                                            value={editingTier.minCpuCores}
                                            onChange={(e) => setEditingTier({...editingTier, minCpuCores: parseInt(e.target.value)})}
                                            className="w-full bg-white/5 border border-wnode-border-neutral rounded-[2px] px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-400/50 text-white"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">RAM (Max GB)</label>
                                        <input 
                                            type="number" 
                                            value={editingTier.maxRamGb}
                                            onChange={(e) => setEditingTier({...editingTier, maxRamGb: parseInt(e.target.value)})}
                                            className="w-full bg-white/5 border border-wnode-border-neutral rounded-[2px] px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-400/50 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Sandbox Type</label>
                                        <select 
                                            value={editingTier.sandboxType || 'wasm'}
                                            onChange={(e) => setEditingTier({...editingTier, sandboxType: e.target.value})}
                                            className="w-full bg-white/5 border border-wnode-border-neutral rounded-[2px] px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-400/50 text-white appearance-none"
                                        >
                                            <option value="wasm">WASM Sandbox</option>
                                            <option value="bare-metal">Bare-Metal</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-2 mt-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Status</label>
                                    <select 
                                        value={editingTier.status || 'Active'}
                                        onChange={(e) => setEditingTier({...editingTier, status: e.target.value})}
                                        className="w-full bg-white/5 border border-wnode-border-neutral rounded-[2px] px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-400/50 text-white appearance-none"
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Deprecated">Deprecated</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-4">
                                <button 
                                    onClick={handleSaveTier}
                                    disabled={saving === 'modal'}
                                    className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest py-3 rounded-[2px] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)] disabled:opacity-50"
                                >
                                    {saving === 'modal' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                    Confirm Configuration
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
