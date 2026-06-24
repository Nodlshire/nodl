import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Orchestration Layer | WeNode',
    description: 'Formal architectural specification of the deterministic integration of large language models within the execution mesh.',
};

export default function AIOrchestrationPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">AI Orchestration Layer</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict boundaries enforcing deterministic, consensus-verified inference capabilities across the sovereign network.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The AI Orchestration Layer imposes deterministic strictures upon non-deterministic neural network inference. It functions strictly as an asynchronous out-of-band middleware, decoupling the &gt;5 second latency of LLM APIs from the sub-50ms execution matrix. Responses are ingested back into the mesh exclusively via strictly-typed JSON schemas signed by the Orchestrator's institutional key, converting probabilistic output into verifiable data states. Resumed state execution operates deterministically within a single linear memory model, processing calls in DAG topological order. The WASM sandbox strictly enforces no WASI, no syscalls, no network, and no filesystem access, bounding memory to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. Faults during resumption trigger standardized trap codes.
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
                            <td className="p-4 font-mono text-blue-400">Payload Parse</td>
                            <td className="p-4">JSON_AST = Parse(LLM_Output)</td>
                            <td className="p-4">Deterministic payload ingestion.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Schema Verification</td>
                            <td className="p-4">Verify(JSON_AST, Local_Schema) == TRUE</td>
                            <td className="p-4">Type safety guarantees.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The boundary enforces that the mesh only ever interacts with the LLM via defined `AI_Request` and `AI_Callback` payloads.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Protobuf: LLM Inference Callback
message LLMCallbackEvent {
  bytes request_id = 1; // Used to resume suspended logic
  string structured_json_payload = 2; // Strict schema adherence
  uint64 tokens_consumed = 3;
  bytes signature = 4;
  uint64 timestamp_ms = 5;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Inference Lifecycle)</h2>
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
                            <td className="p-4 text-slate-300">Request Emitted</td>
                            <td className="p-4">WASM outputs `[AI_CALL, id: 0x4A, prompt: "..."]`</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Async Orchestration</td>
                            <td className="p-4">Middleware routes to `gpt-4-turbo-preview`</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Schema Validation</td>
                            <td className="p-4">Middleware asserts response matches `{"{"}"action": "BUY"{"}"}`</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Signature Verification</td>
                            <td className="p-4">Mesh verifies `LLMCallbackEvent` signature</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">State Execution</td>
                            <td className="p-4">Contract resumes execution with structured AST</td>
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
                    <li>Network-level: API inference callback interception.</li>
                    <li>Execution-level: Prompt injection and hallucination hijacking.</li>
                    <li>Economic-level: Sybil-driven API cost bankruptcy.</li>
                    <li>Governance-level: Unauthorized provider whitelisting.</li>
                    <li>Telemetry-level: Forged JSON AST schemas.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for payload integrity and ed25519 signatures for orchestrator callbacks.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Predefined protocol fees deducted immediately upon AI_CALL emission.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Inference Routing)</h2>
            <p>
                Node Operators (Tier-2/3) do not run massive GPU clusters locally. Instead, their execution nodes pause the contract state upon an `AI_CALL`, while the Tier-1 Orchestrator handles the heavy lifting of routing the API request to a centralized provider (or a decentralized compute mesh) and ultimately feeding the signed callback down to the operators to resume the state machine.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                To prevent Sybil-driven API bankruptcy, every `AI_CALL` emitted by a contract deducts a predefined protocol fee from the user's balance, sized dynamically to cover the underlying provider's cost per 1k tokens, plus an integration margin routed to the Distribution Engine.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The allowed LLM providers (OpenAI, Anthropic, local LLaMA nodes) and the corresponding fee schedules are rigidly controlled by DAO governance parameters, preventing unilateral extraction or deprecation.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> The Orchestrator applies a hard <code>RTT &le; 30s</code> timeout to external API calls.</li>
                <li><strong>Resource Pressure:</strong> Suspended contracts serialize to disk to maintain <code>mem_pressure_mb &le; 32MB</code> active bounds.</li>
                <li><strong>Throughput Metrics:</strong> Orchestrator handles &gt; 5,000 <code>msgs_per_sec</code> concurrent promises.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Deeply integrated with WEX to provide the `suspend` and `resume` lifecycle mechanics required to halt WebAssembly execution cleanly. The Orchestrator injects the signed <code>LLMCallbackEvent</code> directly into the <code>SyncManifest</code> pipeline, converting external API non-determinism into mathematically verifiable internal state.
            </p>

            <h2 id="formal-diagrams">11. Formal AI Asynchronous DAG</h2>
            <div className="my-10 bg-[#0d1117] border border-white/10 rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <defs>
                        <marker id="arrowSolidTeal" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="110" width="120" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="135" fill="#888" fontSize="12" textAnchor="middle" fontWeight="bold">WEX Sandbox</text>

                    <line x1="170" y1="120" x2="250" y2="120" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowSolidTeal)" />
                    <text x="210" y="110" fill="#888" fontSize="10" textAnchor="middle">Emit Call</text>

                    <rect x="250" y="70" width="160" height="120" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="330" y="100" fill="#10b981" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator</text>
                    <text x="330" y="130" fill="#888" fontSize="10" textAnchor="middle">1. Request API</text>
                    <text x="330" y="150" fill="#888" fontSize="10" textAnchor="middle">2. Sign Valid JSON</text>

                    <line x1="410" y1="120" x2="490" y2="120" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolidTeal)" />
                    <line x1="490" y1="140" x2="410" y2="140" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolidTeal)" />

                    <rect x="490" y="110" width="100" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="540" y="135" fill="#888" fontSize="12" textAnchor="middle">OpenAI / Claude</text>

                    <line x1="250" y1="150" x2="170" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolidTeal)" />
                    <text x="210" y="170" fill="#10b981" fontSize="10" textAnchor="middle">Resume Exec</text>
                </svg>
            </div>
        </>
    );
}
