"use client";

import React from "react";
import { Layers, Search } from "lucide-react";
import { Tree } from "./Tree";

interface AcquisitionTreeProps {
    onNodeClick?: (node: any) => void;
    selectedNodeId?: string;
}

export default function AcquisitionTree({ onNodeClick, selectedNodeId }: AcquisitionTreeProps) {
    return (
        <section className="bg-white/[0.01] border border-wnode-border-neutral shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-[5px] overflow-hidden">
            <div className="bg-white/[0.02] border-b border-wnode-border-neutral p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-[#22D3EE]" />
                    <h2 className="text-[14px] font-bold text-white uppercase tracking-[0.1em]">Network Topology</h2>
                </div>
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#22D3EE] transition-colors" />
                    <input 
                        type="text" 
                        title="Search by name or WUID"
                        placeholder="Search network identities..." 
                        className="bg-black/40 border border-wnode-border-neutral rounded-[5px] pl-10 pr-4 py-2 text-[12px] text-white w-64 focus:outline-none focus:border-[#22D3EE]/50 transition-all font-normal"
                        readOnly
                    />
                </div>
            </div>
            <div className="p-6">
                <Tree onNodeClick={onNodeClick} selectedNodeId={selectedNodeId} />
            </div>
        </section>
    );
}
