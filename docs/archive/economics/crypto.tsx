import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Crypto Conversion Engine | WeNode',
    description: 'Formal architectural specification of the on-chain settlement and liquidation pipeline.',
};

export default function CryptoConversionEnginePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Crypto Conversion Engine</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict orchestration of EVM/Native Go blockchain listeners, stablecoin settlement, and smart contract execution limits.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The Crypto Conversion Engine strictly abstracts external blockchain environments. It functions as a synchronous RPC monitoring daemon that reads external state, verifies block depth finality against hardcoded bounds, and deterministically injects parsed deposit events into the internal mesh as strictly typed, integer-bound payloads signed by the Orchestrator's ED25519 institutional key. Injected payloads are processed under a single linear memory model with strict Native Go sandboxing (no WASI, no syscalls, no network, no filesystem). The execution follows DAG topological order, restricting pointers to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>, resolving any faults via uniform trap semantics.
            </p>

            <h2 id="invariants">2. Core Invariants</h2>
            <div className="overflow-x-auto my-8 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm m-0">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Name</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Description</th>
                            <th className="p-4 font-semibold tracking-wider uppercase text-xs">Enforcement Rule</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400">
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">State Transition</td>
                            <td className="p-4">S(n+1) = f(S(n), P)</td>
                            <td className="p-4">Single-threaded execution without nondeterminism.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">L1 Finality</td>
                            <td className="p-4">Block_Depth &ge; Safe_Threshold</td>
                            <td className="p-4">Chain reorganization buffer.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Precision Scaling</td>
                            <td className="p-4">Internal_Value = Floor(Ext_Token * (10^Int / 10^Ext))</td>
                            <td className="p-4">Deterministic precision conversion.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Payload Signature</td>
                            <td className="p-4">Payload = Sign_ED25519(Event_Hash, Orch_PK)</td>
                            <td className="p-4">Cryptographic ingress boundary.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The Engine listens to external WebSockets (e.g., EVM `eth_subscribe`) and converts matching smart contract events into the unified Wnode `CryptoIngress` protobuf format.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Protobuf: Verified Crypto Ingress
message CryptoIngressEvent {
  uint32 source_chain_id = 1;
  bytes l1_transaction_hash = 2; // Unique idempotency key
  bytes sender_address = 3;
  uint64 normalized_units = 4; // Always 64-bit uint
  bytes orchestrator_signature = 5;
  uint64 timestamp_ms = 6;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Deposit Lifecycle)</h2>
            <div className="overflow-x-auto my-8 border border-white/10 rounded-lg">
                <table className="w-full text-left text-sm m-0">
                    <thead className="bg-white/5 border-b border-white/10 text-slate-300">
                        <tr>
                            <th className="p-4 font-semibold uppercase text-xs">Phase</th>
                            <th className="p-4 font-semibold uppercase text-xs">Data Artifact</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10 text-slate-400 font-mono text-xs">
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Log Emission</td>
                            <td className="p-4">EVM emits `Deposit(user, 100 USDC)`</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Finality Delay</td>
                            <td className="p-4">Buffer queue holds tx until block depth +12</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Normalization</td>
                            <td className="p-4">USDC (6 dec) mapped to Internal (8 dec)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Signing Validation</td>
                            <td className="p-4">Orchestrator signs exact event schema</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Mesh Insertion</td>
                            <td className="p-4">Native Go sandbox verifies signature, credits user</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="threat-model">5. Threat Model Detail</h2>
            <div className="mb-6">
                <strong>Adversary Classes:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Passive Observer</li>
                    <li>Active Network Adversary</li>
                    <li>Malicious Operator</li>
                    <li>Byzantine Orchestrator</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Attack Surfaces:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Network-level: L1 chain reorganizations.</li>
                    <li>Execution-level: Compromised RPC endpoints feeding fake blocks.</li>
                    <li>Economic-level: Forged deposit payloads bridging non-existent assets.</li>
                    <li>Governance-level: Premature whitelisting of insecure EVM chains.</li>
                    <li>Telemetry-level: Replayed transaction hash idempotency bypass.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for event uniqueness and ed25519 signatures from the Orchestrator.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Strict confirmation depth delays and multi-RPC cross-referencing.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Agnostic Processing)</h2>
            <p>
                Node operators in the Earth Mesh are completely agnostic to the origin of the funds. They only execute the signature verification of the `CryptoIngressEvent`. This decoupling prevents node operators from needing to run resource-heavy Ethereum or Solana archival nodes alongside the Wnode daemon.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                To mitigate L1 gas volatility, incoming token deposits are processed freely by the Wnode protocol, absorbing minor RPC inference costs. Outbound withdrawals (bridging back to L1) incur a dynamic fee extracted from the user's balance to cover external basefee realities.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The mapping of supported L1 chains and their respective `Safe_Threshold` finality parameters is governed by DAO votes. Adding a new chain requires a formal protocol upgrade to whitelist the new Chain ID and parsing logic in the Orchestrator middleware.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> Block log parsing must complete in <code>ExecTime &le; 5ms</code> per block.</li>
                <li><strong>Throughput Metrics:</strong> Horizontally scalable RPC listener pods ingesting &gt; 10,000 <code>msgs_per_sec</code>.</li>
                <li><strong>Resource Pressure:</strong> <code>O(1)</code> Redis lookup against idempotency keys.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Verified events are passed directly to the Earth Mesh for balance mutation, propagated strictly via the Orchestrator's <code>SyncManifest</code> pipeline to ensure deterministic state synchronization. High-value deposits may trigger automated distributions via the Affiliate Engine if a referral tag is detected in the payload metadata.
            </p>

            <h2 id="formal-diagrams">11. Formal Crypto Settlement DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <rect x="50" y="110" width="120" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">EVM L1 Chain</text>

                    <line x1="170" y1="130" x2="250" y2="130" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowSolid)" />
                    <text x="210" y="120" fill="#888" fontSize="11" textAnchor="middle">RPC Logs</text>

                    <rect x="250" y="60" width="200" height="140" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="90" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator Node</text>
                    
                    <rect x="270" y="110" width="160" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="130" fill="#888" fontSize="11" textAnchor="middle">1. Confirm Depth &ge; 64</text>

                    <rect x="270" y="150" width="160" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="170" fill="#888" fontSize="11" textAnchor="middle">2. Sign Event Bytes</text>

                    <line x1="450" y1="130" x2="550" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <rect x="550" y="110" width="150" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="625" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Mesh State Sandbox</text>
                </svg>
            </div>
        </>
    );
}
