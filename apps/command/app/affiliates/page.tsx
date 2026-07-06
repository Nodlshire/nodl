"use client";

import React, { useState, useCallback } from "react";
import { usePageTitle } from "../components/PageTitleContext";
import GenesisList from "./components/GenesisList";
import AcquisitionTree from "./components/AcquisitionTree";
import DetailPanel from "./components/DetailPanel";
import SearchBar from "./components/SearchBar";
import InviteModal from "../components/modals/InviteModal";
import { AffiliateData, emptyAffiliateData } from "./types";

export default function AffiliatesPage() {
    usePageTitle("Affiliate Network", "");
    const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
    const [affiliateData, setAffiliateData] = useState<AffiliateData>(emptyAffiliateData);
    const [inviteModalOpen, setInviteModalOpen] = useState(false);
    const [inviteSlot, setInviteSlot] = useState<any>(null);

    // Placeholder for future CRM/SOT integration
    React.useEffect(() => {
        if (!selectedAffiliate) {
            setAffiliateData(emptyAffiliateData);
            return;
        }

        // When CRM is ready, replace with real API call:
        // fetch(`/api/crm/affiliate/${selectedAffiliate.wuid}`)
        //   .then(res => res.json())
        //   .then(setAffiliateData);
        
        setAffiliateData(emptyAffiliateData);
        console.log("CRM SOT Hook: Waiting for integration for node", selectedAffiliate.wuid);
    }, [selectedAffiliate]);

    // Selection Handlers
    const handleRowClick = useCallback((node: any) => {
        const normalizedNode = {
            ...node,
            wuid: node.wuid || node.nodlrId
        };
        setSelectedAffiliate(normalizedNode);
    }, []);

    const handleL1Click = useCallback((e: React.MouseEvent, row: any) => {
        e.stopPropagation();
        console.log("L1 List Hook:", row.wuid || row.nodlrId);
    }, []);

    // Invite Handlers
    const handleInvite = useCallback((slot: any) => {
        setInviteSlot(slot);
        setInviteModalOpen(true);
    }, []);

    const handleSendInvite = async (email: string) => {
        const res = await fetch("/api/invite/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slot: inviteSlot, email }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || "Failed to issue invitation.");
        }
        
        console.log("Invite issued successfully to:", email);
    };

    const selectedId = selectedAffiliate?.wuid;

    return (
        <main className="flex-1 px-8 pt-3 pb-20 overflow-y-auto space-y-6 custom-scrollbar relative">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#22D3EE]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <SearchBar />
            </div>

            {/* Section 4: Genesis Layer */}
            <GenesisList 
                onRowClick={handleRowClick}
                onL1Click={handleL1Click}
                onInvite={handleInvite}
                selectedWuid={selectedId}
            />

            {/* Section 6: Acquisition Topology */}
            <AcquisitionTree 
                onNodeClick={handleRowClick} 
                selectedNodeId={selectedId}
            />

            {/* Section 7: Detail Panel Shell */}
            <DetailPanel 
                isOpen={!!selectedAffiliate} 
                onClose={() => setSelectedAffiliate(null)} 
                node={selectedAffiliate} 
                affiliateData={affiliateData}
            />

            {/* Invitation Modal */}
            <InviteModal 
                open={inviteModalOpen}
                onClose={() => setInviteModalOpen(false)}
                slot={inviteSlot}
                onSend={handleSendInvite}
            />
        </main>
    );
}
