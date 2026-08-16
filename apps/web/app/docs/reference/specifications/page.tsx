import React from 'react';
import Callout from '../../../../components/docs/Callout';
import CodeBlock from '../../../../components/docs/CodeBlock';

export default function Specifications() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Integration Specifications</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    The declarative schema acting as the absolute source of truth for the Orchestrator, Node Operators, and CI/CD pipelines.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Integration Specifications Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Integration Specifications within the Wnode mesh.
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
                A <code>spec.yaml</code> is not simply a configuration file; it is a rigid cryptographic contract. It defines precisely how much computational power an integration is allowed to consume, how its payloads must be shaped, and what network vectors it can access.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> By making the specification declarative and strictly typed, we eliminate whole classes of bugs—memory leaks from unbounded loops, unexpected API shapes from third-party clients, and rogue nodes allocating excessive compute to a single task. The specification guarantees that every participant on the mesh knows exactly what to expect before execution begins.
            </p>

            <h2 id="architecture-diagram">Specification Ingestion Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowSpec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="150" width="150" height="60" rx="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                    <text x="125" y="185" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">spec.yaml</text>

                    <path d="M 200 180 L 260 180" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSpec)" />

                    <rect x="270" y="80" width="260" height="200" rx="8" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="400" y="110" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">Schema Verification Phase</text>

                    <rect x="300" y="140" width="200" height="40" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                    <text x="400" y="165" fill="#10b981" fontSize="12" textAnchor="middle">Type & Bounds Check</text>

                    <rect x="300" y="200" width="200" height="40" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                    <text x="400" y="225" fill="#10b981" fontSize="12" textAnchor="middle">Cryptographic Hash Anchor</text>

                    <path d="M 530 180 L 590 180" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSpec)" />

                    <rect x="600" y="120" width="150" height="40" rx="4" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                    <text x="675" y="145" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Orchestrator DB</text>

                    <rect x="600" y="200" width="150" height="40" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                    <text x="675" y="225" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Node DHT Sync</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Version Upgrade Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowSpec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="650" y1="50" x2="650" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">GitHub PR</text>

                    <rect x="600" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="650" y="40" fill="white" textAnchor="middle" fontWeight="bold">Node Operator</text>

                    <line x1="150" y1="80" x2="640" y2="80" stroke="#10b981" strokeWidth="2" markerEnd="url(#seqArrowSpec)" />
                    <text x="400" y="75" fill="#cbd5e1" textAnchor="middle">1. Broadcast spec.yaml v1.1.0 (Increased RAM bound)</text>

                    <rect x="635" y="100" width="30" height="60" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                    <text x="625" y="125" fill="#94a3b8" textAnchor="end">2. Halt active jobs</text>
                    <text x="625" y="145" fill="#94a3b8" textAnchor="end">3. Expand cgroups</text>

                    <line x1="650" y1="180" x2="160" y2="180" stroke="#10b981" strokeWidth="2" markerEnd="url(#seqArrowSpec)" />
                    <text x="400" y="175" fill="#cbd5e1" textAnchor="middle">4. Emit "Ready v1.1.0" heartbeat</text>
                </svg>
            </div>

            <h2 id="real-code-examples">The YAML Definition</h2>
            <CodeBlock language="yaml" title="spec.yaml (Aave Liquidation Monitor)">{`id: "10001-aave-liq"
name: "Aave V3 Liquidation Monitor"
slug: "aave-liquidations"
category: "DeFi"
activation: "Active"
version: "2.1.0"
strict_mode: true

security:
  require_hmac: true
  hmac_secret_env: "AAVE_WEBHOOK_KEY"

job_template:
  action: "monitor_health_factor"
  priority: "critical"
  shard_count: 100
  native_target: "health_evaluator.native"
  
  node_job:
    execution_type: "native"
    timeout_ms: 1000
    required_resources:
      CPU: "4"
      RAM: "1024MB"
      
  space_job:
    sharding_strategy: "list"
    shard_size: 50
    max_shards: 100
    reduce_strategy: "quorum"
    fault_tolerance: "retry"`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Schema Validation Failure:</strong> If the <code>id</code> field does not match the strict Wnode format regex (e.g. <code>10001-aave-liq</code>), the CI pipeline halts and issues a build failure.</li>
                <li><strong>Resource Overallocation:</strong> If an author requests <code>RAM: 64GB</code>, the <code>intgen</code> compiler checks the request against the global maximum thresholds. It rejects excessive requests to prevent targeted DDoS exhaustion of Node Operators.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> The <code>hmac_secret_env</code> is just a string reference. The actual secret is NEVER stored in the repo or the YAML. It references a secure environment variable securely injected into the Orchestrator runtime via Kubernetes Secrets or AWS Secrets Manager.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Because YAML parsing is relatively slow (compared to JSON), the Orchestrator never parses YAML at runtime. <code>intgen</code> compiles the YAML into <code>integration.json</code> during CI/CD, allowing the Orchestrator to load schemas into memory in <code>O(1)</code> time using Go's <code>encoding/json</code> with pre-allocated structs.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Trust the spec. The Orchestrator guarantees the spec is valid before you receive it. Rely on the <code>required_resources</code> to schedule your container/cgroup bounds.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Profile your Native Go binary locally. If you specify <code>RAM: 128MB</code> in the YAML but your Go logic allocates an array of 200MB, the Node Operator will instantly kill your job.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <p className="text-slate-300 leading-relaxed mb-6">During the ingestion of a spec, the Orchestrator logs:</p>
            <CodeBlock language="json" title="Orchestrator Spec Ingestion Log">{`{
  "event": "spec_loaded",
  "integration_id": "10001-aave-liq",
  "version": "2.1.0",
  "hash": "0x123abc...",
  "nodes_synchronized": 451
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The `spec.yaml` influences every single component. It generates the TS SDK, defines the Go Sandbox bounds for the Operator, shapes the DAG routing table for the Orchestrator, and sets the CI/CD pipeline tests.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Magic Strings">
                Do not use generic IDs. <code>id: "my_job"</code> will be rejected. Always follow the canonical format: <code>[PREFIX]-[NAMESPACE]-[VERSION]-[SUFFIX]</code>.
            </Callout>
            <Callout type="best-practice" title="Best Practice: Semantic Versioning">
                Any change to <code>required_resources</code> or <code>timeout_ms</code> MUST correspond to a bump in the <code>version</code> field, otherwise Node Operators will fail to update their local bounds.
            </Callout>
        </>
    );
}
