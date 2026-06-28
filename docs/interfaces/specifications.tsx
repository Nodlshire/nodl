import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Integration Specifications | WeNode',
    description: 'Formal definition of the declarative schemas governing mesh integrations.',
};

export default function SpecificationsPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Integration Specifications</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict YAML schemas defining the structure, types, and topological bounds of a Wnode integration.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The `spec.yaml` serves as the absolute origin of truth for memory alignment. The execution semantic dictates that all fields defined in the schema are laid out in linear WASM memory sequentially, packed according to `[#repr(C)]`. Bools consume 1 byte, u32 consumes 4 bytes, u64 consumes 8 bytes. No padding bytes are inserted by the compiler, guaranteeing an exact, deterministic pointer map accessible by the Orchestrator. The execution itself strictly obeys a single linear memory model, processes in DAG topological order, and restricts memory mapping to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code> within a complete WASM sandbox (no WASI, no syscalls, no network, no filesystem) where all faults map to uniform trap codes.
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
                            <td className="p-4 font-mono text-blue-400">Memory Offset</td>
                            <td className="p-4">P(x) = Offset(Field_x) = Σ(sizeof(Field_i))</td>
                            <td className="p-4">Deterministic memory mapping.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Payload Bounding</td>
                            <td className="p-4">Max_Payload_Size = Σ(sizeof(Event_Field_i))</td>
                            <td className="p-4">Size constraints on inputs.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Schema Bounds</td>
                            <td className="p-4">Schema_Validity = (sizeof(Payload) &le; 1MB)</td>
                            <td className="p-4">OOM prevention sizing constraints.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The rigid JSON schema generated from the YAML specification dictates the exact payload the Orchestrator API must receive. Any drift results in a 400 Bad Request.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Expected Orchestrator JSON Ingress Schema
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "action": { "type": "string", "enum": ["deposit", "withdraw"] },
    "amount": { "type": "integer", "minimum": 0 },
    "sender": { "type": "string", "pattern": "^0x[a-fA-F0-9]{40}$" }
  },
  "required": ["action", "amount", "sender"]
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Validation)</h2>
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
                            <td className="p-4 text-slate-300">Raw Ingress</td>
                            <td className="p-4">{"{"} action: "deposit", amount: -50 {"}"}</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-red-400">Validator Filter</td>
                            <td className="p-4">Error: amount must be &ge; 0</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Valid Ingress</td>
                            <td className="p-4">{"{"} action: "deposit", amount: 50, sender: "0x..." {"}"}</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Memory Map</td>
                            <td className="p-4">Pointer: 0x1000, Length: 64 bytes</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Blake3 Hash</td>
                            <td className="p-4">0xa1b2c3d4...</td>
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
                    <li>Network-level: Struct size overflow injections.</li>
                    <li>Execution-level: Memory boundary misalignment via malicious JSON.</li>
                    <li>Economic-level: Unpaid computation via unbounded structs.</li>
                    <li>Governance-level: Malicious DAO_INTEGRATION_VOTE schemas.</li>
                    <li>Telemetry-level: Schema_Fault spamming.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for compiled schema definitions and ed25519 signatures for network transmission.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: High gas costs dynamically calculated from structural byte sizes.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle within Specifications</h2>
            <p>
                Operators do not interact with the specification directly. They serve the compiled substrate. However, if a node receives a payload from the Orchestrator that violently misaligns with its compiled schema, the node emits a `Schema_Fault` attestation and requests an orchestrator sync.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Execution limits are directly calculated from the struct sizes defined in the specification. A specification declaring a 1MB struct carries a mathematically higher base execution fee than a specification declaring a 32-byte struct, aligning computational cost with node compensation.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                Every spec integration proposed to the mesh undergoes `DAO_INTEGRATION_VOTE`. The DAO evaluates the schema's memory requirements and cyclomatic complexity constraints before allowing its compilation and distribution to the node quorum.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> JSON Validation in <code>ExecTime &le; 0.5ms</code> per incoming HTTP payload at the Orchestrator.</li>
                <li><strong>Latency Bounds:</strong> Memory Mapping in <code>ExecTime &le; 0.1ms</code> to serialize valid JSON into the WASM linear memory struct format.</li>
                <li><strong>Throughput Metrics:</strong> <code>&gt; 100,000 ops_per_sec</code> globally.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                The <code>spec.yaml</code> structurally binds the Orchestrator (TypeScript/Go API) and the Execution Node (Rust/WASM). Schema definitions proposed by the DAO are propagated directly through the Orchestrator down to the nodes via the <code>SyncManifest</code> pipeline. Timing guarantees state that API schemas are refreshed within 5ms of a new Substrate generation.
            </p>

            <h2 id="formal-diagrams">11. Formal Specification DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="130" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="100" y="155" fill="#888" fontSize="11" textAnchor="middle">Raw HTTP JSON</text>

                    <line x1="150" y1="150" x2="250" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="250" y="110" width="150" height="80" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="325" y="145" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator Gate</text>
                    <text x="325" y="165" fill="#888" fontSize="11" textAnchor="middle">spec.yaml validation</text>

                    <line x1="325" y1="110" x2="325" y2="50" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <rect x="275" y="10" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="325" y="35" fill="#888" fontSize="11" textAnchor="middle">Drop: 400 Error</text>

                    <line x1="400" y1="150" x2="500" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="500" y="130" width="120" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="560" y="155" fill="#888" fontSize="11" textAnchor="middle">Linear Byte Array</text>

                    <line x1="620" y1="150" x2="700" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <rect x="700" y="130" width="80" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="740" y="155" fill="#888" fontSize="11" textAnchor="middle">WASM Node</text>
                </svg>
            </div>
        </>
    );
}
