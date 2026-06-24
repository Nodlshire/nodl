import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Sovereign Compute Mesh Overview`}</h1>
            
            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>Cryptographically verifiable deterministic isolation.</li>
                    <li>Strict zero-compilation constraint for edge node operators.</li>
                    <li>Guaranteed sub-10ms WASM initialization threshold.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">The Wnode architecture mandates a paradigm shift from traditional, stateful, imperative cloud infrastructure to a stateless, declarative, and cryptographically deterministic compute execution model. Legacy centralized cloud environments introduce unacceptable single points of failure and trust assumptions. By contrast, the Sovereign Compute Mesh establishes a horizontally scalable, verifiable network topology that inherently resists censorship and hardware faults. [TBD: WEX staking, rewards, and full economics (Phase 3)]</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">spec.yaml → CI validation pipeline → generate_all toolchain → TinyGo compiler → WASM binary → Ed25519 cryptographic signature → Immutable Artifact Registry → Orchestrator routing layer → Earth/Space Mesh execution → Wazero runtime → Quorum consensus → Final Settlement.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`// Orchestrator Execution Pipeline Entrypoint
func Execute(ctx context.Context, artifactHash string) error {
  // Enforce zero-compilation rule and invoke Wazero runtime
  return runtime.Invoke(artifactHash, runtime.WithMemoryLimit(64))
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">If an operator deliberately or accidentally modifies the local Wazero runtime behavior or mutates the shared memory space, the resulting execution hash will deterministically mismatch the required Quorum. This results in an immediate cryptographic slash against the operator [TBD: Reputation score reduction + cooldown periods].</p>
            
            <div className="my-[24px] p-[12px] bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                <h4 className="text-[14px] font-bold text-amber-500 mb-[4px] uppercase tracking-wider">Warning</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">Uncaught panics within the WASM payload yield an immediate 422 Quorum Rejection and trigger automated Operator slashing [TBD: Reputation score reduction + cooldown periods].</p>
            </div>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">1. Strict resource and memory isolation enforced via the Wazero runtime sandbox. 2. Immutable, append-only deployments managed via the centralized Artifact Registry. 3. Zero-compilation rule strictly enforced for all participating node operators.</p>
            
            <div className="my-[24px] p-[12px] bg-[#3b82f6]/10 border-l-4 border-[#3b82f6] rounded-r-lg">
                <h4 className="text-[14px] font-bold text-[#3b82f6] mb-[4px] uppercase tracking-wider">Info</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">64-page memory bounds (4MB) and 2MB maximum artifact limits apply universally across all nodes in the Sovereign Mesh.</p>
            </div>

            {/* 7. Telemetry */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Telemetry</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">json</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`{
  "event": "mesh_route_dispatched",
  "artifact_hash": "sha256:7f83b1657ff...",
  "target_mesh_zone": "earth",
  "latency_budget_ms": 10
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Operators maintain persistent interaction with the global Orchestrator over secure, multiplexed WSS channels. Execution RAM is strictly and synchronously zeroed post-execution utilizing memory-wipe equivalents to prevent cross-job data leakage. Telemetry is cached transiently at the edge and selectively persisted by the Orchestrator. Direct P2P communication between operators is permanently disabled at the protocol level to eliminate Sybil attack vectors.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Always utilize the official CI pipeline's `generate_all` macro instead of attempting to manually construct or assemble WASM payloads, ensuring cryptographic signatures align perfectly with the source definitions.</p>

            {/* 10. Appendix */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Appendix: Global Constraints</h2>
            <div className="mt-[24px] mb-[24px] overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800">
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Constraint Vector</th>
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Bound/Policy</th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-slate-300 divide-y divide-slate-800">
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">WASM Sandbox</td>
                            <td className="p-[12px]">WASM binary size = 2MB max. WASM memory = 64-pages (4MB). Cold start {"<"}10ms. Execution timeout = declared in spec.yaml.</td>
                        </tr>
                        <tr className="bg-slate-900/30 hover:bg-slate-900/50">
                            <td className="p-[12px]">Determinism</td>
                            <td className="p-[12px]">No network access (ErrNoSys). No RNG, no time, no syscalls.</td>
                        </tr>
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Security Envelope</td>
                            <td className="p-[12px]">Ed25519 payload signatures, HMAC ingress</td>
                        </tr>
                        <tr className="bg-slate-900/30 hover:bg-slate-900/50">
                            <td className="p-[12px]">Node Operations</td>
                            <td className="p-[12px]">Zero-compilation rule, cgroups required</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            {/* Placeholder Diagram */}
            <div className="mt-[32px] mb-[16px] p-[24px] bg-slate-900 border border-slate-700 border-dashed rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-mono text-[14px]">[ Placeholder: Global Architecture Diagram ]</span>
            </div>

        </div>
    );
}
