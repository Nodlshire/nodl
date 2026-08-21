"use client";

import React, { useState, useEffect } from "react";
import { 
    Settings as SettingsIcon, Shield, Database, RefreshCw, AlertCircle, CheckCircle2, 
    Trash2, Cpu, Globe, Key, History, Save, Play, Pause, Power, Zap, Percent, Clock, 
    Wallet, ShieldCheck, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTitle } from "../components/PageTitleContext";
import BusinessProfile from "../components/BusinessProfile";

export default function SettingsPage() {
    usePageTitle("Administrative Control Center", "Environmental parameters and high-privilege system overrides.");
    const [status, setStatus] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    
    // Auth context for RBAC UI toggling
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const u = localStorage.getItem("nodl_user");
        if (u) setUser(JSON.parse(u));
    }, []);

    const userEmail = user?.email || "";
    const isOwner = userEmail === 'stephen@wnode.one';
    const isSeniorManager = user?.role === 'senior_manager';
    
    // Admin config state
    const [config, setConfig] = useState({
        platform_fee: 10,
        affiliate_fee: 5,
        genesis_fee: 2.5,
        payout_threshold: 100,
        job_timeout: 3600,
        heartbeat_interval: 60,
        registrations_enabled: true,
        payouts_enabled: true
    });

    const [simEnabled, setSimEnabled] = useState(false);

    const fetchStatus = async () => {
        try {
            const jwt = localStorage.getItem("nodl_jwt");
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8082';
            const [statusRes, simRes] = await Promise.all([
                fetch(`${apiBase}/api/admin/system/status`, {
                    headers: { 'Authorization': `Bearer ${jwt}` }
                }),
                fetch('/api/sim/status')
            ]);
            
            if (statusRes.ok) setStatus(await statusRes.json());
            if (simRes.ok) {
                const simData = await simRes.json();
                setSimEnabled(simData.enabled);
            }
        } catch (err) {
            console.error("Failed to fetch system status:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const toggleSimulation = async () => {
        const action = simEnabled ? 'disable' : 'enable';
        setActionLoading(`sim_${action}`);
        try {
            const res = await fetch(`/api/sim/${action}`, { method: 'POST' });
            if (res.ok) {
                setSimEnabled(!simEnabled);
                setMessage({ type: 'success', text: `Simulation Mode ${action === 'enable' ? 'ACTIVATED' : 'DEACTIVATED'}.` });
            }
        } catch (e) {
            setMessage({ type: 'error', text: `Failed to ${action} simulation.` });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleSimAction = async (action: 'flush' | 'reset') => {
        setActionLoading(`sim_${action}`);
        try {
            const res = await fetch(`/api/sim/${action}`, { method: 'POST' });
            if (res.ok) {
                setMessage({ type: 'success', text: `Simulation dataset ${action === 'flush' ? 'FLUSHED' : 'RESET'}.` });
            }
        } catch (e) {
            setMessage({ type: 'error', text: `Failed to ${action} simulation dataset.` });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    const handleAction = async (action: string) => {
        setActionLoading(action);
        setMessage(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            setMessage({ type: 'success', text: `System action [${action.toUpperCase()}] executed successfully.` });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Action failed' });
        } finally {
            setActionLoading(null);
            setTimeout(() => setMessage(null), 3000);
        }
    };

    return (
        <>
            <main className="flex-1 p-8 overflow-y-auto pb-24 relative custom-scrollbar h-full">
                {(isOwner || isSeniorManager) && (
                    <div className="mb-10">
                        <BusinessProfile />
                    </div>
                )}

                <div className="mb-6">
                    <AnimatePresence>
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-[5px] border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                            >
                                {message.type === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-4 h-4" />}
                                <span className="text-[11px] font-normal uppercase tracking-wider">{message.text}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Global Parameters */}
                    <div className="xl:col-span-2 space-y-8">
                        <section className="bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Percent className="w-4 h-4 text-[#22D3EE]" />
                                    <h3 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Protocol Constants</h3>
                                </div>
                                <button 
                                    onClick={() => handleAction('save_config')}
                                    className="text-[10px] text-[#22D3EE] uppercase tracking-[0.2em] font-medium hover:underline"
                                >
                                    Sync with Registry
                                </button>
                            </div>
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] text-slate-500 uppercase tracking-tighter">Platform Fee (%)</label>
                                            <span className="text-[13px] font-mono text-white">{config.platform_fee}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="25" step="0.5"
                                            value={config.platform_fee}
                                            onChange={(e) => setConfig({...config, platform_fee: parseFloat(e.target.value)})}
                                            className="w-full h-1 bg-white/10 rounded-full appearance-none accent-[#22D3EE]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] text-slate-500 uppercase tracking-tighter">Affiliate Rev (%)</label>
                                            <span className="text-[13px] font-mono text-white">{config.affiliate_fee}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="15" step="0.5"
                                            value={config.affiliate_fee}
                                            onChange={(e) => setConfig({...config, affiliate_fee: parseFloat(e.target.value)})}
                                            className="w-full h-1 bg-white/10 rounded-full appearance-none accent-[#22D3EE]"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] text-slate-500 uppercase tracking-tighter">Payout Threshold ($)</label>
                                            <span className="text-[13px] font-mono text-white">${config.payout_threshold}</span>
                                        </div>
                                        <input 
                                            type="number"
                                            value={config.payout_threshold}
                                            onChange={(e) => setConfig({...config, payout_threshold: parseInt(e.target.value)})}
                                            className="w-full bg-black/40 border border-white/10 rounded-[3px] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#22D3EE]/50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] text-slate-500 uppercase tracking-tighter">Heartbeat Filter (sec)</label>
                                            <span className="text-[13px] font-mono text-white">{config.heartbeat_interval}s</span>
                                        </div>
                                        <input 
                                            type="number"
                                            value={config.heartbeat_interval}
                                            onChange={(e) => setConfig({...config, heartbeat_interval: parseInt(e.target.value)})}
                                            className="w-full bg-black/40 border border-white/10 rounded-[3px] px-3 py-2 text-[13px] text-white focus:outline-none focus:border-[#22D3EE]/50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/10 flex items-center gap-3">
                                <History className="w-4 h-4 text-purple-400" />
                                <h3 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Administrative Audit Log</h3>
                            </div>
                            <div className="divide-y divide-white/5">
                                {[
                                    { user: 'stephen@wnode.one', action: 'Update Pricing [Tier_01]', time: '10m ago', ip: '142.12.8.4' },
                                    { user: 'stephen@wnode.one', action: 'Authorize Payout #824', time: '4h ago', ip: '142.12.8.4' },
                                    { user: 'manager_1@wnode.one', action: 'Flush Node State [Cache]', time: '1d ago', ip: '18.42.102.11' },
                                ].map((log, i) => (
                                    <div key={i} className="p-4 flex items-center justify-between group hover:bg-white/[0.01] transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] text-slate-500 font-bold">
                                                {log.user[0].toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[13px] text-slate-300">{log.action}</span>
                                                <span className="text-[10px] text-slate-600 font-mono italic">{log.user}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-start">
                                            <span className="text-[11px] text-slate-400">{log.time}</span>
                                            <span className="text-[9px] text-slate-700 font-mono tracking-tighter">{log.ip}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* System Controls */}
                    <div className="space-y-8">
                         <section className="bg-white/[0.02] border border-white/10 rounded-[5px] p-6 space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <Power className="w-4 h-4 text-orange-400" />
                                <h3 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Safety Toggles</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-[5px]">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-white font-normal uppercase tracking-tighter">Registration Core</span>
                                        <span className="text-[10px] text-slate-600">Open network to new providers</span>
                                    </div>
                                    <button 
                                        onClick={() => setConfig({...config, registrations_enabled: !config.registrations_enabled})}
                                        className={`p-1.5 rounded-[4px] border transition-all ${config.registrations_enabled ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                                    >
                                        {config.registrations_enabled ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-[5px]">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-white font-normal uppercase tracking-tighter">Payout Engine</span>
                                        <span className="text-[10px] text-slate-600">Global provider distributions</span>
                                    </div>
                                    <button 
                                        onClick={() => setConfig({...config, payouts_enabled: !config.payouts_enabled})}
                                        className={`p-1.5 rounded-[4px] border transition-all ${config.payouts_enabled ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}
                                    >
                                        {config.payouts_enabled ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                                    </button>
                                </div>
                            </div>
                         </section>

                         <section className="bg-white/[0.02] border border-white/10 rounded-[5px] p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Database className="w-4 h-4 text-yellow-400" />
                                <h3 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Simulation Layer</h3>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-[5px]">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-white font-normal uppercase tracking-tighter">Simulation Mode</span>
                                        <span className="text-[10px] text-slate-600">Serve mock telemetry dataset</span>
                                    </div>
                                    <button 
                                        onClick={toggleSimulation}
                                        className={`p-1.5 rounded-[4px] border transition-all ${simEnabled ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}
                                    >
                                        {simEnabled ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => handleSimAction('flush')}
                                        disabled={actionLoading === 'sim_flush'}
                                        className="py-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-[5px] text-[10px] text-slate-500 uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        Flush Dataset
                                    </button>
                                    <button 
                                        onClick={() => handleSimAction('reset')}
                                        disabled={actionLoading === 'sim_reset'}
                                        className="py-2.5 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-[5px] text-[10px] text-slate-500 uppercase tracking-widest transition-all disabled:opacity-50"
                                    >
                                        Reset Dataset
                                    </button>
                                </div>
                            </div>
                         </section>

                         <section className="bg-white/[0.02] border border-white/10 rounded-[5px] p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <Zap className="w-4 h-4 text-[#22D3EE]" />
                                <h3 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Maintenance Core</h3>
                            </div>
                            <div className="space-y-2">
                                <button 
                                    onClick={() => handleAction('restart_backend')}
                                    disabled={actionLoading === 'restart_backend'}
                                    className="w-full flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-[5px] text-[12px] transition-all group"
                                >
                                    <span className="text-slate-400 font-normal">Restart Backend Daemon</span>
                                    <RefreshCw className={`w-3.5 h-3.5 text-slate-600 group-hover:text-white ${actionLoading === 'restart_backend' ? 'animate-spin' : ''}`} />
                                </button>
                                <button 
                                    onClick={() => handleAction('restart_p2p')}
                                    disabled={actionLoading === 'restart_p2p'}
                                    className="w-full flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-[5px] text-[12px] transition-all group"
                                >
                                    <span className="text-slate-400 font-normal">Restart P2P Mesh Fabric</span>
                                    <Globe className={`w-3.5 h-3.5 text-slate-600 group-hover:text-white ${actionLoading === 'restart_p2p' ? 'animate-pulse' : ''}`} />
                                </button>
                                <button 
                                    onClick={() => handleAction('rotate_secrets')}
                                    disabled={actionLoading === 'rotate_secrets'}
                                    className="w-full flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 rounded-[5px] text-[12px] transition-all group"
                                >
                                    <span className="text-slate-400 font-normal">Rotate Session Secrets</span>
                                    <Key className={`w-3.5 h-3.5 text-slate-600 group-hover:text-white`} />
                                </button>
                            </div>
                         </section>

                         <section className="border-red-500/20 bg-red-500/5 border rounded-[5px] p-6 space-y-4">
                            <div className="flex items-start gap-3">
                                <ShieldAlert className="w-5 h-5 text-red-500 mt-1" />
                                <div>
                                    <h4 className="text-[13px] font-medium text-red-400 mb-1">Owner Intervention Zone</h4>
                                    <p className="text-[11px] text-red-900/60 leading-relaxed font-normal">
                                        These actions are data-destructive and will cause immediate network fragmentation until re-indexed.
                                    </p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleAction('flush_state')}
                                disabled={actionLoading === 'flush_state'}
                                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-[5px] text-[12px] text-red-500 font-medium transition-all flex items-center justify-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Execute Global State Flush
                            </button>
                         </section>
                    </div>
                </div>
            </main>
        </>
    );
}
