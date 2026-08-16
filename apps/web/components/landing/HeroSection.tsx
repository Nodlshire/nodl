"use client";

import { ModalMode } from "./CTAModal";

interface HeroSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function HeroSection({ onOpenModal }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-8 pt-40 pb-20 overflow-hidden bg-black text-center">

            <div className="max-w-6xl w-full mx-auto z-10 flex flex-col items-center text-center gap-12">
                <div className="fade-in-section flex flex-col items-center text-center w-full">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] text-white mb-8 uppercase font-space-grotesk text-center">
                        Planetary DePIN & <br />
                        <span className="text-blue-500">DeWi Mesh</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-300 font-medium mb-8 max-w-4xl mx-auto leading-relaxed text-center">
                        A sovereign global network where devices provide compute, connectivity, and routing — forming a planetary mesh anyone can join.
                    </p>

                    <p className="text-base md:text-lg text-slate-400 mb-12 max-w-4xl mx-auto leading-relaxed text-center">
                        Wnode unifies decentralized physical infrastructure (DePIN) with decentralized wireless (DeWi). Your devices — phones, laptops, servers, radios — become active nodes that execute encrypted compute jobs, route traffic, and extend wireless coverage. Earn daily USD payouts for contributing real work to the mesh.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full max-w-2xl mx-auto">
                        <button 
                            onClick={() => onOpenModal("beta_tester")}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold px-10 py-5 rounded-none transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] uppercase tracking-widest"
                        >
                            Run a Node
                        </button>
                        <button 
                            onClick={() => onOpenModal("investor")}
                            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold px-10 py-5 rounded-none transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] uppercase tracking-widest"
                        >
                            Explore the Mesh
                        </button>
                    </div>
                </div>

                <div className="relative w-full max-w-5xl flex items-center justify-center mx-auto">
                    <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
                    <img 
                        src="/steps.png" 
                        alt="How Wenode Works" 
                        className="relative z-10 w-full h-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.2)] rounded-2xl"
                    />
                </div>
            </div>

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 0)', backgroundSize: '40px 40px' }} 
            />
        </section>
    );
}
