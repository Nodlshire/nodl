import React from 'react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function SubstrateGenerators() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Substrate Generators</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    The core AST compilers of the Wnode network. Abstracting boilerplate, enforcing strict bounds, and achieving mathematical parity across thousands of global Node Operators.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Substrate Generators Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Substrate Generators within the Wnode mesh.
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
                In standard decentralized architectures, the "node software" is monolithic. It contains massive switch statements and dynamic memory allocators to handle every possible integration scenario. This is highly inefficient and creates massive attack surfaces.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> Wnode utilizes <code>intgen</code>, <code>nodegen</code>, and <code>spacegen</code> to perform Ahead-Of-Time (AOT) compilation. Instead of a monolithic node, Wnode operators run a lean daemon that dynamically loads only the precise, deterministically generated handlers they are routing. The generators strip away everything except exactly what the <code>spec.yaml</code> demands.
            </p>

            <h2 id="architecture-diagram">Generator Pipeline Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowGen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                        </marker>
                    </defs>
                    
                    {/* Input */}
                    <rect x="50" y="150" width="120" height="60" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" />
                    <text x="110" y="185" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">spec.yaml</text>

                    {/* Master Gen */}
                    <circle cx="280" cy="180" r="40" fill="#1e293b" stroke="#3b82f6" strokeWidth="3" />
                    <text x="280" y="185" fill="#3b82f6" fontSize="12" fontWeight="bold" textAnchor="middle">generate_all</text>

                    <path d="M 170 180 L 230 180" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowGen)" />

                    {/* intgen */}
                    <path d="M 320 180 C 370 180, 370 80, 420 80" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowGen)" />
                    <rect x="430" y="60" width="100" height="40" rx="4" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                    <text x="480" y="85" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">intgen</text>

                    {/* nodegen */}
                    <path d="M 320 180 L 420 180" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowGen)" />
                    <rect x="430" y="160" width="100" height="40" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="480" y="185" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">nodegen</text>

                    {/* spacegen */}
                    <path d="M 320 180 C 370 180, 370 280, 420 280" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowGen)" />
                    <rect x="430" y="260" width="100" height="40" rx="4" fill="#0f172a" stroke="#f43f5e" strokeWidth="2" />
                    <text x="480" y="285" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">spacegen</text>

                    {/* Outputs */}
                    <text x="560" y="75" fill="#94a3b8" fontSize="12" textAnchor="start">- integration.json (Schema)</text>
                    <text x="560" y="95" fill="#94a3b8" fontSize="12" textAnchor="start">- TS SDK / Native Go Stubs</text>

                    <text x="560" y="175" fill="#94a3b8" fontSize="12" textAnchor="start">- Go Handlers (Cgroup bounds)</text>
                    <text x="560" y="195" fill="#94a3b8" fontSize="12" textAnchor="start">- Telemetry Hooks</text>

                    <text x="560" y="275" fill="#94a3b8" fontSize="12" textAnchor="start">- Sharding Strategy logic</text>
                    <text x="560" y="295" fill="#94a3b8" fontSize="12" textAnchor="start">- Quorum Reducer logic</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Compilation Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 300" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowGen" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    <line x1="100" y1="50" x2="100" y2="280" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="400" y1="50" x2="400" y2="280" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="700" y1="50" x2="700" y2="280" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="50" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="100" y="40" fill="white" textAnchor="middle" fontWeight="bold">Developer (CLI)</text>

                    <rect x="350" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="1" />
                    <text x="400" y="40" fill="white" textAnchor="middle" fontWeight="bold">Generators</text>

                    <rect x="650" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="700" y="40" fill="white" textAnchor="middle" fontWeight="bold">Filesystem</text>

                    <line x1="100" y1="80" x2="390" y2="80" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowGen)" />
                    <text x="250" y="75" fill="#cbd5e1" textAnchor="middle">1. Run generate_all</text>

                    <rect x="385" y="100" width="30" height="100" fill="#3b82f6" fillOpacity="0.2" stroke="#3b82f6" />
                    <text x="375" y="120" fill="#94a3b8" textAnchor="end">2. Parse AST</text>
                    <text x="375" y="140" fill="#94a3b8" textAnchor="end">3. Build Structs</text>
                    <text x="375" y="160" fill="#94a3b8" textAnchor="end">4. Resolve Types</text>
                    <text x="375" y="180" fill="#94a3b8" textAnchor="end">5. Gen Handlers</text>

                    <line x1="400" y1="210" x2="690" y2="210" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#seqArrowGen)" />
                    <text x="550" y="205" fill="#cbd5e1" textAnchor="middle">6. Write .go / .ts / .json</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Generator Implementation Example</h2>
            <CodeBlock language="go" title="nodld/cmd/nodegen/main.go (AST Construction)">{`// Nodegen uses the Go \`text/template\` and \`go/ast\` packages to emit safe code.
func generateHandler(spec *IntegrationSpec) ([]byte, error) {
    tmpl := \`
package {{.PackageName}}
import "context"

type {{.StructName}} struct {
    Runtime NativeGoRuntime
}

func (h *{{.StructName}}) Limits() ResourceBounds {
    return ResourceBounds{
        CPU: {{.CPU}},
        RAM: "{{.RAM}}",
    }
}\`
    
    t, _ := template.New("handler").Parse(tmpl)
    var buf bytes.Buffer
    t.Execute(&buf, spec)
    
    // Pass through gofmt to ensure syntactical correctness before writing
    return format.Source(buf.Bytes())
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>AST Parsing Failure:</strong> If the <code>spec.yaml</code> contains invalid types (e.g. passing a string to a boolean field), <code>intgen</code> fails immediately with a strict line-number error. Code generation is aborted, preventing malformed stubs from polluting the workspace.</li>
                <li><strong>Partial Writes:</strong> Generators write to memory buffers first. The filesystem write is atomic. If the generator crashes midway, no partial/corrupted files are left on disk.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> Generators cannot execute external code. They operate purely on static file analysis. This prevents a malicious `spec.yaml` from triggering remote code execution (RCE) during the CI/CD pipeline.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The Master Generator utilizes Go routines to process integrations concurrently. Compiling the ASTs for all 600+ integrations on the Wnode mesh takes approximately <code>~1.2 seconds</code> on a standard developer laptop.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Operators do not run the generators. They consume the compiled output provided by the Orchestrator's synchronization channel.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Must run <code>generate_all</code> locally to produce the footprint, and commit both the spec and the footprint. Do not modify the output.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <p className="text-slate-300 leading-relaxed mb-6">Generators emit build-time telemetry to the terminal stdout for CI/CD ingestion:</p>
            <CodeBlock language="json" title="Generator stdout log">{`{
  "event": "generation_complete",
  "integration_id": "190001-0626-01-IN",
  "intgen_ms": 12,
  "nodegen_ms": 8,
  "spacegen_ms": 4,
  "status": "success"
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The generated <code>integration.json</code> from <code>intgen</code> is ingested by the <strong>Orchestrator</strong> at runtime. The Go handlers generated by <code>nodegen</code> are ingested by the <strong>Node Operators</strong>.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Manual Overrides">
                Never edit files inside a directory marked <code>/generated/</code>. If you find a bug in the generated handler, you must fix the logic inside the <code>nodegen</code> compiler itself, not the output file. Wnode relies on 100% reproducible generation.
            </Callout>
        </>
    );
}
