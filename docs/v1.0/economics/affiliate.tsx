import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Affiliate Engine | WeNode',
    description: 'Formal architectural specification of the deterministic revenue sharing and referral topology.',
};

export default function AffiliateEnginePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Affiliate Engine</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict multi-level distribution logic binding referral provenance to mathematical revenue splits.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The Affiliate Engine functions as a deterministic state machine managing complex referral hierarchies. It executes recursive, integer-bound split distributions across immutable attribution graphs. The logic guarantees that for any block of network revenue, the sum of all distributed fractional payouts mathematically equals exactly 100% of the input value, with zero precision loss. The distribution logic executes within a single linear memory model featuring strict WASM sandboxing (no WASI, no syscalls, no network, no filesystem). It guarantees DAG topological order for all payouts, with memory strictly adhering to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. Calculation faults immediately trigger a deterministic trap sequence.
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
                            <td className="p-4 font-mono text-blue-400">Conservation of Value</td>
                            <td className="p-4">Σ Payouts_i == Input_Revenue</td>
                            <td className="p-4">Zero precision loss on splits.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Graph Immutability</td>
                            <td className="p-4">Edge(Referrer, Referee) == Immutable</td>
                            <td className="p-4">Cryptographic attribution locking.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Execution Depth Bound</td>
                            <td className="p-4">Depth(Attribution_Tree) &le; MAX_DEPTH (10)</td>
                            <td className="p-4">Trap on OOM cyclic loops.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Attribution links are established through cryptographic signatures rather than mutable database rows. A user proving they were referred must sign the referrer's public key during their account initialization transaction.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Protobuf: Attribution State Definition
message ReferralEdge {
  bytes referee_pub_key = 1;
  bytes referrer_pub_key = 2;
  uint64 established_at_epoch = 3;
  bytes signature = 4;
  uint64 timestamp_ms = 5;
}

message RevenueSplitEvent {
  bytes source_tx_hash = 1;
  uint64 total_amount_units = 2;
  map<string, uint64> distributions = 3;
  uint64 timestamp_ms = 4;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Payout Lifecycle)</h2>
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
                            <td className="p-4 text-slate-300">Revenue Ingress</td>
                            <td className="p-4">Billing Engine confirms $100.00 (10000 cents)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Graph Traversal</td>
                            <td className="p-4">Node locates Referrer_A (Level 1)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Integer Math</td>
                            <td className="p-4">10000 * 20 / 100 = 2000 cents</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Ledger Mutation</td>
                            <td className="p-4">Treasury += 8000; Referrer_A += 2000</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">State Consensus</td>
                            <td className="p-4">BFT quorum signs new balances hash</td>
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
                    <li>Network-level: Forged attribution edge creation.</li>
                    <li>Execution-level: Cyclic attribution loops causing OOM traps.</li>
                    <li>Economic-level: Floating-point precision leaks draining the treasury.</li>
                    <li>Governance-level: Unauthorized DAO affiliate rate modification.</li>
                    <li>Telemetry-level: Phantom revenue split events.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for state validation and ed25519 signatures for attribution verification.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Immediate operator slashing for failing cyclic loop detection or exceeding max depth.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Affiliate Processing)</h2>
            <p>
                Operators process Affiliate Engine logic synchronously as part of the standard block execution pipeline. Because recursive tree traversal can consume significant memory, WASM handlers strictly trap and fail any attribution tree deeper than 10 levels, slashing the transaction initiator for excessive gas consumption.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                The Engine enforces the canonical revenue split (e.g., 80% protocol treasury, 20% referrer). This split dynamically adjusts based on the referrer's staking tier, incentivizing massive token lockups in exchange for higher fractional payout yields.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The fractional division variables (e.g., the 80/20 split) are strictly controlled by `DAO_AFFILIATE_RATE` parameters. Modifying these rates requires a super-majority DAO vote and a timed execution lock to prevent arbitrary mid-epoch revenue rerouting.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ExecTime &le; 2ms</code> per transaction for <code>O(Depth)</code> tree traversal.</li>
                <li><strong>Resource Pressure:</strong> Loaded attribution graphs bounded to <code>mem_pressure_mb &le; 1MB</code>.</li>
                <li><strong>Economic Performance:</strong> Precision bounded to 64-bit unsigned integers.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                The Affiliate Engine acts as a middleware subscriber to both the Stripe Billing Engine (for fiat ingress) and the Crypto Conversion Engine (for token ingress), intercepting confirmed payment events before they finalize into the treasury ledger. The synchronized states are then injected down to the nodes via the global <code>SyncManifest</code>.
            </p>

            <h2 id="formal-diagrams">11. Formal Revenue Routing DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="110" width="160" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="130" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Ingress (10,000 Units)</text>

                    <line x1="210" y1="130" x2="300" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <circle cx="330" cy="130" r="30" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="330" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Split</text>

                    <line x1="360" y1="130" x2="450" y2="80" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <polygon points="460,60 580,60 590,80 580,100 460,100 450,80" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="520" y="84" fill="#888" fontSize="11" textAnchor="middle">Referrer A (2,000)</text>

                    <line x1="360" y1="130" x2="450" y2="180" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <polygon points="460,160 580,160 590,180 580,200 460,200 450,180" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="520" y="184" fill="#888" fontSize="11" textAnchor="middle">DAO Treasury (8,000)</text>
                </svg>
            </div>
        </>
    );
}
