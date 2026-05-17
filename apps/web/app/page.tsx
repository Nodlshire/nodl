"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import HeroSection from "../components/landing/HeroSection";
import WhatIsWnodeSection from "../components/landing/WhatIsWnodeSection";
import WhyItMattersSection from "../components/landing/WhyItMattersSection";
import PersonasSection from "../components/landing/PersonasSection";
import { ComparisonMinimal } from "../components/landing/ComparisonMinimal";
import TrustSection from "../components/landing/TrustSection";
import CTAModal, { ModalMode } from "../components/landing/CTAModal";

export default function LandingPage() {
    const [modalMode, setModalMode] = useState<ModalMode>("beta_tester");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const openModal = (mode: ModalMode) => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    if (!mounted) return null;
    
    return (
        <AppLayout>
            <div className="bg-black text-white selection:bg-blue-500/30">
                <HeroSection onOpenModal={openModal} />
                <WhatIsWnodeSection />
                <WhyItMattersSection />
                <PersonasSection onOpenModal={openModal} />
                <ComparisonMinimal />
                <div className="max-w-7xl mx-auto px-8 py-20 fade-in-section flex flex-col items-center">
                    <img 
                        src="/model.png" 
                        alt="Wnode Sovereign Compute Model" 
                        className="w-full h-auto rounded-[2rem] border border-white/15 shadow-2xl mb-12" 
                    />
                    <div className="flex flex-col items-center">
                        <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-8">Join The Community</span>
                        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
                            <a href="https://x.com/wnodemesh" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.9)] transition-all">
                                <img src="/icons/x_neon.png" alt="X (Twitter)" className="h-20 md:h-28 w-auto brightness-125" />
                            </a>
                            <a href="https://discord.gg/5BNhsfg5Br" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_25px_rgba(34,197,94,0.9)] transition-all">
                                <img src="/icons/discord_neon.png" alt="Discord" className="h-20 md:h-28 w-auto brightness-125" />
                            </a>
                            <a href="https://t.me/wnodemesh" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_25px_rgba(239,68,68,0.9)] transition-all">
                                <img src="/icons/telegram_neon.png" alt="Telegram" className="h-20 md:h-28 w-auto brightness-125" />
                            </a>
                            <a href="https://www.youtube.com/channel/UCJsyB9UrIP1eXzkdJpPDFww" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_25px_rgba(255,0,0,0.9)] transition-all">
                                <img src="/icons/youtube_neon.png" alt="YouTube" className="h-9 md:h-12 w-auto brightness-125" />
                            </a>
                            <a href="https://github.com/wnodeltd/wnode" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] transition-all">
                                <img src="/icons/gitlogo.png" alt="GitHub" className="h-11 md:h-16 w-auto brightness-125" />
                            </a>
                        </div>
                    </div>
                </div>
                <TrustSection onOpenModal={openModal} />
            </div>
            
            <CTAModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                mode={modalMode} 
            />
        </AppLayout>
    );
}
