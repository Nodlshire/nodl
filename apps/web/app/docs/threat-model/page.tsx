import React from 'react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function ThreatModel() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Threat Model & Guarantees</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    A comprehensive analysis of adversarial vectors targeting the Wnode Mesh and the cryptographic invariants mitigating them.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Threat Model & Guarantees Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Threat Model & Guarantees within the Wnode mesh.
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
                Securing a centralized database requires a perimeter firewall. Securing a decentralized compute mesh requires mitigating attacks from <em>within</em> the perimeter. Node Operators have physical root access to the machines executing the network's code.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> We assume every Node Operator is a highly sophisticated, well-funded adversary attempting to extract value, spoof executions, or disrupt network routing. The Threat Model explicitly defines these vectors and the architectural walls preventing them.
            </p>

            <h2 id="architecture-diagram">Adversarial Topology</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowThreat" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                        </marker>
                    </defs>
                    
                    {/* DApp Side */}
                    <rect x="50" y="50" width="150" height="60" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                    <text x="125" y="75" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Malicious Client</text>
                    <text x="125" y="95" fill="#f59e0b" fontSize="10" textAnchor="middle">(Replay / Sybil)</text>

                    {/* Orchestrator */}
                    <rect x="300" y="130" width="200" height="90" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                    <text x="400" y="160" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Orchestrator Core</text>
                    <text x="400" y="180" fill="#94a3b8" fontSize="10" textAnchor="middle">Only trusted component.</text>
                    <text x="400" y="195" fill="#94a3b8" fontSize="10" textAnchor="middle">Never executes code.</text>

                    <path d="M 125 110 L 125 175 L 290 175" fill="none" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrowThreat)" />
                    <rect x="180" y="160" width="80" height="30" fill="#0f172a" stroke="#f43f5e" />
                    <text x="220" y="178" fill="#f43f5e" fontSize="10" textAnchor="middle">DDoS API</text>

                    {/* Node Operator */}
                    <rect x="600" y="240" width="150" height="60" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                    <text x="675" y="265" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Rogue Operator</text>
                    <text x="675" y="285" fill="#f59e0b" fontSize="10" textAnchor="middle">(Memory Read / Spoof)</text>

                    <path d="M 675 240 L 675 175 L 510 175" fill="none" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrowThreat)" />
                    <rect x="540" y="160" width="100" height="30" fill="#0f172a" stroke="#f43f5e" />
                    <text x="590" y="178" fill="#f43f5e" fontSize="10" textAnchor="middle">Fake Telemetry</text>

                    <path d="M 600 270 L 400 270 L 400 230" fill="none" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrowThreat)" />
                    <rect x="420" y="255" width="100" height="30" fill="#0f172a" stroke="#f43f5e" />
                    <text x="470" y="273" fill="#f43f5e" fontSize="10" textAnchor="middle">Spoof Quorum</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Mitigation: Telemetry Spoofing</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 200" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowThreat" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    <line x1="200" y1="50" x2="200" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="600" y1="50" x2="600" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="150" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="200" y="40" fill="white" textAnchor="middle" fontWeight="bold">Rogue Operator</text>

                    <rect x="550" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                    <text x="600" y="40" fill="white" textAnchor="middle" fontWeight="bold">Orchestrator Heuristics</text>

                    <line x1="200" y1="80" x2="590" y2="80" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#seqArrowThreat)" />
                    <text x="400" y="75" fill="#f43f5e" textAnchor="middle">1. Emits fake WSS Heartbeat (Latency: 0ms)</text>

                    <rect x="585" y="100" width="30" height="40" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                    <text x="575" y="115" fill="#94a3b8" textAnchor="end">2. Compares to known TCP RTT (45ms)</text>
                    <text x="575" y="130" fill="#10b981" textAnchor="end">3. Lie detected. Flag identity.</text>

                    <line x1="600" y1="160" x2="210" y2="160" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowThreat)" />
                    <text x="400" y="155" fill="#cbd5e1" textAnchor="middle">4. WSS Connection Terminated</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Cryptographic Guarantees</h2>
            <CodeBlock language="go" title="internal/routing/quorum.go">{`// Quorum reduction requires strict mathematical thresholds
func CalculateQuorum(results []ShardResult, requiredThreshold int) (string, error) {
    hashes := make(map[string]int)
    
    for _, res := range results {
        hashes[res.OutputHash]++
        // If a hash reaches the threshold, the quorum is solved
        if hashes[res.OutputHash] >= requiredThreshold {
            return res.OutputHash, nil
        }
    }
    
    // An attacker operating 49% of the nodes for a given shard cannot force a fake result
    // if the requiredThreshold is > 50%
    return "", errors.New("quorum failed: severe network divergence")
}`}</CodeBlock>

            <h2 id="failure-modes">Threat Vectors & Mitigations</h2>
            <ul>
                <li><strong>Vector: Malicious Execution Sandbox Escape.</strong> An attacker crafts a Native Go payload designed to exploit SECCOMP Sandbox and gain root on the Operator machine. <br/><strong>Mitigation:</strong> SECCOMP Sandbox is written in pure Go without CGO. There are no buffer overflows or memory unsafety issues common in C/C++ runtimes. Host system access is explicitly zeroed out at initialization.</li>
                <li><strong>Vector: Sybil Quorum Spoofing.</strong> An attacker registers 1,000 fake nodes to flood a Space Mesh MapReduce job and force a fake quorum hash. <br/><strong>Mitigation:</strong> Node registration requires staking or authorized DeviceTokens. The DAG router explicitly selects geographically and topologically distant nodes for the same shard to prevent localized Sybil routing.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> The Orchestrator is the absolute boundary of trust. The DApp trusts the Orchestrator to validate signatures. The Operator trusts the Orchestrator to route safe Native Go payloads. 
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Heuristic validation (detecting telemetry lies or DAG manipulation) runs entirely out-of-band via asynchronous background workers inside the Orchestrator. Threat mitigation adds zero latency to the critical execution path.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Do not attempt to reverse engineer payloads. If you inspect memory buffers to extract DApp data, you break the implicit contract. Traffic is monitored for packet manipulation.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Encrypt PII before sending it into the mesh. While operators are sandboxed, memory is technically readable at the OS root level. Use asymmetric encryption for sensitive payloads.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <CodeBlock language="json" title="Sybil Detection Alert">{`{
  "event": "threat_detected",
  "threat_type": "sybil_quorum_attempt",
  "job_id": "job_1001",
  "banned_nodes": ["0x1", "0x2", "0x3"],
  "action_taken": "shard_reassigned"
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The Threat Model touches the ingress API (DDoS protection), the DAG Router (Sybil protection), the Node Daemon (Cgroups), and the Execution Engine (SECCOMP Sandbox sandboxing).
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="security" title="Zero Trust Data">
                Wnode does not provide data confidentiality from Operators. It provides execution integrity. If you route a payload containing plain-text passwords, a rogue operator with root access to their own bare-metal server can read it via RAM dumping. Always encrypt sensitive fields.
            </Callout>

        </>
    );
}
