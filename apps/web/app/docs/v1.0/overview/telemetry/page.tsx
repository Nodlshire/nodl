import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Overview: Telemetry`}</h1>
            
            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>Zero-overhead deterministic metric collection.</li>
                    <li>Asynchronous flushing to Orchestrator to prevent I/O blocking.</li>
                    <li>Strict schema validation on ingress to drop malformed data.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">In a globally distributed compute mesh, robust observability is critical for SLA enforcement and network health. However, telemetry collection must be decoupled from the synchronous execution path to maintain strict sub-10ms determinism guarantees. Our telemetry infrastructure employs a non-blocking transient cache that persists selectively via the Orchestrator.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">WASM Execution concludes → Host extracts metrics (duration, memory peaks) → Operator pushes to local ring buffer → Async flush to Orchestrator over WSS → Aggregation and persistence.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`// Asynchronous Telemetry Flush
func FlushTelemetry(metrics []MetricEvent) {
  // Fire and forget via WSS multiplex
  go wssClient.Transmit(SchemaTopicMetrics, metrics)
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Telemetry loss due to operator disconnection is tolerated in the architecture. Core execution limits and timeouts (e.g. 10ms init bounds) are enforced synchronously on the node itself, meaning missing telemetry only impacts long-term aggregation, not immediate consensus integrity.</p>
            
            <div className="my-[24px] p-[12px] bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                <h4 className="text-[14px] font-bold text-amber-500 mb-[4px] uppercase tracking-wider">Warning</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">Uncaught panics yield an immediate 422 Quorum Rejection and Operator slashing [TBD: Reputation score reduction + cooldown periods].</p>
            </div>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Telemetry collection must NEVER block execution or cause a WASM context timeout. To guarantee this invariant, all metric gathering is managed by the host binary outside of the WASM sandbox.</p>
            
            <div className="my-[24px] p-[12px] bg-[#3b82f6]/10 border-l-4 border-[#3b82f6] rounded-r-lg">
                <h4 className="text-[14px] font-bold text-[#3b82f6] mb-[4px] uppercase tracking-wider">Info</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">64-page memory bounds and 2MB artifact limits apply universally across the Sovereign Mesh.</p>
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
  "metric_type": "job_execution_latency",
  "value_ms": 3.84,
  "node_id": "operator-v2-48xx",
  "wasi_traps": 0
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Telemetry is batched transiently at the operator level and flushed to the Orchestrator over WSS multiplex channels. The Orchestrator acts as the sole ingestion point, utilizing JSON schema validation to drop invalid payloads. P2P telemetry sharing is explicitly disabled.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Always utilize the CI pipeline's `generate_all` to build your WASM artifacts, as the system automatically instruments the code to emit zero-overhead telemetry without requiring developer intervention.</p>

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
                <span className="text-slate-500 font-mono text-[14px]">[ Placeholder: Telemetry Ingestion Architecture Diagram ]</span>
            </div>

        </div>
    );
}
