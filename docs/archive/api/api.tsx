import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'API Reference | WeNode',
    description: 'Strict specification of the Orchestrator REST and WSS interfaces.',
};

export default function APIReferencePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">API Reference</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Formal network contracts defining interactions between the Orchestrator, Node Operators, and generated SDKs.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The API operates under strict decoupled asynchronous semantics. The ingress layer mathematically validates cryptographic signatures and schema conformity, but it does NOT execute state transitions. Valid payloads are enqueued into the high-throughput memory bus and broadcasted to the Earth Mesh via WSS. The API returns an immediate <code>202 Accepted</code> with a deterministic transaction hash, allowing the client to poll for finality without blocking the connection thread. All downstream execution follows a single linear memory model, processes in DAG topological order, and adheres to strict Native Go sandboxing (no WASI, no syscalls, no network, no filesystem) where <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. All execution faults propagate deterministically with standardized error envelopes.
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
                            <td className="p-4 font-mono text-blue-400">Hashing Integrity</td>
                            <td className="p-4">H = blake3(bytes)</td>
                            <td className="p-4">Cryptographic integrity of endpoints.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Latency Bound</td>
                            <td className="p-4">ACK_Latency = Validation_Time + Queue_Insert_Time</td>
                            <td className="p-4">Asynchronous ingestion decoupling.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Finality State</td>
                            <td className="p-4">Finality_State = Quorum_Consensus(H)</td>
                            <td className="p-4">Quorum confirmation.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The primary HTTP ingress endpoint requires a rigidly structured POST body and cryptographic headers.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`POST /v1/mesh/submit
Headers:
  Content-Type: application/json
  X-Signature: ED25519-Hex-String
  X-Public-Key: ED25519-Hex-String

Body:
{
  "substrate": "wnode-token",
  "payload": "Base64-Encoded-Struct-Bytes",
  "nonce": 42
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (API Routing)</h2>
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
                            <td className="p-4 text-slate-300">Ingress Rx</td>
                            <td className="p-4">TCP payload received at Orchestrator</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Auth Eval</td>
                            <td className="p-4">ED25519 Verify(Pub, Sig, Payload) == true</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Queue Tx</td>
                            <td className="p-4">Enqueued to Mesh WSS Channel</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Response</td>
                            <td className="p-4">HTTP 202 {"{ txHash: '0xabc...' }"}</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Async Query</td>
                            <td className="p-4">GET /v1/mesh/status/0xabc... &rarr; "Finalized"</td>
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
                    <li>Network-level: DDoS floods on ingress APIs.</li>
                    <li>Execution-level: Cryptographic validation bottlenecking.</li>
                    <li>Economic-level: API spam leading to native bankruptcy.</li>
                    <li>Governance-level: Deprecated API version poisoning.</li>
                    <li>Telemetry-level: Intercepted API metrics.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing and ed25519 signatures for all payloads.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Balance locks and kernel-level blacklisting.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> explicitly enforces no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle within the API</h2>
            <p>
                Operators do not host the global ingress API; they connect to the Orchestrator's outward API via WebSocket. Operators open a persistent `WSS` tunnel, authenticate their Node Identity, and receive a continuous stream of validated `Tx_Hash` jobs to compute locally.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                API access is natively metered based on compute units. If a client submits a payload requiring 100M Gas, the API enforces a proportional balance lock on the submitter's API key before queueing the transaction. Spamming the API natively bankrupts the attacking API key.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The Orchestrator API strictly adheres to backward compatibility via URI versioning (`/v1/`, `/v2/`). Deprecating an API version requires a 6-month `DAO_PROTOCOL_NOTICE` phase, allowing all deployed client SDKs to be rotated to the new standard.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>RTT &le; 200ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> High <code>msgs_per_sec</code> for ingress gateways.</li>
                <li><strong>Network Performance:</strong> <code>avg_rtt_ms</code> bound by TCP handshake overhead.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                The API binds the untrusted Client SDK to the trusted Node Operator network. It acts as the ultimate cryptographic firewall, ensuring that <code>nodld</code> never processes an invalid JSON struct. Validated requests are piped directly into the Orchestrator's <code>SyncManifest</code>, bridging external RPC to the internal Native Go matrix.
            </p>

            <h2 id="formal-diagrams">11. Formal API Ingress DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="110" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="100" y="135" fill="#888" fontSize="11" textAnchor="middle">Client SDK</text>

                    <line x1="150" y1="130" x2="250" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <circle cx="300" cy="130" r="50" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="300" y="125" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">API Gateway</text>
                    <text x="300" y="145" fill="#888" fontSize="11" textAnchor="middle">Validation</text>

                    <line x1="300" y1="80" x2="300" y2="40" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <polygon points="300,0 360,20 300,40 240,20" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="300" y="25" fill="#888" fontSize="11" textAnchor="middle">Drop / Ban</text>

                    <line x1="350" y1="130" x2="450" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="450" y="110" width="120" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="510" y="135" fill="#888" fontSize="11" textAnchor="middle">Tx Queue</text>

                    <line x1="570" y1="130" x2="650" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <line x1="570" y1="130" x2="650" y2="160" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="650" y="80" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="700" y="105" fill="#888" fontSize="11" textAnchor="middle">Node 1 (WSS)</text>

                    <rect x="650" y="140" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="700" y="165" fill="#888" fontSize="11" textAnchor="middle">Node 2 (WSS)</text>

                    <line x1="300" y1="180" x2="300" y2="220" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <rect x="250" y="220" width="100" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="300" y="245" fill="#888" fontSize="11" textAnchor="middle">202 Accepted</text>
                </svg>
            </div>
        </>
    );
}
