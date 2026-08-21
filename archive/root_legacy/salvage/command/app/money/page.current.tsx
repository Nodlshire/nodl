"use client";

import React, { useState, useEffect } from "react";
import { 
    Wallet, TrendingUp, TrendingDown, Clock, ShieldCheck, 
    Zap, DollarSign, Calendar, BarChart3, ArrowUpRight, 
    ArrowDownLeft, Activity, Target, RefreshCw, AlertTriangle, CheckCircle, Info
} from "lucide-react";
import { usePageTitle } from "../components/PageTitleContext";
import MetricCard from "../components/MetricCard";

interface StripeHealth {
    charges_enabled: boolean;
    payouts_enabled: boolean;
    requirements_due: boolean;
}

interface FinancialAlerts {
    low_treasury_warning: boolean;
    negative_flow_warning: boolean;
    short_runway_warning: boolean;
    stripe_health_warning: boolean;
    revenue_drop_warning: boolean;
    operator_payout_risk: boolean;
    founder_override_risk: boolean;
    notes: string[];
}

interface MoneyOverview {
    operator: {
        email: string;
        stripe_account_id: string;
        total_compute: number;
        total_paid: number;
        total_pending: number;
        last_payout: string;
        payout_status: string;
        stripe_health?: StripeHealth;
    };
    founder: {
        email: string;
        total_override_earned: number;
        total_override_pending: number;
        founder_email: string;
    };
    platform: {
        total_revenue: number;
        total_payouts: number;
        treasury_balance: number;
        profitability: number;
        stripe_platform_health?: StripeHealth;
    };
    node: {
        online: boolean;
        last_heartbeat: string;
        uptime_percent: number;
    };
    treasury_simulation: {
        daily_inflow_estimate: number;
        daily_outflow_estimate: number;
        net_daily_flow: number;
        projected_7_day_balance: number;
        projected_30_day_balance: number;
        projected_90_day_balance: number;
        burn_rate_per_day: number;
        runway_days: number;
        override_projection: number;
        operator_payout_projection: number;
    };
    alerts?: FinancialAlerts;
}

