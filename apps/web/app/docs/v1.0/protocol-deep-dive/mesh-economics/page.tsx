import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Protocol Deep-Dive: Mesh Economics & Reputation`}</h1>
            
            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>USD-first payment routing with automated internal conversion to WEX.</li>
                    <li>Operator payouts are distributed based on deterministic reputation scoring.</li>
                    <li>Reputation decays over time if operators fail to maintain sub-50ms execution latency.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">To attract enterprise integration authors, the Sovereign Mesh accepts frictionless USD-first fiat payments (via Stripe). However, to maintain the decentralized incentive structure of the network, operators are compensated in the native WEX token. The Orchestrator acts as the automated clearinghouse, performing internal settlement and distributing WEX rewards to operators proportionally to their calculated Reputation Score.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Author pays $0.001 per compute cycle → Orchestrator logs payment → Orchestrator buys WEX from internal AMM pool → WEX allocated to Operator Ledger → Operator withdraws WEX at epoch end.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`// Dynamic Reputation Calculation
func UpdateReputation(op Operator, metrics ExecutionTelemetry) float64 {
  score := op.ReputationScore
  if metrics.LatencyMS < 50 {
    score += 0.01 // Fast execution bonus
  } else if metrics.LatencyMS > 200 {
    score -= 0.50 // Slow execution penalty
  }
  if !metrics.DeterministicMatch {
    score -= 10.0 // Severe penalty for drift
  }
  return math.Min(score, 100.0) // Cap at 100
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">If the internal AMM conversion pool lacks sufficient liquidity to convert the USD payment into WEX, the Orchestrator halts all new API requests for that integration until liquidity is replenished by the Foundation. This guarantees that Operators are never under-compensated for their compute power.</p>
            
            <div className="my-[24px] p-[12px] bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                <h4 className="text-[14px] font-bold text-amber-500 mb-[4px] uppercase tracking-wider">Warning</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">Uncaught panics yield an immediate 422 Quorum Rejection and Operator slashing. Slashed operators forfeit all pending un-withdrawn epoch rewards.</p>
            </div>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Reputation scores are calculated deterministically across four axes: Uptime (WSS heartbeat consistency), Accuracy (Quorum consensus match rate), Determinism (Zero panic rate), and Latency (Time-to-return hash). An operator's reputation dictates their exact percentage share of the network routing queue.</p>
            
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
  "event": "reputation_updated",
  "operator_id": "op-4bb1",
  "previous_score": 98.4,
  "new_score": 98.9,
  "reason": "consistent_sub_50ms_latency"
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">The Reputation Engine feeds directly into the Mesh Router. The router utilizes a weighted round-robin algorithm. An operator with a 99.9 reputation score receives proportionally more compute payloads (and thus more WEX rewards) than an operator hovering at the 80.0 minimum threshold, incentivizing constant hardware upgrades.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Operators should deploy their `nodld` instances on bare-metal servers physically close to the Orchestrator ingest endpoints (e.g., AWS us-east-1) to maximize their Latency score and capture a larger share of the routing pool.</p>

            {/* 10. Appendix */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Appendix: Reward Distribution</h2>
            <div className="mt-[24px] mb-[24px] overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800">
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Metric</th>
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Reward Weighting</th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-slate-300 divide-y divide-slate-800">
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Quorum Success Rate</td>
                            <td className="p-[12px]">50% of Total Score (Primary multiplier)</td>
                        </tr>
                        <tr className="bg-slate-900/30 hover:bg-slate-900/50">
                            <td className="p-[12px]">Latency {"<"} 50ms</td>
                            <td className="p-[12px]">30% of Total Score (Performance multiplier)</td>
                        </tr>
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Uptime</td>
                            <td className="p-[12px]">20% of Total Score (Reliability multiplier)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Placeholder Diagram */}
            <div className="mt-[32px] mb-[16px] p-[24px] bg-slate-900 border border-slate-700 border-dashed rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-mono text-[14px]">[ Placeholder: USD to WEX Conversion Pipeline Diagram ]</span>
            </div>

        </div>
    );
}
