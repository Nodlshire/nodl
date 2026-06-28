import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'DAO Governance | WeNode',
    description: 'Formal architectural specification of the on-chain voting and parameter mutation protocols.',
};

export default function DAOGovernancePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">DAO Governance</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict multi-signature execution boundaries defining how systemic parameters are algorithmically mutated.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                DAO Governance operates as the sole root authority over global system parameters. It functions through a delayed, deterministic execution pipeline. Once a quorum is mathematically achieved, the parameter mutation is not applied instantly; instead, it is serialized and passed to the Automation Engine, which injects the state diff exactly at the specified future block height, guaranteeing that all nodes shift consensus rules simultaneously without human intervention. Enactment is executed within a single linear memory model enforcing strict WASM sandboxing (no WASI, no syscalls, no network, no filesystem). Substrate logic resolves in DAG topological order with memory isolated to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>, triggering deterministic traps on fault.
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
                            <td className="p-4 font-mono text-blue-400">Consensus Quorum</td>
                            <td className="p-4">Q = ceil(2/3 * N)</td>
                            <td className="p-4">Voting validation threshold.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Participation Minimum</td>
                            <td className="p-4">Σ(Votes_Yes + Votes_No) &ge; Min_Quorum_Threshold</td>
                            <td className="p-4">Threshold validation for proposal success.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Execution Timelock</td>
                            <td className="p-4">T(Execute) = T(Pass) + Timelock_Epochs</td>
                            <td className="p-4">Delayed global parameter updates.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Proposals are cast via ED25519-signed WASM payloads. There are no UI-specific administrative functions; the Orchestrator evaluates raw governance binary transactions exactly like standard user transfers.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Protobuf: Governance Execution Payload
message ParameterMutation {
  bytes proposal_hash = 1;
  string target_constant = 2; // e.g., "MEV_TREASURY_CUT"
  bytes new_value_encoded = 3;
  uint64 enactment_block = 4;
  bytes signature = 5;
  uint64 timestamp_ms = 6;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Proposal Lifecycle)</h2>
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
                            <td className="p-4 text-slate-300">Proposal Submission</td>
                            <td className="p-4">User locks 10,000 WNODE to submit `Change_Tax(5%)`</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Voting Window</td>
                            <td className="p-4">Operators sign Yes/No; Substrate incrementally tallies</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Resolution</td>
                            <td className="p-4">Block 1M hits. Yes_Weight &gt; Quorum. Proposal Passed.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Timelock Queue</td>
                            <td className="p-4">Mutation scheduled for Block 1.2M</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Enactment</td>
                            <td className="p-4">Automation Engine ticks; Tax rate global variable overwritten.</td>
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
                    <li>Network-level: Proposal hash spoofing.</li>
                    <li>Execution-level: Timelock parameter bypass.</li>
                    <li>Economic-level: Flash loan governance hijacking.</li>
                    <li>Governance-level: Frivolous proposal spam.</li>
                    <li>Telemetry-level: Manipulated quorum threshold tallies.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for proposals and ed25519 signatures for vote casting.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Slashing of locked deposits for proposals that fail to reach minimum threshold.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Governance Duty)</h2>
            <p>
                Operators are expected to run automation daemons that ingest proposal metadata, evaluate it against their local institutional risk parameters, and automatically cast cryptographic votes. Chronic failure to vote on critical network parameter updates negatively impacts validator delegation scoring.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Spamming the network with frivolous proposals requires burning a heavy base fee. If a proposal fails to reach even 10% of the `Min_Quorum_Threshold`, the proposer's locked deposit is entirely slashed and routed to the Distribution Engine, mathematically disincentivizing noise.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The DAO manages the DAO. The parameters governing the DAO itself (e.g., minimum quorum threshold, timelock duration, deposit required) are themselves state variables that can only be altered through a successful DAO proposal.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> Parameter mutation resolves in <code>ExecTime &le; 1ms</code> at Enactment_Block.</li>
                <li><strong>Throughput Metrics:</strong> Vote casting is <code>O(1)</code>.</li>
                <li><strong>Resource Pressure:</strong> Closed proposals are aggressively pruned to disk to minimize <code>mem_pressure_mb</code>.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Governance interacts directly with the Distribution Engine to authorize treasury disbursements and the Automation Engine for timelock enforcement. Once a timelock clears, the Automation Engine injects the enacted parameter mutations (e.g., <code>DAO_TELEMETRY_SCHEMA_UPDATE</code>) through the Orchestrator down to the nodes via the global <code>SyncManifest</code> payload.
            </p>

            <h2 id="formal-diagrams">11. Formal Governance DAG</h2>
            <div className="my-10 bg-[#0d1117] border border-white/10 rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <defs>
                        <marker id="arrowGov" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <rect x="50" y="80" width="120" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="105" fill="#888" fontSize="12" textAnchor="middle">Proposal Hash</text>

                    <line x1="170" y1="100" x2="230" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowGov)" />

                    <rect x="230" y="50" width="160" height="100" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="310" y="80" fill="#888" fontSize="14" textAnchor="middle" fontWeight="bold">Voting Quorum</text>
                    <text x="310" y="105" fill="#888" fontSize="10" textAnchor="middle">1. Accumulate Weight</text>
                    <text x="310" y="125" fill="#888" fontSize="10" textAnchor="middle">2. Verify &gt; 51%</text>

                    <line x1="390" y1="100" x2="450" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowGov)" />

                    <rect x="450" y="80" width="100" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="500" y="105" fill="#888" fontSize="12" textAnchor="middle">Timelock</text>

                    <line x1="550" y1="100" x2="610" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowGov)" />

                    <rect x="610" y="80" width="120" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="670" y="105" fill="#888" fontSize="12" textAnchor="middle">State Overwrite</text>
                </svg>
            </div>
        </>
    );
}
