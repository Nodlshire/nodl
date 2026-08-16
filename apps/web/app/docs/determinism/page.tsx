import React from 'react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function Determinism() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Determinism & Reproducibility</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    Achieving mathematical parity across heterogeneous global infrastructure through strict Native Go bounds and pure functional paradigms.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Determinism & Reproducibility Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Determinism & Reproducibility within the Wnode mesh.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-cyan-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">WHY IT MATTERS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Architectural Purpose</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Ensures zero-custody verification, high-throughput execution, and fault-tolerant node consensus across Earth &amp; Space mesh topologies.
                    </p>
                </div>

                <div className="bg-slate-900/80 p-6 rounded-2xl border border-purple-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-400">HOW IT OPERATES</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Native Go Engine</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Executed via SECCOMP-restricted Native Go modules (`linux-amd64`), validated with mTLS telemetry signatures and HMAC routing epochs.
                    </p>
                </div>
            </div>

            </div>

            <h2 id="conceptual-overview">Conceptual Overview & Rationale</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                In a centralized system, non-determinism is an annoyance (e.g., a flaky test). In a decentralized compute mesh relying on Quorum Reduction, non-determinism is a catastrophic failure. If Node A and Node B run the exact same Native Go payload but return different output hashes, the Orchestrator cannot achieve quorum.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> Wnode enforces determinism at the compiler level. By utilizing SECCOMP Sandbox and stripping out host bindings, we eliminate the primary vectors for non-determinism: system clocks, pseudo-random number generators (PRNGs), network I/O, and concurrent thread racing.
            </p>

            <h2 id="architecture-diagram">Determinism Enforcement Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 300" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowDet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="50" width="200" height="200" rx="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                    <text x="150" y="80" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Native Go Sandbox</text>

                    {/* Prohibited actions */}
                    <rect x="70" y="100" width="160" height="30" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
                    <text x="150" y="120" fill="#f43f5e" fontSize="12" textAnchor="middle" style={{textDecoration: 'line-through'}}>Date.now() / Clock</text>

                    <rect x="70" y="150" width="160" height="30" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
                    <text x="150" y="170" fill="#f43f5e" fontSize="12" textAnchor="middle" style={{textDecoration: 'line-through'}}>Math.random()</text>

                    <rect x="70" y="200" width="160" height="30" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
                    <text x="150" y="220" fill="#f43f5e" fontSize="12" textAnchor="middle" style={{textDecoration: 'line-through'}}>fetch() / I/O</text>

                    <path d="M 250 150 L 350 150" fill="none" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#arrowDet)" />

                    {/* Result */}
                    <rect x="360" y="100" width="180" height="100" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="450" y="130" fill="#10b981" fontSize="14" fontWeight="bold" textAnchor="middle">Pure Output (f(x) = y)</text>
                    <text x="450" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">Guaranteed identical hash</text>
                    <text x="450" y="170" fill="#94a3b8" fontSize="10" textAnchor="middle">across all CPU architectures</text>

                    <rect x="600" y="130" width="150" height="40" rx="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                    <text x="675" y="155" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Quorum Validation</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Non-Deterministic Slashing Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowDet" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="650" y1="50" x2="650" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">Space Node A</text>

                    <rect x="600" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                    <text x="650" y="40" fill="white" textAnchor="middle" fontWeight="bold">Orchestrator</text>

                    <line x1="650" y1="80" x2="160" y2="80" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowDet)" />
                    <text x="400" y="75" fill="#cbd5e1" textAnchor="middle">1. Push Shard Payload (Seed: 42)</text>

                    <rect x="135" y="100" width="30" height="30" fill="#f43f5e" fillOpacity="0.2" stroke="#f43f5e" />
                    <text x="125" y="115" fill="#94a3b8" textAnchor="end">2. Modifies Native Go</text>
                    <text x="125" y="130" fill="#f43f5e" textAnchor="end">to inject fake math</text>

                    <line x1="150" y1="160" x2="640" y2="160" stroke="#f43f5e" strokeWidth="2" markerEnd="url(#seqArrowDet)" />
                    <text x="400" y="155" fill="#cbd5e1" textAnchor="middle">3. Return Hash: 0x999 (Fake)</text>

                    <rect x="635" y="180" width="30" height="40" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                    <text x="675" y="195" fill="#94a3b8" textAnchor="start">4. Compare against Node B (0x123)</text>
                    <text x="675" y="210" fill="#f43f5e" textAnchor="start">5. Quorum Mismatch -> Slash Node A</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Deterministic RNG Workaround</h2>
            <p className="text-slate-300 leading-relaxed mb-6">If your logic requires randomness (e.g. shuffling a deck of cards), you cannot use <code>rand()</code>. You must pass a cryptographically secure seed via the payload and use a deterministic PRNG.</p>
            <CodeBlock language="go" title="src/lib.rs (Seeded PRNG inside Native Go)">{`use rand::prelude::*;
use rand_chacha::ChaCha8Rng;

#[no_mangle]
pub extern "C" fn shuffle(ptr: *const u8, len: usize) -> *mut u8 {
    let payload = unsafe { std::slice::from_raw_parts(ptr, len) };
    
    // Parse the payload. It MUST contain a seed generated by the DApp client.
    let seed: u64 = parse_seed_from_payload(payload);
    
    // Initialize a deterministic ChaCha PRNG with the provided seed
    let mut rng = ChaCha8Rng::seed_from_u64(seed);
    
    let mut deck = vec![1, 2, 3, 4, 5];
    deck.shuffle(&mut rng); // This will shuffle identically on all nodes
    
    // ... return logic
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Float Drift:</strong> Floating-point arithmetic (<code>f32</code>, <code>f64</code>) can exhibit microscopic drift across different CPU architectures (x86 vs ARM64) due to varying instruction sets. Wnode highly recommends using integer math or fixed-point arithmetic crates in Go for financial calculations.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> The Native Go sandbox operates in total isolation from the host clock. If an integration needs to know the "current time" to validate an expiration window, the Orchestrator injects an authoritative, synchronized <code>timestamp</code> field into the payload before routing.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Enforcing determinism imposes zero performance overhead at runtime. Because SECCOMP Sandbox natively lacks these bindings, there are no "interceptor" checks slowing down the execution.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Run any CPU architecture you want. The Native Go byte-code compilation ensures your AMD EPYC produces the exact same binary output as an ARM graviton processor.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Do not use floats for financial math. Use deterministic seeding for randomness. Pass all required external state into the payload.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <p className="text-slate-300 leading-relaxed mb-6">When a non-deterministic result is caught by the Orchestrator:</p>
            <CodeBlock language="json" title="Quorum Resolution">{`{
  "event": "quorum_resolution",
  "job_id": "job_123",
  "shard_id": 4,
  "consensus_hash": "0x123",
  "deviant_nodes": ["0xabc_node_A"],
  "action": "slash_deviants"
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                Determinism is the foundation of the Space Mesh. Without it, the Orchestrator's MapReduce Quorum reducer cannot safely accept cross-referenced payloads from untrusted edge hardware.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Timestamps inside Native Go">
                Never attempt to compile a Go crate like <code>chrono</code> that relies on system time. The compilation to <code>linux-amd64</code> will succeed, but it will panic immediately when it tries to hit the stubbed SECCOMP Sandbox syscall.
            </Callout>

        </>
    );
}
