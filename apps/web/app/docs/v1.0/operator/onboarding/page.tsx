import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Onboarding Pipeline | WeNode',
    description: 'Formal architectural specification of the deterministic operator bootstrapping sequence.',
};

export default function OnboardingPipelinePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Onboarding Pipeline</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict multi-phase cryptographic verification sequence required for network inclusion and shard assignment.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The Onboarding Pipeline operates as a highly restrictive, asynchronous state machine independent of the core execution mesh. It enforces a strict topological sort of verification phases: Cryptographic Identity Generation &rarr; Stake Verification &rarr; Synthetic Benchmark &rarr; Topology Assignment. Nodes cannot bypass any phase; failure at any step results in immediate connection termination and garbage collection of the pending node state. The synthetic benchmark enforces the core network rules: a single linear memory model, strict WASM sandboxing (no WASI, no syscalls, no network, no filesystem), and execution in DAG topological order. Memory is restricted to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>, testing that the prospective node correctly normalizes all trap codes and fault pathways.
            </p>

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
                            <td className="p-4 font-mono text-blue-400">Onboarding Predicate</td>
                            <td className="p-4">P_onboard = Verify_Stake(Tx) ∧ Verify_ED25519(PK) ∧ Fuzz_Match(S(n+1))</td>
                            <td className="p-4">Cryptographic and determinism checks.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Shard Routing</td>
                            <td className="p-4">Shard_Assignment = blake3(PK) % Total_Active_Shards</td>
                            <td className="p-4">Deterministic node allocation.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Capacity Requirement</td>
                            <td className="p-4">Total_Active_Nodes * 10000 &ge; Expected_TPS</td>
                            <td className="p-4">Mesh scale bounds.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">State Transition</td>
                            <td className="p-4">S(n+1) = f(S(n), P)</td>
                            <td className="p-4">Single-threaded execution without nondeterminism.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Unauthenticated nodes interact exclusively with the `ingress-auth` gateway. Communication uses a strictly typed protobuf handshake before the node is allowed to upgrade the connection to mTLS.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// protobuf: Onboarding Handshake
message NodeJoinRequest {
  bytes public_key = 1;
  bytes signature = 2;
  bytes stake_tx_hash = 3;
  HardwareAttestation hw_proof = 4;
}

message OnboardingChallenge {
  bytes nonce = 1;
  bytes synthetic_wasm_blob = 2;
  uint64 expected_gas = 3;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Onboarding Flow)</h2>
            <div className="overflow-x-auto my-8 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm m-0">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                            <th className="p-4 font-semibold uppercase text-xs">Phase</th>
                            <th className="p-4 font-semibold uppercase text-xs">Data Artifact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400 font-mono text-xs">
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Auth Ingress</td>
                            <td className="p-4">NodeJoinRequest(Tx: 0x123...)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">L1 Verification</td>
                            <td className="p-4">CryptoEngine returns Stake=Valid</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Benchmark Challenge</td>
                            <td className="p-4">Orchestrator transmits 250KB Wazero test</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Determinism Proof</td>
                            <td className="p-4">Node replies with blake3(S(n+1)) in 40ms</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Shard Allocation</td>
                            <td className="p-4">mTLS Certificate Issued for Shard 4</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="threat-model">5. Threat Model Detail</h2>
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
                    <li>Network-level: Sybil swarming via low-power devices.</li>
                    <li>Execution-level: Subverting the synthetic benchmark.</li>
                    <li>Economic-level: Forged L1 stake verification.</li>
                    <li>Governance-level: Exploiting onboarding stricture parameters.</li>
                    <li>Telemetry-level: Spoofing hardware attestation metrics.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing and ed25519 signatures for identity generation.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: PoS stake collateral and tarpitting.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> is strictly untrusted, verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> operates with no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Bootstrapping)</h2>
            <p>
                Operators download the `nodld` binary and generate their keys. The onboarding pipeline is entirely automated. Once a node passes the pipeline, it receives an mTLS certificate valid for 7 days. The node must continuously prove liveness within its assigned shard to automatically renew this certificate without passing through the heavy onboarding fuzzing pipeline again.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Nodes earn zero rewards during the onboarding phase. The pipeline incurs compute costs on the Orchestrator; therefore, repeated failed join attempts from the same IP address will result in aggressive network-level throttling (Tarpitting) to protect the ingress gateway.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The DAO manages the `DAO_ONBOARDING_STRICTURE` parameters. This includes the size of the required WNODE stake, the timeout limit for the synthetic benchmark, and the required hardware attestation parameters (e.g., minimum RAM requirements).
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>RTT &le; 200ms</code> during fuzzing challenge.</li>
                <li><strong>Throughput Metrics:</strong> 5,000 concurrent <code>msgs_per_sec</code> capacity.</li>
                <li><strong>Network Performance:</strong> Sensitive to <code>packet_loss_pct</code> during benchmark phase.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                The Onboarding Pipeline interacts directly with the Crypto Conversion Engine to verify L1 transaction hashes for stake collateral. It feeds successfully provisioned nodes directly into the Earth Mesh routing tables, which are synchronized globally via the Orchestrator's <code>SyncManifest</code> payload.
            </p>

            <h2 id="formal-diagrams">11. Formal Onboarding DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="110" width="120" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Raw Node</text>

                    <line x1="170" y1="130" x2="250" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <text x="210" y="120" fill="#888" fontSize="11" textAnchor="middle">JoinReq</text>

                    <rect x="250" y="50" width="200" height="160" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="75" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator Ingress</text>
                    
                    <rect x="270" y="90" width="160" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="110" fill="#888" fontSize="11" textAnchor="middle">1. L1 Stake Verify</text>

                    <rect x="270" y="130" width="160" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="150" fill="#888" fontSize="11" textAnchor="middle">2. Synthetic Fuzzing</text>
                    
                    <rect x="270" y="170" width="160" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="190" fill="#888" fontSize="11" textAnchor="middle">3. mTLS Generation</text>

                    <line x1="450" y1="130" x2="550" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <rect x="550" y="110" width="150" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="625" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Active Earth Mesh</text>
                </svg>
            </div>
        </>
    );
}
