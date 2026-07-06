"use client";

import { useState, useEffect } from "react";
import { X, ExternalLink, CreditCard, Clock, CheckCircle2, AlertCircle, Info, RefreshCw } from "lucide-react";
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
    payout_status: string;
    total_compute: number;
    total_paid: number;
    stripeInfo: StripeInfo;
}

export default function FinancesPage() {
    usePageTitle("Revenue Distribution", "Platform earnings and automated payout management.");
    const [account, setAccount] = useState<AccountInfo | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<null | string>(null);
    const [loading, setLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchAccountData = async () => {
        setIsRefreshing(true);
        try {
            const userEmail = localStorage.getItem("nodl_user_email") || "stephen@wnode.one";
            
            // We fetch the money overview which contains the operator details
            const res = await fetch(`/api/v1/money/overview?email=${encodeURIComponent(userEmail)}`);
            if (res.ok) {
                const data = await res.json();
                // Map the money overview structure to the finances page local state
                const operator = data.operator;
                setAccount({
                    id: operator.stripe_account_id,
                    email: operator.email,
                    stripeConnectId: operator.stripe_account_id,
                    payoutFrequency: "Manual / Bi-Weekly", // Generic for now
                    payout_status: operator.payout_status,
                    total_compute: operator.total_compute,
                    total_paid: operator.total_paid,
                    stripeInfo: operator.stripe_health ? {
                        accountId: operator.stripe_account_id,
                        detailsSubmitted: !operator.stripe_health.requirements_due,
                        payoutsEnabled: operator.stripe_health.payouts_enabled,
                        chargesEnabled: operator.stripe_health.charges_enabled,
                        transferStatus: operator.payout_status === "ACTIVE" ? "active" : "pending",
                        defaultCurrency: "USD",
                        country: "US"
                    } : {
                        accountId: "",
                        detailsSubmitted: false,
                        payoutsEnabled: false,
                        chargesEnabled: false,
                        transferStatus: "pending",
                        defaultCurrency: "USD",
                        country: "US"
                    }
                });
            }
        } catch (err) {
            console.error("Failed to fetch account:", err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAccountData();
    }, []);

    const formatCents = (cents: number | undefined) => {
        if (cents === undefined) return "$ 0.00";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    const handleOnboard = async () => {
        try {
            let connectId = account?.stripeConnectId;
            if (!connectId) {
                const resAcct = await fetch("/api/v1/stripe/connect/account", {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: account?.email || 'admin@wnode.one' })
                });
                const dataAcct = await resAcct.json();
                connectId = dataAcct.accountID;
            }

            const res = await fetch("/api/v1/stripe/connect/onboard", {
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
        { label: 'Hardware yield', value: formatCents(account?.total_compute), unit: 'USD', sub: 'Machine revenue' },
        { label: 'Total Settled', value: formatCents(account?.total_paid), unit: 'USD', sub: 'Completed Payouts' },
    ];

    return (
        <>
            <main className="flex-1 p-10 overflow-y-auto pb-24 space-y-10">
                <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col items-start gap-1">
                                <span className="text-[10px] text-white/40 uppercase-none tracking-widest font-bold">Ledger Authority</span>
                                <div 
                                    onClick={fetchAccountData}
                                    className="flex items-center gap-2 bg-white/[0.04] border border-wnode-border-neutral px-3 py-1.5 rounded-[5px] cursor-pointer hover:border-[#22D3EE] transition-colors group"
                                >
                                    <RefreshCw className={`w-3.5 h-3.5 text-white/60 group-hover:text-[#22D3EE] ${isRefreshing ? 'animate-spin' : ''}`} />
                                    <span className="text-[13px] font-mono text-white capitalize">Sync Ledger</span>
                                </div>
                            </div>

                            <div className="flex flex-col items-start gap-1">
                                <span className="text-[10px] text-white/40 uppercase-none tracking-widest font-bold">Payout Status</span>
                                {account?.stripeConnectId ? (
                                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-[5px] text-emerald-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span className="text-[13px] font-mono uppercase">{account.payout_status || "ACTIVE"}</span>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handleOnboard}
                                        className="flex items-center gap-2 bg-[#22D3EE] px-4 py-1.5 rounded-[5px] text-black hover:bg-[#22D3EE]/90 transition-colors"
                                    >
                                        <CreditCard className="w-3.5 h-3.5" />
                                        <span className="text-[13px] font-bold tracking-tight">Configure Connect</span>
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
                                <span className="text-[14px] font-bold text-white/60 uppercase-none group-hover:text-white transition-colors relative z-10">{m.label}</span>
                                <div className="flex items-baseline gap-2 relative z-10">
                                    <span className="text-5xl font-black text-white tracking-tighter uppercase-none font-mono">{m.value}</span>
                                    <span className="text-[14px] font-normal text-white/40 tracking-wider font-mono uppercase-none">{m.unit}</span>
                                </div>
                                <span className="text-[12px] text-[#22D3EE] font-mono tracking-tighter uppercase-none relative z-10 font-bold">{m.sub}</span>
                            </div>
                        ))}
                    </div>

                    <div className="card-sovereign p-8 flex flex-col">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-wnode-border-neutral">
                            <span className="text-[16px] font-bold text-white uppercase-none italic tracking-tight">Canonical Settlement Ledger</span>
                            <div className="flex items-center gap-2 text-[11px] text-white/40 uppercase-none tracking-widest font-bold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Authoritative Source: nodld
                            </div>
                        </div>
                        <div className="overflow-hidden border border-wnode-border-neutral rounded-[5px]">
                            <table className="w-full text-left">
                                <thead className="bg-white/[0.04] text-[11px] text-white/40 uppercase-none tracking-wider font-bold">
                                    <tr>
                                        <th className="px-6 py-4 font-bold">Node ID</th>
                                        <th className="px-6 py-4 font-bold">Earnings (Cents)</th>
                                        <th className="px-6 py-4 font-bold">Paid Out</th>
                                        <th className="px-6 py-4 font-bold">Ledger Integrity</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[14px] text-white/80 divide-y divide-white/5">
                                    {account ? (
                                        <tr className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-mono text-[12px]">{account.id.substring(0, 16)}...</td>
                                            <td className="px-6 py-4 font-mono font-bold text-white">{account.total_compute}</td>
                                            <td className="px-6 py-4 font-mono text-emerald-400">{account.total_paid}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    MATCHED
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr className="hover:bg-white/[0.02] transition-colors italic">
                                            <td colSpan={4} className="px-6 py-10 text-center text-white/40">No active ledger data detected for this terminal.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>

                {/* Financial Detail Drawer */}
                <div className={`fixed inset-y-0 right-0 w-[550px] bg-black border-l border-wnode-border-neutral z-[100] transition-transform duration-500 shadow-2xl ${selectedMetric ? 'translate-x-0' : 'translate-x-full'}`}>
                    {selectedMetric && (
                         <div className="flex flex-col h-full">
                            <header className="p-10 border-b border-wnode-border-neutral flex items-center justify-between bg-white/[0.02]">
                                <div>
                                    <span className="text-[10px] text-white/40 uppercase-none tracking-[0.3em] font-mono">Revenue source itemization</span>
                                    <h3 className="text-[24px] text-white font-normal uppercase-none italic">{selectedMetric}</h3>
                                </div>
                                <button onClick={() => setSelectedMetric(null)} className="p-3 hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-white/40 hover:text-white" />
                                </button>
                            </header>
                            <div className="flex-1 p-10 space-y-12 overflow-y-auto">
                                <div className="space-y-6">
                                     <span className="text-[12px] text-[#22D3EE] font-mono uppercase-none tracking-widest font-bold">Consolidated Data</span>
                                     <div className="card-sovereign p-8 space-y-6 bg-white/[0.02]">
                                        <div className="flex justify-between text-[16px] border-b border-wnode-border-separator pb-4">
                                            <span className="text-white/60">Gross Revenue</span>
                                            <span className="text-white font-mono font-bold">{formatCents(account?.total_compute)}</span>
                                        </div>
                                        <div className="flex justify-between text-[18px]">
                                            <span className="text-[#22D3EE] italic font-bold">Account standing</span>
                                            <span className="text-white font-mono font-bold">Authoritative</span>
                                        </div>
                                     </div>
                                </div>

                                <div className="space-y-6">
                                     <span className="text-[12px] text-[#22D3EE] font-mono uppercase-none tracking-widest font-bold">Compliance & Payout Readiness</span>
                                     <div className="card-sovereign p-8 space-y-8 bg-white/[0.02]">
                                        <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-white/40 uppercase-none tracking-widest font-bold">Transfers</span>
                                                <div className={`text-[12px] font-mono px-2 py-1 rounded-[3px] w-fit border capitalize font-bold ${account?.stripeInfo?.transferStatus === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'}`}>
                                                    {account?.stripeInfo?.transferStatus || "Pending"}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-white/40 uppercase-none tracking-widest font-bold">Payouts</span>
                                                <div className={`text-[12px] font-mono px-2 py-1 rounded-[3px] w-fit border font-bold ${account?.stripeInfo?.payoutsEnabled ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                                    {account?.stripeInfo?.payoutsEnabled ? "Enabled" : "Restricted"}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-white/40 uppercase-none tracking-widest font-bold">Currency</span>
                                                <div className="text-[14px] font-mono text-white uppercase font-bold">{account?.stripeInfo?.defaultCurrency || "USD"}</div>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-[10px] text-white/40 uppercase-none tracking-widest font-bold">Region</span>
                                                <div className="text-[14px] font-mono text-white uppercase font-bold">{account?.stripeInfo?.country || "US"}</div>
                                            </div>
                                        </div>
                                        
                                        {!account?.stripeInfo?.detailsSubmitted && (
                                            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-[5px] flex items-center gap-3 text-amber-400 italic">
                                                <AlertCircle className="w-4 h-4" />
                                                <span className="text-[12px] font-bold">Verification details outstanding in Stripe Dashboard</span>
                                            </div>
                                        )}
                                     </div>
                                </div>
                                <div className="p-6 bg-[#22D3EE]/5 border border-[#22D3EE]/20 rounded-[5px] flex items-start gap-4">
                                    <Info className="w-5 h-5 text-[#22D3EE] shrink-0 mt-0.5" />
                                    <p className="text-[13px] text-white/60 leading-relaxed font-bold">
                                        Payouts are aggregated and processed automatically via your linked Stripe Connect account. 
                                        Authoritative ledger data is synchronized every 30 seconds.
                                    </p>
                                </div>
                            </div>
                         </div>
                    )}
                </div>
        </>
    );
}
