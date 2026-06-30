"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import TableOfContents from "../../components/docs/TableOfContents";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

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
                                <a href="/docs/overview" className="text-sm font-medium hover:text-white transition-colors">Overview</a>
                                <a href="/docs/overview/rationale" className="text-sm font-medium hover:text-white transition-colors">Rationale</a>
                                <a href="/docs/overview/flow" className="text-sm font-medium hover:text-white transition-colors">Flow</a>
                                <a href="/docs/overview/core-code" className="text-sm font-medium hover:text-white transition-colors">Core Code</a>
                                <a href="/docs/overview/failure-modes" className="text-sm font-medium hover:text-white transition-colors">Failure Modes</a>
                                <a href="/docs/overview/invariants" className="text-sm font-medium hover:text-white transition-colors">Invariants</a>
                                <a href="/docs/overview/telemetry" className="text-sm font-medium hover:text-white transition-colors">Telemetry</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Architecture</span>
                                <a href="/docs/architecture" className="text-sm font-medium hover:text-white transition-colors">Architecture</a>
                                <a href="/docs/architecture/earth-mesh" className="text-sm font-medium hover:text-white transition-colors">Earth Mesh</a>
                                <a href="/docs/architecture/space-mesh" className="text-sm font-medium hover:text-white transition-colors">Space Mesh</a>
                                <a href="/docs/architecture/orchestrator" className="text-sm font-medium hover:text-white transition-colors">Orchestrator</a>
                                <a href="/docs/architecture/mesh-routing" className="text-sm font-medium hover:text-white transition-colors">Mesh Routing</a>
                                <a href="/docs/architecture/ingestion-pipeline" className="text-sm font-medium hover:text-white transition-colors">Ingestion Pipeline</a>
                                <a href="/docs/architecture/tinygo-pipeline" className="text-sm font-medium hover:text-white transition-colors">TinyGo Pipeline</a>
                                <a href="/docs/architecture/wasm-constraints" className="text-sm font-medium hover:text-white transition-colors">WASM Constraints</a>
                                <a href="/docs/architecture/hot-load-lifecycle" className="text-sm font-medium hover:text-white transition-colors">Hot Load Lifecycle</a>
                                <a href="/docs/architecture/security-envelope" className="text-sm font-medium hover:text-white transition-colors">Security Envelope</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Integrations</span>
                                <a href="/docs/integrations/index.md" className="text-sm font-medium hover:text-white transition-colors">Integrations Index</a>
                                <a href="/docs/integrations/aave" className="text-sm font-medium hover:text-white transition-colors">Aave</a>
                                <a href="/docs/integrations/arweave" className="text-sm font-medium hover:text-white transition-colors">Arweave</a>
                                <a href="/docs/integrations/base" className="text-sm font-medium hover:text-white transition-colors">Base</a>
                                <a href="/docs/integrations/celestia" className="text-sm font-medium hover:text-white transition-colors">Celestia</a>
                                <a href="/docs/integrations/chainlink" className="text-sm font-medium hover:text-white transition-colors">Chainlink</a>
                                <a href="/docs/integrations/eigenlayer" className="text-sm font-medium hover:text-white transition-colors">EigenLayer</a>
                                <a href="/docs/integrations/ethereum" className="text-sm font-medium hover:text-white transition-colors">Ethereum</a>
                                <a href="/docs/integrations/filecoin" className="text-sm font-medium hover:text-white transition-colors">Filecoin</a>
                                <a href="/docs/integrations/ipfs" className="text-sm font-medium hover:text-white transition-colors">IPFS</a>
                                <a href="/docs/integrations/polygon" className="text-sm font-medium hover:text-white transition-colors">Polygon</a>
                                <a href="/docs/integrations/solana" className="text-sm font-medium hover:text-white transition-colors">Solana</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Execution</span>
                                <a href="/docs/execution" className="text-sm font-medium hover:text-white transition-colors">Execution</a>
                                <a href="/docs/execution/wasm-runtime" className="text-sm font-medium hover:text-white transition-colors">WASM Runtime</a>
                                <a href="/docs/execution/pure-functions" className="text-sm font-medium hover:text-white transition-colors">Pure Functions</a>
                                <a href="/docs/execution/panic-handling" className="text-sm font-medium hover:text-white transition-colors">Panic Handling</a>
                                <a href="/docs/execution/timeouts" className="text-sm font-medium hover:text-white transition-colors">Timeouts</a>
                                <a href="/docs/execution/resource-bounds" className="text-sm font-medium hover:text-white transition-colors">Resource Bounds</a>
                                <a href="/docs/execution/determinism" className="text-sm font-medium hover:text-white transition-colors">Wnode Determinism Guidelines</a>
                                <a href="/docs/execution/failure-modes" className="text-sm font-medium hover:text-white transition-colors">Failure Modes</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Wnode SDK</span>
                                <a href="/docs/sdk" className="text-sm font-medium hover:text-white transition-colors">SDK Overview</a>
                                <a href="/docs/sdk/installation" className="text-sm font-medium hover:text-white transition-colors">Installation</a>
                                <a href="/docs/sdk/identity" className="text-sm font-medium hover:text-white transition-colors">Identity</a>
                                <a href="/docs/sdk/jobs" className="text-sm font-medium hover:text-white transition-colors">Jobs</a>
                                <a href="/docs/sdk/mesh" className="text-sm font-medium hover:text-white transition-colors">Mesh Routing</a>
                                <a href="/docs/sdk/integrations" className="text-sm font-medium hover:text-white transition-colors">Integration Wrappers</a>
                                <a href="/docs/sdk/examples" className="text-sm font-medium hover:text-white transition-colors">Examples</a>
                                <a href="/docs/sdk/determinism" className="text-sm font-medium hover:text-white transition-colors">Deterministic Execution</a>
                                <a href="/docs/sdk/security" className="text-sm font-medium hover:text-white transition-colors">Security</a>
                                <a href="/docs/sdk/api-reference" className="text-sm font-medium hover:text-white transition-colors">API Reference</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Operator</span>
                                <a href="/docs/operator" className="text-sm font-medium hover:text-white transition-colors">Operator</a>
                                <a href="/docs/operator/archetypes" className="text-sm font-medium hover:text-white transition-colors">Archetypes</a>
                                <a href="/docs/operator/earth-mesh" className="text-sm font-medium hover:text-white transition-colors">Earth Mesh</a>
                                <a href="/docs/operator/space-mesh" className="text-sm font-medium hover:text-white transition-colors">Space Mesh</a>
                                <a href="/docs/operator/security" className="text-sm font-medium hover:text-white transition-colors">Security</a>
                                <a href="/docs/operator/telemetry" className="text-sm font-medium hover:text-white transition-colors">Telemetry</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Developer</span>
                                <a href="/docs/developer" className="text-sm font-medium hover:text-white transition-colors">Developer</a>
                                <a href="/docs/developer/tinygo" className="text-sm font-medium hover:text-white transition-colors">TinyGo</a>
                                <a href="/docs/developer/testing" className="text-sm font-medium hover:text-white transition-colors">Testing</a>
                                <a href="/docs/developer/determinism" className="text-sm font-medium hover:text-white transition-colors">Determinism</a>
                                <a href="/docs/developer/anti-patterns" className="text-sm font-medium hover:text-white transition-colors">Anti Patterns</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Governance</span>
                                <a href="/docs/governance" className="text-sm font-medium hover:text-white transition-colors">Governance</a>
                                <a href="/docs/governance/security-envelope" className="text-sm font-medium hover:text-white transition-colors">Security Envelope</a>
                                <a href="/docs/governance/quorum" className="text-sm font-medium hover:text-white transition-colors">Quorum</a>
                                <a href="/docs/governance/signatures" className="text-sm font-medium hover:text-white transition-colors">Signatures</a>
                                <a href="/docs/governance/upgrades" className="text-sm font-medium hover:text-white transition-colors">Upgrades</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Economics</span>
                                <a href="/docs/economics" className="text-sm font-medium hover:text-white transition-colors">Economics</a>
                                <a href="/docs/economics/proof-of-compute" className="text-sm font-medium hover:text-white transition-colors">Proof Of Compute</a>
                                <a href="/docs/economics/pricing" className="text-sm font-medium hover:text-white transition-colors">Pricing</a>
                                <a href="/docs/economics/retries" className="text-sm font-medium hover:text-white transition-colors">Retries</a>
                                <a href="/docs/economics/bloat-limits" className="text-sm font-medium hover:text-white transition-colors">Bloat Limits</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Appendix</span>
                                <a href="/docs/appendix" className="text-sm font-medium hover:text-white transition-colors">Appendix</a>
                                <a href="/docs/appendix/host-functions" className="text-sm font-medium hover:text-white transition-colors">Host Functions</a>
                                <a href="/docs/appendix/manifest-schema" className="text-sm font-medium hover:text-white transition-colors">Manifest Schema</a>
                                <a href="/docs/appendix/telemetry-examples" className="text-sm font-medium hover:text-white transition-colors">Telemetry Examples</a>
                                <a href="/docs/appendix/spec-examples" className="text-sm font-medium hover:text-white transition-colors">Spec Examples</a>
                            </div>

                            <div className="flex flex-col gap-2 mt-4">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#10b981] mb-2">Protocol Deep-Dive</span>
                                <a href="/docs/protocol-deep-dive/quorum-slashing" className="text-sm font-medium hover:text-white transition-colors">Quorum & Slashing</a>
                                <a href="/docs/protocol-deep-dive/orchestrator-resilience" className="text-sm font-medium hover:text-white transition-colors">Orchestrator Resilience</a>
                                <a href="/docs/protocol-deep-dive/tokenomics-integration" className="text-sm font-medium hover:text-white transition-colors">Tokenomics Integration</a>
                                <a href="/docs/protocol-deep-dive/mesh-economics" className="text-sm font-medium hover:text-white transition-colors">Mesh Economics</a>
                                <a href="/docs/protocol-deep-dive/websocket-protocol" className="text-sm font-medium hover:text-white transition-colors">WebSocket Protocol</a>
                                <a href="/docs/protocol-deep-dive/error-codes" className="text-sm font-medium hover:text-white transition-colors">Error Codes</a>
                                <a href="/docs/protocol-deep-dive/wasm-compatibility-matrix" className="text-sm font-medium hover:text-white transition-colors">WASM Compatibility Matrix</a>
                                <a href="/docs/protocol-deep-dive/data-retention-model" className="text-sm font-medium hover:text-white transition-colors">Data Retention Model</a>
                                <a href="/docs/protocol-deep-dive/operator-onboarding" className="text-sm font-medium hover:text-white transition-colors">Operator Onboarding</a>
                                <a href="/docs/protocol-deep-dive/disaster-recovery" className="text-sm font-medium hover:text-white transition-colors">Disaster Recovery</a>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 w-full max-w-[880px] mx-auto text-[#e5e7eb]">
                        {children}
                    </div>

                    {pathname !== '/docs/integrations' && pathname !== '/docs/integrations/' && pathname !== '/docs/integrations/index.md' && (
                        <TableOfContents />
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}
