import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DiagramErrorBoundary from '@/components/docs/DiagramErrorBoundary';

export default function Page() {
  return (
    <div className="max-w-4xl space-y-8 py-8" role="main" aria-label="Wnode Documentation Portal Main Hub">
      {/* Schema.org TechArticle Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': 'Wnode — Sovereign AI & DePIN Mesh Compute Infrastructure',
            'description': 'Enterprise documentation portal for Wnode DePIN mesh compute architecture, Firecracker microVM sandboxing, Ed25519 security, and Stripe Connect settlement.',
            'url': 'https://wnode.io/docs',
            'author': { '@type': 'Organization', 'name': 'Wnode Technologies' },
            'inLanguage': 'en-US',
          }),
        }}
      />

      <div>
        <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1">
          Wnode Enterprise Documentation Portal
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Architecture &amp; Developer Reference</h1>
        <p className="mt-2 text-base text-slate-400">
          Complete technical specification, security parameters, node operator guides, and SDK integration manuals for the Wnode sovereign DePIN compute mesh.
        </p>
      </div>

      <Callout type="note" title="Enterprise SLA Target">
        Wnode edge compute clusters guarantee sub-15ms p95 execution latency bounds, 99.99% infrastructure availability, and zero-trust memory confidentiality for all serverless workloads.
      </Callout>

      <section className="space-y-4">
        <h2 id="global-architecture" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Global System Topology &amp; MicroVM Sandboxing
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode is an enterprise-grade Decentralized Physical Infrastructure Network (DePIN) designed for high-performance edge compute, WASI serverless workloads, and private cellular gateways.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Every edge node operates a hardened Linux hypervisor hosting isolated Firecracker microVM sandboxes. MicroVM containers execute within strict cgroups v2 memory limits, gVisor Sentry system call filters, and hardware-backed TPM 2.0 PCR attestation bounds.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          The global topology links thousands of independent operator nodes through a peer-to-peer WireGuard mesh layer. Decentralized directory servers continuously monitor node availability, geographic location coordinates, and active CPU capacity, dynamically balancing incoming workload dispatches to minimize network hop latency.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 1.1 – Global Architecture Diagram Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 1.1 – Global Architecture">
            <img loading="lazy" src="/diagrams/fig-1-1-global-architecture.svg" alt="Fig 1.1 – Global Architecture" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 1.1 – Global Architecture</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="job-execution-sequence" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. Asynchronous Job Execution Sequence &amp; Real-Time Animation
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Client applications submit signed execution manifests over encrypted WireGuard P2P mTLS tunnels. Edge orchestrators verify Ed25519 payload signatures, evaluate local resource availability, and dispatch tasks to active Firecracker worker threads.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Task execution state transitions stream back to clients via WebSocket telemetry connections. Upon job completion, worker nodes compute a cryptographic SHA-256 state hash binding the input payload, execution duration, and output state, returning an immutable Proof of Compute receipt.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 1.2 – Job Execution Sequence Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 1.2 – Job Execution Sequence">
            <img loading="lazy" src="/diagrams/fig-1-2-job-execution-sequence.svg" alt="Fig 1.2 – Job Execution Sequence" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 1.2 – Job Execution Sequence</figcaption>
          </figure>

          <figure className="doc-animation-viewer my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" data-doc-animation-viewer="true" data-animation-src="/animations/job-lifecycle-animation.svg" aria-label="Anim 1.1 – Job Lifecycle Animation">
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center rounded-full bg-[#00FFB2]/10 px-2.5 py-0.5 text-xs font-bold text-[#00FFB2] border border-[#00FFB2]/30">
                  ANIMATION VIEWER
                </span>
                <span className="text-xs font-semibold text-gray-300">Anim 1.1 – Job Lifecycle Animation</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg bg-black/60 p-2">
              <img loading="lazy" src="/animations/job-lifecycle-animation.svg" alt="Anim 1.1 – Job Lifecycle Animation" className="w-full h-auto max-h-[300px] object-contain" />
            </div>
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed flex items-center justify-between">
              <span><strong className="text-gray-200">Anim 1.1</strong> – Real-time microVM task dispatch and state settlement timeline.</span>
            </figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="ram-only-compute" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          3. Ephemeral RAM-Only Compute Model
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode enforces zero-persistence memory policies. Guest VM disk mounts utilize tmpfs RAM disks that scrub and zero-fill volatile memory blocks immediately upon process exit.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          By eliminating persistent disk writes during workload execution, Wnode prevents residual data artifacts from remaining on physical node storage media. Host kernel memory scrubbers write zero-byte patterns across allocated physical RAM pages using SIMD vector operations before releasing memory back to system pools.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 3.1 – RAM-Only Compute Model Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 3.1 – RAM-Only Compute Model">
            <img loading="lazy" src="/diagrams/fig-3-1-ram-only-compute-model.svg" alt="Fig 3.1 – RAM-Only Compute Model" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 3.1 – RAM-Only Compute Model</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="enterprise-compliance" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. Enterprise Compliance &amp; Protocol Guarantees
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode protocol implementations adhere strictly to SOC 2 Type II controls, GDPR privacy directives, and ISO/IEC 27001 cybersecurity frameworks. All telemetry pipelines output structured JSON logs compatible with Datadog, Splunk, and Elastic Stack ingestion endpoints.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Enterprise tenants maintain full visibility over workload execution metrics, regional data residency compliance, and node attestation logs. Automated compliance checkers verify that physical nodes meet strict regional sovereignty constraints before assigning sensitive enterprise data processing jobs.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="quickstart-code" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. Developer Client Quickstart &amp; Connection Setup
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Integrating with Wnode requires initializing the client SDK, configuring client private key credentials, establishing connection pools, and dispatching execution requests:
        </p>
        <CodeBlock language="typescript" filename="quickstart.ts" code={`import { WnodeClient } from '@wnode/sdk';

const client = new WnodeClient({
  endpoint: 'https://gateway.wnode.io:8080',
  privateKey: process.env.WNODE_PRIVATE_KEY!,
});

async function main() {
  const result = await client.execute({
    runtime: 'wasm32-wasi',
    payload: new Uint8Array([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00]),
  });
  console.log('Execution State Hash:', result.stateHash);
}

main().catch(console.error);`} />
      </section>

      
      <section className="space-y-4">
        <h2 id="enterprise-monitoring" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Enterprise Node Health Telemetry &amp; System Health Monitoring
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode edge compute infrastructure provides real-time telemetry streaming for all active hypervisors and Firecracker microVM instances. System health monitors continuously evaluate CPU thermal metrics, RAM consumption, NVMe disk read/write latency, and network packet jitter across global cluster nodes.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Decentralized orchestrator gateways collect Prometheus metrics from node endpoints every 15 seconds, aggregating execution statistics into centralized Grafana dashboards for enterprise tenant oversight. Automatic alert triggers notify operators of hardware degradation or thermal throttling events before performance impacts running microVM workloads.
        </p>
      </section>

      
      <section className="space-y-4">
        <h2 id="enterprise-monitoring" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Enterprise Node Health Telemetry &amp; System Health Monitoring
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode edge compute infrastructure provides real-time telemetry streaming for all active hypervisors and Firecracker microVM instances. System health monitors continuously evaluate CPU thermal metrics, RAM consumption, NVMe disk read/write latency, and network packet jitter across global cluster nodes.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Decentralized orchestrator gateways collect Prometheus metrics from node endpoints every 15 seconds, aggregating execution statistics into centralized Grafana dashboards for enterprise tenant oversight. Automatic alert triggers notify operators of hardware degradation or thermal throttling events before performance impacts running microVM workloads.
        </p>
      </section>

      {/* Related Pages Block */}
      <section className="space-y-4 pt-6 border-t border-slate-800" aria-label="Related Documentation Pages">
        <h2 className="text-lg font-semibold text-white tracking-tight">Related Documentation Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/docs/architecture" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-blue-400 group-hover:text-blue-300">System Architecture →</h3>
            <p className="text-xs text-slate-400 mt-1">Deep dive into Firecracker microVMs, cgroups v2, and system topology.</p>
          </a>
          <a href="/docs/security" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-amber-400 group-hover:text-amber-300">Security Specification →</h3>
            <p className="text-xs text-slate-400 mt-1">TPM 2.0 attestation, Ed25519 signatures, and STRIDE threat mitigation.</p>
          </a>
          <a href="/docs/operator" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Node Operator Guide →</h3>
            <p className="text-xs text-slate-400 mt-1">Provisioning edge nodes, systemd daemons, and CBRS backhaul links.</p>
          </a>
          <a href="/docs/developer" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-purple-400 group-hover:text-purple-300">Developer Portal &amp; SDK →</h3>
            <p className="text-xs text-slate-400 mt-1">Client SDKs, WASI targets, Go wrappers, and OpenAPI REST endpoints.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
