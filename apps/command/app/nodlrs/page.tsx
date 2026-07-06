"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { 
    Search, Plus, Shield, Users, 
    RefreshCw, CheckCircle2, Database, Zap, Clock, ShieldAlert,
    User, Mail, Phone, MapPin, Building2, LayoutGrid, Calendar, FileText, ArrowRight, Pin, PinOff,
    Handshake, TrendingUp, Network, PlusCircle, CreditCard, DollarSign, Wallet
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CrmPerson, CrmEvent, CrmNote } from "./types";
import CrmDetailPanel from "./components/CrmDetailPanel";
import { usePageTitle } from "../components/PageTitleContext";



export default function UserCrmPage() {
    // Header Fix (Phase 2.5) - Canonical Application Header
    usePageTitle("COMMAND CENTRE OPERATIONS → User CRM Database", "Authoritative identity and financial ledger registry.");
    
    const [searchQuery, setSearchQuery] = useState("");
    const [identityFilters, setIdentityFilters] = useState<string[]>(["All"]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<CrmPerson | null>(null);
    const [crmRecords, setCrmRecords] = useState<CrmPerson[]>([]);
    const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Referral Tree Verification Engine
    const verifyReferralTree = useCallback((records: CrmPerson[]) => {
        console.log("CRM -> Starting Referral Tree Verification...");
        let errors: string[] = [];
        
        records.forEach(person => {
            const referrer = person.affiliateReferrer;
            if (referrer && referrer !== "Founder") {
                const parent = records.find(r => r.wuid === referrer);
                if (!parent) {
                    errors.push(`Orphan found: ${person.name} (${person.wuid}) refers to missing WUID ${referrer}`);
                }
                if (referrer === person.wuid) {
                    errors.push(`Circular reference: ${person.name} (${person.wuid}) refers to self`);
                }
            }
        });

        if (errors.length === 0) {
            console.log("%cReferral Tree Integrity: PASS", "color: #22D3EE; font-weight: bold");
            return { pass: true, errors: [] };
        } else {
            console.warn("Referral Tree Integrity: FAIL (Known Data Integrity Issues)");
            errors.forEach(e => console.warn(`[Referral Warning] ${e} - This is a documented legacy data orphan.`));
            return { pass: false, errors };
        }
    }, []);

    // Initial Load
    useEffect(() => {
        fetchData();
    }, [verifyReferralTree]);

    // Unified Fetch
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/v1/nodlrs', { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setCrmRecords(data);
                localStorage.setItem('crm_records', JSON.stringify(data));
                verifyReferralTree(data);
            }
        } catch (error) {
            console.error('CRM Hub -> Unified Fetch Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredRecords = useMemo(() => {
        return crmRecords.filter(r => {
            const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                (r.email || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                r.wuid.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (identityFilters.includes("All") || identityFilters.length === 0) return true;

            const matchMesh = identityFilters.includes("Mesh") && r.isMeshCustomer;
            const matchNodlr = identityFilters.includes("Nodlr") && r.isNodlr;
            const matchFounder = identityFilters.includes("Founder") && r.isFounderOrPartner;
            const matchOwner = identityFilters.includes("Owner") && r.isOwner;
            const matchCMD = identityFilters.includes("CMD") && r.isCommand;
            const matchMeshIn = identityFilters.includes("Mesh In") && r.isMeshInt;
            const matchNodlrIn = identityFilters.includes("Nodlr In") && r.isNodlrInt;
            const matchTechFounder = identityFilters.includes("Tech Founder") && r.isTechFounder;

            return matchMesh || matchNodlr || matchFounder || matchOwner || matchCMD || matchMeshIn || matchNodlrIn || matchTechFounder;
        });
    }, [crmRecords, searchQuery, identityFilters]);

    const dashboardStats = useMemo(() => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));

        const totalClients = crmRecords.length;
        const activeClients = crmRecords.filter(p => {
            const last = p.lastContact ? new Date(p.lastContact) : new Date(0);
            return last >= thirtyDaysAgo;
        }).length;
        const newClients = crmRecords.filter(p => {
            const created = new Date(p.createdAt);
            return created >= thirtyDaysAgo;
        }).length;
        const totalNodes = crmRecords.reduce((acc, p) => acc + (p.activeNodes || 0), 0);

        return { totalClients, activeClients, newClients, totalNodes };
    }, [crmRecords]);

    const handleUpdate = (updatedPerson?: CrmPerson) => {
        if (updatedPerson) {
            // Keep the slide-out open with the updated person
            setSelectedPerson(updatedPerson);
            const newRecords = crmRecords.map(p => p.wuid === updatedPerson.wuid ? updatedPerson : p);
            setCrmRecords(newRecords);
            localStorage.setItem('crm_records', JSON.stringify(newRecords));
            verifyReferralTree(newRecords);
        } else {
            // Fallback: re-fetch the person from backend
            fetchData();
        }
    };

    const handleSelectPerson = (person: CrmPerson) => {
        setNavigationHistory([person.wuid]);
        setSelectedPerson(person);
    };

    const handleNavigateToReferrer = (wuid: string) => {
        const referrer = crmRecords.find(r => r.wuid === wuid);
        if (referrer) {
            setNavigationHistory(prev => [...prev, wuid]);
            setSelectedPerson(referrer);
        }
    };

    const handleBack = () => {
        if (navigationHistory.length > 1) {
            const newHistory = [...navigationHistory];
            newHistory.pop();
            const prevWuid = newHistory[newHistory.length - 1];
            const prevPerson = crmRecords.find(r => r.wuid === prevWuid);
            if (prevPerson) {
                setNavigationHistory(newHistory);
                setSelectedPerson(prevPerson);
            }
        }
    };

    return (
        <div className="flex-1 p-8 pt-6 overflow-y-auto pb-24 relative custom-scrollbar h-full space-y-6">
            {/* Redundant body title removed per Phase 2.5 instructions */}

            {/* Rebuilt Dashboard Panels (Phase 2.5 - Visual Polish) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <CrmMetricCard 
                    label="Total Clients" 
                    value={dashboardStats.totalClients} 
                    icon={Icon => <Users className="w-3.5 h-3.5" />}
                    color="text-blue-400" 
                    border="border-blue-400/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    subtext="Aggregated Contacts"
                    tooltip="Total unique identities (Nodlrs, Clients, Partners)."
                />
                <CrmMetricCard 
                    label="Active Clients" 
                    value={dashboardStats.activeClients} 
                    icon={Icon => <Handshake className="w-3.5 h-3.5" />}
                    color="text-green-400" 
                    border="border-green-400/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    subtext="Last 30 Days"
                    tooltip="Users with interaction in the last 30 days."
                />
                <CrmMetricCard 
                    label="New Clients" 
                    value={dashboardStats.newClients} 
                    icon={Icon => <TrendingUp className="w-3.5 h-3.5" />}
                    color="text-teal-400" 
                    border="border-[#22D3EE]/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    subtext="Growth Indicator"
                    tooltip="Records created in the last 30 days."
                />
                <CrmMetricCard 
                    label="Active Nodes" 
                    value={dashboardStats.totalNodes} 
                    icon={Icon => <Network className="w-3.5 h-3.5" />}
                    color="text-yellow-500" 
                    border="border-amber-400/40 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
                    subtext="Network Registry"
                    tooltip="Real-time count of active nodes linked to CRM users."
                />
            </div>

            <div className="bg-white/[0.02] shadow-[0_0_20px_rgba(255,255,255,0.05)] p-6 flex flex-col md:flex-row items-center gap-6 rounded-[5px]">
                <div className="flex-1 w-full relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#22D3EE] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search Unified Database: Name, Email, or WUID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/50 border border-wnode-border-neutral rounded-[5px] pl-12 pr-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-white/40 font-normal"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative">
                        <div 
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="bg-black/50 border border-wnode-border-neutral rounded-[5px] px-4 py-3 text-[13px] text-white cursor-pointer hover:border-white/20 transition-all min-w-[140px] flex justify-between items-center"
                        >
                            <span className="truncate pr-4">
                                {identityFilters.includes("All") || identityFilters.length === 0 
                                    ? "All Identities" 
                                    : identityFilters.join(", ")}
                            </span>
                            <span className="text-white/40 text-[10px]">▼</span>
                        </div>

                        <AnimatePresence>
                            {isFilterOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -5 }}
                                    className="absolute top-full mt-2 w-full min-w-[200px] bg-[#0A0A0A] border border-wnode-border-neutral rounded-[5px] shadow-2xl z-50 overflow-hidden"
                                >
                                    <div className="flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {["All", "Mesh", "Nodlr", "Founder", "Owner", "CMD", "Mesh In", "Nodlr In", "Tech Founder"].map(f => (
                                            <div 
                                                key={f}
                                                onClick={() => {
                                                    if (f === "All") {
                                                        setIdentityFilters(["All"]);
                                                    } else {
                                                        setIdentityFilters(prev => {
                                                            const next = prev.filter(x => x !== "All");
                                                            if (next.includes(f)) {
                                                                const filtered = next.filter(x => x !== f);
                                                                return filtered.length === 0 ? ["All"] : filtered;
                                                            }
                                                            return [...next, f];
                                                        });
                                                    }
                                                }}
                                                className="px-4 py-3 hover:bg-white/5 cursor-pointer text-[13px] text-white/80 transition-colors flex items-center justify-between"
                                            >
                                                <span>{f}</span>
                                                {identityFilters.includes(f) && (
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#22D3EE]" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3 rounded-[5px] flex items-center gap-3 text-[13px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Plus className="w-4 h-4" />
                        Add Record
                    </button>
                </div>
            </div>

            <div className="bg-white/[0.01] rounded-[5px] overflow-hidden">
                <div className="grid grid-cols-[180px_1fr_120px_120px_120px] bg-white/[0.02] px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">WUID / Root</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Identity / Role</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Nodes</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">L1 Net</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">L2 Net</span>
                </div>

                <div className="divide-y divide-white/5 p-1 space-y-1">
                    {filteredRecords.map((person) => (
                        <div 
                            key={person.wuid} 
                            onClick={() => handleSelectPerson(person)}
                            className="grid grid-cols-[180px_1fr_120px_120px_120px] items-center px-6 py-4 rounded-[4px] transition-all cursor-pointer hover:bg-white/[0.04] border border-transparent hover:border-wnode-border-hover group"
                            title={`Inspect ${person.name}`}
                        >
                            <span className="text-[12px] font-mono text-white/60 group-hover:text-white transition-colors">{person.wuid}</span>
                            <div className="flex items-center gap-4 overflow-hidden">
                                <span className="text-[14px] text-white font-medium truncate">{person.name}</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {person.isOwner && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-bold uppercase tracking-widest">OWNER</div>
                                    )}
                                    {person.isFounderOrPartner && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-bold uppercase tracking-widest">FOUNDER</div>
                                    )}
                                    {person.isCommand && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-bold uppercase tracking-widest">CMD</div>
                                    )}
                                    {person.isMeshInt && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-bold uppercase tracking-widest">MESH IN</div>
                                    )}
                                    {person.isNodlrInt && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-bold uppercase tracking-widest">NODLR IN</div>
                                    )}
                                    {person.isTechFounder && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-red-500/10 border border-red-500/20 text-red-400 text-[8px] font-bold uppercase tracking-widest">TECH FOUNDER</div>
                                    )}
                                    {person.isMeshCustomer && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-[#22D3EE]/20 border border-[#22D3EE]/50 text-[#22D3EE] text-[8px] font-bold uppercase tracking-widest">MESH</div>
                                    )}
                                    {person.isNodlr && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-[#22D3EE]/20 border border-[#22D3EE]/50 text-[#22D3EE] text-[8px] font-bold uppercase tracking-widest">NODLR</div>
                                    )}
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-[14px] font-mono text-white">{person.activeNodes}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[14px] font-mono text-white/40 group-hover:text-white/80 transition-colors">{person.l1Affiliates}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[14px] font-mono text-white/40 group-hover:text-white/80 transition-colors">{person.l2Affiliates}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CrmDetailPanel 
                isOpen={!!selectedPerson}
                onClose={() => setSelectedPerson(null)}
                person={selectedPerson}
                onUpdate={handleUpdate}
                onNavigate={handleNavigateToReferrer}
                history={navigationHistory}
                onBack={handleBack}
            />
        </div>
    );
}

function CrmMetricCard({ label, value, icon: Icon, color, border, subtext, tooltip }: any) {
    return (
        <div 
            className={`relative bg-white/[0.02] border ${border} rounded-[5px] p-4 flex flex-col gap-1.5 group hover:bg-white/[0.04] transition-all cursor-help overflow-hidden`}
            title={tooltip}
        >
            {/* Phase 2.5: Icon sits top-left, Title sits immediately to the right on SAME baseline */}
            <div className="flex items-center gap-2 mb-0.5">
                <Icon className={`w-3.5 h-3.5 ${color} opacity-80 group-hover:opacity-100 transition-opacity shrink-0`} />
                <span className="text-[10px] text-white uppercase font-bold tracking-[0.1em] truncate leading-none">{label}</span>
            </div>
            
            <div className="flex flex-col items-start justify-center gap-0">
                {/* Phase 2.5: Reduced number size to CMD scale (16px) */}
                <span className="text-[16px] text-white font-mono font-bold leading-tight">{value}</span>
                <span className="text-[8px] text-white/40 uppercase tracking-widest font-normal opacity-80">{subtext}</span>
            </div>
        </div>
    );
}
