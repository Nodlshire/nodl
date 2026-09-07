"use client";

import React, { useState } from "react";
import Header from "../../components/landing/Header";
import Footer from "../../components/landing/Footer";
import CTAModal, { ModalMode } from "../../components/landing/CTAModal";

export default function SpaceMeshRelaysPage() {
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
                "name": "What is the Wnode Space Mesh?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The Wnode Space Mesh is a decentralized orbital compute and communications network. It pairs terrestrial consumer nodes (PCs, laptops, sub-GHz dongles) with Low Earth Orbit (LEO) satellite payloads, scheduling stateless micro-tasks and Reticulum packet bridging during satellite idle windows."
                }
            },
            {
                "@type": "Question",
                "name": "Do I need a satellite dish to participate in the Space Mesh?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "No. Terrestrial operators participate using everyday hardware—computers, spare laptops, Raspberry Pis, or sub-GHz LoRa radio dongles. Nearby ground nodes automatically relay encrypted packets to satellite up-links, creating a seamless dual-mesh network."
                }
            },
            {
                "@type": "Question",
                "name": "How do Space Mesh operators get paid?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Operators receive 70% of gross compute spend and packet relay fees deposited directly in fiat USD via Stripe Connect ACH once reaching the $25 minimum payout floor."
                }
            },
            {
                "@type": "Question",
                "name": "How does Wnode ensure disaster resilience during telecom grid failures?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "When cellular towers or fiber backbones fail, Wnode's ground nodes form ad-hoc peer-to-peer RF mesh hops (Reticulum/LXMF) that route emergency telemetry directly to orbital space relays, bypassing severed ground infrastructure."
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
                        <span>🛰️ Dual Earth-Space Sovereign Mesh</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent max-w-5xl mx-auto leading-tight">
                        Space Mesh Orbital Compute Nodes &amp; Sovereign Infrastructure 2026
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Unify ground consumer hardware with Low Earth Orbit (LEO) satellite relays. Deliver disaster-resilient off-grid communications and stateless AI micro-compute with direct USD payouts via Stripe.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center gap-4">
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)] text-center"
                        >
                            Deploy Ground Gateway &rarr;
                        </a>
                        <button
                            onClick={() => openModal("waitlist")}
                            className="bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm uppercase px-8 py-4 rounded-full transition-all text-center"
                        >
                            Space Mesh Architecture
                        </button>
                    </div>
                </section>

                {/* Key Metrics Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                        <div className="text-cyan-400 font-mono text-3xl font-bold mb-2">LEO Orbital Relays</div>
                        <h3 className="text-lg font-bold text-white mb-2">Satellite Idle Windows</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Schedules stateless micro-tasks and Reticulum packet bridging into orbital satellite idle passes without proprietary dish hardware.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                        <div className="text-emerald-400 font-mono text-3xl font-bold mb-2">100% Off-Grid</div>
                        <h3 className="text-lg font-bold text-white mb-2">Disaster Resilience</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Ad-hoc peer-to-peer RF ground mesh continues routing data when central power grids, cellular networks, and fiber backbones fail.
                        </p>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-8 rounded-2xl backdrop-blur-md relative overflow-hidden group hover:border-purple-500/30 transition-all">
                        <div className="text-purple-400 font-mono text-3xl font-bold mb-2">70% USD Yield</div>
                        <h3 className="text-lg font-bold text-white mb-2">Stripe Direct Rail</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Enterprise AI inference and micro-packet telemetry fund 70% direct operator payouts settled via automated USD transfers.
                        </p>
                    </div>
                </section>

                {/* Architectural Narrative (Section 1) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        The Dual Earth-Space Mesh: Un-Censorable Sovereign Infrastructure
                    </h2>
                    <p>
                        Centralized satellite networks (such as Starlink or Kuiper) and traditional telecom cartels represent single points of failure. They remain subject to state censorship, regional internet shutdowns, orbital single-entity kill switches, and high subscription fees. True sovereign infrastructure requires a hybrid topology that operates independent of centralized ground gateways.
                    </p>
                    <p>
                        Wnode introduces the **Dual Earth-Space Mesh Architecture**. This system unifies ground-level consumer hardware—the **Earth Mesh** (desktops, laptops, Raspberry Pis, sub-GHz LoRa dongles, and Meshtastic handhelds)—with radiation-hardened volatile execution payloads in Low Earth Orbit—the **Space Mesh**.
                    </p>
                    <p>
                        Orbital satellites spend up to 40% of their trajectory traversing oceans or waiting between ground station downlinks. Wnode dispatches lightweight, statically compiled Go micro-tasks (<code className="text-cyan-400 bg-slate-900 px-1.5 py-0.5 rounded font-mono text-sm">nodld</code>) and encrypted Reticulum/LXMF packets directly into these orbital idle windows. Tasks execute in volatile memory sandboxes with zero persistent storage overhead, delivering 70% of gross revenue to hardware hosts in fiat USD via Stripe Connect.
                    </p>
                </section>

                {/* Mid-Page Canonical Excalidraw SVG #1: earth-space-mesh-topo */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">DUAL-MESH TOPOLOGY</span>
                        <h3 className="text-xl font-bold text-white">Figure 1: Terrestrial Edge Nodes Uplinking to LEO Satellite Orbital Payloads</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,240,255,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 460" className="w-full h-auto max-h-[440px]">
                            <defs>
                                <filter id="glowCyanSpaceTopo" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                                <linearGradient id="gradCyanSpaceTopo" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.25"/>
                                    <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.05"/>
                                </linearGradient>
                            </defs>
                            <rect width="1000" height="460" rx="16" fill="#000000"/>

                            {/* Orbit Space Mesh Layer (Top) */}
                            <rect x="250" y="30" width="500" height="85" rx="12" fill="url(#gradCyanSpaceTopo)" stroke="#00f0ff" strokeWidth="2" filter="url(#glowCyanSpaceTopo)"/>
                            <text x="500" y="60" fill="#00f0ff" fontSize="15" fontFamily="monospace" fontWeight="bold" textAnchor="middle">LOW EARTH ORBIT (LEO) SPACE MESH PAYLOAD</text>
                            <text x="500" y="82" fill="#ffffff" fontSize="11" textAnchor="middle">Executes micro-tasks during satellite idle passes (RAM Sandbox)</text>

                            {/* Downlink / Uplink Beam Vectors */}
                            <path d="M 350 115 L 180 220" stroke="#00f0ff" strokeWidth="2" strokeDasharray="4 4"/>
                            <path d="M 500 115 L 500 220" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>
                            <path d="M 650 115 L 820 220" stroke="#a855f7" strokeWidth="2" strokeDasharray="4 4"/>

                            <text x="240" y="165" fill="#00f0ff" fontSize="10" fontFamily="monospace">RF Uplink</text>
                            <text x="510" y="165" fill="#00ff66" fontSize="10" fontFamily="monospace">Reticulum Packet</text>
                            <text x="750" y="165" fill="#a855f7" fontSize="10" fontFamily="monospace">Space Telemetry</text>

                            {/* Terrestrial Earth Mesh Layer (Middle Row) */}
                            {/* Node 1: Urban Gateway */}
                            <rect x="50" y="220" width="260" height="160" rx="12" fill="#09090b" stroke="#00f0ff" strokeWidth="1.5"/>
                            <text x="180" y="250" fill="#00f0ff" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">URBAN DEWI GATEWAY</text>
                            <text x="180" y="275" fill="#ffffff" fontSize="12" textAnchor="middle">Commodity PC + USB Radio</text>
                            <text x="180" y="300" fill="#94a3b8" fontSize="11" textAnchor="middle">Routes crowd BLE / Wi-Fi</text>
                            <text x="180" y="325" fill="#94a3b8" fontSize="11" textAnchor="middle">Volatile RAM Execution</text>
                            <text x="180" y="355" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">⚡ 70% Direct USD Yield</text>

                            {/* Node 2: Off-Grid Solar Outpost */}
                            <rect x="370" y="220" width="260" height="160" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="2"/>
                            <text x="500" y="250" fill="#00ff66" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">OFF-GRID RURAL SOLAR</text>
                            <text x="500" y="275" fill="#ffffff" fontSize="12" textAnchor="middle">Raspberry Pi + LoRa Dongle</text>
                            <text x="500" y="300" fill="#94a3b8" fontSize="11" textAnchor="middle">Grid collapse resilient</text>
                            <text x="500" y="325" fill="#94a3b8" fontSize="11" textAnchor="middle">Sub-GHz RF packet relay</text>
                            <text x="500" y="355" fill="#00ff66" fontSize="11" fontFamily="monospace" textAnchor="middle">⚡ Solar Bare-Metal nodld</text>

                            {/* Node 3: Maritime Field Sensor */}
                            <rect x="690" y="220" width="260" height="160" rx="12" fill="#09090b" stroke="#a855f7" strokeWidth="1.5"/>
                            <text x="820" y="250" fill="#a855f7" fontSize="13" fontFamily="monospace" fontWeight="bold" textAnchor="middle">MARITIME FIELD SENSOR</text>
                            <text x="820" y="275" fill="#ffffff" fontSize="12" textAnchor="middle">Austere Weather Node</text>
                            <text x="820" y="300" fill="#94a3b8" fontSize="11" textAnchor="middle">LXMF Encrypted Messaging</text>
                            <text x="820" y="325" fill="#94a3b8" fontSize="11" textAnchor="middle">$0.0001 per micro-packet</text>
                            <text x="820" y="355" fill="#a855f7" fontSize="11" fontFamily="monospace" textAnchor="middle">📡 Direct Space Uplink</text>

                            {/* Footer Payout Callout */}
                            <rect x="250" y="405" width="500" height="35" rx="8" fill="#18181b" stroke="#00ff66"/>
                            <text x="500" y="427" fill="#00ff66" fontSize="11" fontFamily="monospace" fontWeight="bold" textAnchor="middle">💵 Stripe Connect USD Payout Rail ($25 Automated Floor)</text>
                        </svg>
                    </div>
                </section>

                {/* Architectural Narrative (Section 2) */}
                <section className="space-y-6 max-w-4xl mx-auto text-slate-300 leading-relaxed text-base md:text-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight border-b border-white/10 pb-3">
                        Disaster Resilience &amp; Global Strategic Alignment
                    </h2>
                    <p>
                        When severe hurricane events, terrestrial grid blackouts, or geopolitical conflict sever underground fiber optic lines and cell towers, traditional cloud infrastructure goes completely dark. Wnode&apos;s sovereign physical backbone maintains operational continuity through ad-hoc peer-to-peer ground mesh hops (using Reticulum, LXMF, LoRa sub-GHz, and amateur radio AX.25 frequencies) that hop signals up to orbital satellite receivers.
                    </p>
                    <p>
                        This deep-tech architecture aligns directly with sovereign digital transformation programs, such as the **UAE National Innovation Strategy** and Dubai regulatory frameworks for DAOs, space technology, and decentralized physical infrastructure (DePIN). By establishing sovereign, un-censorable compute and communications rails, Wnode provides enterprise buyers and governments with guaranteed operational redundancy without cloud hyperscaler lock-in.
                    </p>
                </section>

                {/* Technical Comparison Table */}
                <section className="space-y-6 max-w-5xl mx-auto">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-white">Sovereign Architecture Comparison: Wnode vs Centralized Satellites</h2>
                        <p className="text-slate-400 text-sm max-w-2xl mx-auto">
                            Comparing censorship resistance, ground hardware requirements, disaster resilience, and payout assets.
                        </p>
                    </div>

                    <div className="overflow-x-auto bg-[#09090b]/80 border border-white/[0.08] rounded-2xl p-6 backdrop-blur-md">
                        <table className="w-full text-left text-sm text-slate-300">
                            <thead className="text-xs uppercase text-slate-400 border-b border-white/10 font-mono">
                                <tr>
                                    <th className="py-4 px-4">Evaluation Dimension</th>
                                    <th className="py-4 px-4 text-cyan-400">Wnode Space Mesh</th>
                                    <th className="py-4 px-4 text-slate-500">Starlink / Monolithic Satellite</th>
                                    <th className="py-4 px-4 text-slate-500">Terrestrial Fiber Cloud</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 font-sans">
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Censorship &amp; Kill-Switch Risk</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Zero Kill Switch (Decentralized Mesh)</td>
                                    <td className="py-4 px-4 text-red-400">Single Entity Corporate Control</td>
                                    <td className="py-4 px-4 text-red-400">State Telecom Banning / Chokepoints</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Ground Hardware Required</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">Commodity PC / Laptop / $15 Radio</td>
                                    <td className="py-4 px-4 text-slate-400">$600 Proprietary Terminal Dish</td>
                                    <td className="py-4 px-4 text-slate-400">Fixed ISP Router / Fiber Line</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Disaster Grid Collapse Resilience</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold">High (Ad-hoc P2P RF + Solar Nodes)</td>
                                    <td className="py-4 px-4 text-slate-300">Moderate (Requires Power to Terminal)</td>
                                    <td className="py-4 px-4 text-red-400">Zero (Fails on Fiber Cable Cut)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Satellite Idle-Window Execution</td>
                                    <td className="py-4 px-4 text-cyan-400 font-bold">Stateless Ephemeral Tasks in Space RAM</td>
                                    <td className="py-4 px-4 text-slate-400">Proprietary Internet Pipe Only</td>
                                    <td className="py-4 px-4 text-slate-400">N/A (Ground Only)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 px-4 font-semibold text-white">Operator Payout Rail</td>
                                    <td className="py-4 px-4 text-emerald-400 font-bold font-mono">70% Direct USD via Stripe Connect</td>
                                    <td className="py-4 px-4 text-slate-400">0% (Subscription Cost Center)</td>
                                    <td className="py-4 px-4 text-slate-400">0% (Monthly ISP Bill)</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Lower-Page Canonical Excalidraw SVG #2: disaster-resilient-routing */}
                <section className="space-y-4">
                    <div className="text-center space-y-1">
                        <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">DISASTER RESILIENCE MESH</span>
                        <h3 className="text-xl font-bold text-white">Figure 2: Severed Ground Telecom vs. Wnode Ad-Hoc P2P Orbital Hops</h3>
                    </div>
                    <div className="bg-[#09090b]/80 border border-white/[0.08] p-4 md:p-6 rounded-3xl backdrop-blur-md shadow-[0_0_40px_rgba(0,255,102,0.1)]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 420" className="w-full h-auto max-h-[400px]">
                            <defs>
                                <filter id="glowEmeraldDisaster" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="5" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over"/>
                                </filter>
                            </defs>
                            <rect width="1000" height="420" rx="16" fill="#000000"/>

                            {/* Severed Terrestrial Infrastructure (Left Column - Red) */}
                            <rect x="40" y="50" width="420" height="320" rx="12" fill="#09090b" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4"/>
                            <text x="60" y="85" fill="#ef4444" fontSize="14" fontFamily="monospace" fontWeight="bold">SEVERED CONVENTIONAL TELECOM GRID</text>
                            <text x="60" y="110" fill="#64748b" fontSize="11">Blackouts, fiber cuts, extreme weather failure</text>

                            <rect x="70" y="130" width="360" height="60" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="90" y="158" fill="#f87171" fontSize="13" fontWeight="bold">Cellular Tower &amp; Fiber Cable Cut</text>
                            <text x="90" y="176" fill="#ef4444" fontSize="11" fontFamily="monospace">❌ Signal Completely Terminated</text>

                            <rect x="70" y="210" width="360" height="60" rx="8" fill="#18181b" stroke="#334155"/>
                            <text x="90" y="238" fill="#f87171" fontSize="13" fontWeight="bold">Central Cloud Data Center Unreachable</text>
                            <text x="90" y="256" fill="#94a3b8" fontSize="11">All business AI workflows offline</text>

                            <rect x="70" y="290" width="360" height="60" rx="8" fill="#18181b" stroke="#ef4444"/>
                            <text x="90" y="325" fill="#ef4444" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">❌ COMPLETE INFRASTRUCTURE BLACKOUT</text>

                            {/* Wnode Resilient Mesh Flow (Right Column - Emerald) */}
                            <rect x="540" y="50" width="420" height="320" rx="12" fill="#09090b" stroke="#00ff66" strokeWidth="2" filter="url(#glowEmeraldDisaster)"/>
                            <text x="560" y="85" fill="#00ff66" fontSize="14" fontFamily="monospace" fontWeight="bold">WNODE AD-HOC P2P ORBITAL RESILIENCE</text>
                            <text x="560" y="110" fill="#00f0ff" fontSize="11">Sub-GHz RF ground hops up to Space Mesh payload</text>

                            <rect x="570" y="130" width="360" height="60" rx="8" fill="#18181b" stroke="#00ff66"/>
                            <text x="590" y="158" fill="#ffffff" fontSize="13" fontWeight="bold">Local RF Ground Mesh (Reticulum/LXMF)</text>
                            <text x="590" y="176" fill="#00ff66" fontSize="11" fontFamily="monospace">Sub-GHz radio packet hopping</text>

                            <rect x="570" y="210" width="360" height="60" rx="8" fill="#18181b" stroke="#00f0ff"/>
                            <text x="590" y="238" fill="#ffffff" fontSize="13" fontWeight="bold">Orbital LEO Satellite Relay</text>
                            <text x="590" y="256" fill="#00f0ff" fontSize="11" fontFamily="monospace">Space payload bridges unblocked packets</text>

                            <rect x="570" y="290" width="360" height="60" rx="8" fill="#18181b" stroke="#00ff66"/>
                            <text x="590" y="325" fill="#00ff66" fontSize="12" fontFamily="monospace" fontWeight="bold" textAnchor="middle">✅ 100% OPERATIONAL RESILIENCE</text>

                            {/* Vector Line */}
                            <path d="M 460 210 L 540 210" stroke="#00ff66" strokeWidth="2" strokeDasharray="4 4"/>
                        </svg>
                    </div>
                </section>

                {/* Boxed Invariants Highlight */}
                <section className="bg-[#09090b]/90 border border-amber-500/30 p-8 rounded-3xl backdrop-blur-md space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400 font-mono text-xs uppercase tracking-widest">
                        <span>🛡️ Immutable Architectural Safety Invariants</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Space Mesh System Guarantees</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
                        <div className="space-y-1">
                            <h4 className="font-bold text-amber-400">1. RAM-Only Orbital Execution</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Tasks run in volatile memory sandboxes on both ground nodes and satellite payloads. Absolute zero persistent disk storage.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-cyan-400">2. Stripe Direct USD Payouts</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Ground and satellite relay hosts earn 70% direct revenue share deposited in fiat USD via Stripe Connect upon reaching $25.00.
                            </p>
                        </div>
                        <div className="space-y-1">
                            <h4 className="font-bold text-emerald-400">3. Universal RF Compatibility</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Native Go daemon (<code className="text-cyan-400">nodld</code>) interfaces with standard sub-GHz LoRa radio dongles, Meshtastic, and amateur radio gear.
                            </p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="space-y-8 max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-white">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">What is the Wnode Space Mesh?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                The Wnode Space Mesh is a decentralized orbital compute and communications network. It pairs terrestrial consumer nodes (PCs, laptops, sub-GHz dongles) with Low Earth Orbit (LEO) satellite payloads, scheduling stateless micro-tasks and Reticulum packet bridging during satellite idle windows.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">Do I need a satellite dish to participate in the Space Mesh?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                No. Terrestrial operators participate using everyday hardware—computers, spare laptops, Raspberry Pis, or sub-GHz LoRa radio dongles. Nearby ground nodes automatically relay encrypted packets to satellite up-links, creating a seamless dual-mesh network.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How do Space Mesh operators get paid?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                Operators receive 70% of gross compute spend and packet relay fees deposited directly in fiat USD via Stripe Connect ACH once reaching the $25 minimum payout floor.
                            </p>
                        </div>
                        <div className="bg-[#09090b]/80 border border-white/[0.08] p-6 rounded-xl">
                            <h3 className="text-lg font-bold text-cyan-400 mb-2">How does Wnode ensure disaster resilience during telecom grid failures?</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                When cellular towers or fiber backbones fail, Wnode&apos;s ground nodes form ad-hoc peer-to-peer RF mesh hops (Reticulum/LXMF) that route emergency telemetry directly to orbital space relays, bypassing severed ground infrastructure.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="bg-gradient-to-r from-cyan-950/40 via-[#09090b] to-emerald-950/40 border border-cyan-500/20 p-12 rounded-3xl text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white">Join the Sovereign Space Mesh Today</h2>
                    <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
                        Deploy your ground node gateway and start earning direct USD payouts on sovereign off-grid infrastructure.
                    </p>
                    <div>
                        <a
                            href="https://nodlr.wnode.one"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-sm uppercase px-8 py-4 rounded-full transition-all shadow-[0_0_30px_rgba(0,240,255,0.3)]"
                        >
                            Deploy Ground Gateway Now &rarr;
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
