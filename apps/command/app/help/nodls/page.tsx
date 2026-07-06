"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Info, HelpCircle, Monitor, ShieldAlert } from "lucide-react";

export default function HelpPage() {
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
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Nodls</h1>
                    <p className="text-white/60 text-sm leading-relaxed mb-12 max-w-2xl">
                        This page provides an overview of the Nodls functionality within the Command portal.
                    </p>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Purpose
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed">
                                The Nodls page is designed to monitor and manage relevant system metrics and configurations.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                UI Elements & Actions
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed mb-4">
                                Use the available tables and controls to filter data and trigger associated operational tasks.
                            </p>
                            <Image src="/help/screenshots/nodls-overview.png" alt="nodls overview" width={800} height={400} className="rounded border border-wnode-border-neutral shadow-xl mb-4 w-full h-auto object-cover" />
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                How to use this page
                            </h2>
                            <ul className="list-disc list-inside text-white/60 text-[13px] leading-relaxed space-y-2">
                                <li>Review the top metrics for a high-level summary.</li>
                                <li>Select individual rows to view detailed diagnostics.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4" />
                                Troubleshooting
                            </h2>
                            <p className="text-white/60 text-[13px] leading-relaxed">
                                If data fails to load, verify your network connection and ensure the backend nodld service is reachable. Contact an administrator if issues persist.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
