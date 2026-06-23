"use client";

import React from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import TableOfContents from "../../components/docs/TableOfContents";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-black min-h-screen text-slate-300 font-sans selection:bg-blue-500/30">
            {/* Minimal Header instance without interactive Contact modal for docs to keep it simple, or we can just use the standard one with a dummy or functional prop if needed. Since Header expects onContactClick, we will provide a no-op for now. */}
            <Header onContactClick={() => {}} />

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-24 flex flex-col md:flex-row gap-12">
                {/* Sidebar Navigation */}
                <aside className="md:w-64 flex-shrink-0">
                    <div className="sticky top-32 flex flex-col gap-8">
                        
                        {/* Search Placeholder */}
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search documentation..." 
                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-colors"
                                disabled
                            />
                            <span className="absolute right-3 top-2.5 text-slate-600 text-xs font-bold uppercase tracking-widest">/</span>
                        </div>

                        <nav className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Overview</span>
                                <a href="/docs" className="text-sm font-medium hover:text-white transition-colors">Architecture Overview</a>
                                <a href="/docs/lifecycle" className="text-sm font-medium hover:text-white transition-colors">Integration Lifecycle</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Core Concepts</span>
                                <a href="/docs/substrate" className="text-sm font-medium hover:text-white transition-colors">Substrate Generators</a>
                                <a href="/docs/specifications" className="text-sm font-medium hover:text-white transition-colors">Integration Specifications</a>
                                <a href="/docs/execution" className="text-sm font-medium hover:text-white transition-colors">Execution Model</a>
                                <a href="/docs/security" className="text-sm font-medium hover:text-white transition-colors">Security Model</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Operations</span>
                                <a href="/docs/testing" className="text-sm font-medium hover:text-white transition-colors">Testing & Verification</a>
                                <a href="/docs/telemetry" className="text-sm font-medium hover:text-white transition-colors">Runtime Telemetry</a>
                                <a href="/docs/operator-guide" className="text-sm font-medium hover:text-white transition-colors">Node Operator Guide</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Developers</span>
                                <a href="/docs/developer-guide" className="text-sm font-medium hover:text-white transition-colors">Developer Guide</a>
                                <a href="/docs/sdk-wasm" className="text-sm font-medium hover:text-white transition-colors">SDK & WASM Stubs</a>
                                <a href="/docs/api" className="text-sm font-medium hover:text-white transition-colors">API Reference</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">CTO-Grade Additions</span>
                                <a href="/docs/determinism" className="text-sm font-medium hover:text-white transition-colors">Determinism & Reproducibility</a>
                                <a href="/docs/threat-model" className="text-sm font-medium hover:text-white transition-colors">Threat Model & Guarantees</a>
                                <a href="/docs/diagrams" className="text-sm font-medium hover:text-white transition-colors">Diagram Library</a>
                                <a href="/docs/principles" className="text-sm font-medium hover:text-white transition-colors">Design Principles</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Reference</span>
                                <a href="/docs/glossary" className="text-sm font-medium hover:text-white transition-colors">Glossary</a>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 prose prose-invert prose-slate max-w-none prose-headings:font-space-grotesk prose-headings:tracking-tight prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
                        {children}
                    </div>

                    <TableOfContents />
                </main>
            </div>

            <Footer />
        </div>
    );
}
