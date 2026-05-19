"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, Monitor, Cpu, Server, HardDrive, Activity } from "lucide-react";
import { usePageTitle } from "../../components/PageTitleContext";

export default function WnoderHardwareHelp() {
    usePageTitle("Hardware Setup", "Optimizing Your Machine for the Mesh");

    return (
        <main className="flex-1 p-8 overflow-y-auto pb-24 font-sans text-slate-300">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/help" 
                    className="flex items-center gap-2 text-cyan-400 text-[10px] uppercase font-bold tracking-widest mb-8 hover:text-white transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Help Center
                </Link>

                <div className="bg-white/[0.02] border border-white/10 p-12 rounded-[5px] shadow-2xl">
                    <h1 className="text-3xl font-bold text-white mb-4 uppercase tracking-tighter">Hardware Setup</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-12 max-w-2xl">
                        While Wnode runs on most modern desktop environments, specific hardware configurations 
                        will unlock higher performance multipliers and ensure you capture the maximum 
                        possible 70% Operator Yield for the mesh tasks you process.
                    </p>

                    <div className="mb-12 text-slate-500 font-mono text-sm">[screenshot placeholder]</div>

                    <div className="space-y-16">
                        <section id="recommended-specs">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <Cpu className="w-4 h-4" />
                                1. Recommended Specs
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Cpu className="w-4 h-4 text-cyan-400" />
                                        <h3 className="text-white text-xs font-bold uppercase tracking-widest">Processor (CPU)</h3>
                                    </div>
                                    <ul className="text-[11px] text-slate-500 space-y-2">
                                        <li>• Minimum: Quad-core 2.0GHz</li>
                                        <li>• Optimal: Octa-core 3.5GHz+ for intensive WASM tasks</li>
                                    </ul>
                                </div>
                                <div className="p-6 bg-[#050505] border border-white/5 rounded">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Server className="w-4 h-4 text-cyan-400" />
                                        <h3 className="text-white text-xs font-bold uppercase tracking-widest">Graphics (GPU)</h3>
                                    </div>
                                    <ul className="text-[11px] text-slate-500 space-y-2">
                                        <li>• Minimum: Dedicated GPU with 4GB VRAM</li>
                                        <li>• Optimal: NVIDIA RTX Series (CUDA support enabled)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section id="storage-memory">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <HardDrive className="w-4 h-4" />
                                2. Storage & Memory
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4 p-5 border-l border-white/10 bg-[#080808]">
                                    <HardDrive className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">RAM Requirements</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            The engine requires a minimum of 8GB RAM. For stable high-tier performance, 
                                            16GB-32GB is recommended to handle large compute payloads without swapping.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4 p-5 border-l border-white/10 bg-[#080808]">
                                    <Activity className="w-5 h-5 text-slate-500 mt-1 shrink-0" />
                                    <div>
                                        <p className="text-white text-xs font-bold mb-1 uppercase tracking-widest">SSD Priority</p>
                                        <p className="text-slate-400 text-[13px] leading-relaxed">
                                            Wnode performs best on SSD storage. Fast read/write speeds are critical for 
                                            mesh task initialization and ledger synchronization.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="cooling-sustainability" className="p-8 border border-white/10 bg-[#050505] rounded">
                            <h2 className="text-[11px] font-bold text-cyan-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                3. Cooling & Sustainability
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Processing mesh tasks can generate significant heat. Ensure your device has 
                                adequate airflow. The platform measures thermal output as part of the 
                                'Hardware Health' score to promote network longevity.
                            </p>
                        </section>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-slate-600 text-[10px] uppercase tracking-[0.2em]">© 2026 Wnode Technologies // Executive Documentation</p>
                </div>
            </div>
        </main>
    );
}
