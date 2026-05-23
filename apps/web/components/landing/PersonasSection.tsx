"use client";

import { ModalMode } from "./CTAModal";

interface PersonasSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

const Icons = {
    Cpu: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>
    ),
    User: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
    ),
    Users: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    ),
    Zap: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    ),
    Shield: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
    ),
    Award: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>
    ),
    Terminal: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
    ),
    Beaker: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 3h15"></path><path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"></path><path d="M6 14h12"></path></svg>
    ),
    Megaphone: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 13v-2Z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>
    ),
    Server: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>
    )
};

export default function PersonasSection({ onOpenModal }: PersonasSectionProps) {
    const personas = [
        {
            title: "Developers",
            description: "Deploy to a mesh that respects your autonomy. Low latency, high uptime, zero storage.",
            cta: "Become a Beta Developer",
            mode: "developer" as ModalMode,
            icon: Icons.Terminal,
            borderColor: "border-blue-500/50",
            iconColor: "text-blue-500"
        },
        {
            title: "Beta Testers",
            description: "Join the Sovereign Beta. Be the first to operate nodes and shape the protocol's future.",
            cta: "Join the Beta",
            mode: "beta_tester" as ModalMode,
            icon: Icons.Beaker,
            borderColor: "border-purple-500/50",
            iconColor: "text-purple-500"
        },
        {
            title: "Evangelists",
            description: "Help build the wnode movement. Spread the vision of decentralized compute sovereignty.",
            cta: "Join as Evangelist",
            mode: "waitlist" as ModalMode,
            icon: Icons.Megaphone,
            borderColor: "border-amber-500/50",
            iconColor: "text-amber-500"
        },
        {
            title: "Node Owners",
            description: "Secure your place in the future of the compute economy. Institutional-grade vision.",
            cta: "Join Node Waitlist",
            mode: "investor" as ModalMode,
            icon: Icons.Server,
            borderColor: "border-fuchsia-500/50",
            iconColor: "text-fuchsia-500"
        }
    ];

    return (
        <section className="py-32 bg-black border-t border-white/15">
            <div className="max-w-7xl mx-auto px-8">
                {/* Wenode Economic Constitution Section */}
                <div className="mb-40 p-12 border border-white/25 bg-white/[0.02] rounded-[2.5rem] space-y-10 max-w-5xl mx-auto backdrop-blur-3xl shadow-2xl">
                    <h3 className="text-2xl font-bold uppercase tracking-[0.3em] text-blue-500 border-b border-white/25 pb-8 text-center">Wenode Economic Constitution</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-10">
                        {/* Column 1 */}
                        <div className="space-y-10">
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-blue-500 opacity-80"><Icons.Cpu /></span>
                                    <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Compute Node</span>
                                </div>
                                <span className="text-3xl font-bold text-white font-space-grotesk">70%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-purple-500 opacity-80"><Icons.User /></span>
                                    <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Level 1 Affiliate</span>
                                </div>
                                <span className="text-3xl font-bold text-white font-space-grotesk">3%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-pink-500 opacity-80"><Icons.Users /></span>
                                    <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Level 2 Affiliate</span>
                                </div>
                                <span className="text-3xl font-bold text-white font-space-grotesk">7%</span>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-10">
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-amber-500 opacity-80"><Icons.Zap /></span>
                                    <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Sales Source</span>
                                </div>
                                <span className="text-3xl font-bold text-white font-space-grotesk">10%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-teal-500 opacity-80"><Icons.Shield /></span>
                                    <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Management Licensee</span>
                                </div>
                                <span className="text-3xl font-bold text-white font-space-grotesk">7%</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-indigo-500 opacity-80"><Icons.Award /></span>
                                    <span className="text-white/60 uppercase tracking-[0.2em] text-xs font-bold">Founder Affiliate Bonus</span>
                                </div>
                                <span className="text-3xl font-bold text-white font-space-grotesk">3%</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] pt-6 text-center leading-relaxed max-w-2xl mx-auto">
                        Note: All allocations are hard-coded into the protocol's deterministic ledger engine to ensure zero leakage and constitutional integrity.
                    </p>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white uppercase tracking-tighter mb-20 font-space-grotesk text-center">
                    Join Wenode.
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {personas.map((p, i) => (
                        <div key={i} className={`fade-in-section p-12 border ${p.borderColor} rounded-[10px] bg-white/[0.01] flex flex-col justify-between hover:bg-white/[0.02] transition-all`}>
                            <div>
                                <div className="flex items-center gap-4 mb-6">
                                    <span className={p.iconColor}><p.icon /></span>
                                    <h3 className="text-3xl font-bold text-white uppercase tracking-tight font-space-grotesk">{p.title}</h3>
                                </div>
                                <p className="text-xl text-slate-400 mb-10 leading-relaxed">{p.description}</p>
                            </div>
                            <button 
                                onClick={() => onOpenModal(p.mode)}
                                className={`w-full font-bold py-5 uppercase tracking-widest transition-all ${
                                    p.mode === "investor" 
                                    ? "bg-purple-600 hover:bg-purple-500 text-white shadow-[0_0_40px_rgba(168,85,247,0.4)]" 
                                    : "bg-transparent border border-blue-500/50 hover:bg-blue-500/10 text-blue-400"
                                }`}
                            >
                                {p.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
