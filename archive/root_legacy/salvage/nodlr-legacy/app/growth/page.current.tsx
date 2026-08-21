"use client";

import { useState, useEffect } from "react";
import { Users, Shield, Zap, TrendingUp, Info } from 'lucide-react';
import { motion } from "framer-motion";

interface Node {
    id: string;
    peerId: string;
    health: number;
    level: number;
    commission: number;
    children?: Node[];
}

export default function GrowthEnginePage() {
    const [nodes, setNodes] = useState<Node[]>([]);

    useEffect(() => {
        // Mock data for the Growth Engine
        const mockTree: Node[] = [
            { id: "1", peerId: "12D3KooW...", health: 98, level: 1, commission: 45.20, children: [
                { id: "1-1", peerId: "Secondary Node", health: 0, level: 2, commission: 12.40 },
                { id: "1-2", peerId: "Secondary Node", health: 0, level: 2, commission: 8.50 },
            ]},
            { id: "2", peerId: "12D3KooX...", health: 42, level: 1, commission: 12.80 },
            { id: "3", peerId: "12D3KooY...", health: 85, level: 1, commission: 33.10, children: [
                { id: "3-1", peerId: "Secondary Node", health: 0, level: 2, commission: 5.20 },
            ]},
        ];
        setNodes(mockTree);
    }, []);

    const totalL2Count = nodes.reduce((acc, n) => acc + (n.children?.length || 0), 0);
    const totalYield = nodes.reduce((acc, n) => acc + n.commission + (n.children?.reduce((a, c) => a + c.commission, 0) || 0), 0);

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-3xl font-normal tracking-tight text-white mb-1.5 uppercase-none">Growth Engine</h2>
                    <p className="text-16px text-slate-400 font-normal uppercase-none">Visualize your expanding lineage and yielding network</p>
                </div>

                <div className="flex items-center gap-4 bg-[#22D3EE]/10 border border-[#22D3EE]/20 px-6 py-3 rounded-[5px]">
                    <div className="text-right">
                        <span className="text-[10px] text-[#22D3EE] font-bold tracking-widest uppercase block">Total Network Yield</span>
                        <span className="text-xl font-normal text-white">${totalYield.toFixed(2)}</span>
                    </div>
                    <TrendingUp className="w-6 h-6 text-[#22D3EE]" />
                </div>
            </div>

            {/* Tree Visualization */}
            <div className="surface-card min-h-[600px] p-12 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.05),transparent_70%)]" />
                
                {/* Center Node (You) */}
                <div className="relative z-10 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-4 border-[#22D3EE] shadow-[0_0_30px_rgba(34,211,238,0.3)] mb-4">
                        <Users className="w-10 h-10 text-black" />
                    </div>
                    <span className="text-[12px] font-bold text-[#22D3EE] uppercase tracking-[0.2em] mb-12">Main Sovereign</span>

                    {/* Level 1 Connections */}
                    <div className="flex gap-24 relative">
                        {nodes.map((node, i) => (
                            <div key={node.id} className="relative flex flex-col items-center">
                                {/* Connection Line */}
                                <div className="absolute -top-12 w-px h-12 bg-gradient-to-b from-[#22D3EE] to-white/20" />
                                
                                <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                                        node.health > 80 ? 'bg-[#22D3EE] border-white shadow-[0_0_20px_rgba(34,211,238,0.4)]' : 'bg-white/5 border-white/20'
                                    }`}
                                >
                                    <Zap className={`w-8 h-8 ${node.health > 80 ? 'text-black' : 'text-slate-500'}`} />
                                </motion.div>
                                
                                <div className="text-center mt-4 group relative">
                                    <p className="text-[11px] font-bold text-white tracking-wider font-mono">{node.peerId}</p>
                                    <p className="text-[13px] text-slate-400">${node.commission.toFixed(2)}</p>
                                    
                                    {/* Granny Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 p-4 surface-card border border-[#22D3EE]/30 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                        <p className="text-[12px] text-white font-normal leading-relaxed uppercase-none">
                                            This is your direct link. Their Health is <span className="text-[#22D3EE] font-bold">{node.health}%</span>. The more active blue dots you see, the more you earn every month.
                                        </p>
                                    </div>
                                </div>

                                {/* Level 2 Clusters */}
                                {node.children && (
                                    <div className="mt-12 flex gap-4">
                                        {node.children.map((child) => (
                                            <div key={child.id} className="w-3 h-3 rounded-full bg-white/20 border border-white/10" />
                                        ))}
                                        {node.children.length > 0 && (
                                            <span className="text-[10px] text-slate-500 font-bold ml-2">+{node.children.length} L2</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Sidebar/Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="surface-card p-8">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-4 border-b border-white/5 pb-2">Direct lineage (L1)</span>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-normal text-white">{nodes.length} Accounts</span>
                        <span className="text-[11px] text-[#22D3EE] font-bold">Active</span>
                    </div>
                </div>
                <div className="surface-card p-8">
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-4 border-b border-white/5 pb-2">Secondary lineage (L2)</span>
                    <div className="flex justify-between items-end">
                        <span className="text-2xl font-normal text-white">{totalL2Count} Nodes</span>
                        <span className="text-[11px] text-slate-500 font-bold">Aggregated</span>
                    </div>
                </div>
                <div className="surface-card p-8">
                    <span className="text-[10px] text-[#22D3EE] uppercase tracking-widest block mb-4 border-b border-[#22D3EE]/10 pb-2">Growth Tip</span>
                    <p className="text-[13px] text-slate-400 font-normal leading-relaxed uppercase-none">
                        Expanding your L2 network increases your passive override by 2% per node. Share your invite link to see more dots.
                    </p>
                </div>
            </div>
        </div>
    );
}
