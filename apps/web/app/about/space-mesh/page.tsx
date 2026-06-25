"use client";

import { useState } from "react";
import AppLayout from "../../../components/layout/AppLayout";

const DiagramOrbitalNode = () => (
    <svg viewBox="0 0 800 400" className="w-full h-auto rounded-xl border border-white/10 bg-black/50 p-4 my-8 shadow-2xl" stroke="currentColor" fill="none">
        {/* Orbital Compute Node Architecture */}
        <rect x="50" y="50" width="700" height="300" rx="10" strokeWidth="2" className="text-slate-600" strokeDasharray="5,5" />
        <text x="70" y="80" className="text-sm font-mono text-slate-400" fill="currentColor" stroke="none">SATELLITE BUS</text>
        
        {/* CPU/GPU */}
        <rect x="100" y="120" width="200" height="80" rx="4" strokeWidth="2" className="text-blue-500" />
        <text x="120" y="150" className="text-sm font-bold text-blue-400" fill="currentColor" stroke="none">Satellite with onboard CPU/GPU</text>
        <text x="120" y="170" className="text-xs text-blue-300" fill="currentColor" stroke="none">Hardware Layer</text>

        {/* Sandbox */}
        <rect x="400" y="100" width="300" height="120" rx="4" strokeWidth="2" className="text-emerald-500" />
        <text x="420" y="130" className="text-sm font-bold text-emerald-400" fill="currentColor" stroke="none">Containerized sandbox</text>
        <text x="420" y="155" className="text-xs text-emerald-300" fill="currentColor" stroke="none">RAM-only execution</text>
        <text x="420" y="175" className="text-xs text-emerald-300" fill="currentColor" stroke="none">Resource throttling</text>
        <rect x="420" y="185" width="260" height="20" rx="2" strokeWidth="1" className="text-emerald-600" strokeDasharray="2,2"/>
        
        <path d="M300 160 L400 160" strokeWidth="2" markerEnd="url(#arrow)" className="text-slate-500" />
        
        {/* GNC */}
        <rect x="100" y="240" width="600" height="80" rx="4" strokeWidth="2" className="text-red-500" />
        <text x="120" y="285" className="text-sm font-bold text-red-400" fill="currentColor" stroke="none">No access to GNC systems</text>
        
        {/* Barrier */}
        <path d="M100 220 L700 220" strokeWidth="4" className="text-red-600" strokeDasharray="10,10" />
        
        <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
        </defs>
    </svg>
);

const DiagramMeshSharding = () => (
    <svg viewBox="0 0 800 400" className="w-full h-auto rounded-xl border border-white/10 bg-black/50 p-4 my-8 shadow-2xl" stroke="currentColor" fill="none">
        {/* Mesh Sharding and Routing Flow */}
        <circle cx="100" cy="200" r="40" strokeWidth="2" className="text-purple-500" />
        <text x="85" y="205" className="text-sm font-bold text-purple-400" fill="currentColor" stroke="none">Job</text>

        <path d="M140 200 L200 200" strokeWidth="2" markerEnd="url(#arrow)" className="text-slate-500" />
        
        <rect x="200" y="160" width="120" height="80" rx="4" strokeWidth="2" className="text-blue-500" />
        <text x="215" y="195" className="text-sm font-bold text-blue-400" fill="currentColor" stroke="none">shards</text>
        <text x="215" y="215" className="text-xs text-blue-300" fill="currentColor" stroke="none">optimal region</text>
        <text x="215" y="230" className="text-xs text-blue-300" fill="currentColor" stroke="none">selection</text>

        <path d="M320 180 L400 120" strokeWidth="2" markerEnd="url(#arrow)" className="text-slate-500" />
        <path d="M320 220 L400 280" strokeWidth="2" markerEnd="url(#arrow)" className="text-slate-500" />

        {/* Terrestrial */}
        <rect x="400" y="80" width="160" height="80" rx="4" strokeWidth="2" className="text-emerald-500" />
        <text x="420" y="125" className="text-sm font-bold text-emerald-400" fill="currentColor" stroke="none">Terrestrial nodes</text>

        {/* Orbital */}
        <rect x="400" y="240" width="160" height="80" rx="4" strokeWidth="2" className="text-cyan-500" />
        <text x="420" y="285" className="text-sm font-bold text-cyan-400" fill="currentColor" stroke="none">Orbital nodes</text>

        <path d="M560 120 L640 180" strokeWidth="2" markerEnd="url(#arrow)" className="text-slate-500" />
        <path d="M560 280 L640 220" strokeWidth="2" markerEnd="url(#arrow)" className="text-slate-500" />

        {/* Recombination */}
        <rect x="640" y="160" width="140" height="80" rx="4" strokeWidth="2" className="text-amber-500" />
        <text x="650" y="195" className="text-sm font-bold text-amber-400" fill="currentColor" stroke="none">Deterministic</text>
        <text x="650" y="215" className="text-sm font-bold text-amber-400" fill="currentColor" stroke="none">recombination</text>
    </svg>
);

