'use client';

import React, { useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  colorClass?: string;
  subValue?: string;
  tooltip?: string;
}

export default function MetricCard({ 
  label, 
  value, 
  icon: Icon, 
  colorClass = "text-white", 
  subValue,
  tooltip
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div 
      className="relative w-full bg-[#09090b] border border-white/10 backdrop-blur-xl shadow-2xl rounded-xl p-6 flex flex-col gap-1 group truncate transition-all"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {tooltip && showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-[999] pointer-events-none">
          <div className="bg-neutral-900 border border-white/10 text-[11px] text-slate-300 px-3 py-2 rounded-md shadow-[0_8px_32px_rgba(0,0,0,0.6)] whitespace-normal max-w-full text-center leading-relaxed">
            {tooltip}
          </div>
          <div className="w-2 h-2 bg-neutral-900 border-b border-r border-white/10 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1" />
        </div>
      )}
      <span className="uppercase tracking-wider text-xs text-neutral-400 font-sans">
        {label}
      </span>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className={`font-mono text-xl tracking-tight text-white`}>{value}</span>
          {subValue && (
            <span className="text-[14px] text-[#3B82F6] font-normal font-sans tracking-widest mt-0.5">
              {subValue}
            </span>
          )}
        </div>
        <Icon className="w-4 h-4 text-[#3B82F6] opacity-40 group-hover:opacity-100 transition-opacity" />
      </div>
    </div>
  );
}
