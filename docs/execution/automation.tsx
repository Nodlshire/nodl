import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Automation Engine | WeNode',
    description: 'Formal architectural specification of cron-driven deterministic state transitions.',
};

export default function AutomationEnginePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Automation Engine</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict, time-bound execution triggers enforcing chronological invariants within the Native Go matrix.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The Automation Engine governs the strict chronological determinism of the network. It operates as a synthetic event generator at the Orchestrator layer. To ensure 100% determinism, Native Go sandboxes are explicitly blocked from accessing system time. Instead, the Automation Engine generates cryptographically signed <code>Epoch_Tick</code> payloads containing monotonic timestamps and deterministic entropy, forcing all active smart contracts to evaluate their internal chronological queues synchronously during block execution. Substrate logic runs deterministically in DAG topological order, within a single linear memory model featuring strict sandboxing (no WASI, no syscalls, no network, no filesystem). All pointers are governed by <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>, triggering standardized trap paths on fault.
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
                            <td className="p-4 font-mono text-blue-400">Monotonic Clock</td>
                            <td className="p-4">Timestamp(Block_N) &ge; Timestamp(Block_N-1) + &Delta;T_Min</td>
                            <td className="p-4">Chronological ordering guarantees.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Deterministic Entropy</td>
                            <td className="p-4">PRNG_Seed_N = HMAC(Orchestrator_Key, blake3(Block_N-1))</td>
                            <td className="p-4">Predictable randomness generation.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Queue Evaluation</td>
                            <td className="p-4">Queue_Eval(State) = Map(Cron_Tasks, fn(task) &rarr; Execute if task.time &le; Timestamp)</td>
                            <td className="p-4">Synchronous scheduled execution.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The Engine utilizes a strict protobuf definition for the synthetic time events injected into the block stream.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Protobuf: Chronological Tick
message EpochTickEvent {
  uint64 epoch_height = 1;
  uint64 timestamp_ms = 2; // Strict monotonic clock
  bytes verified_entropy_seed = 3; // Deterministic PRNG
  bytes signature = 4;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Cron Lifecycle)</h2>
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
                            <td className="p-4 text-slate-300">Registration</td>
                            <td className="p-4">Contract pushes `Wake_Me_At(1800000000)` into State Queue</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Dormancy</td>
                            <td className="p-4">Tick(1799999999) arrives &rarr; Contract does nothing</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Trigger Threshold</td>
                            <td className="p-4">Tick(1800000001) arrives</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Execution</td>
                            <td className="p-4">Native Go processes liquidation logic; Queue pops the task</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Post-Condition</td>
                            <td className="p-4">State transitions finalized; execution sleeps until next trigger</td>
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
                    <li>Network-level: Temporal spoofing and clock drift attacks.</li>
                    <li>Execution-level: Cron-task spam leading to OOM traps.</li>
                    <li>Economic-level: Denial-of-service via scheduled tasks.</li>
                    <li>Governance-level: Unauthorized tick interval parameters.</li>
                    <li>Telemetry-level: Biased PRNG entropy injection.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for entropy derivation and ed25519 signatures for time payloads.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Unrefundable Tick Fees to mathematically eliminate cron-spam.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Clock Sync)</h2>
            <p>
                Operators must maintain extremely precise local NTP (Network Time Protocol) synchronization. If an operator's local clock drifts beyond the strict consensus bounds, they will routinely reject valid leader blocks (or propose invalid ones), rapidly leading to uptime slashing penalties.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                To prevent Cron-Spam (scheduling billions of 1ms tasks), the protocol requires a non-refundable upfront "Tick Fee" paid by the user when pushing a task to the queue. This fee is burned, mathematically eliminating the economic viability of denial-of-service via scheduled tasks.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The maximum allowable time drift bound (currently 2000ms) and the minimum tick interval are DAO-controlled parameters that balance strict determinism against the reality of global network latency.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> Tick Interval fixed at <code>ExecTime &le; 500ms</code> for the Earth Mesh.</li>
                <li><strong>Throughput Metrics:</strong> Must evaluate all pending chron-tasks across the state trie in <code>&le; 5ms</code>.</li>
                <li><strong>Resource Pressure:</strong> If a tick triggers &gt; 1000 tasks, execution is sharded to prevent <code>mem_pressure_mb</code> overflow.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Interfaces continuously with WEX & Smart Contracts by injecting <code>EpochTickEvent</code> payloads into the Native Go substrate via the Orchestrator, ensuring chronological determinism. Integrates with the AI Orchestration Layer to facilitate autonomous daily AI inference routines without requiring human API calls.
            </p>

            <h2 id="formal-diagrams">11. Formal Automation Injection DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <rect x="50" y="110" width="120" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Host NTP / Clocks</text>
                    
                    <line x1="170" y1="130" x2="250" y2="130" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowSolid)" />

                    <rect x="250" y="70" width="200" height="120" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="100" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator Leader</text>
                    <text x="350" y="130" fill="#888" fontSize="11" textAnchor="middle">1. Sample Time & Entropy</text>
                    <text x="350" y="150" fill="#888" fontSize="11" textAnchor="middle">2. Sign Epoch_Tick</text>

                    <line x1="450" y1="130" x2="550" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <rect x="550" y="90" width="160" height="80" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="630" y="120" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Mesh WEX Runtime</text>
                    <text x="630" y="145" fill="#888" fontSize="11" textAnchor="middle">Evaluate Task Queue</text>
                </svg>
            </div>
        </>
    );
}
