"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AppLayout from "../../../../../components/layout/AppLayout";
import SignaturePad from "../../../../../components/dr/SignaturePad";

export default function CounterpartySignPage() {
    const params = useParams();
    const id = params?.id as string;

    const [email, setEmail] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [step, setStep] = useState<'request_otp' | 'verify_otp' | 'view_agreement' | 'signed'>('request_otp');
    const [agreement, setAgreement] = useState<any>(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestOTP = async () => {
        if (!email) {
            setError("Email is required");
            return;
        }
        setError("");
        setIsLoading(true);
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
        } catch (e) {
            setError("Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otpCode) {
            setError("OTP code is required");
            return;
        }
        setError("");
        setIsLoading(true);
        try {
            const res = await fetch('/api/dr/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code: otpCode })
            });
            const data = await res.json();
            if (data.success) {
                await loadAgreement();
            } else {
                setError(data.error || "Failed to verify OTP");
            }
        } catch (e) {
            setError("Failed to verify OTP");
        } finally {
            setIsLoading(false);
        }
    };

    const loadAgreement = async () => {
        setError("");
        setIsLoading(true);
        try {
            const res = await fetch(`/api/dr/agreements/${id}`);
            const data = await res.json();
            if (data.agreement) {
                if (data.agreement.counterpartyEmail !== email.toLowerCase().trim()) {
                    setError("Unauthorized: Email does not match the designated counterparty for this agreement.");
                    setIsLoading(false);
                    return;
                }
                setAgreement(data.agreement);
                setStep(data.agreement.status === 'fully_signed' ? 'signed' : 'view_agreement');
            } else {
                setError("Agreement not found");
            }
        } catch (e) {
            setError("Failed to load agreement");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignConfirm = async (base64Png: string) => {
        setIsLoading(true);
        try {
            // Upload counterparty signature
            const res = await fetch(base64Png);
            const blob = await res.blob();
            const file = new File([blob], `sig_${id}_counterparty.png`, { type: 'image/png' });

            const formData = new FormData();
            formData.append("action", "uploadFile");
            formData.append("path", "");
            formData.append("file", file);
            await fetch("/api/dr/fs", { method: "POST", body: formData });

            // Update agreement
            await fetch(`/api/dr/agreements/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    counterpartySignatureId: file.name,
                    counterpartySignedAt: new Date().toISOString(),
                    status: 'fully_signed'
                })
            });

            // Finalize PDF
            const finalizeRes = await fetch(`/api/dr/agreements/${id}/finalize`, { method: 'POST' });
            const finalizeData = await finalizeRes.json();
            
            if (finalizeData.error) {
                setError(finalizeData.error);
            } else {
                await loadAgreement(); // Will move to 'signed' step
            }
        } catch (e) {
            setError("An error occurred while signing the agreement.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-32 pb-20 px-8 flex flex-col items-center justify-center">
                <div className="max-w-2xl w-full mx-auto p-10 bg-[#080808] border border-white/10 rounded-2xl shadow-2xl relative">
                    {/* Top Accent */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-blue-400 to-transparent opacity-50" />

                    {step === 'request_otp' && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-black tracking-tighter">Agreement Access</h2>
                            <p className="text-sm text-slate-400">Enter your email to receive a secure access code.</p>
                            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-sm text-white disabled:opacity-50" />
                            {error && <p className="text-red-500 text-xs">{error}</p>}
                            <button onClick={handleRequestOTP} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg disabled:opacity-50 transition-opacity">
                                {isLoading ? "Sending..." : "Send Code"}
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
                                {isLoading ? "Verifying..." : "Verify & View Agreement"}
                            </button>
                        </div>
                    )}

                    {step === 'view_agreement' && agreement && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-black tracking-tighter text-center">{agreement.title}</h2>
                            
                            <div className="p-4 border border-white/10 rounded-lg bg-white/5 space-y-4">
                                <h3 className="font-bold text-sm uppercase tracking-widest text-slate-400">Agreement Details</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    {Object.entries(agreement.filledFields).map(([k, v]) => (
                                        <div key={k}>
                                            <span className="text-slate-500 block text-xs">{k}</span>
                                            <span>{v as string}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-center border-t border-white/10 pt-6 flex-col items-center gap-4">
                                {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
                                <SignaturePad onConfirm={handleSignConfirm} onCancel={() => window.location.href = '/'} />
                                {isLoading && <p className="text-blue-400 text-xs uppercase tracking-widest animate-pulse">Processing Signature...</p>}
                            </div>
                        </div>
                    )}

                    {step === 'signed' && agreement && (
                        <div className="space-y-6 text-center">
                            <h2 className="text-2xl font-black tracking-tighter text-green-500">Agreement Fully Signed</h2>
                            <p className="text-sm text-slate-400">This agreement has been successfully signed by all parties.</p>
                            
                            {agreement.finalPdfFileId && (
                                <a href={`/api/dr/download?path=${encodeURIComponent(agreement.finalPdfFileId)}`} download className="inline-block mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest py-3 rounded-lg transition-colors">
                                    Download Final PDF
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
