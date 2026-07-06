"use client";

import React, { useState, useEffect } from "react";
import { TreeNode, AffiliateNode } from "./TreeNode";

interface TreeProps {
    onNodeClick?: (node: AffiliateNode) => void;
    selectedNodeId?: string;
}

export const Tree = ({ onNodeClick, selectedNodeId }: TreeProps) => {
    const [rootNodes, setRootNodes] = useState<AffiliateNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

    const toggleNode = (wuid: string) => {
        setExpandedNodes(prev => ({
            ...prev,
            [wuid]: !prev[wuid]
        }));
    };

    useEffect(() => {
        const fetchRoots = async () => {
            try {
                const response = await fetch("/api/v1/affiliates/tree");
                if (!response.ok) throw new Error("Failed to fetch tree roots");
                const data = await response.json();
                
                // Map backend founders to rootNodes
                // We ensure each node has a 'wuid' for interaction consistency
                const mappedRoots = (data.founders || []).map((n: any) => ({
                    ...n,
                    wuid: n.nodlrId // nodlrId is the canonical WUID in this context
                }));
                
                setRootNodes(mappedRoots);
            } catch (error) {
                console.error("Tree initialization error:", error);
                setRootNodes([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRoots();
    }, []);

    const loadChildren = async (id: string): Promise<AffiliateNode[]> => {
        try {
            const response = await fetch(`/api/v1/affiliates/children?parent=${id}`);
            if (!response.ok) throw new Error("Failed to fetch children");
            const data = await response.json();
            
            return (data || []).map((n: any) => ({
                ...n,
                wuid: n.nodlrId
            }));
        } catch (error) {
            console.error("Lazy load error:", error);
            return [];
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center gap-3 p-4">
                <div className="w-4 h-4 border-2 border-[#22D3EE]/20 border-t-[#22D3EE] rounded-full animate-spin" />
                <span className="text-[12px] text-white/40 font-mono">Initializing topology mapping...</span>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            {rootNodes.map((node) => (
                <TreeNode 
                    key={node.nodlrId} 
                    node={node} 
                    expanded={expandedNodes[node.wuid || node.nodlrId] ?? false}
                    onToggle={toggleNode}
                    onSelect={(n) => {
                        // Visual selection only for now, or update parent if needed
                        console.log("Single-click Select:", n.wuid || n.nodlrId);
                    }}
                    onOpen={(n) => {
                        // Double-click: Open Slide-out
                        onNodeClick?.(n);
                    }}
                    selectedNodeId={selectedNodeId}
                    loadChildren={loadChildren}
                    expandedNodes={expandedNodes}
                />
            ))}
        </div>
    );
};
