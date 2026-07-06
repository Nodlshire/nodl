"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Zap, Save, RefreshCw, AlertCircle, CheckCircle2, 
    Globe, Shield, Info, SlidersHorizontal, Gauge, Eye, 
    ChevronDown, ChevronUp, Cloud
} from "lucide-react";

// Constants for Genesis Guard
const OPERATIONAL_COST_PARITY = {
    'standard': 0.0010,
    'boost': 0.0030,
    'ultra': 0.0060,
    'decc': 0.0090,
    'gpu-pro': 0.0140,
    'gpu-max': 0.0200
};

const getCompetitorColors = (id: string) => {
    const key = id?.toLowerCase() || '';
    if (key === 'aws') {
        return {
            bg: 'bg-slate-900/30',
            border: 'border border-green-400/50',
            shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.08)]',
            hover: 'hover:border-green-400/70'
        };
    }
    if (key === 'gcp') {
        return {
            bg: 'bg-slate-900/30',
            border: 'border border-blue-400/50',
            shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.08)]',
            hover: 'hover:border-blue-400/70'
        };
    }
    if (key === 'akash') {
        return {
            bg: 'bg-slate-900/30',
            border: 'border border-purple-400/50',
            shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.08)]',
            hover: 'hover:border-purple-400/70'
        };
    }
    if (key === 'render') {
        return {
            bg: 'bg-slate-900/30',
            border: 'border border-amber-400/50',
            shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.08)]',
            hover: 'hover:border-amber-400/70'
        };
    }
    return {
        bg: 'bg-slate-900/30',
        border: 'border border-blue-400/50',
        shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.08)]',
        hover: 'hover:border-blue-400/70'
    };
};

import { usePageTitle } from "../components/PageTitleContext";
import IdentityHeader from "@shared/components/IdentityHeader";
import Tooltip from "../components/Tooltip";

