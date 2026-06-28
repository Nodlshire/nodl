import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Glossary | WeNode',
    description: 'Strict architectural definitions for the Wnode ecosystem.',
};

export default function GlossaryPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Glossary</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Formal definitions of strict terminology utilized throughout the Wnode documentation.
            </p>

            <h2 id="architectural-contract">1. Architectural Contract</h2>
            <ul className="list-none pl-0 mb-8 space-y-4 text-slate-300">
                <li><strong className="text-white">Definition:</strong> The mathematically absolute terminology index for the Wnode specification.</li>
                <li><strong className="text-white">Responsibilities:</strong> Defines specific bounding contexts within the mesh infrastructure.</li>
                <li><strong className="text-white">Guarantees:</strong> Zero ambiguity in architectural nomenclature and component mapping.</li>
                <li><strong className="text-white">Requirements:</strong> Universal application across all repositories (`wnode-core`, `wnode-mesh`, `wnode-cli`).</li>
                <li><strong className="text-red-400">Prohibitions:</strong> Ambiguous synonyms, colloquial terminology, and non-deterministic architectural assumptions.</li>
            </ul>

            <h2 id="invariants">2. Core Invariants</h2>
            <div className="overflow-x-auto my-8 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm m-0">
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
                            <td className="p-4 font-mono text-blue-400 font-bold align-top">Substrate</td>
                            <td className="p-4">A byte-compiled WebAssembly module (WASM) generated deterministically from an Integration Spec.</td>
                            <td className="p-4">Executes within the Wazero sandbox. Maximum memory bound: 32MB.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-purple-400 font-bold align-top">Orchestrator</td>
                            <td className="p-4">The centralized ledger and network gateway responsible for payload ingress, cryptographic signing, BFT quorum verification, and <code>SyncManifest</code> payload distribution.</td>
                            <td className="p-4">Exposed via mTLS. Holds root private keys.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-emerald-400 font-bold align-top">Quorum</td>
                            <td className="p-4">A statistically distributed subset of N mesh nodes allocated to simulate identical substrates to mathematically verify determinism.</td>
                            <td className="p-4">Network-wide distribution. `f = (n-1)/3` tolerance.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-amber-400 font-bold align-top">State Diff</td>
                            <td className="p-4">A minimal binary payload representing the byte-for-byte delta mutation resulting from executing a payload against the Substrate.</td>
                            <td className="p-4">Emitted by Wazero to nodld via pointer extraction.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-rose-400 font-bold align-top">Slashing</td>
                            <td className="p-4">The algorithmic eviction of a node operator for violating structural invariants, resulting in reputation or economic penalty.</td>
                            <td className="p-4">Triggered by Orchestrator upon consensus failure.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="inputs-outputs">3. Inputs & Outputs</h2>
            <p>None. This page serves strictly as a definitional matrix.</p>
            
            <h2 id="responsibilities">4. Responsibilities</h2>
            <p>Ensure zero ambiguity in nomenclature when defining architectural bounds.</p>
            
            <h2 id="boundaries">5. Boundaries</h2>
            <p>Definitions apply universally across all repositories: `wnode-core`, `wnode-mesh`, `wnode-cli`.</p>

            <h2 id="failure-modes">6. Failure Mode Matrix</h2>
            <p>Ambiguity leads to non-deterministic architectural assumptions. Strictly adhere to these definitions.</p>

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
                    <li>Network-level: Glossary communication intercepts.</li>
                    <li>Execution-level: Ambiguous specification interpretations.</li>
                    <li>Economic-level: Terminology manipulation for stake.</li>
                    <li>Governance-level: Unchecked colloquiums in protocol upgrades.</li>
                    <li>Telemetry-level: Non-deterministic log taxonomy.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing and ed25519 signatures defining core terms.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Slashing rules for violating exact terminology bounds.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="performance">8. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> N/A.</li>
                <li><strong>Throughput Metrics:</strong> N/A.</li>
                <li><strong>Resource Pressure:</strong> N/A.</li>
            </ul>

            <h2 id="cross-component">9. Cross-Component Interactions</h2>
            <p>N/A.</p>

            <h2 id="telemetry">10. Telemetry Emitted</h2>
            <p>N/A.</p>

            <h2 id="best-practices">11. Best Practices & Anti-Patterns</h2>
            <div className="my-6 bg-red-950/20 border border-red-500/20 rounded-lg p-6 flex gap-4">
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <h4 className="text-red-400 font-bold mt-0 mb-2">Anti-Pattern: Vague Synonyms</h4>
                    <p className="text-slate-300 text-sm m-0">
                        Using terms like "Smart Contract" or "App" when referring to a Substrate. Wnode utilizes Substrates. Using improper nomenclature implies divergent architectural assumptions.
                    </p>
                </div>
            </div>

            <h2 id="visual-architecture">12. Visual Architecture</h2>
            <p className="text-slate-500 italic text-sm">Visual topology N/A for definitional matrices.</p>
        </>
    );
}
