"use client";

import React from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import TableOfContents from "../../components/docs/TableOfContents";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-[#0f1117] min-h-screen text-[#e5e7eb] font-sans selection:bg-[#3b82f6]/30">
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
                                <a href="/docs/v1.0/overview" className="text-sm font-medium hover:text-white transition-colors">Overview</a>
                                <a href="/docs/v1.0/overview/rationale" className="text-sm font-medium hover:text-white transition-colors">Rationale</a>
                                <a href="/docs/v1.0/overview/flow" className="text-sm font-medium hover:text-white transition-colors">Flow</a>
                                <a href="/docs/v1.0/overview/core-code" className="text-sm font-medium hover:text-white transition-colors">Core Code</a>
                                <a href="/docs/v1.0/overview/failure-modes" className="text-sm font-medium hover:text-white transition-colors">Failure Modes</a>
                                <a href="/docs/v1.0/overview/invariants" className="text-sm font-medium hover:text-white transition-colors">Invariants</a>
                                <a href="/docs/v1.0/overview/telemetry" className="text-sm font-medium hover:text-white transition-colors">Telemetry</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Architecture</span>
                                <a href="/docs/v1.0/architecture" className="text-sm font-medium hover:text-white transition-colors">Architecture</a>
                                <a href="/docs/v1.0/architecture/earth-mesh" className="text-sm font-medium hover:text-white transition-colors">Earth Mesh</a>
                                <a href="/docs/v1.0/architecture/space-mesh" className="text-sm font-medium hover:text-white transition-colors">Space Mesh</a>
                                <a href="/docs/v1.0/architecture/orchestrator" className="text-sm font-medium hover:text-white transition-colors">Orchestrator</a>
                                <a href="/docs/v1.0/architecture/mesh-routing" className="text-sm font-medium hover:text-white transition-colors">Mesh Routing</a>
                                <a href="/docs/v1.0/architecture/ingestion-pipeline" className="text-sm font-medium hover:text-white transition-colors">Ingestion Pipeline</a>
                                <a href="/docs/v1.0/architecture/tinygo-pipeline" className="text-sm font-medium hover:text-white transition-colors">TinyGo Pipeline</a>
                                <a href="/docs/v1.0/architecture/wasm-constraints" className="text-sm font-medium hover:text-white transition-colors">WASM Constraints</a>
                                <a href="/docs/v1.0/architecture/hot-load-lifecycle" className="text-sm font-medium hover:text-white transition-colors">Hot Load Lifecycle</a>
                                <a href="/docs/v1.0/architecture/security-envelope" className="text-sm font-medium hover:text-white transition-colors">Security Envelope</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Integrations</span>
                                <a href="/docs/v1.0/integrations" className="text-sm font-medium hover:text-white transition-colors">Integrations</a>
                                <a href="/docs/v1.0/integrations/spec-yaml" className="text-sm font-medium hover:text-white transition-colors">Spec YAML</a>
                                <a href="/docs/v1.0/integrations/generate-all" className="text-sm font-medium hover:text-white transition-colors">Generate All</a>
                                <a href="/docs/v1.0/integrations/ci-flow" className="text-sm font-medium hover:text-white transition-colors">CI Flow</a>
                                <a href="/docs/v1.0/integrations/versioning" className="text-sm font-medium hover:text-white transition-colors">Versioning</a>
                                <a href="/docs/v1.0/integrations/anti-patterns" className="text-sm font-medium hover:text-white transition-colors">Anti Patterns</a>
                                <a href="/docs/v1.0/integrations/registry-overview" className="text-sm font-medium hover:text-white transition-colors">Registry Overview</a>
                                <a href="/docs/v1.0/integrations/integration-index" className="text-sm font-medium hover:text-white transition-colors">Integration Index</a>
                                <a href="/docs/v1.0/integrations/integration-metadata-schema" className="text-sm font-medium hover:text-white transition-colors">Metadata Schema</a>
                                <a href="/docs/v1.0/integrations/integration-ci-flow" className="text-sm font-medium hover:text-white transition-colors">Integration CI Flow</a>
                                <a href="/docs/v1.0/integrations/integration-examples" className="text-sm font-medium hover:text-white transition-colors">Examples</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Execution</span>
                                <a href="/docs/v1.0/execution" className="text-sm font-medium hover:text-white transition-colors">Execution</a>
                                <a href="/docs/v1.0/execution/wasm-runtime" className="text-sm font-medium hover:text-white transition-colors">WASM Runtime</a>
                                <a href="/docs/v1.0/execution/pure-functions" className="text-sm font-medium hover:text-white transition-colors">Pure Functions</a>
                                <a href="/docs/v1.0/execution/panic-handling" className="text-sm font-medium hover:text-white transition-colors">Panic Handling</a>
                                <a href="/docs/v1.0/execution/timeouts" className="text-sm font-medium hover:text-white transition-colors">Timeouts</a>
                                <a href="/docs/v1.0/execution/resource-bounds" className="text-sm font-medium hover:text-white transition-colors">Resource Bounds</a>
                                <a href="/docs/v1.0/execution/determinism" className="text-sm font-medium hover:text-white transition-colors">Determinism</a>
                                <a href="/docs/v1.0/execution/failure-modes" className="text-sm font-medium hover:text-white transition-colors">Failure Modes</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Operator</span>
                                <a href="/docs/v1.0/operator" className="text-sm font-medium hover:text-white transition-colors">Operator</a>
                                <a href="/docs/v1.0/operator/archetypes" className="text-sm font-medium hover:text-white transition-colors">Archetypes</a>
                                <a href="/docs/v1.0/operator/earth-mesh" className="text-sm font-medium hover:text-white transition-colors">Earth Mesh</a>
                                <a href="/docs/v1.0/operator/space-mesh" className="text-sm font-medium hover:text-white transition-colors">Space Mesh</a>
                                <a href="/docs/v1.0/operator/security" className="text-sm font-medium hover:text-white transition-colors">Security</a>
                                <a href="/docs/v1.0/operator/telemetry" className="text-sm font-medium hover:text-white transition-colors">Telemetry</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Developer</span>
                                <a href="/docs/v1.0/developer" className="text-sm font-medium hover:text-white transition-colors">Developer</a>
                                <a href="/docs/v1.0/developer/tinygo" className="text-sm font-medium hover:text-white transition-colors">TinyGo</a>
                                <a href="/docs/v1.0/developer/testing" className="text-sm font-medium hover:text-white transition-colors">Testing</a>
                                <a href="/docs/v1.0/developer/determinism" className="text-sm font-medium hover:text-white transition-colors">Determinism</a>
                                <a href="/docs/v1.0/developer/anti-patterns" className="text-sm font-medium hover:text-white transition-colors">Anti Patterns</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Governance</span>
                                <a href="/docs/v1.0/governance" className="text-sm font-medium hover:text-white transition-colors">Governance</a>
                                <a href="/docs/v1.0/governance/security-envelope" className="text-sm font-medium hover:text-white transition-colors">Security Envelope</a>
                                <a href="/docs/v1.0/governance/quorum" className="text-sm font-medium hover:text-white transition-colors">Quorum</a>
                                <a href="/docs/v1.0/governance/signatures" className="text-sm font-medium hover:text-white transition-colors">Signatures</a>
                                <a href="/docs/v1.0/governance/upgrades" className="text-sm font-medium hover:text-white transition-colors">Upgrades</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Economics</span>
                                <a href="/docs/v1.0/economics" className="text-sm font-medium hover:text-white transition-colors">Economics</a>
                                <a href="/docs/v1.0/economics/proof-of-compute" className="text-sm font-medium hover:text-white transition-colors">Proof Of Compute</a>
                                <a href="/docs/v1.0/economics/pricing" className="text-sm font-medium hover:text-white transition-colors">Pricing</a>
                                <a href="/docs/v1.0/economics/retries" className="text-sm font-medium hover:text-white transition-colors">Retries</a>
                                <a href="/docs/v1.0/economics/bloat-limits" className="text-sm font-medium hover:text-white transition-colors">Bloat Limits</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Appendix</span>
                                <a href="/docs/v1.0/appendix" className="text-sm font-medium hover:text-white transition-colors">Appendix</a>
                                <a href="/docs/v1.0/appendix/host-functions" className="text-sm font-medium hover:text-white transition-colors">Host Functions</a>
                                <a href="/docs/v1.0/appendix/manifest-schema" className="text-sm font-medium hover:text-white transition-colors">Manifest Schema</a>
                                <a href="/docs/v1.0/appendix/telemetry-examples" className="text-sm font-medium hover:text-white transition-colors">Telemetry Examples</a>
                                <a href="/docs/v1.0/appendix/spec-examples" className="text-sm font-medium hover:text-white transition-colors">Spec Examples</a>
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#10b981] mb-2">Protocol Deep-Dive</span>
                                <a href="/docs/v1.0/protocol-deep-dive/quorum-slashing" className="text-sm font-medium hover:text-white transition-colors">Quorum & Slashing</a>
                                <a href="/docs/v1.0/protocol-deep-dive/orchestrator-resilience" className="text-sm font-medium hover:text-white transition-colors">Orchestrator Resilience</a>
                                <a href="/docs/v1.0/protocol-deep-dive/tokenomics-integration" className="text-sm font-medium hover:text-white transition-colors">Tokenomics Integration</a>
                                <a href="/docs/v1.0/protocol-deep-dive/mesh-economics" className="text-sm font-medium hover:text-white transition-colors">Mesh Economics</a>
                                <a href="/docs/v1.0/protocol-deep-dive/websocket-protocol" className="text-sm font-medium hover:text-white transition-colors">WebSocket Protocol</a>
                                <a href="/docs/v1.0/protocol-deep-dive/error-codes" className="text-sm font-medium hover:text-white transition-colors">Error Codes</a>
                                <a href="/docs/v1.0/protocol-deep-dive/wasm-compatibility-matrix" className="text-sm font-medium hover:text-white transition-colors">WASM Compatibility Matrix</a>
                                <a href="/docs/v1.0/protocol-deep-dive/data-retention-model" className="text-sm font-medium hover:text-white transition-colors">Data Retention Model</a>
                                <a href="/docs/v1.0/protocol-deep-dive/operator-onboarding" className="text-sm font-medium hover:text-white transition-colors">Operator Onboarding</a>
                                <a href="/docs/v1.0/protocol-deep-dive/disaster-recovery" className="text-sm font-medium hover:text-white transition-colors">Disaster Recovery</a>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 w-full max-w-[880px] mx-auto text-[#e5e7eb]">
                        {children}
                    </div>

                    <TableOfContents />
                </main>
            </div>

            <Footer />
        </div>
    );
}
