import React from 'react';
import Callout from '@/components/docs/Callout';
import CodeBlock from '@/components/docs/CodeBlock';
import DiagramErrorBoundary from '@/components/docs/DiagramErrorBoundary';

export default function Page() {
  return (
    <div className="max-w-4xl space-y-8 py-8" role="main" aria-label="Wnode Node Operator Operations Manual">
      {/* Schema.org TechArticle Microdata */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            'headline': 'Wnode Node Operator Provisioning & Infrastructure Management',
            'description': 'Deployment guide for edge compute nodes, systemd daemons, CBRS backhaul links, and Desktop GUI monitoring.',
            'url': 'https://wnode.io/docs/operator',
            'author': { '@type': 'Organization', 'name': 'Wnode Technologies' },
            'inLanguage': 'en-US',
          }),
        }}
      />

      <div>
        <div className="text-xs font-semibold tracking-wider text-indigo-400 uppercase mb-1">
          Wnode Node Operator Operations Manual
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Node Operator Provisioning &amp; Infrastructure Management</h1>
        <p className="mt-2 text-base text-slate-400">
          Step-by-step deployment guide for establishing high-performance edge compute nodes, configuring systemd daemons, and managing CBRS backhaul links.
        </p>
      </div>

      <Callout type="note" title="Operator Prerequisites">
        To operate a production Wnode edge compute node, hosts require x86_64 or ARM64 multi-core CPUs (minimum 4 physical cores), at least 16GB RAM, NVMe storage, Ubuntu 22.04 LTS / Debian 12, and an un-throttled internet connection.
      </Callout>

      <section className="space-y-4">
        <h2 id="operator-diagram" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          1. Operator Onboarding &amp; Registration Architecture
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The diagram below details the node operator onboarding sequence, TPM 2.0 PCR attestation, WireGuard mTLS handshake, and directory server registration flow.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          During initial daemon boot (`nodld`), the host generates hardware attestation quotes binding BIOS boot measurements (PCR 0-7) with local TPM 2.0 endorsement keys. The attestation payload submits to global directory orchestrators, proving node integrity before enrolling in cluster scheduling pools.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Directory orchestrators assign a unique H3 spatial hex index based on node geographical IP coordinates. Nodes operating in high-demand or coverage-scarce H3 cells receive priority scheduling weights for incoming client compute requests.
        </p>

        <DiagramErrorBoundary fallbackTitle="Fig 9.1 – Operator Onboarding Flow Fallback">
          <figure className="doc-figure my-8 rounded-xl border border-white/10 bg-[#0E0E10] p-4 shadow-2xl transition-all hover:border-[#00FFB2]/40" aria-label="Fig 9.1 – Operator Onboarding Flow">
            <img loading="lazy" src="/diagrams/fig-9-1-operator-onboarding-flow.svg" alt="Fig 9.1 – Operator Onboarding Flow" className="w-full h-auto max-h-[400px] object-contain rounded-lg bg-black/60 p-2" />
            <figcaption className="mt-3 text-xs text-gray-400 leading-relaxed">Fig 9.1 – Operator Onboarding Flow</figcaption>
          </figure>
        </DiagramErrorBoundary>
      </section>

      <section className="space-y-4">
        <h2 id="hardware-specifications" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          2. Recommended Hardware Archetypes &amp; Disk Partitioning
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Wnode edge infrastructure supports three primary operator archetypes depending on deployment scale and resource capacity:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-indigo-400 mb-1">Micro Edge Node</h3>
            <p className="text-xs text-slate-300 font-mono">4 Cores / 16GB RAM / 256GB NVMe</p>
            <p className="text-xs text-slate-400 mt-2">Suitable for residential gateways, IoT aggregation, and light WASM workload processing.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-cyan-400 mb-1">Enterprise Compute Node</h3>
            <p className="text-xs text-slate-300 font-mono">16 Cores / 64GB RAM / 2TB NVMe</p>
            <p className="text-xs text-slate-400 mt-2">Designed for data center rack installations running heavy Firecracker microVM workloads.</p>
          </div>
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h3 className="text-sm font-semibold text-purple-400 mb-1">CBRS Wireless Node</h3>
            <p className="text-xs text-slate-300 font-mono">8 Cores / 32GB RAM + eNodeB Gateway</p>
            <p className="text-xs text-slate-400 mt-2">Equipped with CBRS Band 48 cellular radios for private LTE/5G wireless backhaul coverage.</p>
          </div>
        </div>
        <p className="text-slate-300 leading-relaxed mb-4">
          Disk partitioning requires a dedicated `/var/lib/wnode` mount point formatted with `ext4` using `noatime,nodiratime` mount options to prevent write amplification on NVMe flash memory.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Operators must configure host kernel parameters to enable VT-x/AMD-V hardware virtualization extensions, set scaling governors to `performance`, and increase maximum file descriptor limits (`fs.file-max = 2097152`).
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="systemd-nodld" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          3. Installing &amp; Managing systemd `nodld` Service
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          The node operator daemon (`nodld`) runs as a background systemd service under an unprivileged system account (`wnode:wnode`). Install the service binary via official repositories:
        </p>
        <CodeBlock language="bash" filename="install-node.sh" code={`curl -fsSL https://repo.wnode.io/apt/gpg.key | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/wnode.gpg
echo "deb [arch=amd64,arm64] https://repo.wnode.io/apt stable main" | sudo tee /etc/apt/sources.list.d/wnode.list
sudo apt-get update && sudo apt-get install -y nodld

sudo mkdir -p /etc/wnode
sudo tee /etc/wnode/nodld.conf << 'EOF'
NODE_IDENTITY_KEY=/etc/wnode/identity.key
ORCHESTRATOR_ENDPOINT=wss://mesh.wnode.io:8443
LISTEN_PORT=8080
MAX_MICROVMS=16
MAX_MEMORY_MB=32768
EOF

sudo systemctl enable --now nodld
sudo systemctl status nodld`} />
      </section>

      <section className="space-y-4">
        <h2 id="firewall-wireguard" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          4. UFW Firewall Hardening &amp; WireGuard Mesh Integration
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Edge nodes communicate with orchestrators over encrypted WireGuard P2P mTLS tunnels. Configure Linux Uncomplicated Firewall (UFW) rules to restrict inbound port exposures:
        </p>
        <CodeBlock language="bash" filename="firewall-setup.sh" code={`sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 51820/udp
sudo ufw allow 8080/tcp
sudo ufw enable`} />
      </section>

      <section className="space-y-4">
        <h2 id="cbrs-backhaul" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          5. CBRS Cellular Radio Gateway Backhaul Setup
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Nodes featuring CBRS cellular hardware connect to Spectrum Access System (SAS) servers (e.g. Federated Wireless, Google SAS) to acquire dynamic 3.55-3.70 GHz frequency grant channels.
        </p>
        <p className="text-slate-300 leading-relaxed mb-4">
          Radio gateways stream subscriber data sessions through GTP-U tunnels into local packet classifiers. Outdoor CBSD antenna installations require Certified Professional Installer (CPI) credential verification uploaded during node registration.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="gui-cli-monitoring" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          6. Desktop GUI Status &amp; Interactive CLI Administration
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Operators monitor real-time node health using either the Wnode Desktop GUI dashboard or the interactive terminal CLI menu (`wnode-admin`). The GUI provides visual charts detailing vCPU load, memory allocation graphs, daily Stripe payout estimates, and real-time p95 ping latency matrices.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="telemetry-exporter" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          7. Prometheus Metrics Exporter &amp; System Health Hooks
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Every `nodld` instance exposes a `/metrics` Prometheus endpoint on port 9100. Metrics include active microVM container counts, total vCPU cycle consumption, network byte transfer counters, and TPM attestation status indicators.
        </p>
      </section>

      <section className="space-y-4">
        <h2 id="maintenance-upgrades" className="text-xl font-semibold text-white tracking-tight border-b border-slate-800 pb-2">
          8. Node Maintenance &amp; Rolling Software Upgrades
        </h2>
        <p className="text-slate-300 leading-relaxed mb-4">
          Initiate a zero-downtime drain sequence (`wnode-admin drain`) before upgrading daemon software or host kernels. The orchestrator routes new requests to nearby mesh peers while active jobs complete gracefully.
        </p>
      </section>

      {/* Related Pages Block */}
      <section className="space-y-4 pt-6 border-t border-slate-800" aria-label="Related Operator Pages">
        <h2 className="text-lg font-semibold text-white tracking-tight">Related Node Operator References</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/docs/operator/cbrs-backhaul" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-indigo-400 group-hover:text-indigo-300">CBRS Backhaul Gateway →</h3>
            <p className="text-xs text-slate-400 mt-1">Spectrum Access System (SAS) grant request configurations.</p>
          </a>
          <a href="/docs/operator/desktop-gui-status" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-cyan-400 group-hover:text-cyan-300">Desktop GUI Status →</h3>
            <p className="text-xs text-slate-400 mt-1">Visual telemetry charts, Stripe payout estimates, and latency matrices.</p>
          </a>
          <a href="/docs/operator/node-hardening" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-amber-400 group-hover:text-amber-300">Node Security Hardening →</h3>
            <p className="text-xs text-slate-400 mt-1">UFW firewall rules, SSH key hardening, and systemd security options.</p>
          </a>
          <a href="/docs/operator/quickstart" className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group">
            <h3 className="text-sm font-semibold text-emerald-400 group-hover:text-emerald-300">Operator Quickstart →</h3>
            <p className="text-xs text-slate-400 mt-1">Single-command installer script for rapid node deployment.</p>
          </a>
        </div>
      </section>
    </div>
  );
}
