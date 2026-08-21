'use client';

import React from 'react';
import { useAuth } from './AuthProvider';
import { Basket } from './Basket';
import { useBilling } from './BillingProvider';
import { TopUpDialogue } from './TopUpDialogue';
import { Leaf, Plus, Wallet } from 'lucide-react';

export function Header() {
    const { profile } = useAuth();
    const { balance, setIsTopUpOpen } = useBilling();

    return (
        <header className="h-16 border-b border-white/5 bg-black flex items-center justify-between px-8 shrink-0 relative z-30 font-sans">
            {/* Logo Left */}
            {/* Logo Left */}
            <div className="flex items-center gap-4">
                <img 
                    src="https://wnode.one/wp-content/uploads/2025/05/nodl-medium.webp" 
                    alt="nodl logo" 
                    className="h-8 w-auto object-contain brightness-110"
                />
                <div className="h-4 w-[1px] bg-white/10 mx-2 hidden md:block" />
                <span className="font-bold text-[10px] tracking-[0.4em] text-slate-500 hidden md:block">Nodl Mesh System</span>
            </div>

            {/* Identity Right */}
            <div className="flex items-center gap-4">
                {/* Account Balance Indicator */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white rounded-md group hover:bg-white/10 transition-all">
                    <Wallet className="w-2.5 h-2.5 text-white group-hover:text-mesh-emerald transition-colors" />
                    <div className="flex flex-col">
                        <span className="text-[7px] font-black text-white/70 tracking-widest leading-none mb-0.5">Account Balance</span>
                        <div className="flex items-center gap-2">
                            <span className="text-[9px] font-bold text-white tracking-tight leading-none">
                                ${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            <button 
                                className="w-3.5 h-3.5 bg-white text-black hover:bg-mesh-emerald hover:text-black rounded-sm flex items-center justify-center transition-all"
                                title="Quick Top-up"
                                onClick={() => setIsTopUpOpen(true)}
                            >
                                <Plus className="w-2.5 h-2.5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Carbon Saved Indicator */}
                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white rounded-md">
                    <Leaf className="w-2.5 h-2.5 text-white" />
                    <div className="flex flex-col">
                        <span className="text-[7px] font-black text-white/70 tracking-widest leading-none mb-0.5">Total Impact</span>
                        <span className="text-[9px] font-bold text-white tracking-tight leading-none">14.4 kg CO2 Saved</span>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#00f2ff]/5 border border-[#00f2ff]/10 rounded-md">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00f2ff] shadow-[0_0_8px_rgba(0,242,255,0.4)] animate-pulse" />
                    <span className="text-[9px] font-bold text-[#00f2ff] tracking-widest leading-none">Mesh Online</span>
                </div>

                <Basket />

                <div className="h-6 w-[1px] bg-white/10 mx-2" />

                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <span className="text-[11px] font-bold text-white tracking-tight">{profile?.full_name || 'Stephen Soos'}</span>
                        <span className="text-[9px] text-slate-500 tracking-widest font-normal leading-none mt-0.5">Acc# {profile?.id || '100001-0426-01-AA'}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
                        <img 
                            src={profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Stephen"} 
                            alt="avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            <TopUpDialogue />
        </header>
    );
}
