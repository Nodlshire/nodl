import React from 'react';
import Callout from '../../../../components/docs/Callout';
import CodeBlock from '../../../../components/docs/CodeBlock';

export default function TestingAndVerification() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Testing & Verification</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    Zero-tolerance CI/CD validation. Ensuring absolute parity between the declarative specification and the execution footprint.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Testing & Verification Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Testing & Verification within the Wnode mesh.
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
                In a monolithic codebase, testing ensures the logic works. In a generative Substrate mesh, testing ensures the logic <strong>matches the contract</strong>.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> The Orchestrator routes data based on the assumptions written in the <code>spec.yaml</code>. If a developer manually modifies the generated Go handler to consume 4GB of RAM, but the spec says 512MB, the Orchestrator will under-price the job and the Node Operator's physical hardware will crash. The <code>verify_substrate</code> check mathematically guarantees that the generated artifacts perfectly map to the YAML specification.
            </p>

            <h2 id="architecture-diagram">Verification Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 300" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowTest" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                        </marker>
                    </defs>
                    
                    {/* Source */}
                    <rect x="50" y="50" width="120" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
                    <text x="110" y="75" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">spec.yaml</text>

                    <rect x="50" y="200" width="120" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
                    <text x="110" y="225" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Generated .go</text>

                    {/* CI Verifier */}
                    <rect x="300" y="100" width="200" height="100" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" />
                    <text x="400" y="130" fill="#10b981" fontSize="14" fontWeight="bold" textAnchor="middle">verify_substrate</text>
                    <text x="400" y="150" fill="#94a3b8" fontSize="10" textAnchor="middle">(AST Cross-Compilation)</text>

                    <path d="M 170 70 C 230 70, 230 130, 300 130" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowTest)" />
                    <path d="M 170 220 C 230 220, 230 170, 300 170" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowTest)" />

                    {/* Outcome */}
                    <rect x="600" y="60" width="120" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="660" y="85" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle">Exit 0 (Merge)</text>

                    <rect x="600" y="180" width="120" height="40" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
                    <text x="660" y="205" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="middle">Exit 1 (Reject)</text>

                    <path d="M 500 130 L 590 80" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowTest)" />
                    <path d="M 500 170 L 590 200" fill="none" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrowTest)" strokeDasharray="4 4" />
                </svg>
            </div>

            <h2 id="sequence-diagram">Dry-Run Simulation Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 200" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowTest" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="500" y1="50" x2="500" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">Developer</text>

                    <rect x="450" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                    <text x="500" y="40" fill="white" textAnchor="middle" fontWeight="bold">generate_all</text>

                    <line x1="150" y1="80" x2="490" y2="80" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowTest)" />
                    <text x="325" y="75" fill="#cbd5e1" textAnchor="middle">1. Run with --dry-run</text>

                    <rect x="485" y="100" width="30" height="30" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                    <text x="525" y="110" fill="#94a3b8" textAnchor="start">2. AST compiled to memory</text>
                    <text x="525" y="125" fill="#94a3b8" textAnchor="start">3. Diff calculated, NO disk write</text>

                    <line x1="500" y1="160" x2="160" y2="160" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowTest)" />
                    <text x="325" y="155" fill="#cbd5e1" textAnchor="middle">4. Log simulation results</text>
                </svg>
            </div>

            <h2 id="real-code-examples">The Verifier Implementation</h2>
            <CodeBlock language="go" title="nodld/cmd/verify_substrate/main.go">{`func VerifyIntegration(dir string) error {
    spec, err := LoadSpec(dir + "/spec.yaml")
    
    // Reverse-parse the generated Go handler AST
    fset := token.NewFileSet()
    node, err := parser.ParseFile(fset, dir+"/generated/handler.go", nil, parser.ParseComments)
    
    // Traverse the AST to find the struct fields
    ramField := findStructTag(node, "RAM")
    if ramField != spec.NodeJob.RequiredResources.RAM {
        return fmt.Errorf("compliance failure: AST RAM (%s) != Spec RAM (%s)", ramField, spec.NodeJob.RequiredResources.RAM)
    }
    
    return nil
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Manual Overrides:</strong> If a developer directly edits the <code>integration.json</code> or <code>.go</code> files and pushes the PR, <code>verify_substrate</code> will detect the AST mismatch. The GitHub Action will output a hard failure, preventing the code from entering the main branch.</li>
                <li><strong>Stale Footprints:</strong> If a developer updates the <code>spec.yaml</code> but forgets to run <code>generate_all</code>, the verification tool detects the stale footprint and fails.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> The verification pipeline runs in an isolated, sandboxed Docker container during CI/CD. It is structurally impossible for an integration author to bypass or rewrite the verification pipeline script via their PR.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <code>verify_substrate</code> parses ASTs entirely in memory. Validating all 600+ integrations on the Wnode mesh requires roughly <code>2.4 seconds</code>, making it completely non-blocking for rapid CI/CD iteration.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Rely on the fact that the Orchestrator will never feed you an integration that failed the verify step. You do not need to run verification locally.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Always run the pipeline locally before pushing. Do not rely on CI to format or generate your code.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <p className="text-slate-300 leading-relaxed mb-6">The verifier emits standard out structured logs for CI tools:</p>
            <CodeBlock language="json" title="Verification Output">{`{
  "total_scanned": 582,
  "compliant": 582,
  "non_compliant": 0,
  "execution_time_ms": 2410,
  "status": "PASS"
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The Verifier bridges the gap between GitHub (the repository) and the Orchestrator. It acts as the final gatekeeper before the Orchestrator database synchronizes the new routing data.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="best-practice" title="Use Git Pre-commit Hooks">
                Set up a <code>.git/hooks/pre-commit</code> script that automatically runs <code>go run ./cmd/generate_all/main.go --dir ../integrations</code> before you commit. This guarantees you will never push a PR that fails the verifier.
            </Callout>
        </>
    );
}
