"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import { 
    Activity, Shield, Server, Terminal, ChevronUp, ChevronDown,
    Cpu as CpuIcon, ShieldCheck, DollarSign, Wifi, WifiOff, Database,
    BarChart3, AlertTriangle, CheckCircle2
} from "lucide-react";
import "leaflet/dist/leaflet.css";

import NodlInspector from "./components/NodlInspector";
import FleetMap from "@shared/components/FleetMap";
import MetricCard from "@shared/components/MetricCard";
import IdentityHeader from "@shared/components/IdentityHeader";

export default function CommandCentrePage() {
    const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
    const [nodes, setNodes] = useState<any[]>([]);
    const [nodlrs, setNodlrs] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [backendOnline, setBackendOnline] = useState(false);
    const [apiLatencyMs, setApiLatencyMs] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const jwt = localStorage.getItem("nodl_jwt");
        const userStr = localStorage.getItem("nodl_user");
        
        if (!jwt || !userStr) {
            router.push("/auth/login");
            return;
        }

        try {
            const user = JSON.parse(userStr);
            if (user.role === 'visitor') {
                router.push("/auth/login");
            }
        } catch (e) {
            router.push("/auth/login");
        }
    }, [router]);

    const fetchData = async () => {
        try {
            const t0 = performance.now();
            const [nodesRes, nodlrsRes, statsRes] = await Promise.all([
                fetch('/api/nodls/all'),
                fetch('/api/nodlrs/all'),
                fetch('/api/stats')
            ]);
            const latency = Math.round(performance.now() - t0);
            setApiLatencyMs(latency);
            
            if (nodesRes.ok) setNodes(await nodesRes.json());
            if (nodlrsRes.ok) setNodlrs(await nodlrsRes.json());
            if (statsRes.ok) {
                setStats(await statsRes.json());
                setBackendOnline(true);
            } else {
                setBackendOnline(false);
            }
        } catch (err) {
            console.error("Dashboard fetch failed:", err);
            setError("Failed to synchronize with backend registry.");
            setBackendOnline(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, []);

    const handleNodeSelect = useCallback((id: string) => {
        setSelectedNode(id);
    }, []);

    const metrics = [
        { 
            label: 'Network Compute', 
            value: stats?.totalCores || 0, 
            sub: 'vCPUs Distributed', 
            icon: CpuIcon, 
            color: 'text-white'
        },
        { 
            label: 'Unified Memory', 
            value: stats?.totalMemory || 0, 
            sub: 'GB RAM Capacity', 
            icon: Server, 
            color: 'text-white'
        },
        { 
            label: 'Global Stability', 
            value: stats?.globalStability !== undefined ? stats.globalStability.toFixed(1) : 0, 
            sub: 'Node Availability %', 
            icon: ShieldCheck, 
            color: 'text-white'
        },
        { 
            label: 'Registry Liquidity', 
            value: stats?.totalBalance !== undefined ? (stats.totalBalance / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : 0, 
            sub: 'USD Accrued', 
            icon: DollarSign, 
            color: 'text-[#22D3EE]'
        },
    ];

    const offlineNodes = (stats?.totalNodes || 0) - (stats?.activeNodes || 0);

    const operational = [
        {
            label: 'Total Nodes',
            value: stats?.totalNodes ?? '—',
            icon: Server,
            statusColor: 'text-white',
        },
        {
            label: 'Active Nodes',
            value: stats?.activeNodes ?? '—',
            icon: CheckCircle2,
            statusColor: 'text-green-400',
        },
        {
            label: 'Offline Nodes',
            value: offlineNodes,
            icon: AlertTriangle,
            statusColor: offlineNodes > 0 ? 'text-red-400' : 'text-green-400',
        },
        {
            label: 'API Latency',
            value: apiLatencyMs !== null ? `${apiLatencyMs}ms` : '—',
            icon: BarChart3,
            statusColor: (apiLatencyMs || 0) > 500 ? 'text-yellow-400' : 'text-green-400',
        },
        {
            label: 'Backend Status',
            value: backendOnline ? 'Online' : 'Offline',
            icon: backendOnline ? Wifi : WifiOff,
            statusColor: backendOnline ? 'text-green-400' : 'text-red-400',
        },
        {
            label: 'Registry Sync',
            value: stats ? 'Synced' : 'Syncing',
            icon: Activity,
            statusColor: stats ? 'text-green-400' : 'text-yellow-400',
        },
        {
            label: 'Redis Status',
            value: stats?.redisStatus === 'active' ? 'Active' : 'Fallback',
            icon: Database,
            statusColor: stats?.redisStatus === 'active' ? 'text-green-400' : 'text-yellow-400',
        },
    ];

    const integrity = [
        { name: 'Gateway', status: 'Active', light: 'bg-green-500' },
        { name: 'P2P Mesh nodl', status: 'Online', light: 'bg-green-500' },
        { name: 'Registry Layer', status: stats ? 'Synced' : 'Loading', light: stats ? 'bg-green-500' : 'bg-yellow-500' },
    ];

    return (
        <>
            <main className="flex-1 px-8 pt-6 pb-20 overflow-y-auto space-y-6 custom-scrollbar h-full relative">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                {/* Page Header */}
                <div className="pb-4 flex justify-between items-center border-b border-white/10">
                    <div>
                        <h2 className="text-lg font-normal tracking-tight text-white mb-0.5">Command Centre Operations</h2>
                        <p className="text-[13px] text-slate-500 font-normal">Real-time infrastructure oversight and global node coordination.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        {error && <span className="text-[10px] text-red-500 uppercase font-bold tracking-widest">{error}</span>}
                        <div className="h-8 w-px bg-white/5" />
                        <IdentityHeader />
                    </div>
                </div>

                {/* Row 1: Vitals */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                    {metrics.map((m) => (
                        <MetricCard
                            key={m.label}
                            label={m.label}
                            value={loading ? '...' : m.value}
                            icon={m.icon}
                            colorClass={m.color}
                            subValue={m.sub}
                        />
                    ))}
                </div>

                {/* Row 2: Operational Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {operational.map((op) => (
                        <MetricCard
                            key={op.label}
                            label={op.label}
                            value={loading ? '...' : op.value}
                            icon={op.icon}
                            colorClass={op.statusColor}
                        />
                    ))}
                </div>

                {/* Full-Width Map Panel */}
                <FleetMap
                    nodes={nodes}
                    loading={loading}
                    onNodeSelect={handleNodeSelect}
                />

                {/* Protocol + Summary */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[5px] flex flex-col h-[380px] shadow-sm transition-all hover:bg-white/[0.03]">
                        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-white/5">
                            <Shield className="w-4 h-4 text-[#22D3EE] opacity-70" />
                            <span className="text-[11px] font-bold text-white uppercase tracking-[0.2em]">Protocol Integrity Trace</span>
                        </div>
                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2">
                            {integrity.map((item) => (
                                <div key={item.name} className="flex items-center justify-between py-3 px-4 rounded-[5px] group border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors">
                                    <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-widest">{item.name}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-mono text-slate-500 tracking-tighter uppercase font-bold">{item.status}</span>
                                        <div className={`w-1.5 h-1.5 rounded-full ${item.light === 'bg-green-500' ? 'bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]' : 'bg-yellow-500'}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5">
                            <div className="p-4 bg-black/40 border border-white/5 rounded-[5px] flex flex-col gap-3 relative overflow-hidden">
                                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Network Summary</span>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registry Sync</span>
                                        <span className={`text-[10px] font-mono font-bold ${stats ? 'text-green-400' : 'text-yellow-400'}`}>{stats ? 'STABLE' : 'SYNCING'}</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fleet Coverage</span>
                                        <span className="text-[10px] font-mono font-bold text-white">{stats?.totalNodes || 0} Peers</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Compute</span>
                                        <span className="text-[10px] font-mono font-bold text-[#22D3EE]">{stats?.totalCores || 0} Cores</span>
                                    </div>
                                    <div className="flex justify-between items-baseline">
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Data Store</span>
                                        <span className={`text-[10px] font-mono font-bold ${stats?.redisStatus === 'active' ? 'text-green-400' : 'text-yellow-400'}`}>
                                            {stats?.redisStatus === 'active' ? 'REDIS' : 'IN-MEMORY'}
                                        </span>
                                    </div>
                                </div>
                                <div className="absolute top-0 right-0 w-20 h-20 bg-[#22D3EE]/5 rounded-full blur-2xl" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Telemetry Feed */}
            <div className={`fixed bottom-0 right-0 lg:left-64 bg-neutral-950 border-t border-neutral-800 z-[60] transition-all duration-300 ${isTelemetryOpen ? 'h-64' : 'h-10'}`}>
                <button 
                    onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
                    className="w-full h-10 flex items-center justify-between px-8 hover:bg-neutral-900 transition-colors group"
                >
                    <div className="flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-semibold text-neutral-400 group-hover:text-neutral-200 transition-colors uppercase tracking-widest">Live telemetry feed</span>
                    </div>
                    {isTelemetryOpen ? <ChevronDown className="w-4 h-4 text-neutral-500" /> : <ChevronUp className="w-4 h-4 text-neutral-500" />}
                </button>
                <div className="p-6 font-mono text-[11px] text-cyan-400/70 overflow-y-auto h-52 space-y-1 custom-scrollbar font-bold">
                    <p className="opacity-50 tracking-widest uppercase">[{new Date().toISOString()}] INITIALIZING CORE MODULES...</p>
                    <p className="tracking-widest text-neutral-500">[OK] SECURITY PROTOCOLS ACTIVE</p>
                    <p className="tracking-widest text-cyan-400">[NET] DHT REFRESH IN PROGRESS</p>
                    <p className="tracking-widest text-neutral-600">[SYS] TELEMETRY PULSE NOMINAL - UP: ONLINE</p>
                    {stats && <p className="tracking-widest text-green-400/50">[DATA] SYNC COMPLETE - {stats.totalNodes} NODES MAPPED</p>}
                    {apiLatencyMs !== null && <p className="tracking-widest text-neutral-500">[PERF] API LATENCY: {apiLatencyMs}ms</p>}
                    {!backendOnline && <p className="tracking-widest text-red-500">[WARN] BACKEND UNREACHABLE — USING CACHED DATA</p>}
                    <p className="tracking-widest text-yellow-500/50">[STORE] REDIS OFFLINE — RUNNING IN-MEMORY FALLBACK</p>
                </div>
            </div>

            <NodlInspector 
                nodeId={selectedNode} 
                onClose={() => setSelectedNode(null)} 
            />
        </>
    );
}
