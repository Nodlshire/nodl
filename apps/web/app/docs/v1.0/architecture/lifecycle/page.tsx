import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Integration Lifecycle | WeNode',
    description: 'Deterministic state machine and execution pipeline for the Wnode sovereign integration lifecycle.',
};

export default function LifecyclePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Integration Lifecycle</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Canonical definition of the deterministic state machine, generation pipeline, and execution invariants governing Wnode substrate generation.
            </p>

            <h2 id="deterministic-lifecycle-contract">1. Deterministic Lifecycle Contract</h2>
            <ul className="list-none pl-0 mb-8 space-y-4 text-slate-300">
                <li><strong className="text-white">Definition:</strong> A unidirectional, cryptographically verifiable state machine representing the lifecycle of an integration.</li>
                <li><strong className="text-white">Responsibilities:</strong> Translates declarative specifications into compiled, deterministic WebAssembly substrates.</li>
                <li><strong className="text-white">Guarantees:</strong> Absolute reproducibility and mathematical verification of execution boundaries.</li>
                <li><strong className="text-white">Requirements:</strong> Strictly typed YAML specifications and deterministic compiler pipelines.</li>
                <li><strong className="text-red-400">Prohibitions:</strong> Manual logic interventions and dynamic code execution outside the CI pipeline.</li>
            </ul>
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
                        <tr className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-mono text-blue-400">Spec Verification</td>
                            <td className="p-4">blake3(Spec) == Expected</td>
                            <td className="p-4">YAML Manifest to spec.yaml validation.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-mono text-blue-400">AST Consistency</td>
                            <td className="p-4">AST.Hash == Registry.Hash</td>
                            <td className="p-4">Spec to Substrate generation checksums.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-mono text-blue-400">Sandbox Limits</td>
                            <td className="p-4">Size &lt; 2MB && No Syscalls</td>
                            <td className="p-4">Substrate to Binary constraint checks.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-4 font-mono text-blue-400">Quorum Sync</td>
                            <td className="p-4">Telemetry.Nonce % 1 == 0</td>
                            <td className="p-4">Binary to Active network sync validation.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="sequence-diagram">2. Lifecycle Sequence Diagram</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden relative group">
                <svg viewBox="0 0 800 400" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="350" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="400" y1="50" x2="400" y2="350" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <line x1="650" y1="50" x2="650" y2="350" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    
                    <rect x="75" y="20" width="150" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="150" y="40" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Developer (CLI)</text>
                    
                    <rect x="325" y="20" width="150" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="400" y="40" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">CI / CD Pipeline</text>
                    
                    <rect x="575" y="20" width="150" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="650" y="40" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Mesh Node (Wazero)</text>

                    <line x1="150" y1="100" x2="390" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <text x="275" y="90" fill="#888" fontSize="11" textAnchor="middle">Push spec.yaml</text>
                    
                    <rect x="390" y="110" width="20" height="60" fill="#111" stroke="#444" strokeWidth="1.5" rx="8" />
                    <text x="420" y="130" fill="#888" fontSize="11">intgen + nodegen</text>
                    <text x="420" y="145" fill="#888" fontSize="11">Compile .wasm</text>
                    <text x="420" y="160" fill="#888" fontSize="11">Verify blake3</text>

                    <line x1="400" y1="190" x2="640" y2="190" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <text x="525" y="180" fill="#888" fontSize="11" textAnchor="middle">Broadcast Substrate Hash</text>
                    
                    <rect x="640" y="200" width="20" height="60" fill="#111" stroke="#444" strokeWidth="1.5" rx="8" />
                    <text x="670" y="220" fill="#888" fontSize="11">Instantiate Sandbox</text>
                    <text x="670" y="235" fill="#888" fontSize="11">Map Linear Memory</text>
                    <text x="670" y="250" fill="#888" fontSize="11">Enforce Cgroups</text>

                    <line x1="640" y1="280" x2="410" y2="280" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" strokeDasharray="4 4" />
                    <text x="525" y="270" fill="#888" fontSize="11" textAnchor="middle">Sync ACK + Telemetry Heartbeat</text>

                    <circle cx="650" cy="320" r="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="670" y="324" fill="#ccc" fontSize="14" fontWeight="bold">Active Quorum</text>
                </svg>
            </div>

            <h2 id="integration-state-machine">3. Integration State Machine</h2>
            <p>
                The lifecycle traverses a strict Directed Acyclic Graph (DAG) of states. Regression is impossible; failure in any state transitions the integration immediately to <code>Tombstoned</code>, requiring a new epoch to re-initialize.
            </p>
            <ul className="space-y-2 mb-8 list-none pl-0">
                <li><strong className="text-slate-200">1. Uninitialized:</strong> Blank directory. Empty <code>spec.yaml</code>.</li>
                <li><strong className="text-blue-400">2. Generated:</strong> <code>intgen</code> has compiled the AST. Codec stubs exist.</li>
                <li><strong className="text-purple-400">3. Verified:</strong> CI pipeline has verified deterministic output and <code>.wasm</code> bounds.</li>
                <li><strong className="text-emerald-400">4. Active:</strong> Quorum reached. Substrate mapped to memory on active nodes.</li>
                <li><strong className="text-red-400">5. Tombstoned:</strong> Version deprecated or execution fault detected. Hash blacklisted.</li>
            </ul>

            <h2 id="phase-by-phase">4. Phase-by-Phase Deep Dive</h2>

            <h3 className="text-blue-400 mt-8 mb-4">Phase I: Specification (spec.yaml)</h3>
            <ul className="list-disc pl-6 mb-6">
                <li><strong>Purpose:</strong> Declarative source of truth defining events, logic, and schema.</li>
                <li><strong>Inputs:</strong> Developer intent via YAML syntax.</li>
                <li><strong>Outputs:</strong> <code>spec.yaml</code> manifest.</li>
                <li><strong>Invariants:</strong> Must pass strictly typed JSON schema validation.</li>
                <li><strong>Failure Modes:</strong> Schema mismatch (build fails instantly).</li>
                <li><strong>Security Boundaries:</strong> Evaluated in isolation; no runtime execution.</li>
                <li><strong>Performance:</strong> ~10ms validation phase.</li>
                <li><strong>Operator Responsibilities:</strong> None.</li>
                <li><strong>Developer Responsibilities:</strong> Ensure event payload sizes do not exceed protocol maximums (1MB).</li>
            </ul>

            <h3 className="text-purple-400 mt-8 mb-4">Phase II: Substrate Generation (intgen)</h3>
            <ul className="list-disc pl-6 mb-6">
                <li><strong>Purpose:</strong> Synthesize the immutable AST and Rust WASM endpoints.</li>
                <li><strong>Inputs:</strong> Verified <code>spec.yaml</code>.</li>
                <li><strong>Outputs:</strong> Go RPC handlers, Rust lib stubs, <code>nodegen</code> configurations.</li>
                <li><strong>Invariants:</strong> Output must be 100% deterministic (byte-for-byte identical on any architecture).</li>
                <li><strong>Failure Modes:</strong> Type generation drift if specification includes dynamic or floating-point unbounded arrays.</li>
                <li><strong>Security Boundaries:</strong> Generator must not touch the filesystem outside the target integration directory.</li>
                <li><strong>Performance:</strong> &lt;200ms AST generation.</li>
                <li><strong>Operator Responsibilities:</strong> Ensure build container has sufficient RAM.</li>
                <li><strong>Developer Responsibilities:</strong> Do not manually modify generated artifacts.</li>
            </ul>

            <h3 className="text-emerald-400 mt-8 mb-4">Phase III: Execution (Wazero Sandbox)</h3>
            <ul className="list-disc pl-6 mb-6">
                <li><strong>Purpose:</strong> Execute the pure-functional state transitions using S(n+1) = f(S(n), P).</li>
                <li><strong>Inputs:</strong> Binary event payload over HMAC-secured TCP.</li>
                <li><strong>Outputs:</strong> Deterministic state diff.</li>
                <li><strong>Invariants:</strong> Execution strictly follows a single linear memory model, processes in DAG topological order, enforces strict WASM sandboxing (no WASI, no syscalls, no network, no filesystem), restricts pointers to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>, and normalizes all faults to standardized trap codes.</li>
                <li><strong>Failure Modes:</strong> OOM Trap, Infinite Loop (timeout at 50ms), Floating Point divergence.</li>
                <li><strong>Security Boundaries:</strong> Wazero entirely isolated from Node OS. No filesystem access.</li>
                <li><strong>Performance:</strong> Sub-millisecond instantiation. &lt;10ms execution per event.</li>
                <li><strong>Operator Responsibilities:</strong> Maintain hardware limits (Cgroups v2).</li>
                <li><strong>Developer Responsibilities:</strong> Write highly optimized, allocation-minimized Rust code.</li>
            </ul>

            <h2 id="hashing-rules">5. Substrate Hashing Rules</h2>
            <p>
                Every integration is identified by a unique, cryptographically secure hash generated from its AST. This hash is the ultimate source of truth for the mesh.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 overflow-x-auto text-slate-300">
                H = blake3( <br/>
                &nbsp;&nbsp;Concat( <br/>
                &nbsp;&nbsp;&nbsp;&nbsp;Sort(Files(AST)),<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;Protocol_Version,<br/>
                &nbsp;&nbsp;&nbsp;&nbsp;Compiler_Target(wasm32-unknown-unknown)<br/>
                &nbsp;&nbsp;) <br/>
                )
            </div>

            <h2 id="node-sync">6. Node Synchronization Protocol</h2>
            <p>
                Operators synchronize integration substrates asynchronously. The Orchestrator broadcasts a <code>SyncManifest</code> containing the new Substrate Hash. Nodes download the <code>.wasm</code> binary, verify the blake3 checksum locally, and hot-swap the pointer in memory using an atomic Compare-And-Swap (CAS) operation, ensuring zero downtime.
            </p>

            <h2 id="ci-cd">7. CI/CD Enforcement Rules</h2>
            <p>
                The integration will not merge to <code>main</code> unless the CI pipeline verifies the following hard constraints:
            </p>
            <ul className="list-decimal pl-6 mb-8 text-slate-300">
                <li><code>npm run verify_substrate</code> exits with code 0.</li>
                <li>Compiled <code>.wasm</code> payload is strictly less than 2,048 KB.</li>
                <li>No external API calls exist in the WASM import table (checked via <code>wasm-objdump</code>).</li>
                <li>Substrate hash matches the registered genesis hash in the orchestrator ledger.</li>
            </ul>

            <h2 id="failure-modes">8. Failure Mode Matrix</h2>
            <div className="overflow-x-auto my-8 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm whitespace-nowrap m-0">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Fault Domain</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Detection Trigger</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Automated Mitigation</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400">
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-red-400">OOM (Out of Memory)</td>
                            <td className="p-4">WASM pointer exceeds linear memory bound</td>
                            <td className="p-4">Instant Trap. Node slashes executing shard.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-orange-400">Infinite Loop</td>
                            <td className="p-4">Execution exceeds 50ms watchdog timer</td>
                            <td className="p-4">Process killed via Cgroups SIGKILL.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-yellow-400">Quorum Divergence</td>
                            <td className="p-4">Hash mismatch across N nodes</td>
                            <td className="p-4">Orchestrator forces re-simulation on high-trust nodes.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="threat-model">9. Threat Model Detail</h2>
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
                    <li>Network-level: RPC ingress interception and HMAC spoofing.</li>
                    <li>Execution-level: Dynamic logic injection bypassing generation.</li>
                    <li>Economic-level: Spec.yaml manipulation to inflate parameters.</li>
                    <li>Governance-level: Unauthorized state machine state alterations.</li>
                    <li>Telemetry-level: Forged telemetry metrics.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for substrate binaries and ed25519 signatures for network consensus.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Instant operator slashing for OOM faults and execution timeouts.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="performance">10. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-8 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ColdStart &le; 2ms</code> to instantiate WASM from compiled memory cache.</li>
                <li><strong>Throughput Metrics:</strong> &gt; 10,000 <code>substrates_per_tick</code> per standard Operator core.</li>
                <li><strong>Tick & Automation Timing:</strong> <code>WarmStart &le; 500µs</code> overhead per event invocation.</li>
                <li><strong>Network Performance:</strong> Delta-compressed states sync in <code>RTT &le; 45ms</code> across global nodes.</li>
            </ul>

            <h2 id="telemetry">11. Telemetry Schema</h2>
            <p>
                During the lifecycle, nodes emit strict JSON heartbeats to the orchestrator to prove liveness and verify deterministic execution.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 overflow-x-auto text-blue-300">
