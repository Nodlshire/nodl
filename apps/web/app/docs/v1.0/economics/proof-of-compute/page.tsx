import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Economics: Proof of Compute`}</h1>
            
            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>WASI Instruction Count acts as cryptographically undeniable Proof of Compute.</li>
                    <li>Operators cannot artificially inflate execution times to earn more.</li>
                    <li>Ensures trustless accounting between Clients, Orchestrator, and Operators.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">In decentralized networks, operators have a direct economic incentive to lie. If we paid operators based on reported CPU execution milliseconds, an operator could purposefully underclock their CPU or throttle the process to bill the client for more time. By utilizing exact WASI instruction counts, the compute measurement is mathematically deterministic and immune to hardware manipulation.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">WASM Payload Dispatched → Nodes A, B, C Execute → Node A reports 10,000 instructions. Node B reports 10,000. Node C modifies daemon to report 15,000 → Orchestrator flags Node C as malicious → Node A and B paid based on Quorum match of 10,000.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`// Validating Proof of Compute
func ValidateTelemetry(reports []NodeTelemetry) (uint64, error) {
  // Finds the most common instruction count (mode)
  consensusCount := ExtractQuorumInstructionCount(reports)
  if consensusCount == 0 {
    return 0, errors.New("failed to reach telemetry quorum")
  }
  return consensusCount, nil
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">If a new version of Wazero introduces a bug where instruction counts drift between ARM and AMD architectures, the Quorum will fail to agree on the Proof of Compute, and the Orchestrator will halt billing for that payload, safely pausing the network rather than settling incorrect amounts.</p>
            
            <div className="my-[24px] p-[12px] bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                <h4 className="text-[14px] font-bold text-amber-500 mb-[4px] uppercase tracking-wider">Warning</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">Uncaught panics yield an immediate 422 Quorum Rejection and Operator slashing [TBD: Reputation score reduction + cooldown periods].</p>
            </div>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Proof of compute is intrinsically tied to the determinism invariant. Any execution logic that causes divergent outcomes (e.g. relying on map iterations) will inherently cause divergent instruction counts, triggering an immediate fault.</p>
            
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
  "event": "proof_of_compute_verified",
  "instruction_count": 94002,
  "nodes_in_consensus": 4,
  "nodes_slashed": 1
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">The Wazero engine provides a native `context.Context` listener that hooks into the execution cycle to count instructions. This hook is compiled directly into the `nodld` daemon, making it tamper-resistant for edge operators.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Client developers can run `wnode-sim` locally with the `--measure` flag to see exactly how many WASI instructions their payload requires, allowing them to optimize their code and accurately project monthly execution budgets.</p>

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
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">WEX Integration</td>
                            <td className="p-[12px]">[Placeholder: WEX Token Economics will be defined in Protocol Deep-Dive]</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Placeholder Diagram */}
            <div className="mt-[32px] mb-[16px] p-[24px] bg-slate-900 border border-slate-700 border-dashed rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-mono text-[14px]">[ Placeholder: Telemetry Instruction Counting Diagram ]</span>
            </div>

        </div>
    );
}
