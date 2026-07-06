import React, { useState } from "react";
import { ChevronRight, ChevronDown, Zap, Users, Network, Shield } from "lucide-react";

export interface AffiliateNode {
    nodlrId: string;
    wuid?: string;
    nodeCount: number;
    l1Count: number;
    l2Count: number;
    active: boolean;
    isFounder?: boolean;
    founderIndex?: number;
    children: AffiliateNode[];
}

interface TreeNodeProps {
    node: AffiliateNode;
    expanded: boolean;
    onToggle: (wuid: string) => void;
    onSelect: (node: AffiliateNode) => void;
    onOpen: (node: AffiliateNode) => void;
    selectedNodeId?: string;
    loadChildren: (id: string) => Promise<AffiliateNode[]>;
    expandedNodes: Record<string, boolean>;
}

export const TreeNode = ({ 
    node, 
    expanded, 
    onToggle, 
    onSelect, 
    onOpen, 
    selectedNodeId,
    loadChildren,
    expandedNodes
}: TreeNodeProps) => {
    const [children, setChildren] = useState<AffiliateNode[]>(node.children || []);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoaded, setHasLoaded] = useState(node.children && node.children.length > 0);

    const selected = selectedNodeId === (node.wuid || node.nodlrId);

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        
        // Single-click: Select + Toggle
        onSelect(node);
        
        const wuid = node.wuid || node.nodlrId;
        
        // If expanding and not loaded, fetch children
        if (!expanded && !hasLoaded) {
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
        
        onToggle(wuid);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Double-click: Open Slide-out
        onOpen(node);
    };

    return (
        <div className="flex flex-col">
            <div 
                className={`
                    group flex items-center gap-4 px-4 py-3
                    rounded-[4px] transition-all cursor-pointer
                    relative z-10
                    ${node.isFounder
                      ? selected
                        ? 'text-amber-300 border-2 border-amber-300 border-l-2 border-l-amber-300 bg-white/10 outline outline-2 outline-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.1)]'
                        : 'text-amber-300 border border-amber-300 border-l-2 border-l-amber-300/40 hover:border-amber-300 hover:border-l-amber-300 hover:outline hover:outline-1 hover:outline-amber-300 hover:bg-white/5'
                      : selected
                        ? 'text-[#22D3EE] border-2 border-[#22D3EE] border-l-2 border-l-[#22D3EE] bg-white/10 outline outline-2 outline-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.1)]'
                        : 'text-[#22D3EE] border border-[#22D3EE] border-l-2 border-l-[#22D3EE]/40 hover:border-[#22D3EE] hover:border-l-[#22D3EE] hover:outline hover:outline-1 hover:outline-[#22D3EE] hover:bg-white/5'
                    }
                `}
                onClick={handleClick}
                onDoubleClick={handleDoubleClick}
            >
                <div className="flex items-center gap-3 min-w-[280px]">
                    {isLoading ? (
                        <div className="w-4 h-4 border border-[#22D3EE]/20 border-t-[#22D3EE] rounded-full animate-spin" />
                    ) : (
                        <div className="w-4 h-4 flex items-center justify-center">
                            {expanded ? (
                                <ChevronDown className="w-4 h-4 text-white/40" />
                            ) : (
                                <ChevronRight className="w-4 h-4 text-[#22D3EE]" />
                            )}
                        </div>
                    )}
                    
                    <div 
                        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-[3px] border transition-colors ${node.isFounder ? 'bg-amber-300/10 border-amber-300/40 text-amber-300 group-hover:bg-amber-300/20' : 'bg-[#22D3EE]/10 border-[#22D3EE]/40 text-[#22D3EE] group-hover:bg-[#22D3EE]/20'}`}
                    >
                        {node.isFounder ? (
                            <Shield className="w-2.5 h-2.5" />
                        ) : (
                            <Users className="w-2.5 h-2.5" />
                        )}
                        <span className="text-[9px] font-bold uppercase tracking-widest whitespace-nowrap">
                            {node.isFounder ? `Founder #${node.founderIndex}` : 'Partner'}
                        </span>
                    </div>

                    <span className="font-mono text-[13px] text-white/80 group-hover:text-white transition-colors tracking-tighter">
                        {node.nodlrId}
                    </span>
                </div>

                <div className="flex items-center gap-6 min-w-[360px]">
                    <div className="flex items-center gap-2">
                        <Zap className="w-3 text-[#22D3EE]/70" />
                        <span className="text-[11px] text-white/60 font-mono">
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

                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 border border-wnode-border-neutral">
                    <div className={`w-1.5 h-1.5 rounded-full ${node.active ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-slate-700'}`} />
                    <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${node.active ? 'text-emerald-400' : 'text-white/40'}`}>
                        {node.active ? 'active' : 'inactive'}
                    </span>
                </div>
            </div>

            {expanded && (
                <div className="ml-8 mt-1 pl-4 border-l border-wnode-border-neutral space-y-1">
                    {children && children.length > 0 ? (
                        children.map((child) => (
                            <TreeNode 
                                key={child.nodlrId} 
                                node={child} 
                                expanded={expandedNodes[child.wuid || child.nodlrId] ?? false}
                                onToggle={onToggle}
                                onSelect={onSelect}
                                onOpen={onOpen}
                                selectedNodeId={selectedNodeId}
                                loadChildren={loadChildren}
                                expandedNodes={expandedNodes}
                            />
                        ))
                    ) : hasLoaded && !isLoading ? (
                        <div className="py-2 px-4 text-[11px] text-white/40 italic">No descendants found.</div>
                    ) : null}
                </div>
            )}
        </div>
    );
};
