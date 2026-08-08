"use client";

import React from "react";
import { X, Shield, Users, Activity, Network, Zap, Clock, Terminal } from "lucide-react";
import { AffiliateData } from "../types";

interface DetailPanelProps {
    isOpen: boolean;
    onClose: () => void;
    node: any;
    affiliateData: AffiliateData;
}

export default function DetailPanel({ isOpen, onClose, node, affiliateData }: DetailPanelProps) {
    if (!node && !isOpen) return null;

    const name = node?.name || node?.nodlrId || "Unknown Identity";
    const wuid = node?.wuid || node?.nodlrId || "—";
    const type = node?.type || (node?.isFounder ? "Founder" : "Partner");
    const active = node?.active !== undefined ? node.active : true;

    return (
        <>
            {/* Backdrop for outside click */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#09090b] border-l border-wnode-border-neutral z-[100] shadow-[0_0_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h2 className="text-[14px] font-bold text-white uppercase tracking-widest">Affiliate Intelligence</h2>
                            <p className="text-[10px] text-white/40 font-mono">Node Trace Registry</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Polished Header */}
                        <header className="mb-4 border-b border-wnode-border-neutral pb-3">
                            <h2 className="text-lg font-semibold text-gray-200">
                                {node?.name ?? "Affiliate"}
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                WUID: {node?.wuid ?? node?.nodlrId ?? "—"}
                            </p>
                        </header>

                        {/* Network Identity Section */}
                        <section className="mt-6 space-y-2">
                            <h3 className="text-sm font-semibold text-gray-300 mb-2">Network Identity</h3>
                            <div className="space-y-2 text-sm text-gray-400">
                                <p><span className="font-medium text-gray-300">Node Type:</span> {type ?? "—"}</p>
                                <p><span className="font-medium text-gray-300">Registry Status:</span> {active ? "Active" : "Inactive"}</p>
                                <p><span className="font-medium text-gray-300">L1 Affiliates:</span> {node?.l1Count ?? "—"}</p>
                                <p><span className="font-medium text-gray-300">L2 Affiliates:</span> {node?.l2Count ?? "—"}</p>
                            </div>
                        </section>

                        {/* Affiliate Details (CRM / SOT) */}
                        <section className="mt-6 space-y-2">
                            <h3 className="text-sm font-semibold text-gray-300 mb-2">Affiliate Details (CRM / SOT)</h3>
                            <div className="space-y-2 text-sm text-gray-400">
                                <p><span className="font-medium text-gray-300">Address:</span> {affiliateData.address ?? '—'}</p>
                                <p><span className="font-medium text-gray-300">Phone:</span> {affiliateData.phone ?? '—'}</p>
                                <p><span className="font-medium text-gray-300">Email:</span> {affiliateData.email ?? '—'}</p>
                                <p><span className="font-medium text-gray-300">Referrer:</span> {affiliateData.referrer ?? '—'}</p>
                                <p><span className="font-medium text-gray-300">Founder Tree:</span> {affiliateData.founderTree ?? '—'}</p>
                            </div>
                        </section>

                        {/* Live Telemetry Section */}
                        <section className="mt-6 space-y-2">
                            <h3 className="text-sm font-semibold text-gray-300 mb-2">Live Telemetry</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                                <div className="p-3 bg-white/[0.02] border border-wnode-border-neutral rounded">
                                    <span className="text-xs text-gray-500 block mb-1">Uptime</span>
                                    <span className="font-mono text-gray-300">99.98%</span>
                                </div>
                                <div className="p-3 bg-white/[0.02] border border-wnode-border-neutral rounded">
                                    <span className="text-xs text-gray-500 block mb-1">Latency</span>
                                    <span className="font-mono text-gray-300">14ms</span>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </>
    );
}
