import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Protocol Deep-Dive: Tokenomics & WEX Staking`}</h1>
            
            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>WEX staking is required for both Integration Authors and Node Operators.</li>
                    <li>Stake mathematically guarantees network reputation and determines routing priority.</li>
                    <li>Credential issuance and rotation are strictly bound to an active stake.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">To align economic incentives within the Sovereign Mesh, the network employs the WEX utility token. For operators, WEX acts as collateral (stake) that can be slashed if they act maliciously, preventing zero-cost Sybil attacks. For integration authors, WEX acts as an anti-spam mechanism, ensuring that only high-quality, heavily-staked WASM binaries receive prioritization from the Mesh Router during high-congestion periods.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Entity Connects Wallet → Locks WEX into Smart Contract → Orchestrator verifies Stake → Orchestrator issues API Credentials (Author) or WSS Keys (Operator) → Entity earns reputation over time → Unstaking triggers 14-day credential revocation cooldown.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`// Verifying Operator Eligibility for Tier-1 Routing
func VerifyTier1Eligibility(op Operator) bool {
  if op.StakedWEX < MinimumTier1Stake {
    return false
  }
  if op.ReputationScore < 95.0 {
    return false
  }
  return true
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">If an operator's WEX stake drops below the required threshold (either due to algorithmic slashing or manual un-staking), the Orchestrator instantly revokes their cryptographic credentials. Active WSS connections will be terminated with a `401 Unauthorized` envelope, and the node will be isolated from the Mesh.</p>
            
            <div className="my-[24px] p-[12px] bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                <h4 className="text-[14px] font-bold text-amber-500 mb-[4px] uppercase tracking-wider">Warning</h4>
                <p className="text-[14px] text-slate-300 leading-[1.6] m-0">Uncaught panics yield an immediate 422 Quorum Rejection and Operator slashing. Stake is burned permanently.</p>
            </div>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">API Rate Limiting tiers for Integration Authors are strictly bound to their WEX stake. An author cannot bypass the Free tier (100 req/sec) to reach the Enterprise tier (10,000 req/sec) without locking the requisite WEX collateral, protecting the network from DDoS attacks.</p>
            
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
  "event": "credential_revoked",
  "reason": "insufficient_stake",
  "staked_wex": 450,
  "required_wex": 1000,
  "operator_id": "op-33f2"
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">The Credential Lifecycle is entirely dependent on on-chain state synchronization. The Orchestrator monitors the WEX staking smart contract. When a rotation or revocation event is detected on-chain, the Orchestrator propagates the key update to the global WSS Multiplexer within 500ms.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Operators should maintain a buffer of WEX stake approximately 20% above the minimum tier threshold to prevent accidental de-tiering during minor slashing events (e.g., occasional hardware bit-flips).</p>

            {/* 10. Appendix */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Appendix: Operator Tiers</h2>
            <div className="mt-[24px] mb-[24px] overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800">
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Tier</th>
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Staking Requirement / Workload</th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-slate-300 divide-y divide-slate-800">
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Tier-1 (T1)</td>
                            <td className="p-[12px]">10,000 WEX. High-value financial routing, DeFi executions.</td>
                        </tr>
                        <tr className="bg-slate-900/30 hover:bg-slate-900/50">
                            <td className="p-[12px]">Tier-2 (T2)</td>
                            <td className="p-[12px]">1,000 WEX. Standard data fetching, generic WASM compute.</td>
                        </tr>
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Tier-3 (T3)</td>
                            <td className="p-[12px]">0 WEX. Shadow pool, untrusted execution testing, slashed nodes.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Placeholder Diagram */}
            <div className="mt-[32px] mb-[16px] p-[24px] bg-slate-900 border border-slate-700 border-dashed rounded-lg flex items-center justify-center">
                <span className="text-slate-500 font-mono text-[14px]">[ Placeholder: WEX Staking Lifecycle & Routing Diagram ]</span>
            </div>

        </div>
    );
}
