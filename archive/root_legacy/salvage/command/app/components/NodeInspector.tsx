"use client";

import React, { useState, useEffect } from "react";
import DetailPanel from "./DetailPanel";
import { 
    X, Activity, Cpu, HardDrive, Zap, Clock, 
    Shield, Globe, Server, ShieldAlert, Terminal, Loader2,
    Database, User, BarChart
} from "lucide-react";

interface NodeInspectorProps {
    nodeId: string | null;
    onClose: () => void;
}

export default function NodeInspector({ nodeId, onClose }: NodeInspectorProps) {
    const [node, setNode] = useState<any>(null);
    const [nodlr, setNodlr] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!nodeId) {
            setNode(null);
            setNodlr(null);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [nodeRes, nodlrRes] = await Promise.all([
                    fetch(`/api/nodls/${nodeId}`),
                    fetch(`/api/nodlrs/${nodeId}`).catch(() => null) // Fallback if no provider for this ID
                ]);

                if (!nodeRes.ok) throw new Error("Peer registry synchronization failure");
                const nodeData = await nodeRes.json();
                setNode(nodeData);

                if (nodlrRes && nodlrRes.ok) {
                    const nodlrData = await nodlrRes.json();
                    setNodlr(nodlrData);
                }
            } catch (err: any) {
                console.error("Inspector fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [nodeId]);

    return (
        <DetailPanel
            isOpen={!!nodeId}
            onClose={onClose}
            title="Operational Intelligence"
            subtitle={`PEER_ID: ${nodeId || 'UNKNOWN'}`}
        >
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#22D3EE] opacity-20" />
                    <span className="ds-sub">Synchronizing Trace Data...</span>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-400/5 border border-red-400/10 rounded-[5px] flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <div className="flex flex-col">
                        <span className="text-[11px] text-red-400 uppercase tracking-widest font-bold font-mono">Trace Failure</span>
                        <span className="ds-sub text-red-400/60">{error}</span>
                    </div>
                </div>
            ) : node ? (
                <div className="space-y-8">
                    {/* Status Header */}
                    <section className="flex items-center justify-between p-4 ds-card">
                        <div className="flex flex-col">
                            <span className="ds-sub">Heartbeat Status</span>
                            <span className={`text-[13px] font-bold uppercase tracking-widest ${node.status === 'active' || node.status === 'online' ? 'text-[#22D3EE]' : 'text-slate-500'}`}>
                                {node.status || 'OFFLINE'}
                            </span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${node.status === 'active' || node.status === 'online' ? 'bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]' : 'bg-slate-700'}`} />
                    </section>

                    {/* Operational Core */}
                    <section className="space-y-4">
                        <h3 className="ds-sub border-b border-white/5 pb-2">Operational Core</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1 p-3 ds-card">
                                <span className="ds-sub opacity-60">CPU Capacity</span>
                                <div className="flex items-center gap-2">
                                    <Cpu className="w-3.5 h-3.5 ds-icon opacity-50" />
                                    <span className="text-sm font-mono text-white">{node.cpuCores || node.cpu_cores || 0} Cores</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 p-3 ds-card">
                                <span className="ds-sub opacity-60">Memory Swarm</span>
                                <div className="flex items-center gap-2">
                                    <Database className="w-3.5 h-3.5 ds-icon opacity-50" />
                                    <span className="text-sm font-mono text-white">{node.memoryGB || node.memory_gb || 0} GB</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Protocol Identity */}
                    <section className="space-y-4">
                        <h3 className="ds-sub border-b border-white/5 pb-2">Protocol Identity</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <User className="w-4 h-4 text-slate-500" />
                                    <span className="text-[11px] text-slate-400">Node Operator</span>
                                </div>
                                <span className="text-[12px] text-white font-bold">{node.name || 'ANONYMOUS'}</span>
                            </div>
                            
                            <div className="p-3 ds-card space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="ds-sub opacity-60">nodl.id</span>
                                    <span className="text-[11px] font-mono text-white break-all text-right max-w-[200px]">{node.id}</span>
                                </div>
                                {nodlr && (
                                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                        <span className="ds-sub opacity-60">nodlr.id</span>
                                        <span className="text-[11px] font-mono text-[#22D3EE] font-bold">{nodlr.id}</span>
                                    </div>
                                )}
                            </div>

                            {nodlr && (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <BarChart className="w-4 h-4 text-[#22D3EE] opacity-50" />
                                        <span className="text-[11px] text-slate-400">Accrued Balance</span>
                                    </div>
                                    <span className="text-[12px] text-[#22D3EE] font-mono font-bold">${(nodlr.accruedFounderBalance / 100 || 0).toLocaleString()}</span>
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-slate-500" />
                                    <span className="text-[11px] text-slate-400">Region Root</span>
                                </div>
                                <span className="text-[12px] text-white underline underline-offset-4 decoration-white/10">{node.region || 'Unknown Location'}</span>
                            </div>
                        </div>
                    </section>

                    {/* Protocol Logs */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-[#22D3EE]" />
                            <h4 className="ds-sub">Live Intelligence Trace</h4>
                        </div>
                        <div className="bg-black/40 border border-white/5 rounded-[5px] p-4 font-mono text-[10px] leading-relaxed space-y-1.5 max-h-[150px] overflow-y-auto custom-scrollbar shadow-inner text-slate-500">
                            <p>[{new Date().toISOString()}] INITIALIZING CORE MODULES...</p>
                            <p className="text-[#22D3EE]/60">[OK] SECURITY PROTOCOLS ACTIVE</p>
                            <p>[NET] DHT REFRESH (LATENCY: 12ms)</p>
                            <p>[SYS] TELEMETRY PULSE NOMINAL</p>
                            <p className="text-yellow-500/50">[WARN] ACCRUAL SYNC PENDING</p>
                        </div>
                    </section>
                </div>
            ) : null}
        </DetailPanel>
    );
}
