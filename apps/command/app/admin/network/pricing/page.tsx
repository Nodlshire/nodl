"use client";

import React, { useState, useEffect } from 'react';
import { 
    LayoutGrid, 
    Database, 
    Cpu, 
    Zap, 
    ChevronRight, 
    Plus, 
    Edit3, 
    Save, 
    X,
    Server,
    Activity,
    Shield
} from 'lucide-react';

interface Tier {
    id: string;
    name: string;
    ratePerWU: number;
    minCpuCores: number;
    maxRamGb: number;
    sandboxType: string;
    status: string;
    isCustom: boolean;
}

export default function PricingManager() {
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [editingTier, setEditingTier] = useState<Tier | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const fetchTiers = async () => {
        try {
            const res = await fetch('/api/admin/pricing/tiers');
            if (res.ok) {
                const data = await res.json();
                setTiers(Array.isArray(data) ? data : (data?.tiers || []));
            } else {
                setTiers([]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTiers();
    }, []);

    const handleUpdate = async (tier: Tier) => {
        try {
            const res = await fetch(`/api/admin/pricing/update`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tier)
            });
            if (res.ok) {
                setStatus({ type: 'success', msg: `Tier ${tier.name} updated successfully.` });
                setEditingTier(null);
                fetchTiers();
                setTimeout(() => setStatus(null), 3000);
            }
        } catch (err) {
            setStatus({ type: 'error', msg: `Failed to update tier.` });
        }
    };

    if (loading) return <div className="h-screen bg-black flex items-center justify-center text-cyan-400 font-mono">LOADING_NETWORK_MATRIX...</div>;

    return (
        <div className="w-full flex flex-col items-start justify-start text-left space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4">
                        <Zap className="text-cyan-400 w-10 h-10" />
                        Price Controller
                    </h1>
                    <p className="text-white/40 uppercase tracking-widest text-[10px] mt-2 font-bold">
                        Global Network Authority // Managed Compute Tiers
                    </p>
                </div>

                <div className="flex items-center gap-4 px-6 py-3 bg-cyan-400/5 border border-cyan-400/20 rounded-lg">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <div>
                        <div className="text-[10px] text-cyan-400 font-black uppercase tracking-wider">Source of Truth</div>
                        <div className="text-[9px] text-white/40 font-bold uppercase">nodld_api:8080</div>
                    </div>
                </div>
            </div>

            {status && (
                <div className={`mb-8 p-4 border rounded-lg uppercase tracking-widest text-[11px] font-black flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
                    status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                    <Shield className="w-4 h-4" />
                    {status.msg}
                </div>
            )}

            {/* Matrix Table */}
            <div className="bg-[#050505] overflow-hidden w-full">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-[#0a0a0a]">
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/50">Tier ID</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/50">Rate ($/WU)</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/50">CPU</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/50">Sandbox Type</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/50">RAM</th>
                            <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white/50 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tiers.map((tier) => (
                            <tr key={tier.id} className="hover:bg-cyan-400/[0.02] transition-colors group">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-cyan-400 group-hover:shadow-[0_0_8px_#22d3ee]" />
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black uppercase tracking-tight">{tier.name}</span>
                                            <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">{tier.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 font-mono text-cyan-400 text-xs font-black">
                                    ${tier.ratePerWU?.toFixed(4)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-xs font-bold text-white/80">{tier.minCpuCores} vCPU</span>
                                </td>
                                <td className="px-4 py-3">
                                    <span className="text-[9px] font-black uppercase tracking-wider text-white/80 px-2 py-1 bg-white/5 rounded-none">
                                        {tier.sandboxType === 'bare-metal' ? 'Bare-Metal' : 'WASM Sandbox'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 font-bold text-white/80 text-xs">
                                    {tier.maxRamGb} GB
                                </td>
                                <td className="px-4 py-3 text-left">
                                    <button 
                                        onClick={() => setEditingTier(tier)}
                                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-none text-[9px] font-black uppercase tracking-widest transition-all"
                                    >
                                        <Edit3 className="w-3 h-3" />
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal Overlay */}
            {editingTier && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-xl bg-[#0a0a0a] rounded-none p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                                <Edit3 className="text-cyan-400 w-4 h-4" />
                                Edit Tier: {editingTier.name}
                            </h2>
                            <button onClick={() => setEditingTier(null)} className="p-2 hover:bg-white/5 rounded-none transition-colors">
                                <X className="w-4 h-4 text-white/40" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Rate ($/WU)</label>
                                    <input 
                                        type="number" 
                                        step="0.0001"
                                        value={editingTier.ratePerWU}
                                        onChange={(e) => setEditingTier({...editingTier, ratePerWU: parseFloat(e.target.value)})}
                                        className="w-full bg-[#111] border-none rounded-none px-3 py-2 font-mono text-cyan-400 text-xs focus:outline-none focus:bg-[#1a1a1a]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">CPU Cores</label>
                                    <input 
                                        type="number" 
                                        value={editingTier.minCpuCores}
                                        onChange={(e) => setEditingTier({...editingTier, minCpuCores: parseInt(e.target.value)})}
                                        className="w-full bg-[#111] border-none rounded-none px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#1a1a1a]"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">RAM (GB)</label>
                                    <input 
                                        type="number" 
                                        value={editingTier.maxRamGb}
                                        onChange={(e) => setEditingTier({...editingTier, maxRamGb: parseInt(e.target.value)})}
                                        className="w-full bg-[#111] border-none rounded-none px-3 py-2 text-xs font-bold focus:outline-none focus:bg-[#1a1a1a]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Sandbox Type</label>
                                    <select 
                                        value={editingTier.sandboxType}
                                        onChange={(e) => setEditingTier({...editingTier, sandboxType: e.target.value})}
                                        className="w-full bg-[#111] border-none rounded-none px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:bg-[#1a1a1a] appearance-none"
                                    >
                                        <option value="wasm">WASM Sandbox</option>
                                        <option value="bare-metal">Bare-Metal</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/40">Status</label>
                                <select 
                                    value={editingTier.status}
                                    onChange={(e) => setEditingTier({...editingTier, status: e.target.value})}
                                    className="w-full bg-[#111] border-none rounded-none px-3 py-2 text-xs font-bold uppercase focus:outline-none focus:bg-[#1a1a1a] appearance-none"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Deprecated">Deprecated</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-2">
                            <button 
                                onClick={() => handleUpdate(editingTier)}
                                className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest py-2 rounded-none transition-all shadow-none flex items-center justify-center gap-2 text-[10px]"
                            >
                                <Save className="w-3 h-3" />
                                Commit Changes
                            </button>
                            <button 
                                onClick={() => setEditingTier(null)}
                                className="px-6 bg-white/5 hover:bg-white/10 text-white/60 font-bold uppercase tracking-widest py-2 rounded-none transition-all text-[10px] border-none"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

