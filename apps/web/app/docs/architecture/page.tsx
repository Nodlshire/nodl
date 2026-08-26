import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DiagramErrorBoundary from '@/components/docs/DiagramErrorBoundary';

export default function Page() {
  return (
    <div className="max-w-4xl space-y-8 py-8" role="main" aria-label="Wnode Architecture System Specification">
      {/* Schema.org TechArticle Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': 'Wnode System Architecture & MicroVM Infrastructure',
            'description': 'Technical specification of KVM virtualization, Firecracker VMM, VirtIO ring queues, and cgroups v2 resource limits in Wnode.',
            'url': 'https://wnode.io/docs/architecture',
            'author': { '@type': 'Organization', 'name': 'Wnode Technologies' },
            'inLanguage': 'en-US',
          }),
        }}
      />

      <div>
        <div className="text-xs font-semibold tracking-wider text-blue-400 uppercase mb-1">
          Wnode Core System Architecture
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Hypervisor Topology &amp; MicroVM Infrastructure</h1>
        <p className="mt-2 text-base text-slate-400">
          In-depth technical specification of KVM virtualization, Firecracker VMM, VirtIO ring queues, cgroups v2 isolation, and NUMA memory pinning.
        </p>
      </div>

      <Callout type="note" title="Kernel Virtual Machine (KVM) Foundation">
        Wnode leverages Linux KVM kernel modules (`/dev/kvm`) to provide bare-metal hardware virtualization. Every microVM boot completes within 5 milliseconds, consuming less than 5MB of base hypervisor memory overhead.
      </Callout>

      <section className="space-y-4">
        <h2 id="global-architecture" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Global System Topology &amp; Edge Compute Nodes
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The Wnode architecture is structured as a peer-to-peer mesh of edge compute nodes orchestrated by decentralized directory gateways.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Physical nodes register hardware specs, active CPU core counts, available RAM, and geographical H3 spatial hex cell identifiers with global directory orchestrators. When clients submit task execution requests, directory servers evaluate network topology metrics to route tasks to nearby nodes with optimal latency characteristics.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          System hypervisors enforce strict hardware abstraction layers, preventing guest container processes from inspecting host hardware parameters, physical PCIe device addresses, or adjacent container memory mappings.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 1.1 – Global Architecture Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 1.1 – Global Architecture">
            <img loading="lazy" src="/diagrams/fig-1-1-global-architecture.svg" alt="Fig 1.1 – Global Architecture" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 1.1 – Global Architecture</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="firecracker-vmm" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. Firecracker VMM &amp; VirtIO Device Queues
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Firecracker Virtual Machine Monitors (VMM) manage guest kernel execution. Minimalist VirtIO net and block drivers handle I/O multiplexing:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-slate-300">
          <li><strong className="text-white">VirtIO-Net:</strong> TAP device interfaces configured with vhost-net kernel acceleration achieve 10Gbps packet throughput.</li>
          <li><strong className="text-white">VirtIO-Block:</strong> Ephemeral RAM disk block devices process over 250,000 IOPS per physical host CPU socket.</li>
          <li><strong className="text-white">VirtIO-VSock:</strong> Zero-copy socket channels communicate directly between host control daemons and guest microVM applications.</li>
        </ul>

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
        <h2 id="cgroups-v2" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          3. cgroups v2 Isolation &amp; NUMA Node Pinning
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Resource allocation uses Linux cgroups v2 unified hierarchy controllers:
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 3.1 – RAM-Only Compute Model Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 3.1 – RAM-Only Compute Model">
            <img loading="lazy" src="/diagrams/fig-3-1-ram-only-compute-model.svg" alt="Fig 3.1 – RAM-Only Compute Model" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 3.1 – RAM-Only Compute Model</figcaption>
          </figure>
        </DiagramErrorBoundary>

        <p className="text-slate-300 leading-relaxed mb-4">
          NUMA memory pinning via `numactl --membind` guarantees CPU cores access local RAM banks directly, eliminating cross-socket QPI interconnect latency.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="network-mesh" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. WireGuard P2P Mesh Network Architecture
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Node inter-communication routes through kernel-space WireGuard interfaces (`wnode0`). Cryptographic keypairs derive from node TPM 2.0 seeds, enforcing mutual TLS (mTLS) authentication across all P2P telemetry exchanges.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          WireGuard tunnels operate directly in Linux kernel space, avoiding context switches between userland network daemons and host socket interfaces. Packet encryption uses ChaCha20-Poly1305 AEAD primitives, securing inter-node data channels against eavesdropping or tamper injection attacks.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="cgroups-spec" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. Systemd cgroups v2 Configuration Spec
        </h2>
        <CodeBlock language="ini" filename="wnode-slice.conf" code={`[Slice]
# Memory limits for microVM worker slice
MemoryAccounting=true
MemoryHigh=28G
MemoryMax=30G
MemorySwapMax=0

# CPU quota allocation
CPUAccounting=true
CPUQuota=1600%

# IO weight constraints
IOAccounting=true
IOWeight=100`} />
      </section>

      
      <section className="space-y-4">
        <h2 id="arch-memory-paging" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Hypervisor Memory Paging &amp; VirtIO Queue Optimizations
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Memory page management across host hypervisors utilizes kernel Transparent Huge Pages (THP) configured in explicit 2MB contiguous allocation blocks. Huge page allocations reduce CPU Translation Lookaside Buffer (TLB) miss rates during intensive WASI compute executions by over 40 percent.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          VirtIO ring buffers utilize split descriptor queue architectures configured with poll-mode vhost worker threads. Host CPU cores dedicate pinned affinity masks to high-throughput VirtIO network channels, achieving sub-10 microsecond guest-to-host packet transfer bounds without triggering kernel interrupt context switches.
        </p>
      </section>

      
      <section className="space-y-4">
        <h2 id="arch-memory-paging" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Hypervisor Memory Paging &amp; VirtIO Queue Optimizations
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Memory page management across host hypervisors utilizes kernel Transparent Huge Pages (THP) configured in explicit 2MB contiguous allocation blocks. Huge page allocations reduce CPU Translation Lookaside Buffer (TLB) miss rates during intensive WASI compute executions by over 40 percent.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          VirtIO ring buffers utilize split descriptor queue architectures configured with poll-mode vhost worker threads. Host CPU cores dedicate pinned affinity masks to high-throughput VirtIO network channels, achieving sub-10 microsecond guest-to-host packet transfer bounds without triggering kernel interrupt context switches.
        </p>
      </section>

      {/* Related Pages Block */}
      <section className="space-y-4 pt-6 border-t border-slate-800" aria-label="Related Architecture Pages">
        <h2 className="text-lg font-semibold text-white tracking-tight">Related Architecture Subsystems</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/docs/architecture/firecracker-microvm" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-blue-400 group-hover:text-blue-300">Firecracker MicroVM Spec →</h3>
            <p className="text-xs text-slate-400 mt-1">Boot sequence, minimal guest kernel parameters, and jailer constraints.</p>
          </a>
          <a href="/docs/architecture/cgroups-v2-limits" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">cgroups v2 Resource Limits →</h3>
            <p className="text-xs text-slate-400 mt-1">Memory max limits, CPU quota enforcement, and I/O weight controller rules.</p>
          </a>
          <a href="/docs/architecture/gvisor-sandbox" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-amber-400 group-hover:text-amber-300">gVisor Sandbox Security →</h3>
            <p className="text-xs text-slate-400 mt-1">SECCOMP-BPF system call filtering, Sentry kernel, and file system isolation.</p>
          </a>
          <a href="/docs/architecture/wireguard-mtls" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-purple-400 group-hover:text-purple-300">WireGuard mTLS Mesh →</h3>
            <p className="text-xs text-slate-400 mt-1">P2P mesh routing, Noise protocol handshake, and key rotation mechanics.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
