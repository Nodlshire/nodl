import React from 'react';
import Callout from '../../components/docs/Callout';
import CodeBlock from '../../components/docs/CodeBlock';

export default function ArchitectureOverview() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Architecture Overview</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed">
                    The Wnode Sovereign Mesh is a deterministic, verifiable, and auto-scaling compute substrate acting as the canonical execution layer for decentralized integrations.
                </p>
            </div>

            <h2 id="conceptual-overview">Conceptual Overview & Rationale</h2>
            <p>
                Wnode abandons traditional container orchestration (like Kubernetes or Docker Swarm) in favor of a strictly generative <strong>Substrate Model</strong>. Instead of accepting generic Docker images which hide immense complexity, zero-day vulnerabilities, and unpredictable state, Wnode ingests declarative YAML specs.
            </p>
            <p>
                <strong>The Rationale:</strong> In a truly decentralized network where nodes are operated by thousands of untrusted third parties, shipping a container means shipping a black box. You cannot deterministically prove what a container will do until it does it. By forcing developers to write a <code>spec.yaml</code>, Wnode can deterministically compile that spec into hardened, zero-dependency WASM and native Go binaries. This guarantees identical execution environments globally, removing environmental drift entirely.
            </p>

            <h2 id="architecture-diagram">Global Architecture Diagram</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 400" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <linearGradient id="gradOrchestrator" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="gradEarth" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#059669" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="gradSpace" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#e11d48" stopOpacity="0.1" />
                        </linearGradient>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#94a3b8" />
                        </marker>
                    </defs>
                    
                    {/* Orchestrator */}
                    <rect x="300" y="20" width="200" height="100" rx="8" fill="url(#gradOrchestrator)" stroke="#3b82f6" strokeWidth="2" />
                    <text x="400" y="55" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Global Orchestrator</text>
                    <text x="400" y="75" fill="#94a3b8" fontSize="12" textAnchor="middle">Ingress, DAG Routing,</text>
                    <text x="400" y="95" fill="#94a3b8" fontSize="12" textAnchor="middle">Telemetry Aggregation</text>

                    {/* Earth Mesh */}
                    <rect x="100" y="220" width="240" height="140" rx="8" fill="url(#gradEarth)" stroke="#10b981" strokeWidth="2" />
                    <text x="220" y="255" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Earth Mesh (Tier-1)</text>
                    <text x="220" y="275" fill="#94a3b8" fontSize="12" textAnchor="middle">Synchronous / Native Go</text>
                    <rect x="130" y="300" width="180" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="220" y="325" fill="#10b981" fontSize="12" textAnchor="middle">Bare-Metal Operators</text>

                    {/* Space Mesh */}
                    <rect x="460" y="220" width="240" height="140" rx="8" fill="url(#gradSpace)" stroke="#f43f5e" strokeWidth="2" />
                    <text x="580" y="255" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Space Mesh (Tier-3)</text>
                    <text x="580" y="275" fill="#94a3b8" fontSize="12" textAnchor="middle">Asynchronous MapReduce</text>
                    <rect x="490" y="300" width="180" height="40" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="580" y="325" fill="#f43f5e" fontSize="12" textAnchor="middle">Orbital / Edge Operators</text>

                    {/* Routing Lines */}
                    <path d="M 350 120 C 350 170, 220 170, 220 220" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSolid)" />
                    <path d="M 450 120 C 450 170, 580 170, 580 220" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSolid)" />

                    <text x="260" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">Low Latency Sync</text>
                    <text x="540" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">Sharded Async</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Execution Sequence Flow</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 300" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    
                    {/* Lifelines */}
                    <line x1="100" y1="50" x2="100" y2="280" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="400" y1="50" x2="400" y2="280" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="700" y1="50" x2="700" y2="280" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Actors */}
                    <rect x="50" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                    <text x="100" y="40" fill="white" textAnchor="middle" fontWeight="bold">DApp Client</text>

                    <rect x="350" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                    <text x="400" y="40" fill="white" textAnchor="middle" fontWeight="bold">Orchestrator</text>

                    <rect x="650" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="700" y="40" fill="white" textAnchor="middle" fontWeight="bold">Node Operator</text>

                    {/* Messages */}
                    <line x1="100" y1="80" x2="390" y2="80" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrow)" />
                    <text x="250" y="75" fill="#cbd5e1" textAnchor="middle">1. POST /submit (HMAC Signed)</text>

                    <rect x="385" y="100" width="30" height="40" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                    <text x="375" y="125" fill="#94a3b8" textAnchor="end">2. Validate Schema & Auth</text>

                    <line x1="400" y1="160" x2="690" y2="160" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrow)" />
                    <text x="550" y="155" fill="#cbd5e1" textAnchor="middle">3. Route to optimal Node</text>

                    <rect x="685" y="180" width="30" height="40" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                    <text x="725" y="205" fill="#94a3b8" textAnchor="start">4. Execute WASM inside Cgroups</text>

                    <line x1="700" y1="240" x2="410" y2="240" stroke="#10b981" strokeWidth="2" markerEnd="url(#seqArrow)" />
                    <text x="550" y="235" fill="#cbd5e1" textAnchor="middle">5. Return Encrypted Result</text>

                    <line x1="400" y1="270" x2="110" y2="270" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrow)" />
                    <text x="250" y="265" fill="#cbd5e1" textAnchor="middle">6. 200 OK (JSON Payload)</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Core Code Artifacts</h2>
            <p>To fully grasp the architecture, you must understand how a declarative YAML becomes an executable Go handler.</p>

            <CodeBlock language="yaml" title="spec.yaml (Declarative Target)">{`id: "hello-world-01"
strict_mode: true
job_template:
  action: "execute_hello"
  node_job:
    execution_type: "native"
    timeout_ms: 500
    required_resources:
      CPU: "1"
      RAM: "128MB"`}</CodeBlock>

            <CodeBlock language="go" title="nodegen_output.go (Generated Handler)">{`// AUTO-GENERATED: DO NOT EDIT
func (h *HelloWorldHandler) Execute(ctx context.Context, payload []byte) ([]byte, error) {
    // Context enforced by timeout_ms: 500
    ctx, cancel := context.WithTimeout(ctx, 500*time.Millisecond)
    defer cancel()

    // Cgroup bounds applied implicitly by the daemon wrapper for this struct
    // CPU: 1, RAM: 128MB

    start := time.Now()
    res, err := h.Runtime.CallWASM("execute_hello", payload)
    
    if err != nil {
        telemetry.EmitFault("hello-world-01", err.Error(), time.Since(start))
        return nil, err
    }
    
    telemetry.EmitSuccess("hello-world-01", time.Since(start))
    return res, nil
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Network Partition (Orchestrator to Node):</strong> If the Orchestrator cannot reach an Earth node during step 3, the DAG routing table marks the node as <code>unreachable</code> and immediately re-routes to the next available node based on latency metrics.</li>
                <li><strong>WASM Panic:</strong> If the <code>CallWASM</code> execution panics (e.g., divide by zero in user logic), the Wazero sandbox traps the panic. The node does not crash. It returns an <code>ExecutionFault</code> to the Orchestrator, which responds to the DApp with a <code>422 Unprocessable Entity</code>.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p>
                <strong>Invariant 1:</strong> The Orchestrator never executes third-party code. It only routes. This prevents Orchestrator compromise via malicious payloads.
            </p>
            <p>
                <strong>Invariant 2:</strong> Node Operators cannot read the raw Orchestrator-to-DApp signing keys. HMAC validation occurs <em>before</em> routing. Nodes only receive the execution payload.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p>
                The Orchestrator's internal router is written in highly optimized Go, utilizing lock-free DAG traversal.
                <ul>
                    <li><strong>Ingress Latency:</strong> &lt; 2ms overhead for HMAC validation and schema checks.</li>
                    <li><strong>Routing Overhead:</strong> &lt; 5ms to traverse the DHT (Distributed Hash Table) and select an optimal node.</li>
                    <li><strong>WASM Cold Start:</strong> &lt; 10ms utilizing Wazero's pre-compiled cache.</li>
                </ul>
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400">Maintain high uptime, ensure bare-metal Cgroups are enabled in the kernel, and securely store the Node Identity cryptographic token. Operators do not manage routing or scaling logic.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400">Define strict, accurate YAML specifications. Write deterministic, memory-safe WASM logic that adheres to the <code>timeout_ms</code> constraints. Avoid non-deterministic algorithms.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <CodeBlock language="json" title="Heartbeat Payload">{`{
  "node_id": "0xabc123",
  "archetype": "EarthMesh",
  "metrics": {
    "cpu_pressure_pct": 12.4,
    "ram_pressure_pct": 45.1,
    "jobs_processed_1m": 450,
    "faults_1m": 0
  }
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p>
                The Orchestrator interacts with the Node Operators via long-lived, multiplexed WebSockets for telemetry (heartbeats), and initiates short-lived TCP streams for raw payload execution. The Node Operators never interact with each other directly in the Earth Mesh (preventing Sybil collusion).
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Imperative Configuration">
                Do not attempt to SSH into a Node Operator to tweak Nginx configs or container limits. All configuration must flow downwards from the central <code>spec.yaml</code>. Manual tweaks will be overwritten or will cause the <code>verify_substrate</code> hash check to fail, slashing the node.
            </Callout>
            <Callout type="best-practice" title="Best Practice: Over-provision Timeouts">
                When writing the <code>spec.yaml</code>, set <code>timeout_ms</code> to 2x your expected maximum execution time. Aggressive timeouts save resources but can cause spurious failures during localized network spikes.
            </Callout>

        </>
    );
}
