import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Protocol Deep-Dive: Error Codes`}</h1>
            
            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>Comprehensive catalog of deterministic traps, quorum faults, and networking errors.</li>
                    <li>Strict bifurcation between retryable orchestration errors and fatal runtime panics.</li>
                    <li>Slashing codes strictly define when operators lose staked WEX.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Because execution spans hundreds of disjointed nodes, diagnosing failures requires atomic precision. The error code catalog standardizes the communication of WASM traps, missing telemetry signatures, and deterministic quorum failures so that the SDK can seamlessly route automatic retries without confusing the end-user. Specific slashing codes guarantee transparent penalization for operators.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Fault Occurs at Edge → Daemon Wraps Error in JSON Envelope → Streams to Orchestrator → Orchestrator categorizes (e.g., Fatal vs Retryable) → Slashing logic applied if applicable (e.g., ERR_SLASH_DIVERGENCE) → Error propagated to Client API.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`// Error Categorization & Slashing Routing
func CategorizeError(errCode string) RetryPolicy {
  switch errCode {
  case "ERR_QUORUM_TIMEOUT", "ERR_RATE_LIMIT_429":
    return RetryPolicy{Retryable: true, Backoff: 100 * time.Millisecond}
  case "ERR_WASM_TRAP_OOM", "ERR_DETERMINISM_VIOLATION":
    return RetryPolicy{Retryable: false, SlashOperator: false}
  case "ERR_SIGNATURE_FORGED", "ERR_TELEMETRY_SPOOFED", "ERR_SLASH_DIVERGENCE":
    return RetryPolicy{Retryable: false, SlashOperator: true}
  default:
    return RetryPolicy{Retryable: false}
  }
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">If an integration causes a WASM memory panic (e.g., trying to allocate 70 pages when the limit is 64), the Wazero runtime returns a fatal `ERR_WASM_TRAP_OOM`. This is a strict non-retryable error, as executing the same deterministic payload will predictably crash the sandbox again. The client is charged for the failed compute cycle.</p>
            
            <div className="my-[24px] p-[12px] bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                <h4 className="text-[14px] font-bold text-amber-500 mb-[4px] uppercase tracking-wider">Warning</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">The `ERR_SLASH_DIVERGENCE` code is fatal for an operator. It signifies their output hash failed the 2/3 consensus check, triggering an automatic WEX stake burn.</p>
            </div>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Errors involving Ed25519 signature mismatches or telemetry spoofing (`ERR_SIGNATURE_FORGED`, `ERR_TELEMETRY_SPOOFED`) bypass the retry mechanism entirely and immediately trigger the Operator Slashing pipeline, completely burning their collateral stake.</p>
            
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
  "event": "execution_failed",
  "error_code": "ERR_SLASH_DIVERGENCE",
  "description": "Operator output hash drifted from the 2/3 majority mode",
  "retryable": false,
  "penalty_applied": true
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">When the Mesh Router issues a `429 Too Many Requests` (`ERR_RATE_LIMIT_429`), the Wnode SDK automatically catches the response and applies jittered exponential backoff before re-queueing the payload. Operators are never penalized for 429 errors.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Always utilize the `wnode-sim` CLI tool locally to debug `ERR_WASM_TRAP_ILLEGAL_OP` errors. These typically indicate the presence of stripped WASI features (like multi-threading or DNS lookups) within your compiled binary.</p>

            {/* 10. Appendix */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Appendix: Error Code Matrix</h2>
            <div className="mt-[24px] mb-[24px] overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800">
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Error Class</th>
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Code / Detail</th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-slate-300 divide-y divide-slate-800">
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Runtime Panics</td>
                            <td className="p-[12px]">ERR_WASM_TRAP_OOM, ERR_WASM_TRAP_ILLEGAL_OP</td>
                        </tr>
                        <tr className="bg-slate-900/30 hover:bg-slate-900/50">
                            <td className="p-[12px]">Consensus Failures</td>
                            <td className="p-[12px]">ERR_QUORUM_TIMEOUT, ERR_DETERMINISM_VIOLATION</td>
                        </tr>
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Security Violations</td>
                            <td className="p-[12px]">ERR_SIGNATURE_FORGED, ERR_TELEMETRY_SPOOFED, ERR_SLASH_DIVERGENCE</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Placeholder Diagram */}
            <div className="mt-[32px] mb-[16px] p-[24px] bg-slate-900 border border-slate-700 border-dashed rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-mono text-[14px]">[ Placeholder: Error Routing & Retry Matrix Diagram ]</span>
            </div>

        </div>
    );
}