const DiagramEconomicModel = () => (
    <svg viewBox="0 0 800 400" className="w-full h-auto rounded-xl border border-white/10 bg-black/50 p-4 my-8 shadow-2xl" stroke="currentColor" fill="none">
        {/* Economic Model Diagram */}
        <rect x="100" y="80" width="300" height="240" rx="4" strokeWidth="2" className="text-slate-600" />
        
        {/* Pie/Split */}
        <rect x="120" y="100" width="260" height="150" rx="4" fill="currentColor" className="text-emerald-900/20 border-none" stroke="none" />
        <rect x="120" y="100" width="260" height="120" fill="currentColor" className="text-emerald-500/10" stroke="none" />
        <path d="M120 220 L380 220" strokeWidth="2" className="text-emerald-600" />
        <text x="140" y="160" className="text-2xl font-bold text-emerald-400" fill="currentColor" stroke="none">80% operator</text>
        <text x="140" y="240" className="text-xl font-bold text-blue-400" fill="currentColor" stroke="none">20% Wnode</text>

        <path d="M400 200 L500 200" strokeWidth="2" markerEnd="url(#arrow)" className="text-slate-500" />

        <rect x="500" y="100" width="220" height="80" rx="4" strokeWidth="2" className="text-yellow-500" />
        <text x="520" y="135" className="text-sm font-bold text-yellow-400" fill="currentColor" stroke="none">Solar power +</text>
        <text x="520" y="155" className="text-sm font-bold text-yellow-400" fill="currentColor" stroke="none">passive cooling</text>

        <rect x="500" y="200" width="220" height="80" rx="4" strokeWidth="2" className="text-cyan-500" />
        <text x="520" y="245" className="text-sm font-bold text-cyan-400" fill="currentColor" stroke="none">Near-zero</text>
        <text x="520" y="265" className="text-sm font-bold text-cyan-400" fill="currentColor" stroke="none">marginal cost</text>
    </svg>
);

