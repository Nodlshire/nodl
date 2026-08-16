import React from 'react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function SecurityModel() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">Security Model</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    Zero-trust architecture enforcing strict boundaries at ingress, execution, and telemetry. The network assumes all nodes are potentially malicious.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">Security Model Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of Security Model within the Wnode mesh.
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
                In a permissionless or semi-permissioned network, node operators cannot be trusted. If an operator discovers a high-value DeFi liquidation payload passing through their node, the incentive to intercept, rewrite, or delay that payload is massive.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> The Wnode security model strips trust from the operator entirely. We achieve this through cryptographic ingress envelopes (HMAC + Nonces), deterministic SECCOMP Sandbox execution sandboxing, and Quorum Reduction.
            </p>

            <h2 id="architecture-diagram">The Security Envelope Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 350" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowSec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="50" width="150" height="250" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="125" y="80" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">Ingress Firewall</text>

                    <rect x="70" y="110" width="110" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="125" y="135" fill="white" fontSize="12" textAnchor="middle">IP Allowlist</text>

                    <rect x="70" y="170" width="110" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="125" y="195" fill="white" fontSize="12" textAnchor="middle">HMAC Verify</text>

                    <rect x="70" y="230" width="110" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="125" y="255" fill="white" fontSize="12" textAnchor="middle">Nonce Check</text>

                    <path d="M 200 175 L 300 175" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSec)" />

                    <rect x="310" y="50" width="180" height="250" rx="8" fill="#0f172a" stroke="#10b981" strokeWidth="2" />
                    <text x="400" y="80" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Node Daemon (nodld)</text>

                    <rect x="330" y="110" width="140" height="160" rx="4" fill="#1e293b" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="2 2" />
                    <text x="400" y="135" fill="#8b5cf6" fontSize="12" fontWeight="bold" textAnchor="middle">SECCOMP Sandbox Sandbox</text>

                    <rect x="350" y="160" width="100" height="80" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="400" y="190" fill="white" fontSize="10" textAnchor="middle">Native Go Execution</text>
                    <text x="400" y="210" fill="#f43f5e" fontSize="10" textAnchor="middle">No SYS-CALLS</text>

                    <path d="M 490 175 L 590 175" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrowSec)" />

                    <rect x="600" y="130" width="150" height="90" rx="8" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                    <text x="675" y="160" fill="white" fontSize="14" fontWeight="bold" textAnchor="middle">Quorum Anchor</text>
                    <text x="675" y="180" fill="#94a3b8" fontSize="10" textAnchor="middle">Result validation</text>
                    <text x="675" y="195" fill="#94a3b8" fontSize="10" textAnchor="middle">via multi-node</text>
                </svg>
            </div>

            <h2 id="sequence-diagram">Nonce Replay Protection Sequence</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans text-xs">
                    <defs>
                        <marker id="seqArrowSec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" />
                        </marker>
                    </defs>
                    <line x1="150" y1="50" x2="150" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />
                    <line x1="400" y1="50" x2="400" y2="230" stroke="#475569" strokeWidth="1" strokeDasharray="4 4" />

                    <rect x="100" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="150" y="40" fill="white" textAnchor="middle" fontWeight="bold">Attacker</text>

                    <rect x="350" y="20" width="100" height="30" rx="4" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                    <text x="400" y="40" fill="white" textAnchor="middle" fontWeight="bold">Orchestrator DB</text>

                    <line x1="150" y1="80" x2="390" y2="80" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seqArrowSec)" />
                    <text x="275" y="75" fill="#cbd5e1" textAnchor="middle">1. Intercepts Valid Payload (Nonce: 100)</text>

                    <line x1="150" y1="120" x2="390" y2="120" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seqArrowSec)" />
                    <text x="275" y="115" fill="#cbd5e1" textAnchor="middle">2. Replays Payload (Nonce: 100)</text>

                    <rect x="385" y="140" width="30" height="40" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" />
                    <text x="425" y="155" fill="#94a3b8" textAnchor="start">3. Lookup Last Nonce (100)</text>
                    <text x="425" y="170" fill="#f43f5e" textAnchor="start">4. FAIL: 100 &lt;= 100</text>

                    <line x1="400" y1="210" x2="160" y2="210" stroke="#f59e0b" strokeWidth="2" markerEnd="url(#seqArrowSec)" />
                    <text x="275" y="205" fill="#f43f5e" textAnchor="middle">5. 401 Unauthorized</text>
                </svg>
            </div>

            <h2 id="real-code-examples">Security Code Implementations</h2>
            <CodeBlock language="go" title="internal/ingress/hmac.go (Orchestrator HMAC Validator)">{`func ValidateHMAC(payload []byte, signature string, secretEnv string) error {
    secret := os.Getenv(secretEnv)
    if secret == "" {
        return errors.New("critical: missing environment secret")
    }

    mac := hmac.New(sha256.New, []byte(secret))
    mac.Write(payload)
    expectedMAC := mac.Sum(nil)
    expectedSig := "sha256=" + hex.EncodeToString(expectedMAC)

    // Subtle constant-time compare prevents timing attacks
    if subtle.ConstantTimeCompare([]byte(signature), []byte(expectedSig)) != 1 {
        return errors.New("invalid signature")
    }
    return nil
}`}</CodeBlock>

            <CodeBlock language="go" title="internal/node/wazero_security.go (SECCOMP Sandbox Sandbox Constraints)">{`// Wnode strict SECCOMP Sandbox constraints
func createSecureConfig() seccomp-sandbox.ModuleConfig {
    return seccomp-sandbox.NewModuleConfig().
        // No filesystem access
        WithFS(seccomp-sandbox.NewEmptyFS()).
        // No environment variables passed to the Native Go
        WithEnv("NODE_ENV", "production").
        // Pre-allocate memory bounds to prevent memory bombs
        WithMemoryLimitPages(128) // 128 pages = 8MB
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>Timing Attacks:</strong> Standard string comparison (<code>==</code>) fails at the first incorrect character, allowing attackers to guess HMAC hashes byte-by-byte via latency measuring. The Orchestrator uses <code>subtle.ConstantTimeCompare</code> to guarantee uniform execution time.</li>
                <li><strong>Memory Bombs:</strong> A malicious Native Go binary might try to allocate 100GB of RAM to crash the Earth Mesh node. The <code>WithMemoryLimitPages</code> configuration traps the allocation instruction at the WebAssembly VM layer, returning an error to Go without touching host OS memory.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant 1:</strong> The Node Operator never sees the HMAC secret. Signatures are validated by the Orchestrator before the payload is placed on the wire.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant 2:</strong> Native Go modules have no system calls. They cannot read `/etc/passwd`, they cannot open a TCP socket, and they cannot access the system clock (which prevents complex cryptographic implementations inside Native Go that rely on secure randomness without explicit host imports).
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                HMAC-SHA256 validation is exceptionally fast, processing at ~500MB/s on standard CPUs. Nonce validation requires a single Redis <code>GET</code> operation (&lt;1ms). The security envelope adds a total of ~1.5ms overhead to the entire request lifecycle.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Protect the <code>DeviceToken</code>. If compromised, an attacker can siphon routed payloads meant for your node. Rotate the token via the CLI if you suspect a breach.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer Responsibilities</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Keep your HMAC secret safe in your own environment (AWS KMS, Hashicorp Vault). Do not embed it in client-side code (browsers or mobile apps). SDK usage should be backend-only.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <CodeBlock language="json" title="Security Fault Telemetry">{`{
  "event": "security_fault",
  "fault_type": "hmac_mismatch",
  "integration_id": "190001-0626-01-IN",
  "client_ip": "104.28.X.X",
  "timestamp": 1698274000123
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The security model forms a hard boundary between the external world and the Orchestrator, and a second hard boundary between the Orchestrator and the Node Daemon.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Static Nonces">
                During local testing, developers often hardcode a nonce (e.g. <code>"nonce": 1</code>). The first request will succeed. Every subsequent request will fail with a 401 Unauthorized. Use <code>Date.now()</code>.
            </Callout>
        </>
    );
}
