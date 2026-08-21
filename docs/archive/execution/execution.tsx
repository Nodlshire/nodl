import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Execution Model | WeNode',
    description: 'Formal specification of the deterministic state machine execution flow within the Wnode mesh.',
};

export default function ExecutionModelPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Execution Model</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                The strict, formal execution loop governing the transition of state across untrusted compute nodes.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The execution layer strictly enforces a single linear memory model for all Native Go substrates. Operations are normalized to a deterministic, single-threaded call sequence where all substrate calls MUST be processed in DAG topological order. There is no host-level concurrency or nondeterministic scheduling. Memory is bound to <code>32MB</code> linearly, enforcing standard pointer rules: <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. The Native Go sandbox enforces strict isolation (no WASI, no syscalls, no network, no filesystem) and identical trap-on-fault behavior for any out-of-bounds pointer dereference. All execution faults propagate through the same deterministic path, utilizing standardized error envelopes, trap codes, and deterministic retry semantics.
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
                            <td className="p-4 font-mono text-blue-400">Integrity</td>
                            <td className="p-4">H = blake3(bytes)</td>
                            <td className="p-4">State diff cryptographic hashing.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Consensus</td>
                            <td className="p-4">Q = ceil(2/3 * N)</td>
                            <td className="p-4">Quorum divergence slashing.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Memory Isolation</td>
                            <td className="p-4">Strict pointer bounds</td>
                            <td className="p-4">Single linear memory execution.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The Native Go module must export the following `_start` interface, relying on pointer-length arguments passed through linear memory mapping:
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Native Go Linear Memory Interface
#[no_mangle]
pub extern "C" fn execute(
    ptr: i32,
    len: i32
) -> i32 {
    // Returns pointer to serialized state diff
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples</h2>
            <div className="overflow-x-auto my-8 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm m-0">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                            <th className="p-4 font-semibold uppercase text-xs">Phase</th>
                            <th className="p-4 font-semibold uppercase text-xs">Data</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400 font-mono text-xs">
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">S(t)</td>
                            <td className="p-4">{"{"} balance: 1000, nonce: 4 {"}"}</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">P(t)</td>
                            <td className="p-4">{"{"} action: "transfer", amount: 200 {"}"}</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">S(t+1)</td>
                            <td className="p-4">{"{"} balance: 800, nonce: 5 {"}"}</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Diff</td>
                            <td className="p-4">-200 balance, +1 nonce</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">H(t+1)</td>
                            <td className="p-4">0x4f8b9a2...</td>
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
                    <li>Network-level: Quorum eclipse and state block withholding.</li>
                    <li>Execution-level: Heap manipulation via customized runtime and context stalling.</li>
                    <li>Economic-level: Watchdog timeout exploitation.</li>
                    <li>Governance-level: Malicious execution bounds override.</li>
                    <li>Telemetry-level: Forged state diff hashes.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for state transitions and ed25519 signatures.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Immediate slashing rules for divergent state output.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> is bound by strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> is untrusted, fully verifiable, and mathematically bounded by deterministic rules. The <strong>Substrate</strong> enforces no syscalls, no nondeterminism, no external entropy, and strict pointer bounds during execution.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle within Execution</h2>
            <p>
                During execution, a node operator is in the `Attesting` state. If the execution watchdog exceeds 50ms, the operator is bumped to `Stalled`. Repeated stalls result in partial slashing and eventual `Retirement` from the active quorum.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Execution directly bills the orchestrator per instruction executed. 
                <br/>
                <code className="text-blue-300 bg-blue-900/20 px-1.5 py-0.5 rounded">Execution_Cost = (Native Go_Instructions * Base_Fee) + (Heap_Bytes * Memory_Fee)</code>
                <br/>
                This guarantees MEV capture remains proportional to raw computational load.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The 50ms execution watchdog and the 32MB linear memory limits are hardcoded, but mutable via `DAO_EXECUTION_PROPOSAL`. Overriding these bounds requires a &gt; 2/3 stake-weighted majority and a 7-day execution timelock.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ExecTime &le; 50ms</code>, <code>RTT &le; 200ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> High <code>ops_per_sec</code> and <code>substrates_per_tick</code>.</li>
                <li><strong>Resource Pressure:</strong> Monitored <code>cpu_pressure_pct</code> and <code>mem_pressure_mb &le; 32MB</code>.</li>
                <li><strong>Warm vs Cold Start:</strong> <code>ColdStart = initial Native Go instantiation</code>, <code>WarmStart = cached instance reuse</code>.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Message format between the Orchestrator and Node relies on zero-copy Protobufs over asynchronous WebSocket (<code>WSS</code>) connections. The Orchestrator streams <code>ExecutionJob</code> payloads and expects <code>ExecutionResult</code> pointer/hash swapping within 200ms. If the execution fails, the retry semantics specify exactly 1 immediate retry on a separate node within the quorum via an updated <code>SyncManifest</code>.
            </p>

            <h2 id="formal-diagrams">11. Formal Execution DAG Diagram</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="130" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="100" y="155" fill="#888" fontSize="11" textAnchor="middle">S(t) Pointer</text>

                    <rect x="50" y="50" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="100" y="75" fill="#888" fontSize="11" textAnchor="middle">P(t) Payload</text>

                    <line x1="150" y1="150" x2="250" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <line x1="150" y1="70" x2="250" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="250" y="110" width="150" height="80" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="325" y="145" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Native Go Box</text>
                    <text x="325" y="165" fill="#888" fontSize="11" textAnchor="middle">f(S(n), P)</text>

                    <line x1="400" y1="150" x2="500" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="500" y="130" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="550" y="155" fill="#888" fontSize="11" textAnchor="middle">Diff Output</text>

                    <line x1="600" y1="150" x2="680" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <circle cx="720" cy="150" r="40" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="720" y="155" fill="#888" fontSize="11" textAnchor="middle">H = blake3(bytes)</text>
                </svg>
            </div>
        </>
    );
}