export default function MoneyDashboard() {
    usePageTitle("Money Control", "Real-time financial intelligence and treasury simulation.");
    
    const [data, setData] = useState<MoneyOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchMoneyData = async () => {
        setIsRefreshing(true);
        try {
            const userEmail = localStorage.getItem("nodl_user_email") || "";
            const res = await fetch(`/api/v1/money/overview?email=${encodeURIComponent(userEmail)}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
                setError(null);
            } else {
                setError("Failed to synchronize with Money subsystem.");
            }
        } catch (err) {
            console.error("Money fetch error:", err);
            setError("Connectivity error: Money subsystem unreachable.");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchMoneyData();
        const interval = setInterval(fetchMoneyData, 60000);
        return () => clearInterval(interval);
    }, []);

    const formatCents = (cents: number | undefined | null) => {
        if (cents === undefined || cents === null) return "---";
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(cents / 100);
    };

    const formatDays = (days: number | undefined | null) => {
        if (days === undefined || days === null) return "---";
        return days === 0 ? "Infinite" : `${days} Days`;
    };

    const formatPercent = (val: number | undefined | null) => {
        if (val === undefined || val === null) return "---";
        return `${(val * 100).toFixed(1)}%`;
    };

    const formatHealth = (health: StripeHealth | undefined) => {
        if (!health) return "Disconnected";
        if (health.requirements_due) return "Attention Required";
        if (health.charges_enabled && health.payouts_enabled) return "Operational";
        return "Restricted";
    };

    if (loading && !data) {
        return (
            <main className="p-8 flex flex-col items-center justify-center h-[60vh]">
                <RefreshCw className="w-8 h-8 text-[#22D3EE] animate-spin opacity-50" />
                <p className="mt-4 text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Financial Intelligence...</p>
            </main>
        );
    }

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 relative">
            {/* Header Control */}
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                        <span className="text-[10px] font-normal text-slate-500 tracking-[0.2em] uppercase">Treasury Inflow Control</span>
                    </div>
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest bg-red-400/5 px-3 py-1 rounded-full border border-red-400/10">
                            <ShieldCheck className="w-3 h-3" />
                            {error}
                        </div>
                    )}
                </div>
                
                <button 
                    onClick={fetchMoneyData}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/10 rounded-[5px] text-[11px] font-bold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all uppercase tracking-widest disabled:opacity-50"
                >
                    <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                    Sync Ledger
                </button>
            </div>
            {/* Financial Alerts Section */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                        <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em]">System Integrity Alerts</h2>
                    </div>
                    {data?.alerts && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full">
                            <div className={`w-1 h-1 rounded-full ${data.alerts.notes.length > 0 ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`} />
                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                                {data.alerts.notes.length > 0 ? 'Action Required' : 'Status: Optimal'}
                            </span>
                        </div>
                    )}
                </div>

                <div className="bg-white/[0.01] border border-white/5 rounded-[5px] p-6">
                    {!data?.alerts ? (
                        <div className="flex items-center gap-3 text-slate-500 py-2">
                            <Info className="w-4 h-4 opacity-40" />
                            <span className="text-[13px] italic">Financial alert subsystem is currently offline.</span>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {/* Alert Badges */}
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { id: 'low_treasury', label: 'Treasury Level', status: data.alerts.low_treasury_warning },
                                    { id: 'negative_flow', label: 'Cashflow Trending', status: data.alerts.negative_flow_warning },
                                    { id: 'short_runway', label: 'Runway Continuity', status: data.alerts.short_runway_warning },
                                    { id: 'stripe_health', label: 'Stripe Mesh Link', status: data.alerts.stripe_health_warning },
                                    { id: 'revenue_drop', label: 'Revenue Momentum', status: data.alerts.revenue_drop_warning },
                                    { id: 'payout_risk', label: 'Payout Liability', status: data.alerts.operator_payout_risk },
                                    { id: 'override_risk', label: 'Override Exposure', status: data.alerts.founder_override_risk },
                                ].map((alert) => (
                                    <div 
                                        key={alert.id}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-[5px] border transition-all ${
                                            alert.status 
                                            ? 'bg-red-400/5 border-red-400/20 text-red-400' 
                                            : 'bg-green-400/5 border-green-400/20 text-green-400 opacity-60'
                                        }`}
                                    >
                                        {alert.status ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle className="w-3 h-3" />}
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{alert.label}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Alert Notes */}
                            {data.alerts.notes.length > 0 ? (
                                <div className="space-y-3 pt-6 border-t border-white/5">
                                    {data.alerts.notes.map((note, idx) => (
                                        <div key={idx} className="flex items-start gap-3 group">
                                            <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400/40 group-hover:bg-red-400 transition-colors" />
                                            <span className="text-[13px] text-slate-400 font-medium group-hover:text-slate-200 transition-colors">{note}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 text-green-400/40 pt-6 border-t border-white/5">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[13px] italic">No critical anomalies detected in the current financial session.</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Platform Overview */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <Wallet className="w-4 h-4 text-[#22D3EE]" />
                    <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em]">Platform Treasury View</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <MetricCard 
                        label="Total Network Revenue" 
                        value={formatCents(data?.platform.total_revenue)} 
                        icon={TrendingUp} 
                        statusColor="text-white"
                        sub="Gross Compute Volume"
                    />
                    <MetricCard 
                        label="Platform Treasury" 
                        value={formatCents(data?.platform.treasury_balance)} 
                        icon={DollarSign} 
                        statusColor="text-[#22D3EE]"
                        sub="Settled Liquidity"
                    />
                    <MetricCard 
                        label="Profitability" 
                        value={formatPercent(data?.platform.profitability)} 
                        icon={Zap} 
                        statusColor="text-cyan-400"
                        sub="Retention Efficiency"
                    />
                    <MetricCard 
                        label="Stripe Health" 
                        value={formatHealth(data?.platform.stripe_platform_health)} 
                        icon={ShieldCheck} 
                        statusColor={data?.platform.stripe_platform_health?.requirements_due ? "text-orange-400" : "text-green-400"}
                        sub="Operational Status"
                    />
                </div>
            </div>

            {/* Simulation & Projections */}
            <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                    <Target className="w-4 h-4 text-purple-400" />
                    <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em]">Cashflow Projections</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[5px] space-y-4">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Inflow Simulation</span>
                        <div className="space-y-4">
                            <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                <span className="text-[11px] text-slate-400">Daily Average</span>
                                <span className="text-xl font-mono text-white tracking-tighter">{formatCents(data?.treasury_simulation.daily_inflow_estimate)}</span>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] text-slate-400">Net Daily Flow</span>
                                <span className={`text-[15px] font-mono tracking-tighter ${data?.treasury_simulation.net_daily_flow && data.treasury_simulation.net_daily_flow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {data?.treasury_simulation.net_daily_flow && data.treasury_simulation.net_daily_flow >= 0 ? '+' : ''}{formatCents(data?.treasury_simulation.net_daily_flow)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[5px] space-y-4">
                        <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Forward Balance Projections</span>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-[12px]">
                                <span className="text-slate-500">7-Day Target</span>
                                <span className="text-slate-300 font-mono">{formatCents(data?.treasury_simulation.projected_7_day_balance)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[12px]">
                                <span className="text-slate-500">30-Day Outlook</span>
                                <span className="text-[#22D3EE] font-mono font-bold">{formatCents(data?.treasury_simulation.projected_30_day_balance)}</span>
                            </div>
                            <div className="flex justify-between items-center text-[12px]">
                                <span className="text-slate-500">90-Day Forecast</span>
                                <span className="text-purple-400 font-mono">{formatCents(data?.treasury_simulation.projected_90_day_balance)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#22D3EE]/5 border border-[#22D3EE]/20 p-6 rounded-[5px] space-y-4 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]">
                        <span className="text-[10px] text-[#22D3EE] uppercase tracking-[0.2em] font-bold">Stability Runway</span>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-normal text-white tracking-tighter">
                                    {formatDays(data?.treasury_simulation.runway_days)}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase mt-1">Projected Solvency Window</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-[#22D3EE]/10 pt-3">
                                <span className="text-[11px] text-slate-400">Burn Rate</span>
                                <span className="text-[13px] font-mono text-orange-400">{formatCents(data?.treasury_simulation.burn_rate_per_day)}/day</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Operator & Founder Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Operator Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-orange-400" />
                        <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em]">Operator Personal Earnings</h2>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-[5px] overflow-hidden p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Active Operator</span>
                                <span className="text-[13px] text-slate-300 font-mono">{data?.operator.email || "---"}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Status:</span>
                                <span className="text-[10px] text-[#22D3EE] uppercase font-bold tracking-widest">{data?.operator.payout_status || "PENDING"}</span>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-6 gap-x-12">
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Gross Lifetime</span>
                                <span className="text-xl font-mono text-white tracking-tighter">{formatCents(data?.operator.total_compute)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Total Settled</span>
                                <span className="text-xl font-mono text-green-400 tracking-tighter">{formatCents(data?.operator.total_paid)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Pending Payout</span>
                                <span className="text-xl font-mono text-orange-400 tracking-tighter">{formatCents(data?.operator.total_pending)}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Last Activity</span>
                                <span className="text-[13px] font-mono text-slate-400">{data?.operator.last_payout && data.operator.last_payout !== '0001-01-01T00:00:00Z' ? new Date(data.operator.last_payout).toLocaleDateString() : "---"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Founder Override Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-cyan-400" />
                        <h2 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.3em]">Founder Override Analysis</h2>
                    </div>
                    <div className="bg-white/[0.01] border border-white/5 rounded-[5px] overflow-hidden p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <div className="flex flex-col">
                                <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Founder Target</span>
                                <span className="text-[13px] text-cyan-400 font-mono">{data?.founder.founder_email || "---"}</span>
                            </div>
                            <div className="px-3 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-full">
                                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Override Tier: 3%</span>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="flex flex-col gap-1 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-[5px]">
                                    <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">Total Earned</span>
                                    <span className="text-xl font-mono text-white tracking-tighter">{formatCents(data?.founder.total_override_earned)}</span>
                                </div>
                                <div className="flex flex-col gap-1 px-4 py-3 bg-white/[0.01] border border-white/5 rounded-[5px]">
                                    <span className="text-[9px] text-slate-600 uppercase font-bold tracking-widest">In Escrow</span>
                                    <span className="text-xl font-mono text-cyan-400 tracking-tighter">{formatCents(data?.founder.total_override_pending)}</span>
                                </div>
                            </div>

                            <div className="bg-[#22D3EE]/5 border border-[#22D3EE]/20 p-4 rounded-[5px]">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-[#22D3EE]/10 rounded-full">
                                            <TrendingUp className="w-4 h-4 text-[#22D3EE]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[10px] text-[#22D3EE] uppercase font-bold tracking-widest">Override Projection</span>
                                            <span className="text-[11px] text-slate-500 italic">Estimated next 30 days</span>
                                        </div>
                                    </div>
                                    <span className="text-lg font-mono text-white tracking-tighter">{formatCents(data?.treasury_simulation.override_projection)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
