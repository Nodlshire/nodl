import React from 'react';
import Callout from '../../../components/docs/Callout';

export default function Glossary() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Technical Glossary</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    Canonical definitions of the precise architectural terminology used throughout the Wnode Sovereign Mesh.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Technical Glossary Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Technical Glossary within the Wnode mesh.
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
                In a complex distributed system, ambiguous terminology leads to architectural drift. If one engineer thinks "Sandbox" means a Docker container, and another thinks it means a SECCOMP Sandbox runtime, security boundaries fail.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> This glossary establishes the absolute, uncompromising definitions of every core component in the Wnode architecture. These definitions are enforced not just in text, but in code.
            </p>

            <h2 id="architecture-diagram">Mesh Ontology</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans text-sm">
                    <defs>
                        <marker id="arrowGlos" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                        </marker>
                    </defs>
                    
                    {/* Core Layer */}
                    <rect x="300" y="50" width="200" height="50" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                    <text x="400" y="80" fill="white" fontWeight="bold" textAnchor="middle">Substrate Specification</text>

                    {/* Generators */}
                    <rect x="150" y="150" width="120" height="40" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
                    <text x="210" y="175" fill="white" textAnchor="middle">intgen (Schema)</text>

                    <rect x="340" y="150" width="120" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="400" y="175" fill="white" textAnchor="middle">nodegen (Handlers)</text>

                    <rect x="530" y="150" width="120" height="40" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="590" y="175" fill="white" textAnchor="middle">spacegen (Shards)</text>

                    <path d="M 400 100 L 210 150" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowGlos)" />
                    <path d="M 400 100 L 400 150" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowGlos)" />
                    <path d="M 400 100 L 590 150" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowGlos)" />

                    {/* Execution */}
                    <rect x="300" y="250" width="200" height="50" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
                    <text x="400" y="280" fill="white" fontWeight="bold" textAnchor="middle">SECCOMP Sandbox Sandbox</text>

                    <path d="M 400 190 L 400 250" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowGlos)" />
                </svg>
            </div>

            <h2 id="core-definitions">Core Definitions</h2>

            <dl className="mt-8 space-y-8">
                <div className="pb-8 border-b border-slate-800/50">
                    <dt className="text-xl font-bold text-white mb-2 font-space-grotesk">Earth Mesh</dt>
                    <dd className="pl-4 border-l-2 border-emerald-500 text-slate-300 leading-relaxed">
                        The Tier-1 layer of the Wnode network composed of terrestrial, low-latency, bare-metal infrastructure. Highly optimized for synchronous, native Go API validation and immediate state transition routing.
                    </dd>
                </div>

                <div className="pb-8 border-b border-slate-800/50">
                    <dt className="text-xl font-bold text-white mb-2 font-space-grotesk">Space Mesh</dt>
                    <dd className="pl-4 border-l-2 border-rose-500 text-slate-300 leading-relaxed">
                        The Tier-3 layer of the Wnode network composed of orbital satellites and high-latency edge nodes. Strictly asynchronous. Optimized for heavily sharded, massively parallel MapReduce workloads.
                    </dd>
                </div>

                <div className="pb-8 border-b border-slate-800/50">
                    <dt className="text-xl font-bold text-white mb-2 font-space-grotesk">Orchestrator</dt>
                    <dd className="pl-4 border-l-2 border-blue-500 text-slate-300 leading-relaxed">
                        The central control plane. The Orchestrator does not execute jobs; it acts as the traffic controller. It ingests payloads, validates HMAC signatures, manages the deterministic routing DAG, and aggregates the global telemetry heartbeats from all operators.
                    </dd>
                </div>

                <div className="pb-8 border-b border-slate-800/50">
                    <dt className="text-xl font-bold text-white mb-2 font-space-grotesk">Substrate Model</dt>
                    <dd className="pl-4 border-l-2 border-amber-500 text-slate-300 leading-relaxed">
                        The foundational architectural philosophy of Wnode. Rather than deploying generic Docker images, logic is defined in declarative YAML and deterministically compiled into memory-bounded handlers (Go) and sandboxes (Native Go).
                    </dd>
                </div>

                <div className="pb-8 border-b border-slate-800/50">
                    <dt className="text-xl font-bold text-white mb-2 font-space-grotesk">SECCOMP Sandbox</dt>
                    <dd className="pl-4 border-l-2 border-slate-500 text-slate-300 leading-relaxed">
                        The zero-dependency WebAssembly runtime embedded in the Wnode Node Operator daemon. Allows operators to safely execute custom third-party validation logic within a strict memory sandbox, devoid of OS-level system access.
                    </dd>
                </div>

                <div className="pb-8">
                    <dt className="text-xl font-bold text-white mb-2 font-space-grotesk">Quorum Reduction</dt>
                    <dd className="pl-4 border-l-2 border-teal-500 text-slate-300 leading-relaxed">
                        A security protocol utilized in Space Mesh MapReduce operations. A shard result is only accepted if a mathematically predefined threshold of distinct, unassociated orbital nodes return the exact same output hash, mitigating malicious operator attacks.
                    </dd>
                </div>
            </dl>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Terminology spans across the entire toolchain. When an error log mentions <code>SECCOMP Sandbox OutOfMemory</code>, both the Operator and the Developer must have an identical mental model of what exactly breached the <code>Substrate Model</code> bounds.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Calling Wnode a Blockchain">
                Wnode is not a blockchain. It does not maintain a global state ledger. Do not refer to Orchestrator payloads as "transactions" or Node Operators as "miners." It is a Sovereign Compute Mesh.
            </Callout>

        </>
    );
}
