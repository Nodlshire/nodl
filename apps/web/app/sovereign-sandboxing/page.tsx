"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function SovereignSandboxingPage() {
    const [modalMode, setModalMode] = useState<ModalMode>("beta_tester");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (mode: ModalMode) => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "Can a compute job access personal files on the host computer?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. All guest tasks execute strictly within isolated volatile RAM allocations managed by mlock kernel primitives. Guest processes have zero access to the host disk, user profile directories, network storage mounts, or operating system system calls outside pre-negotiated capability flags."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode guarantee enterprise data privacy without centralized logging?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode relies on zero-retention ephemeral memory buffers. Once a compute payload finishes execution and returns its mTLS-encrypted result receipt, the associated RAM blocks are immediately scrubbed and unmapped. No state, cache, or trace persists on disk or in orchestrator databases."
                }
            },
            {
                "@type": "Question",
                "name": "What happens if an untrusted task crashes or attempts malicious network scans?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Outbound I/O is governed by strict capability-scoped syscall filters. Any attempt by a guest workload to open unauthorized sockets, scan local network subnets, or perform privilege escalation instantly trips the kernel trap, terminating the task in under 1 millisecond without disturbing host daemon operation."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode handle node operator identity without invasive surveillance?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Operators are identified solely by hardware-bound cryptographic Ed25519 public keypairs. All task telemetry, epoch validation, and payout accounting are tied to the Ed25519 signature of the node daemon rather than IP logs, MAC addresses, or personal host telemetry."
                }
            },
            {
                "@type": "Question",
                "name": "How are compute rewards distributed to node operators under sovereign sandboxing?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Node operators earn 70% of gross compute spend. Remaining protocol proceeds support sales sources (10%), L1 direct affiliates (3%), L2 network overrides (7%), protocol stewardship (7%), and founder reserves (3%). Payouts are settled automatically in USD via Stripe Connect upon reaching the $25 threshold."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-purple-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-400 text-xs font-mono uppercase tracking-widest">
                        <span>🔒 Sovereign Privacy &amp; Enterprise Edge Sandboxing</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Zero-Knowledge Telemetry, Sovereign Privacy &amp; Enterprise Sandboxing 2026
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Execute confidential AI micro-tasks and enterprise workloads on distributed consumer hardware with zero host disk access, zero local logging, and hardware-bound Ed25519 attestation.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-center"
                        >
                            Deploy Sandboxed Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Audit Security Specs
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">0 Disk Writes</div>
                        <h3 className="text-lg font-bold text-white mb-2">RAM-Only Isolation</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Volatile <code className="text-purple-300 bg-purple-950/50 px-1 py-0.5 rounded">mlock</code> memory allocations isolate guest workloads. Zero persistent disk writes shield host SSDs from wear while guaranteeing instant execution erasure.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">Ed25519 Bound</div>
                        <h3 className="text-lg font-bold text-white mb-2">Cryptographic Attestation</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Hardware-bound Ed25519 keypairs sign routing epochs and deterministic execution receipts without collecting personal host profiling data.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">GDPR &amp; CCPA Clean</div>
                        <h3 className="text-lg font-bold text-white mb-2">Zero-Retention Fabric</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Pure stateless processing eliminates physical data residency hazards and cold storage liabilities. Earn 70% USD node yield with absolute peace of mind.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative (Section 1) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-purple-500 pl-4">
                        1. The Architecture of Sovereign Edge Privacy &amp; Volatile Sandboxing
                    </h2>
                    <p>
                        As global enterprise artificial intelligence workloads scale exponentially, centralized cloud providers face an inescapable dilemma: centralized logging creates massive data retention liability, while unencrypted tenant processing leaves sensitive models vulnerable to data center hypervisor introspection. Wnode resolves this structural conflict through a novel <strong>stateless RAM-only compute sandbox</strong> running on distributed commodity hardware.
                    </p>
                    <p>
                        Instead of relying on heavy corporate virtual machines or specialized hardware enclaves like Intel SGX—which introduce performance bottlenecks and hardware supply chain lock-in—Wnode enforces strict <strong>capability-scoped process isolation</strong> directly within the native Go daemon (<code className="text-cyan-400">nodld</code>). Every incoming task envelope is allocated a dedicated, locked memory block using system-level <code className="text-purple-400 font-mono">mlock</code> calls.
                    </p>
                    <p>
                        This architecture enforces two vital safety guarantees:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-4 text-slate-300">
                        <li><strong className="text-white">Host Security:</strong> Guest compute micro-tasks are fully air-gapped from host filesystems, local storage drives, personal profiles, and adjacent system processes. The guest workload possesses zero capability to read or modify host data.</li>
                        <li><strong className="text-white">Tenant Privacy:</strong> Compute payloads operate ephemerally. Once an execution shard completes and returns its encrypted output envelope, the memory allocation is zero-overwritten and unmapped, leaving zero residual traces on the physical machine.</li>
                    </ul>
                </section>

                {/* SVG Diagram 1: RAM Sandbox & Host Isolation Boundary */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 1: Host Kernel &amp; Volatile RAM Sandbox Isolation Boundary</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Hand-drawn technical topology demonstrating air-gapped host memory partitioning, capability traps, and zero disk write protection.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 480" className="w-full h-auto min-w-[700px] text-white">
                            <defs>
                                <filter id="glow-purple" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            {/* Background Grid */}
                            <rect width="900" height="480" fill="#000000" rx="12" />
                            <path d="M 0,60 L 900,60 M 0,120 L 900,120 M 0,180 L 900,180 M 0,240 L 900,240 M 0,300 L 900,300 M 0,360 L 900,360 M 0,420 L 900,420" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />
                            <path d="M 100,0 L 100,480 M 200,0 L 200,480 M 300,0 L 300,480 M 400,0 L 400,480 M 500,0 L 500,480 M 600,0 L 600,480 M 700,0 L 700,480 M 800,0 L 800,480" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />

                            {/* Main Host Boundary Box */}
                            <rect x="40" y="30" width="820" height="420" rx="16" fill="#09090b" fillOpacity="0.8" stroke="#334155" strokeWidth="2" strokeDasharray="6 3" />
                            <text x="65" y="60" fill="#94a3b8" fontSize="13" fontFamily="monospace" fontWeight="bold">HOST MACHINE KERNEL BOUNDARY (Linux / macOS / Windows)</text>

                            {/* Host Native Space */}
                            <rect x="65" y="85" width="340" height="340" rx="12" fill="#030712" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.6" filter="url(#glow-cyan)" />
                            <text x="85" y="115" fill="#38bdf8" fontSize="15" fontFamily="sans-serif" fontWeight="bold">Host Operating System</text>
                            <text x="85" y="135" fill="#64748b" fontSize="11" fontFamily="monospace">Go Daemon (nodld) + Local User Space</text>

                            {/* Inside Host: SSD / Filesystem Warning */}
                            <rect x="85" y="160" width="300" height="110" rx="8" fill="#180e02" stroke="#ffb800" strokeWidth="1.5" strokeDasharray="4 2" filter="url(#glow-amber)" />
                            <text x="100" y="188" fill="#ffb800" fontSize="13" fontFamily="sans-serif" fontWeight="bold">⚠️ Physical Disk &amp; User Files</text>
                            <text x="100" y="210" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif">/home, /Documents, NVMe SSD, SATA drives</text>
                            <text x="100" y="230" fill="#ffb800" fontSize="10" fontFamily="monospace" fontWeight="bold">ACCESS POLICY: ZERO READ / ZERO WRITE</text>
                            <text x="100" y="250" fill="#64748b" fontSize="10" fontFamily="sans-serif">Protects SSD longevity &amp; operator privacy</text>

                            {/* Inside Host: Ed25519 Identity Store */}
                            <rect x="85" y="295" width="300" height="110" rx="8" fill="#0f172a" stroke="#00f0ff" strokeWidth="1.5" />
                            <text x="100" y="323" fill="#00f0ff" fontSize="13" fontFamily="sans-serif" fontWeight="bold">🔑 Ed25519 Hardware Identity</text>
                            <text x="100" y="345" fill="#cbd5e1" fontSize="11" fontFamily="sans-serif">Local keypair signs routing receipts</text>
                            <text x="100" y="365" fill="#38bdf8" fontSize="10" fontFamily="monospace">No Personal Telemetry / No IP Logging</text>
                            <text x="100" y="385" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Deterministic cryptographic proof of work</text>

                            {/* Barrier Line */}
                            <line x1="435" y1="85" x2="435" y2="425" stroke="#ffb800" strokeWidth="3" strokeDasharray="8 4" filter="url(#glow-amber)" />
                            <rect x="415" y="230" width="40" height="40" rx="8" fill="#ffb800" />
                            <text x="424" y="255" fill="#000" fontSize="18" fontWeight="bold">🚫</text>

                            {/* Isolated Ephemeral RAM Sandbox */}
                            <rect x="465" y="85" width="370" height="340" rx="12" fill="#0b0714" stroke="#a855f7" strokeWidth="2" filter="url(#glow-purple)" />
                            <text x="485" y="115" fill="#a855f7" fontSize="15" fontFamily="sans-serif" fontWeight="bold">Stateless Ephemeral RAM Sandbox</text>
                            <text x="485" y="135" fill="#c084fc" fontSize="11" fontFamily="monospace">mlock Volatile Isolation (Zero Persistence)</text>

                            {/* Task Container Inside RAM */}
                            <rect x="485" y="160" width="330" height="140" rx="8" fill="#051c14" stroke="#00ff66" strokeWidth="1.5" filter="url(#glow-emerald)" />
                            <text x="505" y="188" fill="#00ff66" fontSize="13" fontFamily="sans-serif" fontWeight="bold">⚡ Enterprise AI Inference Task Payload</text>
                            <text x="505" y="210" fill="#a7f3d0" fontSize="11" fontFamily="sans-serif">Ephemeral LLM KV-Cache / Vector Shard</text>
                            <text x="505" y="235" fill="#34d399" fontSize="10" fontFamily="monospace">Process Memory: Locked in RAM (mlock)</text>
                            <text x="505" y="255" fill="#6ee7b7" fontSize="10" fontFamily="monospace">Syscall Filter: Capability-Scoped Trap Active</text>
                            <text x="505" y="275" fill="#00ff66" fontSize="10" fontFamily="monospace" fontWeight="bold">STATUS: EXECUTE &amp; FLUSH (0 TRACE)</text>

                            {/* Outbound Capability Filter Box */}
                            <rect x="485" y="315" width="330" height="90" rx="8" fill="#111827" stroke="#38bdf8" strokeWidth="1" />
                            <text x="505" y="340" fill="#38bdf8" fontSize="12" fontFamily="sans-serif" fontWeight="bold">🛡️ Capability-Scoped Outbound I/O Filter</text>
                            <text x="505" y="360" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">Blocks unauthorized socket binding &amp; LAN scanning</text>
                            <text x="505" y="380" fill="#00f0ff" fontSize="10" fontFamily="monospace">Only encrypted mTLS tenant streams allowed</text>

                            {/* Floating Neon Callout Tag */}
                            <g transform="translate(680, 40)">
                                <rect width="160" height="30" rx="15" fill="#a855f7" fillOpacity="0.2" stroke="#a855f7" strokeWidth="1" />
                                <text x="80" y="19" fill="#e9d5ff" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">AIR-GAPPED MEMORY</text>
                            </g>
                        </svg>
                    </div>
                </section>

                {/* Architectural Narrative (Section 2) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-cyan-500 pl-4">
                        2. Zero-Knowledge Telemetry, mTLS Envelopes &amp; Capability Scoping
                    </h2>
                    <p>
                        Traditional cloud and decentralized systems often compromise security by requiring continuous telemetry reporting, exposing private host IP addresses, system metrics, and network configurations to central telemetry aggregators. Wnode turns this model upside down through <strong>Zero-Knowledge Telemetry (ZKT)</strong>.
                    </p>
                    <p>
                        When an autonomous agent or enterprise client dispatches a micro-job across the Wnode fabric, the transaction is encapsulated in an encrypted <strong>mTLS (Mutual TLS 1.3) telemetry envelope</strong>. The client signs the task request with an HMAC challenge, while the node operator’s Go daemon validates authorization using cryptographically signed routing epochs issued by the Wnode Steward network.
                    </p>

                    <div className="bg-[#09090b]/80 border border-cyan-500/20 rounded-2xl p-6 md:p-8 space-y-4 my-6">
                        <h3 className="text-xl font-bold text-cyan-400">Core Security Mechanics of the Sovereign Sandbox</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <span className="text-cyan-400">▸</span> Capability-Scoped Outbound I/O
                                </h4>
                                <p className="text-slate-400">
                                    Guest workloads execute under strict Linux <code className="text-cyan-300">seccomp-bpf</code> system call traps. Unrestricted raw socket creation, local subnet scanning, and arbitrary external network connections are denied by default.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <span className="text-cyan-400">▸</span> Hardware-Bound Ed25519 Proofs
                                </h4>
                                <p className="text-slate-400">
                                    Every task completion receipt is signed locally using an Ed25519 private key stored in volatile daemon memory. Work validation is mathematical and non-repudiable without collecting personal operator identity.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <span className="text-cyan-400">▸</span> Non-Custodial Model Inference
                                </h4>
                                <p className="text-slate-400">
                                    Enterprise tenants retain full end-to-end encryption over weights and input prompts. Node operators process mathematical matrices blindly in locked RAM, earning USD yield without inspecting tenant data.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <span className="text-cyan-400">▸</span> Grace-Based Reputation Decay
                                </h4>
                                <p className="text-slate-400">
                                    Replaces punitive crypto-staking slashings with continuous grace-based score decay curves. Transient home internet drops penalize node routing priority temporarily without confiscating capital.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p>
                        By combining deterministic execution verification with cryptographically signed epochs, enterprise compute buyers obtain <strong>verifiable computation proofs</strong> without requiring intrusive surveillance daemons or host machine root access.
                    </p>
                </section>

                {/* SVG Diagram 2: ZK-Telemetry Attestation & Execution Flow */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 2: Deterministic Attestation Pipeline &amp; Zero-Knowledge Receipt Flow</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            End-to-end cryptographic sequence showing tenant HMAC dispatch, mlock RAM execution, Ed25519 signing, and verified emerald seal return.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 400" className="w-full h-auto min-w-[700px] text-white">
                            <defs>
                                <filter id="glow-emerald-lg" x="-30%" y="-30%" width="160%" height="160%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <filter id="glow-cyan-lg" x="-30%" y="-30%" width="160%" height="160%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            {/* Background Grid */}
                            <rect width="900" height="400" fill="#000000" rx="12" />
                            <path d="M 0,50 L 900,50 M 0,100 L 900,100 M 0,150 L 900,150 M 0,200 L 900,200 M 0,250 L 900,250 M 0,300 L 900,300 M 0,350 L 900,350" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="4 4" />

                            {/* Flow Steps Boxes */}
                            {/* Step 1: Enterprise Tenant Client */}
                            <rect x="40" y="140" width="160" height="140" rx="12" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" filter="url(#glow-cyan-lg)" />
                            <text x="120" y="170" fill="#38bdf8" fontSize="13" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">1. Tenant Dispatch</text>
                            <text x="120" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">mTLS 1.3 Envelope</text>
                            <text x="120" y="215" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Encrypted Task + HMAC</text>
                            <text x="120" y="235" fill="#38bdf8" fontSize="9" fontFamily="monospace" textAnchor="middle">Epoch Signed Manifest</text>
                            <rect x="55" y="250" width="130" height="20" rx="10" fill="#0284c7" fillOpacity="0.3" />
                            <text x="120" y="264" fill="#7dd3fc" fontSize="9" fontFamily="monospace" textAnchor="middle">Client Authority</text>

                            {/* Arrow 1 -> 2 */}
                            <path d="M 200,210 L 255,210" stroke="#00f0ff" strokeWidth="2" markerEnd="url(#arrow)" />
                            <polygon points="255,205 265,210 255,215" fill="#00f0ff" />

                            {/* Step 2: Routing Epoch Validation */}
                            <rect x="265" y="140" width="160" height="140" rx="12" fill="#09090b" stroke="#a855f7" strokeWidth="1.5" />
                            <text x="345" y="170" fill="#a855f7" fontSize="13" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">2. Epoch Check</text>
                            <text x="345" y="195" fill="#94a3b8" fontSize="10" fontFamily="monospace" textAnchor="middle">Signed Epoch Gate</text>
                            <text x="345" y="215" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Validates Orchestrator</text>
                            <text x="345" y="235" fill="#c084fc" fontSize="9" fontFamily="monospace" textAnchor="middle">Ed25519 Token Match</text>
                            <rect x="280" y="250" width="130" height="20" rx="10" fill="#7e22ce" fillOpacity="0.3" />
                            <text x="345" y="264" fill="#e9d5ff" fontSize="9" fontFamily="monospace" textAnchor="middle">Capability Verified</text>

                            {/* Arrow 2 -> 3 */}
                            <path d="M 425,210 L 480,210" stroke="#a855f7" strokeWidth="2" />
                            <polygon points="480,205 490,210 480,215" fill="#a855f7" />

                            {/* Step 3: mlock RAM Compute */}
                            <rect x="490" y="140" width="160" height="140" rx="12" fill="#051c14" stroke="#00ff66" strokeWidth="1.5" filter="url(#glow-emerald-lg)" />
                            <text x="570" y="170" fill="#00ff66" fontSize="13" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">3. RAM Execution</text>
                            <text x="570" y="195" fill="#a7f3d0" fontSize="10" fontFamily="monospace" textAnchor="middle">mlock Volatile Shard</text>
                            <text x="570" y="215" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Stateless Inference</text>
                            <text x="570" y="235" fill="#34d399" fontSize="9" fontFamily="monospace" textAnchor="middle">0 Disk Write / 0 Log</text>
                            <rect x="505" y="250" width="130" height="20" rx="10" fill="#047857" fillOpacity="0.4" />
                            <text x="570" y="264" fill="#6ee7b7" fontSize="9" fontFamily="monospace" textAnchor="middle">Immediate RAM Flush</text>

                            {/* Arrow 3 -> 4 */}
                            <path d="M 650,210 L 705,210" stroke="#00ff66" strokeWidth="2" />
                            <polygon points="705,205 715,210 705,215" fill="#00ff66" />

                            {/* Step 4: Receipt & USD Payout */}
                            <rect x="715" y="140" width="145" height="140" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="2" filter="url(#glow-emerald-lg)" />
                            <text x="787" y="170" fill="#00ff66" fontSize="13" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">4. Verified Seal</text>
                            <text x="787" y="195" fill="#6ee7b7" fontSize="10" fontFamily="monospace" textAnchor="middle">Ed25519 Signed Proof</text>
                            <text x="787" y="215" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Encrypted Output</text>
                            <text x="787" y="235" fill="#34d399" fontSize="9" fontFamily="monospace" textAnchor="middle">70% USD Operator Yield</text>
                            <rect x="725" y="250" width="125" height="20" rx="10" fill="#10b981" />
                            <text x="787" y="264" fill="#000" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">STRIPE USD PAYOUT</text>

                            {/* Header Label */}
                            <text x="450" y="60" fill="#f8fafc" fontSize="16" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">
                                Deterministic Execution &amp; Zero-Knowledge Proof Pipeline
                            </text>
                            <text x="450" y="85" fill="#64748b" fontSize="11" fontFamily="monospace" textAnchor="middle">
                                Stateless payloads run blindly in RAM ➔ Output encrypted ➔ Operator paid 70% direct USD
                            </text>
                        </svg>
                    </div>
                </section>

                {/* Regulatory & Institutional Compliance (Section 3) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                        3. Regulatory Invariance: Inherently Solving GDPR, CCPA &amp; Data Localization
                    </h2>
                    <p>
                        Centralized data centers and cloud monopolies spent billions attempting to comply with complex data residency regulations like the European Union’s General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and global sovereign data localization laws. Their foundational architectural flaw is reliance on persistent cold storage database clusters.
                    </p>
                    <p>
                        Wnode’s sovereign sandboxing eliminates data residency liability at the physics layer:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl space-y-2">
                            <h4 className="text-lg font-bold text-emerald-400">Zero Persistent Storage</h4>
                            <p className="text-slate-400 text-sm">
                                Because compute shards operate strictly within ephemeral RAM and evaporate upon task completion, there are no database records, user profiles, or physical storage logs to subpoena or audit.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl space-y-2">
                            <h4 className="text-lg font-bold text-purple-400">UAE &amp; Global Sovereignty Alignment</h4>
                            <p className="text-slate-400 text-sm">
                                Perfectly aligned with high-assurance regulatory frameworks (such as the UAE National Innovation Strategy and Dubai Virtual Assets Regulatory Authority privacy standards) for decentralized infrastructure and enterprise AI execution.
                            </p>
                        </div>
                    </div>
                    <p>
                        By removing centralized data storage from the execution loop, enterprise clients maintain total control over their data lifecycle, while node operators receive 70% of gross compute fees without incurring data controller liabilities.
                    </p>
                </section>

                {/* Economic Revenue Waterfall & Invariants */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-amber-500 pl-4">
                        4. Immutable Economic Distribution &amp; Stripe Connect USD Payouts
                    </h2>
                    <p>
                        Sovereign privacy goes hand-in-hand with economic transparency. Unlike speculative Web3 protocols that force operators to accept volatile token reward points subject to inflationary emissions, Wnode settles all enterprise compute demand strictly in fiat USD.
                    </p>
                    <p>
                        Every dollar spent by institutional AI inference buyers and enterprise telemetry clients is deterministically allocated according to Wnode’s canonical revenue waterfall:
                    </p>

                    {/* Revenue Table */}
                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 my-6">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase bg-white/5 text-slate-200 font-mono">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Allocation Role</th>
                                    <th className="px-4 py-3">Percentage Share</th>
                                    <th className="px-4 py-3">Settlement Rail</th>
                                    <th className="px-4 py-3 rounded-r-lg">Functional Mechanics</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 font-mono text-xs md:text-sm">
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-emerald-400">Node Operator</td>
                                    <td className="px-4 py-3 font-bold text-white">70% Direct</td>
                                    <td className="px-4 py-3 text-emerald-400">Stripe Connect USD</td>
                                    <td className="px-4 py-3 text-slate-400">Direct yield for provisioned CPU/GPU RAM capacity</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-cyan-400">Sales Source</td>
                                    <td className="px-4 py-3 text-white">10% Lifetime</td>
                                    <td className="px-4 py-3 text-cyan-400">Stripe Connect USD</td>
                                    <td className="px-4 py-3 text-slate-400">Permanent bounty for originating enterprise compute buyer</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-purple-400">Level 1 Referral</td>
                                    <td className="px-4 py-3 text-white">3% Direct</td>
                                    <td className="px-4 py-3 text-purple-400">Stripe Connect USD</td>
                                    <td className="px-4 py-3 text-slate-400">Direct sponsor bonus on referred node hardware yield</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-purple-300">Level 2 Network</td>
                                    <td className="px-4 py-3 text-white">7% Network</td>
                                    <td className="px-4 py-3 text-purple-300">Stripe Connect USD</td>
                                    <td className="px-4 py-3 text-slate-400">Secondary tier override on expanded node operator networks</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-amber-400">Protocol Steward</td>
                                    <td className="px-4 py-3 text-white">7% Entity</td>
                                    <td className="px-4 py-3 text-amber-400">Stripe Treasury</td>
                                    <td className="px-4 py-3 text-slate-400">Core software maintenance, security audits, &amp; research</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-slate-400">Founder Reserve</td>
                                    <td className="px-4 py-3 text-white">3% Protocol</td>
                                    <td className="px-4 py-3 text-slate-400">Stripe Treasury</td>
                                    <td className="px-4 py-3 text-slate-400">Long-term protocol alignment &amp; strategic reserve</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <p>
                        Node balances accumulate automatically inside the Wnode dashboard. Once an operator reaches the standard <strong>$25 minimum payout floor</strong>, funds are transferred directly to their linked bank account via Stripe Connect ACH or direct wire.
                    </p>
                </section>

                {/* Comprehensive FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-slate-400 text-sm">Everything you need to know about Wnode sovereign sandboxing and enterprise privacy.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Can a compute job access personal files on the host computer?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                No. All guest tasks execute strictly within isolated volatile RAM allocations managed by <code className="text-purple-300 bg-purple-950/50 px-1 py-0.5 rounded">mlock</code> kernel primitives. Guest processes have zero access to the host disk, user profile directories, network storage mounts, or operating system system calls outside pre-negotiated capability flags.
                            </p>
                        </div>

                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How does Wnode guarantee enterprise data privacy without centralized logging?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Wnode relies on zero-retention ephemeral memory buffers. Once a compute payload finishes execution and returns its mTLS-encrypted result receipt, the associated RAM blocks are immediately scrubbed and unmapped. No state, cache, or trace persists on disk or in orchestrator databases.
                            </p>
                        </div>

                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: What happens if an untrusted task crashes or attempts malicious network scans?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Outbound I/O is governed by strict capability-scoped syscall filters. Any attempt by a guest workload to open unauthorized sockets, scan local network subnets, or perform privilege escalation instantly trips the kernel trap, terminating the task in under 1 millisecond without disturbing host daemon operation.
                            </p>
                        </div>

                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How does Wnode handle node operator identity without invasive surveillance?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Operators are identified solely by hardware-bound cryptographic Ed25519 public keypairs. All task telemetry, epoch validation, and payout accounting are tied to the Ed25519 signature of the node daemon rather than IP logs, MAC addresses, or personal host telemetry.
                            </p>
                        </div>

                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How are compute rewards distributed to node operators under sovereign sandboxing?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Node operators earn 70% of gross compute spend. Remaining protocol proceeds support sales sources (10%), L1 direct affiliates (3%), L2 network overrides (7%), protocol stewardship (7%), and founder reserves (3%). Payouts are settled automatically in USD via Stripe Connect upon reaching the $25 threshold.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA Banner */}
                <section className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-cyan-950/40 border border-purple-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden backdrop-blur-md">
                    <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Join the World’s First Sovereign Private Edge Compute Fabric
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg">
                            Turn your idle PC or server memory into an air-gapped revenue engine. Protect your SSDs, preserve total privacy, and earn direct USD yield today.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] text-center"
                            >
                                Deploy Node Daemon Now &rarr;
                            </a>
                            <button
                                onClick={() => openModal("waitlist")}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                            >
                                Enterprise Inquiries
                            </button>
                        </div>
                    </div>
                </section>
            
                {/* Author Attribution */}
                <div className="pt-8 border-t border-white/10 text-center text-slate-400 font-mono text-sm">
                    Author: Stephen Soos
                </div>
            </main>

            <Footer />
            <CTAModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialMode={modalMode}
            />
        </div>
    );
}
