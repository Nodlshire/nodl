"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import HeroSection from "../components/landing/HeroSection";
import TractionBar from "../components/landing/TractionBar";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ValuePathsSection from "../components/landing/ValuePathsSection";
import DeWiSection from "../components/landing/DeWiSection";
import SecuritySection from "../components/landing/SecuritySection";
import WhoItsForSection from "../components/landing/WhoItsForSection";
import FinalCTASection from "../components/landing/FinalCTASection";
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
            <div className="bg-black text-white selection:bg-blue-500/30 overflow-x-hidden">
                
                {/* SECTION B: Hero Section */}
                <HeroSection onOpenModal={openModal} />

                {/* SECTION C: Live Traction Bar */}
                <TractionBar />

                {/* SECTION D: How It Works (Simple 4-Step Visual Section) */}
                <HowItWorksSection />

                {/* SECTION E: Two Core Value Paths (Side-by-Side) */}
                <ValuePathsSection onOpenModal={openModal} />

                {/* SECTION F: Dedicated DeWi Section */}
                <DeWiSection />

                {/* SECTION G: Security & Sovereignty Section */}
                <SecuritySection />

                {/* SECTION H: Who It's For (Three Short Cards) */}
                <WhoItsForSection onOpenModal={openModal} />

                {/* SECTION I & J: Final CTA & Community Section */}
                <FinalCTASection onOpenModal={openModal} />

            </div>

            {/* Interactive Registration / Contact Modal */}
            <CTAModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                mode={modalMode} 
            />
        </AppLayout>
    );
}