<pre className="m-0 bg-transparent border-0">{`{
  "nodeId": "0x4a9b...7f21",
  "substrateHash": "c4d3e...",
  "epoch": 419201,
  "metrics": {
    "eventsProcessed": 1420,
    "avgExecutionMs": 1.24,
    "memoryUsedKb": 1024,
    "traps": 0
  },
  "signature": "304402207b..."
}`}</pre>
            </div>

            <h2 id="best-practices">12. Best Practices & Anti-Patterns</h2>
            
            <div className="my-6 bg-red-950/20 border border-red-500/20 rounded-lg p-6 flex gap-4">
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <h4 className="text-red-400 font-bold mt-0 mb-2">Anti-Pattern: Manual Generation Overrides</h4>
                    <p className="text-slate-300 text-sm m-0">
                        Never manually edit files inside the <code>/generated</code> folder. The lifecycle contract demands absolute determinism. Any manual logic will be overwritten by the CI pipeline or flagged as a substrate hash mismatch, slashing the node immediately.
                    </p>
                </div>
            </div>

            <div className="my-6 bg-emerald-950/20 border border-emerald-500/20 rounded-lg p-6 flex gap-4">
                <svg className="w-6 h-6 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                    <h4 className="text-emerald-400 font-bold mt-0 mb-2">Best Practice: Pre-allocate WASM Buffers</h4>
                    <p className="text-slate-300 text-sm m-0">
                        When writing Rust implementations, utilize <code>wee_alloc</code> or static buffers. Dynamic allocation inside the WebAssembly loop incurs severe CPU overhead and increases the risk of hitting the strict OOM fault domain limits.
                    </p>
                </div>
            </div>
        </>
    );
}
