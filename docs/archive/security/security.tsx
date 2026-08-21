import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Security Model | WeNode',
    description: 'Formal specification of the cryptographic primitives and trust boundaries securing the Wnode mesh.',
};

export default function SecurityModelPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Security Model</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict definitions of the cryptographic contracts, memory boundaries, and BFT consensus models securing execution payloads.
            </p>

            <h2 id="architectural-contract">1. Architectural Contract</h2>
            <ul className="list-none pl-0 mb-8 space-y-4 text-slate-300">
                <li><strong className="text-white">Definition:</strong> The formal cryptographic primitives and trust boundaries securing the execution mesh.</li>
                <li><strong className="text-white">Responsibilities:</strong> Enforces a Zero-Trust operator model against hostile hardware and compromised operating systems.</li>
                <li><strong className="text-white">Guarantees:</strong> Security relies entirely on algorithmic determinism, mathematical cryptography, and OS-level memory fences.</li>
                <li><strong className="text-white">Requirements:</strong> ED25519 payload signatures, systemd Cgroups v2 limits, and SECCOMP Sandbox Linear Memory trapping. Execution enforces a single linear memory model, DAG topological order, strict Native Go sandboxing (no WASI, no syscalls, no network, no filesystem), pointer bounds <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>, and standardized trap semantics.</li>
                <li><strong className="text-red-400">Prohibitions:</strong> Trusting unverified ingress data, executing without monotonic nonces, and allowing Native Go host OS imports.</li>
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
                            <td className="p-4 font-mono text-blue-400">Ingress Trust</td>
                            <td className="p-4">Verify(Payload, PK) == true</td>
                            <td className="p-4">ED25519 signature checks per event.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Memory Integrity</td>
                            <td className="p-4">Index &lt; Linear_Memory.Len</td>
                            <td className="p-4">Native Go Host runtime boundary checks.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Network Egress</td>
                            <td className="p-4">Syscalls.Socket == Trap</td>
                            <td className="p-4">Zero Native Go Host Imports.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="inputs-outputs">3. Inputs & Outputs</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Inputs:</strong> ED25519 Public Keys, Monotonic Nonces, Signed Payloads.</li>
                <li><strong>Outputs:</strong> Binary Accept/Reject decisions.</li>
            </ul>

            <h2 id="responsibilities">4. Responsibilities</h2>
            <p>
                The <code>nodld</code> daemon is responsible for dropping unsigned packets before they consume Native Go execution cycles. The Orchestrator is responsible for maintaining the monotonic nonce sequence to prevent replay attacks.
            </p>

            <h2 id="boundaries">5. Boundaries</h2>
            <p>
                The network boundary is secured via mTLS. The process boundary is secured via systemd Cgroups v2. The execution boundary is secured via the SECCOMP Sandbox WebAssembly sandbox.
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
                    <li>Network-level: Payload replay attacks and mTLS spoofing.</li>
                    <li>Execution-level: SECCOMP Sandbox sandbox memory scraping.</li>
                    <li>Economic-level: Costly execution loops (gas depletion).</li>
                    <li>Governance-level: Invalid PK propagation.</li>
                    <li>Telemetry-level: Signature rejection spam.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for payload integrity and ed25519 signatures for authentication.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Slashing of operator stakes for network boundary violations.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="performance">8. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-8 text-slate-300">
                <li><strong>Latency Bounds:</strong> ED25519 signature verification must execute in <code>ExecTime &le; 50µs</code> per payload.</li>
                <li><strong>Throughput Metrics:</strong> Maintains the <code>&gt; 10,000 ops_per_sec</code> throughput invariant.</li>
            </ul>

            <h2 id="cross-component">9. Cross-Component Interactions</h2>
            <p>
                Orchestrators supply Public Keys via the <code>SyncManifest</code> payload during node initialization, strictly enforcing the canonical <code>(ptr: i32, len: i32)</code> Native Go boundary.
            </p>

            <h2 id="telemetry">10. Telemetry Emitted</h2>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-blue-300">
<pre className="m-0 bg-transparent border-0">{`{
  "event": "SIGNATURE_REJECT",
  "reason": "INVALID_ED25519",
  "clientIp": "198.51.100.14"
}`}</pre>
            </div>

            <h2 id="best-practices">11. Best Practices & Anti-Patterns</h2>
            <div className="my-6 bg-red-950/20 border border-red-500/20 rounded-lg p-6 flex gap-4">
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <h4 className="text-red-400 font-bold mt-0 mb-2">Anti-Pattern: Dynamic Keys</h4>
                    <p className="text-slate-300 text-sm m-0">
                        Never dynamically fetch public keys from an API during execution. All keys must be statically provisioned via the cryptographic SyncManifest prior to epoch start.
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
                    <rect x="50" y="50" width="120" height="100" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="80" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Payload</text>
                    <text x="110" y="105" fill="#888" fontSize="11" textAnchor="middle">Data Bytes</text>
                    <text x="110" y="125" fill="#888" fontSize="11" textAnchor="middle">Sig(ED25519)</text>

                    <line x1="170" y1="100" x2="300" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <rect x="310" y="20" width="250" height="160" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="435" y="45" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">nodld Daemon</text>

                    <rect x="340" y="70" width="190" height="80" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="435" y="100" fill="#888" fontSize="11" textAnchor="middle">Verify(Payload, PK)</text>
                    <text x="435" y="120" fill="#888" fontSize="11" textAnchor="middle">Check Nonce &gt; State.Nonce</text>
                    <text x="435" y="140" fill="#888" fontSize="11" textAnchor="middle">Pass to Native Go Sandbox</text>
                </svg>
            </div>
        </>
    );
}
