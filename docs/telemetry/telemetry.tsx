import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Runtime Telemetry | WeNode',
    description: 'Formal specification of the deterministic metrics and execution logs emitted by the Wnode mesh.',
};

export default function TelemetryPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Runtime Telemetry</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict definitions of the structured JSON heartbeats mapping node health, execution latency, and deterministic state hashes.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The execution of telemetry extraction is strictly out-of-band relative to the WASM payload processing. The `nodld` daemon utilizes asynchronous OS threads to poll cgroups (for memory bounds) and internal Wazero metric counters. Telemetry serialization and WSS transmission execute without holding locks on the core WASM execution thread, ensuring 0ms latency impact on deterministic consensus. The core WASM payload execution remains bounded by a single linear memory model, processing sequentially in DAG topological order under strict WASM sandboxing (no WASI, no syscalls, no network, no filesystem). All memory pointers strictly enforce <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>, issuing deterministic standardized trap codes on any execution fault.
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
                            <td className="p-4 font-mono text-blue-400">Heartbeat Frequency</td>
                            <td className="p-4">1.0 Hz &le; &Delta;t_Heartbeat &le; 10.0 Hz</td>
                            <td className="p-4">Continuous uptime validation.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Liveness Tracking</td>
                            <td className="p-4">Liveness_Score = Count(Valid) / Expected</td>
                            <td className="p-4">SLA metric generation.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Payload Integrity</td>
                            <td className="p-4">Verify_ED25519(JSON_Blob, Node_Pub_Key)</td>
                            <td className="p-4">Signature verification.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Telemetry payloads are strictly schema-enforced JSON blobs signed by the operator's private key and pushed via persistent WebSocket connections.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// JSON Schema: Node Telemetry Envelope
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["nodeId", "timestampMs", "metrics", "signature"],
  "properties": {
    "nodeId": { "type": "string", "pattern": "^0x[a-fA-F0-9]{64}$" },
    "timestampMs": { "type": "integer" },
    "metrics": {
      "type": "object",
      "required": ["tpsCurrent", "avgLatencyUs", "memoryUsedKb", "wasmTraps"],
      "properties": {
        "tpsCurrent": { "type": "integer" },
        "avgLatencyUs": { "type": "integer" },
        "memoryUsedKb": { "type": "integer", "maximum": 32768 },
        "wasmTraps": { "type": "integer" }
      }
    },
    "signature": { "type": "string", "pattern": "^0x[a-fA-F0-9]{128}$" }
  }
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Telemetry Aggregation)</h2>
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
                            <td className="p-4 text-slate-300">Cgroup Read</td>
                            <td className="p-4">memory.current &rarr; 14MB</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Metric Aggregation</td>
                            <td className="p-4">Wazero avg lat &rarr; 12.4ms</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Cryptographic Signing</td>
                            <td className="p-4">ED25519_Sign(JSON) &rarr; 0x4a...</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">WSS Transmission</td>
                            <td className="p-4">Async flush to Orchestrator Ingress</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Time-Series DB</td>
                            <td className="p-4">Prometheus ingest (Grafana mapped)</td>
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
                    <li>Network-level: Telemetry packet spoofing and replay attacks.</li>
                    <li>Execution-level: False metric injection.</li>
                    <li>Economic-level: SLA manipulation to sybil rewards.</li>
                    <li>Governance-level: Refusal to update telemetry schemas.</li>
                    <li>Telemetry-level: Forged memory trap reports.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing and ed25519 signatures for telemetry packets.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Operator SLA multipliers are mathematically reduced for anomalous or unsigned heartbeats.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Liveness Proving)</h2>
            <p>
                Continuous telemetry emission is the operator's heartbeat. If the Orchestrator does not receive a valid, signed telemetry payload within a 3-second window, the node is flagged as physically halted. The node is immediately excised from active quorum routing, and its stake begins accruing downtime slashing penalties until the daemon reconnects.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Telemetry forms the basis of the `SLA_Multiplier`. Operators who consistently report and prove sub-10ms execution times and zero Wazero memory traps receive a higher multiple on their base WNODE epoch rewards compared to slower operators hovering near the 50ms watchdog boundary.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                A `DAO_TELEMETRY_SCHEMA_UPDATE` is required to alter the mandatory telemetry JSON structure. Nodes failing to upgrade their `nodld` daemon to emit the new schema will have their payloads dropped by the ingress JSON-Schema filter, resulting in liveness penalties.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Resource Pressure:</strong> Payload size strictly bounded to <code>mem_pressure_mb &le; 1KB</code> per heartbeat.</li>
                <li><strong>Throughput Metrics:</strong> Minimal network overhead of <code>~8 Kbps</code> continuous.</li>
                <li><strong>Resource Pressure:</strong> Host CPU impact <code>cpu_pressure_pct &le; 0.5%</code> for signing and WSS framing.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Telemetry payloads are fire-and-forget from the node's perspective, executed strictly asynchronously out-of-band from the WASM runtime. The Orchestrator ingests these JSON schemas at the expected heartbeat rate (1.0 Hz to 10.0 Hz), verifies the signature against the active node registry, and pipes the structured data into Prometheus/Grafana clusters for network-wide observability. Failure to maintain the heartbeat rate directly maps to SLA slashing rules, culminating in node ejection.
            </p>

            <h2 id="formal-diagrams">11. Formal Telemetry DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <rect x="50" y="50" width="200" height="200" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="150" y="80" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">nodld Daemon</text>
                    
                    <rect x="70" y="100" width="160" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="150" y="125" fill="#888" fontSize="11" textAnchor="middle">Wazero Core (Blocked)</text>

                    <rect x="70" y="160" width="160" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="150" y="185" fill="#888" fontSize="11" textAnchor="middle">Telemetry Async Thread</text>

                    <line x1="250" y1="180" x2="480" y2="180" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowSolid)" />
                    <text x="365" y="170" fill="#888" fontSize="11" textAnchor="middle">WSS Stream (1.0 Hz)</text>

                    <rect x="490" y="110" width="160" height="100" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="570" y="140" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator</text>
                    <text x="570" y="165" fill="#888" fontSize="11" textAnchor="middle">Verify Signature</text>
                    <text x="570" y="185" fill="#888" fontSize="11" textAnchor="middle">Inject into TSDB</text>
                </svg>
            </div>
        </>
    );
}
