"use client";

import AppLayout from "../../../components/layout/AppLayout";
import { useEffect, useState } from "react";

const Section = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <section id={id} className="scroll-mt-32 space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk border-b border-white/10 pb-4">
            {title}
        </h2>
        <div className="text-slate-400 leading-relaxed space-y-4">
            {children}
        </div>
    </section>
);

const SubSection = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
    <div id={id} className="scroll-mt-32 space-y-3 pt-4">
        <h3 className="text-lg font-bold text-white/90 uppercase tracking-wide font-space-grotesk">
            {title}
        </h3>
        <div className="text-slate-400 leading-relaxed space-y-4">
            {children}
        </div>
    </div>
);

export default function WhitepaperPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20 border-b border-white/10 pb-12">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white font-space-grotesk uppercase leading-none">
                                Wenode Whitepaper
                            </h1>
                            <p className="text-blue-500 font-mono text-sm tracking-[0.3em] uppercase font-bold">
                                Version 1.0 — Unified Specification
                            </p>
                        </div>
                        <a 
                            href="/docs/whitepaper_v1.2.pdf" 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-black px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] inline-flex items-center gap-2 w-fit"
                        >
                            <span>Download PDF</span>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </a>
                    </div>

                    <div className="space-y-24">
                        
                        {/* 1. Abstract */}
                        <Section id="abstract" title="1. Abstract">
                            <p>
                                Wenode is a decentralised AI compute network that transforms global idle hardware into a
                                unified, verifiable, market-aligned compute layer. It enables individuals and organisations
                                to contribute compute capacity, be paid in USD, earn WENODE tokens, and participate in a
                                transparent governance system designed to ensure fairness, resilience, and long-term
                                sustainability.
                            </p>
                            <p>
                                The Wenode Mesh coordinates compute tasks across a distributed network of nodes
                                using a stateless execution model, RAM-only processing, and cryptographic verification to
                                ensure confidentiality and correctness. Governance is structured to prevent
                                centralisation and whale attacks, ensure accountability whilst maintaining regulatory
                                clarity.
                            </p>
                            <p className="italic">
                                This whitepaper defines the architecture, governance, tokenomics, regulatory
                                considerations, and roadmap for Wenode.
                            </p>
                        </Section>

                        {/* 2. Introduction */}
                        <Section id="introduction" title="2. Introduction">
                            <p>
                                AI compute demand is accelerating faster than centralized providers can scale. Costs are
                                rising, access is restricted, and innovation is bottlenecked by a handful of cloud
                                monopolies. Meanwhile, billions of devices worldwide sit underutilized. Laptops,
                                desktops, servers, and edge hardware with significant compute potential present a
                                substantial opportuniy to provide the world with much needed comute resource.
                            </p>
                            <p>
                                Wenode bridges this gap by creating a decentralised compute mesh where anyone can
                                contribute hardware and earn rewards with 3 simple clicks. The system is designed to be:
                            </p>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                {[
                                    { t: "Fair", d: "no privileged nodes" },
                                    { t: "Granny-Proof", d: "Easy to join and earn in real cash" },
                                    { t: "Confidential", d: "RAM-only execution, zero storage" },
                                    { t: "Verifiable", d: "cryptographic proofs and deterministic execution" },
                                    { t: "Governed", d: "transparent, structured, and resistant to capture" },
                                    { t: "Sustainable", d: "market-aligned incentives and token utility" },
                                    { t: "AI Powered", d: "Intelligent routing, support ongoing development" },
                                    { t: "Truly Sovereign", d: "Own AI Model, own hardware, own tech" },
                                    { t: "Ecologically Aligned", d: "No data centres, cooling, hardware" },
                                    { t: "Economically Compelling", d: "No infrastructure costs = low prices" }
                                ].map(item => (
                                    <li key={item.t} className="flex gap-3 items-start bg-white/[0.02] border border-white/5 p-4 rounded-sm">
                                        <span className="text-blue-500 font-bold">•</span>
                                        <div>
                                            <span className="text-white font-bold block text-xs uppercase tracking-widest">{item.t}</span>
                                            <span className="text-xs text-slate-500">{item.d}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <p className="pt-4">
                                Wenode’s mission is to democratise access to compute and create a Planetary,
                                truly community-owned intelligence layer.
                            </p>
                        </Section>

                        {/* 3. Problem Statement */}
                        <Section id="problem-statement" title="3. Problem Statement">
                            <SubSection id="compute-scarcity" title="3.1 Compute Scarcity">
                                <p>
                                    AI workloads require massive compute resources. Centralised providers control supply,
                                    set prices, and create artificial scarcity.
                                </p>
                            </SubSection>
                            <SubSection id="underutilised-hardware" title="3.2 Underutilised Hardware">
                                <p>
                                    Most consumer and enterprise hardware sits idle uo to 75% of the time. This is wasted
                                    economic potential.
                                </p>
                            </SubSection>
                            <SubSection id="centralisation-risks" title="3.3 Centralisation Risks">
                                <p>Centralised compute introduces:</p>
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Single points of failure</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Data exposure</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Vendor lock-in</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Pricing volatility</li>
                                </ul>
                            </SubSection>
                            <SubSection id="lack-of-transparent-governance" title="3.4 Lack of Transparent Governance">
                                <p>Most compute networks lack:</p>
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Clear decision-making structures</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Accountability</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Anti-capture mechanisms</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Regulatory clarity</li>
                                </ul>
                                <p className="pt-4 font-bold text-white">
                                    Wenode addresses all four problems simultaneously.
                                </p>
                            </SubSection>
                        </Section>

                        {/* 4. Wenode Overview */}
                        <Section id="wnode-overview" title="4. Wenode Overview">
                            <p>Wenode is a distributed compute network where:</p>
                            <ul className="list-none space-y-3 pl-4">
                                <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span><strong className="text-white">Nodlrs</strong> contribute Compute – get paid in USD and/or Tokens</span></li>
                                <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span><strong className="text-white">Mesh Clients</strong> submit compute tasks – Pay in USD and/or Tokens</span></li>
                                <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span><strong className="text-white">WENODE tokens</strong> coordinate incentives</span></li>
                                <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span><strong className="text-white">Governance</strong> ensures fairness and transparency</span></li>
                            </ul>
                            <p className="pt-4">The Mesh routes tasks to nodes based on:</p>
                            <ul className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
                                {["Locality", "Performance", "Availability", "Reputation", "Market pricing"].map(item => (
                                    <li key={item} className="p-3 bg-white/[0.02] border border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">{item}</li>
                                ))}
                            </ul>
                            <p className="pt-8">All execution is:</p>
                            <ul className="list-none space-y-2 pl-4">
                                <li className="flex gap-3 items-center text-white font-medium"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Stateless</li>
                                <li className="flex gap-3 items-center text-white font-medium"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> RAM-only</li>
                                <li className="flex gap-3 items-center text-white font-medium"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Ephemeral</li>
                                <li className="flex gap-3 items-center text-white font-medium"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Cryptographically verifiable</li>
                            </ul>
                            <p className="pt-4 italic">
                                This ensures confidentiality and eliminates data retention risks.
                            </p>
                        </Section>

                        {/* 5. Architecture */}
                        <Section id="architecture" title="5. Architecture">
                            <SubSection id="node-types" title="5.1 Node Types">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> <strong className="text-white">Standard Nodes</strong> — consumer hardware</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> <strong className="text-white">Pro Nodes</strong> — high-performance rigs</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> <strong className="text-white">Edge Nodes</strong> — mobile/IoT devices</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> <strong className="text-white">Enterprise Nodes</strong> — data center-grade hardware</li>
                                </ul>
                            </SubSection>
                            <SubSection id="execution-model" title="5.2 Execution Model">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> RAM-only execution</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Zero persistent storage</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Deterministic compute</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Encrypted payloads</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Stateless containers</li>
                                </ul>
                            </SubSection>
                            <SubSection id="routing-engine" title="5.3 Routing Engine">
                                <p>The Mesh uses:</p>
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Locality-aware routing</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Performance scoring</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Reputation weighting</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Market-aligned pricing</li>
                                </ul>
                            </SubSection>
                            <SubSection id="verification-layer" title="5.4 Verification Layer">
                                <p>Compute outputs are validated via:</p>
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Redundant execution</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Hash matching</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Deterministic replay</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Cryptographic proofs</li>
                                </ul>
                            </SubSection>
                            <SubSection id="security-model" title="5.5 Security Model">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> No plaintext exposure</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> No long-term storage</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> No privileged nodes</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Automatic isolation</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Hardware fingerprinting</li>
                                </ul>
                            </SubSection>
                            <SubSection id="topology" title="5.6 Topology">
                                <p>The Mesh is:</p>
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center font-bold text-white"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Distributed</li>
                                    <li className="flex gap-3 items-center font-bold text-white"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Self-balancing</li>
                                    <li className="flex gap-3 items-center font-bold text-white"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Fault-tolerant</li>
                                    <li className="flex gap-3 items-center font-bold text-white"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Horizontally scalable</li>
                                </ul>
                            </SubSection>
                        </Section>

                        {/* 6. Governance Model */}
                        <Section id="governance-model" title="6. Governance Model">
                            <p>Wenode governance is designed to be:</p>
                            <ul className="grid grid-cols-2 gap-4 pt-2">
                                {["Transparent", "Capture-resistant", "Role-based", "Constitutionally constrained"].map(item => (
                                    <li key={item} className="p-4 bg-white/[0.02] border border-white/5 text-center text-xs font-bold uppercase tracking-widest text-white">{item}</li>
                                ))}
                            </ul>
                            <SubSection id="governance-roles" title="6.1 Governance Roles">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span><strong className="text-white">Governance Board</strong> — high-level oversight</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span><strong className="text-white">Stewards</strong> — operational decision-makers</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span><strong className="text-white">Infrastructure Manager</strong> — technical oversight</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span><strong className="text-white">Community</strong> — soul-based participation</span></li>
                                </ul>
                            </SubSection>
                            <SubSection id="voting" title="6.2 Voting">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Not weighted by role</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Transparent on-chain</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Quorum requirements</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Multi-stage proposals</li>
                                </ul>
                            </SubSection>
                            <SubSection id="anti-capture-mechanisms" title="6.3 Anti-Capture Mechanisms">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Term limits</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Separation of powers</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Immutable constitutional constraints</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Public auditability</li>
                                </ul>
                            </SubSection>
                            <SubSection id="upgrade-path" title="6.4 Upgrade Path">
                                <ul className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                                    <li>Proposals</li>
                                    <li className="opacity-30">→</li>
                                    <li>Review</li>
                                    <li className="opacity-30">→</li>
                                    <li>Testing</li>
                                    <li className="opacity-30">→</li>
                                    <li>Deployment</li>
                                    <li className="opacity-30">→</li>
                                    <li>Community ratification</li>
                                </ul>
                            </SubSection>
                        </Section>

                        {/* 7. Tokenomics */}
                        <Section id="tokenomics" title="7. Tokenomics">
                            <SubSection id="token-utility" title="7.1 Token Utility">
                                <p>WENODE is used for:</p>
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>Node rewards (Not compute payment)</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>Incentives</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>Payments to other service partnerships</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>Payment to Node Operators – FIAT first, tokens soon</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>Pyment from Customers – FIAT first, tokens soon</span></li>
                                </ul>
                            </SubSection>
                            <SubSection id="supply" title="7.2 Supply">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Fixed total supply</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Transparent allocation</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Vesting schedules</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> No hidden minting</li>
                                </ul>
                            </SubSection>
                            <SubSection id="allocation" title="7.3 Allocation">
                                <ul className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-2">
                                    {["Node rewards", "Ecosystem", "Governance", "Liquidity", "Treasury"].map(item => (
                                        <li key={item} className="p-3 bg-white/[0.02] border border-white/5 text-center text-[10px] font-bold uppercase tracking-widest text-blue-400">{item}</li>
                                    ))}
                                </ul>
                            </SubSection>
                            <SubSection id="sustainability" title="7.4 Sustainability">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Market-aligned pricing</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Dynamic reward curves</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Anti-inflation mechanisms</li>
                                </ul>
                            </SubSection>
                            <SubSection id="economic-safeguards" title="7.5 Economic Safeguards">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> No promises of profit</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> No yield guarantees</li>
                                    <li className="flex gap-3 items-center font-bold text-white"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Utility-first design</li>
                                </ul>
                            </SubSection>
                        </Section>

                        {/* 8. Regulatory Considerations */}
                        <Section id="regulatory-considerations" title="8. Regulatory Considerations">
                            <p>Wenode is designed to be compliant and transparent.</p>
                            <SubSection id="token-classification" title="8.1 Token Classification">
                                <p>WENODE is a utility token, justified by:</p>
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>Required for rewards</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>Required to pay partners</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>Required for staking</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>No profit expectation</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-blue-500 mt-1">•</span> <span>No dividends</span></li>
                                </ul>
                            </SubSection>
                            <SubSection id="governance-separation" title="8.2 Governance Separation">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> No single entity controls the network</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Roles are distributed</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Decisions are transparent</li>
                                </ul>
                            </SubSection>
                            <SubSection id="risk-disclosures" title="8.3 Risk Disclosures">
                                <ul className="list-none space-y-2 pl-4 text-xs">
                                    <li className="flex gap-3 items-start"><span className="text-red-500 font-bold">!</span> <span>Market volatility</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-red-500 font-bold">!</span> <span>Technical risks</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-red-500 font-bold">!</span> <span>Governance risks</span></li>
                                    <li className="flex gap-3 items-start"><span className="text-red-500 font-bold">!</span> <span>Regulatory uncertainty</span></li>
                                </ul>
                            </SubSection>
                            <SubSection id="kyc-aml" title="8.4 KYC/AML– Provided by Stripe">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Required for fiat on/off ramps</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Optional for on-chain interactions</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full" /> Compliant with major jurisdictions</li>
                                </ul>
                            </SubSection>
                        </Section>

                        {/* 9. Security & Risk Management */}
                        <Section id="security-risk-management" title="9. Security & Risk Management">
                            <SubSection id="technical-risks" title="9.1 Technical Risks">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-red-500/50 rounded-full" /> Node failures</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-red-500/50 rounded-full" /> Malicious actors</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-red-500/50 rounded-full" /> Network congestion</li>
                                </ul>
                                <p className="pt-2 font-bold text-white text-xs uppercase tracking-widest">Mitigations:</p>
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-green-500/50 rounded-full" /> Redundant execution</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-green-500/50 rounded-full" /> Reputation scoring</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-green-500/50 rounded-full" /> Automatic rerouting</li>
                                </ul>
                            </SubSection>
                            <SubSection id="economic-risks" title="9.2 Economic Risks">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-red-500/50 rounded-full" /> Token volatility</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-red-500/50 rounded-full" /> Market imbalance</li>
                                </ul>
                                <p className="pt-2 font-bold text-white text-xs uppercase tracking-widest">Mitigations:</p>
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-green-500/50 rounded-full" /> Dynamic pricing</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-green-500/50 rounded-full" /> Treasury stabilization</li>
                                </ul>
                            </SubSection>
                            <SubSection id="governance-risks" title="9.3 Governance Risks">
                                <ul className="list-none space-y-2 pl-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-red-500/50 rounded-full" /> Voter apathy</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-red-500/50 rounded-full" /> Concentration of influence</li>
                                </ul>
                                <p className="pt-2 font-bold text-white text-xs uppercase tracking-widest">Mitigations:</p>
                                <ul className="list-none space-y-2 pl-4 pb-4">
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-green-500/50 rounded-full" /> Role separation</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-green-500/50 rounded-full" /> Term limits</li>
                                    <li className="flex gap-3 items-center"><span className="w-1.5 h-1.5 bg-green-500/50 rounded-full" /> Transparency</li>
                                </ul>
                                <p className="font-bold text-blue-500 tracking-[0.2em] text-xs uppercase underline underline-offset-8">
                                    1 soul = 1 vote
                                </p>
                            </SubSection>
                        </Section>

                        {/* 10. Roadmap */}
                        <Section id="roadmap" title="10. Roadmap">
                            <div className="space-y-8">
                                {[
                                    { p: "Phase 1 — MVP", items: ["Node onboarding", "Basic compute tasks", "RAM-only execution"] },
                                    { p: "Phase 2 — Private Sale", items: ["Token generation", "Governance bootstrapping", "Early node incentives"] },
                                    { p: "Phase 3 — Mesh Activation", items: ["Full routing engine", "Verification layer", "Market pricing"] },
                                    { p: "Phase 4 — Governance Activation", items: ["Board formation", "Constitution ratification"] },
                                    { p: "Phase 5 — Scaling", items: ["Enterprise integrations", "Global node expansion", "Advanced compute classes"] }
                                ].map((phase, idx) => (
                                    <div key={idx} className="relative pl-8 border-l border-white/10">
                                        <div className="absolute left-[-5px] top-0 w-[9px] h-[9px] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                                        <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-3">{phase.p}</h4>
                                        <ul className="list-none space-y-2 text-xs">
                                            {phase.items.map(item => (
                                                <li key={item} className="flex gap-2 items-center"><span className="w-1 h-1 bg-slate-600 rounded-full" /> {item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Section>

                        {/* 11. Conclusion */}
                        <Section id="conclusion" title="11. Conclusion">
                            <p>
                                Wenode represents a new model for global compute: decentralized, confidential,
                                verifiable, and governed by the community. By combining distributed hardware,
                                cryptographic verification, and transparent governance, Wenode creates a sustainable,
                                fair, and scalable compute layer for the AI-driven future.
                            </p>
                            <p className="text-white font-bold text-xl md:text-2xl leading-tight">
                                Wenode Mesh is a Planetary truly community-owned intelligence layer.
                            </p>
                        </Section>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
