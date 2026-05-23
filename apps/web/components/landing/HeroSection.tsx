"use client";

import { ModalMode } from "./CTAModal";

interface HeroSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function HeroSection({ onOpenModal }: HeroSectionProps) {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-8 pt-40 pb-20 overflow-hidden bg-black">

            <div className="max-w-6xl w-full mx-auto z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="fade-in-section text-left">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[0.95] text-white mb-8 uppercase font-space-grotesk">
                        COMPUTE IS THE <br />
                        <span className="text-blue-500">NEW GOLDRUSH</span> <br />
                        STAKE YOUR CLAIM.
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-400 mb-12 max-w-xl leading-relaxed">
                        Any device, old or new, any scale <br />
                        Build an immutable Asset <br />
                        <span className="text-blue-500">Multiple Passive Income Streams</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <button 
                            onClick={() => onOpenModal("developer")}
                            className="w-full sm:w-auto sm:min-w-[280px] bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold px-10 py-5 rounded-none transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] uppercase tracking-widest"
                        >
                            Become a Beta Developer
                        </button>
                        <button 
                            onClick={() => onOpenModal("investor")}
                            className="w-full sm:w-auto sm:min-w-[280px] bg-purple-600 hover:bg-purple-500 text-white text-lg font-bold px-10 py-5 rounded-none transition-all shadow-[0_0_40px_rgba(168,85,247,0.4)] uppercase tracking-widest"
                        >
                            Join Node Waitlist
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
                        <img 
                            src="/steps.png" 
                            alt="How Wenode Works" 
                            className="relative z-10 w-full h-auto drop-shadow-[0_0_30px_rgba(59,130,246,0.2)]"
                        />
                    </div>
                </div>
            </div>

            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(#3B82F6 1px, transparent 0)', backgroundSize: '40px 40px' }} 
            />
        </section>
    );
}
