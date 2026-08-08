"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Search, Plus, Sliders, RefreshCw } from "lucide-react";
import { usePageTitle } from "../components/PageTitleContext";
import { Integration, fetchIntegrations, fetchIntegration, updateIntegration } from "../lib/integrations";
import IntegrationSlideout from "./IntegrationSlideout";
import Image from "next/image";

export default function IntegrationsPage() {
    usePageTitle("COMMAND CENTRE OPERATIONS → Integrations Registry", "Manage compute network partners, social connections, and system protocols.");
    
    const [searchQuery, setSearchQuery] = useState("");
    const [integrations, setIntegrations] = useState<Integration[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
    const [isSlideoutOpen, setIsSlideoutOpen] = useState(false);
    const [isSlideoutLoading, setIsSlideoutLoading] = useState(false);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await fetchIntegrations();
            // Ensure sorting by name alphabetically as requested
            data.sort((a, b) => a.name.localeCompare(b.name));
            setIntegrations(data);
        } catch (error) {
            console.error("Failed to load integrations:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredIntegrations = useMemo(() => {
        return integrations.filter(i => 
            i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            i.slug.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [integrations, searchQuery]);

    const handleSelectIntegration = async (integration: Integration) => {
        setIsSlideoutOpen(true);
        setIsSlideoutLoading(true);
        try {
            const fullIntegration = await fetchIntegration(integration.id);
            setSelectedIntegration(fullIntegration);
        } catch (error) {
            console.error("Failed to fetch full integration:", error);
            // Fallback to basic details if full fetch fails
            setSelectedIntegration(integration);
        } finally {
            setIsSlideoutLoading(false);
        }
    };

    const handleSaveIntegration = async (id: string, payload: Partial<Integration>) => {
        try {
            const updated = await updateIntegration(id, payload);
            setSelectedIntegration(updated);
            
            setIntegrations(prev => {
                const arr = prev.map(i => i.id === id ? { ...i, ...updated } : i);
                arr.sort((a, b) => a.name.localeCompare(b.name));
                return arr;
            });
        } catch (error) {
            console.error("Failed to save integration:", error);
            throw error; // Rethrow to let Slideout show the error
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto pb-24 relative custom-scrollbar h-full">
            <div className="card-sovereign p-6 flex items-center gap-6 mb-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#22D3EE] transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search Integrations: Name or Slug..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="max-w-full w-full bg-black/50 border border-white/10 rounded-[5px] pl-12 pr-4 py-3 text-[14px] text-white focus:outline-none focus:border-[#22D3EE]/50 transition-all placeholder:text-slate-700 font-normal"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={loadData}
                        disabled={isLoading}
                        className="bg-white/5 hover:bg-white/10 text-white p-3 rounded-[5px] flex items-center justify-center transition-all border border-white/10 disabled:opacity-50"
                        title="Refresh Integrations"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3 rounded-[5px] flex items-center gap-3 text-[13px] font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Plus className="w-4 h-4" />
                        Add Integration
                    </button>
                </div>
            </div>

            <div className="bg-white/[0.01] border border-white/10 rounded-[5px] overflow-hidden">
                <div className="grid grid-cols-[80px_1fr_150px_200px] border-b border-white/10 bg-white/[0.02] px-6 py-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Logo</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Name / Slug</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Revenue</span>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-500 font-mono text-[12px]">Loading Integrations...</div>
                ) : (
                    <div className="divide-y divide-white/5 p-1 space-y-1">
                        {filteredIntegrations.map((integration) => (
                            <div 
                                key={integration.id} 
                                onClick={() => handleSelectIntegration(integration)}
                                className="grid grid-cols-[80px_1fr_150px_200px] items-center px-6 py-4 rounded-[4px] transition-all cursor-pointer hover:bg-white/[0.04] border border-transparent hover:border-white/10 group"
                                title={`Inspect ${integration.name}`}
                            >
                                <div className="flex justify-center items-center">
                                    {integration.logo_url ? (
                                        <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden flex items-center justify-center relative border border-white/10">
                                            {/* We use standard img to avoid Next.js external image domain errors if unconfigured */}
                                            <img src={integration.logo_url} alt={integration.name} className="w-5 h-5 object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                                            <Sliders className="w-4 h-4 text-slate-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col gap-1 overflow-hidden pl-4">
                                    <span className="text-[14px] text-white font-medium truncate leading-tight">{integration.name}</span>
                                    <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-300 transition-colors leading-tight">/{integration.slug}</span>
                                </div>
                                <div className="text-center flex justify-center">
                                    {integration.status.toLowerCase() === 'live' && (
                                        <div className="px-2 py-0.5 rounded-[3px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-bold uppercase tracking-widest">LIVE</div>
                                    )}
                                    {integration.status.toLowerCase() === 'active' && (
                                        <div className="px-2 py-0.5 rounded-[3px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold uppercase tracking-widest">ACTIVE</div>
                                    )}
                                    {!['live', 'active'].includes(integration.status.toLowerCase()) && (
                                        <div className="px-2 py-0.5 rounded-[3px] bg-slate-500/10 border border-slate-500/20 text-slate-400 text-[9px] font-bold uppercase tracking-widest">{integration.status}</div>
                                    )}
                                </div>
                                <div className="text-right">
                                    <span className="text-[14px] font-mono text-white group-hover:text-[#22D3EE] transition-colors">
                                        ${integration.revenue?.toFixed(2) || "0.00"}
                                    </span>
                                </div>
                            </div>
                        ))}
                        {filteredIntegrations.length === 0 && !isLoading && (
                            <div className="p-12 text-center text-slate-500 font-mono text-[12px]">No integrations found.</div>
                        )}
                    </div>
                )}
            </div>

            <IntegrationSlideout 
                integration={selectedIntegration}
                isOpen={isSlideoutOpen}
                onClose={() => setIsSlideoutOpen(false)}
                isLoading={isSlideoutLoading}
                onSave={handleSaveIntegration}
            />
        </div>
    );
}
