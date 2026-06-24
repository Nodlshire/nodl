import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Earth Mesh | WeNode',
    description: 'Formal architectural specification of the terrestrial execution node layer.',
};

export default function EarthMeshPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Earth Mesh</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                The primary, high-throughput terrestrial execution tier of the sovereign compute matrix.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The Earth Mesh serves as the primary terrestrial execution tier. Execution semantics mandate absolute synchronous determinism bounded by a 50ms watchdog limit. Nodes do not maintain global state; they receive a serialized input state pointer, execute the transition via Wazero, and return the modified state pointer. Memory is strictly linear and isolated per invocation, preventing cross-request contamination. The mesh enforces a single linear memory model for all WASM substrates where calls are processed in DAG topological order. The execution is strictly isolated with no WASI, no syscalls, no network, no filesystem access, and adheres to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. All execution faults use a standardized trap-on-fault behavior and propagate error codes uniformly.
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
                            <td className="p-4 font-mono text-blue-400">Execution Timeout</td>
                            <td className="p-4">ExecTime &le; 50ms</td>
                            <td className="p-4">Watchdog eviction.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">State Transition</td>
                            <td className="p-4">S(n+1) = f(S(n), P)</td>
                            <td className="p-4">Single-threaded execution without nondeterminism.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Consensus</td>
                            <td className="p-4">Q = ceil(2/3 * N)</td>
                            <td className="p-4">Quorum divergence slashing.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Sandbox Isolation</td>
                            <td className="p-4">Strict pointer bounds</td>
                            <td className="p-4">No external entropy, no syscalls.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Earth Mesh nodes communicate exclusively with the Orchestrator via persistent `WebSocket Secure (WSS)` connections, utilizing protobuf schemas for minimal overhead.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// protobuf: Earth Mesh Invocation
message ExecutionJob {
  bytes tx_hash = 1;
  bytes state_buffer = 2;
  bytes event_payload = 3;
  uint64 gas_limit = 4;
}

message ExecutionResult {
  bytes tx_hash = 1;
  bytes state_diff = 2;
  uint64 gas_consumed = 3;
  bool trapped = 4;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Earth Mesh Execution)</h2>
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
                            <td className="p-4 text-slate-300">WSS Receive</td>
                            <td className="p-4">ExecutionJob(0x1a2b...)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Heap Injection</td>
                            <td className="p-4">Linear Memory Map (0-64KB)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Execution</td>
                            <td className="p-4">CPU Core 3 (1.2ms)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Yield</td>
                            <td className="p-4">ExecutionResult(diff_hash)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Consensus</td>
                            <td className="p-4">Orchestrator ACKs 12/15 matching hashes</td>
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
                    <li>Network-level: Earth Mesh partition and BFT stalling.</li>
                    <li>Execution-level: Altering local state transition outputs.</li>
                    <li>Economic-level: Priority fee manipulation.</li>
                    <li>Governance-level: Malicious quorum configuration upgrades.</li>
                    <li>Telemetry-level: Forged WSS latency responses.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for state validation and ed25519 signatures.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Instant slashing for Byzantine divergence.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> is subject to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> remains untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> explicitly enforces no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle within the Earth Mesh</h2>
            <p>
                To join the Earth Mesh, operators must stake WNODE and undergo cryptographic attestation via an Orchestrator handshake. Once active, the node is assigned to specific execution shards. Failure to maintain 99.99% uptime or consistently delivering late execution results (&gt; 50ms) results in demotion from Tier-1 and partial slashing.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Earth Mesh nodes capture `Base_Fee + Priority_Fee` for every transaction they process within their shard. Revenue is streamed deterministically per epoch based on the volume of gas consumed by the node's successful BFT contributions.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The DAO manages the Earth Mesh admission parameters. A `DAO_OPERATOR_CONFIG` vote dictates the minimum WNODE stake required to operate an Earth Mesh node and defines the slashing parameters for latency violations and hash mismatches.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> Strict <code>ExecTime &le; 50ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> &gt; 10,000 <code>ops_per_sec</code> per shard.</li>
                <li><strong>Resource Pressure:</strong> Monitored <code>cpu_pressure_pct</code> to prevent stalling.</li>
                <li><strong>Warm vs Cold Start:</strong> Fast <code>ColdStart</code> via pre-downloaded modules.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Earth Mesh directly interfaces with the Orchestrator via strictly asynchronous WebSocket (<code>WSS</code>) or multiplexed mTLS streams for exchanging <code>ExecutionJob</code> and <code>ExecutionResult</code> payloads. In the event of catastrophic global partition where the Earth Mesh cannot reach BFT quorum on a <code>SyncManifest</code>, the Orchestrator's contract mandates immediate failover to the Space Mesh.
            </p>

            <h2 id="formal-diagrams">11. Formal Earth Mesh DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <rect x="50" y="100" width="120" height="100" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="155" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator</text>

                    <line x1="170" y1="130" x2="330" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <line x1="170" y1="150" x2="330" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <line x1="170" y1="170" x2="330" y2="200" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="340" y="70" width="150" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="415" y="95" fill="#888" fontSize="11" textAnchor="middle">Node A (WSS)</text>

                    <rect x="340" y="130" width="150" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="415" y="155" fill="#888" fontSize="11" textAnchor="middle">Node B (WSS)</text>

                    <rect x="340" y="190" width="150" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="415" y="215" fill="#888" fontSize="11" textAnchor="middle">Node C (WSS)</text>
                    
                    <rect x="320" y="50" width="190" height="200" rx="8" fill="none" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="415" y="40" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Quorum Verification Zone</text>
                </svg>
            </div>
        </>
    );
}
