import React from 'react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function Lifecycle() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Integration Lifecycle</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed">
                    The strict, cryptographically verified pipeline that promotes a developer's idea into a globally executed reality on the Wnode Mesh.
                </p>
            </div>

            <h2 id="conceptual-overview">Conceptual Overview & Rationale</h2>
            <p>
                In a typical startup, developers push code to a staging server, click around to test it, and then deploy it to production. In a decentralized Sovereign Mesh, there is no "staging server" that mimics 5,000 global bare-metal operators. 
            </p>
            <p>
                <strong>The Rationale:</strong> The lifecycle of an integration must be perfectly determinable via the CI/CD pipeline before it ever touches a real node. The Substrate Generation pipeline acts as a dry-run factory, ensuring that if it compiles locally, it will execute flawlessly globally.
            </p>

            <h2 id="architecture-diagram">End-to-End Lifecycle Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowLife" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="100" width="100" height="40" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                    <text x="100" y="125" fill="white" fontSize="12" textAnchor="middle">1. Propose Spec</text>

                    <path d="M 150 120 L 220 120" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowLife)" />

                    <rect x="220" y="100" width="100" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="270" y="125" fill="white" fontSize="12" textAnchor="middle">2. CI Verification</text>

                    <path d="M 320 120 L 390 120" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowLife)" />

                    <rect x="390" y="100" width="120" height="40" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                    <text x="450" y="125" fill="white" fontSize="12" textAnchor="middle">3. WASM Authoring</text>

                    <path d="M 510 120 L 580 120" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowLife)" />

                    <rect x="580" y="100" width="150" height="40" rx="4" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
                    <text x="655" y="125" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">4. Global Ingestion</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Mainnet Ingestion Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowLife" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="400" y1="50" x2="400" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="650" y1="50" x2="650" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">GitHub (Main)</text>

                    <rect x="350" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                    <text x="400" y="40" fill="white" textAnchor="middle" fontWeight="bold">Orchestrator</text>

                    <rect x="600" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="650" y="40" fill="white" textAnchor="middle" fontWeight="bold">Node Operators</text>

                    <line x1="150" y1="80" x2="390" y2="80" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowLife)" />
                    <text x="275" y="75" fill="#cbd5e1" textAnchor="middle">1. Webhook: PR Merged</text>

                    <rect x="385" y="100" width="30" height="30" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                    <text x="375" y="115" fill="#94a3b8" textAnchor="end">2. Sync DB with new Spec</text>

                    <line x1="400" y1="150" x2="640" y2="150" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowLife)" />
                    <text x="525" y="145" fill="#cbd5e1" textAnchor="middle">3. Broadcast "Update Available"</text>

                    <rect x="635" y="170" width="30" height="30" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                    <text x="675" y="185" fill="#94a3b8" textAnchor="start">4. Git Pull & Compile Go locally</text>

                    <line x1="650" y1="210" x2="410" y2="210" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowLife)" />
                    <text x="525" y="205" fill="#cbd5e1" textAnchor="middle">5. Heartbeat "Ready for Workloads"</text>
                </svg>
            </div>

            <h2 id="real-code-examples">The GitHub Action Trigger</h2>
            <CodeBlock language="yaml" title=".github/workflows/verify.yml">{`name: Substrate Verification
on:
  pull_request:
    branches: [ "main" ]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Run Master Verifier
      run: go run ./cmd/verify_substrate/main.go --dir ./integrations
      
    # If the author forgot to run generate_all, the verifier fails the build.
    # The integration is blocked from moving to Phase 4.`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Merge Conflicts on Generated Files:</strong> Because multiple developers might add integrations simultaneously, merge conflicts in `generated.go` registries are common. Wnode resolves this by telling developers to never resolve conflicts manually—instead, they pull `main` and run `generate_all` again.</li>
                <li><strong>Node Update Failure:</strong> If a Node Operator fails to pull the new GitHub merge (e.g. DNS failure), their local `spec` hash will not match the Orchestrator's hash. The Orchestrator immediately cuts off payload routing to that node until the node resolves its network issue and reports the correct hash.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p>
                <strong>Invariant:</strong> The Orchestrator operates on a Pull-Model for ingestion. It verifies the GitHub webhook cryptographic signature to ensure malicious actors cannot forge a "PR Merged" event and corrupt the Orchestrator's internal routing table.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p>
                The time from a GitHub Merge to Global Mesh Availability is roughly <code>45 seconds</code>. This includes the Orchestrator database sync (<code>&lt;2s</code>), the global WebSocket broadcast (<code>&lt;3s</code>), and the Node Operators executing <code>git pull</code> and running the Go compiler locally (<code>~40s</code>).
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400">Keep the <code>nodld</code> daemon running. It automatically manages the git synchronization and compilation hooks. Intervening manually during a mesh upgrade will break the node.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400">Respect the CI/CD pipeline. Do not push WASM binaries that haven't been thoroughly profiled locally. A memory leak merged into main will immediately trigger network-wide faults.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <CodeBlock language="json" title="Orchestrator Ingestion Sync">{`{
  "event": "mesh_upgrade_complete",
  "version": "v1.4.2",
  "nodes_synchronized": 4210,
  "nodes_failed": 12,
  "elapsed_seconds": 42.1
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p>
                The lifecycle integrates GitHub infrastructure, Orchestrator APIs, Node Daemon background workers, and Go's native compilation toolchain (<code>go build</code>) executed dynamically on the operator's machine.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="best-practice" title="Best Practice: Additive Upgrades">
                When modifying an integration, try to make additive changes to the <code>spec.yaml</code>. If you fundamentally change the data shape of an existing integration, any DApp that hasn't updated their SDK will immediately experience 422 Validation errors from the Orchestrator.
            </Callout>

        </>
    );
}
