"use client";

import { useState } from "react";
import { 
    User, CreditCard, Check, ArrowRight, 
    Shield, Briefcase, ChevronRight, AlertCircle
} from "lucide-react";

interface Step {
    id: number;
    title: string;
    description: string;
    icon: any;
}

interface OnboardingWizardProps {
    account?: any;
    onSkip?: () => void;
}

export default function OnboardingWizard({ account, onSkip }: OnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [name, setName] = useState(account?.name || '');
    const [isConnecting, setIsConnecting] = useState(false);
    const [showStripeHelp, setShowStripeHelp] = useState(false);

    const steps: Step[] = [
        { id: 1, title: "Profile Setup", description: "Identity and Preferences", icon: User },
        { id: 2, title: "Connect Payouts", description: "Stripe Express Gateway", icon: CreditCard },
        { id: 3, title: "Mesh Verification", description: "Hardware Integrity Check", icon: Shield },
    ];

    const handleConnectStripe = () => {
        setIsConnecting(true);
        window.location.href = '/onboard';
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-6">
            {/* Step Indicators */}
            <div className="flex justify-between mb-12 relative">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/10 -translate-y-1/2 z-0" />
                {steps.map((step) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                            currentStep >= step.id 
                            ? "bg-black border-[#22D3EE] text-[#22D3EE] shadow-[0_0_15px_rgba(34,211,238,0.3)]" 
                            : "bg-black border-white/10 text-white/20"
                        }`}>
                            {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                        </div>
                        <span className={`mt-3 text-[11px] font-normal tracking-widest uppercase-none ${
                            currentStep >= step.id ? "text-white" : "text-white/20"
                        }`}>{step.title}</span>
                    </div>
                ))}
            </div>

            <div className="card-sovereign p-10 bg-gradient-to-br from-white/[0.03] to-transparent">
                {currentStep === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-[24px] font-normal tracking-tight text-white mb-2 uppercase-none">Universal Identity</h2>
                            <p className="text-[14px] text-slate-400 font-normal leading-relaxed uppercase-none">
                                Add your Universal Identity to personalize your account. You can do this now or later.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] text-slate-500 uppercase tracking-widest font-normal">Legal Entity / Name</label>
                                <input 
                                    type="text" 
                                    placeholder="Enter your name or business"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-[5px] px-4 py-3 text-[14px] text-white focus:border-[#22D3EE] focus:outline-none transition-all outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button 
                                onClick={() => setCurrentStep(2)}
                                className="w-full h-12 bg-white text-black rounded-[5px] text-[14px] font-bold hover:bg-[#22D3EE] transition-all flex items-center justify-center gap-2"
                            >
                                Next Step <ChevronRight className="w-4 h-4" />
                            </button>
                            
                            <button 
                                onClick={() => {
                                    localStorage.setItem('nodl_skip_onboarding', 'true');
                                    if (onSkip) onSkip();
                                    else window.location.href = '/dashboard';
                                }}
                                className="w-full h-12 bg-transparent text-slate-500 hover:text-white rounded-[5px] text-[13px] font-normal transition-all flex items-center justify-center gap-2"
                            >
                                Skip for now
                            </button>
                        </div>
                    </div>
                )}

                {currentStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="flex items-start gap-4 p-4 bg-[#22D3EE]/10 border border-[#22D3EE]/20 rounded-[5px]">
                            <Briefcase className="w-6 h-6 text-[#22D3EE] shrink-0" />
                            <div>
                                <h3 className="text-[14px] text-white font-normal mb-1">Financial Integrity</h3>
                                <p className="text-[12px] text-[#22D3EE]/70 font-normal uppercase-none">
                                    We use Stripe Connect Express for secure, automated daily payouts. Your bank details are never stored on Nodl servers.
                                </p>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-[24px] font-normal tracking-tight text-white mb-2 uppercase-none">Connect Payouts</h2>
                            <p className="text-[14px] text-slate-400 font-normal leading-relaxed uppercase-none">
                                Link your bank account through our secure Stripe gateway to enable daily earnings settlements.
                            </p>
                        </div>

                        <button 
                            onClick={handleConnectStripe}
                            disabled={isConnecting}
                            className="w-full h-14 bg-[#22D3EE] text-black rounded-[5px] text-[15px] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                        >
                            {isConnecting ? "Redirecting to Stripe..." : "Link Stripe Connect"}
                            <ArrowRight className={`w-5 h-5 ${isConnecting ? 'animate-pulse' : ''}`} />
                        </button>

                        <div className="space-y-4">
                            <button 
                                onClick={() => setShowStripeHelp(!showStripeHelp)}
                                className="flex items-center gap-2 text-[12px] text-slate-500 justify-center w-full group hover:text-white transition-colors"
                            >
                                <AlertCircle className="w-4 h-4" />
                                <span className="font-bold underline underline-offset-4 decoration-white/20 group-hover:decoration-white/40">Why Do I Need A Stripe Account?</span>
                            </button>

                            {showStripeHelp && (
                                <div className="p-4 bg-white/5 border border-white/10 rounded-[5px] text-[12px] text-slate-400 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                    Stripe Connect is the industry-standard gateway for automated payouts. By linking your account, you enable **Direct Daily Settlements** of your compute earnings without Nodl acting as a middleman. 
                                    <br/><br/>
                                    <span className="text-[#22D3EE]">● Security: Your bank details never touch our servers.</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-8 text-center">
                <button 
                    onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                    className="text-[12px] text-slate-500 hover:text-white transition-colors font-normal uppercase-none"
                >
                    Back to previous step
                </button>
            </div>
        </div>
    );
}
