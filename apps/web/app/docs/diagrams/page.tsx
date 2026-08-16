import React from 'react';
import Callout from '../../../components/docs/Callout';

export default function DiagramLibrary() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Diagram Library</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    A centralized reference for the architectural topologies and sequence flows governing the Wnode Mesh.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Diagram Library Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Diagram Library within the Wnode mesh.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">WHY IT MATTERS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Architectural Purpose</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Ensures zero-custody verification, high-throughput execution, and fault-tolerant node consensus across Earth &amp; Space mesh topologies.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-purple-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">HOW IT OPERATES</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Native Go Engine</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Executed via SECCOMP-restricted Native Go modules (`linux-amd64`), validated with mTLS telemetry signatures and HMAC routing epochs.
                    </p>
                </div>
            </div>

            </div>

            <h2 id="conceptual-overview">Conceptual Overview & Rationale</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Visualizing a decentralized network is fundamentally difficult because the topology is dynamic. A static box-and-wire diagram fails to capture the generative nature of the Substrate Model or the asynchronous routing of the DAG.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> This library aggregates the canonical inline SVGs used throughout the documentation. These diagrams are strictly maintained to reflect the current runtime architecture.
            </p>

            <h2 id="architecture-diagram">Global Mesh Topology</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 400" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <linearGradient id="gradOrchestrator2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="gradEarth2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="gradSpace2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.1" />
                        </linearGradient>
                        <marker id="arrowSolid2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                        </marker>
                    </defs>
                    
                    {/* Orchestrator */}
                    <rect x="300" y="20" width="200" height="100" rx="8" fill="url(#gradOrchestrator2)" stroke="#3b82f6" strokeWidth="2" />
                    <text x="400" y="55" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Global Orchestrator</text>
                    <text x="400" y="75" fill="#94a3b8" fontSize="12" textAnchor="middle">Ingress, DAG Routing,</text>
                    <text x="400" y="95" fill="#94a3b8" fontSize="12" textAnchor="middle">Telemetry Aggregation</text>

                    {/* Earth Mesh */}
                    <rect x="100" y="220" width="240" height="140" rx="8" fill="url(#gradEarth2)" stroke="#10b981" strokeWidth="2" />
                    <text x="220" y="255" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Earth Mesh (Tier-1)</text>
                    <text x="220" y="275" fill="#94a3b8" fontSize="12" textAnchor="middle">Synchronous / Native Go</text>
                    <rect x="130" y="300" width="180" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="220" y="325" fill="#10b981" fontSize="12" textAnchor="middle">Bare-Metal Operators</text>

                    {/* Space Mesh */}
                    <rect x="460" y="220" width="240" height="140" rx="8" fill="url(#gradSpace2)" stroke="#f43f5e" strokeWidth="2" />
                    <text x="580" y="255" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Space Mesh (Tier-3)</text>
                    <text x="580" y="275" fill="#94a3b8" fontSize="12" textAnchor="middle">Asynchronous MapReduce</text>
                    <rect x="490" y="300" width="180" height="40" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="580" y="325" fill="#f43f5e" fontSize="12" textAnchor="middle">Orbital / Edge Operators</text>

                    {/* Routing Lines */}
                    <path d="M 350 120 C 350 170, 220 170, 220 220" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSolid2)" />
                    <path d="M 450 120 C 450 170, 580 170, 580 220" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSolid2)" />

                    <text x="260" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">Low Latency Sync</text>
                    <text x="540" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">Sharded Async</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">DAG Load Balancing & Failure Avoidance</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowDiag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    <line x1="200" y1="50" x2="200" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="600" y1="50" x2="600" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="150" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                    <text x="200" y="40" fill="white" textAnchor="middle" fontWeight="bold">Orchestrator</text>

                    <rect x="550" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="600" y="40" fill="white" textAnchor="middle" fontWeight="bold">Node Pool (Earth)</text>

                    <rect x="185" y="60" width="30" height="30" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                    <text x="175" y="75" fill="#94a3b8" textAnchor="end">Assess DAG weights</text>
                    
                    <line x1="200" y1="100" x2="590" y2="100" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowDiag)" />
                    <text x="400" y="95" fill="#cbd5e1" textAnchor="middle">1. Route to Optimal Node A</text>

                    <rect x="585" y="120" width="30" height="30" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" />
                    <text x="625" y="135" fill="#f43f5e" textAnchor="start">Node A Offline (TCP RST)</text>

                    <line x1="600" y1="170" x2="210" y2="170" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#seqArrowDiag)" />
                    <text x="400" y="165" fill="#cbd5e1" textAnchor="middle">2. Connection Refused</text>

                    <line x1="200" y1="210" x2="590" y2="210" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowDiag)" />
                    <text x="400" y="205" fill="#cbd5e1" textAnchor="middle">3. Auto-Retry to Node B (Next Optimal)</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Rendering Rules</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                All diagrams are implemented as raw SVG React components inline within the markdown/JSX files. This ensures zero external image dependencies, immediate load times, and perfect CSS variable inheritance (such as dark mode colors and standard Tailwind spacing).
            </p>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Broken References:</strong> If an architecture changes, the diagram must change in the exact same Pull Request. Stale diagrams are considered technical debt and are penalized during code review.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> Diagrams must accurately represent the cryptographic trust boundaries. A solid line implies a verified, trusted connection. A dashed line implies an untrusted, physical network hop that requires envelope verification.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Inline SVGs parse alongside the HTML DOM. They have zero TTFB (Time to First Byte) latency compared to external <code>.png</code> or <code>.webp</code> assets.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Review the diagrams to understand exactly where your hardware sits within the global topology.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Do not introduce new structural components to your integration that violate the boundaries defined in these visual specifications.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <p className="text-slate-300 leading-relaxed mb-6">(N/A - Documentation diagrams do not emit telemetry).</p>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The Diagram Library acts as a cross-functional index, tying together execution, security, and generation concepts.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="best-practice" title="Use Heroicons">
                Always pair diagrams with Heroicons when calling out specific warnings or architectural anomalies in the surrounding text to maintain the enterprise aesthetic.
            </Callout>

        </>
    );
}
