import React from 'react';

export default function Page() {
    return (
        <div className="w-full pb-24">
            <h1 className="text-[28px] md:text-[32px] font-bold text-[#f9fafb] mb-[12px] leading-tight tracking-tight">{`Operator Onboarding`}</h1>

            {/* 1. At a Glance */}
            <div className="bg-slate-800/50 border border-slate-700 p-[12px] md:p-[16px] rounded-lg mb-[32px]">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-slate-400 mb-[12px]">At a Glance</h4>
                <ul className="text-[16px] leading-[1.6] text-slate-300 space-y-[8px] list-disc list-inside m-0">
                    <li>Frictionless Nodlr UI management flow.</li>
                    <li>Tier 1 (Enterprise) vs Tier 3 (Edge) classifications.</li>
                    <li>Baseline hardware requirements for node variants.</li>
                    <li>Official standard installer script (`nodl-install.sh`).</li>
                    <li>Supported OS matrix (Ubuntu, Debian, Fedora).</li>
                </ul>
            </div>

            {/* 2. Rationale */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Rationale</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">A streamlined, secure onboarding process is crucial for scaling the decentralized mesh quickly while maintaining rigorous quality, uptime, and security baselines.</p>

            {/* 3. Flow */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Flow</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Register in Nodlr UI → Provision Hardware → Run Installer Script → Node Authenticates (Ed25519) → Enters Probing State → Promoted to Active Node.</p>

            {/* 4. Core Code */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Core Code</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">bash</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`# Standard Node Installation
curl -sL https://get.wnode.network/install.sh | bash -s -- \\
  --tier=3 \\
  --auth-token="eyJhbG..."`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 5. Failure Modes */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Failure Modes</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Installer fails on unsupported OS versions. Nodes failing the initial network probing phase due to excessive latency. Invalid auth tokens rejected instantly.</p>

            {/* 6. Invariants */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Invariants</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Tier 1 operators must maintain a strict 99.9% uptime SLA. Ed25519 private keys generated during setup must never leave the node's secure enclave.</p>

            {/* 7. Telemetry */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Telemetry</h2>
            <div className="mt-[20px] mb-[20px]">
                <div className="bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    <div className="px-4 py-2 border-b border-slate-800 bg-[#0f1117] flex justify-between items-center">
                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">json</span>
                    </div>
                    <div className="p-4 overflow-x-auto">
                        <pre className="text-[14px] font-mono text-[#e5e7eb] leading-[1.5]"><code>{`{
  "event": "node_promoted",
  "node_id": "0xfe3...",
  "tier": 3,
  "probing_latency_ms": 14
}`}</code></pre>
                    </div>
                </div>
            </div>

            {/* 8. Cross-Component Interactions */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Cross-Component Interactions</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">The Nodlr UI interfaces with the central Registry to issue initial credential manifests. The global Orchestrator manages the probing lifecycle and eventual promotion.</p>

            {/* 9. Best Practices */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Best Practices</h2>
            <p className="text-[16px] leading-[1.7] text-[#e5e7eb] mb-[16px]">Provision static IPs for Tier 1 nodes. Utilize the official systemd unit files provided by the installer to ensure robust process management and auto-restarts.</p>

            {/* 10. Appendix */}
            <h2 className="text-[22px] md:text-[24px] font-semibold text-[#f9fafb] mt-[32px] mb-[12px]">Appendix: Hardware & OS Requirements</h2>
            <div className="mt-[24px] mb-[24px] overflow-hidden rounded-xl border border-slate-800 bg-[#0d1117]">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-800">
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Requirement</th>
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Tier 1 (Enterprise)</th>
                            <th className="p-[12px] font-semibold text-[#f9fafb] text-[14px]">Tier 3 (Edge)</th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-slate-300 divide-y divide-slate-800">
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">CPU / RAM</td>
                            <td className="p-[12px]">16 Cores / 32GB RAM</td>
                            <td className="p-[12px]">2 Cores / 4GB RAM</td>
                        </tr>
                        <tr className="bg-slate-900/30 hover:bg-slate-900/50">
                            <td className="p-[12px]">Network SLA</td>
                            <td className="p-[12px]">1 Gbps Symmetric / 99.9%</td>
                            <td className="p-[12px]">Best Effort</td>
                        </tr>
                        <tr className="bg-[#0f1117] hover:bg-slate-900/50">
                            <td className="p-[12px]">Supported OS</td>
                            <td className="p-[12px]">Ubuntu 22.04 LTS, Debian 12</td>
                            <td className="p-[12px]">Ubuntu, Debian, Fedora</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
}
