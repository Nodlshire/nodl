'use client';

import React from 'react';
import { Activity, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface HealthAnnunciatorProps {
    status: 'Nominal' | 'Warning' | 'Critical';
    connectedNodes: number;
    uptime: string;
}

export default function HealthAnnunciator({ status, connectedNodes, uptime }: HealthAnnunciatorProps) {
    const statusColors = {
        Nominal: 'text-green-400 border-green-400/20 bg-green-400/5',
        Warning: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/5',
        Critical: 'text-red-400 border-red-400/20 bg-red-400/5'
    };

    return (
        <Link href="/dashboard/hardware">
            <div className={`border p-4 transition-all hover:bg-white/5 group cursor-pointer rounded-[5px] ${statusColors[status]}`}>
                <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-normal tracking-[0.2em] text-slate-500">System health</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${status === 'Nominal' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className="text-16px font-normal text-white tracking-tight">{status}</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-4">
                    <div>
                        <span className="block text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-1.5">Connected nodes</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-16px font-normal text-white tracking-tight">{connectedNodes}</span>
                            <span className="text-[10px] text-slate-500 uppercase font-normal">Nodes</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-1.5 text-right">System uptime</span>
                        <span className="text-16px text-white font-normal tracking-tight">{uptime}</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between opacity-50 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] uppercase tracking-widest font-normal">Link secure</span>
                    <ShieldCheck className="w-3.5 h-3.5" />
                </div>

            </div>
        </Link>
    );
}
