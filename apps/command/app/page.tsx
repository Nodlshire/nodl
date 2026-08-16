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
import dynamic from 'next/dynamic';
import AiIntelligencePanel from "./components/AiIntelligencePanel";

const FleetMap = dynamic(() => import("@shared/components/FleetMap"), {
    ssr: false,
});
import MetricCard from "@shared/components/MetricCard";
import IdentityHeader from "@shared/components/IdentityHeader";
import { usePageTitle } from "./components/PageTitleContext";

export default function CommandCentrePage() {
    usePageTitle("COMMAND CENTRE OPERATIONS");
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


    const fetchData = async () => {
        try {
            const t0 = performance.now();
            const [nodesRes, nodlrsRes, statsRes, summaryRes] = await Promise.all([
                fetch('/api/nodls/all'),
                fetch('/api/nodlrs/all'),
                fetch('/api/stats'),
                fetch('/api/nodls/summary')
            ]);
            const latency = Math.round(performance.now() - t0);
            setApiLatencyMs(latency);
            
            if (nodesRes.ok) setNodes(await nodesRes.json());
            if (nodlrsRes.ok) setNodlrs(await nodlrsRes.json());
            
            let combinedStats = { totalNodes: 0, activeNodes: 0, offlineNodes: 0 };
            if (statsRes.ok) {
                const baseStats = await statsRes.json();
                combinedStats = { ...combinedStats, ...baseStats };
                setBackendOnline(true);
            } else {
                setBackendOnline(false);
            }

            if (summaryRes.ok) {
                const summary = await summaryRes.json();
                combinedStats = { ...combinedStats, ...summary };
            }
            
            setStats(combinedStats);
        } catch (err) {
            console.warn("Dashboard vital fetch failed (backend potentially offline):", err);
            setError("Backend Offline");
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
            color: 'text-white',
            tooltip: 'Total virtual CPU cores available across all active nodes in the mesh network'
        },
        { 
            label: 'Unified Memory', 
            value: stats?.totalMemory || 0, 
            sub: 'GB RAM Capacity', 
            icon: Server, 
            color: 'text-white',
            tooltip: 'Aggregate RAM capacity pooled from all registered nodes'
        },
        { 
            label: 'NEW USERS', 
            value: stats?.newUsersThisMonth || 0, 
            sub: `Last Month: ${stats?.newUsersLastMonth || 0}`, 
            icon: ShieldCheck, 
            color: 'text-white',
            tooltip: 'User accounts created during the current billing period'
        },
        { 
            label: 'NEW NODES', 
            value: stats?.newNodesThisMonth || 0, 
            sub: `Last Month: ${stats?.newNodesLastMonth || 0}`, 
            icon: Activity, 
            color: 'text-white',
            tooltip: 'Nodes registered and onboarded during the current period'
        },
    ];

    const offlineNodes = stats?.offlineNodes || 0;

    const operational = [
        {
            label: 'Total Nodes',
            value: stats?.totalNodes ?? '—',
            icon: Server,
            statusColor: 'text-white',
            tooltip: 'Total number of nodes registered in the mesh network',
        },
        {
            label: 'Active Nodes',
            value: stats?.activeNodes ?? '—',
            icon: CheckCircle2,
            statusColor: 'text-green-400',
            tooltip: 'Nodes currently online and responding to heartbeat checks',
        },
        {
            label: 'Offline Nodes',
            value: offlineNodes,
            icon: AlertTriangle,
            statusColor: offlineNodes > 0 ? 'text-red-400' : 'text-green-400',
            tooltip: 'Nodes that have not responded within the last heartbeat interval',
        },
        {
            label: 'API Latency',
            value: apiLatencyMs !== null ? `${apiLatencyMs}ms` : '—',
            icon: BarChart3,
            statusColor: (apiLatencyMs || 0) > 500 ? 'text-yellow-400' : 'text-green-400',
            tooltip: 'Round-trip time for the most recent API health check',
        },
        {
            label: 'Backend Status',
            value: backendOnline ? 'Online' : 'Offline',
            icon: backendOnline ? Wifi : WifiOff,
            statusColor: backendOnline ? 'text-green-400' : 'text-red-400',
            tooltip: 'Connection status to the nodld backend service on port 8081',
        },
    ];


    return (
        <>
            <main className="w-full flex-1 px-4 sm:px-6 lg:px-8 pt-4 pb-28 overflow-y-auto space-y-6 custom-scrollbar relative">
                <div className="absolute top-0 right-0 w-full h-[500px] bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                <div className="flex items-center gap-6 justify-end">
                    {error && <span className="text-[10px] text-red-500 uppercase font-bold tracking-widest">{error}</span>}
                </div>

                {/* Row 1: Vitals + AI (5 columns side-to-side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 w-full -mt-1.5 [&>div]:!py-3.5">
                    {metrics.map((m) => (
                        <MetricCard
                            key={m.label}
                            label={m.label}
                            value={loading ? '...' : m.value}
                            icon={m.icon}
                            colorClass={m.color}
                            subValue={m.sub}
                            tooltip={m.tooltip}
                        />
                    ))}
                    <AiIntelligencePanel />
                </div>

                {/* Row 2: Operational Metrics (5 columns side-to-side) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 lg:gap-6 w-full">
                    {operational.map((op) => (
                        <MetricCard
                            key={op.label}
                            label={op.label}
                            value={loading ? '...' : op.value}
                            icon={op.icon}
                            colorClass={op.statusColor}
                            tooltip={op.tooltip}
                        />
                    ))}
                </div>

                {/* Full-Width Map Panel */}
                <div className="w-full rounded-xl overflow-hidden border border-neutral-800 shadow-2xl">
                    <FleetMap
                        nodes={nodes}
                        nodlrs={nodlrs}
                        loading={loading}
                        onNodeSelect={handleNodeSelect}
                    />
                </div>
            </main>

            {/* Telemetry Feed */}
            <div className={`fixed bottom-0 left-0 right-0 lg:left-64 bg-neutral-950 border-t border-neutral-800 z-[60] transition-all duration-300 ${isTelemetryOpen ? 'h-64' : 'h-10'}`}>
                <button 
                    onClick={() => setIsTelemetryOpen(!isTelemetryOpen)}
                    className="w-full h-10 flex items-center justify-between px-8 hover:bg-neutral-900 transition-colors group"
                >
                    <div className="flex items-end justify-between">
                        <div>
                            <h2 className="text-[20px] font-bold text-white uppercase tracking-wider font-sans">System Overview</h2>
                            <p className="text-[12px] text-white/40 mt-1 font-mono uppercase tracking-widest">Global Network Telemetry - CANARY_937_TEST_DO_NOT_IGNORE</p>
                        </div>
                    </div>
                    {isTelemetryOpen ? <ChevronDown className="w-4 h-4 text-neutral-500" /> : <ChevronUp className="w-4 h-4 text-neutral-500" />}
                </button>
                <div className="p-6 font-mono text-[11px] text-cyan-400/70 overflow-y-auto h-52 space-y-1 custom-scrollbar font-bold">
                    <p className="opacity-50 tracking-widest uppercase">[SYSTEM] INITIALIZING CORE MODULES...</p>
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
