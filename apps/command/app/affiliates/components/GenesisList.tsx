"use client";

import React from "react";
import { Shield, Users } from "lucide-react";

interface GenesisRow {
    index: string;
    name: string;
    type: "Founder" | "Partner";
    wuid: string;
    l1Count: string;
    l2Count: string;
}

interface GenesisListProps {
    onRowClick?: (row: GenesisRow) => void;
    onL1Click?: (e: React.MouseEvent, row: GenesisRow) => void;
    onInvite?: (row: GenesisRow) => void;
    selectedWuid?: string;
}

export default function GenesisList({ onRowClick, onL1Click, onInvite, selectedWuid }: GenesisListProps) {
    const [rows, setRows] = React.useState<GenesisRow[]>([]);

    React.useEffect(() => {
        fetch("/api/v1/nodlrs", { cache: "no-store" })
            .then(res => res.ok ? res.json() : [])
            .then((nodlrs: any[]) => {
                if (Array.isArray(nodlrs)) {
                    const mapped: GenesisRow[] = nodlrs.map((n: any, i: number) => ({
                        index: String(i + 1).padStart(2, "0"),
                        name: n.name || n.displayName || n.email || "Nodlr Identity",
                        type: n.isFounderOrPartner || n.isFounder ? "Founder" : "Partner",
                        wuid: n.wuid || n.id || "—",
                        l1Count: String(n.l1Affiliates ?? n.l1Count ?? 0),
                        l2Count: String(n.l2Affiliates ?? n.l2Count ?? 0)
                    }));
                    setRows(mapped);
                }
            })
            .catch(() => {});
    }, []);

    return (
        <section className="space-y-6">
            <div className="bg-white/[0.01] border border-wnode-border-neutral shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-[5px] overflow-hidden">
                {/* Header Row */}
                <div className="grid grid-cols-[80px_1fr_110px_190px_120px_120px] border-b border-wnode-border-neutral bg-white/[0.02] px-6 py-3">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Index</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Name</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Type</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">WUID</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">L1</span>
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest text-center">L2</span>
                </div>

                {/* Data Rows */}
                <div className="divide-y divide-white/20 p-1 space-y-1">
                    {rows.map((row) => {
                        const isSelected = selectedWuid === row.wuid && row.wuid !== "—";
                        const isEmpty = row.wuid === "—" || !row.wuid;
                        
                        return (
                            <div 
                                key={row.index} 
                                role="row"
                                onClick={() => onRowClick?.(row)}
                                className={`
                                    grid grid-cols-[80px_1fr_110px_190px_120px_120px] items-center px-6 py-4
                                    rounded-[4px] transition-all cursor-pointer relative z-10
                                    ${row.type === 'Founder'
                                      ? isSelected
                                        ? 'text-amber-300 border-2 border-amber-300 border-l-2 border-l-amber-300 bg-white/10 outline outline-2 outline-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                                        : 'text-amber-300 border border-amber-300 border-l-2 border-l-amber-300/40 hover:border-amber-300 hover:border-l-amber-300 hover:outline hover:outline-1 hover:outline-amber-300 hover:bg-white/5'
                                      : isSelected
                                        ? 'text-[#22D3EE] border-2 border-[#22D3EE] border-l-2 border-l-[#22D3EE] bg-white/10 outline outline-2 outline-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                                        : 'text-[#22D3EE] border border-[#22D3EE] border-l-2 border-l-[#22D3EE]/40 hover:border-[#22D3EE] hover:border-l-[#22D3EE] hover:outline hover:outline-1 hover:outline-[#22D3EE] hover:bg-white/5'
                                    }
                                `}
                            >
                                <span className="text-[12px] font-mono text-white/40 group-hover:text-white transition-colors">{row.index}</span>
                                <span className="text-[13px] text-white font-medium">{row.name}</span>
                                <div className="flex justify-start mr-2">
                                    <div 
                                        title={row.type === 'Founder' ? "Founder node: root-level identity" : "Partner node: network affiliate"}
                                        className={`flex items-center gap-2 px-2 py-0.5 rounded-[3px] border transition-colors ${row.type === 'Founder' ? 'bg-amber-300/10 border-amber-300/40 text-amber-300' : 'bg-[#22D3EE]/10 border-[#22D3EE]/40 text-[#22D3EE]'}`}
                                    >
                                        {row.type === 'Founder' ? <Shield className="w-2.5 h-2.5" /> : <Users className="w-2.5 h-2.5" />}
                                        <span className="text-[9px] font-bold uppercase tracking-widest">{row.type}</span>
                                    </div>
                                </div>
                                <div>
                                    {isEmpty ? (
                                        <button
                                            className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-[3px] bg-amber-300/20 text-amber-300 border border-amber-300/40 hover:bg-amber-300/30 hover:border-amber-300 transition-all"
                                            onClick={(e) => { e.stopPropagation(); onInvite?.(row); }}
                                        >
                                            Invite
                                        </button>
                                    ) : (
                                        <span 
                                            title="Unique Wnode Identifier"
                                            className="text-[12px] font-mono text-white/60 group-hover:text-white transition-colors"
                                        >
                                            {row.wuid}
                                        </span>
                                    )}
                                </div>
                                <div 
                                    className="text-center"
                                    onClick={(e) => onL1Click?.(e, row)}
                                >
                                    <span className="text-[12px] font-mono text-white/40 hover:text-white transition-colors cursor-pointer">{row.l1Count}</span>
                                </div>
                                <div className="text-center">
                                    <span className="text-[12px] font-mono text-white/40">{row.l2Count}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
