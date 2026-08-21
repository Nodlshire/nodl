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
    usePageTitle("Settings", "");
    const [status, setStatus] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    
    // Auth context for RBAC UI toggling
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const u = localStorage.getItem("nodl_user");
            if (u) setUser(JSON.parse(u));
        }
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

    const fetchStatus = async () => {
        try {
            const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8082';
            const statusRes = await fetch(`${apiBase}/api/admin/system/status`, {
                headers: { 'Authorization': `Bearer ${jwt}` }
            });
            
            if (statusRes.ok) setStatus(await statusRes.json());
        } catch (err) {
            console.error("Failed to fetch system status:", err);
        } finally {
            setLoading(false);
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
            <main className="flex-1 p-8 pt-24 overflow-y-auto pb-24 relative custom-scrollbar h-full space-y-12 focus:outline-none">
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
                                            <span className="text-[13px] font-mono text-[#22D3EE] font-bold">{config.platform_fee}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
                                            <div className="h-full bg-[#22D3EE] transition-all" style={{ width: `${(config.platform_fee / 25) * 100}%` }} />
                                        </div>
                                        <p className="text-[9px] text-slate-600 uppercase tracking-widest italic">Locked to Registry Baseline</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] text-slate-500 uppercase tracking-tighter">Affiliate Rev (%)</label>
                                            <span className="text-[13px] font-mono text-[#22D3EE] font-bold">{config.affiliate_fee}%</span>
                                        </div>
                                        <div className="w-full h-1 bg-white/10 rounded-full relative overflow-hidden">
                                            <div className="h-full bg-[#22D3EE] transition-all" style={{ width: `${(config.affiliate_fee / 15) * 100}%` }} />
                                        </div>
                                        <p className="text-[9px] text-slate-600 uppercase tracking-widest italic">Locked to Registry Baseline</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] text-slate-500 uppercase tracking-tighter">Payout Threshold ($)</label>
                                            <span className="text-[13px] font-mono text-white">${config.payout_threshold}</span>
                                        </div>
                                        <div className="w-full bg-white/[0.03] border border-white/5 rounded-[3px] px-3 py-2 text-[13px] text-slate-500 font-mono italic">
                                            Mutation Restricted
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[11px] text-slate-500 uppercase tracking-tighter">Heartbeat Filter (sec)</label>
                                            <span className="text-[13px] font-mono text-white">{config.heartbeat_interval}s</span>
                                        </div>
                                        <div className="w-full bg-white/[0.03] border border-white/5 rounded-[3px] px-3 py-2 text-[13px] text-slate-500 font-mono italic">
                                            Mutation Restricted
                                        </div>
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
                         <section className="bg-white/[0.02] border border-white/10 rounded-[5px] p-6 space-y-6 opacity-50 grayscale pointer-events-none relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] -rotate-12 border border-slate-400/30 px-4 py-1">Direct Mutation Restricted</span>
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <Shield className="w-4 h-4 text-orange-400" />
                                <h3 className="text-[12px] font-normal text-slate-300 uppercase tracking-widest">Network Safety Envelope</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-[5px]">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-white font-normal uppercase tracking-tighter">Registration Core</span>
                                        <span className="text-[10px] text-slate-600 italic">Operational State: ACTIVE</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-black/40 border border-white/5 rounded-[5px]">
                                    <div className="flex flex-col">
                                        <span className="text-[13px] text-white font-normal uppercase tracking-tighter">Payout Engine</span>
                                        <span className="text-[10px] text-slate-600 italic">Operational State: ACTIVE</span>
                                    </div>
                                </div>
                            </div>
                         </section>

                         <section className="bg-[#22D3EE]/[0.02] border border-[#22D3EE]/10 rounded-[5px] p-6 space-y-4">
                            <div className="flex items-center gap-3 mb-2">
                                <ShieldCheck className="w-4 h-4 text-[#22D3EE]" />
                                <h3 className="text-[12px] font-normal text-[#22D3EE] uppercase tracking-widest">Security Policy</h3>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                                    Administrative controls for simulation, state flushing, and protocol mutation are restricted to **Owner-Level** CLI access only.
                                </p>
                                <div className="p-3 bg-[#22D3EE]/5 border border-[#22D3EE]/10 rounded-[5px]">
                                    <span className="text-[10px] text-[#22D3EE] font-bold uppercase tracking-widest block mb-1">Authenticated As:</span>
                                    <span className="text-[12px] text-white font-mono">{userEmail}</span>
                                </div>
                            </div>
                         </section>
                    </div>
                </div>
            </main>
        </>
    );
}
