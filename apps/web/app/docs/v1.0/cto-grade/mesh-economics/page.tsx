import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Mesh Economics`}</h1>

            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>Pricing and Payout formulas.</li><li>USD Conversion engine.</li><li>Stripe integration / AML/KYC flows.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Sovereign execution requires a predictable, reliable billing lifecycle that bridges traditional fiat payment systems with operator profitability logic.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Client funds account (Stripe) → USD Conversion Engine → Compute allocated → Execution → Payout formula executes → Operator receives funds.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                        <button className="text-slate-500 hover:text-white transition-colors" aria-label="Copy code">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`// Billing calculation
func CalculatePayout(cpuMs int64, tier int) int64 {
  return baseRate * cpuMs * tierMultiplier
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Failure at the USD conversion or AML/KYC gate prevents workload ingestion.</p>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Security Envelope enforced: Ingress HMAC, Nonce + replay protection, Ed25519 signatures, Quorum validation, Operator slashing [TBD: Reputation score reduction + cooldown periods], Telemetry authenticity.</p>

            {/* 7. Telemetry */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Telemetry</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">json</span>
                        <button className="text-slate-500 hover:text-white transition-colors" aria-label="Copy code">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`{
  "event": "billing_lifecycle",
  "client_id": "usr_abc123",
  "payout_usd": 0.045
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">The Mesh Economics pipeline interfaces with both the external Stripe gateway and the internal WEX Tokenomics module.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Ensure all pricing formulas utilize fixed-point arithmetic to prevent floating-point non-determinism during financial settlement.</p>

            {/* 10. Appendix */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Appendix: Formulas</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Payout Formula: <code>Payout = (Base Compute + RAM Overhead) * Reputation Multiplier</code>. Exact numerical USD conversions are handled via Oracles.</p>

        </div>
    );
}
