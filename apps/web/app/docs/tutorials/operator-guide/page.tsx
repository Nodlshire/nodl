import React from 'react';
import Callout from '../../../../components/docs/Callout';
import CodeBlock from '../../../../components/docs/CodeBlock';

export default function OperatorGuide() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Node Operator Guide</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    Operating the physical backbone of the Wnode Sovereign Mesh. Hardware constraints, daemon management, and security responsibilities.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Node Operator Guide Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Node Operator Guide within the Wnode mesh.
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
                In many blockchain networks, running a node requires syncing a massive historical ledger (often 1TB+ of data) just to verify a single transaction. This prices out standard hardware operators.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> Wnode is a compute mesh, not a storage ledger. Node Operators are entirely stateless. The only state a node stores is the compiled AST logic of the current integrations. This allows Wnode operators to spin up, authenticate, and begin routing paid tasks in under 60 seconds on standard NVMe hardware.
            </p>

            <h2 id="architecture-diagram">Operator Hardware Archetypes</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowOp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="50" width="300" height="250" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="200" y="80" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Earth Mesh (Tier-1)</text>

                    <rect x="100" y="110" width="200" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="200" y="135" fill="#10b981" fontSize="12" textAnchor="middle">Bare-Metal (No VMs)</text>

                    <rect x="100" y="170" width="200" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="200" y="195" fill="#10b981" fontSize="12" textAnchor="middle">10Gbps+ Fiber</text>

                    <rect x="100" y="230" width="200" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="200" y="255" fill="#10b981" fontSize="12" textAnchor="middle">Cgroups v2 Enabled</text>


                    <rect x="450" y="50" width="300" height="250" rx="8" fill="#1e293b" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="600" y="80" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Space Mesh (Tier-3)</text>

                    <rect x="500" y="110" width="200" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="600" y="135" fill="#f43f5e" fontSize="12" textAnchor="middle">Edge / Satellite</text>

                    <rect x="500" y="170" width="200" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="600" y="195" fill="#f43f5e" fontSize="12" textAnchor="middle">Tolerates Packet Loss</text>

                    <rect x="500" y="230" width="200" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="600" y="255" fill="#f43f5e" fontSize="12" textAnchor="middle">High Durable Queue</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Daemon Initialization Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowOp" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="650" y1="50" x2="650" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">Operator</text>

                    <rect x="600" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                    <text x="650" y="40" fill="white" textAnchor="middle" fontWeight="bold">Orchestrator</text>

                    <line x1="150" y1="80" x2="640" y2="80" stroke="#10b981" strokeWidth="2" markerEnd="url(#seqArrowOp)" />
                    <text x="400" y="75" fill="#cbd5e1" textAnchor="middle">1. Run nodld register (Generate Identity)</text>

                    <line x1="650" y1="120" x2="160" y2="120" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowOp)" />
                    <text x="400" y="115" fill="#cbd5e1" textAnchor="middle">2. Return DeviceToken & Substrate Hash</text>

                    <rect x="135" y="140" width="30" height="40" fill="#10b981" fillOpacity="0.2" stroke="#10b981" />
                    <text x="175" y="155" fill="#94a3b8" textAnchor="start">3. Git pull Substrate Hash</text>
                    <text x="175" y="170" fill="#94a3b8" textAnchor="start">4. Compile native Go Handlers</text>

                    <line x1="150" y1="210" x2="640" y2="210" stroke="#10b981" strokeWidth="2" markerEnd="url(#seqArrowOp)" />
                    <text x="400" y="205" fill="#cbd5e1" textAnchor="middle">5. Connect WebSocket Heartbeat</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Daemon Configuration</h2>
            <CodeBlock language="yaml" title="/etc/wnode/config.yaml">{`identity:
  device_token: "wtk_8x7c6v5b4n3m..." # KEEP SECRET
  archetype: "earth_tier_1"

system:
  cgroup_root: "/sys/fs/cgroup/wnode"
  max_parallel_jobs: 5000
  
network:
  orchestrator_wss: "wss://mesh.wnode.one/telemetry"
  bind_port: 8443`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Cgroup Permission Denied:</strong> If the <code>nodld</code> daemon is run without the proper rootless cgroup delegation, it will fail to initialize. The daemon will refuse to connect to the Orchestrator, protecting the host machine from unbound resource exhaustion.</li>
                <li><strong>Slashing:</strong> If a Space Operator modifies the <code>generated.go</code> handler to return a fake MapReduce result (attempting to claim rewards without doing the compute work), the Orchestrator's Quorum anchor will flag the discrepancy. The operator's <code>DeviceToken</code> will be permanently banned.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> Your host machine is insulated from the payloads you execute. Go Sandbox prevents filesystem access, and Linux cgroups prevent CPU/RAM starvation. An integration cannot "break out" of the node logic to access your root file system.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Operators are paid based on compute volume and latency. A properly tuned Tier-1 bare-metal server (e.g. AMD EPYC, 128GB RAM) can saturate a 10Gbps line with thousands of synchronous Go Sandbox executions per second, maximizing reward yield.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Never manually update the substrate repo. Let <code>nodld</code> handle the git hooks. Monitor your own bandwidth—if your ISP throttles you, your latency will spike and the Orchestrator will reduce your workload.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">(N/A for this page, developers rely on the operators to maintain uptime.)</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <CodeBlock language="json" title="Daemon Startup Telemetry">{`{
  "event": "daemon_init",
  "hardware": {
    "cores": 64,
    "ram_total_gb": 128,
    "cgroup_v2_enabled": true
  },
  "substrate_hash": "0xabc123"
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The Node Operator is the physical muscle. It listens to the Orchestrator for workloads, uses the Substrate definitions to constrain execution, and emits Telemetry back to the Orchestrator to maintain routing health.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: VM Nesting">
                Do not run Earth Mesh nodes inside heavily virtualized instances (e.g. AWS t3.micro). The CPU steal time applied by hypervisors will ruin your execution latency, causing the Orchestrator to deprioritize your node. Bare-metal is strictly required for Tier-1.
            </Callout>
        </>
    );
}
