"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import HeroSection from "../components/landing/HeroSection";
import WhatIsWnodeSection from "../components/landing/WhatIsWnodeSection";
import WhyItMattersSection from "../components/landing/WhyItMattersSection";
import PersonasSection from "../components/landing/PersonasSection";
import EcosystemRibbon from "../components/landing/EcosystemRibbon";
import { ComparisonMinimal } from "../components/landing/ComparisonMinimal";
import TrustSection from "../components/landing/TrustSection";
import CTAModal, { ModalMode } from "../components/landing/CTAModal";

export default function LandingPage() {
    const [modalMode, setModalMode] = useState<ModalMode>("beta_tester");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isBannerVisible, setIsBannerVisible] = useState(true);

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
            {isBannerVisible && (
                <a 
                    href="https://juicebox.money/v5/base:155"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#eb1478] text-white py-2 px-4 flex justify-between items-center z-[100] relative hover:bg-[#eb1478]/90 transition-colors cursor-pointer block"
                >
                    <div className="flex-1 text-center text-sm font-medium">
                        We are crowdfunding – Donate to your Community DePIN and get perks & early access
                    </div>
                    <button 
                        onClick={(e) => {
                            e.preventDefault();
                            setIsBannerVisible(false);
                        }} 
                        className="text-white hover:text-white/80"
                    >
                        <span className="sr-only">Dismiss</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </a>
            )}
            <div className="bg-black text-white selection:bg-blue-500/30">
                <HeroSection onOpenModal={openModal} />
                <WhatIsWnodeSection />
                <WhyItMattersSection />
                <EcosystemRibbon />
                <PersonasSection onOpenModal={openModal} />
                <ComparisonMinimal />
                <div className="max-w-7xl mx-auto px-8 py-20 fade-in-section flex flex-col items-center">
                    <img 
                        src="/model.png" 
                        alt="Wenode Sovereign Compute Model" 
                        className="w-full h-auto rounded-[2rem] border border-white/15 shadow-2xl mb-12" 
                    />
                    <div className="flex flex-col items-center">
                        <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-8">Join The Community</span>
                        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
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
