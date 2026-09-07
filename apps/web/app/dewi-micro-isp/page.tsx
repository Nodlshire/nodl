"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function DeWiMicroISPPage() {
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
                "name": "How do dewi projects 2026 differ from legacy wireless networks?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Leading dewi projects 2026 like Wnode combine off-grid packet relays (LoRa, Reticulum, amateur radio) with edge compute execution, offering decentralized wireless alternatives to helium 2026 with direct USD payouts via Stripe."
                }
            },
            {
                "@type": "Question",
                "name": "How to become a decentralized micro isp with Wnode?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "To learn how to become a decentralized micro isp, install Wnode's native Go daemon (nodld) and attach a USB LoRa dongle or sub-GHz antenna. This creates a dual compute and comms node setup that routes byte-sized IoT telemetry for fractions of a cent."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode enable users to monetize home internet bandwidth safely without proxy risk?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode executes stateless RAM micro-tasks and local RF radio relays. It does not route untrusted third-party web browsing traffic through your residential IP, ensuring 100% network safety."
                }
            },
            {
                "@type": "Question",
                "name": "What hardware is required for a raspberry pi lora packet router setup?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "A standard Raspberry Pi 4/5 paired with any commodity SX1262 USB LoRa dongle functions as an off grid wireless mesh network rewards node and a disaster resilient off grid communication node."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-sky-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/60 border border-sky-500/30 text-sky-400 text-xs font-mono uppercase tracking-widest">
                        <span>📡 Reticulum RF &amp; Micro-ISP Backbone</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-sky-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        DeWi Projects 2026: How to Become a Decentralized Micro ISP
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Discover top meshtastic passive income alternatives and decentralized wireless alternatives to helium 2026. Deploy a dual compute and comms node setup to route off grid wireless mesh network rewards cleanly in USD.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] text-center"
                        >
                            Deploy Micro-ISP Gateway &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Mesh Topology Docs
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-sky-500/30 transition-all">
                        <div className="text-sky-400 font-mono text-3xl font-bold mb-2">Sub-GHz Mesh</div>
                        <h3 className="text-lg font-bold text-white mb-2">Sub GHz Decentralized Communications Mesh</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Integrates LoRaWAN edge compute and packet relay endpoints to create an un censorable machine economy communications backbone.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">0 Proxy Risk</div>
                        <h3 className="text-lg font-bold text-white mb-2">Monetize Home Internet Bandwidth Safely Without Proxy Risk</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Bypasses risky exit tunnels. Supports decentralized wifi hotspot monetization and p2p packet forwarding passive income safely.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">Earth-Space Mesh</div>
                        <h3 className="text-lg font-bold text-white mb-2">Earth to Space Mesh Communication Network</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Uplinks ground nodes to LEO space payloads, operating as a disaster resilient off grid communication node when terrestrial grids fail.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-sky-500 pl-4">
                        1. DeWi Projects 2026: Reticulum, LoRaWAN &amp; Amateur Radio Gateway Integration
                    </h2>
                    <p>
                        The evolution of <strong>dewi projects 2026</strong> marks a transition from simple hotspot token mining to unified communication and compute fabrics. If you are researching <strong>how to become a decentralized micro isp</strong>, Wnode enables operators to turn commodity PCs and sub-GHz antennas into an active <strong>dual compute and comms node setup</strong>.
                    </p>
                    <p>
                        Wnode provides an authoritative answer for users seeking <strong>meshtastic passive income alternatives</strong> and <strong>decentralized wireless alternatives to helium 2026</strong>. By combining a native <strong>reticulum mesh network node setup</strong> with <strong>lorawan edge compute and packet relay</strong> capabilities, your node processes <strong>m2m iot data routing for fractions of a cent</strong> while executing stateless AI workloads in memory.
                    </p>

                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-4 my-6">
                        <h3 className="text-xl font-bold text-white">DeWi Gateway Protocols &amp; RF Hardware Capabilities</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-mono">
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-sky-400 font-bold">LoRa &amp; Raspberry Pi</span>
                                <p className="text-slate-400 text-xs">Deploy a raspberry pi lora packet router setup to turn lora node into earning gateway.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-emerald-400 font-bold">Amateur Radio APRS/AX25</span>
                                <p className="text-slate-400 text-xs">Operate an aprs ax25 amateur radio compute gateway for long-range P2P telemetry packet forwarding.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-purple-400 font-bold">BLE Urban Mesh</span>
                                <p className="text-slate-400 text-xs">Enable ble mesh urban packet hopping monetization across dense urban environments.</p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-1">
                                <span className="text-amber-400 font-bold">Sub-GHz RF Mesh</span>
                                <p className="text-slate-400 text-xs">Build a sub ghz decentralized communications mesh delivering off grid wireless mesh network rewards.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SVG 1: DeWi Packet Mesh */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 1: DeWi Packet Relay Mesh: IoT Sensor ➔ LoRa Dongle ➔ Go Backbone</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Technical flow showing sub-GHz telemetry ingestion and p2p packet forwarding passive income routing.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 360" className="w-full h-auto min-w-[700px] text-white">
                            <rect width="900" height="360" fill="#000000" rx="12" />

                            {/* Node 1: IoT Sensor */}
                            <rect x="40" y="110" width="180" height="140" rx="10" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5" />
                            <text x="130" y="145" fill="#38bdf8" fontSize="13" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">1. IoT &amp; AI Agent</text>
                            <text x="130" y="170" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Sub-GHz RF Packet</text>
                            <text x="130" y="195" fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="middle">LoRa / Reticulum / BLE</text>

                            {/* Arrow 1 */}
                            <path d="M 220,180 L 280,180" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 2" />
                            <polygon points="280,175 290,180 280,185" fill="#38bdf8" />

                            {/* Node 2: Wnode Gateway */}
                            <rect x="290" y="110" width="280" height="140" rx="10" fill="#031c26" stroke="#00f0ff" strokeWidth="1.5" />
                            <text x="430" y="145" fill="#00f0ff" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">2. Wnode Micro-ISP Node</text>
                            <text x="430" y="170" fill="#cbd5e1" fontSize="10" fontFamily="monospace" textAnchor="middle">Native Go Daemon (nodld)</text>
                            <text x="430" y="195" fill="#00f0ff" fontSize="10" fontFamily="monospace" textAnchor="middle">Dual Compute &amp; Comms</text>
                            <text x="430" y="220" fill="#64748b" fontSize="10" fontFamily="sans-serif" textAnchor="middle">0 Proxy Risk / 0 Exit Tunnel</text>

                            {/* Arrow 2 */}
                            <path d="M 570,180 L 630,180" stroke="#00ff66" strokeWidth="2" />
                            <polygon points="630,175 640,180 630,185" fill="#00ff66" />

                            {/* Node 3: Stripe USD Payout */}
                            <rect x="640" y="110" width="220" height="140" rx="10" fill="#052418" stroke="#00ff66" strokeWidth="2" />
                            <text x="750" y="145" fill="#00ff66" fontSize="14" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">3. Direct USD Payout</text>
                            <text x="750" y="170" fill="#a7f3d0" fontSize="10" fontFamily="monospace" textAnchor="middle">70% Operator Yield</text>
                            <text x="750" y="195" fill="#00ff66" fontSize="12" fontFamily="monospace" textAnchor="middle" fontWeight="bold">Stripe Connect ACH</text>
                        </svg>
                    </div>
                </section>

                {/* Terrestrial to Space Mesh Narrative */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-l-4 border-emerald-500 pl-4">
                        2. Earth-to-Space Mesh Communications &amp; Disaster Resilience
                    </h2>
                    <p>
                        Terrestrial infrastructure failures caused by cellular grid outages or severe weather demand resilient fallback channels. Wnode establishes an <strong>earth to space mesh communication network</strong> that bridges ground RF nodes to Low Earth Orbit (LEO) satellite payloads.
                    </p>
                    <p>
                        Whether deployed as a <strong>disaster resilient off grid communication node</strong> or serving as an <strong>un censorable machine economy communications backbone</strong>, Wnode guarantees un-blockable connectivity while allowing node operators to <strong>monetize home internet bandwidth safely without proxy risk</strong>.
                    </p>
                </section>

                {/* SVG 2: Terrestrial to Space */}
                <section className="space-y-4">
                    <div className="text-center space-y-2">
                        <h3 className="text-xl font-bold text-white">Figure 2: Terrestrial Sub-GHz Radio Nodes to LEO Satellite Payload Bridge</h3>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Architectural diagram demonstrating hybrid ground-to-space packet routing during terrestrial network outages.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/90 border border-white/[0.08] rounded-2xl p-4 md:p-8 backdrop-blur-md overflow-x-auto">
                        <svg viewBox="0 0 900 340" className="w-full h-auto min-w-[700px] text-white">
                            <rect width="900" height="340" fill="#000000" rx="12" />

                            {/* Satellite Top */}
                            <g transform="translate(450, 60)">
                                <circle cx="0" cy="0" r="30" fill="#031c26" stroke="#00f0ff" strokeWidth="1.5" />
                                <text x="0" y="5" fill="#00f0ff" fontSize="18" textAnchor="middle">🛰️</text>
                                <text x="0" y="45" fill="#00f0ff" fontSize="11" fontFamily="monospace" textAnchor="middle" fontWeight="bold">LEO Space Mesh Relay</text>
                            </g>

                            {/* Ground Nodes */}
                            <g transform="translate(150, 240)">
                                <rect x="-70" y="-30" width="140" height="60" rx="8" fill="#09090b" stroke="#38bdf8" strokeWidth="1" />
                                <text x="0" y="-5" fill="#38bdf8" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">LoRa USB Node</text>
                                <text x="0" y="15" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">Sub-GHz RF Hop</text>
                            </g>

                            <g transform="translate(450, 240)">
                                <rect x="-80" y="-30" width="160" height="60" rx="8" fill="#052418" stroke="#00ff66" strokeWidth="1.5" />
                                <text x="0" y="-5" fill="#00ff66" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Wnode Micro-ISP</text>
                                <text x="0" y="15" fill="#a7f3d0" fontSize="9" fontFamily="monospace" textAnchor="middle">Dual Compute/Comms</text>
                            </g>

                            <g transform="translate(750, 240)">
                                <rect x="-70" y="-30" width="140" height="60" rx="8" fill="#09090b" stroke="#a855f7" strokeWidth="1" />
                                <text x="0" y="-5" fill="#a855f7" fontSize="11" fontFamily="sans-serif" fontWeight="bold" textAnchor="middle">Amateur Radio</text>
                                <text x="0" y="15" fill="#cbd5e1" fontSize="9" fontFamily="monospace" textAnchor="middle">APRS / AX25</text>
                            </g>

                            {/* Uplink Rays */}
                            <line x1="150" y1="210" x2="420" y2="80" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 2" />
                            <line x1="450" y1="210" x2="450" y2="90" stroke="#00ff66" strokeWidth="2" />
                            <line x1="750" y1="210" x2="480" y2="80" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 2" />
                        </svg>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
                        <p className="text-slate-400 text-sm">Everything you need to know about Wnode DeWi and Micro-ISP operation.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How do dewi projects 2026 differ from legacy wireless networks?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Leading dewi projects 2026 like Wnode combine off-grid packet relays (LoRa, Reticulum, amateur radio) with edge compute execution, offering decentralized wireless alternatives to helium 2026 with direct USD payouts via Stripe.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How to become a decentralized micro isp with Wnode?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                To learn how to become a decentralized micro isp, install Wnode's native Go daemon (nodld) and attach a USB LoRa dongle or sub-GHz antenna. This creates a dual compute and comms node setup that routes byte-sized IoT telemetry for fractions of a cent.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: How does Wnode enable users to monetize home internet bandwidth safely without proxy risk?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Wnode executes stateless RAM micro-tasks and local RF radio relays. It does not route untrusted third-party web browsing traffic through your residential IP, ensuring 100% network safety.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-2xl space-y-2">
                            <h3 className="text-lg font-bold text-white">Q: What hardware is required for a raspberry pi lora packet router setup?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                A standard Raspberry Pi 4/5 paired with any commodity SX1262 USB LoRa dongle functions as an off grid wireless mesh network rewards node and a disaster resilient off grid communication node.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA Banner */}
                <section className="bg-gradient-to-r from-sky-950/40 via-slate-900 to-emerald-950/40 border border-sky-500/30 rounded-3xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden backdrop-blur-md">
                    <div className="max-w-3xl mx-auto space-y-4 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            Build the Decentralized Micro-ISP Infrastructure Today
                        </h2>
                        <p className="text-slate-300 text-base md:text-lg">
                            Deploy your dual compute and communications gateway in under 2 minutes. Earn direct USD payouts via Stripe.
                        </p>
                        <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                            <a
                                href="https://nodlr.wnode.one"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] text-center"
                            >
                                Deploy Micro-ISP Gateway &rarr;
                            </a>
                            <button
                                onClick={() => openModal("waitlist")}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                            >
                                DeWi Developer Docs
                            </button>
                        </div>
                    </div>
                </section>
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
