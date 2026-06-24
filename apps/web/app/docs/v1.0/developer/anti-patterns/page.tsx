import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Developer: Anti-Patterns`}</h1>
            
            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>Strict prohibition on standard library I/O packages (e.g. `net/http`, `os`).</li>
                    <li>Avoid heavy dependency trees that easily breach the 2MB compilation limit.</li>
                    <li>Internal Goroutines within WASM payloads are unsupported and blocked.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Because WASM binaries execute securely inside a deeply constrained Wazero sandbox across thousands of heterogeneous hardware operators, traditional Go paradigms fail. Writing code as if it runs on a standard Linux VPS will lead to immediate traps, compilation failures, and Quorum rejections.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Developer writes anti-pattern → Local `make build` attempts TinyGo Compilation → Process fails due to lack of WASI stub support OR Runtime Execution Traps with `ErrNoSys`.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#ef4444] leading-[1.5]"><code>{`// EXTREME ANTI-PATTERN: DO NOT DO THIS
func ProcessData() {
  // 1. Blocks execution and requires network (Traps with ErrNoSys)
  resp, _ := http.Get("https://api.exchange.com/price") 
  
  // 2. Relies on non-deterministic host time
  if time.Now().Hour() > 12 { return } 
  
  // 3. Spawns unsupported internal concurrency
  go performCalculation() 
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">If an anti-pattern circumvents compilation limits (e.g. generating heavy memory allocations just under the 64-page limit), it risks tripping the runtime OOM thresholds dynamically during live processing, resulting in the Orchestrator failing the job and alerting the client of a malformed integration structure.</p>
            
            <div className="my-[24px] p-[12px] bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                <h4 className="text-[14px] font-bold text-amber-500 mb-[4px] uppercase tracking-wider">Warning</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">Uncaught panics yield an immediate 422 Quorum Rejection and Operator slashing [TBD: Reputation score reduction + cooldown periods].</p>
            </div>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">The execution environment is single-threaded. Dependencies must be purely computational algorithms (math, string parsing, struct serialization) completely devoid of any operating system interactivity.</p>
            
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
  "event": "compilation_failure",
  "reason": "unsupported_package",
  "package_name": "net/http",
  "phase": "tinygo_target_wasi"
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Anti-patterns are blocked dynamically: heavy binaries are blocked by the Registry size limit, I/O is blocked by the TinyGo WASI compiler, and runtime bloat is trapped by the Operator daemon's Wazero configuration.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Rely heavily on the provided SDK wrappers. If a computation seems like it requires an HTTP call (like fetching a price feed), design the integration so the Orchestrator fetches the feed and injects it as an input parameter before WASM execution begins.</p>

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
                <span className="text-slate-500 font-mono text-[14px]">[ Placeholder: Anti-Pattern Trap Flow Diagram ]</span>
            </div>

        </div>
    );
}
