"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function DePINHardwareNodesPage() {
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
                "name": "What makes Wnode one of the depin projects with real yield 2026?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode is built as a decentralized physical infrastructure network fiat payout engine. Instead of speculative tokens, enterprise compute buyers pay fiat USD via Stripe Connect, delivering real USD yield directly to hardware operators."
                }
            },
            {
                "@type": "Question",
                "name": "Why are commodity hardware depin compute runner nodes better than proprietary miners?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "By using everyday PCs, laptops, and homelab servers as a bare metal depin compute layer, you earn depin passive income without buying expensive hardware or risking single-purpose device obsolescence."
                }
            },
            {
                "@type": "Question",
                "name": "Is running a compute node legal on residential internet?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Residential compute node legal protections apply because Wnode operates in volatile RAM with zero persistent disk logging, zero proxy tunneling, and strict SEC compliant depin networks 2026 standards."
                }
            },
            {
                "@type": "Question",
                "name": "What is the difference between stateless compute depin vs storage nodes?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Stateless compute nodes process volatile micro-tasks in RAM with zero disk writes, whereas storage nodes consume disk space and degrade SSD endurance over time."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-cyan-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
                        <span>🌐 Bare Metal DePIN Compute Layer</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        DePIN Projects With Real Yield 2026: The Ultimate DePIN Hardware Monetization Guide
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Discover the best depin nodes to run from home. Learn how to turn idle pc into depin node infrastructure, monetize idle cpu gpu depin capacity, and secure depin passive income without buying expensive hardware.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] text-center"
                        >
                            Deploy Commodity Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Explore Architecture
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">Native Go Core</div>
                        <h3 className="text-lg font-bold text-white mb-2">Bare Metal DePIN Compute Layer</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Executes directly on Windows, Linux, and macOS. Operates as a true commodity hardware depin compute runner without heavy hypervisors or Docker overhead.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">70% Fiat Yield</div>
                        <h3 className="text-lg font-bold text-white mb-2">DePIN Networks Paying in USD Stripe</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Positioned among the best depin projects no token volatility. Enterprise buyers settle in cash USD, providing a decentralized physical infrastructure network fiat payout rail.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">Zero SSD Wear</div>
                        <h3 className="text-lg font-bold text-white mb-2">Stateless Compute DePIN vs Storage Nodes</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Workloads execute strictly in volatile mlock RAM. Protects solid-state drives while offering low barrier depin projects for beginners looking for safe setup.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-cyan-500 pl-4">
                        1. DePIN Hardware Monetization Guide: Commodity Hardware Over Proprietary Miners
                    </h2>
                    <p>
                        The DePIN ecosystem in 2026 is undergoing a major shift. Operators are rejecting legacy models that forced users to buy single-purpose $600 miner boxes. Instead, modern deployments rely on everyday PCs, laptops, and homelab servers. Following our complete <strong>depin node setup guide windows linux mac</strong>, anyone can convert ambient silicon into an enterprise-grade execution endpoint.
                    </p>
                    <p>
                        When evaluating <strong>stateless compute depin vs storage nodes</strong>, the advantages of stateless execution become immediate. Storage-focused DePIN networks continuously perform heavy disk read/write cycles, causing premature SSD failure and bandwidth saturation. Wnode’s native Go daemon (<code className="text-cyan-400">nodld</code>) functions strictly in volatile RAM, establishing an air-gapped <strong>bare metal depin compute layer</strong> that guarantees zero persistent storage footprint.
                    </p>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-4 my-6">
                        <h3 className="text-xl font-bold text-white">Why Wnode Ranks Among the Best DePIN Nodes to Run From Home</h3>
                        <ul className="list-disc list-inside space-y-2 text-slate-300 text-sm md:text-base">
                            <li><strong className="text-white">Zero Capital Expense:</strong> Secure depin passive income without buying expensive hardware or proprietary ASIC rigs.</li>
                            <li><strong className="text-white">Seamless Setup:</strong> Follow our 1-step guide to turn idle pc into depin node infrastructure in under 2 minutes.</li>
                            <li><strong className="text-white">Real USD Flow:</strong> Recognized among depin networks paying in usd stripe with zero token inflation risk.</li>
                            <li><strong className="text-white">Low Friction:</strong> Designed specifically as low barrier depin projects for beginners and homelab enthusiasts alike.</li>
                        </ul>
                    </div>
                </section>

                {/* SVG 1: Topology */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 1: Hyperscaler Monolith vs. Distributed Commodity Silicon Mesh</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Architectural breakdown contrasting centralized cloud data centers with Wnode’s stateless commodity hardware depin compute runner mesh.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 420" className="w-full h-auto min-w-[700px] text-white">
                            <defs>
                                <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                                <filter id="glow-emerald" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <rect width="900" height="420" fill="#000000" rx="12" />
                            
                            {/* Left Side: Centralized Hyperscaler */}
                            <rect x="40" y="40" width="370" height="340" rx="12" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 2" />
                            <text x="60" y="75" fill="#ef4444" fontSize="16" fontFamily="sans-serif" fontWeight="bold">Centralized Data Center Monolith</text>
                            <text x="60" y="100" fill="#94a3b8" fontSize="11" fontFamily="monospace">Single Point of Failure &amp; High Overhead</text>
                            
                            <rect x="60" y="120" width="330" height="60" rx="6" fill="#180505" stroke="#f87171" strokeWidth="1" />
                            <text x="75" y="145" fill="#f87171" fontSize="12" fontFamily="sans-serif" fontWeight="bold">50-Acre Concrete Server Farm</text>
                            <text x="75" y="165" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Multi-Gigawatt Grid Strain &amp; Evaporative Cooling</text>

                            <rect x="60" y="195" width="330" height="60" rx="6" fill="#180505" stroke="#f87171" strokeWidth="1" />
                            <text x="75" y="220" fill="#f87171" fontSize="12" fontFamily="sans-serif" fontWeight="bold">30% Vendor Markup &amp; Egress Lock-In</text>
                            <text x="75" y="240" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Cloud Monopoly Margin Capture</text>

                            <rect x="60" y="270" width="330" height="90" rx="6" fill="#180505" stroke="#f87171" strokeWidth="1" />
                            <text x="75" y="295" fill="#f87171" fontSize="12" fontFamily="sans-serif" fontWeight="bold">Single-Purpose $600 DePIN Boxes</text>
                            <text x="75" y="315" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif">High hardware cost, supply chain delays, token risk</text>

                            {/* Right Side: Wnode Mesh */}
                            <rect x="490" y="40" width="370" height="340" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5" filter="url(#glow-cyan)" />
                            <text x="510" y="75" fill="#00f0ff" fontSize="16" fontFamily="sans-serif" fontWeight="bold">Wnode Distributed Silicon Mesh</text>
                            <text x="510" y="100" fill="#38bdf8" fontSize="11" fontFamily="monospace">Bare Metal Native Go Execution (nodld)</text>

                            <rect x="510" y="120" width="330" height="70" rx="6" fill="#031c26" stroke="#00f0ff" strokeWidth="1" />
                            <text x="525" y="145" fill="#00f0ff" fontSize="12" fontFamily="sans-serif" fontWeight="bold">Everyday PC, Laptop &amp; Homelab Nodes</text>
                            <text x="525" y="165" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Monetize idle CPU/GPU with 0 hardware cost</text>

                            <rect x="510" y="205" width="330" height="70" rx="6" fill="#052418" stroke="#00ff66" strokeWidth="1" filter="url(#glow-emerald)" />
                            <text x="525" y="230" fill="#00ff66" fontSize="12" fontFamily="sans-serif" fontWeight="bold">Stateless RAM-Only mlock Sandbox</text>
                            <text x="525" y="250" fill="#cbd5e1" fontSize="10" fontFamily="monospace">0 disk writes ➔ Zero SSD wear degradation</text>

                            <rect x="510" y="290" width="330" height="70" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
                            <text x="525" y="315" fill="#38bdf8" fontSize="12" fontFamily="sans-serif" fontWeight="bold">70% Direct USD Fiat Flow via Stripe</text>
                            <text x="525" y="335" fill="#cbd5e1" fontSize="10" fontFamily="monospace">Real enterprise buyers ➔ No token volatility</text>
                        </svg>
                    </div>
                </section>

                {/* Economic Waterfall & Legal Compliance */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                        2. Deterministic Yield &amp; Legal Framework: Is Running a Compute Node Legal?
                    </h2>
                    <p>
                        A common question among new operators is: <strong>is running a compute node legal</strong> on residential ISP connections? The answer is an overwhelming yes. Wnode enforces <strong>residential compute node legal protections</strong> through stateless RAM processing and zero proxy exit-node functionality. Unlike proxy networks that route unknown third-party web traffic through your home IP, Wnode exclusively executes stateless AI mathematical shards inside volatile memory.
                    </p>
                    <p>
                        Furthermore, Wnode operates within <strong>sec compliant depin networks 2026</strong> standards. Settlements bypass speculative tokens entirely. Every $1.00 USD of enterprise compute demand is distributed through an immutable 6-tier revenue waterfall paid in fiat cash via Stripe Connect:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono my-6">
                        <div className="bg-[#09090b]/80 border border-emerald-500/30 p-4 rounded-xl space-y-1">
                            <span className="text-emerald-400 font-bold text-lg">70% Node Operator</span>
                            <p className="text-slate-400 text-xs">Direct USD payout to hardware provider via Stripe</p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-cyan-500/30 p-4 rounded-xl space-y-1">
                            <span className="text-cyan-400 font-bold text-lg">10% Sales Source</span>
                            <p className="text-slate-400 text-xs">Permanent lifetime fee to client acquirer</p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-purple-500/30 p-4 rounded-xl space-y-1">
                            <span className="text-purple-400 font-bold text-lg">3% L1 Referral</span>
                            <p className="text-slate-400 text-xs">Direct bonus on sponsored node hardware yield</p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-purple-300/30 p-4 rounded-xl space-y-1">
                            <span className="text-purple-300 font-bold text-lg">7% L2 Override</span>
                            <p className="text-slate-400 text-xs">Secondary tier override on expanded networks</p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-amber-500/30 p-4 rounded-xl space-y-1">
                            <span className="text-amber-400 font-bold text-lg">7% Wnode Steward</span>
                            <p className="text-slate-400 text-xs">Orchestration, security audits &amp; core maintenance</p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-slate-500/30 p-4 rounded-xl space-y-1">
                            <span className="text-slate-300 font-bold text-lg">3% Founder Reserve</span>
                            <p className="text-slate-400 text-xs">Immutable architectural alignment reserve</p>
                        </div>
                    </div>
                </section>

                {/* SVG 2: Payout Engine */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 2: Stripe USD Flow-Through from Enterprise Buyer to 70% Operator Yield</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Visual sequence illustrating cash flow from enterprise AI buyers to connected bank accounts via Stripe Connect.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 360" className="w-full h-auto min-w-[700px] text-white">
                            <defs>
                                <filter id="glow-emerald-2" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                                    <feMerge>
                                        <feMergeNode in="coloredBlur"/>
                                        <feMergeNode in="SourceGraphic"/>
                                    </feMerge>
                                </filter>
                            </defs>
                            <rect width="900" height="360" fill="#000000" rx="12" />
                            
                            {/* Step 1: Enterprise Buyer */}
                            <rect x="40" y="110" width="210" height="140" rx="10" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" />
                            <text x="145" y="145" fill="#38bdf8" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">1. Enterprise AI Buyer</text>
                            <text x="145" y="170" fill="#cbd5e1" fontSize="11" fontFamily="monospace" textAnchor="middle">Purchases Compute Demand</text>
                            <text x="145" y="195" fill="#38bdf8" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">$1.00 USD Spend</text>
                            <text x="145" y="220" fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Fiat Invoice via Stripe</text>

                            {/* Arrow 1 */}
                            <path d="M 250,180 L 310,180" stroke="#38bdf8" strokeWidth="2" />
                            <polygon points="310,175 320,180 310,185" fill="#38bdf8" />

                            {/* Step 2: Wnode Protocol Orchestration */}
                            <rect x="320" y="110" width="260" height="140" rx="10" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5" />
                            <text x="450" y="145" fill="#00f0ff" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">2. Wnode Smart Router</text>
                            <text x="450" y="170" fill="#cbd5e1" fontSize="11" fontFamily="monospace" textAnchor="middle">Dispatches Volatile Job</text>
                            <text x="450" y="195" fill="#00f0ff" fontSize="11" fontFamily="monospace" textAnchor="middle">Deterministic Waterfall Split</text>
                            <text x="450" y="220" fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="middle">70/10/3/7/7/3 Rule</text>

                            {/* Arrow 2 */}
                            <path d="M 580,180 L 640,180" stroke="#00ff66" strokeWidth="2" />
                            <polygon points="640,175 650,180 640,185" fill="#00ff66" />

                            {/* Step 3: Node Operator Payout */}
                            <rect x="650" y="110" width="210" height="140" rx="10" fill="#052418" stroke="#00ff66" strokeWidth="2" filter="url(#glow-emerald-2)" />
                            <text x="755" y="145" fill="#00ff66" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">3. Node Operator</text>
                            <text x="755" y="170" fill="#a7f3d0" fontSize="11" fontFamily="monospace" textAnchor="middle">70% Direct Payout</text>
                            <text x="755" y="195" fill="#00ff66" fontSize="13" fontFamily="monospace" textAnchor="middle" fontWeight="bold">$0.70 USD Direct</text>
                            <text x="755" y="220" fill="#34d399" fontSize="10" fontFamily="sans-serif" textAnchor="middle">Stripe Connect ACH ($25 floor)</text>
                        </svg>
                    </div>
                </section>

                {/* Comparative Table */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-purple-500 pl-4">
                        3. Architectural Comparison: Wnode vs. Traditional DePIN Models
                    </h2>
                    <p>
                        To understand why Wnode stands out among <strong>best depin projects no token volatility</strong>, compare our native Go bare-metal execution model against legacy storage and mining projects:
                    </p>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 my-6">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase bg-white/5 text-slate-200 font-mono">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Feature Vector</th>
                                    <th className="px-4 py-3 text-cyan-400">Wnode Bare-Metal Core</th>
                                    <th className="px-4 py-3">Legacy Storage DePIN</th>
                                    <th className="px-4 py-3">ASIC Mining Rigs</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10 font-mono text-xs md:text-sm">
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-white">Hardware Cost</td>
                                    <td className="px-4 py-3 text-cyan-400 font-bold">$0 (Commodity Silicon)</td>
                                    <td className="px-4 py-3 text-slate-400">$600 - $2,000 Boxes</td>
                                    <td className="px-4 py-3 text-slate-400">$3,000+ ASIC Rigs</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-white">Storage Impact</td>
                                    <td className="px-4 py-3 text-emerald-400 font-bold">0 Disk Writes (RAM Only)</td>
                                    <td className="px-4 py-3 text-slate-400">High SSD Wear (TBW)</td>
                                    <td className="px-4 py-3 text-slate-400">N/A</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-white">Payout Asset</td>
                                    <td className="px-4 py-3 text-emerald-400 font-bold">Fiat USD via Stripe</td>
                                    <td className="px-4 py-3 text-slate-400">Volatile Token Rewards</td>
                                    <td className="px-4 py-3 text-slate-400">Volatile Crypto Coins</td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-all">
                                    <td className="px-4 py-3 font-bold text-white">Operator Share</td>
                                    <td className="px-4 py-3 text-purple-400 font-bold">70% Direct Waterfall</td>
                                    <td className="px-4 py-3 text-slate-400">Variable Pool Cuts</td>
                                    <td className="px-4 py-3 text-slate-400">Mining Pool Fees</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-slate-400 text-sm">Everything you need to know about setting up a commodity hardware DePIN node.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: What makes Wnode one of the depin projects with real yield 2026?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Wnode is built as a decentralized physical infrastructure network fiat payout engine. Instead of speculative tokens, enterprise compute buyers pay fiat USD via Stripe Connect, delivering real USD yield directly to hardware operators.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Why are commodity hardware depin compute runner nodes better than proprietary miners?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                By using everyday PCs, laptops, and homelab servers as a bare metal depin compute layer, you earn depin passive income without buying expensive hardware or risking single-purpose device obsolescence.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: Is running a compute node legal on residential internet?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Yes. Residential compute node legal protections apply because Wnode operates in volatile RAM with zero persistent disk logging, zero proxy tunneling, and strict SEC compliant depin networks 2026 standards.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: What is the difference between stateless compute depin vs storage nodes?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Stateless compute nodes process volatile micro-tasks in RAM with zero disk writes, whereas storage nodes consume disk space and degrade SSD endurance over time.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA Banner */}
                <section className="bg-gradient-to-r from-cyan-950/40 via-slate-900 to-emerald-950/40 border border-cyan-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden backdrop-blur-md">
                    <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Start Earning Real DePIN USD Yield Today
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg">
                            Deploy your bare metal DePIN node in under 2 minutes. No credit card, no crypto wallet, and zero hardware costs required.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] text-center"
                            >
                                Deploy Node Now &rarr;
                            </a>
                            <button
                                onClick={() => openModal("waitlist")}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                            >
                                Contact Enterprise Sales
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
