import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Substrate Generators | WeNode',
    description: 'Formal architectural specification of the intgen, nodegen, and spacegen compilers.',
};

export default function SubstrateGeneratorsPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Substrate Generators</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Formal specification of the deterministic compilers responsible for mapping YAML specifications to pure-functional WebAssembly representations.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The `intgen` compiler parses declarative YAML into a pure-functional AST. The AST mapping is deterministically ordered lexicographically by key to guarantee a byte-identical code output across `linux/amd64`, `linux/arm64`, and `darwin/arm64` hosts. The memory model restricts the generated Rust structures to `[#repr(C)]` bounded alignment without heap-allocated vectors, ensuring zero garbage collection overhead.
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
                            <td className="p-4 font-mono text-blue-400">Compilation Function</td>
                            <td className="p-4">Compiler_Output = &Omega;(YAML_Spec, AST_Rules)</td>
                            <td className="p-4">Deterministic pure-functional AST mapping.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Hashing Standard</td>
                            <td className="p-4">H = blake3(bytes)</td>
                            <td className="p-4">Cryptographic integrity of compiled binaries.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Divergence Slashing</td>
                            <td className="p-4">if hash(A) &ne; hash(B) &rarr; slash(minority)</td>
                            <td className="p-4">Consensus enforcement of compiled logic.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                The `intgen` generator outputs a rigid JSON metadata file mapping the pointer sizes of the generated WASM binary, required by the Orchestrator for dynamic loading:
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`{
  "substrate_name": "wnode-token",
  "wasm_export": "_start_execution",
  "memory_layout": {
    "payload_offset": 0,
    "payload_max_bytes": 1024,
    "state_offset": 1024,
    "state_max_bytes": 16384
  }
}`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (Compilation)</h2>
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
                            <td className="p-4 text-slate-300">Input Spec</td>
                            <td className="p-4">struct: Token {"{ balance: u64 }"}</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Intermediate AST</td>
                            <td className="p-4">repr(C) Struct Definition</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Target Output</td>
                            <td className="p-4">Token_bg.wasm (1.2 MB)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Target Go Stubs</td>
                            <td className="p-4">types_gen.go (400 Bytes)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">H(Output)</td>
                            <td className="p-4">blake3: 0x9a8b7c6d...</td>
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
                    <li>Network-level: Tampering with binary distribution.</li>
                    <li>Execution-level: Injecting infinite loops or malicious pointer math via YAML schemas.</li>
                    <li>Economic-level: Substrate deployment spam.</li>
                    <li>Governance-level: Poisoning the compiler core via unauthorized upgrades.</li>
                    <li>Telemetry-level: False compilation metrics.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for AST integrity and ed25519 signatures.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Substrate deployment listing fees and network-wide rejection.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> assumes strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The compiled <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle within Substrate</h2>
            <p>
                Node operators do not compile substrates manually. They ingest pre-compiled WASM binaries verified by the DAO. The operator lifecycle involves `Fetching_Substrate` &rarr; `Verifying_Hash` &rarr; `JIT_Compilation` &rarr; `Serving_State`.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Substrate generation occurs strictly off-chain within CI/CD pipelines or local development environments. It incurs $0 execution fees. Substrate deployment requires a `DAO_SUBSTRATE_LISTING` fee equivalent to $500 in WNODE tokens to prevent network spam.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                Upgrading the `intgen` compiler itself requires a formal `DAO_CORE_UPGRADE` vote. Substrates generated by a non-consecrated version of `intgen` will result in a global hash mismatch during network propagation, immediately isolating the propagating nodes.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> <code>ExecTime &le; 50ms</code> for AST Parsing.</li>
                <li><strong>Warm vs Cold Start:</strong> <code>ColdStart = initial WASM instantiation</code> &le; 2ms.</li>
                <li><strong>Resource Pressure:</strong> Constrained <code>mem_pressure_mb</code> during LLVM compilation.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                The compiler outputs two hard contracts: the `.wasm` file for the `nodld` runtime, and the `.go` stubs for the Earth Mesh API gateway. The generated `.wasm` rigidly enforces the canonical <code>(ptr: i32, len: i32)</code> pointer-length ABI, ensuring strict linear memory boundaries and zero host-level bindings (no WASI or syscalls). The timing guarantee assumes that once a new WASM hash is proposed via the DAO, it takes 48 hours for the network to gossip and cache the new binary globally.
            </p>

            <h2 id="formal-diagrams">11. Formal Compiler Pipeline DAG</h2>
            <div className="my-10 bg-[#0d1117] border border-white/10 rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <defs>
                        <marker id="arrowGen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <rect x="50" y="130" width="100" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="100" y="155" fill="#888" fontSize="12" textAnchor="middle">spec.yaml</text>

                    <line x1="150" y1="150" x2="250" y2="150" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowGen)" />

                    <circle cx="300" cy="150" r="50" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="300" y="145" fill="#10b981" fontSize="16" textAnchor="middle" fontWeight="bold">intgen</text>
                    <text x="300" y="165" fill="#888" fontSize="10" textAnchor="middle">AST Parser</text>

                    <line x1="350" y1="130" x2="450" y2="80" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowGen)" />
                    <rect x="450" y="60" width="120" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="510" y="85" fill="#888" fontSize="12" textAnchor="middle">LLVM Compilation</text>

                    <line x1="570" y1="80" x2="650" y2="80" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowGen)" />
                    <rect x="650" y="60" width="100" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="700" y="85" fill="#888" fontSize="12" textAnchor="middle">Target .wasm</text>

                    <line x1="350" y1="170" x2="450" y2="220" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowGen)" />
                    <rect x="450" y="200" width="120" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="510" y="225" fill="#888" fontSize="12" textAnchor="middle">Go API Generation</text>

                    <line x1="570" y1="220" x2="650" y2="220" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowGen)" />
                    <rect x="650" y="200" width="100" height="40" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="700" y="225" fill="#888" fontSize="12" textAnchor="middle">types_gen.go</text>
                </svg>
            </div>
        </>
    );
}
