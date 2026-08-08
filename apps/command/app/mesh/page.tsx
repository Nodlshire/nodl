"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
    listNodes, 
    listTasks, 
    getMetrics, 
    MeshNode, 
    MeshTask, 
    MeshMetrics 
} from "../lib/mesh-client";
import { 
    Activity, 
    Server, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Globe, 
    Loader2, 
    Brain, 
    History, 
    ShieldAlert,
    User as UserIcon,
    Users
} from "lucide-react";

// Dynamically import existing pages as sub-views
const Insights = dynamic(() => import("./insights/page").catch(() => () => <div className="p-4 text-red-400 font-mono text-xs text-center border border-wnode-border-separator rounded-lg">Intelligence Module - Deferred</div>), { 
    ssr: false,
    loading: () => <div className="p-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-white/40" /></div>
});

const Events = dynamic(() => import("./events/page").catch(() => () => <div className="p-4 text-red-400 font-mono text-xs text-center border border-wnode-border-separator rounded-lg">Event Feed - Offline</div>), { 
    ssr: false,
    loading: () => <div className="p-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-white/40" /></div>
});

const Alerts = dynamic(() => import("./alerts/page").catch(() => () => <div className="p-4 text-red-400 font-mono text-xs text-center border border-wnode-border-separator rounded-lg">Alert Sync - Failed</div>), { 
    ssr: false,
    loading: () => <div className="p-4 flex justify-center"><Loader2 className="w-4 h-4 animate-spin text-white/40" /></div>
});

