import React, { useState, useEffect } from "react";
import { Layers, Search } from "lucide-react";
import { TreeNode, AffiliateNode } from "./TreeNode";

export const Tree = () => {
    const [founders, setFounders] = useState<AffiliateNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchTree = async () => {
        try {
            const res = await fetch('/api/affiliates/tree');
            if (res.ok) {
                const data = await res.json();
                setFounders(data.founders || []);
            }
        } catch (err) {
            console.error("Failed to fetch founders:", err);
        } finally {
            setLoading(false);
        }
    };

    const loadChildren = async (id: string): Promise<AffiliateNode[]> => {
        const res = await fetch(`/api/affiliates/children?parent=${id}`);
        if (res.ok) {
            return await res.json();
        }
        return [];
    };

    useEffect(() => {
        fetchTree();
    }, []);

    const filteredFounders = founders.filter(f => 
        f.nodlrId.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                    <Layers className="w-4 h-4 text-slate-500" />
                    <span className="text-[12px] text-slate-400 uppercase tracking-widest font-bold">Network Topology</span>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                        type="text" 
                        placeholder="Search identities..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="bg-black/40 border border-white/10 rounded-[5px] pl-10 pr-4 py-1.5 text-[12px] text-white focus:outline-none focus:border-[#22D3EE]/50 w-48 transition-all font-mono"
                    />
                </div>
            </div>

            <div className="space-y-2">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-[#22D3EE]/20 border-t-[#22D3EE] rounded-full animate-spin" />
                    </div>
                ) : filteredFounders.length > 0 ? (
                    filteredFounders.map(node => (
                        <TreeNode key={node.nodlrId} node={node} loadChildren={loadChildren} />
                    ))
                ) : (
                    <div className="py-20 text-center">
                        <span className="text-[13px] text-slate-600 font-sans italic">No identity nodes found in the current projection.</span>
                    </div>
                )}
            </div>
        </div>
    );
};
