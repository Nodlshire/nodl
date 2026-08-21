"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, CreditCard, Clock, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { usePageTitle } from "../components/PageTitleContext";

interface StripeInfo {
    accountId: string;
    detailsSubmitted: boolean;
    payoutsEnabled: boolean;
    chargesEnabled: boolean;
    transferStatus: string;
    defaultCurrency: string;
    country: string;
}

interface AccountInfo {
    id: string;
    email: string;
    stripeConnectId: string;
    payoutFrequency: string;
    stripeInfo: StripeInfo;
}

export default function FinancesPage() {
    usePageTitle("Revenue Distribution", "Platform earnings and automated payout management.");
    const [account, setAccount] = useState<AccountInfo | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<null | string>(null);
    const [loading, setLoading] = useState(true);

    const MOCK_USER_ID = "100001-0426-01-AA";

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.wnode.one';
                const res = await fetch(`${apiBase}/account/${MOCK_USER_ID}`);
                if (res.ok) setAccount(await res.json());
            } catch (err) {
                console.error("Failed to fetch account:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAccount();
    }, []);

    const toggleFrequency = async () => {
        if (!account) return;
        const newFreq = account.payoutFrequency === "daily" ? "weekly" : "daily";
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'https://api.wnode.one';
            const res = await fetch(`${apiBase}/account/${MOCK_USER_ID}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ payoutFrequency: newFreq })
            });
            if (res.ok) setAccount(await res.json());
        } catch (err) {
            console.error("Failed to update frequency:", err);
        }
    };

    const handleOnboard = async () => {
        try {
            const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8082';
            
            let connectId = account?.stripeConnectId;
            if (!connectId) {
                const resAcct = await fetch(`${apiBase}/api/v1/stripe/connect/account`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: account?.email || 'admin@wnode.one' })
                });
                const dataAcct = await resAcct.json();
                connectId = dataAcct.accountID;
            }

            const res = await fetch(`${apiBase}/api/v1/stripe/connect/onboard`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    accountID: connectId,
                    returnURL: window.location.href,
                    refreshURL: window.location.href
                })
            });
            const data = await res.json();
            if (data.url) window.location.href = data.url;
        } catch (err) {
            console.error("Onboarding failed:", err);
        }
    };

    const metrics = [
        { label: 'Hardware yield', value: '$ 0.00', unit: 'USD', sub: 'Machine revenue' },
        { label: 'Affiliate earnings', value: '$ 0.00', unit: 'USD', sub: 'Network commissions' },
    ];

    return (
        <>
            <main className="flex-1 p-10 overflow-y-auto pb-24 space-y-10">
                <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-[10px] text-slate-500 uppercase-none tracking-widest">Payout Schedule</span>
                                <div 
                                    onClick={toggleFrequency}
                                    className="flex items-center gap-2 bg-white/[0.04] border border-white/10 px-3 py-1.5 rounded-[5px] cursor-pointer hover:border-[#22D3EE] transition-colors group"
                                >
                                    <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#22D3EE]" />
                                    <span className="text-[13px] font-mono text-white capitalize">{account?.payoutFrequency || "Daily"}</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-1">
                                <span className="text-[10px] text-slate-500 uppercase-none tracking-widest uppercase-none">Stripe Connect</span>
                                {account?.stripeConnectId ? (
                                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-[5px] text-emerald-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span className="text-[13px] font-mono">Connected</span>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handleOnboard}
                                        className="flex items-center gap-2 bg-[#22D3EE] px-4 py-1.5 rounded-[5px] text-black hover:bg-[#22D3EE]/90 transition-colors"
                                    >
                                        <CreditCard className="w-3.5 h-3.5" />
                                        <span className="text-[13px] font-bold tracking-tight">Setup Payouts</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {metrics.map((m) => (
                            <div 
                                key={m.label} 
                                onClick={() => setSelectedMetric(m.label)}
                                className="card-sovereign p-8 flex flex-col justify-between h-44 cursor-pointer hover:border-[#22D3EE]/50 transition-all group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#22D3EE]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[#22D3EE]/10 transition-colors" />
                                <span className="text-[14px] font-normal text-slate-400 uppercase-none group-hover:text-white transition-colors relative z-10">{m.label}</span>
                                <div className="flex items-baseline gap-2 relative z-10">
                                    <span className="text-5xl font-normal text-white tracking-tighter uppercase-none font-mono">{m.value}</span>
                                    <span className="text-[14px] font-normal text-slate-500 tracking-wider font-mono uppercase-none">{m.unit}</span>
                                </div>
                                <span className="text-[12px] text-[#22D3EE] font-mono tracking-tighter uppercase-none relative z-10">{m.sub}</span>
                            </div>
                        ))}
                    </div>

                    <div className="card-sovereign p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                            <span className="text-[16px] font-normal text-white uppercase-none italic">Automated Settlement Ledger</span>
                            <div className="flex items-center gap-2 text-[11px] text-slate-500 uppercase-none tracking-widest">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Updated in real-time
                            </div>
                        </div>
                        <div className="overflow-hidden border border-white/10 rounded-[5px]">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.04] text-[11px] text-slate-500 uppercase-none tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 font-normal">Settle ID</th>
                                        <th className="px-6 py-4 font-normal">Source</th>
                                        <th className="px-6 py-4 font-normal">Amount</th>
                                        <th className="px-6 py-4 font-normal">Stripe Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[14px] text-slate-300 divide-y divide-white/5">
                                    <tr className="hover:bg-white/[0.02] transition-colors italic">
                                        <td colSpan={4} className="px-6 py-10 text-center text-slate-600">No recent settlements detected.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* Financial Detail Drawer */}
                <div className={`fixed inset-y-0 right-0 w-[550px] bg-black border-l border-white/25 z-[100] transition-transform duration-500 shadow-2xl ${selectedMetric ? 'translate-x-0' : 'translate-x-full'}`}>
                    {selectedMetric && (
                         <div className="flex flex-col h-full">
                            <header className="p-10 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase-none tracking-[0.3em] font-mono">Revenue source itemization</span>
                                    <h3 className="text-[24px] text-white font-normal uppercase-none italic">{selectedMetric}</h3>
                                </div>
                                <button onClick={() => setSelectedMetric(null)} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-500 hover:text-white" />
                                </button>
                            </header>
                            <div className="flex-1 p-10 space-y-12 overflow-y-auto">
                                <div className="space-y-6">
                                     <span className="text-[12px] text-[#22D3EE] font-mono uppercase-none tracking-widest font-bold">Consolidated Data</span>
                                     <div className="card-sovereign p-8 space-y-6 bg-white/[0.02]">
                                        <div className="flex justify-between text-[16px] border-b border-white/5 pb-4">
                                            <span className="text-slate-400">Gross Revenue</span>
                                            <span className="text-white font-mono">$ 0.00</span>
                                        </div>
                                        <div className="flex justify-between text-[18px]">
                                            <span className="text-[#22D3EE] italic">Account standing</span>
                                            <span className="text-white font-mono font-bold">Nominal</span>
                                        </div>
                                     </div>
                                </div>

                                <div className="space-y-6">
                                     <span className="text-[12px] text-[#22D3EE] font-mono uppercase-none tracking-widest font-bold">Compliance & Payout Readiness</span>
                                     <div className="card-sovereign p-8 space-y-8 bg-white/[0.02]">
                                        <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-slate-500 uppercase-none tracking-widest">Transfers</span>
                                                <div className={`text-[12px] font-mono px-2 py-1 rounded-[3px] w-fit border capitalize ${account?.stripeInfo?.transferStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                                    {account?.stripeInfo?.transferStatus || "Pending"}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-slate-500 uppercase-none tracking-widest">Payouts</span>
                                                <div className={`text-[12px] font-mono px-2 py-1 rounded-[3px] w-fit border ${account?.stripeInfo?.payoutsEnabled ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                                    {account?.stripeInfo?.payoutsEnabled ? "Enabled" : "Restricted"}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-slate-500 uppercase-none tracking-widest">Currency</span>
                                                <div className="text-[14px] font-mono text-white uppercase">{account?.stripeInfo?.defaultCurrency || "USD"}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-slate-500 uppercase-none tracking-widest">Region</span>
                                                <div className="text-[14px] font-mono text-white uppercase">{account?.stripeInfo?.country || "US"}</div>
                                            </div>
                                        </div>
                                        
                                        {!account?.stripeInfo?.detailsSubmitted && (
                                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-[5px] flex items-center gap-3 text-amber-400 italic">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-[12px]">Verification details outstanding in Stripe Dashboard</span>
                                            </div>
                                        )}
                                     </div>
                                </div>
                                <div className="p-6 bg-[#22D3EE]/5 border border-[#22D3EE]/20 rounded-[5px] flex items-start gap-4">
                                    <Info className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
                                    <p className="text-[13px] text-slate-400 leading-relaxed">
                                        Payouts are aggregated and processed automatically via your linked Stripe Connect account. 
                                        {account?.payoutFrequency === "weekly" ? " Your next settlement is scheduled for Monday." : " Settlements occur every 24 hours."}
                                    </p>
                                </div>
                            </div>
                         </div>
                    )}
                </div>
        </>
    );
}
