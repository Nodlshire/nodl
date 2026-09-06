"use client";

import { useState, useEffect } from "react";
import AppLayout from "../components/layout/AppLayout";
import HeroSection from "../components/landing/HeroSection";
import ValueStripSection from "../components/landing/ValueStripSection";
import WhoItsForSection from "../components/landing/WhoItsForSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ComparisonSection from "../components/landing/ComparisonSection";
import AffiliateEngineSection from "../components/landing/AffiliateEngineSection";
import FAQSection from "../components/landing/FAQSection";
import ValuePathsSection from "../components/landing/ValuePathsSection";
import DeWiSection from "../components/landing/DeWiSection";
import SecuritySection from "../components/landing/SecuritySection";
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
                
                {/* 1. HERO SECTION */}
                <HeroSection onOpenModal={openModal} />

                {/* 2. EARLY ADOPTER TICKER / VALUE STRIP */}
                <ValueStripSection />

                {/* 3. AUDIENCE PIVOT: WHO WNODE IS BUILT FOR (4-Grid / Pillars) */}
                <WhoItsForSection onOpenModal={openModal} />

                {/* 4. HOW IT WORKS (IN PLAIN ENGLISH - 3 Steps) */}
                <HowItWorksSection />

                {/* 5. COMPARISON SECTION: WHY WNODE WINS */}
                <ComparisonSection />

                {/* 6. THE VIRAL AFFILIATE & GROWTH ENGINE */}
                <AffiliateEngineSection />

                {/* CORE ECOSYSTEM & SECURITY SECTIONS */}
                <ValuePathsSection onOpenModal={openModal} />
                <DeWiSection />
                <SecuritySection />

                {/* 7. FAQ SECTION */}
                <FAQSection />

                {/* 8. FINAL BOTTOM CTA */}
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

