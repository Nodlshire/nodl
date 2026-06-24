import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Protocol Deep-Dive: Quorum & Slashing Semantics`}</h1>
            
            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>Mathematical quorum defaults to 2/3 + 1 of the routed operator pool.</li>
                    <li>Operators face immediate stake-slashing and reputation loss for signature forgery or telemetry spoofing.</li>
                    <li>Appeals are supported via cryptographic proof-of-execution logs.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">To guarantee Byzantine Fault Tolerance across a dark-forest mesh of untrusted hardware, the network requires a strict penal code. Slashing is the primary economic deterrent against malicious execution or data exfiltration. Operators stake WEX tokens to earn routing priority, and those tokens are algorithmically burned if the operator breaches the deterministic invariants of the protocol.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Payload Dispatched → N Operators Execute → Results Hashed → 2/3 Consensus Reached → Minority Operators Slashed → Stake Burned → Reputation Dropped → Malicious Nodes Re-routed to Tier-3 (Shadow) pool.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`// Slashing Execution
func SlashOperator(nodeID string, offense string, stake Pool) error {
  penalty := CalculatePenalty(offense) // 100% for forgery, 10% for drift
  err := stake.Burn(nodeID, penalty)
  if err == nil {
    DecreaseReputation(nodeID, 500)
    RouteToTier3(nodeID)
  }
  return err
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">If the Orchestrator fails to reach the 2/3 threshold (e.g. 5 nodes output hash A, 5 nodes output hash B), this triggers a `Quorum Failure`. The execution is immediately retried on a completely different pool of operators. If the failure persists, the integration is flagged for non-determinism, and NO operators are slashed (since the fault likely lies with the WASM logic, not the operators).</p>
            
            <div className="my-[24px] p-[12px] bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                <h4 className="text-[14px] font-bold text-amber-500 mb-[4px] uppercase tracking-wider">Warning</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">Uncaught panics yield an immediate 422 Quorum Rejection and Operator slashing. A 7-day cooldown period is applied to any operator that submits an invalid Ed25519 signature.</p>
            </div>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Operators are tiered based on historical performance and stake. Tier-1 (T1) operators handle high-value financial routing, Tier-2 (T2) handle standard compute, and Tier-3 (T3) handle low-priority or untrusted overflow. Slashed operators fall immediately to T3.</p>
            
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
  "event": "slashing_executed",
  "operator_id": "op-5911x",
  "penalty_wex": 1500,
  "reason": "divergent_output_hash",
  "appeal_window_expires": "2026-10-12T00:00:00Z"
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Slashing interacts directly with the Tokenomics engine. When an operator is slashed, their staked WEX is sent to the global burn address, deflating the token supply and penalizing the operator proportionately to their routing capacity.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Operators should actively monitor their `nodld` syslog outputs. If slashing occurs due to an underlying hardware fault (e.g., faulty RAM causing hash drift), the operator must submit a cryptographic proof-of-execution log to the Foundation within the 7-day appeal window to request reinstatement.</p>

            {/* 10. Appendix */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Appendix: Slashing Triggers</h2>
            <div className="mt-[24px] mb-[24px] overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800">
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Trigger</th>
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Penalty</th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-slate-300 divide-y divide-slate-800">
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Forged Signature / Replay Attempt</td>
                            <td className="p-[12px]">100% Stake Burn, Permanent Ban</td>
                        </tr>
                        <tr className="bg-slate-900/30 hover:bg-slate-900/50">
                            <td className="p-[12px]">Telemetry Spoofing</td>
                            <td className="p-[12px]">50% Stake Burn, Fall to T3</td>
                        </tr>
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Divergent Deterministic Hash</td>
                            <td className="p-[12px]">10% Stake Burn, 7-day Cooldown</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Placeholder Diagram */}
            <div className="mt-[32px] mb-[16px] p-[24px] bg-slate-900 border border-slate-700 border-dashed rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-mono text-[14px]">[ Placeholder: Quorum Slashing Penalty Matrix Diagram ]</span>
            </div>

        </div>
    );
}
