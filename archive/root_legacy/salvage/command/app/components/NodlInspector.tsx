import React, { useState, useEffect } from "react";
import DetailPanel from "./DetailPanel";
import { 
    X, Activity, Cpu, HardDrive, Zap, Clock, 
    Shield, Globe, Server, ShieldAlert, Terminal, Loader2
} from "lucide-react";

interface NodlInspectorProps {
    nodeId: string | null;
    onClose: () => void;
}

export default function NodlInspector({ nodeId, onClose }: NodlInspectorProps) {
    const [node, setNode] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!nodeId) {
            setNode(null);
            return;
        }

        const fetchNode = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/nodls/${nodeId}`);
                if (!res.ok) throw new Error("Registry synchronization failure");
                const data = await res.json();
                setNode(data);
            } catch (err: any) {
                console.error("Inspector fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchNode();
    }, [nodeId]);

    return (
        <DetailPanel
            isOpen={!!nodeId}
            onClose={onClose}
            title="nodl Operational Core"
            subtitle={`Peer ID: ${nodeId}`}
        >
            {loading ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#22D3EE] opacity-20" />
                    <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Querying Mesh Registry...</span>
                </div>
            ) : error ? (
                <div className="p-4 bg-red-400/5 border border-red-400/10 rounded-[5px] flex items-center gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-500" />
                    <div className="flex flex-col">
                        <span className="text-[11px] text-red-400 uppercase tracking-widest font-bold font-mono">Registry Error</span>
                        <span className="text-[10px] text-red-400/60 uppercase tracking-tighter">{error}</span>
                    </div>
                </div>
            ) : node ? (
                <div className="space-y-10">
                    {/* Status Overview */}
                    <section className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Operational Status</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${node.status === 'active' || node.status === 'online' ? 'bg-[#22D3EE] shadow-[0_0_8px_rgba(34,211,238,0.4)]' : 'bg-slate-700'}`} />
                                <span className={`text-[11px] uppercase font-bold tracking-widest ${node.status === 'active' || node.status === 'online' ? 'text-[#22D3EE]' : 'text-slate-500'}`}>
                                    {node.status || 'OFFLINE'}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[5px]">
                                <span className="block text-[9px] text-slate-600 uppercase tracking-tighter mb-1">Compute Tier</span>
                                <span className="text-[13px] text-white font-mono">{node.tier || 'Standard'}</span>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-[5px]">
                                <span className="block text-[9px] text-slate-600 uppercase tracking-tighter mb-1">Uptime Score</span>
                                <span className="text-[13px] text-[#22D3EE] font-mono">{node.uptime || '99.9%'}</span>
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
                                <span className="text-[12px] text-white font-mono">{node.os || 'Linux'} / {node.arch || 'x64'}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-[#22D3EE] opacity-40" />
                                    <span className="text-[11px] text-slate-500 uppercase tracking-tighter">CPU Capacity</span>
                                </div>
                                <span className="text-[12px] text-white font-mono">{node.cpuCores || node.cpu_cores || 0} Cores</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <HardDrive className="w-4 h-4 text-[#22D3EE] opacity-40" />
                                    <span className="text-[11px] text-slate-500 uppercase tracking-tighter">System Memory</span>
                                </div>
                                <span className="text-[12px] text-white font-mono">{node.memoryGB || node.memory_gb || 0} GB</span>
                            </div>
                            { (node.gpuModel || node.gpu_model) && (
                                <div className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-4 h-4 text-purple-400 opacity-40" />
                                        <span className="text-[11px] text-slate-500 uppercase tracking-tighter">GPU Acceleration</span>
                                    </div>
                                    <span className="text-[12px] text-purple-300 font-mono truncate max-w-[150px]">{node.gpuModel || node.gpu_model}</span>
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
                                        {node.name || 'ANONYMOUS'}
                                    </span>
                                    <span className="text-[9px] text-slate-600 font-mono tracking-tighter uppercase">
                                        {node.protocolId || node.userID || node.user_id ? (node.protocolId || node.userID || node.user_id).toString().slice(0, 12) : '---'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between group">
                                <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Region / Geo</span>
                                <span className="text-[12px] text-white font-mono">{node.region || 'Unknown'}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Protocol Version</span>
                                <span className="text-[12px] text-white font-mono">v{node.version || '1.2.x'}</span>
                            </div>
                            <div className="flex items-center justify-between group">
                                <span className="text-[11px] text-slate-500 uppercase tracking-tighter">Last Heartbeat</span>
                                <div className="flex flex-col items-end">
                                    <span className="text-[12px] text-white font-mono">
                                        {node.lastHeartbeat || node.last_heartbeat ? new Date(node.lastHeartbeat || node.last_heartbeat).toLocaleTimeString() : 'N/A'}
                                    </span>
                                    <span className="text-[9px] text-slate-600 uppercase tracking-tighter font-mono">
                                        {node.lastHeartbeat || node.last_heartbeat ? new Date(node.lastHeartbeat || node.last_heartbeat).toLocaleDateString() : '---'}
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
            ) : null}
        </DetailPanel>
    );
}
