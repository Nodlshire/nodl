import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Threat Model & Guarantees | WeNode',
    description: 'Formal mapping of the Wnode threat matrix, fault vectors, and algorithmic security bounds.',
};

export default function ThreatModelPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Threat Model & Guarantees</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Formal cryptographic bounds and systemic algorithmic responses to adversarial state disruption and hardware faults.
            </p>

            <h2 id="architectural-contract">1. Architectural Contract</h2>
            <ul className="list-none pl-0 mb-8 space-y-4 text-slate-300">
                <li><strong className="text-white">Definition:</strong> The formal mapping of Byzantine Fault Tolerance bounds and adversarial matrices.</li>
                <li><strong className="text-white">Responsibilities:</strong> Defines systemic algorithmic responses to adversarial state disruption.</li>
                <li><strong className="text-white">Guarantees:</strong> State mutation accuracy is bound strictly by the `&gt; 2/3` execution quorum threshold.</li>
                <li><strong className="text-white">Requirements:</strong> Cryptographic signatures, pre-execution checksum validations, single linear memory model, DAG topological ordering, strict WASM sandboxing (no WASI, syscalls, network, or filesystem), <code>Ptr &isin; [0, HeapSize)</code>, <code>Len &le; MaxBlock</code>, and deterministic trap semantics.</li>
                <li><strong className="text-red-400">Prohibitions:</strong> Hardware enclave reliance and optimistic trust architectures.</li>
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
                            <td className="p-4 font-mono text-blue-400">Data Provenance</td>
                            <td className="p-4">Signature(Payload) ≡ Ledger(PK)</td>
                            <td className="p-4">ED25519 Cryptographic Verification</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Code Provenance</td>
                            <td className="p-4">blake3(WASM) &equiv; Registry(CID)</td>
                            <td className="p-4">Pre-Execution blake3 Checksum</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Memory Integrity</td>
                            <td className="p-4">WASM_Bounds(Host) == Hard Fenced</td>
                            <td className="p-4">Cgroups v2 & Wazero Linear Memory</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="inputs-outputs">3. Inputs & Outputs</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Inputs:</strong> Untrusted execution hardware, hostile network packets, malicious payload injections.</li>
                <li><strong>Outputs:</strong> Cryptographically proven state diffs or deterministic slashes.</li>
            </ul>

            <h2 id="responsibilities">4. Responsibilities</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Network Boundary:</strong> Drops unsigned or replay-attack TCP connections instantly.</li>
                <li><strong>Quorum Manager:</strong> Detects BFT divergence and slashes minority subsets.</li>
            </ul>

            <h2 id="boundaries">5. Boundaries</h2>
            <p>
                The trust boundary terminates at the WASM binary. Anything outside the Wazero runtime (including the host OS, CPU architecture, and network stack) is treated as a malicious actor.
            </p>

            <h2 id="threat-model">6. Threat Model Detail</h2>
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
                    <li>Network-level: BFT quorum sybil attacks.</li>
                    <li>Execution-level: Malicious WASM binary instantiation.</li>
                    <li>Economic-level: Denial of service via free compute.</li>
                    <li>Governance-level: Bypassing decentralized registry logic.</li>
                    <li>Telemetry-level: Forged BFT consensus states.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for binary commitments and ed25519 signatures for network consensus.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Hard slashing penalties for Byzantine divergence.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="performance">8. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-8 text-slate-300">
                <li><strong>Latency Bounds:</strong> Cryptographic verification (ED25519) consumes <code>ExecTime &le; 50µs</code> per payload.</li>
                <li><strong>Resource Pressure:</strong> Memory sandbox bounds checking adds <code>cpu_pressure_pct &le; 0%</code> runtime overhead via Wazero AOT compilation.</li>
            </ul>

            <h2 id="cross-component">9. Cross-Component Interactions</h2>
            <p>
                Nodes continuously ping the Orchestrator. If a node is compromised and halts, the Orchestrator instantly routes the shard to a backup execution layer, managed securely through the synchronized <code>SyncManifest</code> heartbeat pipeline.
            </p>

            <h2 id="telemetry">10. Telemetry Emitted</h2>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-blue-300">
<pre className="m-0 bg-transparent border-0">{`{
  "event": "SECURITY_VIOLATION",
  "vector": "NONCE_REPLAY",
  "nodeId": "0x...",
  "rejectedHash": "0xabcd..."
}`}</pre>
            </div>

            <h2 id="best-practices">11. Best Practices & Anti-Patterns</h2>
            <div className="my-6 bg-red-950/20 border border-red-500/20 rounded-lg p-6 flex gap-4">
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <h4 className="text-red-400 font-bold mt-0 mb-2">Anti-Pattern: Hardware Enclave Reliance</h4>
                    <p className="text-slate-300 text-sm m-0">
                        Designing integrations that assume hardware security (Intel SGX, AMD SEV). Hardware boundaries are frequently broken via side-channels (e.g. Spectre). Wnode guarantees security via mathematical consensus, not hardware enclaves.
                    </p>
                </div>
            </div>

            <h2 id="visual-architecture">12. Visual Architecture</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 600 200" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <rect x="50" y="50" width="100" height="100" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="100" y="105" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Adversary</text>
                    
                    <line x1="150" y1="100" x2="290" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <text x="220" y="90" fill="#888" fontSize="11" textAnchor="middle">Replay Attack</text>

                    <rect x="300" y="20" width="250" height="160" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="425" y="45" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Security Boundary (mTLS + Nonce)</text>

                    <circle cx="425" cy="100" r="30" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="425" y="105" fill="#888" fontSize="11" textAnchor="middle">WASM</text>

                    <line x1="300" y1="70" x2="330" y2="100" stroke="#444" strokeWidth="1.5" />
                    <line x1="300" y1="130" x2="330" y2="100" stroke="#444" strokeWidth="1.5" />
                    <text x="345" y="105" fill="#ccc" fontSize="14" fontWeight="bold">REJECT</text>
                </svg>
            </div>
        </>
    );
}
