"use client";

import React, { useState } from "react";
import { 
    Search, Plus, X, Shield, Cpu, History, 
    Activity, ArrowRightLeft, Power, Leaf, Users, Mail, CreditCard, ChevronRight, Hash, Globe
} from "lucide-react";
import useSWR from 'swr';
import ImpactCard from "../components/ImpactCard";
import DetailPanel from "../components/DetailPanel";
import { usePageTitle } from "../components/PageTitleContext";
import IdentityHeader from "@shared/components/IdentityHeader";
import Tooltip from "../components/Tooltip";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ClientsPage() {
    usePageTitle("Mesh Customers", "Monitor enterprise and retail compute consumption across the network.");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClient, setSelectedClient] = useState<null | any>(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editData, setEditData] = useState({ name: 'Enterprise Mesh', email: 'ops@enterprise.mesh', standing: 'High-Performance' });

    // Use simulation-aware proxy for mesh customers
    const { data: clientsData, isLoading } = useSWR('/api/clients/all', fetcher, { refreshInterval: 5000, fallbackData: [] });
    
    const [activeTab, setActiveTab] = useState("all");
    const [sortBy, setSortBy] = useState("id");

    const displayClients = (clientsData || []).filter((c: any) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return (
            c.id?.toLowerCase().includes(q) ||
            c.name?.toLowerCase().includes(q) ||
            c.email?.toLowerCase().includes(q) ||
            c.postcode?.toLowerCase().includes(q) ||
            c.telephone?.toLowerCase().includes(q) ||
            c.dna?.toLowerCase().includes(q)
        );
    });

    const activeTasks = [
        { id: 'TSK-990', purpose: 'LLM Fine-tuning', nodes: 8, status: 'Running' },
        { id: 'TSK-102', purpose: '3D Render Node', nodes: 4, status: 'Running' },
        { id: 'TSK-441', purpose: 'Hash Verification', nodes: 12, status: 'Paused' },
    ];

    return (
        <>
            <main className="flex-1 p-8 pt-24 overflow-y-auto pb-24 relative space-y-6 focus:outline-none">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                    <div className="flex-1" />
                        
                        <div className="flex bg-white/[0.03] border border-wnode-border-neutral p-1 rounded-[5px]">
                            <button 
                                onClick={() => setActiveTab("all")}
                                className={`px-4 py-1.5 rounded-[4px] text-[11px] font-normal transition-all uppercase tracking-widest ${activeTab === "all" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
                            >
                                All Accounts
                            </button>
                            <button 
                                onClick={() => setActiveTab("integrity")}
                                className={`px-4 py-1.5 rounded-[4px] text-[11px] font-normal transition-all uppercase tracking-widest ${activeTab === "integrity" ? "bg-red-500/10 text-red-500" : "text-white/40 hover:text-white"}`}
                            >
                                Integrity Flags
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row xl:items-center gap-4 mb-8">
                        <div className="flex-1 relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#22D3EE] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Search client, ID, name, postcode, telephone, email"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/[0.03] border border-wnode-border-neutral rounded-[5px] pl-10 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-[#22D3EE]/50 transition-all font-normal"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[11px] text-white/40 uppercase tracking-widest">Sort:</span>
                            <div className="flex bg-white/[0.03] border border-wnode-border-neutral p-1 rounded-[5px]">
                                <button 
                                    onClick={() => setSortBy("id")}
                                    className={`px-3 py-1 rounded-[3px] text-[11px] uppercase tracking-tighter ${sortBy === "id" ? "bg-[#22D3EE] text-black" : "text-white/40"}`}
                                >
                                    Identity
                                </button>
                                <button 
                                    onClick={() => setSortBy("health")}
                                    className={`px-3 py-1 rounded-[3px] text-[11px] uppercase tracking-tighter ${sortBy === "health" ? "bg-[#22D3EE] text-black" : "text-white/40"}`}
                                >
                                    Usage
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/[0.01] border border-wnode-border-neutral rounded-[5px] overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-wnode-border-neutral bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] font-normal text-white/40 uppercase tracking-widest">
                                        <Tooltip text="Authoritative customer identity and contact information">
                                            Client WUID
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-normal text-white/40 uppercase tracking-widest">
                                        <Tooltip text="Aggregate compute consumption for the current billing cycle">
                                            Monthly Consumption
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-normal text-white/40 uppercase tracking-widest">
                                        <Tooltip text="Current billing standing and credit verification">
                                            Billing Status
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-normal text-white/40 uppercase tracking-widest">
                                        <Tooltip text="Number of active compute tasks currently provisioned by this client">
                                            Active Jobs
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-4 text-[10px] font-normal text-white/40 uppercase tracking-widest text-left">
                                        <Tooltip text="Global account integrity and operational status">
                                            Standing
                                        </Tooltip>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {displayClients.map((row: any) => (
                                    <tr 
                                        key={row.id} 
                                        onClick={() => setSelectedClient(row)}
                                        className="hover:bg-white/[0.03] cursor-pointer group transition-all duration-300 relative"
                                    >
                                        <td className="px-6 py-5 relative">
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#22D3EE] opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_#22D3EE]" />
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[14px] font-normal text-white group-hover:text-[#22D3EE] transition-colors">{row.name || 'Anonymous Client'}</span>
                                                <span className="text-[10px] text-white/40 font-mono italic">{row.email || row.id}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[14px] text-[#22D3EE] font-mono">{(row.consumption || (Math.random() * 50)).toFixed(2)} TH/s</span>
                                                <span className="text-[9px] text-white/40 uppercase tracking-tighter">Current Cycle</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-white/40" />
                                                <span className={`text-[11px] font-bold tracking-widest uppercase ${row.billing_status === 'Verified' ? 'text-green-500' : 'text-yellow-500'}`}>
                                                    {row.billing_status || 'Verified'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Cpu className="w-4 h-4 text-white/40" />
                                                <span className="text-[13px] font-mono text-white">{row.active_jobs || Math.floor(Math.random() * 10)} Jobs</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-left">
                                            <div className="flex items-center justify-start gap-2.5">
                                                <Tooltip text={row.status === 'active' ? "Account in good standing" : "Account requires attention"}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${row.status === 'active' || !row.status ? 'bg-[#22D3EE] shadow-[0_0_8px_#22D3EE]' : 'bg-red-500/50'}`} />
                                                </Tooltip>
                                                <span className={`text-[11px] uppercase tracking-[0.2em] font-bold ${row.status === 'active' || !row.status ? 'text-[#22D3EE]' : 'text-red-400'}`}>{row.status || 'Active'}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </main>

                <DetailPanel
                    isOpen={!!selectedClient}
                    onClose={() => { setSelectedClient(null); setIsEditMode(false); }}
                    title="Client Infrastructure Insight"
                    subtitle={`Protocol ID: ${selectedClient?.id}`}
                    footer={
                        <div className="flex flex-col gap-3">
                            {selectedClient?.status !== 'Active' && (
                                <button 
                                    onClick={() => alert('Account Restored')}
                                    className="w-full py-3 bg-[#22D3EE] text-black rounded-[5px] text-[13px] font-bold shadow-[0_0_20px_#22D3EE33] hover:brightness-110 transition-all uppercase tracking-widest"
                                >
                                    Authorize & Release Account
                                </button>
                            )}
                            <div className="flex gap-3">
                                {isEditMode ? (
                                    <>
                                        <button onClick={() => setIsEditMode(false)} className="flex-1 py-3 bg-white/5 border border-wnode-border-neutral rounded-[5px] text-[13px] text-white/40 transition-colors">Discard</button>
                                        <button onClick={() => setIsEditMode(false)} className="flex-1 py-3 bg-[#22D3EE]/20 border border-[#22D3EE]/40 rounded-[5px] text-[13px] text-[#22D3EE] font-medium transition-colors">Save Updates</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditMode(true)} className="w-full py-3 border border-wnode-border-neutral bg-white/[0.02] rounded-[5px] text-[12px] text-white/60 hover:bg-white/5 transition-colors uppercase tracking-widest">Adjust Profile Context</button>
                                )}
                            </div>
                        </div>
                    }
                >
                    {selectedClient && (
                        <div className="space-y-10">
                            {/* Profile Info */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 text-[12px] text-white/60 uppercase tracking-widest">
                                    <Shield className="w-4 h-4 text-[#22D3EE]" />
                                    <span>Identity Overview</span>
                                </div>
                                <div className="bg-black/40 border border-wnode-border-separator rounded-[5px] p-5 space-y-4">
                                    <div className="flex justify-between items-center text-[14px]">
                                        <span className="text-white/40 font-normal">Provider Linkage</span>
                                        {isEditMode ? (
                                            <input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="bg-black border border-wnode-border-neutral rounded-[3px] px-3 py-1 text-white text-[13px] w-40 focus:border-[#22D3EE]/50" />
                                        ) : (
                                            <span className="text-white font-normal">{editData.name}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center text-[14px]">
                                        <span className="text-white/40 font-normal">Contact Root</span>
                                        {isEditMode ? (
                                            <input value={editData.email} onChange={(e) => setEditData({...editData, email: e.target.value})} className="bg-black border border-wnode-border-neutral rounded-[3px] px-3 py-1 text-white text-[13px] w-40 focus:border-[#22D3EE]/50" />
                                        ) : (
                                            <span className="text-white/60 font-mono text-[12px]">{editData.email}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center text-[14px]">
                                        <span className="text-white/40 font-normal">Economic Standing</span>
                                        <span className="text-[#22D3EE] uppercase tracking-tighter text-[11px] border border-[#22D3EE]/20 px-2 py-0.5 rounded-[2px]">{editData.standing}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Active Workload */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 text-[12px] text-white/60 uppercase tracking-widest">
                                    <Cpu className="w-4 h-4 text-purple-400" />
                                    <span>Compute Lifecycle</span>
                                </div>
                                <div className="space-y-3">
                                    {activeTasks.map(task => (
                                        <div key={task.id} className="p-4 bg-white/[0.02] border border-wnode-border-neutral rounded-[5px] flex items-center justify-between transition-all hover:bg-white/[0.04]">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[13px] text-white font-normal">{task.purpose}</span>
                                                <span className="text-[10px] text-white/40 font-mono flex items-center gap-1.5 uppercase-none">
                                                    <Hash className="w-3 h-3 opacity-50" /> {task.id} • Clusters: {task.nodes}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <button className="p-1.5 bg-[#22D3EE]/5 text-[#22D3EE]/60 hover:text-[#22D3EE] rounded-[3px] transition-all">
                                                    <ArrowRightLeft className="w-3.5 h-3.5" />
                                                </button>
                                                <div className={`w-1.5 h-1.5 rounded-full ${task.status === 'Running' ? 'bg-[#22D3EE]' : 'bg-slate-700'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Environmental Index */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 text-[12px] text-white/60 uppercase tracking-widest">
                                    <Leaf className="w-4 h-4 text-emerald-500" />
                                    <span>Impact Audit</span>
                                </div>
                                <ImpactCard 
                                    carbonSaved={parseFloat(selectedClient.co2)}
                                    kmAvoided={parseFloat(selectedClient.co2) * 5.7}
                                    treeDays={parseFloat(selectedClient.co2) / 0.06}
                                    isActive={selectedClient.status === 'Active'}
                                />
                            </section>

                            {/* Financial Audit */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-2 text-[12px] text-white/60 uppercase tracking-widest">
                                    <CreditCard className="w-4 h-4 text-orange-400" />
                                    <span>Consumption History</span>
                                </div>
                                <div className="bg-black/40 border border-wnode-border-separator rounded-[5px] divide-y divide-white/5">
                                    {[
                                        { date: '2025.03.20', amount: '$1,200.00', units: '1.2M TH/s' },
                                        { date: '2025.03.12', amount: '$450.00', units: '450K TH/s' },
                                    ].map((buy, i) => (
                                        <div key={i} className="p-4 flex justify-between items-center group hover:bg-white/[0.01] transition-all">
                                            <div className="flex flex-col">
                                                <span className="text-[13px] text-white font-normal">{buy.amount}</span>
                                                <span className="text-[10px] text-white/40 font-normal uppercase tracking-tighter">{buy.units}</span>
                                            </div>
                                            <span className="text-white/40 font-mono text-[11px]">{buy.date}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        </div>
                    )}
                </DetailPanel>
        </>
    );
}
