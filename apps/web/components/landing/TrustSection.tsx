import { ModalMode } from "./CTAModal";

interface TrustSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function TrustSection({ onOpenModal }: TrustSectionProps) {
    return (
        <section className="py-40 bg-black border-t border-white/15 relative overflow-hidden">
            {/* Subtle Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center px-8 fade-in-section relative z-10">
                <h2 className="text-sm tracking-[0.4em] text-blue-500 uppercase mb-8 font-bold">Proof of Integrity</h2>
                <div className="space-y-12">
                    <div className="group">
                        <p className="text-2xl md:text-4xl text-white font-bold tracking-tight leading-tight uppercase font-space-grotesk">
                            Built for Community Owners.
                        </p>
                    </div>
                    <div className="group">
                        <p className="text-2xl md:text-4xl text-white font-bold tracking-tight leading-tight uppercase font-space-grotesk">
                            Backed by a founder with institutional-grade governance design.
                        </p>
                    </div>
                    <div className="group">
                        <p className="text-2xl md:text-4xl text-white font-bold tracking-tight leading-tight uppercase font-space-grotesk">
                            Designed for long-term economic integrity.
                        </p>
                    </div>
                </div>

                <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-6">
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

                <div className="mt-32 pt-20 border-t border-white/15 flex flex-col items-center">
                    <img 
                        src="/topology.png" 
                        alt="Wnode Network Topology" 
                        className="w-full max-w-5xl h-auto shadow-[0_0_50px_rgba(59,130,246,0.1)] rounded-3xl mb-12" 
                    />
                    <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mt-12">
                        <a href="https://x.com/wnodemesh" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#3b82f6] hover:scale-110 transition-all duration-300">
                            <img src="/icons/x_neon.png" alt="X (Twitter)" className="h-20 md:h-28 w-auto brightness-125" />
                        </a>
                        <a href="https://discord.gg/5BNhsfg5Br" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#2563eb] hover:scale-110 transition-all duration-300">
                            <img src="/icons/discord_neon.png" alt="Discord" className="h-20 md:h-28 w-auto brightness-125" />
                        </a>
                        <a href="https://t.me/wnodemesh" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#ec4899] hover:scale-110 transition-all duration-300">
                            <img src="/icons/telegram_neon.png" alt="Telegram" className="h-20 md:h-28 w-auto brightness-125" />
                        </a>
                        <a href="https://wa.me/447458197900" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#22c55e] hover:scale-110 transition-all duration-300">
                            <img src="/icons/whatsapp_neon.png" alt="WhatsApp" className="h-20 md:h-28 w-auto brightness-125" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCJsyB9UrIP1eXzkdJpPDFww" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#ff0000] hover:scale-110 transition-all duration-300">
                            <img src="/icons/youtube_neon.png" alt="YouTube" className="h-9 md:h-12 w-auto brightness-125" />
                        </a>
                        <a href="https://github.com/wnodeltd/wnode" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#ffffff] hover:scale-110 transition-all duration-300">
                            <img src="/icons/gitlogo.png" alt="GitHub" className="h-11 md:h-16 w-auto brightness-125" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
