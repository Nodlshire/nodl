"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Info, BookOpen, ShieldCheck, Activity } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

import ImagePlaceholder from "../components/ImagePlaceholder";

export default function HelpOverviewPage() {
    usePageTitle("Platform Overview", "High-level understanding of the Wnode Command ecosystem.");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-wnode-border-neutral p-12 rounded-[5px]">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Command Overview</h1>
                    <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Wnode Command Portal is the authoritative executive layer for global resource management. 
                        It provides real-time oversight of the mesh network's compute capacity, memory distribution, 
                        and institutional economic stability.
                    </p>

                    <img src="/docs/cmd/screenshots/dashboard-overview.png" alt="Dashboard Overview" className="rounded-md border border-wnode-border-neutral shadow-2xl mb-12" />

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                1. Dashboard Overview
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                The Command Centre Operations dashboard provides a high-density, real-time visualization of the global mesh network. 
                                It is divided into three primary functional zones: Vitals, Operational Metrics, and the Global Fleet Map.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-white/60 space-y-2 mb-8">
                                <li><strong>Network Vitals:</strong> High-level aggregates of vCPUs, RAM, and growth metrics.</li>
                                <li><strong>Operational Status:</strong> Real-time health indicators including API latency and backend connectivity.</li>
                                <li><strong>Global Fleet Map:</strong> A geospatial representation of all active and inactive nodes worldwide.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4" />
                                2. How Metrics Work
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                Metrics are polled every 10 seconds from the authoritative backend. Each card provides specific tooltips explaining the data source.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Capacity Metrics</h3>
                                    <p className="text-white/60 text-[13px] leading-relaxed">
                                        Total Cores and Unified Memory represent the aggregate resources available for compute jobs across the entire network.
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-white text-sm font-bold">Growth Metrics</h3>
                                    <p className="text-white/60 text-[13px] leading-relaxed">
                                        New Users and Nodes tracked over the current billing period compared to the previous month.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.2em]">© 2026 Wnode Technologies // Executive Documentation</p>
                </div>
            </div>
        </main>
    );
}
