"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export default function IntegrityPanel() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/v1/admin/governance/integrity")
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) return <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl animate-pulse h-32"></div>;

    const isHealthy = !data.corruptionFlags;

    return (
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-white text-lg font-medium">SoT Integrity Snapshot</h2>
                {isHealthy ? (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-sm">
                        <ShieldCheck className="w-4 h-4" />
                        <span>System Healthy</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-red-400 bg-red-400/10 px-3 py-1 rounded-full text-sm">
                        <ShieldAlert className="w-4 h-4" />
                        <span>Corruption Detected</span>
                    </div>
                )}
            </div>
            
            <div className="text-sm text-slate-400 mb-2">Synthetic WUIDs:</div>
            <div className="flex gap-2 flex-wrap mb-4">
                {data.syntheticWUIDs?.map((wuid: string) => (
                    <span key={wuid} className="px-2 py-1 bg-slate-800 rounded-md text-xs text-slate-300 font-mono">
                        {wuid}
                    </span>
                ))}
            </div>
        </div>
    );
}
