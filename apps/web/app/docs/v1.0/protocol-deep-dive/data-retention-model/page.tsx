import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Data Retention Model`}</h1>

            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>Ephemeral state for in-flight compute jobs.</li>
                    <li>Cached state for active WASM binaries.</li>
                    <li>Persistent state for Integration Registry and settlement.</li>
                    <li>Telemetry retention: 7 days standard, 30 days extended.</li>
                    <li>Strict GDPR/Residency data scrubbing.</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">A tiered retention model optimizes infrastructure costs while ensuring stringent compliance, reproducibility for verifiable compute, and respect for operator data privacy.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Data Ingested → Ephemeral Compute Memory → Cold Storage for Settlement Logs → Automated TTL Purge routines eliminate expired data.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">go</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`// Example TTL purge routine
func RunDailyPurge(db *Database) error {
    sevenDaysAgo := time.Now().Add(-7 * 24 * time.Hour)
    return db.Exec("DELETE FROM telemetry_logs WHERE created_at < ?", sevenDaysAgo)
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Automated purge cron fails, resulting in disk bloat. Registry caching evicts frequently used active binaries, increasing cold start latency globally.</p>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">PII must be completely scrubbed before persistent logging. Ephemeral data must be strictly bounded by Node RAM limits. Settlement logs must be retained indefinitely.</p>

            {/* 7. Telemetry */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Telemetry</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">json</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`{
  "event": "data_purge_complete",
  "records_deleted": 450982,
  "table": "telemetry_logs",
  "duration_ms": 1205
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">The Ingestion Pipeline streams simultaneously to both ephemeral compute nodes and persistent storage. The Telemetry system applies hardware-enforced TTLs.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Tag transient data cleanly within your specs to guarantee the garbage collector purges it within the standard 24-hour ephemeral window.</p>

            {/* 10. Appendix */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Appendix: Retention Tiers</h2>
            <div className="mt-[24px] mb-[24px] overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800">
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Data Type</th>
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Storage Tier</th>
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Retention Window</th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-slate-300 divide-y divide-slate-800">
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Job Payload</td>
                            <td className="p-[12px]">Ephemeral (RAM)</td>
                            <td className="p-[12px]">Execution lifespan (ms)</td>
                        </tr>
                        <tr className="bg-slate-900/30 hover:bg-slate-900/50">
                            <td className="p-[12px]">Standard Telemetry</td>
                            <td className="p-[12px]">Hot Database</td>
                            <td className="p-[12px]">7 Days</td>
                        </tr>
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Settlement Proofs</td>
                            <td className="p-[12px]">Cold / Archive</td>
                            <td className="p-[12px]">Indefinite</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}
