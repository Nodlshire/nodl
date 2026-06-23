import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Stripe Billing Engine | WeNode',
    description: 'Formal architectural specification of the fiat-to-mesh ingress pipeline.',
};

export default function StripeBillingEnginePage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Stripe Billing Engine</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict orchestration of fiat ingress, recurring subscription states, and deterministic payload signing from Webhook boundaries.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The Stripe Billing Engine operates as the definitive fiat ingress boundary. It executes synchronous cryptographic verification of Stripe HMAC webhooks before asynchronously converting them into verifiable Mesh AddBalance events. Once ingested, the fiat value is strictly transformed into integer-based <code>cents</code>, mathematically decoupling execution logic from floating-point currency representation. All resulting WASM execution follows a single linear memory model enforcing strict sandboxing (no WASI, no syscalls, no network, no filesystem). Substrate calls MUST be processed in DAG topological order, adhering to deterministic pointer bounds: <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. Faults propagate via standardized trap codes uniformly.
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
                            <td className="p-4 font-mono text-blue-400">Webhook Integrity</td>
                            <td className="p-4">HMAC_SHA256(Payload, Stripe_Secret) == Signature</td>
                            <td className="p-4">Cryptographic fiat ingress verification.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Integer Normalization</td>
                            <td className="p-4">Balance(n+1) = Balance(n) + Integer(Fiat_Value * 100)</td>
                            <td className="p-4">Floating point elimination.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">State Transition</td>
                            <td className="p-4">S(n+1) = f(S(n), P)</td>
                            <td className="p-4">Single-threaded execution without nondeterminism.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The Billing Engine exposes a single, highly constrained public webhook endpoint. Internally, it maps the verified webhook payload to the strongly typed Mesh protobuf event.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Protobuf: Fiat Ingress Event
message FiatDepositEvent {
  string stripe_event_id = 1; // Used for idempotency
  string customer_id = 2;
  uint64 amount_cents = 3;
  string currency_code = 4; // e.g., "usd"
  bytes orchestrator_signature = 5;
  uint64 timestamp_ms = 6;
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Webhook Lifecycle)</h2>
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
                            <td className="p-4 text-slate-300">HTTP Ingress</td>
                            <td className="p-4">POST /api/webhook/stripe</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">HMAC Verification</td>
                            <td className="p-4">crypto.verify(payload, stripe_sig)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Idempotency Lock</td>
                            <td className="p-4">Check DB for evt_123...</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Orchestrator Signing</td>
                            <td className="p-4">Sign_ED25519(FiatDepositEvent)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Mesh Dispatch</td>
                            <td className="p-4">Broadcast to Earth Mesh for Consensus</td>
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
                    <li>Network-level: Webhook spoofing and replay attacks.</li>
                    <li>Execution-level: Floating-point precision leaks.</li>
                    <li>Economic-level: Fraudulent fiat inflation.</li>
                    <li>Governance-level: Unauthorized API key rotation.</li>
                    <li>Telemetry-level: Idempotency cache poisoning.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for idempotency and ed25519 signatures for fiat event authenticity.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Operator slashing for ignoring signed fiat events.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Fiat Abstraction)</h2>
            <p>
                Operators on the mesh execute the incoming `FiatDepositEvent` blindly. They do not communicate with Stripe. Their only requirement is to verify the `orchestrator_signature` proving that the fiat ingress was vetted by the institutional boundary before allocating the credits to the user's on-chain balance.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                The Billing Engine abstracts Stripe processing fees from the internal ledger. If a user pays $100.00, they are minted 10000 cents of network credit; the 2.9% Stripe fee is absorbed entirely by the DAO Treasury's off-chain fiat settlement pipeline to maintain predictable integer economics on-chain.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The revocation or rotation of the Stripe HMAC Secret is governed by a multi-sig Orchestrator deployment process. The DAO does not directly vote on API keys, but enforces the auditing of the fiat-to-credit minted ratios.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ExecTime &le; 2ms</code> for HMAC SHA-256 resolution.</li>
                <li><strong>Throughput Metrics:</strong> Scalable <code>ops_per_sec</code> via Redis-backed <code>O(1)</code> event lookup.</li>
                <li><strong>Network Performance:</strong> Must return HTTP 200 within <code>3s</code> to prevent timeout avalanches.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                Successful billing events cascade to the Affiliate Engine for programmatic distribution and the UI Engine for real-time dashboard updates. Fiat ingress values are mathematically bounded and distributed to the Node Quorum via the Orchestrator's <code>SyncManifest</code> pipeline to guarantee transparent execution solvency.
            </p>

            <h2 id="formal-diagrams">11. Formal Fiat Ingress DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="110" width="120" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Stripe Server</text>

                    <line x1="170" y1="130" x2="250" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <text x="210" y="120" fill="#888" fontSize="11" textAnchor="middle">Webhook</text>

                    <rect x="250" y="60" width="200" height="140" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="90" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator Layer</text>
                    
                    <rect x="270" y="110" width="160" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="130" fill="#888" fontSize="11" textAnchor="middle">1. Verify HMAC</text>

                    <rect x="270" y="150" width="160" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="350" y="170" fill="#888" fontSize="11" textAnchor="middle">2. Sign ED25519 payload</text>

                    <line x1="450" y1="130" x2="550" y2="130" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <rect x="550" y="110" width="150" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="625" y="135" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Earth Mesh (WASM)</text>
                </svg>
            </div>
        </>
    );
}
