"use client";

import { useState } from "react";
import AppLayout from "../../../components/layout/AppLayout";

export default function SpaceMesh() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        inquiryTypes: ["Space Mesh Partner"]
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error("Submission error:", err);
            setStatus("error");
        }
    };

    const sections = [
        {
            title: "Why Space Mesh Matters",
            content: "The world is reaching the limits of traditional datacentres. They consume vast amounts of energy, water, and land, while producing significant e-waste. At the same time, the planet is already filled with deployed compute. From EV/cars to robotics to IoT fleets to satellites, most of which sits idle. Space Mesh activates this unused capacity without building new datacentres or manufacturing new hardware.",
            borderColor: "border-blue-500/50",
            iconColor: "text-blue-500",
            icon: (
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Satellites as Compute Nodes",
            content: "Modern satellites carry capable onboard compute: ARM and RISC-V processors, radiation-hardened Linux, AI accelerators, high-bandwidth communications, and solar-powered uptime. Outside mission tasks, this compute remains unused. Space Mesh enables satellites to run secure, containerized micro-workloads during non-mission windows, turning orbital assets into revenue-generating nodes that support global M2M activity.",
            borderColor: "border-purple-500/50",
            iconColor: "text-purple-500",
            icon: (
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            )
        },
        {
            title: "A Global M2M Backbone",
            content: "Space Mesh provides worldwide micro-transaction routing, orbital redundancy for autonomous systems, and low-latency coordination for robots, drones, and vehicles. With Polygon delivering 5,000 TPS and 1.5-second finality, the world finally has a settlement layer fast enough for autonomous machines. Space Mesh supplies the matching compute and routing layer in orbit.",
            borderColor: "border-emerald-500/50",
            iconColor: "text-emerald-500",
            icon: (
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            title: "New Revenue for Satellite Operators",
            content: "Space Mesh gives satellite operators a second mission and a second business model. Idle onboard compute becomes a continuous revenue stream. Operators increase ROI on existing constellations, differentiate in the market, and unlock a new category of orbital compute services, all powered by sunlight and deployed globally.",
            borderColor: "border-amber-500/50",
            iconColor: "text-amber-500",
            icon: (
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Strengthening Every Integration",
            content: "Every ecosystem connected to Wnode benefits from Space Mesh. Storage proofs validated from orbit. Oracle networks with global redundancy. Cross-chain messaging with orbital fallback. M2M payments with worldwide routing. AI inference with orbital edge compute. DePIN networks with 24/7 global coverage. Space Mesh elevates every integration into a space-grade service.",
            borderColor: "border-rose-500/50",
            iconColor: "text-rose-500",
            icon: (
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            )
        },
        {
            title: "Aligned With the Anti-Datacentre Movement",
            content: "Space Mesh is a direct response to rising concerns around hyperscale datacentres. It requires no water, no land, no new CO2 emissions, no new hardware manufacturing, and produces no e-waste. It is the first environmentally neutral compute tier — a sustainable alternative to the datacentre-heavy future the world is trying to avoid.",
            borderColor: "border-cyan-500/50",
            iconColor: "text-cyan-500",
            icon: (
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            title: "Technical Readiness",
            content: "Wnode’s architecture is already approximately 80% compatible with modern satellite systems: ARM-native, Linux-native, container-native, low-power, secure, modular, and mission-safe. A Satellite Edition Node Operator requires only minor optimization, deterministic execution, sandboxing, signed containers, and operator-controlled deployment. This adaptation will be developed jointly with the satellite operator and deployed through standard uplink procedures.",
            borderColor: "border-fuchsia-500/50",
            iconColor: "text-fuchsia-500",
            icon: (
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
            )
        },
        {
            title: "A New Class of Infrastructure",
            content: "Space Mesh introduces a new category of planetary infrastructure: the first orbital compute network, the first space-based M2M settlement layer, the first sovereign compute fabric spanning Earth and orbit, the first environmentally neutral compute tier, and the first global MachineFi backbone.",
            borderColor: "border-lime-500/50",
            iconColor: "text-lime-500",
            icon: (
                <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
            )
        }
    ];

    return (
        <AppLayout>
            <div className="pt-32 pb-20">
                <div className="max-w-5xl mx-auto px-8 flex flex-col items-center">
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-12 text-center leading-tight">
                        Space Mesh — The Orbital Compute Layer
                    </h1>
                    
                    <p className="text-lg text-slate-400 leading-relaxed mb-12 text-center max-w-3xl">
                        Space Mesh extends Wnode beyond Earth, creating a sovereign compute fabric that spans terrestrial devices and orbital infrastructure. It transforms satellites into active participants in the global machine-to-machine economy, enabling a sustainable, distributed, and revenue-generating compute mesh.
                    </p>

                    <div className="mb-16 w-full max-w-4xl relative group">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <img 
                            src="/spacemesh.png" 
                            alt="Space Mesh Visualization" 
                            className="w-full h-auto rounded-2xl border border-white/10 shadow-2xl relative z-10"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                        {sections.map((section, index) => (
                            <section 
                                key={index}
                                className={`bg-black/50 border ${section.borderColor} p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300`}
                            >
                                <div className={`flex items-center gap-4 ${section.iconColor}`}>
                                    {section.icon}
                                    <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">
                                        {section.title}
                                    </h2>
                                </div>
                                <p className="text-base text-slate-400 leading-relaxed">
                                    {section.content}
                                </p>
                            </section>
                        ))}
                    </div>

                    <section className="bg-black/50 border border-indigo-500/50 p-10 rounded-2xl flex flex-col items-center text-center gap-6 hover:bg-white/[0.02] transition-colors duration-300 w-full max-w-3xl mt-8">
                        <div className="flex items-center gap-4 text-indigo-500">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <h2 className="text-2xl font-bold uppercase tracking-wider text-white m-0">
                                Partner With Us
                            </h2>
                        </div>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Wnode has built the technology. Space Mesh is ready. The integrations are ready. The business case is clear. We are now seeking a forward-thinking satellite operator or constellation owner to help create the world’s first orbital compute mesh.
                        </p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-colors duration-300 shadow-lg shadow-indigo-500/20 mt-4"
                        >
                            Partner with us
                        </button>
                    </section>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 overflow-y-auto">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)} />
                    <div className="relative w-full max-w-2xl bg-black/95 border border-white/25 rounded-[2.5rem] p-10 md:p-14 shadow-2xl animate-in fade-in zoom-in-95 duration-300 my-auto text-left">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {status === "success" ? (
                            <div className="text-center py-8">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 text-blue-500 mb-8">
                                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">Message Sent</h2>
                                <p className="text-xl text-slate-400 mb-8 leading-relaxed">Thank you for your interest. Stephen will review your inquiry and be in touch soon.</p>
                                <button onClick={() => setIsModalOpen(false)} className="bg-white text-black hover:bg-slate-200 px-12 py-4 rounded-full font-bold uppercase tracking-widest transition-colors">Close</button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-4xl font-bold text-white mb-4 tracking-tight uppercase">Partner With Wnode</h2>
                                <p className="text-lg text-slate-400 mb-2 leading-relaxed">
                                    If you represent a satellite operator, constellation owner, aerospace company, or innovation program and would like to discuss Space Mesh or partnership opportunities, please reach out directly. All inquiries are reviewed personally.
                                </p>
                                <p className="text-md text-blue-400 mb-10 font-bold">
                                    stephen@wnode.one
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-300 uppercase ml-2">First Name *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="John"
                                                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                                                value={formData.firstName}
                                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-300 uppercase ml-2">Last Name *</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Doe"
                                                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                                                value={formData.lastName}
                                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase ml-2">Email Address *</label>
                                        <input
                                            required
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-300 uppercase ml-2">Message *</label>
                                        <textarea
                                            required
                                            placeholder="How can we help you?"
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-colors resize-none placeholder:text-slate-600"
                                            value={formData.message}
                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={status === "submitting"}
                                        className="w-full bg-white text-black hover:bg-slate-200 py-5 rounded-2xl text-xl font-bold uppercase tracking-tight disabled:opacity-50 transition-colors mt-2"
                                    >
                                        {status === "submitting" ? "Transmitting..." : "Send Message"}
                                    </button>

                                    {status === "error" && (
                                        <p className="text-red-500 text-sm text-center font-bold uppercase animate-pulse">Transmission Failed. Please retry.</p>
                                    )}
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
