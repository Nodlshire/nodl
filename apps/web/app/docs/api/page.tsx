import React from 'react';
import Callout from '../../../components/docs/Callout';
import CodeBlock from '../../../components/docs/CodeBlock';

export default function ApiReference() {
    return (
        <>
            <div className="border-b border-slate-800 pb-8 mb-12">
                <h1 className="text-5xl font-space-grotesk font-bold tracking-tighter mb-4 text-white">API Reference</h1>
                <p className="text-xl text-slate-400 font-light leading-relaxed mb-6 leading-relaxed">
                    The external boundary. Integrating decentralized applications with the Orchestrator via secure, signed REST HTTP calls.
                </p>
            {/* Contextual Narrative Section (What, Why, How) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10 not-prose">
                <div className="bg-slate-900/80 p-6 rounded-2xl border border-emerald-500/30">
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">WHAT IT IS</span>
                    <h3 className="text-lg font-bold text-white mt-1 mb-3">API Reference Overview</h3>
                    <p className="text-sm text-slate-300 leading-relaxed mb-6 leading-relaxed">
                        Core architectural specification detailing the operational mechanics, data protocols, and determinism constraints of API Reference within the Wnode mesh.
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
                In standard peer-to-peer systems, clients interact directly with nodes. This exposes node IPs to the public internet, opening them to targeted DDoS attacks and Sybil manipulation.
            </p>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>The Rationale:</strong> Wnode uses a gateway model. The Orchestrator exposes a hardened HTTP REST API. Clients never speak to Node Operators directly. The Orchestrator acts as a load balancer, reverse proxy, and cryptographic firewall.
            </p>

            <h2 id="architecture-diagram">API Gateway Architecture</h2>
            <div className="my-12 p-8 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-center">
                <svg viewBox="0 0 800 250" className="w-full drop-shadow-2xl font-sans">
                    <defs>
                        <marker id="arrowApi" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                        </marker>
                        <marker id="arrowApiSec" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
                        </marker>
                    </defs>
                    
                    <rect x="50" y="80" width="100" height="80" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="100" y="110" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Public Web</text>
                    <text x="100" y="130" fill="#94a3b8" fontSize="10" textAnchor="middle">(DApps / SDKs)</text>

                    <path d="M 150 120 L 290 120" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrowApi)" />
                    <text x="220" y="110" fill="#3b82f6" fontSize="10" fontWeight="bold" textAnchor="middle">HTTPS POST</text>

                    <rect x="300" y="50" width="200" height="140" rx="8" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" />
                    <text x="400" y="80" fill="#3b82f6" fontSize="14" fontWeight="bold" textAnchor="middle">api.wnode.one</text>

                    <rect x="320" y="100" width="160" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="400" y="120" fill="white" fontSize="12" textAnchor="middle">Rate Limiter (Token Bucket)</text>

                    <rect x="320" y="140" width="160" height="30" rx="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                    <text x="400" y="160" fill="white" fontSize="12" textAnchor="middle">HMAC Validator</text>

                    <path d="M 500 120 L 640 120" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrowApiSec)" />
                    <text x="570" y="110" fill="#10b981" fontSize="10" fontWeight="bold" textAnchor="middle">mTLS TCP</text>

                    <rect x="650" y="80" width="100" height="80" rx="4" fill="#0f172a" stroke="#10b981" strokeWidth="2" strokeDasharray="4 4" />
                    <text x="700" y="110" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">Private Mesh</text>
                    <text x="700" y="130" fill="#94a3b8" fontSize="10" textAnchor="middle">(Node Operators)</text>
                </svg>
            </div>

            <h2 id="endpoints">Core Endpoints</h2>

            <h3 id="post-submit" className="text-2xl mt-8 mb-4 border-b border-slate-800 pb-2">POST /rpc/v1/submit</h3>
            <p className="text-slate-300 leading-relaxed mb-6">Submits a payload for synchronous execution (Earth Mesh) or asynchronous routing (Space Mesh).</p>

            <CodeBlock language="json" title="Request Payload">{`{
  "integration_id": "190001-0626-01-IN",
  "nonce": 1698273912019,
  "payload": {
    "command": "verify_state",
    "params": ["0xdeadbeef"]
  }
}`}</CodeBlock>

            <CodeBlock language="json" title="Response (200 OK - Synchronous)">{`{
  "status": "success",
  "latency_ms": 142,
  "result": {
    "verified": true,
    "proof": "0x4a5b6c..."
  }
}`}</CodeBlock>

            <CodeBlock language="json" title="Response (202 Accepted - Asynchronous)">{`{
  "status": "pending",
  "job_id": "job_9x8c7v6b5n4m"
}`}</CodeBlock>

            <h3 id="get-status" className="text-2xl mt-8 mb-4 border-b border-slate-800 pb-2">GET /rpc/v1/status/{`{job_id}`}</h3>
            <p className="text-slate-300 leading-relaxed mb-6">Queries the status of an asynchronous Space Mesh job.</p>

            <CodeBlock language="json" title="Response (200 OK)">{`{
  "job_id": "job_9x8c7v6b5n4m",
  "status": "processing",
  "shards_total": 100,
  "shards_completed": 45,
  "quorum_status": "pending",
  "faults": 0
}`}</CodeBlock>

            <h2 id="failure-modes">Failure Modes & Error Handling</h2>
            <ul>
                <li><strong>429 Too Many Requests:</strong> If your integration bursts beyond its allocated TPS limits (defined in your Service Level Agreement), the Orchestrator will instantly shed load. Implement exponential backoff in your client.</li>
                <li><strong>422 Unprocessable Entity:</strong> Emitted if the JSON body does not match the schema defined in the <code>spec.yaml</code>. The request is rejected without ever hitting a node.</li>
                <li><strong>503 Service Unavailable:</strong> Emitted if the DAG routing table cannot find an online node capable of fulfilling the <code>required_resources</code> requested by your integration.</li>
            </ul>

            <h2 id="security-boundaries">Security Boundaries & Invariants</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                <strong>Invariant:</strong> The Orchestrator's API is stateless. It does not cache your payloads, nor does it store your execution results permanently. If you do not capture a 200 OK response on an Earth Mesh job, that result is gone forever. You must resubmit.
            </p>

            <h2 id="performance">Performance Characteristics</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The API gateway is globally distributed via Cloudflare Workers and Anycast routing. The TLS termination happens at the edge, meaning the connection overhead is minimal. Latency from payload submission to Orchestrator ingestion is generally <code>&lt;30ms</code> worldwide.
            </p>

            <h2 id="responsibilities">Responsibilities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8 not-prose">
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Operator</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Node Operators do not serve HTTP traffic. They use binary TCP protocols for speed.</p>
                </div>
                <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                    <h4 className="text-white font-bold mb-2">Developer</h4>
                    <p className="text-sm text-slate-400 mb-6 leading-relaxed">Implement idempotency. If an HTTP request times out, you must be able to safely retry it without double-charging a user or duplicating a database entry.</p>
                </div>
            </div>

            <h2 id="telemetry">Telemetry Emitted</h2>
            <CodeBlock language="json" title="API Gateway Metrics">{`{
  "route": "/rpc/v1/submit",
  "status_code": 200,
  "client_ip_hash": "0x4f3e...",
  "bytes_in": 1024,
  "bytes_out": 512,
  "total_ms": 145
}`}</CodeBlock>

            <h2 id="cross-component">Cross-Component Interactions</h2>
            <p className="text-slate-300 leading-relaxed mb-6">
                The API is the entrypoint. It reads from the Substrate definitions to validate the request, pushes it down the TCP socket to the Execution Model on the Node Operator, and pipes the result back up to the client.
            </p>

            <h2 id="best-practices">Best Practices & Anti-Patterns</h2>
            <Callout type="warning" title="Anti-Pattern: Polling Earth Jobs">
                Do not repeatedly poll <code>/status</code> for jobs configured as <code>node_job</code> (Earth Mesh). Earth jobs are synchronous. If the connection drops, assume failure and retry the <code>/submit</code> call.
            </Callout>

        </>
    );
}
