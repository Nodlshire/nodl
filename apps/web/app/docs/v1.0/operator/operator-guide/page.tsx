import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Node Operator Guide | WeNode',
    description: 'Formal specification of operator hardware constraints and execution obligations.',
};

export default function OperatorGuidePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Node Operator Guide</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict architectural boundaries and operational contracts required for maintaining active participation in the Wnode sovereign mesh.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The `nodld` daemon operates as a host-isolated process that acts as an execution slave to the Orchestrator. The daemon's execution semantics are entirely reactive. It opens a multiplexed mTLS stream to the Orchestrator, receives pre-validated `ExecutionJob` payloads, pins a Wazero instance to an available logical core, executes the transition within a 50ms absolute boundary, and streams back the `ExecutionResult`. The operator OS must never swap memory pages during this loop, as page-fault latency violates the deterministic timeout. Execution is bound to a single linear memory model, processes in strict DAG topological order, and enforces total WASM sandboxing (no WASI, no syscalls, no network, no filesystem). Memory is restricted to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>, resolving all faults via standardized trap semantics.
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
                            <td className="p-4 font-mono text-blue-400">State Transition</td>
                            <td className="p-4">S(n+1) = f(S(n), P)</td>
                            <td className="p-4">Single-threaded execution without nondeterminism.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Reward Distribution</td>
                            <td className="p-4">Reward_t = Σ (Base_Fee + MEV_Tip) * SLA_Multiplier</td>
                            <td className="p-4">Operator rewards and MEV capture.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Slashing Model</td>
                            <td className="p-4">Slashing_Penalty = Stake * (1.0 - Uptime_%)</td>
                            <td className="p-4">Uptime guarantee enforcement.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Execution Integrity</td>
                            <td className="p-4">blake3(Local_Output) == Quorum_Root</td>
                            <td className="p-4">Quorum divergence verification.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Operators must expose Prometheus telemetry endpoints locally and strictly firewall all other inbound ports. `nodld` establishes continuous outbound TCP to the Orchestrator.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`# nodld.conf (Operator Configuration)
[node]
identity_key = "/etc/nodl/certs/operator.pem"
tier = "tier-1-earth"
max_cores = 8
disable_swap_enforcement = false # MUST be false

[network]
orchestrator_wss = "wss://ingress.wnode.one"
inbound_ports = [] # Strictly empty`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Operator SLA Lifecycle)</h2>
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
                            <td className="p-4 text-slate-300">Daemon Boot</td>
                            <td className="p-4">nodld loads identity_key</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Attestation</td>
                            <td className="p-4">Orchestrator ACKs ED25519 cert</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Execution Loop</td>
                            <td className="p-4">Process continuous WSS streams</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-red-400">SLA Violation (Late)</td>
                            <td className="p-4">ExecTime &gt; 50ms &rarr; Dropped by Quorum</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Reward Distribution</td>
                            <td className="p-4">Epoch mint distributed to Stake</td>
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
                    <li>Network-level: Man-in-the-middle interception of WSS streams.</li>
                    <li>Execution-level: Container escape via malicious WASM payloads.</li>
                    <li>Economic-level: Stake hoarding and MEV extraction.</li>
                    <li>Governance-level: Running deprecated nodld clients.</li>
                    <li>Telemetry-level: Dropping prometheus egress to feign uptime.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for state outputs and ed25519 signatures for operator attestation.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Immediate slashing for diverging from the quorum output root.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Onboarding & Slashing)</h2>
            <p>
                Operators generate a local `operator.pem` keypair. They submit a transaction to the DAO contract locking the minimum WNODE stake, mapping the stake to the public key. Once registered, they start `nodld`. If the node falls offline for &gt; 3 missed epochs, the stake suffers a progressive decay slashing. Upon retirement, the operator signals a graceful exit, and the stake unlocks after a 21-day unbonding period.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Operators represent the foundational compute commodity of the network. They are paid strictly for *correct, timely work*. Yield is not fixed; it is a direct function of the gas consumed by the shards they are assigned to, multiplied by their hardware's SLA adherence score. MEV tips (priority fees) are distributed directly to operators who successfully finalize complex substrates first.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                Operators hold significant voting weight in the DAO proportional to their staked WNODE. A `DAO_CLIENT_UPDATE` dictates when operators must pull a new version of `nodld`. Nodes running deprecated clients will fail cryptographic handshakes at the Orchestrator ingress layer.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Resource Pressure:</strong> Minimum hardware 8 Physical Cores, <code>mem_pressure_mb &ge; 16384MB</code> (16GB RAM).</li>
                <li><strong>Network Performance:</strong> 1Gbps continuous duplex fiber.</li>
                <li><strong>Latency Bounds:</strong> Node RTT to Orchestrator must not exceed <code>RTT &le; 20ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> Expected to execute <code>~1500 ops_per_sec</code> locally.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Operators never interface with users, frontend SDKs, or other operators. They are strictly bound to the Orchestrator's multiplexed mTLS and asynchronous WebSocket (<code>WSS</code>) pipelines, constantly parsing <code>ExecutionJob</code> payloads and returning <code>ExecutionResult</code> structs based on the global <code>SyncManifest</code>.
            </p>

            <h2 id="formal-diagrams">11. Formal Operator Execution Loop</h2>
            <div className="my-10 bg-[#0d1117] border border-white/10 rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <defs>
                        <marker id="arrowOp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="110" width="120" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="135" fill="#10b981" fontSize="12" textAnchor="middle" fontWeight="bold">Orchestrator</text>

                    <line x1="170" y1="120" x2="300" y2="120" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowOp)" />
                    <text x="235" y="110" fill="#888" fontSize="10" textAnchor="middle">WSS Stream (Jobs)</text>

                    <rect x="300" y="50" width="200" height="160" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="400" y="75" fill="#888" fontSize="14" textAnchor="middle" fontWeight="bold">nodld Daemon</text>
                    
                    <rect x="320" y="90" width="160" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="400" y="115" fill="#888" fontSize="12" textAnchor="middle">Cgroup Watchdog (50ms)</text>

                    <rect x="320" y="140" width="160" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="400" y="165" fill="#888" fontSize="12" textAnchor="middle">Wazero JIT Core</text>

                    <line x1="300" y1="180" x2="170" y2="180" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowOp)" />
                    <text x="235" y="200" fill="#888" fontSize="10" textAnchor="middle">WSS Stream (Results)</text>
                    
                    <rect x="600" y="50" width="150" height="160" rx="8" fill="none" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="675" y="135" fill="#888" fontSize="12" textAnchor="middle" fontWeight="bold">Host OS</text>
                    <text x="675" y="155" fill="#888" fontSize="10" textAnchor="middle">(Disabled Swap)</text>
                    
                    <line x1="500" y1="130" x2="600" y2="130" stroke="#444" strokeWidth="1.5" />
                </svg>
            </div>
        </>
    );
}
