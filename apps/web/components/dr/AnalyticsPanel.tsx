"use client";

import React, { useState, useEffect } from "react";

export default function AnalyticsPanel() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/dr/analytics')
            .then(res => res.json())
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-blue-400 text-xs uppercase tracking-widest animate-pulse font-bold p-6">Loading Analytics...</div>;
    if (!data) return <div className="text-red-500 text-xs uppercase p-6">Failed to load analytics</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold border-b border-white/10 pb-4">Data Room Analytics</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Total Invites</p>
                    <p className="text-3xl font-black">{data.metrics.totalInvites}</p>
                </div>
                <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Active Invitees</p>
                    <p className="text-3xl font-black text-green-500">{data.metrics.activeInvitees}</p>
                </div>
                <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">7d Logins</p>
                    <p className="text-3xl font-black">{data.metrics.logins7d}</p>
                </div>
                <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Doc Views</p>
                    <p className="text-3xl font-black">{data.metrics.docViews}</p>
                </div>
                <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Downloads</p>
                    <p className="text-3xl font-black">{data.metrics.downloads}</p>
                </div>
                <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Link Opens</p>
                    <p className="text-3xl font-black">{data.metrics.linkOpens}</p>
                </div>
                <div className="bg-[#080808] border border-white/10 p-4 rounded-xl">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Signed</p>
                    <p className="text-3xl font-black text-blue-500">{data.metrics.agreementsSigned}</p>
                </div>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 border-b border-white/10 pb-2 mt-8">Conversion Funnel</h3>
            <div className="bg-[#080808] border border-white/10 p-6 rounded-xl flex items-center justify-between gap-2 overflow-x-auto">
                <FunnelStep label="Invited" value={data.funnel.invited} />
                <Arrow />
                <FunnelStep label="Opened" value={data.funnel.opened} />
                <Arrow />
                <FunnelStep label="Verified" value={data.funnel.otpVerified} />
                <Arrow />
                <FunnelStep label="NDA" value={data.funnel.ndaAccepted} />
                <Arrow />
                <FunnelStep label="Active" value={data.funnel.active} />
                <Arrow />
                <FunnelStep label="Signed" value={data.funnel.signed} highlight />
            </div>
        </div>
    );
}

const FunnelStep = ({ label, value, highlight }: { label: string, value: number, highlight?: boolean }) => (
    <div className={`flex flex-col items-center justify-center p-4 rounded-lg border ${highlight ? 'border-blue-500/50 bg-blue-600/10' : 'border-white/10 bg-white/5'} min-w-[100px]`}>
        <p className="text-2xl font-black mb-1">{value}</p>
        <p className={`text-[10px] uppercase tracking-widest ${highlight ? 'text-blue-400' : 'text-slate-400'}`}>{label}</p>
    </div>
);

const Arrow = () => <span className="text-slate-600 font-bold">→</span>;
