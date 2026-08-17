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

            <div className="max-w-7xl mx-auto px-6 md:px-8 pt-32 pb-24 flex overflow-visible flex-col md:flex-row gap-12">
                {/* Sidebar Navigation */}
                <aside className="md:w-64 sticky top-0 h-screen overflow-y-auto flex-shrink-0">
                    <div className="flex flex-col gap-8 pt-8 pb-24">
                        
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
                                <a href="/docs/overview/dewi-foundation" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">DeWi Transport Foundation</a>
                                <a href="/docs/overview/core-code" className="text-sm font-medium hover:text-white transition-colors">Core Code</a>
                                <a href="/docs/overview/failure-modes" className="text-sm font-medium hover:text-white transition-colors">Failure Modes</a>
                                <a href="/docs/overview/invariants" className="text-sm font-medium hover:text-white transition-colors">Invariants</a>
                                <a href="/docs/overview/telemetry" className="text-sm font-medium hover:text-white transition-colors">Telemetry</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Architecture</span>
                                <a href="/docs/architecture" className="text-sm font-medium hover:text-white transition-colors">Architecture</a>
                                <a href="/docs/architecture/hyper-scale-pipeline" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Hyper-Scale Pipeline (30M–200M)</a>
                                <a href="/docs/architecture/ai-and-autonomy-model" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">AI Autonomy & Optimization Model</a>
                                <a href="/docs/architecture/full-stack-topology" className="text-sm font-medium hover:text-white transition-colors">Full-Stack System Topology</a>
                                <a href="/docs/architecture/earth-mesh" className="text-sm font-medium hover:text-white transition-colors">Earth Mesh</a>
                                <a href="/docs/architecture/space-mesh" className="text-sm font-medium hover:text-white transition-colors">Space Mesh</a>
                                <a href="/docs/architecture/dewi-mesh" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">DeWi RF & Coverage Substrate</a>
                                <a href="/docs/architecture/orchestrator" className="text-sm font-medium hover:text-white transition-colors">Orchestrator</a>
                                <a href="/docs/architecture/node-operator" className="text-sm font-medium hover:text-white transition-colors">Node Operator</a>
                                <a href="/docs/architecture/mesh-routing" className="text-sm font-medium hover:text-white transition-colors">Mesh Routing</a>
                                <a href="/docs/architecture/ingestion-pipeline" className="text-sm font-medium hover:text-white transition-colors">Ingestion Pipeline</a>
                                <a href="/docs/architecture/tinygo-pipeline" className="text-sm font-medium hover:text-white transition-colors">TinyGo Pipeline</a>
                                <a href="/docs/architecture/native-go-constraints" className="text-sm font-medium hover:text-white transition-colors">Native Go Constraints</a>
                                <a href="/docs/architecture/hot-load-lifecycle" className="text-sm font-medium hover:text-white transition-colors">Hot Load Lifecycle</a>
                                <a href="/docs/architecture/security-envelope" className="text-sm font-medium hover:text-white transition-colors">Security Envelope</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Integrations</span>
                                <a href="/docs/integrations/architecture" className="text-sm font-medium hover:text-white transition-colors">Architecture</a>
                                <a href="/docs/integrations/optimisation-engine" className="text-sm font-medium hover:text-white transition-colors">Optimisation Engine</a>
                                <a href="/docs/integrations/ai-search-engine" className="text-sm font-medium hover:text-white transition-colors">AI Search Engine</a>
                                <a href="/docs/integrations/web3-unification-substrate" className="text-sm font-medium hover:text-white transition-colors">Web3 Unification Substrate</a>
                                <a href="/docs/integrations/machinefi-and-m2m" className="text-sm font-medium hover:text-white transition-colors">MachineFi & M2M</a>
                                <a href="/docs/integrations/agentic-workflows" className="text-sm font-medium hover:text-white transition-colors">Agentic Workflows</a>
                                <a href="/docs/integrations/agent-finance" className="text-sm font-medium hover:text-white transition-colors">Agent Finance</a>
                                <a href="/docs/integrations/mev-engine" className="text-sm font-medium hover:text-white transition-colors">MEV Engine</a>
                                <a href="/docs/integrations/index.md" className="text-sm font-medium hover:text-white transition-colors">Integration Index</a>
                            </div>

                            <div className="flex flex-col gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-2">Execution</span>
                                <a href="/docs/execution" className="text-sm font-medium hover:text-white transition-colors">Execution</a>
                                <a href="/docs/execution/native-go-runtime" className="text-sm font-medium hover:text-white transition-colors">Native Go Runtime</a>
                                <a href="/docs/execution/dewi-engine" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">DeWi PoC Processing Engine</a>
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
                                <a href="/docs/operator/desktop-gui-and-cli-menu" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Desktop GUI & Interactive Menu</a>
                                <a href="/docs/operator/archetypes" className="text-sm font-medium hover:text-white transition-colors">Archetypes</a>
                                <a href="/docs/operator/dewi-gateway" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">DeWi Gateway Setup</a>
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
                                <a href="/docs/economics/revenue-distribution-model" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Authoritative 6-Tier Revenue Split</a>
                                <a href="/docs/reference/economics/affiliate-system" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Affiliate System & Math Spec</a>
                                <a href="/docs/reference/operator/affiliate-guide" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">Affiliate Simple User Guide</a>
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
                                <a href="/docs/protocol-deep-dive/dewi-poc-spec" className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">DeWi PoC & Spatial Index Spec</a>
                                <a href="/docs/protocol-deep-dive/quorum-slashing" className="text-sm font-medium hover:text-white transition-colors">Quorum & Slashing</a>
                                <a href="/docs/protocol-deep-dive/orchestrator-resilience" className="text-sm font-medium hover:text-white transition-colors">Orchestrator Resilience</a>
                                <a href="/docs/protocol-deep-dive/tokenomics-integration" className="text-sm font-medium hover:text-white transition-colors">Tokenomics Integration</a>
                                <a href="/docs/protocol-deep-dive/mesh-economics" className="text-sm font-medium hover:text-white transition-colors">Mesh Economics</a>
                                <a href="/docs/protocol-deep-dive/websocket-protocol" className="text-sm font-medium hover:text-white transition-colors">WebSocket Protocol</a>
                                <a href="/docs/protocol-deep-dive/error-codes" className="text-sm font-medium hover:text-white transition-colors">Error Codes</a>
                                <a href="/docs/protocol-deep-dive/native-go-compatibility-matrix" className="text-sm font-medium hover:text-white transition-colors">Native Go Compatibility Matrix</a>
                                <a href="/docs/protocol-deep-dive/data-retention-model" className="text-sm font-medium hover:text-white transition-colors">Data Retention Model</a>
                                <a href="/docs/protocol-deep-dive/operator-onboarding" className="text-sm font-medium hover:text-white transition-colors">Operator Onboarding</a>
                                <a href="/docs/protocol-deep-dive/disaster-recovery" className="text-sm font-medium hover:text-white transition-colors">Disaster Recovery</a>
                            </div>
                        </nav>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-visible min-w-0 flex flex-col lg:flex-row gap-12">
                    <div className="flex-1 w-full max-w-full mx-auto text-[#e5e7eb]">
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
