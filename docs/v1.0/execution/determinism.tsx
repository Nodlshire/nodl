import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Determinism & Reproducibility | WeNode',
    description: 'Formal specification of the causal consistency and byte-identical reproducibility bounds of the execution mesh.',
};

export default function DeterminismPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Determinism & Reproducibility</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Mathematical and execution constraints enforcing strict causal consistency and byte-for-byte identical state transitions across the mesh.
            </p>

            <h2 id="architectural-contract">1. Architectural Contract</h2>
            <ul className="list-none pl-0 mb-8 space-y-4 text-slate-300">
                <li><strong className="text-white">Definition:</strong> The causal consistency and byte-identical reproducibility bounds of the execution mesh.</li>
                <li><strong className="text-white">Responsibilities:</strong> Ensure any function executed on arbitrary hardware yields the exact same byte-sequence output.</li>
                <li><strong className="text-white">Guarantees:</strong> Substrate state is a pure function of genesis state and cryptographic events.</li>
                <li><strong className="text-white">Requirements:</strong> Single-threaded linear execution and disabled multi-threading.</li>
                <li><strong className="text-red-400">Prohibitions:</strong> System clock access, hardware FPU drift, and unseeded PRNG randomness.</li>
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
                            <td className="p-4 font-mono text-blue-400">Time</td>
                            <td className="p-4 font-mono">No access to system clock.</td>
                            <td className="p-4">WASM Host blocks time syscalls.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Concurrency</td>
                            <td className="p-4 font-mono">Single-threaded linear execution.</td>
                            <td className="p-4">WASM multi-threading disabled.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Float Parsing</td>
                            <td className="p-4 font-mono">No hardware FPU drift.</td>
                            <td className="p-4">Soft-float integer math wrappers.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Randomness</td>
                            <td className="p-4 font-mono">PRNG derived exclusively from payload Seed.</td>
                            <td className="p-4">Host rejects `Math.random` equivalents.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="inputs-outputs">3. Inputs & Outputs</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Inputs:</strong> Serialized JSON/BSON Event Payload + Deterministic Seed.</li>
                <li><strong>Outputs:</strong> Modified byte-array pointer offset representing State Delta.</li>
            </ul>

            <h2 id="responsibilities">4. Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Orchestrator:</strong> Ensures strict ordering of events via absolute Sequence IDs.</li>
                <li><strong>Wazero Runtime:</strong> Sandboxes the substrate from non-deterministic host externalities.</li>
                <li><strong>Generators:</strong> Embed static PRNG seeding algorithms derived from Orchestrator nonces.</li>
            </ul>

            <h2 id="boundaries">5. Boundaries</h2>
            <p>
                Determinism breaks at the network layer. Therefore, nodes cannot make outbound network requests (e.g. REST API calls). All external data must be ingested by the Orchestrator, signed, sequenced, and passed as input arguments to the substrate.
            </p>

            <h2 id="failure-modes">6. Failure Mode Matrix</h2>
            <div className="overflow-x-auto my-8 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm whitespace-nowrap m-0">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Fault Vector</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Detection Trigger</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Algorithmic Resolution</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400">
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-red-400">State Hash Divergence</td>
                            <td className="p-4">Quorum mismatch on Sequence ID X</td>
                            <td className="p-4">Minority nodes slashed. State rolled back to X-1.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-orange-400">Float Precision Drift</td>
                            <td className="p-4">Cross-architecture JSON float mismatch</td>
                            <td className="p-4">Pipeline enforces integers/strings for precision decimals.</td>
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
                    <li>Network-level: Network request injection.</li>
                    <li>Execution-level: Time-based branching and Float precision drift.</li>
                    <li>Economic-level: Forged state mutations.</li>
                    <li>Governance-level: PRNG seed manipulation.</li>
                    <li>Telemetry-level: Replayed execution seeds.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing and ed25519 signatures.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Slashing rules for hash divergence across the quorum.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> is bound by slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> is untrusted, verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> executes with no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="performance">8. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ExecTime &le; 50ms</code>, <code>RTT &le; 200ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> High <code>ops_per_sec</code> achieved via horizontal, independent sandboxes.</li>
                <li><strong>Warm vs Cold Start:</strong> <code>ColdStart = initial WASM instantiation</code>, <code>WarmStart = cached instance reuse</code>.</li>
            </ul>

            <h2 id="cross-component">9. Cross-Component Interactions</h2>
            <p>
                Orchestrator Sequence IDs dictate the exact PRNG seed injected into the Substrate during execution. This injection is mapped entirely through the canonical <code>(ptr: i32, len: i32)</code> ABI and validated structurally by the <code>SyncManifest</code> pipeline.
            </p>

            <h2 id="telemetry">10. Telemetry Emitted</h2>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-blue-300">
<pre className="m-0 bg-transparent border-0">{`{
  "sequence_id": 99481,
  "execution_seed": "0x44ab82...",
  "resulting_state_hash": "0x9f1a..."
}`}</pre>
            </div>

            <h2 id="best-practices">11. Best Practices & Anti-Patterns</h2>
            <div className="my-6 bg-red-950/20 border border-red-500/20 rounded-lg p-6 flex gap-4">
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <h4 className="text-red-400 font-bold mt-0 mb-2">Anti-Pattern: Local Timestamps</h4>
                    <p className="text-slate-300 text-sm m-0">
                        Writing <code>let time = Date.now();</code> inside a generated logic handler. This generates divergent state hashes across hardware. All time assertions must rely on the Orchestrator-signed block timestamp provided in the event input payload.
                    </p>
                </div>
            </div>

            <h2 id="visual-architecture">12. Visual Architecture</h2>
            <div className="my-10 bg-black border border-white/10 rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 200" className="w-full h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    {/* Node A */}
                    <rect x="50" y="50" width="150" height="100" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="125" y="80" fill="#888" fontSize="14" textAnchor="middle" fontWeight="bold">Node A (ARM64)</text>
                    <text x="125" y="105" fill="#888" fontSize="12" textAnchor="middle">Input(X)</text>
                    <text x="125" y="125" fill="#10b981" fontSize="12" textAnchor="middle">Output Hash: 0x9f1a</text>

                    {/* Node B */}
                    <rect x="325" y="50" width="150" height="100" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="400" y="80" fill="#888" fontSize="14" textAnchor="middle" fontWeight="bold">Node B (x86_64)</text>
                    <text x="400" y="105" fill="#888" fontSize="12" textAnchor="middle">Input(X)</text>
                    <text x="400" y="125" fill="#10b981" fontSize="12" textAnchor="middle">Output Hash: 0x9f1a</text>

                    {/* Node C */}
                    <rect x="600" y="50" width="150" height="100" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="675" y="80" fill="#888" fontSize="14" textAnchor="middle" fontWeight="bold">Node C (RISC-V)</text>
                    <text x="675" y="105" fill="#888" fontSize="12" textAnchor="middle">Input(X)</text>
                    <text x="675" y="125" fill="#10b981" fontSize="12" textAnchor="middle">Output Hash: 0x9f1a</text>
                </svg>
            </div>
        </>
    );
}
