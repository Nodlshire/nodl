"use client";

import React from "react";
import { Shield, Users, Activity, PowerOff } from "lucide-react";

export default function Enunciators() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-[3px]">
                <Shield className="w-3 h-3 text-amber-500" />
                <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest">Founder</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-[3px]">
                <Users className="w-3 h-3 text-[#22D3EE]" />
                <span className="text-[9px] text-[#22D3EE] font-bold uppercase tracking-widest">Partner</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-[3px]">
                <Activity className="w-3 h-3 text-emerald-500" />
                <span className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">Active</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-wnode-border-neutral rounded-[3px]">
                <PowerOff className="w-3 h-3 text-white/40" />
                <span className="text-[9px] text-white/40 font-bold uppercase tracking-widest">Inactive</span>
            </div>
        </div>
    );
}
