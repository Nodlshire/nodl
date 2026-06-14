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
    const [identityFilter, setIdentityFilter] = useState("All");
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
            const [nodlrsRes, clientsRes, integrationsRes] = await Promise.all([
                fetch('/api/nodlrs/all'),
                fetch('/api/clients/all'),
                fetch('/api/integrations/all')
            ]);
            
            let nodlrs: CrmPerson[] = [];
            let clients: CrmPerson[] = [];
            let integrations: CrmPerson[] = [];
            
            if (nodlrsRes.ok) {
                const data = await nodlrsRes.json();
                const raw = Array.isArray(data) ? data : (data?.nodlrs || []);
                nodlrs = raw.map((r: any) => ({
                    wuid: r.protocolId || r.id || "W-UNKNOWN",
                    name: r.displayName || r.name || r.email || "Unknown Identity",
                    email: r.email,
                    createdAt: r.createdAt || new Date().toISOString(),
                    lastContact: r.lastContact || r.createdAt || new Date().toISOString(),
                    isNodlr: true,
                    isMeshCustomer: !!r.isMeshCustomer,
                    isFounderOrPartner: !!r.isFounder,
                    isMeshInt: !!r.integration_path || !!r.isIntegration || !!r.isMeshInt,
                    activeNodes: Number(r.nodeCount || 0),
                    l1Affiliates: 0,
                    l2Affiliates: 0,
                    affiliateReferrer: r.referrerWuid || (r.isFounder ? "Founder" : "Partner"),
                    events: r.events || [],
                    notes: r.notes || []
                }));
            }

            if (clientsRes.ok) {
                const data = await clientsRes.json();
                const raw = Array.isArray(data) ? data : (data?.clients || []);
                clients = raw.map((r: any) => ({
                    wuid: r.id || "W-MESH-UNKNOWN",
                    name: r.name || r.email || "Mesh Client",
                    email: r.email,
                    createdAt: r.createdAt || new Date().toISOString(),
                    lastContact: r.lastContact || r.createdAt || new Date().toISOString(),
                    isNodlr: !!r.isNodlr,
                    isMeshCustomer: true,
                    isFounderOrPartner: !!r.isFounder,
                    isMeshInt: !!r.integration_path || !!r.isIntegration || !!r.isMeshInt,
                    activeNodes: 0,
                    l1Affiliates: 0,
                    l2Affiliates: 0,
                    affiliateReferrer: r.referrerWuid || "Partner",
                    events: r.events || [],
                    notes: r.notes || []
                }));
            }

            if (integrationsRes.ok) {
                const data = await integrationsRes.json();
                const raw = Array.isArray(data) ? data : (data?.integrations || data?.data || []);
                integrations = raw.map((r: any) => ({
                    wuid: r.id || r.slug || "W-UNKNOWN",
                    name: r.name || r.integration_path || r.slug || "Integration",
                    email: undefined,
                    createdAt: r.joinedAt || r.createdAt || new Date().toISOString(),
                    lastContact: r.activatedAt || r.updatedAt || new Date().toISOString(),
                    isNodlr: false,
                    isMeshCustomer: false,
                    isFounderOrPartner: false,
                    isMeshInt: true,
                    activeNodes: 0,
                    l1Affiliates: 0,
                    l2Affiliates: 0,
                    affiliateReferrer: "System",
                    events: [],
                    notes: []
                }));
            }

            const unifiedMap = new Map<string, CrmPerson>();
            [...nodlrs, ...clients, ...integrations].forEach(p => {
                if (unifiedMap.has(p.wuid)) {
                    const existing = unifiedMap.get(p.wuid)!;
                    unifiedMap.set(p.wuid, {
                        ...existing,
                        isNodlr: existing.isNodlr || p.isNodlr,
                        isMeshCustomer: existing.isMeshCustomer || p.isMeshCustomer,
                        isFounderOrPartner: existing.isFounderOrPartner || p.isFounderOrPartner,
                        isMeshInt: existing.isMeshInt || p.isMeshInt
                    });
                } else {
                    unifiedMap.set(p.wuid, p);
                }
            });

            const merged = Array.from(unifiedMap.values());
            setCrmRecords(merged);
            localStorage.setItem('crm_records', JSON.stringify(merged));
            verifyReferralTree(merged);
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
            
            if (!matchesSearch) return false;

            switch(identityFilter) {
                case "Nodlr": return r.isNodlr && !r.isMeshCustomer;
                case "Mesh": return r.isMeshCustomer && !r.isMeshInt && !r.isNodlr;
                case "Mesh Int": return !!r.isMeshInt;
                case "Nodlr/Mesh": return r.isNodlr && r.isMeshCustomer;
                case "All":
                default:
                    return true;
            }
        });
    }, [crmRecords, searchQuery, identityFilter]);

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

    const handleUpdatePerson = (updated: CrmPerson) => {
        const newRecords = crmRecords.map(p => p.wuid === updated.wuid ? updated : p);
        setCrmRecords(newRecords);
        localStorage.setItem('crm_records', JSON.stringify(newRecords));
        verifyReferralTree(newRecords);
        if (selectedPerson?.wuid === updated.wuid) {
            setSelectedPerson(updated);
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
        <div className="flex-1 p-8 overflow-y-auto pb-24 relative custom-scrollbar h-full">
            {/* Redundant body title removed per Phase 2.5 instructions */}

            {/* Rebuilt Dashboard Panels (Phase 2.5 - Visual Polish) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
                <CrmMetricCard 
                    label="Total Clients" 
                    value={dashboardStats.totalClients} 
                    icon={Users} 
                    color="text-blue-400" 
                    border="border-blue-500/30"
                    subtext="Aggregated Contacts"
                    tooltip="Total unique identities (Nodlrs, Clients, Partners)."
                />
                <CrmMetricCard 
                    label="Active Clients" 
                    value={dashboardStats.activeClients} 
                    icon={Handshake} 
                    color="text-green-400" 
                    border="border-green-500/30"
                    subtext="Last 30 Days"
                    tooltip="Users with interaction in the last 30 days."
                />
                <CrmMetricCard 
                    label="New Clients" 
                    value={dashboardStats.newClients} 
                    icon={TrendingUp} 
                    color="text-teal-400" 
                    border="border-teal-500/30"
                    subtext="Growth Indicator"
                    tooltip="Records created in the last 30 days."
                />
                <CrmMetricCard 
                    label="Active Nodes" 
                    value={dashboardStats.totalNodes} 
                    icon={Network} 
                    color="text-yellow-500" 
                    border="border-yellow-500/30"
                    subtext="Network Registry"
                    tooltip="Real-time count of active nodes linked to CRM users."
                />
            </div>

            <div className="card-sovereign p-6 flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="flex-1 w-full relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22D3EE] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search Unified Database: Name, Email, or WUID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-slate-700 font-normal"
                    />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <select 
                        value={identityFilter}
                        onChange={(e) => setIdentityFilter(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-[5px] px-4 py-3 text-[13px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all outline-none"
                    >
                        <option value="All">All</option>
                        <option value="Nodlr">Nodlr</option>
                        <option value="Mesh">Mesh</option>
                        <option value="Mesh Int">Mesh Int</option>
                        <option value="Nodlr/Mesh">Nodlr/Mesh</option>
                    </select>
                </div>
                <div className="flex items-center gap-3">
                    <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3 rounded-[5px] flex items-center gap-3 text-[13px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Plus className="w-4 h-4" />
                        Add Record
                    </button>
                </div>
            </div>

            <div className="bg-white/[0.01] border border-white/10 rounded-[5px] overflow-hidden">
                <div className="grid grid-cols-[180px_1fr_120px_120px_120px] border-b border-white/10 bg-white/[0.02] px-6 py-4">
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
                            className="grid grid-cols-[180px_1fr_120px_120px_120px] items-center px-6 py-4 rounded-[4px] transition-all cursor-pointer hover:bg-white/[0.04] border border-transparent hover:border-white/10 group"
                            title={`Inspect ${person.name}`}
                        >
                            <span className="text-[12px] font-mono text-slate-400 group-hover:text-white transition-colors">{person.wuid}</span>
                            <div className="flex items-center gap-4 overflow-hidden">
                                <span className="text-[14px] text-white font-medium truncate">{person.name}</span>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {person.isNodlr && person.isMeshCustomer && !person.isMeshInt && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[8px] font-bold uppercase tracking-widest">NODLR/MESH</div>
                                    )}
                                    {person.isNodlr && (!person.isMeshCustomer || person.isMeshInt) && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-widest">NODLR</div>
                                    )}
                                    {person.isMeshInt && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-[#f7c6ff]/10 border border-[#f7c6ff]/20 text-[#f7c6ff] text-[8px] font-bold uppercase tracking-widest">MESH INT</div>
                                    )}
                                    {person.isMeshCustomer && !person.isNodlr && !person.isMeshInt && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-green-500/10 border border-green-500/20 text-green-400 text-[8px] font-bold uppercase tracking-widest">MESH</div>
                                    )}
                                    {person.isFounderOrPartner && (
                                        <div className="px-1.5 py-0.5 rounded-[2px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[8px] font-bold uppercase tracking-widest">GOLD</div>
                                    )}
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="text-[14px] font-mono text-white">{person.activeNodes}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[14px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">{person.l1Affiliates}</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[14px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors">{person.l2Affiliates}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CrmDetailPanel 
                isOpen={!!selectedPerson}
                onClose={() => setSelectedPerson(null)}
                person={selectedPerson}
                onUpdate={handleUpdatePerson}
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
                <span className="text-[8px] text-slate-500 uppercase tracking-widest font-normal opacity-80">{subtext}</span>
            </div>
        </div>
    );
}
