"use client";

import React, { useState, useEffect } from "react";
import IdentityHeader from "@shared/components/IdentityHeader";
import { usePageTitle } from "../components/PageTitleContext";
import { SummaryHeader } from "./components/SummaryHeader";
import { Tree } from "./components/Tree";

export default function AffiliatesPage() {
    usePageTitle("Affiliate Network", "Hierarchical network topology and node distribution audit.");
    const [summary, setSummary] = useState({
        totalAffiliates: 0,
        activeAffiliates: 0,
        totalNodes: 0,
        growth30d: 0
    });

    useEffect(() => {
        fetch('/api/affiliates/tree')
            .then(res => res.json())
            .then(data => {
                if (data.summary) setSummary(data.summary);
            })
            .catch(err => console.error("Failed to fetch summary:", err));
    }, []);

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 relative space-y-12">
            <div className="flex items-center justify-between mt-2">
                <h1 className="text-xl font-bold text-white drop-shadow uppercase tracking-widest">
                    Affiliate Network
                </h1>
                <IdentityHeader />
            </div>

            <SummaryHeader 
                totalAffiliates={summary.totalAffiliates}
                activeAffiliates={summary.activeAffiliates}
                totalNodes={summary.totalNodes}
                growth30d={summary.growth30d}
            />

            <Tree />
        </main>
    );
}
