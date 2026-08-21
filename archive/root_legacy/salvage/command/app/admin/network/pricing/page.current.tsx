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
    rate_th_sec: number;
    cpu_cores: number;
    gpu_model: string;
    ram_gb: number;
    description: string;
}

export default function PricingManager() {
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [editingTier, setEditingTier] = useState<Tier | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

    const fetchTiers = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8082/api/v1/meta/tiers');
            const data = await res.json();
            setTiers(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTiers();
    }, []);

    const handleUpdate = async (tier: Tier) => {
        try {
            const res = await fetch(`http://127.0.0.1:8082/v1/admin/tiers/${tier.id}`, {
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
                    <p className="text-slate-500 uppercase tracking-widest text-[10px] mt-2 font-bold">
                        Global Network Authority // Managed Compute Tiers
                    </p>
                </div>

                <div className="flex items-center gap-4 px-6 py-3 bg-cyan-400/5 border border-cyan-400/20 rounded-lg">
                    <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                    <div>
                        <div className="text-[10px] text-cyan-400 font-black uppercase tracking-wider">Source of Truth</div>
                        <div className="text-[9px] text-slate-500 font-bold uppercase">nodld_api:8080</div>
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
            <div className="border border-white/5 bg-[#050505] rounded-2xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/10">
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Tier ID</th>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Rate ($/TH-sec)</th>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">CPU</th>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">GPU Model</th>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">RAM</th>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {tiers.map((tier) => (
                            <tr key={tier.id} className="hover:bg-cyan-400/[0.02] transition-colors group">
                                <td className="px-6 py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-cyan-400 group-hover:shadow-[0_0_8px_#22d3ee]" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black uppercase tracking-tight">{tier.name}</span>
                                            <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{tier.id}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-6 font-mono text-cyan-400 text-sm font-black">
                                    ${tier.rate_th_sec.toFixed(4)}
                                </td>
                                <td className="px-6 py-6">
                                    <span className="text-sm font-bold text-slate-300">{tier.cpu_cores} vCPU</span>
                                </td>
                                <td className="px-6 py-6">
                                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 px-3 py-1 bg-white/5 border border-white/10 rounded">
                                        {tier.gpu_model}
                                    </span>
                                </td>
                                <td className="px-6 py-6 font-bold text-slate-300 text-sm">
                                    {tier.ram_gb} GB
                                </td>
                                <td className="px-6 py-6 text-left">
                                    <button 
                                        onClick={() => setEditingTier(tier)}
                                        className="inline-flex items-center gap-2 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:scale-105"
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="w-full max-w-xl bg-[#080808] border border-cyan-400/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(34,211,238,0.15)] animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                <Edit3 className="text-cyan-400" />
                                Edit Tier: {editingTier.name}
                            </h2>
                            <button onClick={() => setEditingTier(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-6 h-6 text-slate-500" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rate ($/TH-sec)</label>
                                    <input 
                                        type="number" 
                                        step="0.0001"
                                        value={editingTier.rate_th_sec}
                                        onChange={(e) => setEditingTier({...editingTier, rate_th_sec: parseFloat(e.target.value)})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-mono text-cyan-400 focus:outline-none focus:border-cyan-400/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">CPU Cores</label>
                                    <input 
                                        type="number" 
                                        value={editingTier.cpu_cores}
                                        onChange={(e) => setEditingTier({...editingTier, cpu_cores: parseInt(e.target.value)})}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-400/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">GPU Model</label>
                                <input 
                                    type="text" 
                                    value={editingTier.gpu_model}
                                    onChange={(e) => setEditingTier({...editingTier, gpu_model: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold uppercase focus:outline-none focus:border-cyan-400/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">RAM (GB)</label>
                                <input 
                                    type="number" 
                                    value={editingTier.ram_gb}
                                    onChange={(e) => setEditingTier({...editingTier, ram_gb: parseInt(e.target.value)})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:border-cyan-400/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px) font-black uppercase tracking-widest text-slate-500">Description</label>
                                <textarea 
                                    value={editingTier.description}
                                    onChange={(e) => setEditingTier({...editingTier, description: e.target.value})}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium h-24 focus:outline-none focus:border-cyan-400/50"
                                />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button 
                                onClick={() => handleUpdate(editingTier)}
                                className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Commit Changes
                            </button>
                            <button 
                                onClick={() => setEditingTier(null)}
                                className="px-8 border border-white/10 hover:bg-white/5 text-slate-400 font-bold uppercase tracking-widest py-4 rounded-xl transition-all"
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

