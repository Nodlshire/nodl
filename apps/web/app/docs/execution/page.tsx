import React from 'react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function ExecutionModel() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Execution Model</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed">
                    The dichotomy of the Mesh: Synchronous execution on bare-metal vs Asynchronous MapReduce on orbital nodes.
                </p>
            </div>

            <h2 id="conceptual-overview">Conceptual Overview & Rationale</h2>
            <p>
                Building a single execution model for both terrestrial datacenters and orbital satellites is impossible. Terrestrial networks optimize for latency (synchronous blocking). Orbital and edge networks optimize for eventual consistency and partition tolerance (asynchronous sharding).
            </p>
            <p>
                <strong>The Rationale:</strong> Wnode abstracts this physics problem away from the developer. The Orchestrator intelligently routes tasks based on the <code>job_template</code>. Earth Mesh handles real-time API gateways, while Space Mesh processes massive cryptographic batch verifications over hours.
            </p>

            <h2 id="architecture-diagram">Hybrid Routing Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowExec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="150" width="100" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
                    <text x="100" y="175" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Payload</text>

                    <path d="M 150 170 L 220 170" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowExec)" />

                    <path d="M 220 170 L 270 120 L 320 170 L 270 220 Z" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                    <text x="270" y="175" fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">Router</text>

                    {/* Path 1: Earth */}
                    <path d="M 270 120 C 270 60, 400 60, 480 60" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowExec)" strokeDasharray="4 4" />
                    <text x="350" y="50" fill="#10b981" fontSize="10" fontWeight="bold">if node_job</text>

                    <rect x="490" y="40" width="120" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="550" y="65" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Earth Node</text>

                    <path d="M 610 60 C 700 60, 700 130, 700 150" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowExec)" />

                    {/* Path 2: Space */}
                    <path d="M 270 220 C 270 280, 360 280, 420 280" fill="none" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrowExec)" strokeDasharray="4 4" />
                    <text x="350" y="295" fill="#f43f5e" fontSize="10" fontWeight="bold">if space_job</text>

                    <rect x="430" y="260" width="100" height="40" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="480" y="285" fill="white" fontSize="10" textAnchor="middle">Shard 1</text>

                    <rect x="540" y="260" width="100" height="40" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="590" y="285" fill="white" fontSize="10" textAnchor="middle">Shard N</text>

                    <path d="M 530 280 L 540 280" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="2 2" />

                    <path d="M 640 280 C 700 280, 700 190, 700 170" fill="none" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrowExec)" />

                    {/* Result */}
                    <rect x="650" y="150" width="100" height="40" rx="4" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                    <text x="700" y="175" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Result</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Space Mesh MapReduce Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowExec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="400" y1="50" x2="400" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="650" y1="50" x2="650" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">Orchestrator</text>

                    <rect x="350" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="400" y="40" fill="white" textAnchor="middle" fontWeight="bold">Space Node A</text>

                    <rect x="600" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="650" y="40" fill="white" textAnchor="middle" fontWeight="bold">Space Node B</text>

                    <line x1="150" y1="80" x2="390" y2="80" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#seqArrowExec)" />
                    <text x="275" y="75" fill="#cbd5e1" textAnchor="middle">1. Push Shard 1</text>

                    <line x1="150" y1="100" x2="640" y2="100" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#seqArrowExec)" />
                    <text x="525" y="95" fill="#cbd5e1" textAnchor="middle">2. Push Shard 2</text>

                    <line x1="400" y1="140" x2="160" y2="140" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#seqArrowExec)" />
                    <text x="275" y="135" fill="#cbd5e1" textAnchor="middle">3. Return Shard 1 Result</text>

                    {/* Node B drops offline */}
                    <text x="650" y="145" fill="#f43f5e" textAnchor="middle" fontWeight="bold">X Node B Timeout</text>

                    <line x1="150" y1="180" x2="390" y2="180" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#seqArrowExec)" />
                    <text x="275" y="175" fill="#cbd5e1" textAnchor="middle">4. Re-route Shard 2 to A</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Native Go Executor</h2>
            <CodeBlock language="go" title="internal/node/runtime/wazero_bridge.go">{`// Executes the compiled WASM within the Earth Mesh Cgroup
func (r *WazeroRuntime) CallWASM(ctx context.Context, action string, payload []byte) ([]byte, error) {
    // 1. Instantiate the module
    mod, err := r.runtime.InstantiateModule(ctx, r.compiledModule, r.config)
    if err != nil {
        return nil, fmt.Errorf("wasm instantiation failed: %w", err)
    }
    defer mod.Close(ctx)

    // 2. Allocate memory for payload
    malloc := mod.ExportedFunction("allocate")
    ptrRes, err := malloc.Call(ctx, uint64(len(payload)))
    ptr := uint32(ptrRes[0])

    // 3. Write payload to memory
    mod.Memory().Write(ctx, ptr, payload)

    // 4. Invoke target function
    actionFunc := mod.ExportedFunction(action)
    res, err := actionFunc.Call(ctx, uint64(ptr), uint64(len(payload)))
    
    // 5. Read result back
    // ...
    return readMem, nil
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>OOM (Out of Memory):</strong> If the WASM binary attempts to allocate more memory than the <code>RAM</code> bound permits, the Wazero runtime instantly traps with an <code>OutOfMemory</code> error. The Node returns a <code>Fault</code> to the Orchestrator.</li>
                <li><strong>Quorum Mismatch:</strong> In the Space Mesh, if 3 operators return Result A for a shard, but 1 operator returns Result B, the <code>reduce_strategy: quorum</code> logic drops Result B, slashes the malicious operator, and accepts Result A.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p>
                <strong>Invariant:</strong> State cannot bleed between executions. Every invocation of <code>CallWASM</code> instantiates a completely fresh Wazero sandbox. Memory is initialized from zero. Even if two jobs run sequentially on the same Earth Node, they share no memory state.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p>
                Earth Mesh synchronous workloads operate under extreme performance bounds:
                <ul>
                    <li><strong>Context Switching:</strong> None. Handlers are compiled as native Go goroutines.</li>
                    <li><strong>Memory Overhead:</strong> Wazero sandbox initialization adds roughly <code>~1MB</code> of baseline overhead per invocation.</li>
                    <li><strong>Throughput:</strong> A standard Tier-1 Earth Operator handles upwards of 5,000 synchronous executions per second.</li>
                </ul>
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400">Ensure the daemon has rootless access to Linux cgroups to enforce the RAM bounds effectively. Space operators must ensure highly durable queue connectivity.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400">Handle partial states. If building for the Space Mesh, assume any shard can fail or be retried multiple times. Design idempotent WASM logic.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <p>The Execution Model emits granular span data:</p>
            <CodeBlock language="json" title="Execution Span">{`{
  "trace_id": "req_8x7c6v5b",
  "spans": [
    { "name": "queue_latency", "duration_ms": 12 },
    { "name": "wasm_instantiate", "duration_ms": 8 },
    { "name": "wasm_execute", "duration_ms": 142 }
  ]
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p>
                The Execution Model binds the Orchestrator, the Node Operator, and the Wazero Runtime. The Orchestrator routes; the Node manages OS-level resources; the Wazero Runtime executes the logic.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Earth Mesh Heavy Compute">
                Do not schedule heavy cryptographic permutations on the Earth Mesh. A 10-second blocking operation will trigger the Orchestrator's internal TCP timeouts, resulting in a dropped connection and degraded operator score. Move heavy compute to the Space Mesh.
            </Callout>

        </>
    );
}
