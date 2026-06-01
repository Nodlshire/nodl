"use client";

import React, { useEffect, useState } from "react";
import { Link, CheckCircle, Clock } from 'lucide-react';

export default function PartnersPanel() {
    const [data, setData] = useState<any>(null);

    const fetchPartners = () => {
        fetch("/api/v1/admin/governance/partners")
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const handleGenerateInvite = async (slot: number) => {
        try {
            const res = await fetch("/api/v1/admin/governance/partners/invite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slot })
            });
            if (res.ok) {
                fetchPartners();
            } else {
                alert("Failed to generate invite");
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (!data) return <div className="p-6 bg-slate-900 border border-white/5 rounded-2xl animate-pulse h-32"></div>;

    return (
        <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
            <h2 className="text-white text-lg font-medium mb-6">Partner System Overview</h2>
            
            <div className="space-y-4">
                {data.partnerList?.map((p: any) => {
                    const invite = data.partnerInvites?.find((i: any) => i.founderSlot === p.slot);

                    return (
                        <div key={p.slot} className="flex items-center justify-between bg-slate-800/50 p-4 rounded-xl border border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 text-slate-300 font-mono text-sm">
                                    {p.slot}
                                </div>
                                <div>
                                    <div className="text-white font-medium">Partner Slot {p.slot}</div>
                                    <div className="text-sm text-slate-400">
                                        {p.status === "filled" ? (
                                            <span className="text-emerald-400 font-mono">{p.wuid}</span>
                                        ) : (
                                            <span className="text-slate-500">Unassigned</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                {p.status === "filled" ? (
                                    <div className="flex items-center gap-2 text-emerald-400 text-sm px-3 py-1 bg-emerald-400/10 rounded-full">
                                        <CheckCircle className="w-4 h-4" />
                                        Active
                                    </div>
                                ) : invite ? (
                                    <div className="flex items-center gap-2 text-amber-400 text-sm px-3 py-1 bg-amber-400/10 rounded-full">
                                        <Clock className="w-4 h-4" />
                                        Invite Pending
                                    </div>
                                ) : (
                                    <button 
                                        onClick={() => handleGenerateInvite(p.slot)}
                                        className="flex items-center gap-2 text-blue-400 text-sm px-3 py-1.5 bg-blue-400/10 hover:bg-blue-400/20 rounded-full transition-colors"
                                    >
                                        <Link className="w-4 h-4" />
                                        Generate Invite
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
