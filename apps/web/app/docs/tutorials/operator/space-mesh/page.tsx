import React from 'react';

export default function Page() {
    return (
        <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-6">Wnode Enterprise Architecture Specification</h1>
            
            
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Wnode Enterprise Architecture Specification Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Wnode Enterprise Architecture Specification within the Wnode mesh.
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
<h2 id="architecture-overview" className="text-2xl font-semibold mt-8 mb-4">Architecture Overview</h2>
            <p className="text-slate-300 leading-relaxed mb-6">The Wnode Sovereign Mesh is a deterministic, verifiable, and auto-scaling compute substrate. It executes immutable, signed Native Go and Go artifacts deployed across a decentralized network. The network features a stateless, horizontally scalable orchestrator layer, local ingress validation via signed routing epochs, capability-based Native Go execution, hardened mTLS telemetry with signed envelopes, and a multi-dimensional reputation and grace system for node reliability.</p>

            <h2 id="conceptual-overview" className="text-2xl font-semibold mt-8 mb-4">Conceptual Overview</h2>
            <p className="text-slate-300 leading-relaxed mb-6">Wnode utilizes a strictly generative Substrate Model rather than traditional container orchestration. By compiling a declarative <code>spec.yaml</code> into an immutable, deterministic artifact, Wnode guarantees identical execution environments globally. This deterministic execution, combined with capability-based host extensions, balances absolute safety with practical utility. Distributing signed routing epochs to nodes for local validation removes central bottlenecks, allowing the orchestrator to scale horizontally without becoming a Single Point of Failure (SPOF).</p>

            <h2 id="global-architecture" className="text-2xl font-semibold mt-8 mb-4">Global Architecture Diagram</h2>
            <div className="my-8 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 p-2">
    <img src="/diagrams/space-mesh-overview.png" alt="Wnode Architecture Diagram" className="w-full h-auto rounded-xl" />
</div>

            <h2 id="execution-flow" className="text-2xl font-semibold mt-8 mb-4">Execution Sequence Flow</h2>
            <ol className="list-decimal pl-6 space-y-2">
                <li>Client sends an HMAC-signed request to the mesh.</li>
                <li>Node validates the request locally using the cached routing epoch.</li>
                <li>Node executes the Native Go payload with strict capability enforcement.</li>
                <li>Node emits a cryptographically signed telemetry envelope.</li>
                <li>Node returns the encrypted execution result to the client.</li>
            </ol>

            <h2 id="core-artifacts" className="text-2xl font-semibold mt-8 mb-4">Core Artifacts</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>spec.yaml:</strong> The declarative target defining resources and capabilities (e.g., HTTPS and DB bindings).</li>
                <li><strong>Generated Go Handler:</strong> The strict execution boundary enforcing timeouts and cgroups.</li>
                <li><strong>Native Go Runtime:</strong> The Go Sandbox sandbox isolating memory and executing logic.</li>
                <li><strong>Capability Registry:</strong> The daemon-side enforcer of spec.yaml bindings.</li>
                <li><strong>Routing Epoch Structure:</strong> The signed payload containing allowed routes and HMAC secrets.</li>
            </ul>

            <h2 id="failure-modes" className="text-2xl font-semibold mt-8 mb-4">Failure Modes & Error Handling</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Epoch Expiration:</strong> Nodes reject ingress traffic safely until a new signed epoch is fetched.</li>
                <li><strong>Capability Rejection:</strong> Unauthorized I/O attempts instantly trap the Native Go call.</li>
                <li><strong>Native Go Sandbox Traps:</strong> Panics within the module are securely trapped without affecting the host.</li>
                <li><strong>Grace-Based Reputation Decay:</strong> Nodes experience continuous score decay rather than instant slashing for transient failures.</li>
                <li><strong>Offline Operation:</strong> Nodes continue to process tasks utilizing cached routing epochs during orchestrator downtime.</li>
            </ul>

            <h2 id="security-boundaries" className="text-2xl font-semibold mt-8 mb-4">Security Boundaries & Invariants</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Deterministic Native Go execution in an air-gapped memory sandbox.</li>
                <li>Capability-scoped outbound I/O enforced by the daemon.</li>
                <li>Cryptographically signed artifacts and routing epochs.</li>
                <li>mTLS-secured telemetry transport.</li>
                <li>Hardware-bound node identity keys for absolute proof of execution.</li>
            </ul>

            <h2 id="performance-characteristics" className="text-2xl font-semibold mt-8 mb-4">Performance Characteristics</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Local Ingress Validation Latency:</strong> &lt; 1ms overhead for local HMAC checks.</li>
                <li><strong>Native Go Cold Start:</strong> &lt; 10ms utilizing pre-compiled runtime caches.</li>
                <li><strong>Capability Overhead:</strong> &lt; 2ms penalty for bridging host-function capabilities.</li>
                <li><strong>Epoch Refresh Intervals:</strong> Asynchronous refreshes occur entirely outside the execution critical path.</li>
            </ul>

            <h2 id="responsibilities" className="text-2xl font-semibold mt-8 mb-4">Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Operator:</strong> Maintain uptime, protect node identity keys securely, and ensure host OS cgroups and sandboxing features are enabled.</li>
                <li><strong>Developer:</strong> Define accurate <code>spec.yaml</code> manifests, explicitly declare required capabilities, and write deterministic Native Go logic.</li>
            </ul>

            <h2 id="telemetry" className="text-2xl font-semibold mt-8 mb-4">Telemetry Emitted</h2>
            <p className="text-slate-300 leading-relaxed mb-6">All telemetry utilizes mTLS transport and is cryptographically signed by the node's identity key. Envelopes include a monotonic sequence counter to prevent replay attacks. No plaintext logs are emitted.</p>

            <h2 id="cross-component-interactions" className="text-2xl font-semibold mt-8 mb-4">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">Nodes operate independently based on locally cached routing epochs. The orchestrator functions exclusively as a stateless, horizontally scalable routing table publisher and authenticated telemetry sink. Telemetry interaction is secured via mTLS.</p>

            <h2 id="best-practices" className="text-2xl font-semibold mt-8 mb-4">Best Practices & Anti-Patterns</h2>
            <ul className="list-disc pl-6 space-y-2">
                <li>Declare the absolute minimal required capabilities.</li>
                <li>Avoid nondeterministic logic inside Native Go modules.</li>
                <li>Use conservative timeouts to account for network variability.</li>
                <li>Do not modify the node environment manually; all configuration flows from the orchestrator.</li>
            </ul>
        </div>
    );
}
