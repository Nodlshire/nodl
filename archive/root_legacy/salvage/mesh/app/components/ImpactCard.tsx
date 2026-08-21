"use client";

import { Leaf, Car, TreePine } from "lucide-react";

interface ImpactCardProps {
    carbonSaved: number;
    kmAvoided: number;
    treeDays: number;
    isActive?: boolean;
}

export default function ImpactCard({ carbonSaved, kmAvoided, treeDays, isActive }: ImpactCardProps) {
    return (
        <div className={`border border-white/5 bg-black p-6 transition-all duration-500 ${isActive ? 'border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,242,255,0.1)]' : ''}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Leaf className={`w-4 h-4 ${isActive ? 'text-cyber-cyan animate-pulse' : 'text-slate-600'}`} />
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Green Mesh Impact</span>
                </div>
                {isActive && (
                    <span className="px-2 py-0.5 bg-cyber-cyan/10 text-cyber-cyan text-[8px] font-black uppercase tracking-[0.3em]">
                        Active Saving
                    </span>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <div className="text-4xl font-black text-white mb-2 tracking-tighter">
                        {carbonSaved.toFixed(2)} <span className="text-sm font-bold text-slate-500 tracking-widest uppercase">kg CO₂</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                        Total carbon emissions prevented by using decentralized compute.
                    </p>
                    <p className="text-[9px] text-slate-600 mt-2 uppercase tracking-widest font-bold">
                        Source: 120W Cloud vs 12W Nodl avg.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-white/5 border border-white/5 rounded-none p-4 space-y-2">
                        <div className="flex items-center gap-2 text-slate-600">
                            <Car className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Car KM</span>
                        </div>
                        <div className="text-xl font-black text-white tracking-tighter">{kmAvoided.toFixed(1)} KM</div>
                    </div>
                    <div className="bg-white/5 border border-white/5 rounded-none p-4 space-y-2">
                        <div className="flex items-center gap-2 text-slate-600">
                            <TreePine className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">Tree Days</span>
                        </div>
                        <div className="text-xl font-black text-white tracking-tighter">{treeDays.toFixed(0)} DAYS</div>
                    </div>
                </div>
            </div>

            {isActive && (
                <div className="mt-6 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-full animate-green-mesh" />
                </div>
            )}
        </div>
    );
}
