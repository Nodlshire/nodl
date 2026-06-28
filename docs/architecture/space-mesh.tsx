import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Space Mesh | WeNode',
    description: 'Formal architectural specification of the orbital execution fallback and execution nodes.',
};

export default function SpaceMeshPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Space Mesh</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                The high-latency, disaster-recovery Tier-3 orbital execution matrix guaranteeing global state liveness.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The Space Mesh provides high-latency, asynchronous execution liveness when Earth Mesh quorum cannot be reached. Satellites run highly restricted Wazero sandboxes tailored for low-memory overhead (`spacegen`). Execution semantics require payloads to be bundled with Forward Error Correction (FEC) codes to mathematically recover from bit flips caused by radiation. Output determinism relies on prolonged asynchronous BFT voting rather than sub-second synchrony. All orbital substrates execute in a single linear memory model enforcing strict WASM sandboxing (no WASI, no syscalls, no network, no filesystem). Substrate calls MUST be processed in DAG topological order, and memory adheres to standardized pointer bounds: <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. Faults propagate via standardized trap codes deterministically.
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
                            <td className="p-4 font-mono text-purple-400">High Latency</td>
                            <td className="p-4">RTT &ge; 500ms</td>
                            <td className="p-4">Orbital physics bounding.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-purple-400">State Transition</td>
                            <td className="p-4">S(n+1) = f(S(n), P)</td>
                            <td className="p-4">Single-threaded execution without nondeterminism.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-purple-400">Consensus</td>
                            <td className="p-4">Q = ceil(2/3 * N)</td>
                            <td className="p-4">Quorum divergence slashing.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-purple-400">Sandbox Isolation</td>
                            <td className="p-4">Strict pointer bounds</td>
                            <td className="p-4">No external entropy, no syscalls.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Satellites utilize specialized DTN (Delay Tolerant Networking) schemas over UDP or custom radio frames to receive jobs from ground stations.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-purple-300">
<pre className="m-0 bg-transparent border-0">{`// protobuf: Space Mesh Invocation (DTN Wrapped)
message SpaceExecutionBundle {
  bytes bundle_id = 1;
  repeated ExecutionJob jobs = 2;
  bytes fec_parity_blocks = 3;
  uint64 deadline_timestamp_ms = 4;
}

message SpaceTelemetry {
  bytes bundle_id = 1;
  repeated ExecutionResult results = 2;
  uint32 radiation_seu_count = 3;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Space Mesh Execution)</h2>
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
                            <td className="p-4 text-slate-300">Earth Partition</td>
                            <td className="p-4">Orchestrator detects Quorum Failure</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Ground Station Uplink</td>
                            <td className="p-4">Tx: SpaceExecutionBundle(1500 jobs)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Orbital Execution</td>
                            <td className="p-4">Satellite runs 16MB Heap WASM (2500ms)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Ground Station Downlink</td>
                            <td className="p-4">Rx: SpaceTelemetry(Diffs)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Finalization</td>
                            <td className="p-4">Orchestrator ACKs orbital state root</td>
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
                    <li>Network-level: RF jamming preventing ground-station uplinks.</li>
                    <li>Execution-level: Physical radiation (SEU) causing bit flips.</li>
                    <li>Economic-level: LEO liveness premium exploitation.</li>
                    <li>Governance-level: Unaudited flight computer admission.</li>
                    <li>Telemetry-level: Jammed or forged downlink metrics.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing and ed25519 signatures via Forward Error Correction (FEC).</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Institutional SLA contractual penalties.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> is bound by SLA rules, high-latency quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts untrusted, verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> executes with no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle within the Space Mesh</h2>
            <p>
                Space operators are aerospace entities (e.g., SpaceX, private LEO operators). They flash the statically compiled `spacegen` WASM runtime onto their flight computers prior to launch, or via secured Over-The-Air (OTA) updates. They do not stake WNODE directly like Earth nodes; instead, they are bound by institutional SLA contracts negotiated by the Wnode DAO.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Space Mesh execution commands a premium gas multiplier when triggered. Due to the high cost of orbital compute, transactions routed to the Space Mesh incur a "Liveness Premium," a portion of which directly subsidizes the satellite operators' downlink bandwidth costs.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                Admitting a new satellite constellation into the Space Mesh requires a `DAO_AEROSPACE_RATIFICATION` proposal. This process involves auditing the operator's flight computer architecture to ensure it meets the strict &le;16MB memory constraints required by the `spacegen` compiler.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> Extended <code>ExecTime</code> and <code>RTT</code> due to orbital physics.</li>
                <li><strong>Throughput Metrics:</strong> Low <code>ops_per_sec</code> fallback limit.</li>
                <li><strong>Resource Pressure:</strong> <code>mem_pressure_mb &le; 16MB</code> for radiation-hardened hardware.</li>
                <li><strong>Network Performance:</strong> High <code>max_rtt_ms</code> and <code>packet_loss_pct</code> assumptions.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                The Space Mesh is the absolute fallback for the Earth Mesh. It interfaces only with trusted Orchestrator Ground Stations via DTN protocols, ingesting <code>SpaceExecutionBundle</code> payloads (which encapsulate standard <code>ExecutionJob</code> payloads and <code>SyncManifest</code> structures) and returning FEC-encoded state hashes.
            </p>

            <h2 id="formal-diagrams">11. Formal Space Mesh DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="130" width="120" height="60" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="165" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Ground Station</text>

                    <line x1="170" y1="150" x2="350" y2="80" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowSolid)" />
                    <text x="260" y="105" fill="#888" fontSize="11" textAnchor="middle" transform="rotate(-23 260 105)">Uplink (High Latency)</text>

                    <circle cx="420" cy="60" r="50" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="420" y="55" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">LEO Node 1</text>
                    <text x="420" y="75" fill="#888" fontSize="11" textAnchor="middle">16MB Heap WASM</text>

                    <line x1="470" y1="60" x2="600" y2="60" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowSolid)" />
                    <text x="535" y="50" fill="#888" fontSize="11" textAnchor="middle">Inter-Satellite Link (ISL)</text>

                    <circle cx="650" cy="60" r="50" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="650" y="55" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">LEO Node 2</text>
                    <text x="650" y="75" fill="#888" fontSize="11" textAnchor="middle">Validation</text>
                    
                    <line x1="650" y1="110" x2="650" y2="180" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowSolid)" />
                    <rect x="590" y="180" width="120" height="60" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="650" y="215" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Ground Station B</text>
                </svg>
            </div>
        </>
    );
}