const DiagramSovereignRouting = () => (
    <svg viewBox="0 0 800 400" className="w-full h-auto rounded-xl border border-white/10 bg-black/50 p-4 my-8 shadow-2xl" stroke="currentColor" fill="none">
        {/* Sovereign Routing Model */}
        {/* Jurisdictional boundaries */}
        <rect x="100" y="50" width="600" height="300" rx="10" strokeWidth="2" className="text-slate-700" strokeDasharray="8,8" />
        <path d="M400 50 L400 350" strokeWidth="2" className="text-slate-700" strokeDasharray="8,8" />
        <path d="M100 200 L700 200" strokeWidth="2" className="text-slate-700" strokeDasharray="8,8" />
        <text x="120" y="80" className="text-xs text-slate-500" fill="currentColor" stroke="none">Jurisdictional boundaries</text>

        {/* Nodes */}
        <circle cx="200" cy="120" r="30" strokeWidth="2" className="text-blue-500 bg-slate-900" />
        <circle cx="600" cy="120" r="30" strokeWidth="2" className="text-blue-500" />
        <circle cx="250" cy="280" r="30" strokeWidth="2" className="text-emerald-500" />
        <circle cx="550" cy="280" r="30" strokeWidth="2" className="text-emerald-500" />

        {/* Deterministic routing & Verifiable compute */}
        <path d="M230 120 L570 120" strokeWidth="2" markerEnd="url(#arrow)" className="text-cyan-500" />
        <text x="320" y="110" className="text-xs font-bold text-cyan-400" fill="currentColor" stroke="none">Deterministic routing</text>

        <path d="M250 150 L250 250" strokeWidth="2" markerEnd="url(#arrow)" className="text-emerald-500" />
        <text x="130" y="200" className="text-xs font-bold text-emerald-400" fill="currentColor" stroke="none">Verifiable compute</text>
        
        <path d="M600 150 L560 250" strokeWidth="2" markerEnd="url(#arrow)" className="text-emerald-500" />
        <path d="M280 280 L520 280" strokeWidth="2" markerEnd="url(#arrow)" className="text-cyan-500" />
    </svg>
);

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

    return (
        <AppLayout>
            <div className="pt-32 pb-20">
                <div className="max-w-5xl mx-auto px-8 flex flex-col items-center">
                    
                    <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-widest mb-12 text-center leading-tight text-white">
                        Space Mesh — The Orbital Compute Layer
                    </h1>
                    
                    <p className="text-lg text-slate-400 leading-relaxed mb-12 text-center max-w-3xl">
                        Space Mesh extends Wnode beyond Earth, forming a sovereign compute fabric that unifies terrestrial devices and orbital infrastructure.
                        <br/><br/>
                        It enables satellites to operate as secure, containerized compute nodes during non-mission windows, creating a new, environmentally neutral compute tier.
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
                        <section className="bg-black/50 border border-blue-500/50 p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">Why Space Mesh Exists</h2>
                            <p className="text-base text-slate-400 leading-relaxed">
                                Terrestrial datacentres face increasing constraints: energy consumption, water usage, land requirements, and carbon cost.
                                <br/><br/>
                                At the same time, the world already contains significant idle compute capacity — including onboard processors in modern satellites.
                                <br/><br/>
                                Space Mesh activates this idle orbital compute without requiring new hardware or datacentre construction.
                            </p>
                        </section>

                        <section className="bg-black/50 border border-purple-500/50 p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">Satellites as Compute Nodes</h2>
                            <p className="text-base text-slate-400 leading-relaxed">
                                Modern satellites include ARM or RISC-V processors, radiation-hardened Linux environments, and in some cases AI accelerators.
                                <br/><br/>
                                Space Mesh converts this existing onboard compute into a secure, sandboxed execution environment for micro-workloads.
                                <br/><br/>
                                All workloads run in isolated containers with strict resource throttling and zero access to guidance, navigation, or control systems.
                            </p>
                        </section>
                    </div>
                    
                    <div className="w-full max-w-4xl mb-12">
                        <DiagramOrbitalNode />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                        <section className="bg-black/50 border border-emerald-500/50 p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">Global Machine-to-Machine Backbone</h2>
                            <p className="text-base text-slate-400 leading-relaxed">
                                Space Mesh provides a global compute and routing layer for autonomous systems, IoT fleets, and machine-to-machine applications.
                                <br/><br/>
                                With Polygon providing 5,000 TPS and ~1.5 second finality, the settlement layer is already in place.
                                <br/><br/>
                                Space Mesh supplies the complementary orbital compute layer for global coordination and redundancy.
                            </p>
                        </section>

                        <section className="bg-black/50 border border-amber-500/50 p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">Revenue Model for Satellite Operators</h2>
                            <p className="text-base text-slate-400 leading-relaxed">
                                Space Mesh provides a second mission and a second revenue stream for satellite operators.
                                <br/><br/>
                                Idle onboard compute is monetized through Wnode’s orchestration layer.
                                <br/><br/>
                                Operators receive 80% of all workload revenue.
                                <br/><br/>
                                Wnode retains 20% for orchestration, verification, and routing.
                                <br/><br/>
                                This model requires no new hardware and no changes to existing mission profiles.
                            </p>
                        </section>
                    </div>

                    <div className="w-full max-w-4xl mb-12">
                        <DiagramMeshSharding />
                    </div>
                    <div className="w-full max-w-4xl mb-12">
                        <DiagramEconomicModel />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                        <section className="bg-black/50 border border-rose-500/50 p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">Integration Benefits for All Ecosystem Partners</h2>
                            <p className="text-base text-slate-400 leading-relaxed mb-2">
                                Space Mesh strengthens every integration with Wnode:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                <li>Storage proofs validated from orbit</li>
                                <li>Oracle networks with orbital redundancy</li>
                                <li>Cross-chain messaging with orbital fallback</li>
                                <li>AI inference executed in orbit</li>
                                <li>M2M payments routed globally</li>
                                <li>DePIN networks with continuous coverage</li>
                            </ul>
                        </section>

                        <section className="bg-black/50 border border-cyan-500/50 p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">Technical Readiness — 95%</h2>
                            <p className="text-base text-slate-400 leading-relaxed">
                                Wnode’s Satellite Edition Node Operator is 95% compatible with modern satellite systems.
                                <br/><br/>
                                Compatibility includes: ARM-native execution, Linux-native runtime, containerization, low-power operation, deterministic execution, and RAM-only stateless compute.
                                <br/><br/>
                                The remaining 5% consists of operator-specific alignment work: resource throttling parameters, telemetry validation, uplink packaging, and sandbox configuration.
                                <br/><br/>
                                Deployment is performed through standard operator-controlled uplink procedures.
                            </p>
                        </section>
                    </div>

                    <section className="bg-black/50 border border-slate-700/50 p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300 w-full mb-8">
                        <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">Economic Architecture</h2>
                        <p className="text-base text-slate-400 leading-relaxed">
                            Space Mesh workloads are priced approximately 50% below terrestrial hyperscaler rates.
                            Operators receive 80% of revenue.
                            This is possible because orbital compute avoids terrestrial OpEx:
                        </p>
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-700">
                                        <th className="py-3 px-4 font-bold text-white">Cost Component</th>
                                        <th className="py-3 px-4 font-bold text-white">Terrestrial Cloud</th>
                                        <th className="py-3 px-4 font-bold text-white">Orbital Compute</th>
                                    </tr>
                                </thead>
                                <tbody className="text-slate-400">
                                    <tr className="border-b border-slate-800">
                                        <td className="py-3 px-4">Power Cost</td>
                                        <td className="py-3 px-4">$0.040–$0.100/kWh</td>
                                        <td className="py-3 px-4">~ $0.002/kWh (solar-derived)</td>
                                    </tr>
                                    <tr className="border-b border-slate-800">
                                        <td className="py-3 px-4">Cooling</td>
                                        <td className="py-3 px-4">Active HVAC + water</td>
                                        <td className="py-3 px-4">Passive radiative cooling</td>
                                    </tr>
                                    <tr className="border-b border-slate-800">
                                        <td className="py-3 px-4">Real Estate</td>
                                        <td className="py-3 px-4">Land + tax + zoning</td>
                                        <td className="py-3 px-4">None</td>
                                    </tr>
                                    <tr className="border-b border-slate-800">
                                        <td className="py-3 px-4">Marginal Compute Cost</td>
                                        <td className="py-3 px-4">High</td>
                                        <td className="py-3 px-4">Near-zero</td>
                                    </tr>
                                    <tr className="border-b border-slate-800">
                                        <td className="py-3 px-4">Revenue Flow</td>
                                        <td className="py-3 px-4">Cloud retains all</td>
                                        <td className="py-3 px-4">80% to operator</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
                        <section className="bg-black/50 border border-indigo-500/50 p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">Security and Verification</h2>
                            <p className="text-base text-slate-400 leading-relaxed mb-2">
                                Space Mesh provides defense-grade isolation and verifiable execution:
                            </p>
                            <ul className="list-disc pl-5 space-y-1 text-slate-400">
                                <li>RAM-only, stateless compute</li>
                                <li>Cryptographic attestation</li>
                                <li>Deterministic verification</li>
                                <li>Sovereign routing</li>
                                <li>Physical isolation in LEO</li>
                            </ul>
                        </section>

                        <section className="bg-black/50 border border-fuchsia-500/50 p-8 rounded-2xl flex flex-col gap-4 hover:bg-white/[0.02] transition-colors duration-300">
                            <h2 className="text-xl font-bold uppercase tracking-wider text-white m-0">A New Class of Infrastructure</h2>
                            <p className="text-base text-slate-400 leading-relaxed">
                                Space Mesh forms the first orbital compute layer, the first sovereign MachineFi backbone, and the first environmentally neutral compute tier.
                                <br/><br/>
                                It unifies terrestrial edge networks with orbital compute into a single distributed fabric.
                            </p>
                        </section>
                    </div>

                    <div className="w-full max-w-4xl mb-12">
                        <DiagramSovereignRouting />
                    </div>

                    <section className="bg-black/50 border border-blue-500/50 p-10 rounded-2xl flex flex-col items-center text-center gap-6 hover:bg-white/[0.02] transition-colors duration-300 w-full max-w-3xl mt-8">
                        <h2 className="text-2xl font-bold uppercase tracking-wider text-white m-0">
                            Partner With Us
                        </h2>
                        <p className="text-lg text-slate-400 leading-relaxed">
                            Wnode is seeking satellite operators and constellation owners to join the Space Mesh network.
                            All partnerships follow standard SLA, sandbox validation, and operator-controlled deployment.
                        </p>
                        
                        <div className="flex flex-col items-center gap-3 mt-4">
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest transition-colors duration-300 shadow-lg shadow-blue-500/20"
                            >
                                Discuss Integration
                            </button>
                            <span className="text-sm text-slate-500">
                                For satellite operators, constellation owners, and aerospace partners.
                            </span>
                        </div>
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