export default function PricingPage() {
    usePageTitle("Pricing Protocol & Tier Matrix", "Autonomous economy management with real-time market-relative rate tuning.");
    const [tiers, setTiers] = useState<any[]>([]);
    const [expandedTiers, setExpandedTiers] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);
    const [competitors, setCompetitors] = useState<any[]>([]);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const fetchPricing = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/pricing/tiers');
            if (res.ok) {
                const data = await res.json();
                setTiers(data);
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

    const toggleExpand = (id: string) => {
        const next = new Set(expandedTiers);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setExpandedTiers(next);
    };

    const handleUpdateRate = async (tierId: string, updates: any) => {
        setSaving(tierId);
        setMessage(null);
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const apiBase = ""; // Empty string for relative path
            
            const payload = {
                tier_id: tierId,
                rate_th_sec: updates.rate_th_sec,
                rule: {
                    mode: updates.rule?.mode || 'manual',
                    targetPercent: updates.rule?.targetPercent || 12.5,
                    autoTuneMode: 'undercut'
                }
            };

            const res = await fetch(`${apiBase}/api/admin/pricing/update`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${jwt}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: `Pricing protocol propagated for ${tierId}` });
                fetchPricing();
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update');
            }
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setSaving(null);
            setTimeout(() => setMessage(null), 4000);
        }
    };

    return (
        <div className="flex-1 flex overflow-hidden h-full">
            {/* Left side: Tier Matrix */}
            <main className="flex-1 p-8 pt-3 overflow-y-auto pb-24 relative custom-scrollbar space-y-6 focus:outline-none">

                <div className="mb-6">
                    <AnimatePresence>
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-[5px] border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                            >
                                {message.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                                <span className="text-[11px] font-normal tracking-wide">{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="max-w-7xl mx-auto space-y-6">
                    <AnimatePresence mode="popLayout">
                        {tiers.map((tier) => (
                            <TierCard 
                                key={tier.id} 
                                tier={tier} 
                                expanded={expandedTiers.has(tier.id)}
                                onToggle={() => toggleExpand(tier.id)}
                                competitors={competitors}
                                onUpdate={(updates: any) => handleUpdateRate(tier.id, updates)}
                                isSaving={saving === tier.id}
                            />
                        ))}
                    </AnimatePresence>
                    {loading && tiers.length === 0 && (
                        <div className="py-32 flex flex-col items-center justify-center space-y-4 opacity-40">
                            <RefreshCw className="w-8 h-8 animate-spin text-[#22D3EE]" />
                            <span className="text-[11px] uppercase tracking-[0.3em] font-light">Loading Protocol Data</span>
                        </div>
                    )}
                </div>
            </main>

            {/* Right side: Market Comparison Sidebar */}
            <aside className="w-[400px] border-l border-wnode-border-neutral bg-black/40 backdrop-blur-xl flex flex-col hidden xl:flex overflow-hidden h-full">
                <div className="p-8 border-b border-wnode-border-neutral shrink-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Tooltip text="Global market aggregation of cloud and DePIN compute rates">
                                <Globe className="w-4 h-4 text-[#22D3EE]" />
                            </Tooltip>
                            <h2 className="text-sm font-medium tracking-wide uppercase text-white/80">Market Intelligence</h2>
                        </div>
                        <Tooltip text="Real-time ingestion of external pricing signals" direction="down">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-500/10 border border-green-500/20 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[9px] text-green-500 font-bold uppercase tracking-widest">Live Flow</span>
                            </div>
                        </Tooltip>
                    </div>
                    <p className="text-xs text-white/60 uppercase tracking-widest">Global Compute Ingestion Feed</p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
                    {competitors.map((comp) => {
                        const style = getCompetitorColors(comp.id);
                        return (
                            <div key={comp.id} className={`${style.bg} ${style.border} ${style.shadow} ${style.hover} rounded-[5px] p-5 flex flex-col gap-4 group transition-all duration-300`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-[5px] bg-white/5 border border-wnode-border-neutral flex items-center justify-center group-hover:border-[#22D3EE]/30 transition-colors">
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
                                            <Tooltip text="Statistical certainty of the ingested pricing signal based on source frequency and peer verification">
                                                <span>Confidence Index</span>
                                            </Tooltip>
                                            <span className="text-base font-semibold text-white/90 font-mono">{(comp.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.5)] transition-all duration-1000" 
                                                style={{ width: `${comp.confidence * 100}%` }} 
                                            />
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

                    <div className="pt-4 pb-12">
                        <div className="bg-slate-900/30 border border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.08)] rounded-[5px] p-6 relative overflow-hidden group">
                            <div className="flex items-start gap-4 relative z-10">
                                <Shield className="w-5 h-5 text-[#22D3EE] mt-0.5 group-hover:scale-110 transition-transform" />
                                <div>
                                    <h4 className="text-sm font-medium tracking-wide uppercase text-white/85 mb-2">Genesis Guard Active</h4>
                                    <p className="text-xs text-white/65 leading-relaxed font-normal">
                                        Economy stabilized. All pricing tiers are locked to <span className="text-[#22D3EE] font-bold">110% operational parity</span> floor to protect provider margins.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#22D3EE]/10 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}

function TierCard({ tier: initialTier, expanded, onToggle, competitors, onUpdate, isSaving }: any) {
    const [tier, setTier] = useState(initialTier);
    
    useEffect(() => {
        setTier(initialTier);
    }, [initialTier]);

    const marketRange = useMemo(() => {
        const rates = competitors.map((c: any) => c.rate);
        const order = ['standard', 'boost', 'ultra', 'decc', 'gpu-pro', 'gpu-max'];
        const idx = order.indexOf(initialTier.id);
        const multiplier = 1 + (idx * 0.4);
        
        return {
            min: Math.min(...rates) * multiplier || 0,
            max: Math.max(...rates) * multiplier || 0,
            avg: (rates.reduce((a: any, b: any) => a + b, 0) / (rates.length || 1)) * multiplier || 0
        };
    }, [competitors, initialTier.id]);

    const floor = (OPERATIONAL_COST_PARITY[initialTier.id as keyof typeof OPERATIONAL_COST_PARITY] || 0) * 1.1;
    
    const effectiveRate = useMemo(() => {
        if (tier.rule?.mode === 'auto_tune') {
            const undercut = tier.rule.targetPercent || 12.5;
            const autoPrice = marketRange.avg * (1 - undercut / 100);
            return Math.max(autoPrice, floor);
        }
        return tier.rate_th_sec;
    }, [tier.rule?.mode, tier.rule?.targetPercent, tier.rate_th_sec, marketRange.avg, floor]);

    const isBelowFloor = effectiveRate < floor;

    const dailyRev = effectiveRate * 24 * 10;
    const platformFee = dailyRev * 0.10;
    const affiliateFee = dailyRev * 0.05;
    const netEarnings = dailyRev - platformFee - affiliateFee;

    const toggleMode = () => {
        const newMode = tier.rule?.mode === 'auto_tune' ? 'manual' : 'auto_tune';
        setTier({
            ...tier,
            rule: { ...tier.rule, mode: newMode }
        });
    };

    const colors = useMemo(() => {
        const key = initialTier.id?.toLowerCase() || '';
        if (key.includes('gpu')) {
            return { 
                bg: 'bg-green-950/10', 
                border: 'border border-green-400/50', 
                hoverBorder: 'hover:border-green-400/70', 
                shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.08)]' 
            };
        }
        if (key === 'decc' || key === 'tee') {
            return { 
                bg: 'bg-amber-950/10', 
                border: 'border border-amber-400/50', 
                hoverBorder: 'hover:border-amber-400/70', 
                shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.08)]' 
            };
        }
        if (key === 'boost' || key === 'ultra') {
            return { 
                bg: 'bg-purple-950/10', 
                border: 'border border-purple-400/50', 
                hoverBorder: 'hover:border-purple-400/70', 
                shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.08)]' 
            };
        }
        return { 
            bg: 'bg-blue-950/10', 
            border: 'border border-blue-400/50', 
            hoverBorder: 'hover:border-blue-400/70', 
            shadow: 'shadow-[0_0_20px_rgba(34,211,238,0.08)]' 
        };
    }, [initialTier.id]);

    return (
        <div className={`${colors.bg} bg-gradient-to-br from-white/[0.03] to-transparent ${expanded ? 'border border-[#22D3EE]/50 shadow-[0_0_30px_rgba(34,211,238,0.05)]' : `${colors.border} ${colors.hoverBorder} ${colors.shadow}`} rounded-xl overflow-hidden transition-all duration-500 relative`}>
            {expanded && <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#22D3EE] shadow-[2px_0_10px_rgba(34,211,238,0.4)]" />}
            
            <div className="p-6 flex items-center justify-between cursor-pointer group" onClick={onToggle}>
                <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-[5px] border flex items-center justify-center transition-all duration-500 ${expanded ? 'bg-[#22D3EE] text-black border-[#22D3EE]' : 'bg-white/5 text-[#22D3EE] border-wnode-border-neutral'}`}>
                        <Zap className={`w-6 h-6 ${expanded ? 'fill-current' : ''}`} />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium tracking-wide uppercase text-white/85">{tier.name || tier.id}</span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-[2px] uppercase tracking-widest font-bold border transition-colors ${tier.rule?.mode === 'auto_tune' ? 'bg-[#22D3EE]/10 text-[#22D3EE] border-[#22D3EE]/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'}`}>
                                {tier.rule?.mode === 'auto_tune' ? 'Autonomous' : 'Manual'}
                            </span>
                        </div>
                        <div className="flex items-center gap-5 mt-1.5">
                            <div className="flex items-center gap-2 font-mono">
                                <span className="text-xs text-white/65 uppercase tracking-widest">Protocol Rate</span>
                                <span className={`text-base font-semibold ${isBelowFloor ? 'text-red-400' : 'text-[#22D3EE]'}`}>${effectiveRate.toFixed(4)}<span className="text-xs text-white/65 font-normal ml-1">/hr</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22C55E]" />
                                <span className="text-[9px] text-green-500/80 uppercase tracking-widest font-bold">Mesh Synced</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden md:flex flex-col items-start opacity-60 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs text-white/65 uppercase tracking-tighter mb-0.5">Est. Net/Day</span>
                        <span className="text-base font-semibold text-white/95 font-mono">${netEarnings.toFixed(2)}</span>
                    </div>
                    {expanded ? <ChevronUp className="w-5 h-5 text-[#22D3EE]" /> : <ChevronDown className="w-5 h-5 text-white/40 group-hover:text-white/70" />}
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-wnode-border-separator bg-black/40"
                    >
                        <div className="p-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <h5 className="text-xs text-white/65 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Info className="w-3 h-3" /> Tier Overview
                                        </h5>
                                        <p className="text-xs text-white/65 leading-relaxed">{tier.description}</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                                            <div className="flex flex-col">
                                                <span className="text-white/65 uppercase tracking-tighter mb-0.5">vCPU</span>
                                                <span className="text-white font-mono">{tier.cpu_cores} Cores</span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-white/65 uppercase tracking-tighter mb-0.5">vRAM</span>
                                                <span className="text-white font-mono">{tier.ram_gb} GB</span>
                                            </div>
                                            <div className="flex flex-col col-span-2 mt-1">
                                                <span className="text-white/65 uppercase tracking-tighter mb-0.5">GPU Compute</span>
                                                <span className="text-white font-mono truncate">{tier.gpu_model}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-2">
                                        <h5 className="text-xs text-white/65 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Globe className="w-3 h-3" /> Market Intel
                                        </h5>
                                        <div className="space-y-2 bg-white/[0.02] border border-wnode-border-separator rounded-[5px] p-3">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-white/65">Market Low</span>
                                                <span className="font-mono text-white text-xs">${marketRange.min.toFixed(3)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-white/65 text-[#22D3EE]">Market Avg</span>
                                                <span className="font-mono text-[#22D3EE] text-xs font-bold">${marketRange.avg.toFixed(3)}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-white/65">Market High</span>
                                                <span className="font-mono text-white text-xs">${marketRange.max.toFixed(3)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h5 className="text-xs text-white/65 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <SlidersHorizontal className="w-3 h-3 text-[#22D3EE]" /> Strategy Control
                                            </h5>
                                            <button 
                                                onClick={toggleMode}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-[30px] text-xs font-bold uppercase tracking-widest transition-all ${tier.rule?.mode === 'auto_tune' ? 'bg-[#22D3EE] text-black' : 'bg-white/10 text-white'}`}
                                            >
                                                {tier.rule?.mode === 'auto_tune' ? <RefreshCw className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                                {tier.rule?.mode === 'auto_tune' ? 'Auto ON' : 'Manual'}
                                            </button>
                                        </div>

                                        {tier.rule?.mode === 'auto_tune' ? (
                                            <div className="p-4 bg-[#22D3EE]/5 border border-[#22D3EE]/20 rounded-[5px] space-y-5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-white uppercase tracking-wide">Target Undercut</span>
                                                    <span className="text-base font-semibold text-white/95 font-mono text-[#22D3EE]">-{tier.rule.targetPercent}%</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="50" step="0.5"
                                                    value={tier.rule.targetPercent}
                                                    onChange={(e) => setTier({...tier, rule: {...tier.rule, targetPercent: parseFloat(e.target.value)}})}
                                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#22D3EE]"
                                                />
                                                <div className="pt-2 border-t border-wnode-border-separator space-y-2">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-white/65">Suggested Price</span>
                                                        <span className="text-white font-mono">${(marketRange.avg * (1 - tier.rule.targetPercent / 100)).toFixed(4)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-white/65">Genesis Floor</span>
                                                        <span className="text-white/60 font-mono">${floor.toFixed(4)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-[5px] space-y-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs text-white uppercase tracking-wide">Manual Override</span>
                                                </div>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 font-mono text-xs">$</span>
                                                    <input 
                                                        type="number" step="0.0001"
                                                        value={tier.rate_th_sec}
                                                        onChange={(e) => setTier({...tier, rate_th_sec: parseFloat(e.target.value)})}
                                                        className="w-full bg-black border border-wnode-border-neutral rounded-[3px] py-3 pl-8 pr-3 font-mono text-[20px] focus:border-orange-500/50 outline-none transition-all text-white"
                                                    />
                                                </div>
                                                <div className={`flex items-center gap-2 text-xs font-bold uppercase tracking-tight py-1 px-2 rounded-[2px] ${isBelowFloor ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                                                    <Shield className="w-3 h-3" />
                                                    {isBelowFloor ? 'Below Genesis Floor' : 'Valid Strategy Detected'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <h5 className="text-xs text-white/65 uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Gauge className="w-3 h-3 text-purple-400" /> Economy Simulation
                                        </h5>
                                        <div className="bg-white/5 rounded-[5px] divide-y divide-white/5 border border-wnode-border-separator overflow-hidden">
                                            <div className="p-4 flex justify-between items-center bg-[#22D3EE]/5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-white font-medium">Daily Gross Revenue</span>
                                                    <span className="text-[9px] text-white/40 uppercase tracking-tighter">At 10 TH/sec node</span>
                                                </div>
                                                <span className="text-base font-semibold text-white/95 font-mono text-white">${dailyRev.toFixed(2)}</span>
                                            </div>
                                            <div className="p-3 flex justify-between items-center">
                                                <span className="text-xs text-white/65 uppercase tracking-widest">Platform Fee (10%)</span>
                                                <span className="text-xs font-mono text-white/50">-${platformFee.toFixed(2)}</span>
                                            </div>
                                            <div className="p-3 flex justify-between items-center">
                                                <span className="text-xs text-white/65 uppercase tracking-widest">Affiliate Revenue (5%)</span>
                                                <span className="text-xs font-mono text-white/50">-${affiliateFee.toFixed(2)}</span>
                                            </div>
                                            <div className="p-4 flex justify-between items-center bg-green-500/5">
                                                <div className="flex flex-col">
                                                    <span className="text-xs text-green-400 font-bold uppercase tracking-widest">Net Earnings</span>
                                                    <span className="text-[9px] text-green-400/60 lowercase italic">liquid payout to nodl'r</span>
                                                </div>
                                                <span className="text-base font-semibold text-white/95 font-mono text-green-400 font-bold">${netEarnings.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-[5px] border flex flex-col md:flex-row items-center justify-between gap-4 transition-all ${isBelowFloor ? 'bg-red-500/10 border-red-500/30' : 'bg-[#22D3EE]/5 border-[#22D3EE]/20'}`}>
                                <div className="flex items-start gap-4">
                                    <Shield className={`w-5 h-5 mt-0.5 ${isBelowFloor ? 'text-red-500' : 'text-[#22D3EE]'}`} />
                                    <div>
                                        <h6 className={`text-xs font-bold uppercase tracking-widest mb-1 ${isBelowFloor ? 'text-red-500' : 'text-[#22D3EE]'}`}>
                                            {isBelowFloor ? 'Genesis Guard Intervention' : 'Protocol Stability: High'}
                                        </h6>
                                        <p className="text-xs text-white/65 leading-relaxed max-w-xl">
                                            {isBelowFloor 
                                                ? `The current rate is below the 110% operational cost floor ($${floor.toFixed(5)}). Propagation will be locked or adjusted by the backend to prevent platform deficit.`
                                                : "Current pricing strategy is verified against the Genesis Guard. It maintains a healthy margin above operational parity and is ready for propagation."}
                                        </p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onUpdate(tier)}
                                    disabled={isSaving}
                                    className={`px-8 py-3 rounded-[5px] text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-3 min-w-[200px] border shadow-lg ${isBelowFloor ? 'bg-slate-800 text-white/30 cursor-not-allowed border-wnode-border-separator' : 'bg-[#22D3EE] text-black hover:bg-[#22D3EE]/90 border-[#22D3EE] shadow-[#22D3EE]/20'}`}
                                >
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Update Protocol
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
