import React from 'react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function DesignPrinciples() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Design Principles</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed">
                    The absolute architectural commandments that dictate every engineering decision within the Wnode ecosystem.
                </p>
            </div>

            <h2 id="conceptual-overview">Conceptual Overview & Rationale</h2>
            <p>
                Without dogmatic principles, complex distributed systems degrade into chaotic microservices connected by fragile webhooks. 
            </p>
            <p>
                <strong>The Rationale:</strong> The Wnode principles ensure that no matter how complex an integration becomes, the foundational guarantees of the mesh—security, speed, and determinism—are never compromised.
            </p>

            <h2 id="architecture-diagram">Principle Hierarchy</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowPrin" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                        </marker>
                    </defs>
                    
                    {/* The Triangle */}
                    <polygon points="400,50 600,300 200,300" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />

                    <path d="M 333,133 L 466,133" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                    <path d="M 266,216 L 533,216" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />

                    <text x="400" y="110" fill="#10b981" fontSize="14" fontWeight="bold" textAnchor="middle">1. Security</text>
                    <text x="400" y="180" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">2. Determinism</text>
                    <text x="400" y="270" fill="#a855f7" fontSize="14" fontWeight="bold" textAnchor="middle">3. Performance</text>

                    {/* Explanations */}
                    <path d="M 430 105 L 650 105" fill="none" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowPrin)" />
                    <text x="660" y="108" fill="#94a3b8" fontSize="10">Zero Trust Operator Boundaries</text>

                    <path d="M 460 175 L 650 175" fill="none" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowPrin)" />
                    <text x="660" y="178" fill="#94a3b8" fontSize="10">Strict Mathematical Parity</text>

                    <path d="M 500 265 L 650 265" fill="none" stroke="#64748b" strokeWidth="1" markerEnd="url(#arrowPrin)" />
                    <text x="660" y="268" fill="#94a3b8" fontSize="10">Bare-Metal Cgroups & Wazero</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Principle Conflict Resolution</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 200" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowPrin" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                        </marker>
                        <marker id="seqArrowPrinFail" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                        </marker>
                    </defs>
                    <line x1="200" y1="50" x2="200" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="600" y1="50" x2="600" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="150" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="200" y="40" fill="white" textAnchor="middle" fontWeight="bold">Engineering Proposal</text>

                    <rect x="550" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="1" />
                    <text x="600" y="40" fill="white" textAnchor="middle" fontWeight="bold">Architecture Review</text>

                    <line x1="200" y1="80" x2="590" y2="80" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#seqArrowPrinFail)" />
                    <text x="400" y="75" fill="#f43f5e" textAnchor="middle">"Use Docker instead of WASM for speed"</text>

                    <rect x="585" y="100" width="30" height="30" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" />
                    <text x="625" y="115" fill="#f43f5e" textAnchor="start">Violates Security Principle</text>

                    <line x1="600" y1="150" x2="210" y2="150" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#seqArrowPrinFail)" />
                    <text x="400" y="145" fill="#f43f5e" textAnchor="middle">PR Rejected</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Enforcing Principles in Code</h2>
            <p>Principles are meaningless if they are not enforced at compilation.</p>
            <CodeBlock language="go" title="internal/compiler/validation.go">{`// Determinism Enforcement
func validateWasmImports(module *wasm.Module) error {
    for _, imp := range module.Imports {
        // Explicitly block any HTTP or networking imports
        if imp.Module == "wasi_snapshot_preview1" && imp.Name == "sock_open" {
            return errors.New("principle violation: WASM modules cannot perform networking")
        }
    }
    return nil
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Architectural Drift:</strong> If an engineer bypasses the generators to hand-write an optimized SQL query for the Orchestrator, they introduce a failure mode where the code is no longer declarative. The CI pipeline's AST checker will catch and fail this drift.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p>
                <strong>Invariant:</strong> Security is always paramount. If a performance optimization (like caching execution results on untrusted operators) compromises the security model, the optimization is rejected regardless of the speed benefit.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p>
                Strict adherence to these principles results in a highly predictable performance envelope. We trade edge-case optimization for absolute system reliability.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400">Respect the physical security boundaries. Do not run nodes in environments where third parties have hypervisor access.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400">Read and deeply internalize these three principles before authoring your first <code>spec.yaml</code>.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <p>Violations of these principles at runtime emit critical security alerts.</p>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p>
                These principles are the DNA of the Orchestrator, the Operators, and the Substrate Generators.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="best-practice" title="Follow the Hierarchy">
                When faced with a difficult engineering decision, refer to the triangle. Security first, Determinism second, Performance third.
            </Callout>

        </>
    );
}
