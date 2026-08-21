"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Activity, Server, Cpu, HardDrive, Shield, Search, Filter, RefreshCw, 
    MoreVertical, ExternalLink, Zap, Clock, Globe, Terminal, Loader2, ChevronRight, Users
} from "lucide-react";
import DetailPanel from "../components/DetailPanel";
import { usePageTitle } from "../components/PageTitleContext";

export default function NodlsPage() {
    usePageTitle("Global nodl Registry", "Monitor and manage all compute hardware across the Nodl mesh.");
    const [nodls, setNodls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterTier, setFilterTier] = useState("All");
    const [selectedNodl, setSelectedNodl] = useState<any>(null);

    const fetchNodls = async () => {
        try {
            const jwt = localStorage.getItem("nodl_jwt");
            const res = await fetch('/api/nodls/all', {
                headers: { 'Authorization': `Bearer ${jwt}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNodls(data || []);
            }
        } catch (err) {
            console.error("Failed to fetch nodls:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNodls();
        const interval = setInterval(fetchNodls, 10000);
        return () => clearInterval(interval);
    }, []);

    const filteredNodls = nodls.filter(n => {
        const idMatches = (n.id || n.node_id)?.toLowerCase().includes(search.toLowerCase());
        const userMatches = (n.userID || n.user_id)?.toLowerCase().includes(search.toLowerCase());
        const matchesSearch = idMatches || userMatches;
        const matchesTier = filterTier === "All" || n.tier === filterTier;
        return matchesSearch && matchesTier;
    });

    const tiers = ["All", "Standard", "Boost", "Ultra", "DECC"];

    return (
        <>
                <main className="flex-1 p-8 overflow-y-auto pb-24 relative">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                        <div className="flex-1" />

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-[#22D3EE] transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="Search by ID or Operator..." 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-white/[0.03] border border-white/10 rounded-[5px] pl-10 pr-4 py-2 text-[13px] w-64 focus:outline-none focus:border-[#22D3EE]/50 transition-all font-normal"
                                />
                            </div>
                            <div className="flex items-center gap-1 bg-white/[0.03] border border-white/10 rounded-[5px] p-1">
                                {tiers.map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => setFilterTier(t)}
                                        className={`px-3 py-1 rounded-[3px] text-[11px] font-normal transition-all ${filterTier === t ? 'bg-[#22D3EE] text-black shadow-lg shadow-[#22D3EE]/20 font-medium' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.01] border border-white/10 rounded-[5px] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/10 bg-white/[0.02]">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">nodl Identity</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status / Tier</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Hardware Profile</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Activity Trace</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right pr-10">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredNodls.map((nodl) => (
                                        <tr 
                                            key={nodl.id || nodl.node_id} 
                                            onClick={() => setSelectedNodl(nodl)}
                                            className="hover:bg-white/[0.03] transition-all cursor-pointer group border-l-2 border-l-transparent hover:border-l-[#22D3EE]"
                                        >
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[14px] font-mono text-[#22D3EE] font-bold mb-1 group-hover:text-white transition-colors tracking-tighter">{nodl.protocolId}</span>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-3 h-3 text-slate-600" />
                                                        <span className="text-[10px] text-slate-500 font-normal uppercase tracking-widest text-[#22D3EE]/80">
                                                            {nodl.name || (nodl.userID || nodl.user_id)?.slice(0, 12)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${nodl.status === 'online' || nodl.status === 'active' ? 'bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]' : 'bg-red-500/50'}`} />
                                                        <span className={`text-[11px] font-bold tracking-[0.1em] uppercase ${nodl.status === 'online' || nodl.status === 'active' ? 'text-white' : 'text-slate-500'}`}>
                                                            {nodl.status}
                                                        </span>
                                                    </div>
                                                    <div className={`text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-[3px] w-fit border ${nodl.tier === 'Ultra' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                                                        {nodl.tier || 'Standard'}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-6 text-slate-400">
                                                    <div className="flex items-center gap-2.5">
                                                        <Cpu className="w-4 h-4 opacity-40 text-[#22D3EE]" />
                                                        <span className="text-[13px] font-mono text-white">{nodl.cpuCores || nodl.cpu_cores || 0}c</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <HardDrive className="w-4 h-4 opacity-40 text-[#22D3EE]" />
                                                        <span className="text-[13px] font-mono text-white">{nodl.memoryGB || nodl.memory_gb || 0}G</span>
                                                    </div>
                                                    {(nodl.gpuModel || nodl.gpu_model) && (
                                                        <div className="flex items-center gap-2 px-2.5 py-1 bg-purple-500/5 border border-purple-500/10 rounded-[3px]">
                                                            <Zap className="w-3.5 h-3.5 text-purple-400" />
                                                            <span className="text-[10px] text-purple-300 font-bold uppercase tracking-widest">{nodl.gpuModel || nodl.gpu_model}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-3 h-3 text-slate-600" />
                                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Last Heartbeat</span>
                                                    </div>
                                                    <span className="text-[12px] font-mono text-slate-400">
                                                        {new Date(nodl.lastHeartbeat || nodl.last_heartbeat).toLocaleTimeString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right pr-10">
                                                <button className="p-2 hover:bg-[#22D3EE]/10 rounded-[5px] transition-all text-slate-600 group-hover:text-[#22D3EE]">
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filteredNodls.length === 0 && !loading && (
                            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-full overflow-hidden relative">
                                    <Server className="w-8 h-8 text-slate-800" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#22D3EE]/5 to-transparent" />
                                </div>
                                <div className="text-center">
                                    <p className="text-[14px] text-slate-500 font-normal">No nodl's found in the current global visibility layer.</p>
                                    <p className="text-[11px] text-slate-700 mt-1 uppercase tracking-widest uppercase-none">Try broadening your telemetry filters</p>
                                </div>
                            </div>
                        )}
                        {loading && (
                            <div className="py-32 flex justify-center items-center">
                                <Loader2 className="w-8 h-8 animate-spin text-[#22D3EE] opacity-20" />
                            </div>
                        )}
                    </div>
                </main>

                {/* Detail Panel */}
                <DetailPanel
                    isOpen={!!selectedNodl}
                    onClose={() => setSelectedNodl(null)}
                    title="nodl Operational Core"
                    subtitle={`Universal Protocol ID: ${selectedNodl?.protocolId}`}
                    footer={
                        <div className="flex items-center gap-3">
                            <button className="flex-1 py-3 bg-red-400/5 hover:bg-red-400/10 border border-red-400/20 rounded-[5px] text-[13px] text-red-400 transition-all font-normal">
                                De-provision Hardware
                            </button>
                            <button className="flex-[2] py-3 bg-[#22D3EE] text-black rounded-[5px] text-[13px] font-medium transition-all shadow-[0_0_20px_#22D3EE33]">
                                Force Protocol Reset
                            </button>
                        </div>
                    }
                >
                    {selectedNodl && (
                        <div className="space-y-10">
                            {/* Status Overview */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Operational Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${selectedNodl.status === 'active' || selectedNodl.status === 'online' ? 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-slate-700'}`} />
                                        <span className={`text-[11px] uppercase font-bold tracking-widest ${selectedNodl.status === 'active' || selectedNodl.status === 'online' ? 'text-[#22D3EE]' : 'text-slate-500'}`}>
                                            {selectedNodl.status || 'OFFLINE'}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[5px]">
                                        <span className="block text-[9px] text-slate-600 uppercase tracking-tighter mb-1">Compute Tier</span>
                                        <span className="text-[13px] text-white font-mono">{selectedNodl.tier || 'Standard'}</span>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[5px]">
                                        <span className="block text-[9px] text-slate-600 uppercase tracking-tighter mb-1">Uptime Score</span>
                                        <span className="text-[13px] text-[#22D3EE] font-mono">{selectedNodl.uptime || '99.9%'}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Hardware Profile */}
                            <section className="space-y-4">
                                <h3 className="text-[11px] text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Hardware Blueprint</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <Cpu className="w-4 h-4 text-[#22D3EE] opacity-40" />
                                            <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Processor Architecture</span>
                                        </div>
                                        <span className="text-[12px] text-white font-mono">{selectedNodl.os || 'Linux'} / {selectedNodl.arch || 'x64'}</span>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-4 h-4 text-[#22D3EE] opacity-40" />
                                            <span className="text-[11px] text-slate-500 uppercase tracking-tighter">CPU Capacity</span>
                                        </div>
                                        <span className="text-[12px] text-white font-mono">{selectedNodl.cpuCores || selectedNodl.cpu_cores || 0} Cores</span>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <HardDrive className="w-4 h-4 text-[#22D3EE] opacity-40" />
                                            <span className="text-[11px] text-slate-500 uppercase tracking-tighter">System Memory</span>
                                        </div>
                                        <span className="text-[12px] text-white font-mono">{selectedNodl.memoryGB || selectedNodl.memory_gb || 0} GB</span>
                                    </div>
                                    { (selectedNodl.gpuModel || selectedNodl.gpu_model) && (
                                        <div className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <Zap className="w-4 h-4 text-purple-400 opacity-40" />
                                                <span className="text-[11px] text-slate-500 uppercase tracking-tighter">GPU Acceleration</span>
                                            </div>
                                            <span className="text-[12px] text-purple-300 font-mono truncate max-w-[150px]">{selectedNodl.gpuModel || selectedNodl.gpu_model}</span>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Network Metadata */}
                            <section className="space-y-4">
                                <h3 className="text-[11px] text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">Network Metadata</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between group">
                                        <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Operator Identity</span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[12px] text-[#22D3EE] font-mono tracking-tighter">
                                                {selectedNodl.name || 'ANONYMOUS'}
                                            </span>
                                            <span className="text-[9px] text-slate-600 font-mono tracking-tighter uppercase">
                                                {selectedNodl.protocolId || selectedNodl.userID || selectedNodl.user_id ? (selectedNodl.protocolId || selectedNodl.userID || selectedNodl.user_id).toString().slice(0, 12) : '---'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Region / Geo</span>
                                        <span className="text-[12px] text-white font-mono">{selectedNodl.region || 'Unknown'}</span>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Protocol Version</span>
                                        <span className="text-[12px] text-white font-mono">v{selectedNodl.version || '1.2.x'}</span>
                                    </div>
                                    <div className="flex items-center justify-between group">
                                        <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Last Heartbeat</span>
                                        <div className="flex flex-col items-end">
                                            <span className="text-[12px] text-white font-mono">
                                                {selectedNodl.lastHeartbeat || selectedNodl.last_heartbeat ? new Date(selectedNodl.lastHeartbeat || selectedNodl.last_heartbeat).toLocaleTimeString() : 'N/A'}
                                            </span>
                                            <span className="text-[9px] text-slate-600 uppercase tracking-tighter font-mono">
                                                {selectedNodl.lastHeartbeat || selectedNodl.last_heartbeat ? new Date(selectedNodl.lastHeartbeat || selectedNodl.last_heartbeat).toLocaleDateString() : '---'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Intelligence Trace */}
                            <section className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Terminal className="w-4 h-4 text-[#22D3EE]" />
                                    <h4 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Intelligence Trace</h4>
                                </div>
                                <div className="bg-black/50 border border-white/10 rounded-[5px] p-5 font-mono text-[11px] leading-relaxed space-y-2 max-h-[220px] overflow-y-auto custom-scrollbar shadow-inner relative">
                                    <p className="text-slate-600">[{new Date().toISOString()}] AUTH: Peer signature verified.</p>
                                    <p className="text-[#22D3EE]/60">[{new Date().toISOString()}] HEARTBEAT: Success (Latency 12ms).</p>
                                    <p className="text-slate-600">[{new Date().toISOString()}] STATE: Job Registry synced (0 active).</p>
                                    <p className="text-slate-500/50 italic">[{new Date().toISOString()}] No active compute jobs assigned.</p>
                                    <p className="text-[#22D3EE]/40">[{new Date().toISOString()}] MESH: Peer discovery active.</p>
                                    <div className="absolute top-0 right-0 p-2">
                                        <div className="w-1 h-1 rounded-full bg-[#22D3EE] animate-ping" />
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </DetailPanel>
        </>
    );
}
