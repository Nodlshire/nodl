import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'WEX & Smart Contracts | WeNode',
    description: 'Formal architectural specification of the WebAssembly execution virtual machine.',
};

export default function WEXSmartContractsPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">WEX & Smart Contracts</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict boundaries defining the WebAssembly Execution (WEX) environment, contract immutability, and state transitions.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                WEX (WebAssembly Execution) enforces a single linear memory model for all Native Go substrates utilizing a strict trap-on-fault semantic. Contracts run in a deterministic, single-threaded call sequence where all substrate calls MUST be processed in DAG topological order. WEX explicitly enforces strict Native Go sandboxing (no WASI, no syscalls, no network, no filesystem). Memory pointer rules are standardized to: <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. All execution faults propagate through the same deterministic path, normalizing trap codes (e.g., OOG, OOB) and removing any references to host-level concurrency or nondeterministic scheduling.
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
                            <td className="p-4 font-mono text-blue-400">Gas Limit</td>
                            <td className="p-4">Gas_Consumed = Σ Instruction_Cost(op_i)</td>
                            <td className="p-4">Trap on OOG.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Integrity</td>
                            <td className="p-4">H = blake3(bytes)</td>
                            <td className="p-4">State hashing.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Memory Bounds</td>
                            <td className="p-4">Strict pointer bounds</td>
                            <td className="p-4">Single linear memory model.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Contracts within WEX are structurally bound to export precisely two functions for the host to call, and import zero functions from the host environment to guarantee determinism.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Required WEX Exports
(module
  (memory (export "memory") 1 512)
  (func (export "alloc") (param i32) (result i32))
  (func (export "invoke") (param i32 i32) (result i32))
)`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (WEX Processing)</h2>
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
                            <td className="p-4 text-slate-300">Heap State T0</td>
                            <td className="p-4">[0x00, 0x01, 0x0A, 0xFF...] (128 bytes)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">WEX Invocation</td>
                            <td className="p-4">invoke(ptr, 192)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Heap State T1</td>
                            <td className="p-4">[0x00, 0x02, 0x0B, 0xFF...] (128 bytes)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Pointer Return</td>
                            <td className="p-4">i32: 1048576 (Diff Offset)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Trap Status</td>
                            <td className="p-4">0 (Success)</td>
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
                    <li>Network-level: Payload replay and routing eclipse.</li>
                    <li>Execution-level: Unbounded loops, recursive depth exhaustion, and memory ballooning.</li>
                    <li>Economic-level: Gas exhaustion and stake manipulation.</li>
                    <li>Governance-level: Malicious Native Go binary deployments.</li>
                    <li>Telemetry-level: Falsified execution metrics.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for state and ed25519 signatures for payloads.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, no syscalls, single linear memory model, and no external entropy.</li>
                    <li>Economic Disincentives: Strict slashing rules for divergent state hashes.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> is subject to strict slashing rules, BFT quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> remains untrusted, fully verifiable, and bounded by deterministic execution rules. The <strong>Substrate</strong> explicitly enforces no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle within WEX</h2>
            <p>
                Node Operators cache compiled WEX module instances. Upon receiving a payload, the Node Operator clones a fresh linear memory instance from the cached module. Following execution and diff extraction, the memory instance is garbage collected. Operators do not manage contract state; they manage the WEX compute pipeline.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Contract execution is billed at a fixed rate of `1 WNODE per 1,000,000 WEX Gas`. Computation heavy contracts naturally cost the user more to invoke. If execution traps (OOG or panic), the user is still billed the full gas consumed up to the trap point, compensating the node operator for burned CPU cycles.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                WEX contracts are perfectly immutable. Once the DAO approves a contract hash via `DAO_WEX_DEPLOY`, it cannot be altered. Upgrades require deploying a completely new Native Go binary under a new address, and initiating a `DAO_STATE_MIGRATION` transaction to port balances.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ExecTime &le; 50ms</code>, <code>RTT &le; 200ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> Scalable <code>ops_per_sec</code> via horizontal shards.</li>
                <li><strong>Resource Pressure:</strong> Strict <code>mem_pressure_mb &le; 32MB</code>.</li>
                <li><strong>Warm vs Cold Start:</strong> <code>ColdStart = initial Native Go instantiation</code>, <code>WarmStart = cached instance reuse</code>.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                WEX is isolated. It relies entirely on the Node Daemon (<code>nodld</code>) to inject state via the strictly enforced <code>(ptr: i32, len: i32)</code> interface. It maintains zero references to host-level bindings (no WASI, syscalls, or shared host state). Timing guarantees require <code>nodld</code> to enforce deterministic trap semantics, forcibly reaping the WEX instance if execution boundaries are violated.
            </p>

            <h2 id="formal-diagrams">11. Formal WEX Isolation DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="50" width="700" height="200" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="400" y="80" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Host Operating System Boundary (nodld)</text>

                    <rect x="150" y="110" width="500" height="120" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="400" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">WEX Sandbox Boundary</text>

                    <rect x="200" y="150" width="120" height="60" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="260" y="180" fill="#888" fontSize="11" textAnchor="middle">Memory Pool</text>

                    <line x1="320" y1="180" x2="450" y2="180" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="450" y="150" width="150" height="60" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="525" y="180" fill="#888" fontSize="11" textAnchor="middle">Native Go Instruction Loop</text>
                </svg>
            </div>
        </>
    );
}