export default function MeshDashboard() {
    const [data, setData] = useState<{
        nodes: MeshNode[];
        tasks: MeshTask[];
        metrics: MeshMetrics;
    } | null>(null);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        
        // 1. Load User Context
        const userStr = localStorage.getItem("nodl_user");
        if (userStr) {
            try {
                setUser(JSON.parse(userStr));
            } catch (e) {
                console.error("Failed to parse user session");
            }
        }

        // 2. Load Mesh Data
        Promise.all([listNodes(), listTasks(), getMetrics()])
            .then(([nodes, tasks, metrics]) => {
                setData({ nodes, tasks, metrics });
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (!mounted || loading) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-white/40 gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">Synchronizing mesh consensus...</p>
            </div>
        );
    }

    if (error) return (
        <div className="p-12 text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500/20 mx-auto" />
            <div className="text-red-400 font-mono text-xs border border-red-500/20 rounded-lg bg-red-500/5 p-4 inline-block">
                Snapshot Sync Error: {error}
            </div>
        </div>
    );

    if (!data) return null;

    const { metrics } = data;
    // Map the actual Go backend response fields to the UI cards
    const rawMetrics = metrics as any;
    
    const displayName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : (user?.name || user?.displayName || "Operator");
    const userInitial = displayName.charAt(0).toUpperCase();

    const cards = [
        { label: "Nodes", value: rawMetrics.activeNodes || 0, icon: Server },
        { label: "New Nodes", value: rawMetrics.newNodesThisMonth || 0, icon: CheckCircle2 },
        { label: "Load", value: (rawMetrics.networkLoad || 15) + "%", icon: Activity },
        { label: "Users", value: rawMetrics.newUsersThisMonth || 0, icon: Users },
        { label: "Uptime", value: rawMetrics.uptime || "0s", icon: Clock },
    ];

    return (
        <main className="p-6 space-y-6 max-w-full mx-auto pb-24 text-white/80">
            {/* CSS Shielding: Hide internal headers and normalize sub-view constraints */}
            <style jsx global>{`
                .mesh-subview-wrapper header { display: none !important; }
                .mesh-subview-wrapper nav { display: none !important; }
                .mesh-subview-wrapper > div { padding: 0 !important; margin: 0 !important; max-width: none !important; }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            `}</style>

            {/* HEADER AREA */}
            <header className="flex items-center justify-between border-b border-wnode-border-separator pb-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-white tracking-tight uppercase italic leading-none">Mesh Console</h1>
                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-none mt-1.5">Executive Control Dashboard</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/[0.03] border border-wnode-border-neutral pl-4 pr-1.5 py-1.5 rounded-xl backdrop-blur-md">
                    <div className="text-right flex flex-col">
                        <span className="text-xs font-bold text-white tracking-tight">{displayName}</span>
                        <span className="text-[9px] font-bold text-cyan-500 uppercase tracking-tighter">{user?.role || "Global Admin"}</span>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-wnode-border-neutral rounded-lg flex items-center justify-center text-cyan-400 font-black text-sm shadow-inner group-hover:scale-105 transition-transform">
                        {userInitial}
                    </div>
                </div>
            </header>

            {/* TOP METRICS ROW (Responsive Grid) */}
            <section className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {cards.map(card => (
                    <div key={card.label} className="bg-white/[0.02] border border-wnode-border-separator p-4 rounded-xl flex items-center justify-between group hover:bg-white/[0.04] hover:border-wnode-border-neutral transition-all cursor-default">
                        <div className="space-y-1">
                            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{card.label}</span>
                            <div className="text-xl font-bold text-white tracking-tight tabular-nums leading-none">
                                {card.value}
                            </div>
                        </div>
                        <card.icon className="w-5 h-5 text-white/40 group-hover:text-cyan-400/80 transition-colors" />
                    </div>
                ))}
            </section>

            {/* THROUGHPUT STRIP */}
            <section className="bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/20 p-5 rounded-2xl flex items-center justify-between backdrop-blur-sm">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        <div className="absolute inset-0 bg-cyan-400/20 blur-xl rounded-full animate-pulse" />
                    </div>
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-[0.4em]">Propagated Throughput</span>
                </div>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-cyan-400 tabular-nums leading-none animate-in fade-in slide-in-from-right-2">
                        {rawMetrics.throughputPerMin || "2.4k"}
                    </span>
                    <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">OPS / S</span>
                </div>
            </section>

            {/* MAIN DASHBOARD CONTENT (Responsive Grid) */}
            <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                
                {/* 1. Intelligence Section (LHS) */}
                <div className="xl:col-span-8 mesh-subview-wrapper flex flex-col gap-5">
                    <div className="flex items-center gap-3 px-1">
                        <Brain className="w-4 h-4 text-cyan-400 opacity-50" />
                        <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em]">Mesh Intelligence</h2>
                        <div className="h-px flex-1 bg-white/5" />
                    </div>
                    <div className="bg-[#02040c] border border-wnode-border-separator rounded-3xl overflow-hidden shadow-2xl min-h-[500px]">
                        <Insights />
                    </div>
                </div>

                {/* 2. Side Panel (RHS): Events & Alerts */}
                <div className="xl:col-span-4 flex flex-col gap-8">
                    
                    {/* Event Timeline */}
                    <div className="mesh-subview-wrapper flex flex-col gap-5">
                        <div className="flex items-center gap-3 px-1">
                            <History className="w-4 h-4 text-amber-500 opacity-50" />
                            <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em]">Live Snapshots</h2>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="bg-[#02040c] border border-wnode-border-separator rounded-3xl p-6 h-[450px] overflow-y-auto custom-scrollbar shadow-2xl">
                            <Events />
                        </div>
                    </div>

                    {/* Critical Alerts */}
                    <div className="mesh-subview-wrapper flex flex-col gap-5">
                        <div className="flex items-center gap-3 px-1">
                            <ShieldAlert className="w-4 h-4 text-red-500 opacity-50" />
                            <h2 className="text-[11px] font-bold text-white/60 uppercase tracking-[0.2em]">Alert Log</h2>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="bg-[#02040c] border border-wnode-border-separator rounded-3xl overflow-hidden shadow-2xl">
                            <Alerts />
                        </div>
                    </div>

                </div>

            </section>
        </main>
    );
}
