import React from 'react';
import Callout from '../../../../components/docs/Callout';
import CodeBlock from '../../../../components/docs/CodeBlock';

export default function RuntimeTelemetry() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Runtime Telemetry</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    Deterministic, continuous observability. The nervous system of the Wnode Mesh providing automated auto-healing and penalty slashing.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Runtime Telemetry Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Runtime Telemetry within the Wnode mesh.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">WHY IT MATTERS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Architectural Purpose</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Ensures zero-custody verification, high-throughput execution, and fault-tolerant node consensus across Earth &amp; Space mesh topologies.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-purple-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">HOW IT OPERATES</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Native Go Engine</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Executed via SECCOMP-restricted Native Go modules (`linux-amd64`), validated with mTLS telemetry signatures and HMAC routing epochs.
                    </p>
                </div>
            </div>

            </div>

            <h2 id="conceptual-overview">Conceptual Overview & Rationale</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                In standard web applications, telemetry is used by human engineers to debug errors on dashboards. In the Wnode Sovereign Mesh, telemetry is primarily consumed by <strong>machines</strong>. 
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> The Orchestrator requires real-time, high-fidelity data regarding the CPU pressure, memory usage, and task execution times of every Node Operator globally. This data is used to dynamically weight the DAG routing table. A node experiencing high memory pressure will automatically receive fewer payloads.
            </p>

            <h2 id="architecture-diagram">Telemetry Aggregation Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowTel" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
                        </marker>
                    </defs>
                    
                    {/* Nodes */}
                    <rect x="50" y="50" width="120" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="110" y="75" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Earth Node A</text>

                    <rect x="50" y="120" width="120" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="110" y="145" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Earth Node B</text>

                    <rect x="50" y="240" width="120" height="40" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
                    <text x="110" y="265" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Space Node A</text>

                    {/* WebSocket pipes */}
                    <path d="M 170 70 C 230 70, 230 150, 300 150" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrowTel)" />
                    <path d="M 170 140 C 230 140, 230 150, 300 150" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrowTel)" />
                    <path d="M 170 260 C 230 260, 230 150, 300 150" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="4 4" markerEnd="url(#arrowTel)" />
                    
                    <text x="230" y="130" fill="#a78bfa" fontSize="10" textAnchor="middle">WebSocket (5s ticks)</text>

                    {/* Aggregator */}
                    <rect x="310" y="110" width="180" height="80" rx="8" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
                    <text x="400" y="140" fill="#8b5cf6" fontSize="14" fontWeight="bold" textAnchor="middle">Orchestrator</text>
                    <text x="400" y="160" fill="white" fontSize="12" textAnchor="middle">Telemetry Aggregator</text>

                    <path d="M 490 150 L 580 150" fill="none" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#arrowTel)" />

                    {/* Heuristics Engine */}
                    <rect x="590" y="110" width="150" height="80" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                    <text x="665" y="140" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Routing Engine</text>
                    <text x="665" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">Adjusts DAG weights</text>
                    <text x="665" y="175" fill="#94a3b8" fontSize="10" textAnchor="middle">based on faults</text>

                </svg>
            </div>

            <h2 id="sequence-diagram">Auto-Healing Degradation Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowTel" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#8b5cf6" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="650" y1="50" x2="650" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">Node Operator</text>

                    <rect x="600" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                    <text x="650" y="40" fill="white" textAnchor="middle" fontWeight="bold">Orchestrator</text>

                    <rect x="135" y="60" width="30" height="30" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                    <text x="125" y="75" fill="#94a3b8" textAnchor="end">Spike in memory usage (95%)</text>

                    <line x1="150" y1="110" x2="640" y2="110" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#seqArrowTel)" />
                    <text x="400" y="105" fill="#cbd5e1" textAnchor="middle">1. Heartbeat {"{ status: DEGRADED, ram: 95% }"}</text>

                    <rect x="635" y="130" width="30" height="30" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                    <text x="625" y="145" fill="#94a3b8" textAnchor="end">2. Lower routing weight</text>

                    <line x1="150" y1="190" x2="640" y2="190" stroke="#8b5cf6" strokeWidth="2" markerEnd="url(#seqArrowTel)" />
                    <text x="400" y="185" fill="#cbd5e1" textAnchor="middle">3. T+5s Heartbeat {"{ status: HEALTHY, ram: 40% }"}</text>
                    
                    <text x="625" y="215" fill="#10b981" textAnchor="end">4. Restore routing weight</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Telemetry Injection (nodegen)</h2>
            <CodeBlock language="go" title="internal/node/jobs/generated/telemetry.go">{`// Auto-injected by nodegen based on spec.yaml requirements
func (h *TaskHandler) Execute(ctx context.Context, payload []byte) ([]byte, error) {
    start := time.Now()
    
    res, err := h.Runtime.CallNative("execute", payload)
    
    // Deterministic Hook
    latency := time.Since(start).Milliseconds()
    if err != nil {
        telemetry.Stream.Push(telemetry.ExecutionSpan{
            JobID:    h.JobID,
            Status:   "FAULT",
            Latency:  latency,
            Error:    err.Error(),
        })
        return nil, err
    }
    
    telemetry.Stream.Push(telemetry.ExecutionSpan{
        JobID:   h.JobID,
        Status:  "SUCCESS",
        Latency: latency,
    })
    return res, nil
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>WebSocket Drop:</strong> If the 5-second WebSocket heartbeat connection drops, the Orchestrator marks the node as <code>OFFLINE</code> instantly. Any synchronous execution routed to it is aborted, and MapReduce shards are re-queued.</li>
                <li><strong>Malicious Reporting:</strong> If a Node Operator manually hacks the daemon to always report <code>0ms</code> latency to gain favorable routing, the Orchestrator's internal benchmarking tasks (which measure end-to-end latency) will detect the lie and permanently ban the <code>DeviceToken</code>.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> Telemetry is one-way. Node Operators push state to the Orchestrator. The Orchestrator never pushes arbitrary commands back down the telemetry pipe. The pipe is strictly typed using Protocol Buffers or JSON schemas.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Heartbeats are tiny. A standard node heartbeat payload is <code>~250 bytes</code>. Sent every 5 seconds, this utilizes roughly <code>4kb/minute</code> of bandwidth, making it highly suitable for Tier-3 Space Operators running on metered satellite uplinks.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Ensure outward-bound TCP connectivity over WSS (WebSocket Secure). Do not block egress traffic on port 443, or the Orchestrator will assume the node is offline.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Developers do not interact with telemetry APIs. The generative substrate handles it all natively based on your <code>spec.yaml</code> constraints.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <CodeBlock language="json" title="Orchestrator Routing Decision">{`{
  "event": "routing_decision",
  "node_id": "0xabc123",
  "action": "weight_reduction",
  "reason": "cgroup_memory_pressure > 90%",
  "timestamp": 1698274500000
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Telemetry is the glue binding the execution layer to the routing layer. Node Operators report physical limits to the Orchestrator, which uses that data to safeguard the network against localized outages.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Ignoring Limits">
                Operating a node with 4GB of RAM while advertising support for 16GB integration workloads will immediately trigger cgroup faults, resulting in a <code>DEGRADED</code> status within 5 seconds of receiving the first workload.
            </Callout>
        </>
    );
}
