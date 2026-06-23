import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'MEV Engine | WeNode',
    description: 'Formal architectural specification of the maximal extractable value capture and redistribution protocols.',
};

export default function MEVEnginePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">MEV Engine</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict orchestration of order-flow auctions, transaction sequencing bounds, and democratic value redistribution.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The MEV Engine operates as a threshold-encrypted mempool sequencer. It guarantees that node operators cannot front-run or sandwich retail transactions. Transaction ordering is established via a verifiable delay function (VDF) or threshold cryptography before the payload contents are decrypted, structurally binding execution flow to the protocol's internalized auction rather than operator discretion. Post-decryption, the network executes transactions using a single linear memory model enforcing strict WASM sandboxing (no WASI, no syscalls, no network, no filesystem). All substrate calls MUST be processed in DAG topological order, memory follows <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>, and faults utilize deterministic trap paths.
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
                            <td className="p-4 font-mono text-blue-400">Mempool Sequencing</td>
                            <td className="p-4">Order(Tx_1, Tx_2) = blake3(E_Tx_1) &lt; blake3(E_Tx_2)</td>
                            <td className="p-4">Pre-decryption deterministic ordering.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Consensus</td>
                            <td className="p-4">Q = ceil(2/3 * N)</td>
                            <td className="p-4">Quorum divergence slashing.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Auction Settlement</td>
                            <td className="p-4">Treasury_Revenue = MAX(Searcher_Bids)</td>
                            <td className="p-4">Democratic value redistribution.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Searchers interface with the Engine via dedicated RPC endpoints utilizing JSON-RPC bundles. Retail clients interact seamlessly; their SDK automatically encrypts payloads against the network's public threshold key.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Protobuf: MEV Bundle Definition
message SearcherBundle {
  bytes target_block_hash = 1;
  repeated bytes encrypted_txs = 2; // Arbitrage logic
  uint64 bid_amount_units = 3;
  bytes signature = 4;
  uint64 timestamp_ms = 5;
}

message BlockDecryptionKey {
  uint64 epoch = 1;
  bytes aggregated_key = 2;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Mempool Lifecycle)</h2>
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
                            <td className="p-4 text-slate-300">Retail Submission</td>
                            <td className="p-4">User broadcasts Encrypted_Tx</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Mempool Commitment</td>
                            <td className="p-4">Quorum agrees on strict block order (ciphertexts)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Searcher Auction</td>
                            <td className="p-4">Bid(500 units) accepted for Top-of-Block</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Threshold Decryption</td>
                            <td className="p-4">2/3 nodes reveal key shares; ciphertexts decrypted</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Execution</td>
                            <td className="p-4">State transitions applied strictly in committed order</td>
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
                    <li>Network-level: Mempool scanning and payload front-running.</li>
                    <li>Execution-level: Sequencer order manipulation.</li>
                    <li>Economic-level: Searcher auction griefing.</li>
                    <li>Governance-level: Unauthorized VDF parameter tuning.</li>
                    <li>Telemetry-level: False threshold decryption shares.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for block commitments and threshold ed25519 signatures for encryption.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Immediate slashing for proposing uncommitted blocks or front-running decrypted flows.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Key Management)</h2>
            <p>
                Operators must participate in DKG (Distributed Key Generation) protocols periodically. During every block cycle, they must rapidly broadcast their decryption share. Failure to respond within 50ms results in missed block participation metrics, directly impacting their validator uptime score.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                The MEV Engine fundamentally alters network economics. Instead of dark forest extraction by miners, 100% of the arbitrage value won in the Searcher Auction is routed natively to the protocol Treasury, to be redistributed to stakers and token holders via the Distribution Engine.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The cryptographic primitives (e.g., swapping from standard VDF to specific ZK threshold circuits) and the block fraction allocated to MEV bundles are governed by DAO parameter upgrades.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> Block space auction must resolve in <code>ExecTime &le; 20ms</code>.</li>
                <li><strong>Throughput Metrics:</strong> Threshold decryption of 10,000 transactions bounded to <code>&le; 15ms</code>.</li>
                <li><strong>Resource Pressure:</strong> Encrypted payloads incur a strict 15% byte padding overhead.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Interacts intimately with the Earth Mesh for execution ordering and pipes finalized auction revenues into the Distribution Engine. These finalized revenues are structurally mapped into the <code>SyncManifest</code> to enforce deterministic ingestion and execution transparency across the network.
            </p>

            <h2 id="formal-diagrams">11. Formal MEV Sequencing DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="60" width="140" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="120" y="85" fill="#888" fontSize="11" textAnchor="middle">User Tx (Encrypted)</text>

                    <rect x="50" y="120" width="140" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="120" y="145" fill="#888" fontSize="11" textAnchor="middle">Searcher Bundle Bid</text>

                    <line x1="190" y1="80" x2="270" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <line x1="190" y1="140" x2="270" y2="120" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="270" y="60" width="200" height="100" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="370" y="90" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Sequencer & Decrypter</text>
                    <text x="370" y="110" fill="#888" fontSize="11" textAnchor="middle">1. Lock Order Hash</text>
                    <text x="370" y="130" fill="#888" fontSize="11" textAnchor="middle">2. Reveal Threshold Key</text>

                    <line x1="470" y1="110" x2="550" y2="110" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="550" y="90" width="150" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="625" y="115" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Deterministic Block</text>
                </svg>
            </div>
        </>
    );
}
