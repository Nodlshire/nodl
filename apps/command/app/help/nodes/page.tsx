"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Activity, Server, Zap, ShieldCheck, Terminal, Hash, HardDrive } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

import ImagePlaceholder from "../components/ImagePlaceholder";

export default function NodesHelpPage() {
    usePageTitle("Nodes & Compute Health", "Technical oversight of the global fleet inventory.");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans text-white/80">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-wnode-border-neutral p-12 rounded-[5px] shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Node Inventory Management</h1>
                    <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-2xl">
                        The Node Inventory provides a real-time census of all hardware active in the mesh. 
                        Administrators can monitor health, evaluate compute scores, and investigate offline events.
                    </p>

                    <img src="/docs/cmd/screenshots/nodes-overview.png" alt="Nodes Overview" className="rounded-md border border-wnode-border-neutral shadow-2xl mb-12" />

                    <div className="space-y-16">
                        {/* 1. Node Status */}
                        <section id="node-status" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Activity className="w-4 h-4" />
                                1. Node Status Indicators
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                Nodes are tracked through four primary states that indicate their readiness for compute jobs.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-white/60 space-y-2 mb-8">
                                <li><strong>Active / Online:</strong> Node is heartbeating and ready to accept tasks.</li>
                                <li><strong>Offline:</strong> Node has missed consecutive heartbeats; pending reconnection.</li>
                                <li><strong>Flagged:</strong> Integrity issues detected (VM detection, hardware DNA collision).</li>
                                <li><strong>Maintenance:</strong> Node is undergoing updates or administrative lockdown.</li>
                            </ul>
                        </section>

                        {/* 2. Compute Health Metrics */}
                        <section id="health-metrics" className="scroll-mt-20">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <HardDrive className="w-4 h-4" />
                                2. Compute Health & Metrics
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-6">
                                Each node reports granular performance metrics that influence its ranking and job allocation.
                            </p>
                            <ul className="list-disc pl-5 text-[12px] text-white/60 space-y-2 mb-8">
                                <li><strong>Latency:</strong> Round-trip time (ms) to the nearest coordination anchor.</li>
                                <li><strong>RAM Usage:</strong> Current memory overhead of active compute tasks.</li>
                                <li><strong>Integrity Score:</strong> A rolling 0-100% score based on hardware DNA verification.</li>
                            </ul>
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
