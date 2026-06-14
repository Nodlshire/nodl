"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, Wifi, ShieldCheck, RefreshCw } from 'lucide-react';

interface ConnectivityAuditProps {
    isOpen: boolean;
    lastSyncedAt?: string;
    onClose?: () => void;
}

export default function ConnectivityAudit({ isOpen, lastSyncedAt, onClose }: ConnectivityAuditProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-full max-w-xl bg-[#0a0a0b] border border-white/10 rounded-[5px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                    >
                        {/* Institutional Header */}
                        <div className="bg-[#9333ea]/10 border-b border-white/5 p-8 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-[#9333ea]/20 flex items-center justify-center border border-[#9333ea]/30">
                                <Activity className="w-8 h-8 text-[#9333ea] animate-pulse" />
                            </div>
                            <div>
                                <h2 className="text-[10px] uppercase font-black tracking-[0.4em] text-[#9333ea] mb-2">Protocol Diagnostic</h2>
                                <h1 className="text-2xl font-normal text-white tracking-tight">Initiating Network Connectivity Audit</h1>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Status Section */}
                            <div className="space-y-4">
                                <p className="text-[14px] text-slate-400 leading-relaxed">
                                    The frontend has detected a deviation in the ledger synchronization pulse. We are currently verifying local peer visibility and P2P link integrity.
                                </p>
                                
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                        <div className="flex items-center gap-3">
                                            <Wifi className="w-4 h-4 text-[#9333ea]" />
                                            <span className="text-[12px] text-white font-normal uppercase tracking-widest">Local Peer Visibility</span>
                                        </div>
                                        <span className="text-[10px] px-2 py-0.5 bg-[#9333ea]/10 text-[#9333ea] border border-[#9333ea]/20 rounded-full font-bold animate-pulse">SCANNING</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="w-4 h-4 text-green-500" />
                                            <span className="text-[12px] text-white font-normal uppercase tracking-widest">P2P Encryption Layer</span>
                                        </div>
                                        <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">SECURE</span>
                                    </div>
                                </div>
                            </div>

                            {/* Guidance Section */}
                            <div className="space-y-6">
                                <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Verification Guidance</h3>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <span className="text-[12px] text-white font-bold block">1. Firewall & Ports</span>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            Ensure Ports 8080-8082 are open. Verify that local security policies permit P2P handshake traffic.
                                        </p>
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-[12px] text-white font-bold block">2. Service Status</span>
                                        <p className="text-[11px] text-slate-500 leading-relaxed">
                                            Confirm the Wnode background services are operational. Use the system tray or CLI to check status.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer / Action */}
                            <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest">Verifying Link Stability...</span>
                                </div>
                                <button 
                                    onClick={onClose}
                                    className="px-6 py-3 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded-[4px] hover:bg-[#9333ea] hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                >
                                    Dismiss Audit
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
