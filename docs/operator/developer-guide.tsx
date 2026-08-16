import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Developer Guide | WeNode',
    description: 'Formal specification of the constraints for developing WebAssembly logic for the Wnode mesh.',
};

export default function DeveloperGuidePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Developer Guide</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict boundaries and invariants governing the development of pure-functional logic handlers for the Wnode execution environment.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                Developers must write substrates as pure, deterministic mathematical functions following a single linear memory model for all Native Go substrates. A generated logic handler operates within a deterministic, single-threaded call sequence where all substrate calls MUST be processed in DAG topological order. Standard library access to non-deterministic interfaces is structurally blocked via strict Native Go sandboxing (no WASI, no syscalls, no network, no filesystem). Developers must adhere to standardized pointer rules: <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. All execution faults propagate through the same deterministic path, employing standardized trap codes and trap-on-fault behaviors to ensure identical loop boundaries and gas-metered execution ceilings across the mesh.
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
                            <td className="p-4 font-mono text-blue-400">Gas Bounds</td>
                            <td className="p-4">Gas_Consumed = Memory_Allocations * Ops_Count</td>
                            <td className="p-4">Trap on exhaustion.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Integrity</td>
                            <td className="p-4">Hash_Integrity = blake3(S(n+1))</td>
                            <td className="p-4">State diff cryptographic hashing.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Memory Sandbox</td>
                            <td className="p-4">Strict pointer bounds</td>
                            <td className="p-4">No external entropy, no syscalls.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The developer's logic handler is wrapped by an auto-generated ABI that exposes a single `execute` pointer mapping to the Orchestrator.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// auto-generated SDK handler signature
#[no_mangle]
pub extern "C" fn execute(
    ptr: i32,
    len: i32
) -> i32;`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Developer Workflow)</h2>
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
                            <td className="p-4 text-slate-300">Spec Definition</td>
                            <td className="p-4">Write spec.yaml (State Schema)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Compilation</td>
                            <td className="p-4">intgen compiles to Go Stub</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Logic Injection</td>
                            <td className="p-4">Developer writes pure go in handler.rs</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Local Fuzzing</td>
                            <td className="p-4">cargo run --bin fuzzer (Validates OOM)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Mesh Deployment</td>
                            <td className="p-4">Native Go signed and broadcasted to Orchestrator</td>
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
                    <li>Network-level: Handler payload interception.</li>
                    <li>Execution-level: Infinite loops and massive memory allocations.</li>
                    <li>Economic-level: Systemic network gas exhaustion.</li>
                    <li>Governance-level: Systemic instability via malicious Substrate deployment.</li>
                    <li>Telemetry-level: Falsified handler execution outputs.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing and ed25519 signatures for logic authentication.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Slashing rules and gas metering limits.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> assumes strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules to safely run the code. The <strong>Orchestrator</strong> is untrusted, verifiable, and bounded by deterministic rules. The compiled <strong>Substrate</strong> guarantees no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Developer Impact)</h2>
            <p>
                Developers do not directly choose operators. When a developer deploys a new Substrate version, operators implicitly fetch the Native Go blob via `SyncManifest`. Developers must ensure their Native Go binary size remains &lt; 2MB to prevent long cold-start latencies across the mesh.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Developers who write highly optimized `O(1)` handlers consume less network gas, allowing their clients to execute transactions with lower API fees. Computationally heavy machine-learning Native Go payloads will inherently cost clients significantly more WNODE per execution.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                If a developer deploys a Substrate that causes systemic instability or illegal operations, the DAO can execute a `DAO_SUBSTRATE_REVOKE` proposal. This forcefully removes the Native Go hash from the global registry, immediately halting execution across all nodes.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ExecTime &le; 50ms</code> allocated per substrate run.</li>
                <li><strong>Throughput Metrics:</strong> Optimal <code>ops_per_sec</code> dependent on <code>O(1)</code> handler logic.</li>
                <li><strong>Resource Pressure:</strong> <code>mem_pressure_mb &le; 32MB</code>.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                The developer's Native Go logic is bound strictly to the `spec.yaml` definition, which dictates exactly how the Client SDK and Orchestrator API serialize data. This structured payload is strictly injected by the Orchestrator into the handler's linear memory via the canonical <code>(ptr: i32, len: i32)</code> ABI and the <code>SyncManifest</code> pipeline.
            </p>

            <h2 id="formal-diagrams">11. Formal Developer Execution Pipeline</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="110" width="120" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="135" fill="#888" fontSize="11" textAnchor="middle">spec.yaml</text>

                    <line x1="170" y1="130" x2="250" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="250" y="110" width="150" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="325" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">intgen Compiler</text>
                    
                    <line x1="400" y1="130" x2="480" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="480" y="90" width="120" height="80" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="540" y="125" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">handler.rs</text>
                    <text x="540" y="145" fill="#888" fontSize="11" textAnchor="middle">(Developer Logic)</text>

                    <line x1="600" y1="130" x2="680" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <rect x="680" y="110" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="730" y="135" fill="#888" fontSize="11" textAnchor="middle">.native-go Target</text>
                </svg>
            </div>
        </>
    );
}
