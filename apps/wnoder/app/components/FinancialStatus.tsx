"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function FinancialStatus() {
    const apiBase = '';
    const { data: pulse, error, mutate } = useSWR(`/api/v1/system/pulse`, fetcher, {
        refreshInterval: 60000 // Check every minute
    });

    const [isVerifying, setIsVerifying] = useState(false);

    const handleVerify = async () => {
        setIsVerifying(true);
        // Authoritative delay for institutional feel
        await new Promise(resolve => setTimeout(resolve, 1200));
        await mutate();
        setIsVerifying(false);
    };

    if (error) return (
        <div className="flex items-center gap-2 text-red-500/70 text-[10px] font-bold uppercase tracking-widest">
            <AlertCircle className="w-3 h-3" />
            Connectivity Audit Required
        </div>
    );

    if (!pulse) return null;

    const lastSynced = new Date(pulse.last_synced_at);
    const now = new Date();
    const diffMinutes = Math.floor((now.getTime() - lastSynced.getTime()) / 60000);
    const isSynced = diffMinutes < 10;

    return (
        <div className="flex items-center gap-4">
            <div 
                className="flex items-center gap-2 bg-white/[0.02] border border-white/5 px-4 py-2 rounded-[4px] cursor-help group relative"
                title="Audit the connection between your local ledger and the global payout network."
            >
                {isSynced ? (
                    <ShieldCheck className="w-3.5 h-3.5 text-cyber-cyan" />
                ) : (
                    <RefreshCw className="w-3.5 h-3.5 text-yellow-500 animate-spin-slow" />
                )}
                
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {isVerifying ? (
                        "Requesting Status Verification..."
                    ) : (
                        isSynced 
                            ? `Ledger is Synchronized. (Verified ${diffMinutes} minutes ago).`
                            : "Financial Synchronization in Progress..."
                    )}
                </span>
            </div>

            <button
                onClick={handleVerify}
                disabled={isVerifying}
                className="p-2 hover:bg-white/5 rounded-[4px] transition-all text-slate-500 hover:text-cyber-cyan disabled:opacity-50"
                title="Initiate Network Connectivity Audit"
            >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
            </button>
        </div>
    );
}
