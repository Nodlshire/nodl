"use client";

import React from "react";
import { Search, Filter } from "lucide-react";

export default function SearchBar() {
    return (
        <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#22D3EE] transition-colors" />
                <input 
                    type="text" 
                    placeholder="Search by name, WUID" 
                    className="w-full bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] pl-10 pr-4 py-2 text-[13px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all"
                    readOnly
                />
            </div>
            <button className="p-2 bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] text-white/40 hover:text-[#22D3EE] transition-colors">
                <Filter className="w-4 h-4" />
            </button>
        </div>
    );
}
