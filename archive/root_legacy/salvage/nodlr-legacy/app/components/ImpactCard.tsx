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
        <div className={`card-sovereign p-6 transition-all duration-500 ${isActive ? 'border-emerald/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : ''}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Leaf className={`w-5 h-5 ${isActive ? 'text-emerald animate-bounce' : 'text-slate-500'}`} />
                    <span className="text-[14px] font-normal text-white uppercase-none">Green Mesh Impact</span>
                </div>
                {isActive && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald/10 text-emerald text-[10px] uppercase tracking-wider animate-pulse">
                        Active Saving
                    </span>
                )}
            </div>

            <div className="space-y-6">
                <div>
                    <div className="text-[32px] font-normal text-white mb-1">
                        {carbonSaved.toFixed(2)} <span className="text-[16px] text-slate-500">kg CO₂</span>
                    </div>
                    <p className="text-[13px] text-slate-400">
                        Total carbon emissions prevented by using decentralized compute.
                    </p>
                    <p className="text-[10px] text-slate-600 mt-1 uppercase tracking-tight">
                        Source: 120W Cloud vs 12W Nodl avg.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-white/5 rounded-[5px] p-4 space-y-2">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Car className="w-4 h-4" />
                            <span className="text-[11px] uppercase tracking-wider">Car KM</span>
                        </div>
                        <div className="text-[18px] text-white">{kmAvoided.toFixed(1)} km</div>
                    </div>
                    <div className="bg-white/5 rounded-[5px] p-4 space-y-2">
                        <div className="flex items-center gap-2 text-slate-500">
                            <TreePine className="w-4 h-4" />
                            <span className="text-[11px] uppercase tracking-wider">Tree Days</span>
                        </div>
                        <div className="text-[18px] text-white">{treeDays.toFixed(0)} days</div>
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
