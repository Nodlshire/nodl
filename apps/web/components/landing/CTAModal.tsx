"use client";

import LeadCaptureForm from "../forms/LeadCaptureForm";

export type ModalMode = 
    | "beta_tester" 
    | "waitlist" 
    | "developer"
    | "investor"
    | "persona_creator" 
    | "persona_founder" 
    | "persona_community" 
    | "persona_early_adopter";

interface CTAModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: ModalMode;
}

export default function CTAModal({ isOpen, onClose, mode }: CTAModalProps) {
    if (!isOpen) return null;

    const config = {
        beta_tester: {
            title: "Join the Beta",
            line: "Get early access, shape the protocol, and lock in permanent advantages.",
            tag: "beta_tester"
        },
        waitlist: {
            title: "Champion Wenode",
            line: "Help us to promote Wenode to your audience and champion our movement",
            tag: "waitlist"
        },
        developer: {
            title: "Beta Developer",
            line: "Get early access and start building on the Wenode mesh.",
            tag: "developer"
        },
        investor: {
            title: "Nodlr Waitlist",
            line: (
                <>
                    Join the priority list to become a node operator and activate your device on the mesh.
                    <span className="block mt-2 text-sm text-blue-500 font-bold">Launch June-July</span>
                </>
            ),
            tag: "investor"
        },
        persona_creator: {
            title: "Creator Access",
            line: "Tell us about your network and we'll prioritize your early access.",
            tag: "persona_creator"
        },
        persona_founder: {
            title: "Founder Access",
            line: "Share your venture's vision and we'll be in touch.",
            tag: "persona_founder"
        },
        persona_community: {
            title: "Community Builder",
            line: "We're looking for active networks to pilot our governance layer.",
            tag: "persona_community"
        },
        persona_early_adopter: {
            title: "Early Adopter",
            line: "Be the first to operate on the next-gen mesh protocol.",
            tag: "persona_early_adopter"
        }
    };

    const active = config[mode];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md" 
                onClick={onClose}
            />
            <div className="relative w-full max-w-xl bg-[#1c1c1e] border border-white/15 rounded-[2.5rem] p-12 shadow-2xl overflow-hidden group">
                {/* Subtle Glow */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
                
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 text-[#86868b] hover:text-white transition-colors"
                >
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="relative z-10">
                    <h2 className="text-4xl font-semibold mb-3 tracking-tight text-white">{active.title}</h2>
                    <p className="text-xl text-[#86868b] mb-12 leading-relaxed">{active.line}</p>

                    <LeadCaptureForm tag={active.tag} onSuccess={onClose} />
                </div>
            </div>
        </div>
    );
}
