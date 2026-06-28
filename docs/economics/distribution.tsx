import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Money Distribution Engine | WeNode',
    description: 'Formal architectural specification of the systemic revenue routing and disbursement protocols.',
};

export default function DistributionEnginePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Money Distribution Engine</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict multi-sig enforced, algorithmic routing of protocol revenue to treasuries, operators, and tokenomics sinks.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The Money Distribution Engine enforces the ultimate cryptographic settlement phase of the network. It operates as an asynchronous, batched state transition function that converts purely internal ledger allocations into externally finalized blockchain transactions. It guarantees solvency by mathematically ensuring that no funds are bridged out without matching multi-sig destruction of the corresponding internal state. All internal state calculations execute within a single linear memory model under strict WASM sandboxing (no WASI, no syscalls, no network, no filesystem). Substrate logic runs deterministically in DAG topological order with memory isolated to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. All execution faults trigger standardized trap behavior.
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
                            <td className="p-4 font-mono text-blue-400">Solvency Equation</td>
                            <td className="p-4">Σ(Internal_Burns) == L1_Disbursement_Value</td>
                            <td className="p-4">Zero-sum external bridging.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">TSS Quorum</td>
                            <td className="p-4">Q = ceil(2/3 * N)</td>
                            <td className="p-4">Multisig validation threshold.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Gas Bounding</td>
                            <td className="p-4">Gas_Cost_tx &le; Max_Basefee_Threshold</td>
                            <td className="p-4">L1 settlement economics limit.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The Engine coordinates through Threshold Signature Schemes (TSS) utilizing specialized RPC sub-channels between Tier-1 quorum nodes.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Protobuf: TSS Disbursement Batch
message SettlementBatch {
  uint64 epoch_id = 1;
  repeated Payout target_payouts = 2; // Array of addresses + values
  bytes signature = 3; // BLS/Schnorr multisig
  bytes network_merkle_root = 4; // Proof of state destruction
  uint64 timestamp_ms = 5;
}

message Payout {
  string evm_address = 1;
  uint64 amount_wei = 2;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Settlement Lifecycle)</h2>
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
                            <td className="p-4 text-slate-300">Accumulation</td>
                            <td className="p-4">Internal balances hit $1,000 threshold</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Batch Construction</td>
                            <td className="p-4">Nodes assemble Merkle tree of withdrawals</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">TSS Signing Phase</td>
                            <td className="p-4">Quorum exchanges key shares over P2P</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">L1 Broadcast</td>
                            <td className="p-4">Relayer submits aggregate sig to Smart Contract</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">State Deletion</td>
                            <td className="p-4">Internal balances zeroed upon L1 finality ACK</td>
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
                    <li>Network-level: TSS signature interception and replay.</li>
                    <li>Execution-level: Quorum hijacking and Sybil exits.</li>
                    <li>Economic-level: Forged Merkle proofs draining the L1 treasury.</li>
                    <li>Governance-level: Unauthorized L1 disbursement upgrades.</li>
                    <li>Telemetry-level: Forged L1 finality acknowledgments.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for Merkle roots and ed25519/BLS signatures for TSS validation.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Slashing penalties exceeding extractable treasury value.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (TSS Participation)</h2>
            <p>
                Tier-1 Operators run the TSS daemon as a parallel process to the standard WASM execution watchdog. They are economically incentivized to participate in signing rounds; failure to provide a signature share during a settlement epoch results in exclusion from the epoch's block rewards.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                The Engine minimizes L1 gas costs by batching thousands of internal ledger transfers into single Merkle-root updates on Ethereum/Solana. The amortized gas cost is automatically deducted from the disbursed amounts, ensuring the treasury remains permanently solvent regardless of L1 fee spikes.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The smart contracts holding the external funds are strictly non-upgradeable by default. Any modification to the L1 disbursement logic or treasury address requires a formal multi-epoch DAO governance vote and an absolute time-lock delay of 14 days.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> Aggregate signature generation must resolve in <code>RTT &le; 2000ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> Batch frequency bounded by gas efficiency heuristics.</li>
                <li><strong>Tick & Automation Timing:</strong> State destruction blocked asynchronously until <code>distribution_latency_ms</code> satisfies L1 finality.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Relies on the Affiliate and MEV Engines for its input queues, processing finalized internal states mathematically bound by the <code>SyncManifest</code>. It utilizes the Crypto Engine's RPC architecture to monitor the success of its own outbound L1 transactions.
            </p>

            <h2 id="formal-diagrams">11. Formal Settlement Routing DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="110" width="150" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="125" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Internal Ledger Stats</text>

                    <line x1="200" y1="130" x2="280" y2="130" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowSolid)" />
                    <text x="240" y="120" fill="#888" fontSize="11" textAnchor="middle">Batching</text>

                    <rect x="280" y="70" width="200" height="120" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="380" y="100" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">TSS Quorum</text>
                    <text x="380" y="130" fill="#888" fontSize="11" textAnchor="middle">1. Build Merkle Root</text>
                    <text x="380" y="150" fill="#888" fontSize="11" textAnchor="middle">2. Aggregate BLS Signatures</text>

                    <line x1="480" y1="130" x2="560" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="560" y="110" width="160" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="640" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">L1 Smart Contract</text>
                </svg>
            </div>
        </>
    );
}
