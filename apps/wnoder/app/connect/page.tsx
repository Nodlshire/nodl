'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Monitor, CheckCircle2, Loader2, Cpu, Activity, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ConnectPage() {
    const [status, setStatus] = useState<'idle' | 'linking' | 'success' | 'error'>('idle');
    const [metadata, setMetadata] = useState<any>(null);

    useEffect(() => {
        // Simple metadata extraction
        setMetadata({
            os: navigator.platform,
            userAgent: navigator.userAgent,
            hostname: typeof window !== 'undefined' ? window.location.hostname : 'unknown'
        });
    }, []);

    const handleConnect = async () => {
        setStatus('linking');
        try {
            const apiBase = ""; // Should be from config in production
            const res = await fetch(`/api/nodes/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Assuming auth is handled by cookies or simple session for this dev phase
                },
                body: JSON.stringify({ metadata })
            });

            if (!res.ok) throw new Error("Failed to link node");

            const data = await res.json();
            
            // Store the long-lived device token locally
            localStorage.setItem('wnode_device_token', data.deviceToken);
            
            setStatus('success');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Ambient background glow */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyber-cyan blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#9333ea] blur-[120px] rounded-full" />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-xl surface-card p-10 relative z-10 space-y-8 glass-card"
            >
                {status === 'success' ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6 py-10"
                    >
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                                <CheckCircle2 className="w-10 h-10 text-green-500" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">Connected Successfully</h1>
                            <p className="text-slate-400">This machine is now linked to your Wnode account.</p>
                        </div>
                        <p className="text-sm text-slate-500 italic pt-4">You can now safely close this tab. Your node will appear in your dashboard automatically.</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-cyber-cyan/10 rounded-md border border-cyber-cyan/20">
                                    <Monitor className="w-5 h-5 text-cyber-cyan" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyber-cyan">Browser Connect</span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight">Connect this machine</h1>
                            <p className="text-slate-400 font-medium leading-relaxed">
                                Link this browser-based node to your Wnode account to begin earning compute rewards.
                            </p>
                        </div>

                        {/* Machine Specs Preview */}
                        <div className="bg-white/5 border border-white/10 rounded-[4px] p-6 space-y-4">
                            <h3 className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Machine Identity</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-4 h-4 text-slate-500" />
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">OS</p>
                                        <p className="text-sm text-slate-300 font-medium truncate max-w-[150px]">{metadata?.os || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-slate-500" />
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Status</p>
                                        <p className="text-sm text-green-500 font-bold">Ready to Link</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <button 
                                onClick={handleConnect}
                                disabled={status === 'linking'}
                                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-cyber-cyan transition-all rounded-[4px] shadow-lg flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                            >
                                {status === 'linking' ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Linking Machine...
                                    </>
                                ) : (
                                    "Connect this machine"
                                )}
                            </button>
                            {status === 'error' && (
                                <p className="text-xs text-red-500 text-center font-bold uppercase tracking-widest animate-pulse">Failed to link machine. Please try again.</p>
                            )}
                            <p className="text-[11px] text-slate-500 text-center px-6 leading-relaxed">
                                By connecting, you authorize this machine to participate in the Nodlr compute network and securely store a device token locally.
                            </p>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
}
