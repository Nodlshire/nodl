import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Diagram Library | WeNode',
    description: 'Centralized repository of SVG topological bounds and architectural state machines.',
};

export default function DiagramsPage() {
    return (
        <>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Diagram Library</h1>
            <p className="text-xl text-slate-400 mb-8 border-b border-white/10 pb-8">
                Formal visual specifications modeling topological trust boundaries, execution sequences, and data provenance flows.
            </p>

            <h2 id="architectural-contract">1. Architectural Contract</h2>
            <ul className="list-none pl-0 mb-8 space-y-4 text-slate-300">
                <li><strong className="text-white">Definition:</strong> The formal visual specification modeling topological boundaries and data provenance.</li>
                <li><strong className="text-white">Responsibilities:</strong> Translates hard architectural constraints into declarative SVG state machines.</li>
                <li><strong className="text-white">Guarantees:</strong> 1:1 parity with the underlying Go and Go execution codebases.</li>
                <li><strong className="text-white">Requirements:</strong> Inline SVG implementation, zero external image requests, single linear memory modeling, DAG topological execution mapping, Native Go sandbox boundary delineation (no WASI/syscalls), pointer bound visual representation (<code>Ptr &isin; [0, HeapSize)</code>, <code>Len &le; MaxBlock</code>), and trap fault visualization.</li>
                <li><strong className="text-red-400">Prohibitions:</strong> Illustrative abstractions and raster graphics (PNG/JPG).</li>
            </ul>

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
                            <td className="p-4 font-mono text-blue-400">Layout Shift</td>
                            <td className="p-4">Layout_Shift(SVG) == 0</td>
                            <td className="p-4">Zero runtime layout shifting.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Rendering</td>
                            <td className="p-4">Render(SVG) &equiv; Deterministic</td>
                            <td className="p-4">Declarative inline SVGs.</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Solid Lines</td>
                            <td className="p-4">Synchronous Data Flow</td>
                            <td className="p-4">TCP/RPC blocking calls</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Dashed Lines</td>
                            <td className="p-4">Asynchronous Acknowledgment</td>
                            <td className="p-4">WebSocket pub/sub</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Red Boundaries</td>
                            <td className="p-4">Untrusted Space</td>
                            <td className="p-4">External Network / Host OS</td>
                        </tr>
                        <tr className="hover:bg-white/[0.02]">
                            <td className="p-4 font-mono text-blue-400">Green Boundaries</td>
                            <td className="p-4">Cryptographically Proven State</td>
                            <td className="p-4">ED25519 Verified Payloads</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2 id="inputs-outputs">3. Inputs & Outputs</h2>
            <p>Inputs: Systemic architectural blueprints. Outputs: Declarative SVG markup.</p>

            <h2 id="responsibilities">4. Responsibilities</h2>
            <p>Maintain 1:1 parity with the actual Go and Go codebases. If code diverges, the diagram must be updated in tandem via PR.</p>

            <h2 id="boundaries">5. Boundaries</h2>
            <p>Diagrams strictly map the OSI layers 4 through 7.</p>

            <h2 id="threat-model">6. Threat Model Detail</h2>
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
                    <li>Network-level: Subversion of visual specification flows.</li>
                    <li>Execution-level: Asynchronous diagram drift versus sync execution.</li>
                    <li>Economic-level: Diagrammatic misrepresentation of fee structures.</li>
                    <li>Governance-level: Unapproved diagram state changes.</li>
                    <li>Telemetry-level: Inaccurate bounding box mappings.</li>
                </ul>
            </div>
            <div className="mb-6">
                <strong>Mitigation Structure:</strong>
                <ul className="list-disc pl-6 mt-2 text-slate-300">
                    <li>Cryptographic Guarantees: Diagrams must reflect exact blake3 hashed workflows and ed25519 authenticated flows.</li>
                    <li>Deterministic Execution Rules: Strict visual alignment with pointer bounds, single linear memory, no syscalls, and no external entropy.</li>
                    <li>Economic Disincentives: N/A (Declarative visual layer).</li>
                </ul>
            </div>
            <p className="text-slate-300 mb-8">
                The <strong>Operator</strong> adheres to strict slashing rules, quorum assumptions, uptime guarantees, and telemetry verification rules. The <strong>Orchestrator</strong> acts strictly untrusted, fully verifiable, and bounded by deterministic rules. The <strong>Substrate</strong> maintains the principles of no syscalls, no nondeterminism, no external entropy, and strict pointer bounds.
            </p>

            <h2 id="performance">8. Performance Envelopes</h2>
            <ul className="list-disc pl-6 mb-8 text-slate-300">
                <li><strong>Resource Pressure:</strong> Inline SVGs exclusively, zero external image requests.</li>
                <li><strong>Network Performance:</strong> <code>CLS = 0</code> (Zero runtime layout shift).</li>
            </ul>

            <h2 id="cross-component">9. Cross-Component Interactions</h2>
            <p>Diagrams reference Orchestrator, Node Daemon, and Generator repos. They strictly model the canonical <code>(ptr: i32, len: i32)</code> ABI and <code>SyncManifest</code> boundaries.</p>

            <h2 id="telemetry">10. Telemetry Emitted</h2>
            <p>N/A.</p>

            <h2 id="best-practices">11. Best Practices & Anti-Patterns</h2>
            <div className="my-6 bg-red-950/20 border border-red-500/20 rounded-lg p-6 flex gap-4">
                <svg className="w-6 h-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <h4 className="text-red-400 font-bold mt-0 mb-2">Anti-Pattern: PNG/JPG Inclusion</h4>
                    <p className="text-slate-300 text-sm m-0">
                        Embedding raster graphics. All diagrams must be declarative SVGs embedded within the JSX to ensure zero network latency, semantic accessibility, and deterministic rendering across all viewports.
                    </p>
                </div>
            </div>

            <h2 id="visual-architecture">12. Visual Architecture</h2>
            <p className="text-slate-300 mb-4 font-bold">12.1 The Orchestrator Ingestion Pipeline</p>
            <div className="mb-10 bg-[#111] border border-[#444] rounded-xl p-8 overflow-hidden">
                <svg viewBox="0 0 600 250" className="w-full h-auto">
                    <defs>
                        <marker id="arrowSolid" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#444" />
                        </marker>
                    </defs>
                    <rect x="50" y="50" width="120" height="150" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="110" y="80" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Web Client</text>
                    <text x="110" y="125" fill="#888" fontSize="11" textAnchor="middle">Submits tx()</text>

                    <line x1="170" y1="120" x2="290" y2="120" stroke="#444" strokeWidth="1.5" markerEnd="url(#arrowSolid)" />
                    
                    <rect x="300" y="50" width="250" height="150" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="425" y="80" fill="#ccc" fontSize="14" textAnchor="middle" fontWeight="bold">Orchestrator Gateway</text>
                    <rect x="330" y="100" width="190" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="425" y="120" fill="#888" fontSize="11" textAnchor="middle">1. Validate ED25519</text>
                    <rect x="330" y="140" width="190" height="30" rx="8" fill="#111" stroke="#444" strokeWidth="1.5" />
                    <text x="425" y="160" fill="#888" fontSize="11" textAnchor="middle">2. Append Monotonic Nonce</text>
                </svg>
            </div>
        </>
    );
}
