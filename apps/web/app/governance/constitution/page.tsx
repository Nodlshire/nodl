"use client";

import AppLayout from "../../../components/layout/AppLayout";
import { useEffect, useState } from "react";

export default function ConstitutionPage() {
    const sections = [
        { id: "preamble", title: "Founders’ Preamble" },
        { id: "section1", title: "Section 1 — Definitions" },
        { id: "section2", title: "Section 2 — Governance Hierarchy" },
        { id: "section3", title: "Section 3 — Souls & Voting" },
        { id: "section4", title: "Section 4 — Nodes & NODLRs" },
        { id: "section5", title: "Section 5 — Voting Procedures" },
        { id: "section6", title: "Section 6 — Stewardship Licence" },
        { id: "section7", title: "Section 7 — Affiliate Tree Assets" },
        { id: "section8", title: "Section 8 — Emergency Powers" },
        { id: "section9", title: "Section 9 — Tokenomics" },
        { id: "section10", title: "Section 10 — Compliance & Liability" },
        { id: "section11", title: "Section 11 — Sanctions & Appeals" },
        { id: "section12", title: "Section 12 — Final Provisions" },
        { id: "section13", title: "Section 13 — Sovereignty" },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.getBoundingClientRect().top + window.pageYOffset - 80,
                behavior: "smooth"
            });
        }
    };

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto space-y-6 font-inter text-slate-300">
                    
                    {/* TITLE & DOWNLOAD */}
                    <div className="space-y-6 pb-8 border-b border-white/10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-space-grotesk uppercase">WENODE CONSTITUTION v2.1</h1>
                                <p className="text-xs uppercase tracking-[0.4em] text-blue-500 font-bold">Official Governance Charter — Full Text Version</p>
                            </div>
                            <a 
                                href="/docs/Governance_v2.1.pdf" 
                                target="_blank"
                                className="px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-blue-500 hover:text-white transition-all shadow-lg"
                            >
                                Download Full PDF
                            </a>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[9px] uppercase tracking-widest text-slate-500 font-mono">
                            <span>Governing Law: England & Wales</span>
                            <span>Version: 2.1 (Ratified May 2026)</span>
                            <span>Author: Stephen Soos</span>
                        </div>
                    </div>

                    {/* COMPACT TABLE OF CONTENTS */}
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                        <h2 className="text-[10px] uppercase tracking-[0.3em] text-blue-500 font-black mb-6">Table of Contents</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8">
                            {sections.map((s) => (
                                <button 
                                    key={s.id} 
                                    onClick={() => scrollToSection(s.id)}
                                    className="text-left text-[11px] text-slate-500 hover:text-white transition-colors flex items-start gap-2 group"
                                >
                                    <span className="text-blue-500/30 group-hover:text-blue-500 font-mono">/</span>
                                    <span>{s.title}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* DOCUMENT BODY */}
                    <div className="space-y-10 pt-6 leading-relaxed text-sm md:text-base">
                        
                        {/* PREAMBLE */}
                        <div id="preamble" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">FOUNDERS’ PREAMBLE</h2>
                            <div className="space-y-4">
                                <p>By: Stephen Soos (WUID 1000001-0426-01-AA)</p>
                                <p>Founder • Architect • Initial Steward • Initial Governance Board Member</p>
                                
                                <p>Wnode was created as a community-owned, community-governed, and AI-powered planetary compute mesh.</p>
                                
                                <p>As the Founder, I established this Constitution to ensure that Wnode remains:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-400">
                                    <li>open,</li>
                                    <li>decentralised,</li>
                                    <li>transparent,</li>
                                    <li>fair,</li>
                                    <li>sovereign, and</li>
                                    <li>permanently aligned with the interests of its users, node operators, and token holders.</li>
                                </ul>

                                <p>I recognise that the Wnode Mesh belongs to the community, and that governance must always remain accountable to those who operate, support, and rely upon it.</p>
                                
                                <p>This Constitution v2.1 sets out the governance structure, rights, duties, and safeguards that protect the Wnode Mesh, the DAO, and the community for all future generations. It establishes full operational sovereignty through Wnode-owned servers, development environments, power systems (including solar arrays), and a recursive sovereign AI LLM.</p>
                                
                                <p>Wnode is deliberately built for maximum independence — owning and operating its own critical infrastructure to eliminate reliance on third-party cloud providers and ensure resilience against censorship, deplatforming, or external control.</p>
                                
                                <p>It is adopted with the shared commitment that Wnode shall remain a public good, a community asset, and a truly sovereign, decentralised network governed by its participants with a strict 1 Soul = 1 Vote structure.</p>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 1 */}
                        <div id="section1" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 1 — DEFINITIONS</h2>
                            <div className="space-y-4">
                                <p className="italic text-slate-500">(This section establishes the precise meaning of all governance terms used throughout the Constitution.)</p>
                                <p>For the purposes of this Constitution, the following terms shall have the meanings set out below:</p>
                                
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.1 “Wnode Mesh”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">The decentralised compute network operated collectively by node operators, governed by the DAO, and maintained through the governance structures defined in this Constitution.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.2 “DAO” or “Wnode DAO”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">The decentralised autonomous organisation composed of verified token holders and NODLR Souls, empowered to vote on proposals and amend this Constitution.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.3 “Founder”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">Stephen Soos (WUID 1000001-0426-01-AA), the creator and architect of the Wnode Mesh, and the individual who established the initial governance framework, token model, and operational architecture.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.4 “Founder Board”</h3>
                                        <div className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5 space-y-3">
                                            <p>A governance body composed of four (4) members, including the Founder, responsible for:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>constitutional guardianship</li>
                                                <li>Steward appointment and removal</li>
                                                <li>Infrastructure Manager oversight</li>
                                                <li>emergency powers</li>
                                                <li>long-term strategic protection of the Mesh</li>
                                            </ul>
                                            <p>The Founder Board is not fully elected by the DAO in its initial form to protect against early-stage capture. It includes progressive decentralisation mechanisms as defined in Section 2.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.5 “Governance Board”</h3>
                                        <div className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5 space-y-3">
                                            <p>A body made up of the initial members and responsible for:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>operational oversight</li>
                                                <li>proposal validation</li>
                                                <li>treasury supervision</li>
                                                <li>ensuring DAO decisions are implemented</li>
                                            </ul>
                                            <p>The Founder is the Initial Governance Board Member.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.6 “Steward”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">The holder of the Stewardship Licence, responsible for day-to-day Mesh operations, customer support, compliance, and UX management, as defined in Section 6. The Founder is the Initial Steward.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.7 “Stewardship Licence”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">A perpetual, revenue-bearing commercial licence granted by the Founder Board to a Steward, defining operational rights, obligations, revenue share, and revocation conditions.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.8 “Infrastructure Manager” (IM)</h3>
                                        <div className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5 space-y-3">
                                            <p>The technical authority responsible for:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>uptime</li>
                                                <li>infrastructure reliability</li>
                                                <li>node verification</li>
                                                <li>emergency technical response</li>
                                                <li>hardware acquisition and maintenance</li>
                                            </ul>
                                            <p>The IM operates independently of the Steward and answers to the Governance Board.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.9 “Soul”</h3>
                                        <div className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5 space-y-3">
                                            <p>A non-transferable identity token representing a verified individual within the Mesh.</p>
                                            <p>Souls may be:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>Locked Souls — identity-only, non-voting</li>
                                                <li>Voting Souls — earned through node operation and NODLR verification</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.10 “NODLR”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">A verified node operator who has passed technical and identity verification and earned a Voting Soul.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.11 “WUID”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">The Wnode Universal Identifier assigned to each Soul. The Founder’s WUID is 1000001-0426-01-AA.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.12 “Founder Affiliate Tree”</h3>
                                        <div className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5 space-y-3">
                                            <p>A hierarchical, non-governance, non-token, commercial asset representing referral lineage and organic growth within the Mesh. It is:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>transferable</li>
                                                <li>sellable</li>
                                                <li>permanent</li>
                                                <li>non-governance-bearing</li>
                                                <li>infinite in depth</li>
                                                <li>entitles the Founder to 3% of the entire Affiliate Tree to infinity, as defined in the platform’s payment rules and Stripe architecture</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.13 “Frozen Affiliate Tree”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">A Founder Affiliate Tree or NODLR Affiliate Affiliate Tree that remains owned by the individual but is restricted from new Level 1 recruitment.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.14 “Governance Proposal”</h3>
                                        <div className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5 space-y-3">
                                            <p>A proposal submitted to the DAO for:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>operational changes</li>
                                                <li>constitutional amendments</li>
                                                <li>treasury actions</li>
                                                <li>parameter updates</li>
                                                <li>role appointments</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.15 “Emergency Action”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">A time-sensitive action authorised by the Founder Board or Infrastructure Manager to protect the Mesh from outages, attacks, catastrophic failures, or regulatory threats.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.16 “Treasury”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">The on-chain financial reserves of the DAO, governed by DAO vote and safeguarded by the Governance Board.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.17 “Wnode Token”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">The governance-adjacent utility token of the Mesh, used for staking, incentives, and economic participation. Tokens do not grant voting rights (see Section 3).</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.18 “Constitution”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">This document, known as the Wnode Constitution v2.1, including all amendments ratified by the DAO in accordance with Section 5.</p>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.19 “NODLR Affiliate Affiliate Tree”</h3>
                                        <div className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5 space-y-3">
                                            <p>A commercial, non-governance asset representing the referral lineage of a NODLR. It is:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>transferable</li>
                                                <li>sellable</li>
                                                <li>permanent</li>
                                                <li>non-governance-bearing</li>
                                                <li>strictly limited to Level 1 and Level 2 only</li>
                                                <li>subject to the same freezing and protection rules as Founder Affiliate Trees (except depth limitations)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.20 “Core Immutable Provisions”</h3>
                                        <div className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5 space-y-3">
                                            <p>Provisions that enjoy the highest level of protection and can only be amended with 100% DAO approval plus Founder Board confirmation. These include:</p>
                                            <ul className="list-disc pl-5 space-y-1">
                                                <li>1 Soul = 1 Vote</li>
                                                <li>Soul non-transferability and permanence</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h3 className="text-white font-bold text-sm tracking-tight uppercase">1.21 “Dispute Resolution”</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed pl-4 border-l border-white/5">Final and binding arbitration seated in London under the LCIA Rules, governed by the laws of England & Wales.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 2 */}
                        <div id="section2" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 2 — GOVERNANCE HIERARCHY</h2>
                            <div className="space-y-4">
                                <p>This section establishes the structural order of authority within the Wnode DAO and defines how governance power is distributed, limited, and safeguarded.</p>
                                <p>The Wnode governance model is a hybrid constitutional system combining:</p>
                                <ul className="list-disc pl-5 space-y-2 text-slate-400">
                                    <li>decentralised community voting (1 Soul = 1 Vote),</li>
                                    <li>Founder-level constitutional guardianship with progressive decentralisation,</li>
                                    <li>operational oversight by the Governance Board,</li>
                                    <li>commercial stewardship via the Stewardship Licence, and</li>
                                    <li>technical protection through the Infrastructure Manager.</li>
                                </ul>
                                <p>The governance hierarchy is defined as follows:</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">2.1 The DAO (Wnode DAO)</h3>
                                        <p>The DAO is the sovereign community governance body of the Wnode Mesh.</p>
                                        <div className="space-y-2">
                                            <p>The DAO:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>votes on proposals,</li>
                                                <li>approves constitutional amendments,</li>
                                                <li>controls the Treasury,</li>
                                                <li>ratifies or rejects major system changes.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>DAO voting is strictly <span className="text-blue-500 font-bold uppercase text-xs">1 Soul = 1 Vote</span>, ensuring:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>no whale dominance,</li>
                                                <li>no token-based power accumulation,</li>
                                                <li>no governance capture,</li>
                                                <li>equal representation for all verified individuals.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The DAO cannot override:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>the Core Immutable Provisions,</li>
                                                <li>the DAO owners’ constitutional rights,</li>
                                                <li>the Stewardship Licence terms,</li>
                                                <li>the Founder Board’s emergency powers and constitutional guardianship,</li>
                                                <li>the Infrastructure Manager’s emergency technical authority.</li>
                                            </ul>
                                        </div>
                                        <p>These protections exist to prevent catastrophic governance failures.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">2.2 The Initial Founder – Stephen Soos</h3>
                                        <div className="space-y-2">
                                            <p>The Founder holds the following permanent constitutional roles:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Founder</li>
                                                <li>Architect</li>
                                                <li>Initial Steward</li>
                                                <li>Initial Governance Board Member</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The Founder:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>established the Mesh,</li>
                                                <li>authored the Constitution,</li>
                                                <li>defined the governance architecture,</li>
                                                <li>created the token and identity systems,</li>
                                                <li>built the commercial and technical foundations.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">2.3 The Founder Board</h3>
                                        <p>The Founder Board consists of four (4) members, including the Founder.</p>
                                        <div className="space-y-2">
                                            <p>Its responsibilities include:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>constitutional guardianship,</li>
                                                <li>protection of the Mesh’s long-term integrity,</li>
                                                <li>appointment and removal of the Steward,</li>
                                                <li>oversight of the Infrastructure Manager,</li>
                                                <li>activation of emergency powers.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-white font-bold">Progressive Decentralisation Clause:</p>
                                            <p>To ensure long-term decentralisation, after 24 months from the genesis date or upon reaching 50,000 active Voting Souls (whichever occurs first), two (2) seats on the Founder Board shall transition to DAO-elected members serving 2-year terms (requiring 77% approval). The Founder retains a permanent seat. This balances early-stage protection against capture with community sovereignty.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The Founder Board is not fully elected by the DAO in its initial composition and exists to prevent:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>governance capture,</li>
                                                <li>malicious amendments,</li>
                                                <li>external takeover attempts,</li>
                                                <li>regulatory or technical sabotage.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">2.4 The Governance Board</h3>
                                        <p>The Governance Board consists of the four initial members, including the Founder.</p>
                                        <div className="space-y-2">
                                            <p>Its responsibilities include:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>operational oversight,</li>
                                                <li>proposal validation,</li>
                                                <li>treasury supervision,</li>
                                                <li>ensuring DAO decisions are implemented,</li>
                                                <li>ensuring the Steward and IM fulfil their duties.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The Governance Board is the operational governance layer, bridging:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>DAO decisions,</li>
                                                <li>Steward operations,</li>
                                                <li>Infrastructure Manager technical execution.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">2.5 The Steward</h3>
                                        <p>The Steward is the holder of the Stewardship Licence, a commercial operational licence granting:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>revenue rights,</li>
                                            <li>operational authority,</li>
                                            <li>customer support responsibility,</li>
                                            <li>compliance responsibility,</li>
                                            <li>UX and platform management responsibility.</li>
                                        </ul>
                                        <div className="space-y-2">
                                            <p>The Steward:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>does not control governance,</li>
                                                <li>does not control the Treasury,</li>
                                                <li>does not control the token,</li>
                                                <li>does not control the Founder Affiliate Tree,</li>
                                                <li>does not control the Infrastructure Manager.</li>
                                            </ul>
                                        </div>
                                        <p>The Steward is appointed and removable by the Founder Board. The Founder is the Initial Steward.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">2.6 The Infrastructure Manager (IM)</h3>
                                        <div className="space-y-2">
                                            <p>The IM is the technical authority responsible for:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>uptime,</li>
                                                <li>infrastructure reliability,</li>
                                                <li>node verification,</li>
                                                <li>emergency technical response,</li>
                                                <li>hardware acquisition and maintenance.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The IM:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>operates independently of the Steward,</li>
                                                <li>answers to the Governance Board,</li>
                                                <li>may activate emergency technical powers (Section 8).</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The IM cannot:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>modify governance,</li>
                                                <li>alter token supply,</li>
                                                <li>interfere with the DAO,</li>
                                                <li>override the Founder Board.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">2.7 Souls and NODLRs</h3>
                                        <p>Souls represent verified individuals.</p>
                                        <div className="space-y-2">
                                            <p>NODLRs are Souls who:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>operate nodes,</li>
                                                <li>pass technical verification,</li>
                                                <li>pass Stripe KYC, AML and verification as Stripe sees fit</li>
                                                <li>earn Voting Souls,</li>
                                                <li>Own the DAO.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>NODLRs:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>participate in DAO voting on a 1 Soul = 1 Vote basis,</li>
                                                <li>earn revenue from their nodes,</li>
                                                <li>Build their NODLR Affiliate Affiliate Trees (L1 + L2 only).</li>
                                            </ul>
                                        </div>
                                        <p>Souls (DAO Owners) form the community governance base.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">2.8 Affiliate Tree Assets (Founder Affiliate Trees & NODLR Affiliate Affiliate Trees)</h3>
                                        <p>Affiliate Tree assets are commercial, not governance assets.</p>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>Founder Affiliate Trees = infinite depth</li>
                                            <li>NODLR Affiliate Trees = Level 1 + Level 2 only</li>
                                            <li>All Affiliate Trees are transferable, sellable, permanent</li>
                                            <li>All Affiliate Trees follow freezing rules</li>
                                        </ul>
                                        <div className="space-y-2">
                                            <p>Affiliate Tree assets cannot influence:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>DAO voting,</li>
                                                <li>governance power,</li>
                                                <li>token supply,</li>
                                                <li>constitutional amendments.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">2.9 Hierarchy Summary</h3>
                                        <p>From highest constitutional authority to lowest:</p>
                                        <ol className="list-decimal pl-5 space-y-1 text-slate-400 font-mono text-xs uppercase">
                                            <li>The Constitution (including Core Immutable Provisions)</li>
                                            <li>The DAO (1 Soul = 1 Vote)</li>
                                            <li>The Governance Board</li>
                                            <li>The Founder Board</li>
                                            <li>The Steward (commercial operator)</li>
                                            <li>The Infrastructure Manager (technical authority)</li>
                                        </ol>
                                        <div className="space-y-2">
                                            <p>This structure ensures:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>decentralisation without chaos,</li>
                                                <li>community governance without vulnerability,</li>
                                                <li>commercial operation without governance capture,</li>
                                                <li>technical reliability without political interference.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 3 */}
                        <div id="section3" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 3 — SOULS, IDENTITY & VOTING RIGHTS</h2>
                            <div className="space-y-4">
                                <p>This section defines the identity system of the Wnode Mesh, the structure of Souls, and the rules governing voting rights within the DAO.</p>
                                <p>It establishes the 1 Soul = 1 Vote model and ensures that governance remains decentralised, fair, and resistant to capture.</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.1 Souls as the Foundation of Identity</h3>
                                        <p>A Soul is the core identity primitive of the Wnode Mesh.</p>
                                        <div className="space-y-2">
                                            <p>A Soul:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>represents a verified human individual</li>
                                                <li>is non-transferable</li>
                                                <li>is bound permanently to a WUID</li>
                                                <li>cannot be sold, traded, or delegated</li>
                                                <li>is required for all governance participation</li>
                                            </ul>
                                        </div>
                                        <p>Souls ensure that governance is based on people, not capital. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.2 Types of Souls</h3>
                                        <div className="space-y-2">
                                            <p>There are two types of Souls:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Locked Souls — identity-only, non-voting</li>
                                                <li>Voting Souls — earned through NODLR verification and node operation</li>
                                            </ul>
                                        </div>
                                        <p>A Soul may upgrade from Locked to Voting, but never downgrade unless revoked for cause (Section 11).</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.3 Locked Souls</h3>
                                        <div className="space-y-2">
                                            <p>A Locked Soul is issued when an individual:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>completes identity verification</li>
                                                <li>joins the Mesh</li>
                                                <li>but has not yet become a NODLR</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Locked Souls:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>cannot vote</li>
                                                <li>cannot propose governance actions</li>
                                                <li>cannot hold governance roles</li>
                                                <li>may operate nodes but do not earn Voting Souls until verified</li>
                                            </ul>
                                        </div>
                                        <p>Locked Souls exist to ensure identity integrity without granting governance power prematurely.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.4 Voting Souls</h3>
                                        <div className="space-y-2">
                                            <p>A Voting Soul is earned when an individual:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>becomes a verified NODLR</li>
                                                <li>passes technical verification</li>
                                                <li>passes Stripe Verification</li>
                                                <li>operates a node in good standing</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Voting Souls:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>grant full DAO voting rights</li>
                                                <li>allow proposal submission</li>
                                                <li>allow participation in elections</li>
                                                <li>allow participation in constitutional amendments</li>
                                            </ul>
                                        </div>
                                        <p>Voting Souls are the only source of governance power in the Wnode Mesh.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.5 1 Soul = 1 Vote</h3>
                                        <p>A Soul is a flesh and blood human being, or Person.</p>
                                        <p>The Wnode Mesh uses a strict one-person-one-vote model.</p>
                                        <div className="space-y-2">
                                            <p>This prevents:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>whale dominance</li>
                                                <li>token-based governance capture</li>
                                                <li>plutocratic control</li>
                                                <li>governance manipulation</li>
                                                <li>vote-buying</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>This model ensures:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>fairness</li>
                                                <li>decentralisation</li>
                                                <li>equal representation</li>
                                                <li>long-term governance stability</li>
                                            </ul>
                                        </div>
                                        <p>No Person may ever hold more than one Voting Soul. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.6 Soul Permanence</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>permanent</li>
                                            <li>bound to a single human</li>
                                            <li>non-transferable</li>
                                            <li>non-delegable</li>
                                            <li>non-fractional</li>
                                        </ul>
                                        <div className="space-y-2">
                                            <p>A Soul cannot be revoked; it can only be frozen temporarily or permanently for:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>fraud</li>
                                                <li>identity violation</li>
                                                <li>malicious governance behaviour</li>
                                                <li>regulatory requirement</li>
                                            </ul>
                                        </div>
                                        <p>Revocation and freezing rules are defined in Section 11.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.7 WUID Assignment</h3>
                                        <p>Each Soul receives a Wnode Universal Identifier (WUID).</p>
                                        <div className="space-y-2">
                                            <p>A WUID:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>is permanent</li>
                                                <li>is globally unique</li>
                                                <li>identifies the Soul across all Wnode systems</li>
                                                <li>is required for governance participation</li>
                                                <li>is required for node operation</li>
                                                <li>is required for buying Compute</li>
                                                <li>is required to enter any dashboards</li>
                                            </ul>
                                        </div>
                                        <p>For example, the Founder’s WUID is 1000001-0426-01-AA.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.8 Soul Privacy & Transparency</h3>
                                        <div className="space-y-2">
                                            <p>The Mesh balances:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>identity privacy, and</li>
                                                <li>governance transparency.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Souls:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>are pseudonymous by default</li>
                                                <li>may optionally be public</li>
                                                <li>must be verifiable by the system</li>
                                                <li>must be auditable for governance integrity</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The DAO sees:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Soul status (Locked or Voting)</li>
                                                <li>proposal history</li>
                                                <li>voting history</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The DAO does not see:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>personal identity</li>
                                                <li>private data</li>
                                                <li>regulatory documents</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.9 Soul-Based Governance Integrity</h3>
                                        <div className="space-y-2">
                                            <p>The Soul system ensures:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>no duplicate identities</li>
                                                <li>no Sybil attacks</li>
                                                <li>no governance stacking</li>
                                                <li>no multi-account voting</li>
                                                <li>no token-based power accumulation</li>
                                            </ul>
                                        </div>
                                        <p>The Steward and Governance Board jointly enforce identity integrity.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.10 Souls and Affiliate Tree Assets</h3>
                                        <p>Souls are identity assets. Affiliate Trees are immutable commercial assets.</p>
                                        <div className="space-y-2">
                                            <p>They are completely separate:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Souls cannot be sold</li>
                                                <li>Affiliate Trees can be sold</li>
                                                <li>Souls grant governance power</li>
                                                <li>Affiliate Trees do not grant governance power</li>
                                                <li>Souls are permanent</li>
                                                <li>Affiliate Trees are transferable</li>
                                            </ul>
                                        </div>
                                        <p>This separation prevents commercial assets from influencing governance. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.11 Souls and Token Holdings</h3>
                                        <div className="space-y-2">
                                            <p>Token holdings:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>do not grant governance power</li>
                                                <li>do not increase voting weight</li>
                                                <li>do not influence elections</li>
                                                <li>do not override Souls</li>
                                            </ul>
                                        </div>
                                        <p>Tokens are economic assets. Souls are governance assets. This separation protects the Wnode Mesh from token-based governance capture. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">3.12 Summary of Soul Governance Rules</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400 uppercase font-mono text-xs">
                                            <li>1 Soul = 1 Vote</li>
                                            <li>Souls are permanent and non-transferable</li>
                                            <li>Voting Souls require NODLR verification and onboarding</li>
                                            <li>Tokens do not influence governance</li>
                                            <li>Affiliate Trees do not influence governance</li>
                                            <li>Souls ensure decentralised, fair, human-based governance</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 4 */}
                        <div id="section4" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 4 — NODES, NODLRS & OPERATIONAL PARTICIPATION</h2>
                            <div className="space-y-4">
                                <p>This section defines the operational layer of the Wnode Mesh, including node operation, NODLR status, verification requirements, and the rules governing participation in the compute network.</p>
                                <p>It establishes the standards for running nodes, earning revenue, maintaining network integrity, and participating in governance.</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.1 Node Definition</h3>
                                        <div className="space-y-2">
                                            <p>A Node is any compute device registered to the Wnode Mesh that:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>contributes compute resources,</li>
                                                <li>participates in distributed workloads,</li>
                                                <li>meets minimum hardware and uptime requirements,</li>
                                                <li>is linked to a Soul and WUID,</li>
                                            </ul>
                                        </div>
                                        <p>Nodes form the physical backbone of the Wnode Mesh.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.2 Node Operator Requirements</h3>
                                        <div className="space-y-2">
                                            <p>To operate a node, an individual must:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>hold a Soul (Locked or Voting),</li>
                                                <li>register the device with the Wnode Mesh,</li>
                                                <li>maintain uptime requirements,</li>
                                                <li>comply with Stripe verification checks,</li>
                                                <li>adhere to security and compliance standards.</li>
                                            </ul>
                                        </div>
                                        <p>Node operators who meet all requirements may become NODLRs.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.3 NODLR Status</h3>
                                        <div className="space-y-2">
                                            <p>A NODLR is a verified node operator who:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>passes identity verification,</li>
                                                <li>passes technical verification,</li>
                                                <li>passes Stripe verification checks</li>
                                                <li>maintains a node in good standing,</li>
                                                <li>earns a Voting Soul,</li>
                                                <li>gains full DAO voting rights.</li>
                                            </ul>
                                        </div>
                                        <p>NODLRs are the core operational participants of the Wnode Mesh.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.4 NODLR Responsibilities</h3>
                                        <div className="space-y-2">
                                            <p>NODLRs must:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>maintain uptime,</li>
                                                <li>ensure hardware remains compliant,</li>
                                                <li>respond to Stripe verification requests,</li>
                                                <li>avoid malicious behaviour,</li>
                                                <li>maintain accurate identity information,</li>
                                                <li>operate nodes ethically and legally.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Failure to meet these obligations may result in:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>temporary suspension,</li>
                                                <li>loss of NODLR status,</li>
                                                <li>loss of Voting Soul (Section 11),</li>
                                                <li>freezing of NODLR Affiliate Affiliate Tree.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.5 Node Verification</h3>
                                        <div className="space-y-2">
                                            <p>The Infrastructure Manager performs:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>initial verification,</li>
                                                <li>periodic verification,</li>
                                                <li>random spot checks,</li>
                                                <li>automated uptime monitoring,</li>
                                                <li>hardware compliance checks.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Verification ensures:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>no fraudulent nodes,</li>
                                                <li>no duplicated identities,</li>
                                                <li>no artificial scaling,</li>
                                                <li>no Sybil attacks,</li>
                                                <li>no compromised hardware.</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.6 Node Rewards</h3>
                                        <div className="space-y-2">
                                            <p>Node rewards are distributed according to:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>compute contribution,</li>
                                                <li>uptime,</li>
                                                <li>workload participation,</li>
                                                <li>network demand,</li>
                                                <li>platform rules.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Rewards are:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>paid automatically,</li>
                                                <li>transparent,</li>
                                                <li>auditable,</li>
                                                <li>independent of governance power.</li>
                                            </ul>
                                        </div>
                                        <p>Rewards do not influence DAO voting.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.7 NODLR Affiliate Affiliate Trees (L1 + L2 Only)</h3>
                                        <div className="space-y-2">
                                            <p>Each NODLR maintains a two-level affiliate Affiliate Tree:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Level 1: direct recruits</li>
                                                <li>Level 2: indirect recruits</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>NODLR Affiliate Trees:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>are immutable permanent commercial assets,</li>
                                                <li>are transferable,</li>
                                                <li>are sellable,</li>
                                                <li>are permanent,</li>
                                                <li>do not extend beyond Level 2,</li>
                                                <li>do not grant governance power,</li>
                                                <li>follow the same freezing rules as Founder Affiliate Trees (except depth limitations).</li>
                                            </ul>
                                        </div>
                                        <p>This ensures fairness and prevents pyramid-style expansion.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.8 Founder Affiliate Tree Distinction</h3>
                                        <div className="space-y-2">
                                            <p>Founder Affiliate Trees differ from NODLR Affiliate Trees:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Founder Affiliate Trees are infinite depth,</li>
                                                <li>NODLR Affiliate Trees are L1 + L2 only,</li>
                                                <li>Founder receives 3% of the entire Founder Affiliate Tree to infinity.</li>
                                            </ul>
                                        </div>
                                        <p>This distinction is structural and permanent. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.9 Node Suspension & Removal</h3>
                                        <div className="space-y-2">
                                            <p>Nodes may be suspended or removed for:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>repeated downtime,</li>
                                                <li>hardware non-compliance,</li>
                                                <li>fraudulent activity,</li>
                                                <li>identity violations,</li>
                                                <li>malicious behaviour,</li>
                                                <li>regulatory requirements.</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Suspension may result in:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>loss of rewards, not revenue</li>
                                                <li>loss of NODLR status,</li>
                                                <li>freezing of NODLR Affiliate Tree L1 expansion but not revenue or ownership,</li>
                                                <li>loss of Voting Soul (Section 11).</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.10 Node Reactivation</h3>
                                        <div className="space-y-2">
                                            <p>Suspended nodes may be reactivated if:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>compliance is restored,</li>
                                                <li>identity is re-verified,</li>
                                                <li>hardware is repaired or replaced,</li>
                                                <li>IM approves reinstatement.</li>
                                            </ul>
                                        </div>
                                        <p>Reactivation does not automatically restore lost governance rights unless explicitly approved by the Governance Board.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.11 Operational Integrity</h3>
                                        <div className="space-y-2">
                                            <p>All node operators must:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>maintain secure hardware,</li>
                                                <li>avoid prohibited workloads,</li>
                                                <li>comply with jurisdictional regulations,</li>
                                                <li>avoid interference with the Wnode Mesh,</li>
                                                <li>avoid attempts to manipulate workloads or rewards.</li>
                                                <li>run nodes in Virtual machines or environments</li>
                                            </ul>
                                        </div>
                                        <p>The IM may take immediate action to protect the Mesh.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.12 Summary of Node & NODLR Rules</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400 uppercase font-mono text-xs">
                                            <li>Nodes form the compute backbone</li>
                                            <li>NODLRs are verified node operators</li>
                                            <li>NODLRs earn Voting Souls</li>
                                            <li>NODLR Affiliate Trees are L1 + L2 only</li>
                                            <li>Founder Affiliate Trees are infinite</li>
                                            <li>Rewards do not influence governance</li>
                                            <li>IM enforces technical integrity</li>
                                            <li>Governance and commercial assets remain separate</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">4.13 Appeal Process</h3>
                                        <p>Any NODLR facing suspension, removal, Affiliate Tree freezing, or loss of Voting Soul may submit a written appeal to the Governance Board within 7 days of notification.</p>
                                        <p>The Governance Board shall review the appeal within 14 days.</p>
                                        <p>In exceptional cases, the matter may be escalated to the DAO via an Emergency Proposal.</p>
                                        <p>All decisions must be documented and published for transparency.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 5 */}
                        <div id="section5" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 5 — GOVERNANCE PROPOSALS & VOTING PROCEDURES</h2>
                            <div className="space-y-4">
                                <p>This section defines how governance proposals are created, submitted, validated, voted on, and enacted within the Wnode Mesh.</p>
                                <p>It establishes the rules for DAO participation, proposal types, voting thresholds, and the constitutional safeguards that prevent governance abuse.</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.1 Proposal Categories</h3>
                                        <div className="space-y-2">
                                            <p>All governance actions fall into one of the following categories:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Operational Proposals — routine changes to platform parameters, UX, or processes</li>
                                                <li>Economic Proposals — reward rates, fee structures, economic parameters</li>
                                                <li>Treasury Proposals — spending, grants, investments, or treasury allocations</li>
                                                <li>Role Proposals — appointments or removals (except Founder roles)</li>
                                                <li>Constitutional Amendments — changes to this Constitution</li>
                                                <li>Emergency Proposals — urgent actions requiring accelerated voting</li>
                                            </ul>
                                        </div>
                                        <p>Each category has its own thresholds and validation requirements.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.2 Who May Submit Proposals</h3>
                                        <p>Only individuals with a Voting Soul may submit proposals.</p>
                                        <div className="space-y-2">
                                            <p>This ensures:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>no anonymous governance manipulation</li>
                                                <li>no proposal spam</li>
                                                <li>no influence from non-verified actors</li>
                                            </ul>
                                        </div>
                                        <p>Locked Souls and non-Souls may not submit proposals.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.3 Proposal Submission Requirements</h3>
                                        <div className="space-y-2">
                                            <p>A valid proposal must include:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>the proposer’s WUID</li>
                                                <li>the proposal category</li>
                                                <li>a clear description of the change</li>
                                                <li>the expected impact</li>
                                                <li>any required resources</li>
                                                <li>any required Treasury allocation</li>
                                                <li>implementation details (if applicable)</li>
                                            </ul>
                                        </div>
                                        <p>Proposals missing required information may be rejected by the Governance Board.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.4 Governance Board Validation</h3>
                                        <div className="space-y-2">
                                            <p>Before a proposal goes to a DAO vote, the Governance Board may:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>verify the proposal category</li>
                                                <li>confirm it does not violate the Constitution or Core Immutable Provisions</li>
                                                <li>confirm it does not violate regulatory requirements</li>
                                                <li>confirm it does not compromise network security</li>
                                                <li>confirm it is technically feasible</li>
                                                <li>confirm it is economically viable</li>
                                                <li>approve the proposal for voting</li>
                                                <li>request revisions</li>
                                                <li>reject the proposal with justification</li>
                                            </ul>
                                        </div>
                                        <p>This prevents harmful or invalid proposals from reaching the DAO.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.5 DAO Voting Process</h3>
                                        <p>Once validated, proposals enter the DAO voting cycle.</p>
                                        <div className="space-y-2">
                                            <p>Voting rules:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>1 Soul = 1 Vote</li>
                                                <li>Voting Souls only</li>
                                                <li>Votes are final once cast</li>
                                                <li>Abstentions do not count toward thresholds</li>
                                                <li>Voting period: 7 days (unless emergency)</li>
                                            </ul>
                                        </div>
                                        <p>Votes may be: YES or NO.</p>
                                        <p>A proposal passes if it meets the required threshold for its category.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.6 Voting Thresholds</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-[11px] border-collapse">
                                                <thead>
                                                    <tr className="border-b border-white/10 text-slate-500 uppercase tracking-widest font-mono">
                                                        <th className="py-3 px-2">Proposal Type</th>
                                                        <th className="py-3 px-2">Approval Threshold</th>
                                                        <th className="py-3 px-2">Quorum</th>
                                                        <th className="py-3 px-2">Notes</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-slate-400 font-mono">
                                                    <tr className="border-b border-white/5">
                                                        <td className="py-3 px-2 text-white">Operational Proposals</td>
                                                        <td className="py-3 px-2 text-blue-500 font-bold">{">"}66% YES</td>
                                                        <td className="py-3 px-2">20%</td>
                                                        <td className="py-3 px-2">Routine changes</td>
                                                    </tr>
                                                    <tr className="border-b border-white/5">
                                                        <td className="py-3 px-2 text-white">Economic Proposals</td>
                                                        <td className="py-3 px-2 text-blue-500 font-bold">{">"}80% YES</td>
                                                        <td className="py-3 px-2">25%</td>
                                                        <td className="py-3 px-2">Reward/fee changes</td>
                                                    </tr>
                                                    <tr className="border-b border-white/5">
                                                        <td className="py-3 px-2 text-white">Treasury Proposals</td>
                                                        <td className="py-3 px-2 text-blue-500 font-bold">{">"}70% YES</td>
                                                        <td className="py-3 px-2">30%</td>
                                                        <td className="py-3 px-2">Must include spending justification</td>
                                                    </tr>
                                                    <tr className="border-b border-white/5">
                                                        <td className="py-3 px-2 text-white">Role Proposals (non-Founder)</td>
                                                        <td className="py-3 px-2 text-blue-500 font-bold">{">"}75% YES</td>
                                                        <td className="py-3 px-2">30%</td>
                                                        <td className="py-3 px-2">Gov Board pre-approval</td>
                                                    </tr>
                                                    <tr className="border-b border-white/5">
                                                        <td className="py-3 px-2 text-white">Constitutional Amendments</td>
                                                        <td className="py-3 px-2 text-blue-500 font-bold">{">"}85% YES</td>
                                                        <td className="py-3 px-2">40%</td>
                                                        <td className="py-3 px-2">Non-core provisions</td>
                                                    </tr>
                                                    <tr className="border-b border-white/5">
                                                        <td className="py-3 px-2 text-white">Core Immutable Provisions</td>
                                                        <td className="py-3 px-2 text-blue-500 font-bold">100% YES</td>
                                                        <td className="py-3 px-2">50%</td>
                                                        <td className="py-3 px-2 font-black">Highest protection</td>
                                                    </tr>
                                                    <tr className="border-b border-white/5">
                                                        <td className="py-3 px-2 text-white">Emergency Proposals</td>
                                                        <td className="py-3 px-2 text-blue-500 font-bold">{">"}50% YES</td>
                                                        <td className="py-3 px-2">NONE</td>
                                                        <td className="py-3 px-2">24h window, co-signed</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.7 Quorum Requirements</h3>
                                        <p>A proposal requires the minimum participation level shown above to be valid. If quorum is not met, the proposal automatically fails.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.8 Proposal Enactment</h3>
                                        <div className="space-y-2">
                                            <p>If a proposal passes:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>the Governance Board oversees implementation</li>
                                                <li>the Steward executes operational changes</li>
                                                <li>the Infrastructure Manager executes technical changes</li>
                                                <li>the Treasury executes financial changes</li>
                                                <li>the DAO receives a public implementation report</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Implementation must occur within:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>14 days for operational changes</li>
                                                <li>30 days for economic or treasury changes</li>
                                                <li>immediately for emergency actions</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.9 Proposal Rejection</h3>
                                        <div className="space-y-2">
                                            <p>If a proposal fails:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>it may not be resubmitted for 30 days</li>
                                                <li>it may only be submitted twice in a 12-month period from the original submission date (unless materially revised or the Governance Board grants an exception)</li>
                                            </ul>
                                        </div>
                                        <p>Rejected proposals remain publicly archived.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.10 Founder Board Veto (Limited Use)</h3>
                                        <div className="space-y-2">
                                            <p>The Founder Board may veto proposals that threaten:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>network integrity</li>
                                                <li>regulatory compliance</li>
                                                <li>security</li>
                                                <li>Founder rights or Core Immutable Provisions</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The veto:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>must be justified in writing</li>
                                                <li>must be published to the DAO</li>
                                                <li>may be overridden by a 90% DAO supermajority within 14 days</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.11 Proposal Transparency</h3>
                                        <div className="space-y-2">
                                            <p>All proposals, votes, and outcomes are:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>public</li>
                                                <li>permanent</li>
                                                <li>auditable</li>
                                                <li>linked to WUIDs</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.12 Dispute Resolution</h3>
                                        <p>Any dispute regarding proposal validity, voting results, or implementation shall be resolved through the process in Section 1.21 (London arbitration under LCIA Rules).</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">5.13 Summary of Proposal & Voting Rules</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400 uppercase font-mono text-xs">
                                            <li>Only Voting Souls may submit proposals</li>
                                            <li>Governance Board validates proposals</li>
                                            <li>DAO votes using 1 Soul = 1 Vote</li>
                                            <li>Thresholds vary by proposal type with stronger protections for Core Immutable Provisions</li>
                                            <li>Founder Board retains limited veto power</li>
                                            <li>All actions are transparent and auditable</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 6 */}
                        <div id="section6" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 6 — THE STEWARDSHIP LICENCE</h2>
                            <div className="space-y-4">
                                <p>The Stewardship Licence defines the commercial, operational, and administrative authority granted to the Steward.</p>
                                <p>It establishes the rights, obligations, limitations, and revocation conditions under which the Steward operates the Wnode Mesh.</p>
                                <p>The Stewardship Licence is a commercial licence, not a governance role. The Founder is the Initial Steward.</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.1 Nature of the Stewardship Licence</h3>
                                        <div className="space-y-2">
                                            <p>The Stewardship Licence is:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>perpetual unless revoked for cause</li>
                                                <li>commercial in nature</li>
                                                <li>non-governance-bearing</li>
                                                <li>non-transferable without Founder Board approval</li>
                                                <li>revocable under defined conditions</li>
                                                <li>independent of token supply or DAO voting power</li>
                                            </ul>
                                        </div>
                                        <p>The Licence grants operational authority, not political authority. Detailed commercial terms (including revenue share) are set out in a separate, publicly available Stewardship Licence Agreement.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.2 Rights Granted to the Steward</h3>
                                        <div className="space-y-2">
                                            <p>The Steward is granted the right to:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Operate the Platform — manage UX, onboarding, support, and user-facing systems</li>
                                                <li>Manage Customer Support — provide assistance to users and NODLRs</li>
                                                <li>Handle Compliance — ensure regulatory adherence, including data protection</li>
                                                <li>Manage Commercial Operations — oversee revenue-bearing activities</li>
                                                <li>Receive Revenue Share — as defined in the Stewardship Licence Agreement</li>
                                                <li>Maintain Platform Documentation — update help pages, guides, and onboarding flows</li>
                                            </ul>
                                        </div>
                                        <p>The Steward does not receive governance power.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.3 Responsibilities of the Steward</h3>
                                        <div className="space-y-2">
                                            <p>The Steward must:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Maintain Operational Stability</li>
                                                <li>Ensure User Safety</li>
                                                <li>Provide Accurate Information</li>
                                                <li>Support NODLRs</li>
                                                <li>Maintain Compliance</li>
                                                <li>Coordinate with the Governance Board</li>
                                                <li>Cooperate with the Infrastructure Manager</li>
                                            </ul>
                                        </div>
                                        <p>Failure to meet these obligations may result in suspension or revocation of the Licence.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.4 Steward Limitations</h3>
                                        <div className="space-y-2">
                                            <p>The Steward cannot:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>modify governance rules</li>
                                                <li>alter token supply</li>
                                                <li>change DAO voting mechanisms</li>
                                                <li>interfere with the Infrastructure Manager</li>
                                                <li>override Governance Board decisions</li>
                                                <li>access or control the Treasury</li>
                                                <li>modify Founder Affiliate Tree rules</li>
                                                <li>appoint or remove governance roles</li>
                                            </ul>
                                        </div>
                                        <p>The Steward is an operator, not a governor.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.5 Revenue Rights</h3>
                                        <div className="space-y-2">
                                            <p>The Steward receives revenue as defined in:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>the Stewardship Licence Agreement</li>
                                                <li>platform payment rules</li>
                                                <li>Stripe payout architecture</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Revenue rights include:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>operational revenue share as defined in the Stewardship Licence Agreement</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Revenue rights do not include:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>governance influence</li>
                                                <li>token minting</li>
                                                <li>Treasury access</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.6 Steward Obligations to the DAO</h3>
                                        <div className="space-y-2">
                                            <p>The Steward must:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>implement DAO-approved operational changes</li>
                                                <li>publish quarterly operational reports</li>
                                                <li>maintain transparent communication</li>
                                                <li>uphold the Constitution</li>
                                                <li>ensure fair treatment of all users</li>
                                                <li>avoid conflicts of interest</li>
                                            </ul>
                                        </div>
                                        <p>The Steward is accountable to the Governance Board and Founder Board.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.7 Steward Obligations to the Infrastructure Manager</h3>
                                        <div className="space-y-2">
                                            <p>The Steward must:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>provide accurate operational data</li>
                                                <li>support IM verification processes</li>
                                                <li>avoid interference with technical operations</li>
                                                <li>escalate technical issues promptly</li>
                                                <li>comply with IM emergency actions</li>
                                            </ul>
                                        </div>
                                        <p>The IM has priority in all technical matters.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.8 Steward Obligations to the Founder Board</h3>
                                        <div className="space-y-2">
                                            <p>The Steward must:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>comply with DAO and Governance Board directives</li>
                                                <li>maintain the integrity of the Wnode Mesh</li>
                                                <li>avoid actions that threaten long-term stability</li>
                                                <li>uphold the Founder’s constitutional rights</li>
                                                <li>maintain the Affiliate Affiliate Tree structure</li>
                                            </ul>
                                        </div>
                                        <p>The Governance Board may intervene if the Steward fails to meet obligations.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.9 Steward Removal</h3>
                                        <div className="space-y-2">
                                            <p>The Steward may be removed by the Founder Board for:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>breach of Licence</li>
                                                <li>operational negligence</li>
                                                <li>regulatory violations</li>
                                                <li>fraud or misconduct</li>
                                                <li>actions threatening network stability</li>
                                                <li>refusal to implement DAO-approved changes</li>
                                                <li>attempts to alter governance</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Removal triggers:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>immediate freezing of the Steward’s Founder Affiliate Tree</li>
                                                <li>appointment of a new Steward</li>
                                                <li>transfer of operational authority</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.10 Steward Replacement</h3>
                                        <div className="space-y-2">
                                            <p>Upon removal or resignation:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>the Governance Board approves or appoints a new Steward</li>
                                                <li>the outgoing Steward’s Founder Affiliate Tree becomes a Frozen Affiliate Tree</li>
                                                <li>the new Steward receives a new Founder Affiliate Tree</li>
                                                <li>all operational authority transfers immediately</li>
                                                <li>no governance rights are transferred</li>
                                            </ul>
                                        </div>
                                        <p>This ensures continuity without governance disruption.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.11 NODLR Affiliate Affiliate Tree Rules Under the Steward</h3>
                                        <div className="space-y-2">
                                            <p>The Steward has no authority over:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>NODLR Affiliate Affiliate Tree ownership</li>
                                                <li>NODLR Affiliate Affiliate Tree transfer</li>
                                                <li>NODLR Affiliate Affiliate Tree revenue</li>
                                                <li>NODLR Affiliate Affiliate Tree structure</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>NODLR Affiliate Trees remain:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>immutable commercial assets</li>
                                                <li>L1 + L2 only</li>
                                                <li>independent of Steward control</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.12 Steward Independence from Governance</h3>
                                        <div className="space-y-2">
                                            <p>The Steward:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>cannot vote in the DAO unless they are also a NODLR</li>
                                                <li>cannot propose governance changes unless they hold a Voting Soul</li>
                                                <li>cannot influence governance through commercial operations</li>
                                                <li>cannot use revenue to influence governance</li>
                                            </ul>
                                        </div>
                                        <p>This separation protects the Wnode Mesh from commercial governance capture.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">6.13 Summary of Stewardship Rules</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400 uppercase font-mono text-xs">
                                            <li>Stewardship Licence = commercial, not governance</li>
                                            <li>Founder is the Initial Steward</li>
                                            <li>Steward operates the platform</li>
                                            <li>Governance Board oversees the Steward</li>
                                            <li>Governance Board appoints/removes the Steward</li>
                                            <li>IM handles technical authority</li>
                                            <li>Steward Affiliate Trees freeze upon removal</li>
                                            <li>NODLR Affiliate Trees remain independent</li>
                                            <li>No governance power is granted through the Licence</li>
                                            <li>Annual performance review and public reporting required for transparency</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 7 */}
                        <div id="section7" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 7 — Affiliate Tree ASSETS</h2>
                            <div className="space-y-4">
                                <p>Affiliate Tree Assets are commercial, non-governance, non-token structures representing referral lineage and organic growth within the Wnode Mesh. They are permanent economic assets but have zero influence over governance, voting, token supply, or constitutional authority.</p>
                                <p>This section defines the rights, limitations, and protections for all Affiliate Tree Assets.</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.1 Definition of Affiliate Tree Assets</h3>
                                        <div className="space-y-2">
                                            <p>Affiliate Tree Assets include:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Founder Affiliate Trees — infinite-depth commercial lineage</li>
                                                <li>NODLR Affiliate Affiliate Trees — strictly Level 1 + Level 2 only</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Affiliate Tree Assets:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>are commercial assets</li>
                                                <li>are transferable</li>
                                                <li>are sellable</li>
                                                <li>are permanent</li>
                                                <li>do not grant governance power</li>
                                                <li>do not influence DAO voting</li>
                                                <li>do not affect token supply</li>
                                            </ul>
                                        </div>
                                        <p>This separation of commercial and governance assets is a <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.2 Founder and Partner Affiliate Affiliate Trees</h3>
                                        <p>A Founder and Partner Affiliate Affiliate Tree is a permanent commercial asset assigned to the initial Founders and Partners.</p>
                                        <div className="space-y-2">
                                            <p>Founder and Partner Affiliate Trees:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>have infinite depth</li>
                                                <li>grow organically and through referrals</li>
                                                <li>are transferable as an asset</li>
                                                <li>are non-governance-bearing</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-white font-bold">Founder Revenue Entitlement</p>
                                            <p>The Founder receives: 3% of the entire Founder Affiliate Tree to infinity.</p>
                                        </div>
                                        <p>This entitlement is immutable, permanent, and constitutionally protected. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.3 NODLR Affiliate Affiliate Trees (Level 1 + Level 2 Only)</h3>
                                        <p>Each NODLR maintains a two-level commercial Affiliate Tree:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>Level 1: direct recruits</li>
                                            <li>Level 2: indirect recruits</li>
                                        </ul>
                                        <div className="space-y-2">
                                            <p>NODLR Affiliate Trees:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>cannot expand beyond Level 2</li>
                                                <li>are commercial assets</li>
                                                <li>are transferable</li>
                                                <li>are sellable</li>
                                                <li>are permanent</li>
                                                <li>do not grant governance power</li>
                                                <li>follow the same freezing and protection rules as Founder Affiliate Trees (except depth limitations)</li>
                                            </ul>
                                        </div>
                                        <p>This structure prevents pyramid-style expansion and maintains fairness.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.4 Affiliate Tree Ownership Rights</h3>
                                        <div className="space-y-2">
                                            <p>Affiliate Tree owners (Founder or NODLR) have the right to:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Transfer Ownership</li>
                                                <li>Sell Their Affiliate Tree</li>
                                                <li>Receive Revenue</li>
                                                <li>Maintain Commercial Control</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Affiliate Tree ownership does not grant:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>governance rights</li>
                                                <li>DAO voting power</li>
                                                <li>token minting rights</li>
                                                <li>constitutional authority</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.5 Affiliate Tree Transfer Rules</h3>
                                        <div className="space-y-2">
                                            <p>Affiliate Tree Assets may be transferred:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>voluntarily (sale, gift, assignment)</li>
                                                <li>involuntarily (regulatory requirement, estate transfer)</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Transfers must:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>be registered on-chain</li>
                                                <li>not violate identity or compliance rules</li>
                                                <li>comply with applicable laws</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.6 Affiliate Tree Freezing Rules</h3>
                                        <div className="space-y-2">
                                            <p>A Affiliate Tree becomes a Frozen Affiliate Tree when:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>a NODLR is removed for cause</li>
                                                <li>identity fraud is detected</li>
                                                <li>regulatory action requires suspension</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>A Frozen Affiliate Tree:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>remains owned by the individual</li>
                                                <li>continues receiving existing revenue</li>
                                                <li>cannot recruit new Level 1 members</li>
                                                <li>may be unfrozen only by Governance Board approval (with appeal rights under Section 4.13)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.7 Stewardship Transitions & Founder Affiliate Trees</h3>
                                        <div className="space-y-2">
                                            <p>When a Steward is removed or resigns:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>their Founder Affiliate Tree becomes a Frozen Affiliate Tree</li>
                                                <li>a new Founder Affiliate Tree is issued to the incoming Steward</li>
                                                <li>the Founder’s 3% infinite-Affiliate Tree entitlement remains unaffected</li>
                                                <li>no governance rights transfer</li>
                                            </ul>
                                        </div>
                                        <p>This ensures continuity without governance disruption.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.8 NODLR Removal & Affiliate Tree Freezing</h3>
                                        <div className="space-y-2">
                                            <p>If a NODLR is removed for:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400 font-bold uppercase text-[10px]">
                                                <li>fraud</li>
                                                <li>identity violation</li>
                                                <li>malicious behaviour</li>
                                                <li>regulatory breach</li>
                                                <li>repeated non-compliance</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>Then:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>their NODLR Affiliate Affiliate Tree becomes a Frozen Affiliate Tree</li>
                                                <li>they retain existing revenue</li>
                                                <li>they lose the ability to expand the L1 Affiliate Tree but benefit from organic growth beyond L1</li>
                                                <li>they may lose their Voting Soul (Section 11)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.9 Affiliate Tree Assets & Governance Separation</h3>
                                        <p>Affiliate Tree Assets are strictly commercial.</p>
                                        <div className="space-y-2">
                                            <p>They cannot:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>influence DAO voting</li>
                                                <li>influence proposal outcomes</li>
                                                <li>influence token supply</li>
                                                <li>influence governance roles</li>
                                                <li>be used to buy political power</li>
                                            </ul>
                                        </div>
                                        <p>This separation protects the Wnode Mesh from commercial governance capture. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.10 Affiliate Tree Assets & Token Independence</h3>
                                        <div className="space-y-2">
                                            <p>Affiliate Tree Assets:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>do not mint tokens</li>
                                                <li>do not burn tokens</li>
                                                <li>do not modify token supply</li>
                                                <li>do not grant token-based governance rights</li>
                                            </ul>
                                        </div>
                                        <p>Tokens and Affiliate Trees are independent economic systems.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.11 Affiliate Tree Asset Transparency</h3>
                                        <div className="space-y-2">
                                            <p>All Affiliate Tree Assets are:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>visible to their owners</li>
                                                <li>auditable by the platform</li>
                                                <li>compliant with privacy rules</li>
                                                <li>pseudonymous unless voluntarily disclosed</li>
                                            </ul>
                                        </div>
                                        <p>The DAO does not see personal identity information.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.12 Summary of Affiliate Tree Asset Rules</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400 uppercase font-mono text-xs">
                                            <li>Founder Affiliate Trees = infinite depth</li>
                                            <li>NODLR Affiliate Trees = L1 + L2 only</li>
                                            <li>All Affiliate Trees are commercial assets</li>
                                            <li>No Affiliate Tree grants governance power</li>
                                            <li>Founder receives 3% of entire Founder Affiliate Tree to infinity (Core Immutable Provision)</li>
                                            <li>Affiliate Trees are transferable and sellable</li>
                                            <li>Affiliate Trees may be frozen only for cause, with appeal rights</li>
                                            <li>Governance and commercial assets remain fully separated</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">7.13 Affiliate Tree Revenue</h3>
                                        <div className="space-y-2">
                                            <p>Nodlrs earn the following commission from their Affiliate Tree:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400 font-bold">
                                                <li>Level 1 = 3%</li>
                                                <li>Level 2 = 7%</li>
                                            </ul>
                                        </div>
                                        <p>An Affiliate Tree is an immutable asset.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 8 */}
                        <div id="section8" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 8 — EMERGENCY POWERS & NETWORK PROTECTION</h2>
                            <div className="space-y-4">
                                <p>This section defines the emergency powers granted to the Founder Board and the Infrastructure Manager (IM), and the conditions under which these powers may be activated.</p>
                                <p>Emergency powers exist solely to protect the Wnode Mesh from catastrophic harm and cannot be used for political or commercial purposes.</p>
                                <p>These powers ensure the Wnode Mesh remains secure, stable, and resilient under extreme conditions.</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">8.1 Purpose of Emergency Powers</h3>
                                        <div className="space-y-2">
                                            <p>Emergency powers exist to:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Protect the Mesh from catastrophic failure</li>
                                                <li>Prevent Governance Capture</li>
                                                <li>Respond to Attacks</li>
                                                <li>Ensure Technical Stability</li>
                                                <li>Comply with Regulatory Requirements</li>
                                            </ul>
                                        </div>
                                        <p>Emergency powers are temporary, limited, proportionate, and auditable.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">8.2 Entities Authorized to Declare an Emergency</h3>
                                        <div className="space-y-2">
                                            <p>Only the following entities may declare an emergency:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Founder Board</li>
                                                <li>Infrastructure Manager (IM)</li>
                                                <li>Steward (in coordination with the above)</li>
                                                <li>DAO (via Emergency Proposal)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">8.3 Types of Emergencies</h3>
                                        <div className="space-y-2">
                                            <p>Emergencies fall into the following categories:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Technical Emergencies — outages, hardware failures, network instability</li>
                                                <li>Security Emergencies — attacks, exploits, malicious actors</li>
                                                <li>Governance Emergencies — attempted governance capture, fraudulent voting</li>
                                                <li>Regulatory Emergencies — legal orders, compliance threats</li>
                                                <li>Operational Emergencies — Steward failure, data corruption, platform compromise</li>
                                            </ul>
                                        </div>
                                        <p>Each emergency type has specific powers and limitations.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">8.4 Infrastructure Manager Emergency Powers</h3>
                                        <p>The IM may activate emergency powers without prior approval if immediate action is required to protect the network.</p>
                                        <div className="space-y-2">
                                            <p>The IM may:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Suspend Nodes</li>
                                                <li>Block Malicious Actors</li>
                                                <li>Isolate Network Segments</li>
                                                <li>Pause Workloads</li>
                                                <li>Enforce Technical Lockdowns</li>
                                                <li>Trigger Security Protocols</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The IM cannot:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>alter governance</li>
                                                <li>modify token supply</li>
                                                <li>freeze Tree Assets</li>
                                                <li>remove Souls</li>
                                                <li>override the Founder Board</li>
                                            </ul>
                                        </div>
                                        <p>All IM emergency actions must be logged and reported to the Governance Board and DAO within 24 hours.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">8.5 Governance Board / Founder Board Emergency Powers</h3>
                                        <p>The Founder Board (or Governance Board in coordination) may activate emergency powers to protect:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>the Constitution and Core Immutable Provisions</li>
                                            <li>the Mesh</li>
                                            <li>the DAO</li>
                                            <li>the Founder’s rights</li>
                                            <li>the long-term stability of the network</li>
                                        </ul>
                                        <div className="space-y-2">
                                            <p>The Founder Board may:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Freeze Governance Processes (temporarily)</li>
                                                <li>Override Malicious Proposals</li>
                                                <li>Freeze Tree Assets (for cause)</li>
                                                <li>Remove the Steward</li>
                                                <li>Suspend the Stewardship Licence</li>
                                                <li>Authorize IM Technical Actions</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The Founder Board cannot:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>change the Constitution unilaterally</li>
                                                <li>alter token supply</li>
                                                <li>appoint Governance Board members without process</li>
                                                <li>permanently remove DAO voting rights</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">8.6 Emergency Duration Limits</h3>
                                        <div className="space-y-2">
                                            <p>Emergency powers:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>last for a maximum of 72 hours initially</li>
                                                <li>may be extended once for an additional period not exceeding 7 days total, with written justification</li>
                                                <li>require DAO review and ratification after expiration</li>
                                                <li>cannot be used to create permanent governance changes</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">8.7 Emergency Transparency Requirements</h3>
                                        <div className="space-y-2">
                                            <p>All emergency actions must be:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>logged</li>
                                                <li>published to the DAO</li>
                                                <li>timestamped</li>
                                                <li>linked to WUIDs (where applicable)</li>
                                                <li>auditable by the DAO</li>
                                            </ul>
                                        </div>
                                        <p>Transparency ensures emergency powers cannot be abused.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">8.8 DAO Oversight After Emergencies</h3>
                                        <div className="space-y-2">
                                            <p>After an emergency ends:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>the DAO receives a full public report within 7 days</li>
                                                <li>the DAO may review or reverse non-critical actions via standard proposal process</li>
                                                <li>the DAO may propose reforms</li>
                                                <li>the Governance Board must confirm restoration of normal operations</li>
                                            </ul>
                                        </div>
                                        <div className="space-y-2">
                                            <p>The DAO cannot override:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Founder Board constitutional protections</li>
                                                <li>IM technical safety actions taken in good faith</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">8.9 Summary of Emergency Powers</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400 uppercase font-mono text-xs">
                                            <li>Emergency powers are defensive only</li>
                                            <li>Strictly time-limited with mandatory DAO oversight</li>
                                            <li>Full transparency and auditability required</li>
                                            <li>Balance of rapid response with accountability</li>
                                            <li>Cannot override Core Immutable Provisions</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 9 */}
                        <div id="section9" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 9 — TOKENOMICS & ECONOMIC MODEL</h2>
                            <div className="space-y-4">
                                <p>This section defines the economic framework of the Wnode Mesh, the role of the Wnode Token, Treasury management, and protections for investors, node operators, and the broader community.</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.1 Purpose of the Wnode Token</h3>
                                        <p>The Wnode Token is a utility and incentive token. It is designed to support network growth, reward participation, and enable economic activity within the Mesh.</p>
                                        <p className="text-white font-bold">Critical Separation:</p>
                                        <p>Governance power resides exclusively with Souls (1 Soul = 1 Vote). Token holdings confer no voting rights, no proposal submission rights, and no governance influence. <span className="text-blue-500 font-bold uppercase text-xs">Core Immutable Provision.</span></p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.2 Token Supply and Issuance</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>The total token supply is fixed or algorithmically capped as detailed in the official Wnode Technical Whitepaper.</li>
                                            <li>No unilateral minting is permitted.</li>
                                            <li>Any changes to token supply mechanics (including burns or additional emissions) require an Economic Proposal ({">"}87% approval).</li>
                                            <li>Initial token distribution, team allocations, and vesting schedules shall be publicly disclosed at launch and subject to standard industry vesting (minimum 12–36 months with cliffs where applicable).</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.3 Token Utility</h3>
                                        <div className="space-y-2">
                                            <p>The Wnode Token may be used for:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Staking to earn network incentives</li>
                                                <li>Payment of certain platform fees (with possible discounts)</li>
                                                <li>Participating in network incentives and reward pools</li>
                                                <li>Collateral or access to advanced features (if implemented)</li>
                                                <li>Ecosystem governance-adjacent utilities (subject to Soul-based oversight)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.4 Node Rewards and Operator Economics</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>Node operators (NODLRs) earn rewards primarily based on actual compute contribution, uptime, and workload performance.</li>
                                            <li>Rewards are paid in FIAT currency at launch but Token reward payments will be introduced as an option within 6 months of launch.</li>
                                            <li>Rewards are independent of token holdings and governed by transparent, auditable rules.</li>
                                            <li>All reward mechanisms are subject to Economic Proposals.</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.5 Treasury Management</h3>
                                        <p>The Treasury is the on-chain financial reserve of the DAO and shall be managed as follows:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>Controlled by DAO vote with Governance Board supervision.</li>
                                            <li>Multi-signature wallet requiring approvals from designated Governance Board members and/or automated smart contract rules.</li>
                                            <li>Quarterly public audits by an independent third party (results published to the DAO).</li>
                                            <li>Major allocations (exceeding 5% of total Treasury value) require a dedicated Treasury Proposal ({">"}70% approval).</li>
                                            <li>Treasury funds may be used for: network development, marketing, security, grants, liquidity provision, and ecosystem growth.</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.6 Economic Proposals</h3>
                                        <p>All material changes to economic parameters (reward rates, fee structures, emissions schedules, staking mechanics, etc.) require an Economic Proposal with {">"}87% approval and 25% quorum.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.7 Investor and Operator Protections</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>Token holders participate in the economic upside of the network through staking rewards, fee sharing, and token utility.</li>
                                            <li>Node operators are protected by performance-based rewards and commercial Tree assets.</li>
                                            <li>No special rights or privileges are granted to large token holders in governance.</li>
                                            <li>Anti-dilution and fair launch principles shall guide initial token distribution.</li>
                                            <li>All economic activity is subject to full transparency and auditability.</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.8 Revenue Flow Overview</h3>
                                        <p>Initially paid in USD via Stripe Connect.</p>
                                        <div className="space-y-2">
                                            <p>Typical revenue flow:</p>
                                            <ol className="list-decimal pl-5 space-y-1 text-slate-400">
                                                <li>Node Operators 70%</li>
                                                <li>Sales Source 10%</li>
                                                <li>Founder override 3%</li>
                                                <li>Level 1 Affiliate Commission = 3%</li>
                                                <li>Level 2 Affiliate Commission 7%</li>
                                                <li>Steward = 7%</li>
                                            </ol>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.9 Prohibition on Manipulative Practices</h3>
                                        <div className="space-y-2">
                                            <p>The following are strictly prohibited:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Wash trading or artificial inflation of activity</li>
                                                <li>Insider trading based on non-public information</li>
                                                <li>Use of Treasury funds for personal enrichment without DAO approval</li>
                                                <li>Any action intended to circumvent the 1 Soul = 1 Vote principle</li>
                                            </ul>
                                        </div>
                                        <p>Violations may result in Soul freezing, Tree freezing, and legal action.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">9.10 Summary of Tokenomics Rules</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400 uppercase font-mono text-xs">
                                            <li>Tokens provide economic utility, not governance power</li>
                                            <li>Governance remains strictly Soul-based (Core Immutable Provision)</li>
                                            <li>Transparent, DAO-controlled Treasury with strong oversight</li>
                                            <li>Performance-based rewards for real operators</li>
                                            <li>Fixed or capped supply with high barriers to change</li>
                                            <li>Full transparency and regular audits required</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 10 */}
                        <div id="section10" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 10 — COMPLIANCE, LIABILITY & GENERAL PROVISIONS</h2>
                            <div className="space-y-4">
                                <p>This section establishes the compliance framework, liability limitations, and general legal provisions that govern the Wnode Mesh and all participants.</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.1 Regulatory Compliance</h3>
                                        <div className="space-y-2">
                                            <p>The Wnode Mesh and all participants shall comply with applicable laws, including but not limited to:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Anti-Money Laundering (AML) and Know-Your-Customer (KYC) requirements</li>
                                                <li>Data protection laws (including GDPR and equivalent regulations)</li>
                                                <li>Sanctions and export control laws</li>
                                                <li>Consumer protection and financial services regulations</li>
                                            </ul>
                                        </div>
                                        <p>All identity verification, node operation, and financial transactions shall be conducted through approved providers (such as Stripe) and meet or exceed industry standards.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.2 Data Protection and Privacy</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>The Mesh shall process personal data in accordance with applicable privacy laws.</li>
                                            <li>Souls are pseudonymous by default. Personal data is collected only to the extent necessary for verification, compliance, and network security.</li>
                                            <li>Participants acknowledge that certain data (e.g., node performance metrics, transaction history) may be publicly visible or auditable for governance and transparency purposes.</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.3 Limitation of Liability</h3>
                                        <div className="space-y-2">
                                            <p>To the maximum extent permitted by law:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>The DAO, Founder, Founder Board, Governance Board, Steward, Infrastructure Manager, and their respective affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</li>
                                                <li>Participants use the Wnode Mesh at their own risk.</li>
                                                <li>No party shall be liable for any loss of profits, loss of data, or business interruption arising from the use or inability to use the Mesh.</li>
                                                <li>Total liability shall not exceed the amounts paid by the participant to the Mesh in the preceding 12 months (where applicable).</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.4 Indemnification</h3>
                                        <div className="space-y-2">
                                            <p>Each participant (including NODLRs, token holders, and users) agrees to indemnify, defend, and hold harmless the DAO, Founder, Boards, Steward, IM, and their agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Their operation of nodes</li>
                                                <li>Violation of this Constitution</li>
                                                <li>Breach of applicable laws</li>
                                                <li>Misuse of the Mesh or compute resources</li>
                                                <li>Any prohibited workloads or illegal activities</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.5 Risk Acknowledgment</h3>
                                        <div className="space-y-2">
                                            <p>Participants acknowledge the inherent risks of blockchain, DePIN, and decentralised networks, including but not limited to:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Volatility of token value</li>
                                                <li>Technical failures and bugs</li>
                                                <li>Regulatory changes</li>
                                                <li>Cybersecurity threats</li>
                                                <li>Loss of funds or assets</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.6 Governing Law and Dispute Resolution</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>This Constitution is governed by the laws of England & Wales.</li>
                                            <li>Any dispute, controversy, or claim arising out of or in connection with this Constitution (including its formation, validity, or termination) shall be finally settled by arbitration under the LCIA Rules, seated in London, by a single arbitrator (or three if the claim exceeds £1,000,000).</li>
                                            <li>The language of arbitration shall be English.</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.7 Force Majeure</h3>
                                        <p>No party shall be liable for any failure or delay in performance due to circumstances beyond their reasonable control, including acts of God, war, terrorism, pandemics, government orders, or major internet disruptions.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.8 Severability</h3>
                                        <p>If any provision of this Constitution is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.9 Entire Agreement</h3>
                                        <p>This Constitution (including all duly ratified amendments) constitutes the entire agreement between the DAO and its participants regarding its subject matter and supersedes all prior agreements and understandings.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.10 Amendments</h3>
                                        <p>This Constitution may only be amended in accordance with the procedures set out in Section 5. Core Immutable Provisions require heightened protection (95% approval + Founder Board confirmation).</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">10.11 Summary</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400 uppercase font-mono text-xs">
                                            <li>Full regulatory compliance is mandatory</li>
                                            <li>Clear limitation of liability and indemnification</li>
                                            <li>England & Wales law and London arbitration govern disputes</li>
                                            <li>Participants accept the risks inherent in decentralised networks</li>
                                            <li>Strong separation between commercial, technical, and governance layers is maintained</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 11 */}
                        <div id="section11" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 11 — ENFORCEMENT, SANCTIONS, FREEZING & APPEALS</h2>
                            <div className="space-y-4">
                                <p>This section defines the rules for enforcement, sanctions, freezing of assets, revocation of rights, and the due process protections afforded to all participants.</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.1 General Enforcement Authority</h3>
                                        <div className="space-y-2">
                                            <p>The Governance Board, in coordination with the Founder Board and Infrastructure Manager where appropriate, is responsible for enforcing this Constitution. All enforcement actions must be:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Based on documented evidence</li>
                                                <li>Proportionate to the violation</li>
                                                <li>Transparent and auditable</li>
                                                <li>Subject to appeal rights</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.2 Grounds for Sanctions</h3>
                                        <div className="space-y-2">
                                            <p>Sanctions may be applied for:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Fraud or identity misrepresentation</li>
                                                <li>Serious violation of identity verification rules</li>
                                                <li>Malicious behaviour or attacks on the network</li>
                                                <li>Repeated non-compliance with node operation standards</li>
                                                <li>Breach of the Stewardship Licence</li>
                                                <li>Attempted governance capture or manipulation</li>
                                                <li>Regulatory violations or legal non-compliance</li>
                                                <li>Severe misconduct that threatens the Mesh</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.3 Types of Sanctions</h3>
                                        <div className="space-y-2">
                                            <p>The following sanctions may be imposed (individually or in combination):</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Temporary suspension of node operations</li>
                                                <li>Freezing of NODLR Affiliate Tree (Level 1 recruitment)</li>
                                                <li>Freezing of Founder Tree (in the case of the Steward or other parties)</li>
                                                <li>Temporary or permanent revocation of Voting Soul status</li>
                                                <li>Removal from governance roles</li>
                                                <li>Revocation or suspension of the Stewardship Licence</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.4 Soul Freezing or Revocation</h3>
                                        <div className="space-y-2">
                                            <p>A Voting Soul may be frozen or revoked only for cause and following due process. Grounds include:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Proven identity fraud or multiple Souls</li>
                                                <li>Malicious governance behaviour (e.g., coordinated Sybil attacks)</li>
                                                <li>Severe regulatory violations</li>
                                                <li>Conviction of serious criminal offences related to the Mesh</li>
                                            </ul>
                                        </div>
                                        <p>Locked Souls may be frozen but are generally not revoked unless identity fraud is proven.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.5 Tree Freezing</h3>
                                        <p>Freezing of Trees follows the rules in Section 7.6. A Frozen Tree:</p>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>Remains owned by the individual</li>
                                            <li>Continues to receive existing revenue</li>
                                            <li>Loses the right to recruit new Level 1 members</li>
                                            <li>May be unfrozen upon successful appeal or remediation</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.6 Due Process and Notification</h3>
                                        <div className="space-y-2">
                                            <p>Before imposing any sanction (except immediate emergency technical actions by the IM):</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>The affected party must receive written notice stating the grounds and evidence</li>
                                                <li>The party shall have 7 days to respond and submit mitigating evidence</li>
                                                <li>Decisions must be documented and published (pseudonymously where possible)</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.7 Appeal Process</h3>
                                        <p>Any party subject to sanctions has the right to appeal: by email to <span className="text-blue-500 underline">support@wnode.one</span></p>
                                        <ol className="list-decimal pl-5 space-y-1 text-slate-400 font-mono text-xs uppercase">
                                            <li>First appeal: To the Governance Board (within 7 days of notice)</li>
                                            <li>Second appeal: To the Founder Board (within 7 days of Governance Board decision)</li>
                                            <li>Final escalation: Via Emergency Proposal to the full DAO (if the matter is significant)</li>
                                        </ol>
                                        <p>All appeal decisions must be justified in writing and made public.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.8 Reinstatement</h3>
                                        <div className="space-y-2">
                                            <p>A sanctioned NODLR, Soul, or Tree may be reinstated if:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>The cause for sanction has been resolved</li>
                                                <li>The party demonstrates ongoing compliance</li>
                                                <li>The Governance Board (or DAO on appeal) approves reinstatement</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.9 Steward-Specific Sanctions</h3>
                                        <p>Removal of the Steward follows Section 6.9 and automatically results in freezing of their Founder Tree. The decision rests with the Founder Board, subject to the appeal process above.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.10 Transparency and Record Keeping</h3>
                                        <div className="space-y-2">
                                            <p>All sanctions, freezing actions, appeals, and outcomes shall be:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Logged permanently on the platform</li>
                                                <li>Made available to the DAO (with appropriate privacy safeguards)</li>
                                                <li>Reviewed periodically by the Governance Board</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.11 Limitation on Sanctions</h3>
                                        <div className="space-y-2">
                                            <p>No sanction may:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Violate Core Immutable Provisions</li>
                                                <li>Be applied retroactively</li>
                                                <li>Be used to suppress legitimate governance participation</li>
                                                <li>Circumvent the 1 Soul = 1 Vote principle</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">11.12 Summary of Enforcement Rules</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400 uppercase font-mono text-xs">
                                            <li>Sanctions only for documented cause</li>
                                            <li>Full due process and appeal rights guaranteed</li>
                                            <li>Transparency and accountability required</li>
                                            <li>Balance between network protection and individual fairness</li>
                                            <li>Highest protections for Core Immutable Provisions</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 12 */}
                        <div id="section12" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 12 — AMENDMENTS, RATIFICATION & FINAL PROVISIONS</h2>
                            <div className="space-y-4">
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">12.1 Amendment Procedures</h3>
                                        <p>This Constitution may be amended only through the formal governance process defined in Section 5.</p>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>Non-core amendments: Require {">"}87% approval with 40% quorum.</li>
                                            <li>Core Immutable Provisions: Require 100% YES approval with 50% quorum and confirmation by the Founder Board.</li>
                                        </ul>
                                        <p>No amendment may retroactively impair vested commercial rights (such as existing Tree revenue entitlements) without the explicit consent of the affected parties.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">12.2 Core Immutable Provisions</h3>
                                        <div className="space-y-2">
                                            <p>The following are designated as Core Immutable Provisions and enjoy the highest level of protection:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>1 Soul = 1 Vote (one person, one vote)</li>
                                                <li>Soul non-transferability, permanence, and binding to a single human</li>
                                                <li>Separation of governance power (Souls) from economic assets (Tokens and Trees)</li>
                                                <li>Founder’s 3% entitlement to the entire Founder Tree to infinity</li>
                                                <li>Prohibition on token-based governance</li>
                                            </ul>
                                        </div>
                                        <p>These provisions reflect the foundational principles of the Wnode Mesh and may only be changed under the strictest conditions.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">12.3 Ratification</h3>
                                        <div className="space-y-2">
                                            <p>This Constitution v2.1 is ratified by:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>The electronic signature of the Founder (Stephen Soos)</li>
                                                <li>Approval through the initial genesis governance process</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">12.4 Continuity and Transition</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>All existing Souls, Nodes, Trees, and agreements remain valid under this Constitution.</li>
                                            <li>The Founder Board may issue transitional guidelines as needed during the initial implementation period.</li>
                                            <li>Progressive decentralisation mechanisms (including Founder Board seat transitions) shall activate automatically as defined in Section 2.</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">12.5 Interpretation</h3>
                                        <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                            <li>In case of any ambiguity or conflict: The English language version shall prevail.</li>
                                            <li>This Constitution shall be interpreted in a manner that best preserves decentralisation, fairness, transparency, and the protection of Core Immutable Provisions.</li>
                                            <li>The Governance Board may issue official interpretations, subject to DAO review.</li>
                                        </ul>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">12.6 Severability</h3>
                                        <p>If any provision of this Constitution is declared invalid or unenforceable, the remaining provisions shall continue in full force and effect.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">12.7 Waiver</h3>
                                        <p>No waiver of any breach shall constitute a waiver of any subsequent breach of the same or different nature.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">12.8 Entire Agreement</h3>
                                        <p>This Constitution, together with the Stewardship Licence Agreement and publicly referenced technical documents (Whitepaper, Node Rules, etc.), constitutes the entire understanding between the DAO, its participants, and the Founder regarding the governance of the Wnode Mesh.</p>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">12.9 Final Declaration</h3>
                                        <p>This Constitution is adopted with the shared commitment that Wnode shall remain a public good — community-owned, community-governed, decentralised, transparent, and fair — for current and future generations.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SECTION 13 */}
                        <div id="section13" className="scroll-mt-24 space-y-4">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk">SECTION 13 — SOVEREIGNTY AND INFRASTRUCTURE INDEPENDENCE</h2>
                            <div className="space-y-4">
                                <p>Wnode is committed to achieving full operational sovereignty, technological independence, and long-term resilience. To eliminate reliance on external providers and ensure maximum control over its core systems, the Mesh shall own and operate the following critical infrastructure:</p>
                                
                                <div className="space-y-8 pt-4">
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">13.1 Sovereign Physical Infrastructure</h3>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <p className="text-white font-bold">Own and operate its own physical servers</p>
                                                <p className="text-slate-400">The Infrastructure Manager shall maintain and expand Wnode-owned bare-metal server infrastructure as the primary backbone for critical network coordination and verification functions.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-white font-bold">Own and operate its own primary development environment</p>
                                                <p className="text-slate-400">All core protocol development, smart contracts, node software, platform tooling, and testing environments shall be hosted and managed within Wnode’s self-operated development infrastructure.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-white font-bold">Own and operate its own Uninterruptible Power Supply (UPS) and power resilience systems</p>
                                                <p className="text-slate-400">Critical infrastructure shall be protected by Wnode-owned UPS systems and backup power solutions.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-white font-bold">Own and operate its own solar array</p>
                                                <p className="text-slate-400">Wnode shall develop and maintain its own solar power generation capacity to provide clean, independent, and resilient energy to its core infrastructure.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">13.2 Sovereign AI Capability</h3>
                                        <div className="space-y-4">
                                            <p className="text-white font-bold">Own and operate its own recursive AI LLM</p>
                                            <p>Wnode shall own and operate its own proprietary recursive Large Language Model (LLM). This sovereign AI system will be designed to:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Intelligently route jobs across the global compute mesh with superior insights, speed, and efficiency</li>
                                                <li>Continuously learn and improve from network data and operational outcomes</li>
                                                <li>Rapidly take over and enhance customer support functions</li>
                                                <li>Assist with core development, debugging, and protocol optimization</li>
                                                <li>Provide autonomous operational intelligence to the Infrastructure Manager and Steward</li>
                                            </ul>
                                            <p>The development, training, hosting, and governance of this recursive AI shall remain under the full control of Wnode’s sovereign infrastructure and be subject to oversight by the Infrastructure Manager and Governance Board.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">13.3 Purpose of Sovereignty Measures</h3>
                                        <p>These sovereignty principles ensure total infrastructure and technological independence. While the broader Wnode Mesh remains a decentralised network of community-operated nodes, the core coordination layer, development environment, power systems, and AI capabilities shall be protected through self-owned and self-operated infrastructure.</p>
                                        <div className="space-y-2">
                                            <p>This approach delivers:</p>
                                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                                <li>Maximum resistance to censorship, deplatforming, or external service termination</li>
                                                <li>Enhanced security, performance, and operational control</li>
                                                <li>True energy and technological sovereignty</li>
                                                <li>Accelerated innovation through recursive AI capabilities</li>
                                                <li>Long-term alignment with the principles of decentralisation and self-reliance</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-lg font-bold text-white uppercase tracking-tight">13.4 Reporting and Transparency</h3>
                                        <p>The Infrastructure Manager shall provide regular reports to the Governance Board and the DAO on the status, capacity, security, and expansion of all sovereign infrastructure and AI systems.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-white/5" />

                        {/* SIGNATURE */}
                        <div className="pt-12 space-y-8 text-center border-t border-white/20">
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-widest text-slate-500">Ratified and Signed</p>
                                <h3 className="text-2xl font-bold text-white font-space-grotesk uppercase">Stephen Soos</h3>
                                <div className="text-[10px] uppercase tracking-[0.2em] space-y-1 text-slate-500">
                                    <p>Founder • Architect • Initial Steward • Initial Governance Board Member</p>
                                    <p className="text-blue-500 font-bold">WUID: 1000001-0426-01-AA</p>
                                    <p>Date: May 13th 2026</p>
                                </div>
                            </div>
                            <div className="p-8 border border-white/5 bg-white/[0.01] rounded-sm max-w-xl mx-auto">
                                <p className="text-[9px] text-slate-600 leading-relaxed uppercase tracking-widest font-black">
                                    Notice: This web version is a formal rendering of the Wnode Constitution v2.1. In case of any textual discrepancy, the official signed PDF version remains the final authority.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
