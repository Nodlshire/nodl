import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'SDK & WASM Stubs | WeNode',
    description: 'Formal specification of the deterministic WebAssembly compilation target and SDK generation bounds.',
};

export default function SDKWasmPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">SDK & WASM Stubs</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                The strict interface definition connecting compiled WebAssembly execution modules with external interacting clients.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The SDK acts as the deterministic bridge between dynamic client environments (Node.js, Browser) and the static WASM execution environment. Semantics dictate that the SDK must serialize all JSON payloads into strict linear byte arrays conforming exactly to the single linear memory model. It mathematically guarantees that by the time a payload reaches the WASM stub, no dynamic padding or arbitrary allocation is required. All substrate calls MUST be processed in DAG topological order within a deterministic, single-threaded call sequence. The execution follows strict WASM sandboxing (no WASI, no syscalls, no network, no filesystem), utilizing identical trap-on-fault behavior. Pointer rules are standardized such that <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. All execution faults propagate through the same deterministic path with standardized error envelopes and trap codes.
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
                            <td className="p-4 font-mono text-blue-400">Payload Serialization</td>
                            <td className="p-4">Payload_bytes = serialize(Event_Data)</td>
                            <td className="p-4">Strict linear byte arrays.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Monotonicity</td>
                            <td className="p-4">Nonce_T1 = Nonce_T0 + 1</td>
                            <td className="p-4">Replay attack rejection.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Authentication</td>
                            <td className="p-4">Signature = ED25519(blake3(Payload || Nonce), PK)</td>
                            <td className="p-4">ED25519 signature verification.</td>
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
                The WASM stub exposes a rigid function signature that the Orchestrator uses to inject the SDK's serialized payload into the VM.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// WASM Stub Interface (Go/Rust mapping)
fn execute_transition(
    ptr: i32,
    len: i32
) -> i32;`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Payload Formulation)</h2>
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
                            <td className="p-4 text-slate-300">Client Action</td>
                            <td className="p-4">sdk.transfer(amount: 50)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Serialization</td>
                            <td className="p-4">Byte Array: [0x32, 0x00, 0x00, 0x00]</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Nonce Append</td>
                            <td className="p-4">Bytes || [0x01, 0x00...] (Nonce 1)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Cryptographic Sign</td>
                            <td className="p-4">Sig: 0xabcd1234...</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">WASM Extraction</td>
                            <td className="p-4">Stub unwraps 0x32 (50) at pointer 0x1000</td>
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
                    <li>Network-level: Capturing SDK payloads and replay attacks.</li>
                    <li>Execution-level: Malformed pointer mapping and buffer overflows.</li>
                    <li>Economic-level: Client-side gas estimation bypass.</li>
                    <li>Governance-level: Deprecated SDK version poisoning.</li>
                    <li>Telemetry-level: Intercepted payload metrics.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing and ed25519 signatures enforcing monotonic nonces.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, no syscalls, single linear memory, and no external entropy.</li>
                    <li>Economic Disincentives: Slashing rules for operators attempting payload tampering.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> is subject to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> is strictly untrusted, fully verifiable, and bounded by deterministic rules, serving only as the ingress queue. The <strong>Substrate</strong> operates with no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle within SDK Bounds</h2>
            <p>
                Operators do not execute the SDK; they execute the WASM stubs. An operator's lifecycle relies on the Orchestrator correctly authenticating the SDK's payload. If an operator's node attempts to process a mathematically malformed pointer mapping, the node initiates an automatic crash-loop backoff to prevent memory corruption.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                The SDK performs client-side gas estimation prior to signing the payload. By parsing the exact structural size of the serialized bytes, the SDK attaches an execution fee limit, preventing the user from submitting a transaction that would instantly OOG (Out of Gas) at the Orchestrator level.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                A `DAO_CORE_UPGRADE` that alters the `intgen` compiler's memory alignment logic forces a synchronized version bump of all published SDKs (NPM, Cargo, Go). Clients using deprecated SDK versions will produce memory misalignments, resulting in hard 400 rejection faults.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ExecTime &le; 50ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> Client-side <code>msgs_per_sec</code> governed by payload size.</li>
                <li><strong>Resource Pressure:</strong> Minimal <code>cpu_pressure_pct</code> during serialization.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                The SDK acts as the client-side proxy to the Orchestrator API. The WASM stub acts as the host-side proxy to the WEX engine. They are bound symmetrically by the YAML Specification, meaning all payloads are structurally mapped to safely pass through the canonical <code>(ptr: i32, len: i32)</code> interface. This enforces strict linear memory boundaries and zero host-level bindings.
            </p>

            <h2 id="formal-diagrams">11. Formal SDK / Stub Pipeline DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="130" width="120" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="155" fill="#888" fontSize="11" textAnchor="middle">Client SDK</text>

                    <line x1="170" y1="150" x2="250" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="250" y="110" width="150" height="80" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="325" y="140" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Signed Payload</text>
                    <text x="325" y="165" fill="#888" fontSize="11" textAnchor="middle">(Nonce + Bytes)</text>

                    <line x1="400" y1="150" x2="480" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="480" y="110" width="120" height="80" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="540" y="145" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator</text>
                    <text x="540" y="165" fill="#888" fontSize="11" textAnchor="middle">Validation</text>

                    <line x1="600" y1="150" x2="680" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <rect x="680" y="130" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="730" y="155" fill="#888" fontSize="11" textAnchor="middle">WASM Stub</text>
                </svg>
            </div>
        </>
    );
}
