"use client";

import Link from "next/link";
import AppLayout from "../../../components/layout/AppLayout";
import { useEffect, useState } from "react";

export default function WhitepaperPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="prose prose-invert max-w-3xl mx-auto py-10 space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-white font-space-grotesk uppercase leading-none mb-8">
                        Wnode Whitepaper — Version 1.23
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed">
                        The Wnode Whitepaper V1.23 outlines the architecture, mission, and 
                        economic model behind the Wnode Sovereign Compute Network — a 
                        censorship‑resistant, agent‑native compute fabric designed for a 
                        multipolar world.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        Download the Full PDF
                    </h2>
                    <p className="text-slate-400">
                        You can download the full Whitepaper V1.23 here:
                    </p>

                    <p>
                        <a 
                            href="/docs/whitepaper_v1.2.pdf" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-block mt-2 bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                        >
                            Download Whitepaper V1.23 (PDF)
                        </a>
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        Executive Summary
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        Wnode provides a sovereign, unowned compute network that enables 
                        individuals, teams, and nations to operate AI and agent workloads 
                        without reliance on centralized cloud providers. The network is built 
                        on a global encrypted mesh, a deterministic execution layer, and a 
                        minimal governance model designed to prevent capture.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        Core Thesis
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                        AI is centralizing at unprecedented speed. Wnode exists to reverse this 
                        trend by enabling compute that is unstoppable, permissionless, and 
                        globally distributed. The network treats compute as a right, not a 
                        service.
                    </p>

                    <h2 className="text-2xl font-bold text-white uppercase tracking-tight font-space-grotesk mt-12 mb-4">
                        Architecture Overview
                    </h2>
                    <ul className="list-disc pl-6 space-y-3 text-slate-400">
                        <li><strong className="text-white">Node Layer:</strong> Physical or virtual nodes contributing compute, storage, and bandwidth.</li>
                        <li><strong className="text-white">Mesh Layer:</strong> A global encrypted overlay enabling peer‑to‑peer workload routing.</li>
                        <li><strong className="text-white">Execution Layer:</strong> Agent‑native runtime supporting inference, workflows, and secure enclaves.</li>
                        <li><strong className="text-white">Governance Layer:</strong> Minimal, cryptographic, non‑capturable governance.</li>
                    </ul>
                </div>
            </div>
        </AppLayout>
    );
}
