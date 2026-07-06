import React from "react";
import { Users, Activity, Zap, TrendingUp } from "lucide-react";

interface SummaryHeaderProps {
    totalAffiliates: number;
    activeAffiliates: number;
    totalNodes: number;
    growth30d: number;
}

export const SummaryHeader = ({ totalAffiliates, activeAffiliates, totalNodes, growth30d }: SummaryHeaderProps) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
                { label: 'Total Affiliates', value: totalAffiliates, icon: Users, color: 'text-white' },
                { label: 'Active Affiliates', value: activeAffiliates, icon: Activity, color: 'text-emerald-400' },
                { label: 'Total Nodes', value: totalNodes, icon: Zap, color: 'text-[#22D3EE]' },
                { label: '30-Day Growth', value: `+${growth30d.toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-400' },
            ].map((s) => (
                <div key={s.label} className="bg-white/[0.02] border border-wnode-border-neutral shadow-[0_0_20px_rgba(255,255,255,0.05)] rounded-[5px] p-6 backdrop-blur-sm relative group overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-2.5 rounded-[5px] bg-white/[0.03] border border-wnode-border-neutral">
                            <s.icon className={`w-5 h-5 ${s.color}`} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-0.5">{s.label}</span>
                            <span className="text-2xl font-bold text-white tracking-tight">{s.value}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};
