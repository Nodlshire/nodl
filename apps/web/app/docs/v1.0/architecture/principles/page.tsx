import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Design Principles | WeNode',
    description: 'Formal architectural principles and non-negotiable boundaries of the Wnode execution mesh.',
};

export default function PrinciplesPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Design Principles</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                The strict, hierarchical constants governing all component engineering and topological decisions within the sovereign compute mesh.
            </p>

            <h2 id="architectural-contract">1. Architectural Contract</h2>
            <ul className="list-none pl-0 mb-8 space-y-4 text-slate-300">
                <li><strong className="text-white">Definition:</strong> The absolute, ordered hierarchy governing all architectural decisions.</li>
                <li><strong className="text-white">Responsibilities:</strong> Algorithmic filtration of all codebase contributions and system behaviors.</li>
                <li><strong className="text-white">Guarantees:</strong> Security <code>&gt;</code> Determinism <code>&gt;</code> Performance.</li>
                <li><strong className="text-white">Requirements:</strong> Zero-Trust operator assumptions and cryptographic boundaries.</li>
                <li><strong className="text-red-400">Prohibitions:</strong> Sacrificing a higher-order principle (e.g., Security) for a lower-order metric (e.g., Performance).</li>
            </ul>

            <h2 id="invariants">2. Core Invariants</h2>
            <div className="overflow-x-auto my-8 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm whitespace-nowrap m-0">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Name</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Description</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Enforcement Rule</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400">
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">State Transition</td>
                            <td className="p-4">S(n+1) = f(S(n), P)</td>
                            <td className="p-4">Single-threaded execution without nondeterminism.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-slate-500">L1 (Highest)</td>
                            <td className="p-4 font-bold text-red-400">Security & Isolation</td>
                            <td className="p-4">Cgroups v2, mTLS, zero WASM OS imports.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-slate-500">L2</td>
                            <td className="p-4 font-bold text-blue-400">Absolute Determinism</td>
                            <td className="p-4">Pure pure-functional execution. No system clocks.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-slate-500">L3</td>
                            <td className="p-4 font-bold text-emerald-400">High Performance</td>
                            <td className="p-4">Zero-allocation loops. Pre-compiled memory caches.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="inputs-outputs">3. Inputs & Outputs</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Inputs:</strong> Architectural proposals, CI/CD code merges, generator logic updates.</li>
                <li><strong>Outputs:</strong> Accepted or Rejected mesh upgrades.</li>
            </ul>

            <h2 id="responsibilities">4. Responsibilities</h2>
            <p>
                The principles act as an algorithmic filter for the codebase. If a Pull Request violates L1 or L2 for the sake of L3, the PR is automatically invalid.
            </p>

            <h2 id="boundaries">5. Boundaries</h2>
            <p>
                Trust is entirely externalized from human operation. Operator promises are void; only cryptographic enforcement (HMAC/ED25519) and OS-level memory fences (Cgroups) are recognized boundaries.
            </p>

            <h2 id="failure-modes">6. Failure Mode Matrix</h2>
            <div className="overflow-x-auto my-8 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm whitespace-nowrap m-0">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Fault Vector</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Violation</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Algorithmic Resolution</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400">
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-red-400">Filesystem Access</td>
                            <td className="p-4">L1 (Security)</td>
                            <td className="p-4">Wazero traps on unknown host function.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Time-Based Branching</td>
                            <td className="p-4">L2 (Determinism)</td>
                            <td className="p-4">Hash divergence across quorum -> Node Slashed.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Heap Allocation Spike</td>
                            <td className="p-4">L3 (Performance)</td>
                            <td className="p-4">OOM Trap triggered > 32MB.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="security-model">7. Threat Model Detail</h2>
            <div className="mb-6">
                <strong>Adversary Classes:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Passive Observer</li>
                    <li>Active Network Adversary</li>
                    <li>Malicious Operator</li>
                    <li>Byzantine Orchestrator</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Attack Surfaces:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Network-level: Unverified payload broadcasts.</li>
                    <li>Execution-level: Filesystem access and OOM spikes.</li>
                    <li>Economic-level: L3 Performance over L1 Security abuses.</li>
                    <li>Governance-level: Malicious algorithmic filter bypasses.</li>
                    <li>Telemetry-level: Forged CI/CD compliance metrics.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing and ed25519 signatures for all inputs.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Slashing rules for violating execution bounds.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="performance">8. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ExecTime &le; 50ms</code>, <code>RTT &le; 200ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> System-wide <code>ops_per_sec</code>.</li>
                <li><strong>Resource Pressure:</strong> Minimal <code>cpu_pressure_pct</code> and strictly bounded <code>mem_pressure_mb</code>.</li>
            </ul>

            <h2 id="cross-component">9. Cross-Component Interactions</h2>
            <p>
                Generators (<code>intgen</code>, <code>nodegen</code>) embed these principles into the synthesized AST, explicitly enforcing the canonical <code>(ptr: i32, len: i32)</code> ABI. The output WASM binary is the mathematical manifestation of the Design Principles, integrated fully via the <code>SyncManifest</code>.
            </p>

            <h2 id="telemetry">10. Telemetry Emitted</h2>
            <p>
                The CI pipeline emits validation JSON indicating principle compliance during `spec.yaml` compilation.
            </p>

            <h2 id="best-practices">11. Best Practices & Anti-Patterns</h2>
            <div className="my-6 bg-red-950/20 border border-red-500/20 rounded-lg p-6 flex gap-4">
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <h4 className="text-red-400 font-bold mt-0 mb-2">Anti-Pattern: Optimistic Execution</h4>
                    <p className="text-slate-300 text-sm m-0">
                        Executing untrusted logic before validating the cryptographic signature. Violates L1 (Security).
                    </p>
                </div>
            </div>

            <h2 id="visual-architecture">12. Visual Architecture</h2>
            <div className="my-10 bg-black border border-white/10 rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 400 300" className="w-full max-w-md mx-auto h-auto">
                    <polygon points="200,20 100,100 300,100" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="200" y="75" fill="#888" fontSize="14" textAnchor="middle" fontWeight="bold">L1: Security</text>

                    <polygon points="100,100 50,200 350,200 300,100" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="200" y="160" fill="#888" fontSize="14" textAnchor="middle" fontWeight="bold">L2: Determinism</text>

                    <polygon points="50,200 0,280 400,280 350,200" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="200" y="250" fill="#10b981" fontSize="14" textAnchor="middle" fontWeight="bold">L3: Performance</text>
                </svg>
            </div>
        </>
    );
}
