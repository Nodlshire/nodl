"use client";

import React, { useEffect, useState } from "react";

export default function GovernanceSummaryPanel() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        fetch("/api/v1/admin/governance/summary")
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) return <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl animate-pulse h-32"></div>;

    return (
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <h2 className="text-white text-lg font-medium mb-6">Governance Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl">
                    <div className="text-sm text-slate-400 mb-1">Total Founders</div>
                    <div className="text-2xl text-white font-medium">{data.totalFounders}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl">
                    <div className="text-sm text-slate-400 mb-1">Total Partners</div>
                    <div className="text-2xl text-white font-medium">{data.totalPartners}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl">
                    <div className="text-sm text-slate-400 mb-1">Total Affiliates</div>
                    <div className="text-2xl text-white font-medium">{data.totalAffiliates}</div>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl">
                    <div className="text-sm text-slate-400 mb-1">Round Robin</div>
                    <div className="text-2xl text-white font-medium">Slot {data.roundRobinPosition}</div>
                </div>
            </div>
        </div>
    );
}
