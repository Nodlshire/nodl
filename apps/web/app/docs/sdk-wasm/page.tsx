import React from 'react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function SdkWasmStubs() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">SDK & WASM Stubs</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed">
                    Bridging external applications to the mesh via deterministically generated TypeScript clients and securely sandboxed WebAssembly execution logic.
                </p>
            </div>

            <h2 id="conceptual-overview">Conceptual Overview & Rationale</h2>
            <p>
                In a standard ecosystem, developers manually craft HTTP clients and server-side endpoints. In the Wnode ecosystem, doing this manually is forbidden because it breaks the cryptographic guarantees of the mesh.
            </p>
            <p>
                <strong>The Rationale:</strong> The Wnode Master Generator (<code>intgen</code>) produces a TypeScript SDK that wraps the complex HMAC signing and Nonce logic. For complex node-side compute, the generator produces Rust WASM stubs. This forces the developer into the "pit of success" by ensuring their custom logic exactly matches the memory bounds and data shapes defined in the <code>spec.yaml</code>.
            </p>

            <h2 id="architecture-diagram">SDK & WASM Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowWasm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                    </defs>
                    
                    {/* DApp Side */}
                    <rect x="50" y="50" width="200" height="250" rx="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="150" y="80" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">DApp Backend (Node.js)</text>

                    <rect x="70" y="110" width="160" height="60" rx="4" fill="#0f172a" stroke="#3b82f6" strokeWidth="2" />
                    <text x="150" y="135" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Generated TS SDK</text>
                    <text x="150" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">(Auto-signs payloads)</text>

                    {/* Network */}
                    <path d="M 230 140 L 400 140" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowWasm)" />
                    <text x="315" y="130" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">POST /submit</text>

                    {/* Node Side */}
                    <rect x="420" y="50" width="300" height="250" rx="8" fill="#1e293b" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="570" y="80" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Wnode Operator</text>

                    <rect x="450" y="110" width="240" height="150" rx="4" fill="#0f172a" stroke="#8b5cf6" strokeWidth="2" />
                    <text x="570" y="135" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Wazero Sandbox</text>

                    <rect x="480" y="160" width="180" height="70" rx="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="570" y="185" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">Compiled .wasm Binary</text>
                    <text x="570" y="205" fill="#94a3b8" fontSize="10" textAnchor="middle">(Custom Rust Logic)</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">WASM Pointer Lifecycle</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowWasm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="400" y1="50" x2="400" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="650" y1="50" x2="650" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">Native Go Wrapper</text>

                    <rect x="350" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#8b5cf6" strokeWidth="1" />
                    <text x="400" y="40" fill="white" textAnchor="middle" fontWeight="bold">WASM Memory</text>

                    <rect x="600" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="650" y="40" fill="white" textAnchor="middle" fontWeight="bold">Rust Execution</text>

                    <line x1="150" y1="80" x2="390" y2="80" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seqArrowWasm)" />
                    <text x="275" y="75" fill="#cbd5e1" textAnchor="middle">1. Allocate(1024 bytes) & Write</text>

                    <line x1="150" y1="120" x2="640" y2="120" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seqArrowWasm)" />
                    <text x="400" y="115" fill="#cbd5e1" textAnchor="middle">2. Invoke exported logic passing ptr+len</text>

                    <line x1="650" y1="160" x2="410" y2="160" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seqArrowWasm)" />
                    <text x="525" y="155" fill="#cbd5e1" textAnchor="middle">3. Write result to new ptr</text>

                    <line x1="650" y1="200" x2="160" y2="200" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seqArrowWasm)" />
                    <text x="400" y="195" fill="#cbd5e1" textAnchor="middle">4. Return result pointer to Go</text>
                </svg>
            </div>

            <h2 id="real-code-examples">The Generated TS SDK</h2>
            <CodeBlock language="typescript" title="sdk/generated/client.ts">{`import { createHmac } from 'crypto';

export class WnodeClient {
  constructor(private endpoint: string, private secret: string) {}
  
  async submit(payload: object) {
    const body = JSON.stringify({
      integration_id: "190001-0626-01-IN",
      nonce: Date.now(), // Auto-generated nonce
      payload
    });

    // Auto-HMAC signing
    const sig = 'sha256=' + createHmac('sha256', this.secret).update(body).digest('hex');

    const res = await fetch(\`\${this.endpoint}/rpc/v1/submit\`, {
      method: 'POST',
      headers: { 'X-Wnode-Signature': sig, 'Content-Type': 'application/json' },
      body
    });
    
    if (!res.ok) throw new Error("Orchestrator rejected payload");
    return res.json();
  }
}`}</CodeBlock>

            <h2 id="real-code-examples">The WASM Rust Implementation</h2>
            <CodeBlock language="rust" title="src/lib.rs (WASM Implementation)">{`#[no_mangle]
pub extern "C" fn process_payload(ptr: *const u8, len: usize) -> *mut u8 {
    // 1. Reconstruct the byte slice securely from the linear memory pointer
    let slice = unsafe { std::slice::from_raw_parts(ptr, len) };
    
    // 2. Perform arbitrary integration logic (e.g. signature verification)
    let output = "VERIFIED_SUCCESS"; 
    
    // 3. Write back to linear memory and pass pointer to the Go Host
    let mut vec = output.as_bytes().to_vec();
    vec.shrink_to_fit();
    let res_ptr = vec.as_mut_ptr();
    
    // Forget the vector so Rust doesn't garbage collect the memory before Go reads it
    std::mem::forget(vec);
    
    res_ptr
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Memory Leak in WASM:</strong> If the Rust developer fails to properly manage memory (or if they do not drop old vectors), the Wazero sandbox will eventually hit the <code>RAM</code> limit specified in the YAML. Wazero will forcefully kill the module and return an <code>OutOfMemory</code> error to the SDK client.</li>
                <li><strong>SDK Time Drift:</strong> If the server hosting the TS SDK has significant clock drift, the <code>Date.now()</code> nonce will fall behind the Orchestrator's clock. This results in continuous <code>401 Unauthorized (Replay Attack)</code> errors until the host's NTP service is synchronized.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p>
                <strong>Invariant:</strong> The Rust code inside the WASM binary is physically prevented from interacting with the host OS. Functions like <code>std::fs::File::open()</code> will compile but immediately panic at runtime, trapping the execution gracefully inside Wazero.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p>
                The Wazero bridge parses pointers extremely quickly. The overhead of passing a 1MB JSON string from the Go host into the Rust WASM module and parsing it is approximately <code>~1.5ms</code>.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400">Ensure your system has <code>cgroups v2</code> enabled. Without cgroups, Wazero's software limits are your only defense, which lacks hard hardware isolation.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400">Write clean Rust. Do not use heavy frameworks (like Actix or Tokio) inside the WASM stub. Keep the binary size under 2MB for ultra-fast instantiation across the mesh.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <CodeBlock language="json" title="WASM Invocation Metrics">{`{
  "event": "wasm_execution_complete",
  "integration_id": "190001-0626-01-IN",
  "memory_used_bytes": 145000,
  "execution_duration_ms": 12,
  "status": "success"
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p>
                The TS SDK talks to the Orchestrator. The Orchestrator talks to the native Go Handler. The native Go Handler talks to the compiled Rust WASM binary via pointer memory mapping.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Unhandled Panics">
                Never use <code>.unwrap()</code> in your Rust WASM logic. If parsing the payload fails and Rust panics, it immediately traps the Wazero module, returning an opaque <code>ExecutionFault</code> to the client. Always return a formatted JSON error string to the Go host instead.
            </Callout>
        </>
    );
}
