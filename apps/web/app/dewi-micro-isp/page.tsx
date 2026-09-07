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
                "name": "How does a Wnode DeWi node differ from Helium?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode sidesteps inflationary token halving cycles and custom $600 miner boxes by using direct fiat USD flow-through via Stripe Connect. It runs on commodity hardware (PCs, laptops, Raspberry Pis) and combines wireless packet transport with stateless RAM-only AI micro-compute for dual-stream yield."
                }
            },
            {
                "@type": "Question",
                "name": "Is running a micro-ISP legal and safe on residential internet?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Wnode DeWi operates strictly on machine-to-machine (M2M) encrypted telemetry and Reticulum/LXMF micro-packets. It does not route untrusted third-party residential proxy web browsing traffic, protecting your IP address from ISP blacklists, copyright flags, or abuse bans."
                }
            },
            {
                "@type": "Question",
                "name": "What hardware is required to run a DeWi node?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Any standard Windows, macOS, or Linux computer—or a $35 Raspberry Pi—paired with a $15 USB sub-GHz LoRa radio dongle, Meshtastic interface, or standard Wi-Fi/Bluetooth hardware. The native Go daemon (nodld) handles routing automatically."
                }
            },
            {
                "@type": "Question",
                "name": "How do Micro-ISP packet routing fees work?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "M2M IoT sensors and autonomous AI agents pay micro-metered fees of $0.0001 per encrypted packet. Node operators receive 70% of gross packet relay spend directly in fiat USD once hitting the $25 payout floor."
                }
            }
        ]
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col selection:bg-emerald-500 selection:text-black">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <Header onContactClick={() => openModal("waitlist")} />

            <main className="flex-1 pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto w-full space-y-16">
                {/* Hero Header */}
                <section className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono uppercase tracking-widest">
                        <span>📡 Sovereign Wireless Mesh &amp; DeWi Infrastructure</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        DeWi &amp; Micro-ISP Node Setup 2026: Monetize Off-Grid Comms &amp; Reticulum Packets
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Turn idle PCs, Raspberry Pis, and sub-GHz radio dongles into an incentivized local packet gateway. Route encrypted IoT, AI agent receipts, and Reticulum mesh traffic for direct USD payouts via Stripe Connect.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)] text-center"
                        >
                            Launch Micro-ISP Node &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            DeWi Protocol Specifications
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">$0.0001 / Packet</div>
                        <h3 className="text-lg font-bold text-white mb-2">Micro-Metered M2M</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Replaces costly $1–$5 monthly cellular SIM cards for IoT sensors and AI agents with micro-metered sub-cent RF packet routing.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">Dual-Stream Yield</div>
                        <h3 className="text-lg font-bold text-white mb-2">Comms + Compute</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            A single bare-metal Go binary (<code className="text-cyan-400">nodld</code>) routes wireless mesh packets while processing RAM-only edge AI workloads.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">Zero Exit Risk</div>
                        <h3 className="text-lg font-bold text-white mb-2">Encrypted Telemetry Only</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Strict machine-to-machine encrypted payloads protect residential IP addresses from ISP proxy bans, blacklists, and KYC restrictions.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative (Section 1) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        The Evolution of Decentralized Wireless (DeWi): Beyond Speculative Hotspots
                    </h2>
                    <p>
                        Decentralized Physical Infrastructure Networks (DePIN) pioneered decentralized wireless coverage, but earlier protocols like Helium suffered from fundamental economic design flaws: forcing operators to buy $600 proprietary miner hotspots while rewarding them in inflationary tokens vulnerable to halving events and market crashes. Furthermore, pure coverage models failed to generate real commercial revenue because cellular data plans remained heavily subsidized by centralized telecom monopolies.
                    </p>
                    <p>
                        Wnode shifts the paradigm by combining <strong>Decentralized Wireless (DeWi) Micro-ISP routing</strong> with <strong>stateless edge AI compute</strong> into a unified dual-engine architecture. Instead of buying single-purpose miner boxes, node operators pair existing computers or Raspberry Pis with $15 sub-GHz LoRa radio dongles, Meshtastic hardware, or BLE interfaces running the native Go daemon (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>).
                    </p>
                    <p>
                        This infrastructure targets the explosive growth of the autonomous machine economy. Modern IoT sensors, autonomous drones, environmental monitors, and AI agents require high-frequency, low-latency micro-telemetry data transport. Paying $1 to $5 per month for cellular SIM cards is economically unviable for thousands of distributed sensors. Wnode routes encrypted Reticulum and LXMF packets for fractions of a cent ($0.0001/packet), delivering 70% of gross revenue straight to the host node operator in fiat USD via Stripe Connect.
                    </p>
                </section>

                {/* Mid-Page Canonical Excalidraw SVG #1: dewi-packet-relay-mesh */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">CANONICAL MESH TOPOLOGY</span>
                        <h3 className="text-xl font-bold text-white">Figure 1: Reticulum / LXMF Encrypted Packet Relay &amp; Gateway Uplink</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,255,102,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 460" className="w-full h-auto max-h-[440px]">
                            <defs>
                                <filter id="glowEmeraldDeWi" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradEmeraldDeWi" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00ff66" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00ff66" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="460" rx="16" fill="#000000"/>

                            {/* Column 1: Off-Grid Devices & RF Nodes (Left) */}
                            <rect x="40" y="50" width="220" height="360" rx="12" fill="#09090b" stroke="#38bdf8" strokeWidth="1.5"/>
                            <text x="150" y="85" fill="#38bdf8" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">EDGE RF TRANSMITTERS</text>
                            
                            <rect x="60" y="110" width="180" height="75" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="150" y="135" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">IoT Environmental Sensors</text>
                            <text x="150" y="155" fill="#94a3b8" fontSize="10" textAnchor="middle">Sub-GHz LoRa / LXMF Packets</text>
                            <text x="150" y="172" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">$0.0001 / packet fee</text>

                            <rect x="60" y="200" width="180" height="75" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="150" y="225" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Autonomous AI Agents</text>
                            <text x="150" y="245" fill="#94a3b8" fontSize="10" textAnchor="middle">Reticulum Mesh Receipts</text>
                            <text x="150" y="262" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">Micro-task verification</text>

                            <rect x="60" y="290" width="180" height="90" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="150" y="315" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Meshtastic Handhelds</text>
                            <text x="150" y="335" fill="#94a3b8" fontSize="10" textAnchor="middle">Off-grid emergency relay</text>
                            <text x="150" y="355" fill="#a855f7" fontSize="10" fontFamily="monospace" textAnchor="middle">BLE / Urban Hopping</text>

                            {/* RF Waves Path Line */}
                            <path d="M 260 230 L 370 230" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>
                            <text x="315" y="220" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">RF 868/915 MHz</text>

                            {/* Column 2: Wnode DeWi Gateway Host (Middle - Highlighted) */}
                            <rect x="370" y="50" width="300" height="360" rx="16" fill="url(#gradEmeraldDeWi)" stroke="#00ff66" strokeWidth="2" filter="url(#glowEmeraldDeWi)"/>
                            <text x="520" y="85" fill="#00ff66" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">WNODE MICRO-ISP GATEWAY</text>
                            <text x="520" y="108" fill="#ffffff" fontSize="11" textAnchor="middle">PC / Laptop / Raspberry Pi + $15 Dongle</text>

                            <rect x="390" y="130" width="260" height="70" rx="8" fill="#18181b" stroke="#00ff66"/>
                            <text x="520" y="158" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">Bare-Metal Go Daemon (nodld)</text>
                            <text x="520" y="178" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">Decodes Reticulum / LXMF Packets</text>

                            <rect x="390" y="215" width="260" height="70" rx="8" fill="#18181b" stroke="#00f0ff"/>
                            <text x="520" y="243" fill="#ffffff" fontSize="12" fontWeight="bold" textAnchor="middle">RAM Volatile Sandbox</text>
                            <text x="520" y="263" fill="#00f0ff" fontSize="10" fontFamily="monospace" textAnchor="middle">Zero Disk Writes / Ephemeral Storage</text>

                            <rect x="390" y="300" width="260" height="85" rx="8" fill="#09090b" stroke="#00ff66"/>
                            <text x="520" y="325" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">70% OPERATOR SHARE</text>
                            <text x="520" y="345" fill="#ffffff" fontSize="11" textAnchor="middle">Direct USD Payout Rail</text>
                            <text x="520" y="365" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">Stripe Connect ACH ($25 Floor)</text>

                            {/* Backbone Connection Line */}
                            <path d="M 670 230 L 760 230" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4"/>
                            <text x="715" y="220" fill="#00f0ff" fontSize="10" fontFamily="monospace" textAnchor="middle">TLS Backbone</text>

                            {/* Column 3: Enterprise & Settlement Mesh (Right) */}
                            <rect x="760" y="50" width="200" height="360" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="860" y="85" fill="#00f0ff" fontSize="14" fontFamily="monospace" fontWeight="bold" textAnchor="middle">SETTLEMENT MESH</text>

                            <rect x="780" y="120" width="160" height="70" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="860" y="148" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Stripe USD Rails</text>
                            <text x="860" y="168" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">Instant ACH Payout</text>

                            <rect x="780" y="210" width="160" height="70" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="860" y="238" fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle">Enterprise Buyers</text>
                            <text x="860" y="258" fill="#38bdf8" fontSize="10" fontFamily="monospace" textAnchor="middle">IoT &amp; AI Data Clients</text>

                            <rect x="780" y="300" width="160" height="85" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="860" y="328" fill="#a855f7" fontSize="11" fontWeight="bold" textAnchor="middle">Referral Lineage</text>
                            <text x="860" y="348" fill="#94a3b8" fontSize="10" textAnchor="middle">3% L1 / 7% L2</text>
                            <text x="860" y="365" fill="#a855f7" fontSize="10" fontFamily="monospace" textAnchor="middle">Immutable Overrides</text>
                        </svg>
                    </div>
                </section>

                {/* Technical Comparison Table */}
                <section className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Technical Comparison: Wnode DeWi vs Legacy Wireless &amp; Proxies</h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Evaluating hardware costs, privacy risk profiles, revenue settlement assets, and computational utility.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-4">Architectural Property</th>
                                    <th className="py-4 px-4 text-emerald-400">Wnode DeWi Micro-ISP</th>
                                    <th className="py-4 px-4 text-slate-500">Helium DeWi Hotspots</th>
                                    <th className="py-4 px-4 text-slate-500">Cellular M2M SIM Cards</th>
                                    <th className="py-4 px-4 text-slate-500">Residential Web Proxies</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Hardware Capital Cost</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">$0 – $15 (Commodity PC / Dongle)</td>
                                    <td className="py-4 px-4 text-red-400">$600 Custom Miner Box</td>
                                    <td className="py-4 px-4 text-slate-400">Specialized Modem Rigs</td>
                                    <td className="py-4 px-4 text-slate-400">$0 Software Download</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Safety &amp; Residential IP Risk</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Zero Proxy Risk (M2M Only)</td>
                                    <td className="py-4 px-4 text-slate-300">Safe Radio Coverage</td>
                                    <td className="py-4 px-4 text-slate-300">Telecom Licensed Spectrum</td>
                                    <td className="py-4 px-4 text-red-400">High Risk (IP Blacklists / Bans)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Pricing Model</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">$0.0001 / Micro-Packet</td>
                                    <td className="py-4 px-4 text-slate-400">Data Credits System</td>
                                    <td className="py-4 px-4 text-red-400">$1 – $5 Monthly / SIM</td>
                                    <td className="py-4 px-4 text-slate-400">GB Traffic Metering</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Payout Settlement Rail</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Fiat USD (Stripe Connect)</td>
                                    <td className="py-4 px-4 text-red-400">Volatile Token Emissions</td>
                                    <td className="py-4 px-4 text-slate-400">N/A (Cost Center)</td>
                                    <td className="py-4 px-4 text-slate-400">Crypto / Gift Card Points</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Compute Integration</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold font-mono">Dual (DeWi Packets + RAM AI)</td>
                                    <td className="py-4 px-4 text-slate-400">Comms Transport Only</td>
                                    <td className="py-4 px-4 text-slate-400">Cellular Pipe Only</td>
                                    <td className="py-4 px-4 text-slate-400">HTTP Proxy Only</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Lower-Page Canonical Excalidraw SVG #2: terrestrial-to-space-relay */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">EARTH TO SPACE MESH INFRASTRUCTURE</span>
                        <h3 className="text-xl font-bold text-white">Figure 2: Terrestrial Consumer Nodes Uplinking to Orbital LEO Satellite Relays</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 440" className="w-full h-auto max-h-[420px]">
                            <defs>
                                <filter id="glowCyanSpace" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradCyanSpace" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="440" rx="16" fill="#000000"/>

                            {/* Space Mesh Layer: Low Earth Orbit Satellite (Top) */}
                            <rect x="300" y="30" width="400" height="90" rx="12" fill="url(#gradCyanSpace)" stroke="#00f0ff" strokeWidth="2" filter="url(#glowCyanSpace)"/>
                            <text x="500" y="60" fill="#00f0ff" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">LOW EARTH ORBIT (LEO) SPACE MESH PAYLOAD</text>
                            <text x="500" y="82" fill="#ffffff" fontSize="11" textAnchor="middle">Un-censorable Orbital Packet Relay &amp; Satellite Bridge</text>
                            <text x="500" y="102" fill="#00ff66" fontSize="10" fontFamily="monospace" textAnchor="middle">Sub-GHz RF Inter-Satellite Uplink</text>

                            {/* RF Beam Paths (Space to Earth) */}
                            <path d="M 380 120 L 200 240" stroke="#00f0ff" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <path d="M 500 120 L 500 240" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>
                            <path d="M 620 120 L 800 240" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4"/>

                            <text x="270" y="170" fill="#00f0ff" fontSize="10" fontFamily="monospace">LEO Downlink</text>
                            <text x="510" y="170" fill="#00ff66" fontSize="10" fontFamily="monospace">Direct RF Stream</text>
                            <text x="730" y="170" fill="#a855f7" fontSize="10" fontFamily="monospace">LEO Uplink</text>

                            {/* Terrestrial Earth Mesh Layer (Bottom) */}
                            {/* Node 1: Urban Micro-ISP Gateway */}
                            <rect x="50" y="240" width="260" height="160" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="180" y="270" fill="#00f0ff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">URBAN DEWI GATEWAY</text>
                            <text x="180" y="295" fill="#ffffff" fontSize="12" textAnchor="middle">Commodity PC + LoRa Antenna</text>
                            <text x="180" y="320" fill="#94a3b8" fontSize="11" textAnchor="middle">Routes local BLE/Wi-Fi mesh</text>
                            <text x="180" y="345" fill="#94a3b8" fontSize="11" textAnchor="middle">Uplinks to satellite backbone</text>
                            <text x="180" y="375" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">✅ 70% Direct Payout</text>

                            {/* Node 2: Off-Grid Rural Outpost */}
                            <rect x="370" y="240" width="260" height="160" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="2"/>
                            <text x="500" y="270" fill="#00ff66" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">OFF-GRID RURAL OUTPOST</text>
                            <text x="500" y="295" fill="#ffffff" fontSize="12" textAnchor="middle">Solar-Powered Raspberry Pi</text>
                            <text x="500" y="320" fill="#94a3b8" fontSize="11" textAnchor="middle">Retain comms during blackout</text>
                            <text x="500" y="345" fill="#94a3b8" fontSize="11" textAnchor="middle">Zero central grid dependency</text>
                            <text x="500" y="375" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">⚡ Solar Bare-Metal nodld</text>

                            {/* Node 3: Autonomous IoT Field Node */}
                            <rect x="690" y="240" width="260" height="160" rx="12" fill="#09090b" stroke="#a855f7" strokeWidth="1.5"/>
                            <text x="820" y="270" fill="#a855f7" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">AUTONOMOUS FIELD SENSOR</text>
                            <text x="820" y="295" fill="#ffffff" fontSize="12" textAnchor="middle">Agricultural / Marine Tracker</text>
                            <text x="820" y="320" fill="#94a3b8" fontSize="11" textAnchor="middle">Routes Reticulum LXMF data</text>
                            <text x="820" y="345" fill="#94a3b8" fontSize="11" textAnchor="middle">Sub-cent packet metering</text>
                            <text x="820" y="375" fill="#a855f7" fontSize="11" fontFamily="monospace" textAnchor="middle">📡 $0.0001 / packet</text>
                        </svg>
                    </div>
                </section>

                {/* Boxed Invariants Highlight */}
                <section className="bg-[#09090b]/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
                        <span>🛡️ Immutable Architectural Safety Invariants</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">DeWi Safety &amp; Protocol Commitments</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                        <div className="space-y-1">
                            <h4 className="font-bold text-amber-400">1. Zero Exit-Node Risk</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Wnode routes encrypted Reticulum M2M telemetry and micro-compute tasks only. It never runs open proxy exit nodes that expose residential IPs to illegal traffic bans.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-cyan-400">2. Dual-Engine Execution</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                A single bare-metal Go binary (<code className="text-cyan-400">nodld</code>) routes sub-GHz radio packets while running volatile RAM micro-tasks for dual passive revenue streams.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-emerald-400">3. Direct Fiat USD Payouts</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                70% of gross packet relay spend is deposited directly into operator bank accounts in fiat USD via Stripe Connect upon reaching $25.00.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">How does a Wnode DeWi node differ from Helium?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Wnode sidesteps inflationary token halving cycles and custom $600 miner boxes by using direct fiat USD flow-through via Stripe Connect. It runs on commodity hardware (PCs, laptops, Raspberry Pis) and combines wireless packet transport with stateless RAM-only AI micro-compute for dual-stream yield.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">Is running a micro-ISP legal and safe on residential internet?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Yes. Wnode DeWi operates strictly on machine-to-machine (M2M) encrypted telemetry and Reticulum/LXMF micro-packets. It does not route untrusted third-party residential proxy web browsing traffic, protecting your IP address from ISP blacklists, copyright flags, or abuse bans.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">What hardware is required to run a DeWi node?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Any standard Windows, macOS, or Linux computer—or a $35 Raspberry Pi—paired with a $15 USB sub-GHz LoRa radio dongle, Meshtastic interface, or standard Wi-Fi/Bluetooth hardware. The native Go daemon (nodld) handles routing automatically.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-emerald-400 mb-2">How do Micro-ISP packet routing fees work?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                M2M IoT sensors and autonomous AI agents pay micro-metered fees of $0.0001 per encrypted packet. Node operators receive 70% of gross packet relay spend directly in fiat USD once hitting the $25 payout floor.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-emerald-950/40 via-[#09090b] to-cyan-950/40 border border-emerald-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Join the Sovereign DeWi Mesh Today</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Monetize off-grid wireless packet routing and edge compute with zero proxy IP risk and direct USD bank deposits.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,255,102,0.3)]"
                        >
                            Deploy Micro-ISP Node &rarr;
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
            <CTAModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mode={modalMode}
            />
        </div>
    );
}
