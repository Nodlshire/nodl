'use client';

import React, { useState, useEffect } from 'react';
import { 
    Cpu, 
    Globe, 
    Zap, 
    X, 
    Activity, 
    Database, 
    Server, 
    Clock, 
    ShieldCheck, 
    ChevronRight,
    Search,
    Monitor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tier {
    id: string;
    name: string;
    effectiveRate: number;
    liveMarket: number;
    cpu_cores: number;
    gpu_model: string;
    ram_gb: number;
    description: string;
}

export default function CatalogPage() {
    const [tiers, setTiers] = useState<Tier[]>([]);
    const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
    const [isAutoselect, setIsAutoselect] = useState(true);
    const [loading, setLoading] = useState(true);

    const fetchTiers = async () => {
        try {
            const res = await fetch('http://localhost:8080/v1/meta/tiers');
            const data = await res.json();
            setTiers(data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch tiers:", err);
        }
    };

    useEffect(() => {
        fetchTiers();
        // Simple polling for real-time updates (Master Directive Step 3)
        const interval = setInterval(fetchTiers, 5000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-2 border-mesh-emerald/20 border-t-mesh-emerald rounded-full animate-spin" />
            <span className="text-[10px] font-bold tracking-[0.5em] text-mesh-emerald animate-pulse">Syncing Global Matrix</span>
        </div>
    );

    return (
        <div className="relative min-h-screen bg-[#050505] text-white">
            <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-6">Compute Store</h1>
                </div>

                </div>

                {/* Provisioning Strategy */}
                <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/20 rounded-2xl backdrop-blur-sm shadow-xl group/prov hover:bg-white/[0.04] transition-all duration-300">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-3.5 h-3.5 text-mesh-emerald" />
                            <h3 className="text-xs font-bold text-white tracking-widest">Provisioning Strategy</h3>
                        </div>
                        <p className="text-[10px] text-slate-500 tracking-widest font-medium">Auto performance matching or manual node selection</p>
                    </div>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 group-hover/prov:border-white/20 transition-colors shadow-inner">
                        <button 
                            onClick={() => setIsAutoselect(true)}
                            className={`px-5 py-1.5 rounded-lg text-[9px] font-bold tracking-widest transition-all ${isAutoselect ? 'bg-white text-black shadow-lg shadow-white/20 scale-[1.02]' : 'text-slate-500 hover:text-white'}`}
                        >
                            Autoselect
                        </button>
                        <button 
                            onClick={() => setIsAutoselect(false)}
                            className={`px-5 py-1.5 rounded-lg text-[9px] font-bold tracking-widest transition-all ${!isAutoselect ? 'bg-white text-black shadow-lg shadow-white/20 scale-[1.02]' : 'text-slate-500 hover:text-white'}`}
                        >
                            Manual
                        </button>
                    </div>
                </div>

                {/* Tier Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tiers.map((tier) => (
                        <div 
                            key={tier.id} 
                            onClick={() => setSelectedTier(tier)}
                            className="bg-[#080808] border border-white p-4 group hover:border-mesh-emerald/30 transition-all cursor-pointer relative overflow-hidden rounded-2xl"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 -mr-12 -mt-12 rotate-45 group-hover:bg-mesh-emerald/10 transition-colors" />
                            
                             <div className="relative z-10 space-y-6">
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                                        <Cpu className="w-5 h-5 text-slate-400 group-hover:text-mesh-emerald transition-colors" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xl font-bold text-white tracking-tighter group-hover:text-mesh-emerald transition-colors">
                                            {tier.effectiveRate > 0 ? `$${tier.effectiveRate.toFixed(4)}` : 
                                             tier.liveMarket > 0 ? `$${tier.liveMarket.toFixed(4)}` : 'Market Rate'}
                                        </span>
                                        <span className="block text-[9px] text-slate-500 tracking-widest font-bold mt-1">/th second</span>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-white tracking-tight italic px-1">{tier.name}</h3>
                                    <p className="text-[12px] text-slate-400 leading-relaxed mt-2 font-medium line-clamp-2 px-1">
                                        {tier.description || (
                                            tier.id === 'standard' ? 'Balanced performance for general-purpose workloads.' :
                                            tier.id === 'boost' ? 'High-performance GPU compute for AI/ML tasks.' :
                                            tier.id === 'ultra' ? 'Extreme multi-GPU performance for massive processing.' :
                                            tier.id === 'decc' ? 'Secure confidential compute with TEE protection.' :
                                            tier.id === 'gpu-pro' ? 'Professional grade GPU clusters (A100).' :
                                            tier.id === 'gpu-max' ? 'Maximum enterprise cluster density (H100).' :
                                            'High-efficiency compute resource.'
                                        )}
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[9px] text-slate-600 font-bold tracking-widest">Compute</span>
                                        <span className="text-sm font-bold text-white">{tier.cpu_cores} vCPU</span>
                                    </div>
                                    <div className="flex flex-col gap-1 text-right">
                                        <span className="text-[9px] text-slate-600 font-bold tracking-widest">Memory</span>
                                        <span className="text-sm font-bold text-white">{tier.ram_gb} GB</span>
                                    </div>
                                </div>
                                <div className="pt-2">
                                     <span className="text-[10px] font-bold tracking-widest text-slate-500">GPU: <span className="text-mesh-emerald">{tier.gpu_model}</span></span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Region Selection */}
                {!isAutoselect && (
                    <div className="bg-[#080808] p-8 space-y-6 animate-in slide-in-from-top-4 duration-500 border border-amber-500/20 rounded-3xl">
                        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                            <Globe className="w-4 h-4 text-amber-500" />
                            <h2 className="text-xs font-bold text-white tracking-widest">Manual Region Filtering</h2>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-center">
                            {['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'].map(region => (
                                <button key={region} className="p-4 bg-white/5 border border-white/40 rounded-xl text-[10px] font-bold tracking-widest text-slate-500 hover:text-white hover:border-mesh-emerald/30 transition-all">
                                    {region}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Slide-out Drawer */}
            <AnimatePresence>
                {selectedTier && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTier(null)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                        />
                        <motion.div 
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            className="fixed top-0 right-0 w-[400px] h-screen bg-black border-l border-white/10 z-[101] shadow-2xl flex flex-col"
                        >
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 border border-mesh-emerald/30 bg-mesh-emerald/10 flex items-center justify-center rounded-2xl">
                                        <Activity className="w-6 h-6 text-mesh-emerald" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white uppercase tracking-tight italic">{selectedTier.name}</h2>
                                        <p className="text-[10px] text-mesh-emerald font-black uppercase tracking-widest">Node Specification</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedTier(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-10 font-sans">
                                {/* Specs */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] uppercase font-black text-slate-500 tracking-widest border-l-2 border-mesh-emerald pl-4">Architecture</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                                            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest block">Processing</span>
                                            <span className="text-sm font-bold text-white uppercase">{selectedTier.cpu_cores} vCPU</span>
                                        </div>
                                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                                            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest block">Memory</span>
                                            <span className="text-sm font-bold text-white uppercase">{selectedTier.ram_gb} GB RAM</span>
                                        </div>
                                        <div className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-1 col-span-2">
                                            <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest block">Graphics</span>
                                            <span className="text-sm font-bold text-white uppercase">{selectedTier.gpu_model}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] uppercase font-black text-slate-500 tracking-widest border-l-2 border-mesh-emerald pl-4">Network Info</h3>
                                    <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-500 uppercase font-black">Cluster Status</span>
                                            <span className="text-xs font-black text-mesh-emerald">OPTIMAL</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-slate-500 uppercase font-black">Live Market Rate</span>
                                            <span className="text-xs font-black text-white">
                                                ${(selectedTier.effectiveRate || selectedTier.liveMarket || 0).toFixed(4)}/TH
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action */}
                                <div className="pt-4">
                                    <button className="w-full bg-mesh-emerald hover:bg-white text-black py-5 font-black text-[11px] uppercase tracking-[0.2em] transition-all rounded-2xl shadow-xl shadow-mesh-emerald/20 hover:scale-[1.02] active:scale-[0.98]">
                                        Deploy {selectedTier.name} resources
                                    </button>
                                    <p className="text-[9px] text-slate-600 text-center uppercase tracking-widest mt-4 font-bold">Immutable contract will be signed on-chain</p>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
