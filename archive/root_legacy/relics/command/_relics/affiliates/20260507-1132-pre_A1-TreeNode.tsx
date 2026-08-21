import React, { useState } from "react";
import { ChevronRight, ChevronDown, Zap, Users, Network } from "lucide-react";

export interface AffiliateNode {
    nodlrId: string;
    nodeCount: number;
    l1Count: number;
    l2Count: number;
    active: boolean;
    children: AffiliateNode[];
}

interface TreeNodeProps {
    node: AffiliateNode;
    loadChildren: (id: string) => Promise<AffiliateNode[]>;
}

export const TreeNode = ({ node, loadChildren }: TreeNodeProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [children, setChildren] = useState<AffiliateNode[]>(node.children || []);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(node.children && node.children.length > 0);

    const toggleExpand = async () => {
        if (!isExpanded && !hasLoaded) {
            setIsLoading(true);
            try {
                const fetchedChildren = await loadChildren(node.nodlrId);
                setChildren(fetchedChildren);
                setHasLoaded(true);
            } catch (err) {
                console.error("Failed to load children:", err);
            } finally {
                setIsLoading(false);
            }
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="flex flex-col">
            <div 
                className="flex items-center gap-4 px-4 py-3 rounded-[5px] transition-all group cursor-pointer hover:bg-white/[0.04]"
                onClick={toggleExpand}
            >
                <div className="flex items-center gap-3 min-w-[280px]">
                    {isLoading ? (
                        <div className="w-4 h-4 border border-[#22D3EE]/20 border-t-[#22D3EE] rounded-full animate-spin" />
                    ) : (
                        <div className="w-4 h-4 flex items-center justify-center">
                            {isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-[#22D3EE]" />
                            )}
                        </div>
                    )}
                    <span className="font-mono text-[13px] text-slate-300 group-hover:text-white transition-colors tracking-tighter">
                        {node.nodlrId}
                    </span>
                </div>

                <div className="flex items-center gap-6 min-w-[360px]">
                    <div className="flex items-center gap-2">
                        <Zap className="w-3 link-cyan-glow" />
                        <span className="text-[11px] text-slate-400 font-mono">
                            {node.nodeCount} <span className="opacity-40 uppercase text-[9px] font-bold">Nodes</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Users className="w-3 text-blue-400/70" />
                        <span className="text-[11px] text-blue-300 font-mono">
                            {node.l1Count} <span className="opacity-40 uppercase text-[9px] font-bold">L1</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Network className="w-3 text-purple-400/70" />
                        <span className="text-[11px] text-purple-300 font-mono">
                            {node.l2Count} <span className="opacity-40 uppercase text-[9px] font-bold">L2</span>
                        </span>
                    </div>
                </div>

                <div className="flex-1" />

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-white/5">
                    <div className={`w-1.5 h-1.5 rounded-full ${node.active ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-slate-700'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${node.active ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {node.active ? 'active' : 'inactive'}
                    </span>
                </div>
            </div>

            {isExpanded && (
                <div className="ml-8 mt-1 pl-4 border-l border-white/5 space-y-1">
                    {children && children.length > 0 ? (
                        children.map((child) => (
                            <TreeNode key={child.nodlrId} node={child} loadChildren={loadChildren} />
                        ))
                    ) : hasLoaded && !isLoading ? (
                        <div className="py-2 px-4 text-[11px] text-slate-600 italic">No descendants found.</div>
                    ) : null}
                </div>
            )}
        </div>
    );
};
