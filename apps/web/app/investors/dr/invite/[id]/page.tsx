"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "../../../../../components/layout/AppLayout";

export default function InviteeFlowPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const [invite, setInvite] = useState<any>(null);
    const [step, setStep] = useState<'loading' | 'enter_email' | 'request_otp' | 'verify_otp' | 'nda' | 'error'>('loading');
    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            // We need a GET route for single invite. Or we can create one at /api/dr/invites/[id]
            fetch(`/api/dr/invites/${id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.invite) {
                        setInvite(data.invite);
                        if (data.invite.email) {
                            setEmail(data.invite.email);
                            setStep('request_otp');
                        } else {
                            setStep('enter_email');
                        }
                    } else {
                        setStep('error');
                        setError("Invite not found or invalid.");
                    }
                })
                .catch(() => {
                    setStep('error');
                    setError("Failed to load invite.");
                });
        }
    }, [id]);

    const handleContinueEmail = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }
        setIsLoading(true);
        setError("");
        try {
            // Update the invite with the provided email
            const res = await fetch(`/api/dr/invites/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                setStep('request_otp');
            } else {
                setError(data.error || "Failed to update invite.");
            }
        } catch {
            setError("Failed to process request.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestOTP = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch('/api/dr/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (data.success) {
                setStep('verify_otp');
            } else {
                setError(data.error || "Failed to send OTP");
            }
        } catch {
            setError("Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await fetch('/api/dr/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otpCode, inviteId: id })
            });
            const data = await res.json();
            if (data.success) {
                // Also update invite status to otp_verified
                await fetch(`/api/dr/invites/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'otp_verified' })
                });
                
                // If they already accepted NDA in the past, maybe skip? 
                // We'll just show NDA if status !== 'active' & !== 'nda_accepted'
                // But for simplicity, let's always show NDA or check status
                setStep('nda');
            } else {
                setError(data.error || "Failed to verify OTP");
            }
        } catch {
            setError("Failed to verify OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAcceptNDA = async () => {
        setIsLoading(true);
        setError("");
        try {
            await fetch(`/api/dr/invites/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: 'active', action: 'nda_accepted' })
            });
            // Redirect to secure data room
            router.push('/investors/dr/secure');
        } catch {
            setError("Failed to accept NDA");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20 px-8 flex flex-col items-center justify-center">
                <div className="max-w-md w-full mx-auto p-10 bg-[#080808] border border-white/10 rounded-2xl shadow-2xl relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent opacity-50" />

                    {step === 'loading' && (
                        <div className="text-center py-10">
                            <span className="text-blue-400 text-xs uppercase tracking-widest animate-pulse font-bold">Loading Secure Access...</span>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="text-center space-y-4">
                            <h2 className="text-2xl font-black tracking-tighter text-red-500">Access Denied</h2>
                            <p className="text-sm text-slate-400">{error}</p>
                        </div>
                    )}

                    {step === 'enter_email' && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-black tracking-tighter">Secure Link</h2>
                            <p className="text-sm text-slate-400">Please enter your email to access this data room.</p>
                            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white disabled:opacity-50" />
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <button onClick={handleContinueEmail} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg disabled:opacity-50">
                                {isLoading ? "Processing..." : "Continue"}
                            </button>
                        </div>
                    )}

                    {step === 'request_otp' && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-black tracking-tighter">Authentication</h2>
                            <p className="text-sm text-slate-400">We need to verify your identity before granting access to <strong>{email}</strong>.</p>
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <button onClick={handleRequestOTP} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg disabled:opacity-50">
                                {isLoading ? "Sending..." : "Send Secure Code"}
                            </button>
                        </div>
                    )}

                    {step === 'verify_otp' && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-black tracking-tighter">Verify Identity</h2>
                            <p className="text-sm text-slate-400">Enter the 6-digit code sent to {email}.</p>
                            <input type="text" placeholder="000000" value={otpCode} onChange={e => setOtpCode(e.target.value)} disabled={isLoading} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-xl text-center text-white tracking-[1em] disabled:opacity-50" maxLength={6} />
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <button onClick={handleVerifyOTP} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg disabled:opacity-50 transition-opacity">
                                {isLoading ? "Verifying..." : "Verify Identity"}
                            </button>
                        </div>
                    )}

                    {step === 'nda' && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-black tracking-tighter">Non-Disclosure Agreement</h2>
                            <div className="bg-black border border-white/10 rounded-lg p-4 h-48 overflow-y-auto text-left text-xs text-slate-400 space-y-4">
                                <p><strong>CONFIDENTIALITY AGREEMENT</strong></p>
                                <p>By clicking "I Accept" below, you agree to keep all contents of this Data Room strictly confidential.</p>
                                <p>You may not distribute, copy, or share any materials, documents, or links contained herein without explicit prior written consent from the Owner.</p>
                                <p>All activities are monitored and logged. Any unauthorized sharing or disclosure will result in immediate revocation of access and potential legal action.</p>
                            </div>
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <button onClick={handleAcceptNDA} disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg disabled:opacity-50 transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                                {isLoading ? "Accepting..." : "I Accept the NDA"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
