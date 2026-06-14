"use client";

import React, { useState } from "react";
import { usePageTitle } from "../../components/PageTitleContext";
import { Terminal } from 'lucide-react';
import OverviewPanel from "./components/OverviewPanel";
import CommunityPanel from "./components/CommunityPanel";
import ProposalsPanel from "./components/ProposalsPanel";
import VotingPanel from "./components/VotingPanel";
import DiscordPanel from "./components/DiscordPanel";
import OperationalPanel from "./components/OperationalPanel";
import TransparencyPanel from "./components/TransparencyPanel";
import DocumentsPanel from "./components/DocumentsPanel";


export default function GovernancePage() {
    console.log("[GOVERNANCE_DEBUG] Page rendered");
    usePageTitle("Governance");
    
    const [isSlideOutOpen, setIsSlideOutOpen] = useState(false);
    const [slideOutTitle, setSlideOutTitle] = useState("");
    const [slideOutData, setSlideOutData] = useState<any>(null);

    const openSlideOut = (title: string, data?: any) => {
        setSlideOutTitle(title);
        setSlideOutData(data);
        setIsSlideOutOpen(true);
    };

    const handleSectionClick = (id: string) => {
        const el = document.getElementById(id);
        if (!el) return;
        
        const container = el.closest('.overflow-y-auto');
        const header = document.querySelector('header');
        const headerHeight = header ? (header as HTMLElement).offsetHeight : 80;
        
        if (container) {
          const top = (el as HTMLElement).offsetTop - headerHeight - 20;
          container.scrollTo({ top, behavior: "smooth" });
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 gap-8">
                <section id="overview">
                    <OverviewPanel 
                        onCrmClick={(name, wuid) => openSlideOut(`CRM - ${name}`, { name, wuid })}
                        onSectionClick={handleSectionClick}
                    />
                </section>

                <section id="community">
                    <CommunityPanel />
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section id="proposals" onClick={() => openSlideOut("Proposal Audit")} className="cursor-pointer">
                        <ProposalsPanel />
                    </section>
                    <section id="voting" onClick={() => openSlideOut("Voting terminal")} className="cursor-pointer">
                        <VotingPanel />
                    </section>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section id="discord" onClick={() => openSlideOut("Discord Context")} className="cursor-pointer">
                        <DiscordPanel />
                    </section>
                    <section id="operational" onClick={() => openSlideOut("Operational Intelligence")} className="cursor-pointer">
                        <OperationalPanel />
                    </section>
                </div>

                <section id="transparency" onClick={() => openSlideOut("Transparency Ledger")} className="cursor-pointer">
                    <TransparencyPanel />
                </section>

                <section id="documents" onClick={() => openSlideOut("Protocol Documents")} className="cursor-pointer">
                    <DocumentsPanel />
                </section>
            </div>

            <footer className="mt-20 flex flex-col items-center gap-2 pb-12 border-t border-white/5 pt-12">
                <div className="flex items-center gap-2 text-slate-500">
                    <Terminal className="w-4 h-4 text-slate-600" />
                    <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
                        Nodlr Governance — Executive Control v1.0
                    </span>
                </div>
            </footer>
        </div>
    );
}
