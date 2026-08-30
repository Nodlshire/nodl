'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [isIndividual, setIsIndividual] = useState(false);
    const [inviteToken, setInviteToken] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [businessName, setBusinessName] = useState('');
    const [phone, setPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('United States');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setInviteToken(token);
        }
    }, [searchParams]);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !firstName || !lastName || !phone || !addressLine1 || !postalCode || !country) {
            setError('Please fill in all mandatory fields (First Name, Last Name, Phone, Address Line 1, Post Code, Country, Email, Password).');
            return;
        }

        setIsLoading(true);
        setError('');

        const finalBusinessName = isIndividual 
            ? `${firstName.trim()} ${lastName.trim()}`.trim() 
            : (businessName.trim() || `${firstName.trim()} ${lastName.trim()}`.trim() || 'Mesh Node');

        try {
            // 1. Call Backend to create Nodlr/Mesh account via Auth Proxy
            const onboardRes = await fetch('/api/auth/onboard', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password: password.trim(),
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    businessName: finalBusinessName,
                    phone: phone.trim(),
                    addressLine1: addressLine1.trim(),
                    addressLine2: addressLine2.trim(),
                    postalCode: postalCode.trim(),
                    country: country.trim(),
                    inviteToken: inviteToken ? inviteToken.trim() : ""
                })
            });

            if (!onboardRes.ok) {
                const data = await onboardRes.json();
                throw new Error(data.error || 'Failed to register account');
            }

            // 2. Authenticate the session
            const loginRes = await fetch('/api/auth/debug-session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password: password.trim(),
                    domain: 'mesh'
                })
            });

            if (!loginRes.ok) {
                const data = await loginRes.json();
                throw new Error(data.error || 'Failed to authenticate after registration');
            }

            const loginData = await loginRes.json();
            if (loginData.session_id && typeof window !== 'undefined') {
                localStorage.setItem('nodl_jwt', loginData.session_id);
                localStorage.setItem('nodlr_session_id', loginData.session_id);
                localStorage.setItem('nodl_user_email', email.trim().toLowerCase());
                localStorage.setItem('nodlr_session', JSON.stringify(loginData));
                document.cookie = `nodlr_session=${loginData.session_id}; path=/; max-age=86400; SameSite=Lax`;
            }

            window.location.href = '/dashboard';

        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const displayNameForIndividual = `${firstName.trim()} ${lastName.trim()}`.trim();

    return (
        <div className="w-full">
            <form className="space-y-4" onSubmit={handleSignup}>
                {/* Account Type Toggle */}
                <div className="flex bg-black/60 p-1 rounded-[5px] border border-white/10 mb-2">
                    <button
                        type="button"
                        onClick={() => { setIsIndividual(false); setBusinessName(''); }}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-[3px] transition-all ${!isIndividual ? 'bg-[#00f2ff] text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Company / Business
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsIndividual(true); setBusinessName(''); }}
                        className={`flex-1 py-2.5 text-xs font-bold rounded-[3px] transition-all ${isIndividual ? 'bg-[#00f2ff] text-black shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        Private Person / Individual
                    </button>
                </div>

                {/* 1. Account Holder / Business Name Box (FIRST) */}
                <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        {isIndividual ? "Account Holder (Individual)" : "Business / Fleet Name (Account Holder - Optional)"}
                    </label>
                    <input
                        type="text"
                        placeholder={isIndividual ? (displayNameForIndividual || "Personal Account") : "Company or Business Name"}
                        value={isIndividual ? displayNameForIndividual : businessName}
                        onChange={(e) => !isIndividual && setBusinessName(e.target.value)}
                        disabled={isIndividual}
                        className={`w-full border rounded-[5px] px-4 py-3.5 text-sm focus:outline-none transition-all border-b-2 ${
                            isIndividual 
                                ? 'bg-white/5 border-white/5 text-slate-400 cursor-not-allowed italic' 
                                : 'bg-black/40 border-white/10 text-white focus:border-[#00f2ff]/50'
                        }`}
                    />
                </div>

                {/* 2. Personal / Account Manager Name (First & Last) */}
                <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        {isIndividual ? "Personal Name *" : "Account Manager Name *"}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2"
                            required
                        />
                    </div>
                </div>

                {/* 3. Telephone Number */}
                <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        Telephone Number (Account Recovery) *
                    </label>
                    <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2 font-mono"
                        required
                    />
                </div>

                {/* 4. Address Details */}
                <div className="space-y-3 pt-1 border-t border-white/5">
                    <label className="block text-[10px] text-[#00f2ff] uppercase tracking-widest font-mono font-bold">
                        Billing & Legal Address
                    </label>
                    <input
                        type="text"
                        placeholder="Address Line 1 (Apt, Building No, Street) *"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Address Line 2 (Suite, Unit, Floor - Optional)"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2"
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Post Code / ZIP *"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Country *"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2"
                            required
                        />
                    </div>
                </div>

                {/* 5. Email Address */}
                <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        Email Address *
                    </label>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2"
                        required
                    />
                </div>

                {/* 6. Password */}
                <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        Password *
                    </label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2"
                        required
                    />
                </div>

                {/* 7. Invite Token (Optional) */}
                <div className="space-y-1">
                    <label className="block text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        Invite / Placement Token (Optional)
                    </label>
                    <input
                        type="text"
                        placeholder="Invite Code (e.g. FOUNDER-XXXX)"
                        value={inviteToken}
                        onChange={(e) => setInviteToken(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[5px] px-4 py-3.5 text-white text-sm focus:outline-none focus:border-[#00f2ff]/50 transition-all border-b-2 font-mono uppercase"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-[10px] uppercase bg-red-500/10 border border-red-500/20 p-3 rounded-[5px]">
                        {error}
                    </div>
                )}

                {/* Single Native Registration Action Button (No Stripe) */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#00f2ff] hover:bg-[#00d8e6] text-black font-bold py-4 rounded-[5px] transition-all flex items-center justify-center gap-2 group active:scale-[0.98] mt-6 shadow-lg shadow-[#00f2ff]/20"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin text-black" />
                    ) : (
                        <>
                            <span className="tracking-tight uppercase text-xs tracking-wider">Create Mesh Account</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden w-full">
            {/* Background scanline effect */}
            <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_0%,rgba(0,242,255,0.02)_50%,transparent_100%)] bg-[length:100%_4px] animate-scanline" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg z-10 my-10"
            >
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-6 w-full">
                    <div className="flex flex-col items-center justify-center w-20 mb-2">
                        <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto fill-white drop-shadow-sm">
                            <path d="M 22 110 L 22 50 A 28 28 0 0 1 78 50 L 78 110" fill="none" stroke="white" strokeWidth="26" strokeLinecap="butt" />
                            <circle cx="50" cy="72" r="16" />
                        </svg>
                        <span style={{ fontFamily: "'Roboto', sans-serif", fontSize: "14pt", fontWeight: "bold", color: "white", marginTop: "12px", lineHeight: "1", letterSpacing: "0.02em" }}>wnode mesh</span>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-[#1a1a1b] border border-white/5 rounded-[5px] p-8 shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Create Mesh Account</h1>
                        <p className="text-slate-400 text-xs">Join the Sovereign Mesh Infrastructure Network</p>
                    </div>

                    <React.Suspense fallback={
                        <div className="flex justify-center p-8">
                            <Loader2 className="w-6 h-6 animate-spin text-[#00f2ff]" />
                        </div>
                    }>
                        <RegisterForm />
                    </React.Suspense>

                    <div className="text-center mt-6 pt-4 border-t border-white/5">
                        <a href="/login" className="text-slate-400 text-xs hover:text-white transition-colors underline-offset-4 hover:underline">
                            Already have an account? Sign In
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
