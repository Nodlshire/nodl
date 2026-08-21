"use client";

import React, { useState, useEffect } from "react";
import { 
    Users, Share2, DollarSign, TrendingUp, Search, Filter, 
    ChevronRight, ArrowUpRight, BarChart3, CreditCard, UserPlus, Mail, Link as LinkIcon, Activity
} from "lucide-react";
import DetailPanel from "../components/DetailPanel";
import MetricCard from "@shared/components/MetricCard";
import IdentityHeader from "@shared/components/IdentityHeader";

export default function AffiliatesPage() {
    const [affiliates, setAffiliates] = useState<any[]>([]);
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
    const [search, setSearch] = useState("");

    const fetchAffiliates = async () => {
        try {
            const res = await fetch('/api/affiliates/all');
            if (res.ok) setAffiliates(await res.json());
            
            const sRes = await fetch('/api/affiliates/stats');
            if (sRes.ok) setStats(await sRes.ok ? await sRes.json() : null);
        } catch (err) {
            console.error("Failed to fetch affiliates:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAffiliates();
    }, []);

    const handleSelectPartner = async (partner: any) => {
        setSelectedAffiliate(partner);
        try {
            const res = await fetch(`/api/affiliates/${partner.id}`);
            if (res.ok) {
                const detailed = await res.json();
                setSelectedAffiliate(detailed);
            }
        } catch (err) {
            console.error("Failed to fetch partner details:", err);
        }
    };

    const filteredAffiliates = affiliates.filter(a => 
        a.name.toLowerCase().includes(search.toLowerCase()) || 
        a.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
                <header className="h-14 border-b border-white/10 flex items-center justify-between px-8 bg-black shrink-0 relative z-10 transition-all">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                        <span className="text-[10px] font-normal text-slate-400 tracking-[0.2em] uppercase">Growth Protocol Active</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <button className="flex items-center gap-2 px-3 py-1.5 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-[5px] text-[11px] font-medium text-[#22D3EE] hover:bg-[#22D3EE]/20 transition-all uppercase tracking-widest">
                            <UserPlus className="w-3.5 h-3.5" />
                            Onboard Partner
                        </button>
                        <div className="h-8 w-px bg-white/5" />
                        <IdentityHeader />
                    </div>
                </header>

                <main className="flex-1 p-8 overflow-y-auto pb-24 relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                        <div>
                            <h1 className="text-xl font-normal tracking-tight text-white mb-1">Affiliate Network Management</h1>
                            <p className="text-[14px] text-slate-500 font-normal">Monitor partner performance, adjust commission trees, and authorize payouts.</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text" 
                                    placeholder="Find partner..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="bg-white/[0.03] border border-white/10 rounded-[5px] pl-10 pr-4 py-2 text-[13px] focus:outline-none focus:border-[#22D3EE]/50 w-64 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
                        {[
                            { label: 'Total Partners', value: stats?.totalPartners || '0', icon: Users, color: 'text-white' },
                            { label: 'Active Referrals', value: stats?.totalReferrals || '0', icon: Share2, color: 'text-[#22D3EE]' },
                            { label: 'Partner Earnings', value: `$${(stats?.totalEarned / 100 || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}`, icon: DollarSign, color: 'text-purple-400' },
                            { label: 'Conversion Rate', value: `${stats?.conversionRate || '0.0'}%`, icon: TrendingUp, color: 'text-green-400' },
                        ].map((s) => (
                            <MetricCard 
                                key={s.label}
                                label={s.label}
                                value={s.value}
                                icon={s.icon}
                                colorClass={s.color}
                            />
                        ))}
                    </div>

                    <div className="bg-white/[0.01] border border-white/10 rounded-[5px] overflow-hidden backdrop-blur-sm shadow-[0_0_50px_rgba(34,211,238,0.03)]">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Partner Identity (CRM)</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Protocol ID (Universal)</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Net ID</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Network Architecture</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Yield Performance</th>
                                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Status Audit</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredAffiliates.map((aff) => (
                                    <tr 
                                        key={aff.id} 
                                        onClick={() => handleSelectPartner(aff)}
                                        className="hover:bg-[#22D3EE]/[0.02] transition-all cursor-pointer group relative"
                                    >
                                        <td className="px-6 py-5 relative">
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#22D3EE]" />
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-[13px] font-bold text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-black transition-all duration-500 shadow-inner">
                                                    {aff.name?.[0] || '?'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[14px] font-bold text-white group-hover:text-[#22D3EE] transition-colors">{aff.name || 'Anonymous'}</span>
                                                        {aff.isFounder && (
                                                            <span className="text-[8px] bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/30 px-1.5 py-0.5 rounded-[2px] font-bold tracking-widest">FOUNDER</span>
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-slate-600 font-mono italic">{aff.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center font-mono">
                                            <span className="text-[12px] text-[#22D3EE] font-bold group-hover:text-white transition-colors tracking-tighter">{aff.id}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-[11px] font-mono text-slate-500 font-bold px-2 py-1 bg-white/[0.03] border border-white/5 rounded-[3px]">
                                                {aff.founderNetworkId || '00'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[14px] text-slate-300 font-bold">{aff.referrals || 0} Nodes</span>
                                                    <div className="flex gap-1.5">
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded-[2px] bg-white/5 text-slate-500 font-bold">L1: {aff.l1_referrals || 0}</span>
                                                        <span className="text-[9px] px-1.5 py-0.5 rounded-[2px] bg-white/5 text-slate-500 font-bold">L2: {aff.l2_referrals || 0}</span>
                                                    </div>
                                                </div>
                                                <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden mt-1 shadow-inner">
                                                    <div className="h-full bg-[#22D3EE]/30" style={{ width: `${Math.min(100, (aff.referrals || 0) * 10)}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right font-mono">
                                            <div className="flex flex-col">
                                                <span className="text-[15px] text-green-400 font-bold">${((aff.total_earned || 0) / 100).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                                                <span className="text-[9px] text-slate-600 uppercase tracking-tighter font-bold">Protocol Yield</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center gap-2.5 justify-end">
                                                <div className={`w-1.5 h-1.5 rounded-full ${aff.status === 'active' ? 'bg-green-500 shadow-[0_0_10px_#22C55E]' : 'bg-yellow-500 animate-pulse shadow-[0_0_10px_#EAB308]'}`} />
                                                <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors ${aff.status === 'active' ? 'text-slate-400' : 'text-yellow-500'}`}>{aff.status}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                <DetailPanel
                    isOpen={!!selectedAffiliate}
                    onClose={() => setSelectedAffiliate(null)}
                    title="Protocol Hybrid Intelligence"
                    subtitle={`Universal ID: ${selectedAffiliate?.id}`}
                    footer={
                        <div className="flex items-center gap-3">
                            <button className="flex-1 py-3 bg-red-400/5 hover:bg-red-400/10 border border-red-400/20 rounded-[5px] text-[12px] font-bold text-red-500 transition-all uppercase tracking-widest">
                                Revoke Protocol Access
                            </button>
                            <button className="flex-[2] py-3 bg-[#22D3EE] text-black rounded-[5px] text-[12px] font-bold transition-all shadow-[0_0_30px_#22D3EE33] uppercase tracking-widest">
                                Authorize Configuration
                            </button>
                        </div>
                    }
                >
                    {selectedAffiliate && (
                        <div className="space-y-6">
                            {/* CRM / Nodl'r Hybrid Identity Module */}
                            <section className={`bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.06)] relative group`}>
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/30 to-transparent" />
                                {selectedAffiliate.isFounder && (
                                    <div className="absolute top-0 right-0 px-3 py-1 bg-[#22D3EE] text-black text-[9px] font-extrabold uppercase tracking-[0.2em] rounded-bl-[5px] shadow-[0_0_15px_rgba(34,211,238,0.4)]">
                                        Founder Tier
                                    </div>
                                )}
                                <div className="px-5 py-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]" />
                                        <span className="text-[11px] font-bold text-white uppercase tracking-[0.25em] font-sans">CRM / NODL'R Hybrid Identity</span>
                                    </div>
                                    <Activity className={`w-4 h-4 ${selectedAffiliate.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
                                </div>
                                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-3xl font-bold text-[#22D3EE] shadow-[inset_0_0_20px_rgba(34,211,238,0.1)] group-hover:scale-105 transition-transform duration-500">
                                            {selectedAffiliate.name?.[0]}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[22px] font-bold text-white tracking-tight leading-none">{selectedAffiliate.name}</span>
                                            <span className="text-[11px] text-[#22D3EE] font-mono tracking-widest font-bold uppercase py-1 px-2 bg-[#22D3EE]/5 border border-[#22D3EE]/20 rounded-[3px] inline-block w-fit">
                                                {selectedAffiliate.id}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-center gap-5 border-l border-white/5 pl-10">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Network Access</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={`w-2 h-2 rounded-full ${selectedAffiliate.status === 'active' ? 'bg-green-500 shadow-[0_0_12px_#22C55E]' : 'bg-red-500 shadow-[0_0_12px_#EF4444]'}`} />
                                                    <span className={`text-[12px] font-bold uppercase tracking-widest ${selectedAffiliate.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                                                        {selectedAffiliate.accountHealth || selectedAffiliate.status || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Region Root</span>
                                                <span className="text-[14px] font-mono font-bold text-white bg-white/[0.05] w-fit px-2 py-0.5 rounded-[2px] border border-white/5 uppercase">
                                                    {selectedAffiliate.region || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Hybrid Capability Matrix */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* CRM Protocol Stats */}
                                <section className="bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.04)]">
                                    <div className="px-4 py-3 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                                        <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em] font-sans">CRM Protocol Context</span>
                                        <Users className="w-3.5 h-3.5 text-[#22D3EE]" />
                                    </div>
                                    <div className="p-5 space-y-5">
                                        <div className="flex justify-between items-center group cursor-pointer" onClick={() => navigator.clipboard.writeText(selectedAffiliate.email)}>
                                            <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Communication Link</span>
                                            <span className="text-[13px] text-slate-300 font-mono group-hover:text-[#22D3EE] transition-colors">{selectedAffiliate.email || 'N/A'}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Primary Interface</span>
                                            <span className="text-[12px] text-[#22D3EE] font-mono">{selectedAffiliate.contactInfo?.telegram || 'N/A'}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">CRM Rights</span>
                                                <span className={`text-[12px] font-bold uppercase tracking-widest ${selectedAffiliate.crmRights === 'full' ? 'text-purple-400' : 'text-slate-500'}`}>
                                                    {selectedAffiliate.crmRights || 'NONE'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Admin Status</span>
                                                <span className={`text-[12px] font-bold uppercase tracking-widest ${selectedAffiliate.crmRights === 'full' ? 'text-green-400' : 'text-yellow-600/50'}`}>
                                                    {selectedAffiliate.crmRights === 'full' ? 'AUTHORIZED' : 'RESTRICTED'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Nodl'r Infrastructure */}
                                <section className="bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.04)]">
                                    <div className="px-4 py-3 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                                        <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em] font-sans">Nodl'r Infrastructure</span>
                                        <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                                    </div>
                                    <div className="p-5 space-y-5">
                                        <div className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[20px] font-mono text-white font-bold">{selectedAffiliate.nodlSequence || '1000000'}</span>
                                                <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Nodl Sequence Base</span>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className={`text-[12px] font-bold uppercase tracking-widest ${selectedAffiliate.onboardingBypass ? 'text-green-400' : 'text-slate-500'}`}>
                                                    {selectedAffiliate.onboardingBypass ? 'Bypass Active' : 'Standard Flow'}
                                                </span>
                                                <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Onboarding Mode</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex justify-between items-center bg-white/[0.01] -mx-5 px-5 py-3 mt-auto">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Protocol Sync</span>
                                            <span className="text-[12px] font-mono text-[#22D3EE] font-bold">ACTIVE_DMN</span>
                                        </div>
                                    </div>
                                </section>

                                {/* Affiliate Yield Performance */}
                                <section className="bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.04)]">
                                    <div className="px-4 py-3 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                                        <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em] font-sans">Affiliate Yield Performance</span>
                                        <DollarSign className="w-3.5 h-3.5 text-[#22D3EE]" />
                                    </div>
                                    <div className="p-5 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[24px] font-mono text-white leading-none font-bold">
                                                    ${(selectedAffiliate.total_earned_accrued / 100 || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                </span>
                                                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Total Accrued Yield</span>
                                            </div>
                                            {selectedAffiliate.isFounder && (
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[20px] font-mono text-purple-400 leading-none font-bold">3.0%</span>
                                                    <span className="text-[9px] text-purple-400/60 uppercase tracking-widest font-bold text-right leading-tight">Infinity Yield Override</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[14px] font-mono text-slate-300 font-bold">${(selectedAffiliate.standard_yield / 100 || 0).toLocaleString()}</span>
                                                <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Standard (L1+L2)</span>
                                            </div>
                                            <div className="flex flex-col gap-1 items-end">
                                                <span className="text-[14px] font-mono text-[#22D3EE] font-bold">${(selectedAffiliate.infinity_yield / 100 || 0).toLocaleString()}</span>
                                                <span className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Infinity Stream</span>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Network Architecture audit */}
                                <section className="bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden backdrop-blur-md shadow-[0_0_25px_rgba(34,211,238,0.04)]">
                                    <div className="px-4 py-3 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                                        <span className="text-[10px] font-extrabold text-white uppercase tracking-[0.2em] font-sans">Network Architecture Audit</span>
                                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                                    </div>
                                    <div className="p-5 space-y-6">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[24px] font-mono text-white leading-none font-bold">{selectedAffiliate.total_reach || 0}</span>
                                                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Aggregate Nodes</span>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[24px] font-mono text-white leading-none font-bold">{selectedAffiliate.network_depth || 0}</span>
                                                <span className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">Recursion Depth</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Downstream Volume</span>
                                            <span className="text-[14px] font-mono text-[#22D3EE] font-bold">
                                                ${(selectedAffiliate.total_revenue_accrued / 100 || 0).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Referral Propagation History */}
                            <section className="bg-white/[0.02] border border-white/10 rounded-[5px] overflow-hidden backdrop-blur-md shadow-[0_0_30px_rgba(34,211,238,0.04)]">
                                <div className="px-5 py-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[11px] font-bold text-white uppercase tracking-[0.25em] font-sans">Propagation Stream Integration</span>
                                        <span className="text-[10px] px-2 py-0.5 bg-[#22D3EE]/10 border border-[#22D3EE]/20 text-[#22D3EE] rounded-[2px] font-mono font-bold leading-none">
                                            NET_ID: {selectedAffiliate.founderNetworkId || '00'}
                                        </span>
                                    </div>
                                    <Share2 className="w-4 h-4 text-slate-500" />
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5 bg-white/[0.01]">
                                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocol Node</th>
                                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Level</th>
                                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Temporal Hex</th>
                                                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Yield Impact</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {selectedAffiliate.referrals_list?.map((ref: any, idx: number) => (
                                                <tr key={ref.id || idx} className="hover:bg-white/[0.03] transition-colors group/row">
                                                    <td className="px-6 py-4 text-[13px] font-mono text-slate-300 group-hover/row:text-white transition-colors">{ref.referred_user_email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-[2px] font-bold uppercase tracking-widest border ${ref.level === 'L1' ? 'bg-[#22D3EE]/5 border-[#22D3EE]/20 text-[#22D3EE]' : ref.level === 'L2' ? 'bg-purple-500/5 border-purple-500/20 text-purple-400' : 'bg-slate-500/5 border-slate-500/20 text-slate-500'}`}>
                                                            {ref.level}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-[11px] text-slate-500 font-mono tracking-tighter">
                                                        {new Date(ref.timestamp).getTime().toString(16).slice(-8).toUpperCase()}
                                                    </td>
                                                    <td className="px-6 py-4 text-[14px] font-mono text-right">
                                                        <span className={ref.revenueGenerated > 0 ? 'text-green-400 font-bold' : 'text-slate-700'}>
                                                            +${(ref.revenueGenerated / 100 || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            {(!selectedAffiliate.referrals_list || selectedAffiliate.referrals_list.length === 0) && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center text-[12px] text-slate-600 font-sans italic tracking-wide">No propagation events detected for this identity node.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Intelligence Trace Terminal */}
                            <section className="bg-black/80 border border-[#22D3EE]/20 rounded-[5px] overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.05)] relative group/trace">
                                <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#22D3EE]/40 to-transparent" />
                                <div className="px-5 py-3 border-b border-white/10 bg-white/[0.04] flex items-center justify-between relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-[#22D3EE]/0 via-[#22D3EE]/5 to-[#22D3EE]/0 opacity-30 animate-pulse" />
                                    <div className="flex items-center gap-3 relative">
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_12px_#22C55E] animate-pulse" />
                                        <span className="text-[11px] font-extrabold text-slate-200 uppercase tracking-[0.3em] font-sans">CRM / Protocol Intel Trace</span>
                                    </div>
                                    <div className="flex items-center gap-4 relative">
                                        <span className="text-[10px] text-slate-600 font-mono tracking-widest hidden md:block uppercase font-bold">SEC_HYBRID_PRTCL: 9.0.1</span>
                                        <div className="h-4 w-px bg-white/10" />
                                        <span className="text-[10px] text-[#22D3EE] font-mono uppercase font-bold">DMN_LNK_OK</span>
                                    </div>
                                </div>
                                <div className="p-6 font-mono text-[12px] leading-relaxed max-h-[220px] overflow-y-auto custom-scrollbar bg-black/40 backdrop-blur-xl">
                                    <div className="space-y-2 opacity-90 text-slate-400">
                                        <div className="flex gap-4">
                                            <span className="text-slate-800 shrink-0 font-bold">[{new Date().toISOString().slice(11, 19)}]</span>
                                            <span className="text-[#22D3EE] font-bold">[IDENTITY_SYNC]</span>
                                            <span>Strict protocol ID verified: {selectedAffiliate.id} | FOUNDER_NETWORK_{selectedAffiliate.founderNetworkId || '00'} [OK]</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-slate-800 shrink-0 font-bold">[{new Date().toISOString().slice(11, 19)}]</span>
                                            <span className="text-purple-500 font-bold">[CRM_AUTH]</span>
                                            <span>CRM Rights level: {selectedAffiliate.crmRights || 'NONE'} | Bypass status: {selectedAffiliate.onboardingBypass ? 'ACTIVE' : 'LOCKED'}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-slate-800 shrink-0 font-bold">[{new Date().toISOString().slice(11, 19)}]</span>
                                            <span className="text-green-500 font-bold">[YIELD_HYDRATION]</span>
                                            <span>Accrued Protocol Yield for {selectedAffiliate.total_reach} nodes. (Standard: {selectedAffiliate.standard_yield / 100}, Infinity: {selectedAffiliate.infinity_yield / 100})</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="text-slate-800 shrink-0 font-bold">[{new Date().toISOString().slice(11, 19)}]</span>
                                            <span className="text-yellow-600 font-bold">[ROUTING]</span>
                                            <span>Sequential organic pool index: #{(selectedAffiliate.id?.slice(-2) || '00')} | Handover authorized.</span>
                                        </div>
                                        <div className="flex gap-4 animate-pulse pt-2 border-t border-white/5 mt-2">
                                            <span className="text-slate-900 shrink-0 font-bold">[{new Date().toISOString().slice(11, 19)}]</span>
                                            <span className="text-slate-700 font-bold uppercase tracking-widest text-[10px]">Continuous protocol parity scan running...</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    )}
                </DetailPanel>
        </>
    );
}
