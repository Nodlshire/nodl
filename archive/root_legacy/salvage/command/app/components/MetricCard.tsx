import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon: LucideIcon;
    statusColor: string;
    sub?: string;
    pulse?: boolean;
    larger?: boolean;
}

export default function MetricCard({
    label,
    value,
    unit,
    icon: Icon,
    statusColor,
    sub,
    pulse,
    larger
}: MetricCardProps) {
    return (
        <div className="bg-white/[0.02] border border-white/10 p-4 rounded-[5px] flex flex-col justify-between relative overflow-hidden group hover:bg-white/[0.04] transition-all backdrop-blur-sm">
            <div className="flex items-center justify-between">
                <span className="ds-sub font-bold">{label}</span>
                <Icon className="w-4 h-4 text-slate-600 group-hover:text-[#22D3EE] transition-colors opacity-40" />
            </div>
            <div className="flex items-baseline gap-2 mt-2">
                <span className={`${larger ? 'text-2xl' : 'text-xl'} font-normal tracking-tighter text-white ${pulse ? 'animate-pulse ' + statusColor : statusColor}`}>
                    {value}
                </span>
                {unit && (
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{unit}</span>
                )}
            </div>
            {sub && (
                <div className="mt-2 flex items-center gap-1.5 border-t border-white/5 pt-2">
                    <span className="text-[9px] text-[#b0bac3] font-bold uppercase tracking-widest">{sub}</span>
                </div>
            )}
        </div>
    );
}
