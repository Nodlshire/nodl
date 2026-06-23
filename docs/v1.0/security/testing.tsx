import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Testing & Verification | WeNode',
    description: 'Formal specification of the deterministic CI/CD pipeline verifying substrate integrity.',
};

export default function TestingPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Testing & Verification</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Strict CI/CD invariants and algorithmic test bounds guaranteeing deterministic execution prior to network deployment.
            </p>

            <h2 id="formal-execution-semantics">1. Formal Execution Semantics</h2>
            <p>
                The Testing & Verification engine enforces static analysis and dynamic fuzzing as mandatory pre-conditions to deployment. It mathematically guarantees that compiled substrates contain zero imported system calls (WASI) and bound all memory allocations within the 32MB heap limit. Substrates are verified locally using identical runtime environments (Wazero) to prevent environment-specific branching logic. The local verification mimics the canonical single linear memory model, ensuring processing matches the required DAG topological order. The sandbox perfectly mimics the strict network isolation (no WASI, no syscalls, no network, no filesystem), validating adherence to <code>Ptr &isin; [0, HeapSize)</code> and <code>Len &le; MaxBlock</code>. Fuzzed faults trigger and map identically to live standardized trap paths.
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
                            <td className="p-4 font-mono text-blue-400">Isolation Guarantee</td>
                            <td className="p-4">WASM_Imports &cap; System_Calls == &empty;</td>
                            <td className="p-4">Static analysis for syscall imports.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Performance Bound</td>
                            <td className="p-4">&forall; payload &isin; Fuzz_Set: ExecTime &le; 50ms</td>
                            <td className="p-4">Fuzz-driven latency checks.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">CI Verification</td>
                            <td className="p-4">CI_Exit_Code = (Violations &gt; 0) ? 1 : 0</td>
                            <td className="p-4">Hard pipeline termination.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="formal-interfaces">3. Formal Interface Definitions</h2>
            <p>
                Developers interface with the testing engine via the `wnode` CLI tool, which wrappers the exact Rust/Go parsing logic used by the live node operators.
            </p>
            <div className="bg-[#0f172a] rounded-lg p-6 border border-white/10 font-mono text-sm mb-8 text-emerald-300">
<pre className="m-0 bg-transparent border-0">{`// Testing Interface
$ wnode verify ./build/contract.wasm
> Analysing exports... OK [alloc, invoke]
> Checking imports... OK [none]
> Running 10,000 fuzz cycles... OK
> Exit code: 0`}</pre>
            </div>

            <h2 id="state-transition">4. State Transition Examples (CI Pipeline Lifecycle)</h2>
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
                            <td className="p-4 text-slate-300">Compilation</td>
                            <td className="p-4">Source &rarr; `cargo build --target wasm32-unknown-unknown`</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-slate-300">Static Analysis</td>
                            <td className="p-4">Binary parsed for floating point ops (rejected if found)</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-emerald-400">Gas Metering</td>
                            <td className="p-4">Middleware injected to track instruction limits</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-blue-400">Dynamic Fuzzing</td>
                            <td className="p-4">Engine feeds 50,000 randomized JSON payloads to `invoke()`</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 text-purple-400">Commit Finality</td>
                            <td className="p-4">Output hash signed, confirming readiness for live mesh</td>
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
                    <li>Network-level: CI/CD pipeline compromise.</li>
                    <li>Execution-level: Resource exhaustion (Halting Problem).</li>
                    <li>Economic-level: Free off-chain fuzzing abuse.</li>
                    <li>Governance-level: Unauthorized Wazero parameter upgrades.</li>
                    <li>Telemetry-level: Falsified test success signatures.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: blake3 hashing for binary commitments and ed25519 signatures for CI approvals.</li>
                    <li>Deterministic Execution Rules: Strict pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: Local operator rejection of unsigned or invalid binaries bypassing CI.</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="operator-lifecycle">6. Operator Lifecycle (Verification)</h2>
            <p>
                Live Node Operators never compile code. They receive raw compiled `.wasm` bytecode. Before instantiating it, the node daemon (`nodld`) runs the exact same static analysis check the CI pipeline ran (validating exports/imports). If a malicious contract somehow bypassed CI, the live operators will automatically reject the binary format.
            </p>

            <h2 id="economic-model">7. Economic Model</h2>
            <p>
                Testing is entirely off-chain and free. This allows developers to simulate millions of transactions locally to optimize their instruction count, thereby directly reducing the gas fees their users will eventually pay on the live network.
            </p>

            <h2 id="governance-model">8. Governance Model</h2>
            <p>
                The `wnode` CLI is open source and version-controlled. Any changes to the underlying simulation environment (e.g., updating the Wazero version or changing the gas cost of a WASM instruction) must parallel the on-chain parameter upgrades governed by the DAO.
            </p>

            <h2 id="performance">9. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-6 text-slate-300">
                <li><strong>Latency Bounds:</strong> `wnode verify` completes in <code>ExecTime &le; 5s</code> for a standard 500KB module.</li>
                <li><strong>Resource Pressure:</strong> CI enforces a strict <code>mem_pressure_mb &le; 32MB</code> linear heap maximum.</li>
                <li><strong>Throughput Metrics:</strong> Substrates exceeding 2MB are algorithmically rejected to preserve P2P <code>msgs_per_sec</code>.</li>
            </ul>

            <h2 id="cross-component">10. Cross-Component Contracts</h2>
            <p>
                The Testing suite perfectly mirrors the WEX sandbox. It strictly validates that the <code>(ptr: i32, len: i32)</code> ABI is used, that linear memory boundaries are respected, and that there are zero references to host-level bindings, ensuring that code executing locally with exit code <code>0</code> has a mathematical guarantee of running without panics on the globally distributed mesh.
            </p>

            <h2 id="formal-diagrams">11. Formal Verification DAG</h2>
            <div className="my-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 800 300" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <rect x="50" y="80" width="120" height="40" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="105" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Compiled .wasm</text>

                    <line x1="170" y1="100" x2="250" y2="100" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />

                    <rect x="250" y="50" width="160" height="100" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" strokeDasharray="4 4" />
                    <text x="330" y="75" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">wnode CLI</text>
                    <rect x="270" y="90" width="120" height="20" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="330" y="104" fill="#888" fontSize="11" textAnchor="middle">Static Analysis</text>
                    <rect x="270" y="115" width="120" height="20" rx="4" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="330" y="129" fill="#888" fontSize="11" textAnchor="middle">Payload Fuzzing</text>

                    <line x1="410" y1="80" x2="490" y2="60" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <text x="450" y="65" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">PASS</text>

                    <line x1="410" y1="120" x2="490" y2="140" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    <text x="450" y="145" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">TRAP</text>
                </svg>
            </div>
        </>
    );
}
