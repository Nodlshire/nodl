"use client";

import { useState } from "react";
import { 
    Search, Shield, AlertTriangle, Check, Ghost, 
    ArrowRightLeft, Cpu, Activity
} from "lucide-react";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function IntegrityReviewPage() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.wnode.one';
    const { data: registry, mutate } = useSWR(`${apiBase}/registry`, fetcher, { refreshInterval: 5000 });
    const [searchQuery, setSearchQuery] = useState("");

    const sessions = registry ? Object.values(registry) : [];
    
    // Filter for Flagged nodes
    const flaggedNodes = sessions.filter((s: any) => s.status === 'Flagged');

    // Grouping by Hardware DNA to find collisions
    const dnaMatches: Record<string, any[]> = {};
    sessions.forEach((s: any) => {
        if (!dnaMatches[s.hwDNA]) dnaMatches[s.hwDNA] = []; // Assuming hwDNA is part of the API response now, wait let's check registry.go
    });
    // Wait, registry.go uses hwDNA as the key in the map. The API returns map[string]*SessionInfo.
    
    const registryMap = registry || {};
    const dnaCollisions = Object.entries(registryMap).filter(([dna, info]) => {
        // In a real scenario, we'd check if this DNA appears in multiple active accounts
        // For this UI, we show all flagged nodes and their DNA
        return (info as any).status === 'Flagged';
    });

    const handleResolve = async (dna: string, action: 'clear' | 'shadow-bench') => {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.wnode.one';
        await fetch(`${apiBase}/api/admin/resolve-flag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hardwareDNA: dna, action })
        });
        mutate();
    };

    return (
        <>
                <header className="h-14 border-b border-white/25 flex items-center justify-between px-8 bg-black shrink-0">
                    <span className="text-[12px] font-normal text-[#22D3EE] tracking-[0.2em] uppercase-none">Integrity Review / Administrative Queue</span>
                    <div className="flex items-center gap-2.5 bg-[#EF4444]/10 border border-[#EF4444]/30 px-3 py-1 rounded-[5px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444]" />
                        <span className="text-[12px] text-[#EF4444] font-normal uppercase-none">{flaggedNodes.length} Pending Flags</span>
                    </div>
                </header>

                <main className="flex-1 p-10 overflow-y-auto pb-24 space-y-10">
                    <div className="pb-2">
                        <h2 className="text-[16px] font-normal tracking-tight text-white mb-1 uppercase-none">Judicial Review Queue</h2>
                        <p className="text-[14px] text-slate-400 font-normal uppercase-none">Investigate potential sybil attacks and policy violations.</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {dnaCollisions.map(([dna, info]: [string, any]) => (
                            <div key={dna} className="card-sovereign p-8 border-[#EF4444]/20">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="flex gap-6">
                                        <div className="w-12 h-12 bg-[#EF4444]/10 rounded-[5px] flex items-center justify-center border border-[#EF4444]/20 shrink-0">
                                            <Shield className="w-6 h-6 text-[#EF4444]" />
                                        </div>
                                        <div>
                                            <h3 className="text-[18px] text-white font-normal mb-1">{info.sessionId}</h3>
                                            <div className="flex items-center gap-3 text-[12px] text-slate-500 font-mono">
                                                <span>DNA: {dna}</span>
                                                <span className="w-1 h-1 rounded-full bg-slate-700" />
                                                <span className="text-[#EF4444]">Reason: {info.isVM ? "Virtual Machine Detected" : "Hardware Collision"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => handleResolve(dna, 'shadow-bench')}
                                            className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-[5px] text-[13px] text-slate-400 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <Ghost className="w-4 h-4" /> Shadow-Bench
                                        </button>
                                        <button 
                                            onClick={() => handleResolve(dna, 'clear')}
                                            className="px-6 py-2.5 bg-[#22D3EE] text-black rounded-[5px] text-[13px] font-bold hover:brightness-110 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.2)]"
                                        >
                                            <Check className="w-4 h-4" /> Clear & Restore
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-black/40 border border-white/5 rounded-[5px] overflow-hidden">
                                    <div className="px-6 py-3 border-b border-white/5 bg-white/5">
                                        <span className="text-[11px] text-slate-500 uppercase tracking-widest font-normal">Hardware DNA Match Cluster</span>
                                    </div>
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b border-white/5 text-[11px] text-slate-600 uppercase tracking-tighter">
                                                <th className="px-6 py-4 font-normal">Account ID</th>
                                                <th className="px-6 py-4 font-normal">Last Active</th>
                                                <th className="px-6 py-4 font-normal">Integrity</th>
                                                <th className="px-6 py-4 font-normal">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b border-white/5 bg-white/[0.02]">
                                                <td className="px-6 py-4 text-[13px] text-white">{info.sessionId}</td>
                                                <td className="px-6 py-4 text-[13px] text-slate-500 font-mono">{new Date(info.lastSeen).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-[13px] text-[#EF4444] font-mono">{(info.integrityScore * 100).toFixed(0)}%</td>
                                                <td className="px-6 py-4 text-[13px] text-[#EF4444] uppercase tracking-tighter font-bold">Flagged</td>
                                            </tr>
                                            {/* In a real duplicate scenario, we'd list other accounts with same DNA here */}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}

                        {flaggedNodes.length === 0 && (
                            <div className="py-20 flex flex-col items-center justify-center opacity-30">
                                <Shield className="w-16 h-16 text-slate-500 mb-4" />
                                <span className="text-[14px] text-slate-400 font-normal">No pending integrity flags. Judicial queue is empty.</span>
                            </div>
                        )}
                    </div>
                </main>
        </>
    );
}
