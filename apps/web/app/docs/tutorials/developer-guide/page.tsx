import React from 'react';
import Callout from '../../../../components/docs/Callout';
import CodeBlock from '../../../../components/docs/CodeBlock';

export default function DeveloperGuide() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Developer Guide</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    Shift from imperative microservices to declarative orchestration. How to build fast, secure integrations on the Substrate Model.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Developer Guide Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Developer Guide within the Wnode mesh.
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
                Developers are used to writing imperative code: "fetch this, then process that, then save to DB." In a decentralized MapReduce environment, imperative logic breaks down when shards fail, nodes drop off, or networks partition.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> Wnode forces you to program declaratively. You define the shape of your compute (the <code>spec.yaml</code>), and you provide a pure, side-effect-free Native Go binary to execute the math. The Orchestrator handles the imperative retries, network boundaries, and consensus.
            </p>

            <h2 id="architecture-diagram">Integration Development Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowDev" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    
                    {/* Dev Env */}
                    <rect x="50" y="50" width="200" height="250" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="150" y="80" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Local Environment</text>

                    <rect x="70" y="100" width="160" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="150" y="125" fill="white" fontSize="12" textAnchor="middle">1. Edit spec.yaml</text>

                    <rect x="70" y="160" width="160" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="150" y="185" fill="white" fontSize="12" textAnchor="middle">2. Code Go (Native Go)</text>

                    <rect x="70" y="220" width="160" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="150" y="245" fill="white" fontSize="12" textAnchor="middle">3. Run generate_all</text>

                    <path d="M 250 175 L 350 175" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowDev)" />

                    {/* CI Env */}
                    <rect x="360" y="100" width="180" height="150" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="450" y="130" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">CI/CD Pipeline</text>

                    <rect x="380" y="160" width="140" height="60" rx="4" fill="#1e293b" stroke="#10b981" strokeWidth="1" />
                    <text x="450" y="185" fill="#10b981" fontSize="10" textAnchor="middle">verify_substrate</text>
                    <text x="450" y="200" fill="#94a3b8" fontSize="10" textAnchor="middle">(AST Parity Check)</text>

                    <path d="M 540 175 L 640 175" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowDev)" />

                    {/* Production */}
                    <rect x="650" y="135" width="100" height="80" rx="4" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" />
                    <text x="700" y="165" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Mainnet</text>
                    <text x="700" y="185" fill="#94a3b8" fontSize="10" textAnchor="middle">Available globally</text>
                    <text x="700" y="200" fill="#94a3b8" fontSize="10" textAnchor="middle">in 45 seconds</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Developer Workflow Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 200" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowDev" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    <line x1="200" y1="50" x2="200" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="600" y1="50" x2="600" y2="180" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="150" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="200" y="40" fill="white" textAnchor="middle" fontWeight="bold">Local IDE</text>

                    <rect x="550" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="600" y="40" fill="white" textAnchor="middle" fontWeight="bold">Compiler</text>

                    <line x1="200" y1="80" x2="590" y2="80" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowDev)" />
                    <text x="400" y="75" fill="#cbd5e1" textAnchor="middle">1. write src/lib.rs</text>

                    <line x1="200" y1="110" x2="590" y2="110" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowDev)" />
                    <text x="400" y="105" fill="#cbd5e1" textAnchor="middle">2. go build -o native_binary  --target linux-amd64</text>

                    <line x1="600" y1="150" x2="210" y2="150" stroke="#10b981" strokeWidth="2" markerEnd="url(#seqArrowDev)" />
                    <text x="400" y="145" fill="#10b981" textAnchor="middle">3. validate.native generated (850kb)</text>
                </svg>
            </div>

            <h2 id="real-code-examples">The Pure Function Paradigm</h2>
            <CodeBlock language="go" title="src/lib.rs (No Side Effects)">{`// This function is "Pure". It takes an input, does math, and returns output.
// It does NOT make HTTP requests. It does NOT read a filesystem.
#[no_mangle]
pub extern "C" fn calculate_shard(ptr: *const u8, len: usize) -> *mut u8 {
    let payload = unsafe { std::slice::from_raw_parts(ptr, len) };
    
    // BAD: reqwest::get("https://api.price.com") // Will instantly panic in Go Sandbox
    
    // GOOD: The payload should already contain all the data needed for compute
    let result = complex_cryptographic_verification(payload);
    
    let mut vec = result.into_bytes();
    vec.shrink_to_fit();
    let res_ptr = vec.as_mut_ptr();
    std::mem::forget(vec);
    res_ptr
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Network Bound Failures:</strong> Attempting to import networking libraries into your Go Native Go target will either fail to compile, or compile but instantly panic at runtime because Go Sandbox concrete implementations all host-network bindings to throw <code>ErrNoSys</code>. </li>
                <li><strong>Non-Deterministic Native Go:</strong> If your Native Go binary relies on a random number generator (RNG) and it executes on the Space Mesh, Shard 1 on Node A will return a different hash than Shard 1 on Node B. The Orchestrator's Quorum anchor will reject both results as a mismatch. Native Go logic MUST be 100% deterministic.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> Data provided to your Native Go binary is trusted. The Orchestrator has already validated the HMAC signature and the nonce. Do not waste precious Native Go compute cycles attempting to re-validate authentication.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                A standard `spec.yaml` node execution should complete in under <code>200ms</code>. The timeout limits are strictly enforced. If you provide an <code>O(n^2)</code> algorithm in your Native Go and the payload grows too large, the node will kill the job mid-execution. Optimize your Go data structures (e.g. use <code>BTreeMap</code> instead of iterating large arrays).
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">(N/A for developers. Operators provide the raw power).</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Design your data. If you are building a Space Mesh MapReduce job, ensure the payload can be cleanly sharded into chunks that do not rely on each other's state.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <p className="text-slate-300 leading-relaxed mb-6">The developer does not emit telemetry directly. The generated Go wrappers catch your Go panics and emit them automatically:</p>
            <CodeBlock language="json" title="Auto-emitted Fault">{`{
  "event": "execution_panic",
  "integration_id": "190001-0626-01-IN",
  "error": "panic at src/lib.rs:42 - index out of bounds",
  "job_id": "job_9x8c7v"
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The developer interacts almost exclusively with the <code>spec.yaml</code> and the Go toolchain. The output interacts with the CI Verifier, which then passes it to the Orchestrator, which distributes it to the Operators.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Bloated Native Go">
                Do not compile massive binaries. If your `.native` file is 30MB, Node Operators will experience massive cold-start latency when downloading your substrate upgrade. Strip symbols and optimize for size.
            </Callout>
            <Callout type="best-practice" title="Best Practice: Pass Data In">
                Since Native Go cannot fetch data, design your DApp client (the one triggering the SDK) to fetch all required external state, bundle it into the JSON payload, and send it <em>into</em> the mesh for stateless verification.
            </Callout>
        </>
    );
}
