import React from 'react';

export const CanonicalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <main className="min-h-screen w-full bg-black text-white p-4 sm:p-8 flex flex-col gap-8 overflow-x-hidden">
        {children}
    </main>
);

export const CanonicalMetricGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {children}
    </div>
);

export const CanonicalCard: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = '' }) => (
    <div className={`bg-[#09090b]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl rounded-xl p-5 ${className}`}>
        {children}
    </div>
);

export const CanonicalStat: React.FC<{ label: string, value: string | number, subtext?: string, icon?: React.ReactNode }> = ({ label, value, subtext, icon }) => (
    <CanonicalCard className="flex flex-col justify-between h-full">
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 flex items-center justify-between">
            {label}
            {icon}
        </span>
        <div className="mt-2">
            <span className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tight block drop-shadow-[0_2px_10px_rgba(255,255,255,0.15)]">{value}</span>
            {subtext && <span className="text-[10px] text-neutral-400 uppercase tracking-widest block mt-1">{subtext}</span>}
        </div>
    </CanonicalCard>
);
