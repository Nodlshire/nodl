"use client";

import React, { useState, useEffect } from "react";
import { 
    Zap, DollarSign, Search, Filter, ChevronRight, HardDrive, 
    ShieldAlert, ShieldCheck, Mail, Lock, BarChart3, User, Server,
    RefreshCw, Plus, X, Shield, Users
} from "lucide-react";
import DetailPanel from "../components/DetailPanel";
import { usePageTitle } from "../components/PageTitleContext";

export default function ProvidersPage() {
    usePageTitle("nodl’r ecosystem management", "Monitor and manage all provider accounts in the global registry.");
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProvider, setSelectedProvider] = useState<any>(null);
    const [providerDetails, setProviderDetails] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [tags, setTags] = useState<string[]>([
        "High-Uptime",
        "Verified Stripe",
        "Premium Hardware"
    ]);
    const [addingTag, setAddingTag] = useState(false);
    const [newTag, setNewTag] = useState("");

    const addTag = () => {
        if (newTag.trim() !== "") {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
        setAddingTag(false);
    };

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const fetchProviders = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/nodlrs/all');
            if (res.ok) {
                const data = await res.json();
                setProviders(data);
            }
        } catch (error) {
            console.error('Failed to fetch providers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProviders();
    }, []);

    useEffect(() => {
        if (selectedProvider) {
            const fetchDetails = async () => {
                try {
                    const res = await fetch(`/api/nodlrs/${selectedProvider.id}`);
                    if (res.ok) {
                        setProviderDetails(await res.json());
                    }
                } catch (error) {
                    console.error('Failed to fetch details:', error);
                }
            };
            fetchDetails();
        } else {
            setProviderDetails(null);
        }
    }, [selectedProvider]);

    const filteredProviders = providers.filter(p => 
        (p.displayName || "").toLowerCase().includes(search.toLowerCase()) || 
        (p.email || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>

            <main className="p-8 w-full flex flex-col space-y-8 overflow-y-auto pb-24">

                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-[6px] w-full flex-wrap">
                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Region</option>
                        <option>EU</option>
                        <option>US</option>
                        <option>Asia</option>
                        <option>Global</option>
                    </select>

                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Date Joined</option>
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>All Time</option>
                    </select>

                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Earnings</option>
                        <option>$0–$500</option>
                        <option>$500–$5,000</option>
                        <option>$5,000–$25,000</option>
                        <option>$25,000+</option>
                    </select>

                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Nodl Count</option>
                        <option>0</option>
                        <option>1–5</option>
                        <option>6–20</option>
                        <option>21–50</option>
                        <option>50+</option>
                    </select>

                    <select className="w-fit transition-all bg-transparent border-none">
                        <option>Filter by Account Type</option>
                        <option>Individual</option>
                        <option>Company</option>
                        <option>DAO</option>
                        <option>Trust</option>
                        <option>Partnership</option>
                        <option>Foundation</option>
                    </select>

                    <div className="flex-1" />
                    <div className="relative">
                        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input 
                            type="text"
                            placeholder="Search all provider accounts..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-4 w-64 transition-all bg-transparent border-none"
                        />
                    </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-[5px] overflow-hidden backdrop-blur-sm w-full text-left space-y-2">
                    <table className="w-full text-left">
                        <thead className="bg-white/[0.02] border-b border-white/5">
                            <tr>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Nodl’r Identity</th>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Global Status</th>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Active Nodls</th>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Revenue (MTD)</th>
                                <th className="px-6 py-4 text-slate-400 text-[12px] uppercase tracking-widest">Last Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProviders.map((p) => (
                                <tr 
                                    key={p.id} 
                                    onClick={() => setSelectedProvider(p)}
                                    className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-5 text-slate-200 text-[14px]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-[5px] bg-[#22D3EE]/5 border border-[#22D3EE]/20 flex items-center justify-center text-[12px] font-bold text-[#22D3EE] group-hover:bg-[#22D3EE] group-hover:text-black transition-all">
                                                <Server className="w-5 h-5 text-[#22D3EE] group-hover:text-black" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[14px] font-normal text-white">{p.displayName}</span>
                                                <span className="text-[11px] text-slate-500 font-mono italic">{p.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-200 text-[14px]">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${p.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22C55E]' : 'bg-red-500/50'}`} />
                                                <span className="text-[11px] text-slate-300 capitalize tracking-widest">{p.status}</span>
                                            </div>
                                            <div className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded-[2px] w-fit border ${p.stripeVerification === 'verified' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'}`}>
                                                Stripe {p.stripeVerification}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-200 text-[14px]">
                                        <div className="flex items-center gap-2">
                                            <HardDrive className="w-4 h-4 text-slate-600" />
                                            <span className="text-[15px] font-mono text-white">{p.nodeCount}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-200 text-[14px] font-mono">
                                        <span className="text-[14px] text-[#22D3EE] font-normal">$0.00</span>
                                    </td>
                                    <td className="px-6 py-5 text-slate-200 text-[14px]">
                                        <span className="text-[12px] text-slate-500 font-mono">--</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProviders.length === 0 && !loading && (
                        <div className="py-24 flex flex-col items-center justify-center space-y-4">
                            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-full">
                                <Server className="w-8 h-8 text-slate-700" />
                            </div>
                            <p className="text-[14px] text-slate-500 font-normal">No provider accounts found in registry.</p>
                        </div>
                    )}
                    {loading && <div className="py-20 flex justify-center"><RefreshCw className="w-8 h-8 animate-spin text-[#22D3EE] opacity-20" /></div>}
                </div>
            </main>

            <DetailPanel
                isOpen={!!selectedProvider}
                onClose={() => setSelectedProvider(null)}
                title="Nodl'r Account Details"
                subtitle={`Protocol ID: ${providerDetails?.protocolId || selectedProvider?.protocolId || selectedProvider?.id}`}
                footer={
                    <div className="grid grid-cols-3 gap-2">
                        <button className="py-2 px-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[3px] text-[10px] text-white font-bold uppercase tracking-widest transition-all">
                            Edit Profile
                        </button>
                        <button className="py-2 px-3 bg-[#22D3EE]/10 hover:bg-[#22D3EE]/20 border border-[#22D3EE]/20 rounded-[3px] text-[10px] text-[#22D3EE] font-bold uppercase tracking-widest transition-all">
                            Export Data
                        </button>
                        <button className="py-2 px-3 bg-red-400/5 hover:bg-red-400/10 border border-red-400/10 rounded-[3px] text-[10px] text-red-400 font-bold uppercase tracking-widest transition-all">
                            Suspend
                        </button>
                    </div>
                }
            >
                {providerDetails ? (
                    <div className="space-y-8">
                        {/* ── Identity ────────────────────────────────── */}
                        <Section icon={<User className="w-4 h-4 text-[#22D3EE]" />} title="Identity">
                            <Field label="Display Name" value={providerDetails.displayName} />
                            <Field label="Email" value={providerDetails.email} mono />
                            <Field label="Role" value={providerDetails.role} tag />
                            <Field label="Protocol ID" value={providerDetails.protocolId} mono cyan />
                            <Field label="Net ID" value={providerDetails.netId} mono />
                            <Field label="User ID" value={providerDetails.id} mono />
                        </Section>

                        {/* ── Profile ─────────────────────────────────── */}
                        <Section icon={<Users className="w-4 h-4 text-[#22D3EE]" />} title="Profile">
                            <Field label="Bio / Title" value={providerDetails.bio || '—'} />
                            <Field label="Organization" value={providerDetails.organization || '—'} />
                            <Field label="Region" value={providerDetails.region} />
                        </Section>

                        {/* ── Network / Node Info ─────────────────────── */}
                        <Section icon={<Server className="w-4 h-4 text-[#22D3EE]" />} title="Network / Node Info">
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <StatBlock label="Total Nodes" value={providerDetails.nodeCount} />
                                <StatBlock label="Active" value={providerDetails.activeNodes} color="text-green-400" />
                                <StatBlock label="Peers" value={providerDetails.connectedPeers} color="text-[#22D3EE]" />
                            </div>
                            <Field label="Node Status" value={providerDetails.nodeStatusSummary} />
                            <Field label="Architecture" value={providerDetails.networkArchitecture} />
                            <Field label="Last Seen" value={providerDetails.lastSeen ? new Date(providerDetails.lastSeen).toLocaleString() : '—'} mono />
                        </Section>

                        {/* ── Protocol / Registry ────────────────────── */}
                        <Section icon={<Shield className="w-4 h-4 text-[#22D3EE]" />} title="Protocol / Registry">
                            <Field label="Registry Entry ID" value={providerDetails.registryEntryId} mono />
                            <Field label="Registry Status" value={providerDetails.registryStatus} tag />
                            <Field label="Protocol Version" value={providerDetails.protocolVersion} mono />
                            <Field label="Capabilities" value={providerDetails.protocolCapabilities?.join(', ') || '—'} />
                        </Section>

                        {/* ── Financial / Yield ───────────────────────── */}
                        <Section icon={<DollarSign className="w-4 h-4 text-green-400" />} title="Financial / Yield">
                            <div className="bg-[#22D3EE]/5 border border-[#22D3EE]/20 p-4 rounded-[5px] mb-3">
                                <span className="text-[9px] text-slate-400 uppercase tracking-widest block mb-1">Current Balance</span>
                                <span className="text-[24px] font-mono text-white">${((providerDetails.accruedFounderBalance || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <StatBlock label="Pending" value={`$${((providerDetails.pendingPayouts || 0) / 100).toLocaleString()}`} color="text-yellow-400" />
                                <StatBlock label="Lifetime" value={`$${((providerDetails.lifetimeEarnings || 0) / 100).toLocaleString()}`} color="text-green-400" />
                            </div>
                            <Field label="Commission Rate" value={providerDetails.commissionRate ? `${(providerDetails.commissionRate * 100).toFixed(1)}%` : '—'} />
                            <Field label="Payout Frequency" value={providerDetails.payoutFrequency} />
                            <Field label="Stripe Status" value={providerDetails.stripeVerification} tag />
                            {providerDetails.recentPayouts?.length > 0 && (
                                <div className="mt-2">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Recent Payouts</span>
                                    {providerDetails.recentPayouts.map((p: any) => (
                                        <div key={p.id} className="flex justify-between items-center py-1.5 border-b border-white/5 text-[11px]">
                                            <span className="text-slate-400 font-mono">{p.id}</span>
                                            <span className="text-white font-mono">${(p.amount / 100).toLocaleString()}</span>
                                            <span className="text-slate-500 font-mono">{new Date(p.date).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Section>

                        {/* ── Security / Auth ────────────────────────── */}
                        <Section icon={<Lock className="w-4 h-4 text-[#22D3EE]" />} title="Security / Auth">
                            <Field label="MFA Enabled" value={providerDetails.mfaEnabled ? '✓ Enabled' : '✗ Disabled'} tag={providerDetails.mfaEnabled} />
                            <Field label="Last Login" value={providerDetails.lastLogin ? new Date(providerDetails.lastLogin).toLocaleString() : '—'} mono />
                            <Field label="Session Status" value={providerDetails.sessionStatus} tag />
                            <Field label="Permissions" value={providerDetails.permissions?.join(', ') || '—'} />
                        </Section>

                        {/* ── Telemetry / Health ─────────────────────── */}
                        <Section icon={<Zap className="w-4 h-4 text-[#22D3EE]" />} title="Telemetry / Health">
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <StatBlock label="Latency" value={`${providerDetails.apiLatency || 0}ms`} color="text-[#22D3EE]" />
                                <StatBlock label="Integrity" value={`${providerDetails.integrityScore || 0}`} color="text-white" />
                                <StatBlock label="Errors" value={providerDetails.errorCount || 0} color={providerDetails.errorCount > 0 ? 'text-red-400' : 'text-green-400'} />
                            </div>
                            <Field label="Sync Status" value={providerDetails.syncStatus} tag />
                            <Field label="Storage Mode" value={providerDetails.storageMode} />
                            {providerDetails.recentEvents?.length > 0 && (
                                <div className="mt-2">
                                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">Recent Events</span>
                                    {providerDetails.recentEvents.map((e: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2 py-1 text-[10px] font-mono text-slate-500">
                                            <span className="text-[#22D3EE]/40">[{e.type}]</span>
                                            <span>{e.msg}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Section>

                        {/* ── Metadata ────────────────────────────────── */}
                        <Section icon={<BarChart3 className="w-4 h-4 text-slate-500" />} title="Metadata">
                            <Field label="Created At" value={providerDetails.createdAt ? new Date(providerDetails.createdAt).toLocaleString() : '—'} mono />
                            <Field label="Updated At" value={providerDetails.updatedAt ? new Date(providerDetails.updatedAt).toLocaleString() : '—'} mono />
                            <Field label="Source" value={providerDetails.source} tag />
                        </Section>
                    </div>
                ) : selectedProvider ? (
                    <div className="flex items-center justify-center py-40">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#22D3EE] opacity-20" />
                    </div>
                ) : null}
            </DetailPanel>
        </>
    );
}

// ── Helper Components ────────────────────────────────────────────────────────

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
                {icon}
                <h4 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{title}</h4>
            </div>
            <div className="space-y-0">{children}</div>
        </section>
    );
}

function Field({ label, value, mono, cyan, tag }: { label: string; value: any; mono?: boolean; cyan?: boolean; tag?: boolean }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/[0.03] hover:bg-white/[0.01] px-1 transition-all">
            <span className="text-[11px] text-slate-500 uppercase tracking-wider">{label}</span>
            {tag ? (
                <span className="text-[10px] px-2 py-0.5 rounded-[2px] bg-[#22D3EE]/10 text-[#22D3EE] border border-[#22D3EE]/20 uppercase tracking-widest font-bold">
                    {String(value)}
                </span>
            ) : (
                <span className={`text-[12px] ${cyan ? 'text-[#22D3EE]' : 'text-white'} ${mono ? 'font-mono tracking-tighter' : ''} max-w-[200px] text-right truncate`}>
                    {String(value ?? '—')}
                </span>
            )}
        </div>
    );
}

function StatBlock({ label, value, color = 'text-white' }: { label: string; value: any; color?: string }) {
    return (
        <div className="bg-white/[0.03] border border-white/5 p-3 rounded-[5px] text-center">
            <span className={`text-[16px] font-mono ${color} block`}>{value}</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
    );
}
