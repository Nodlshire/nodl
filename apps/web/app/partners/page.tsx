"use client";

import React, { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import ContactModal from "../../components/landing/ContactModal";

export default function PartnersPage() {
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    const partnerOrgSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Wnode OEM & Device Partner Program",
        "url": "https://wnode.one/partners",
        "description": "Exclusive 1-partner-per-sector OEM integration program enabling hardware manufacturers (Smart TV, EV, PC OEMs, IoT) to monetize idle device silicon.",
        "parentOrganization": {
            "@type": "Organization",
            "name": "Wnode Technologies",
            "url": "https://wnode.one"
        }
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How does Wnode work with hardware OEMs and device manufacturers?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode provides a lightweight, pre-compiled daemon (nodld) that OEMs pre-install or push via firmware updates to monetize dormant compute silicon on Smart TVs, PCs, EVs, and IoT gateways."
                }
            },
            {
                "@type": "Question",
                "name": "What is the 1-partner-per-sector rule?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Wnode selects only one exclusive partner per industry sector (1 Smart TV maker, 1 EV maker, 1 PC OEM, 1 IoT network). Once selected, that sector is permanently closed."
                }
            }
        ]
    };

    return (
        <AppLayout>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(partnerOrgSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <ContactModal 
                isOpen={isContactModalOpen} 
                onClose={() => setIsContactModalOpen(false)} 
                title="New Partner Enquiry"
                hideInquiryType={true}
                requirePhone={true}
            />
            <div className="relative pt-40 pb-24 px-8 bg-black min-h-screen selection:bg-blue-500/30">
                {/* Logo and Brand */}
                <div className="absolute top-12 left-12 flex items-center gap-4 z-20">
                    <img src="/logo.png" alt="wnode" className="w-10 h-10" />
                    <span className="font-space-grotesk text-2xl tracking-tighter font-bold text-white uppercase">wnode</span>
                </div>

                <div className="max-w-6xl mx-auto">
                    <div className="fade-in-section mb-16">
                        <h1 className="text-5xl md:text-7xl font-bold text-white uppercase tracking-tighter mb-8 font-space-grotesk">
                            Wnode Partner Ecosystem
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed">
                            Transform every device you ship into a sovereign compute asset.
                        </p>
                    </div>

                    {/* Hero Graphic / In-Canon Visual */}
                    <section className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#09090b]/80 p-4 mb-20 shadow-[0_0_50px_rgba(59,130,246,0.15)] text-center">
                        <img
                            src="/diagrams/integrations-architecture-constitutional-layers.png"
                            alt="Wnode Integration Substrate & OEM Architecture Layers"
                            className="w-full h-auto max-h-[480px] object-contain mx-auto rounded-2xl bg-black/60 p-2"
                        />
                    </section>

                    <div className="space-y-24">
                        {/* SECTION: Introduction */}
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-10">Introduction</h2>
                            <div className="max-w-3xl space-y-8">
                                <p className="text-xl md:text-2xl text-white leading-relaxed font-light">
                                    Wnode enables the world’s leading device manufacturers to unlock a new economic layer. A passive, perpetual compute revenue from every device they ship with zero hardware changes.
                                </p>
                                <div className="space-y-4">
                                    <p className="text-slate-400 text-lg uppercase tracking-widest font-medium">Wnode invites only one partner per sector:</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white text-lg">
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 Smart TV manufacturer</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 EV manufacturer</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 IoT network</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 smartphone maker</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 robotics company</li>
                                        <li className="flex items-center gap-3"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> 1 computer OEM</li>
                                    </ul>
                                </div>
                                <p className="text-slate-500 italic text-lg pt-4 border-t border-white/5">
                                    Once selected, the sector is permanently closed.
                                </p>
                            </div>
                        </section>

                        {/* SECTION: CTA */}
                        <section className="border-t border-white/10 pt-12 text-center">
                            <button
                                onClick={() => setIsContactModalOpen(true)}
                                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold uppercase tracking-wider text-sm px-10 py-5 rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all"
                            >
                                Apply for Exclusive Sector Partnership &rarr;
                            </button>
                        </section>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
