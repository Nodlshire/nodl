import React from 'react';
import Callout from '../../components/docs/Callout';
import CodeBlock from '../../components/docs/CodeBlock';

export default function ArchitectureOverview() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Architecture Overview</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed">
                    The Wnode Sovereign Mesh is a deterministic, verifiable, and auto-scaling compute substrate. 
                    It executes immutable, signed WASM/Go artifacts deployed across a decentralized network. 
                    The network features a stateless, horizontally scalable orchestrator layer, 
                    local ingress validation via signed routing epochs, capability-based WASM execution, 
                    hardened telemetry via mTLS and signed envelopes, and a multi-dimensional reputation and grace system for node reliability.
                </p>
            </div>

            <h2 id="conceptual-overview">Conceptual Overview & Rationale</h2>
            <p>
                Wnode abandons traditional container orchestration in favor of a strictly generative <strong>Substrate Model</strong>. 
                Instead of accepting opaque, mutable Docker containers that introduce zero-day vulnerabilities and unpredictable state, 
                Wnode strictly ingests declarative <code>spec.yaml</code> definitions.
            </p>
            <p>
                <strong>The Rationale:</strong> In a trustless decentralized network, running a black-box container is inherently unsafe. 
                By compiling a declarative <code>spec.yaml</code> into an immutable, deterministic artifact (WASM or native Go), Wnode guarantees 
                identical execution environments globally. This deterministic execution, combined with capability-based host extensions, 
                provides a perfect balance between airtight safety and real-world utility. Furthermore, by distributing signed routing epochs to nodes for local validation, 
                we remove central bottlenecks, enabling the orchestrator to scale horizontally without becoming a Single Point of Failure (SPOF) for ingress traffic.
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
                    <text x="400" y="45" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Stateless Orchestrator Layer</text>
                    <text x="400" y="65" fill="#94a3b8" fontSize="12" textAnchor="middle">Ingress Validation</text>
                    <text x="400" y="85" fill="#94a3b8" fontSize="12" textAnchor="middle">Routing Epoch Distribution</text>
                    <text x="400" y="105" fill="#94a3b8" fontSize="12" textAnchor="middle">Telemetry Sink (mTLS)</text>

                    {/* Earth Mesh */}
                    <rect x="100" y="220" width="240" height="140" rx="8" fill="url(#gradEarth)" stroke="#10b981" strokeWidth="2" />
                    <text x="220" y="245" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Earth Mesh (Tier-1)</text>
                    <text x="220" y="265" fill="#94a3b8" fontSize="12" textAnchor="middle">Synchronous Execution (WASM/Go)</text>
                    <text x="220" y="285" fill="#94a3b8" fontSize="12" textAnchor="middle">Local Ingress Validation</text>
                    <rect x="130" y="310" width="180" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="220" y="335" fill="#10b981" fontSize="12" textAnchor="middle">Capability-Scoped Outbound I/O</text>

                    {/* Space Mesh */}
                    <rect x="460" y="220" width="240" height="140" rx="8" fill="url(#gradSpace)" stroke="#f43f5e" strokeWidth="2" />
                    <text x="580" y="245" fill="white" fontSize="16" fontWeight="bold" textAnchor="middle">Space Mesh (Tier-3)</text>
                    <text x="580" y="265" fill="#94a3b8" fontSize="12" textAnchor="middle">Asynchronous MapReduce</text>
                    <text x="580" y="285" fill="#94a3b8" fontSize="12" textAnchor="middle">Sharded Workloads</text>
                    <rect x="490" y="310" width="180" height="40" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="580" y="335" fill="#f43f5e" fontSize="12" textAnchor="middle">Edge / Off-Grid Operators</text>

                    {/* Routing Lines */}
                    <path d="M 350 120 C 350 170, 220 170, 220 220" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSolid)" />
                    <path d="M 450 120 C 450 170, 580 170, 580 220" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSolid)" />
                </svg>
            </div>

            <h2 id="sequence-diagram">Execution Sequence Flow</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    
                    {/* Lifelines */}
                    <line x1="150" y1="50" x2="150" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="650" y1="50" x2="650" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    {/* Actors */}
                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#94a3b8" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">DApp Client</text>

                    <rect x="600" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="650" y="40" fill="white" textAnchor="middle" fontWeight="bold">Node Operator</text>

                    {/* Messages */}
                    <line x1="150" y1="80" x2="640" y2="80" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrow)" />
                    <text x="400" y="75" fill="#cbd5e1" textAnchor="middle">1. Send HMAC-Signed Request</text>

                    <rect x="635" y="95" width="30" height="20" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                    <text x="675" y="110" fill="#94a3b8" textAnchor="start">2. Validate locally using cached Routing Epoch</text>

                    <rect x="635" y="125" width="30" height="20" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                    <text x="675" y="140" fill="#94a3b8" textAnchor="start">3. Execute WASM with Capability Enforcement</text>

                    <rect x="635" y="155" width="30" height="20" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                    <text x="675" y="170" fill="#94a3b8" textAnchor="start">4. Emit Signed Telemetry Envelope</text>

                    <line x1="650" y1="200" x2="160" y2="200" stroke="#10b981" strokeWidth="2" markerEnd="url(#seqArrow)" />
                    <text x="400" y="195" fill="#cbd5e1" textAnchor="middle">5. Return Encrypted Result</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Core Code Artifacts</h2>
            <p>To fully grasp the architecture, you must understand how a declarative YAML becomes an executable WASM capability boundary.</p>

            <CodeBlock language="yaml" title="spec.yaml (Declarative Target)">{`id: "hello-world-01"
strict_mode: true
job_template:
  action: "execute_hello"
  node_job:
    execution_type: "wasm"
    timeout_ms: 500
    capabilities:
      https_bindings:
        - "api.stripe.com"
      db_bindings:
        - "primary_pg"`}</CodeBlock>

            <CodeBlock language="go" title="WASM Runtime & Capabilities (Daemon)">{`// Parses routing epochs and validates capability scopes
func ExecuteWasm(ctx context.Context, payload []byte, caps WasmCapabilities) {
    // Epoch validated locally. Enforce declared capabilities via Wazero host funcs.
    RegisterHostFunctions(ctx, r, caps)
    
    // Wazero strictly limits capabilities like http_request and db_query 
    // to the bindings explicitly permitted in the signed spec.yaml payload.
    res, err := r.CallWASM("process_task", payload)
}`}</CodeBlock>

            <CodeBlock language="go" title="Routing Epoch Structure">{`type RoutingEpoch struct {
    EpochID       string            
    AllowedRoutes []string          
    HMACSecret    string            
    ExpiresAt     time.Time         
    Signature     string            
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Epoch Expiration:</strong> If the locally cached routing epoch expires, the node rejects all ingress traffic safely until a new signed epoch is successfully fetched.</li>
                <li><strong>Capability Rejection:</strong> If a WASM module attempts an I/O operation not explicitly declared in its <code>spec.yaml</code>, the host function instantly traps the call, logging a capability rejection.</li>
                <li><strong>WASM Sandbox Traps:</strong> Panics or out-of-bounds memory accesses within the WASM module are trapped securely by the Wazero runtime without affecting the underlying host.</li>
                <li><strong>Grace-Based Reputation Decay:</strong> Nodes are not instantly slashed for transient failures. Instead, the reputation system uses a continuous grace window and multi-dimensional scoring (uptime, tasks, thermal, heartbeat). Repeated failures cause exponential score decay.</li>
                <li><strong>Offline Operation:</strong> During temporary Orchestrator downtime, nodes continue to process tasks seamlessly, relying on their cached routing epochs and local HMAC ingress validation.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p>
                <strong>Invariant 1:</strong> WASM execution is strictly deterministic by default. All execution takes place within an air-gapped memory sandbox.
            </p>
            <p>
                <strong>Invariant 2:</strong> All outbound I/O is capability-scoped. Functions can only access external networks or databases if the capability is cryptographically signed in the spec payload.
            </p>
            <p>
                <strong>Invariant 3:</strong> Artifacts and routing epochs are cryptographically signed. Nodes verify the SHA-256 hash and ed25519 signature before execution or ingress allowance.
            </p>
            <p>
                <strong>Invariant 4:</strong> Node identity keys provide absolute cryptographic proof of execution. All telemetry is secured via mTLS transport and wrapped in signed envelopes.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p>
                The architecture is heavily optimized for edge deployment.
                <ul>
                    <li><strong>Local Ingress Validation Latency:</strong> &lt; 1ms overhead for local HMAC and epoch route validation.</li>
                    <li><strong>WASM Cold Start:</strong> &lt; 10ms utilizing pre-compiled runtime caches.</li>
                    <li><strong>Capability Overhead:</strong> &lt; 2ms penalty for bridging host-function capabilities from the WASM guest to the Go daemon.</li>
                    <li><strong>Epoch Refresh Intervals:</strong> Epochs are asynchronously refreshed every 10 minutes, entirely outside the execution critical path.</li>
                </ul>
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400">Maintain high node uptime. Protect the local node identity keys securely. Ensure host OS cgroups and sandboxing features are correctly enabled to support the daemon.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400">Define accurate <code>spec.yaml</code> manifests. Explicitly declare any required HTTP or DB capabilities. Write highly deterministic WASM logic.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <p>Telemetry is never transmitted in plaintext. All telemetry utilizes mTLS transport and is cryptographically signed by the node's identity key, including a monotonic sequence counter to prevent replay attacks.</p>
            <CodeBlock language="json" title="Signed Telemetry Envelope">{`{
  "sequence": 4092,
  "pub_key": "abc123def456...",
  "signature": "sig789...",
  "payload": {
    "node_id": "0xabc123",
    "metrics": {
      "cpu_pressure_pct": 12.4,
      "ram_pressure_pct": 45.1
    }
  }
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p>
                Nodes operate entirely independently based on locally cached routing epochs. 
                The Orchestrator functions exclusively as a stateless, horizontally scalable routing table publisher and authenticated telemetry sink. 
                Telemetry interaction is secured via mTLS, ensuring end-to-end encryption and node authenticity.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Excessive Capability Requests">
                Do not declare wildcard bindings or excessive external capabilities in your <code>spec.yaml</code>. Capabilities break pure determinism and expose the application to network latency. Declare the absolute minimal required bindings.
            </Callout>
            <Callout type="best-practice" title="Best Practice: Assume Temporary Orchestrator Loss">
                Nodes should expect the orchestrator to occasionally drop offline. Rely on the cached routing epoch to gracefully accept and validate traffic during these windows. Do not poll the orchestrator synchronously on the critical path.
            </Callout>

        </>
    );
}
