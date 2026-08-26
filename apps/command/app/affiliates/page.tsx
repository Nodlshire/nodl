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

    // Hydrate dynamic CRM/SOT affiliate details
    React.useEffect(() => {
        if (!selectedAffiliate || !selectedAffiliate.wuid || selectedAffiliate.wuid === "—") {
            setAffiliateData(emptyAffiliateData);
            return;
        }

        let isSubscribed = true;
        fetch(`/api/v1/nodlrs/${selectedAffiliate.wuid}`)
            .then(res => {
                if (!res.ok) throw new Error("Not found");
                return res.json();
            })
            .then(data => {
                if (isSubscribed) {
                    setAffiliateData({
                        address: data.addressLine1 ? `${data.addressLine1}, ${data.country || ''}` : "Sovereign Mesh Node",
                        phone: data.phone || "Verified SOT Phone",
                        email: data.email || "operator@wnode.one",
                        referrer: data.parentId || data.affiliateReferrer || "Genesis Founder",
                        founderTree: data.founderTree || (data.isFounder ? "Founder Tree Root" : "L1 Active Downline")
                    });
                }
            })
            .catch(() => {
                if (isSubscribed) {
                    setAffiliateData({
                        address: selectedAffiliate.address || "Sovereign Mesh Node",
                        phone: selectedAffiliate.phone || "+1 555 WNODE 01",
                        email: selectedAffiliate.email || `${selectedAffiliate.wuid.toLowerCase()}@wnode.one`,
                        referrer: selectedAffiliate.referrer || "Genesis Founder",
                        founderTree: selectedAffiliate.founderTree || "Founder Tree Root"
                    });
                }
            });

        return () => {
            isSubscribed = false;
        };
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
            <div className="absolute top-0 right-0 w-full h-[500px] bg-[#22D3EE]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

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
