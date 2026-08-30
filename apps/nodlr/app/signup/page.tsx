'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowRight, ShieldCheck, Check, Lock, Users, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSignup, FOUNDER_WUIDS } from '../hooks/useSignup';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    hasInvite,
    setHasInvite,
    inviterWUID,
    setInviterWUID,
    isLocked,
    wuidValidationError,
    validateWUID,
    handleManualWUIDChange
  } = useSignup();

  const [isIndividual, setIsIndividual] = useState(true);
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

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !firstName || !lastName) {
      setError('Please fill in all mandatory fields (First Name, Last Name, Email, Password).');
      return;
    }

    if (hasInvite === true && !inviterWUID) {
      setError('Please enter a valid Inviter WUID.');
      return;
    }

    if (inviterWUID && !validateWUID(inviterWUID)) {
      setError('The entered WUID format is invalid.');
      return;
    }

    setIsLoading(true);
    setError('');

    const finalBusinessName = isIndividual
      ? `${firstName.trim()} ${lastName.trim()}`.trim()
      : (businessName.trim() || `${firstName.trim()} ${lastName.trim()}`.trim() || 'Sovereign Node');

    try {
      const onboardRes = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          firstName,
          lastName,
          businessName: finalBusinessName,
          phone,
          addressLine1,
          addressLine2,
          postalCode,
          country,
          inviterWUID: hasInvite === false ? '' : inviterWUID.trim()
        })
      });

      if (!onboardRes.ok) {
        const data = await onboardRes.json();
        throw new Error(data.error || 'Failed to complete signup');
      }

      // Log in session
      const loginRes = await fetch('/api/auth/debug-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, domain: 'nodlr' })
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        if (loginData.session_id && typeof window !== 'undefined') {
          localStorage.setItem('nodl_jwt', loginData.session_id);
          localStorage.setItem('nodlr_session_id', loginData.session_id);
          localStorage.removeItem('nodlr_inviter_wuid');
          document.cookie = `nodlr_session=${loginData.session_id}; path=/; max-age=86400; SameSite=Lax`;
        }
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Registration error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center p-3 bg-cyber-purple/10 border border-cyber-purple/30 rounded-xl mb-4 text-cyber-purple shadow-lg">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">Join Wnode Nodlr Fleet</h2>
        <p className="mt-2 text-sm text-slate-400">Deploy sovereign compute nodes & receive daily overrides</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-[#0e0e11] border border-white/10 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 space-y-6">

          {/* Section 1: Invite / WUID Choice */}
          <div className="bg-white/[0.02] border border-white/10 p-5 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold text-cyber-cyan tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4" />
                Affiliate Tree Placement
              </span>
              {isLocked && (
                <span className="text-[10px] bg-cyber-purple/20 border border-cyber-purple/40 text-purple-300 px-2 py-0.5 rounded font-mono flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Locked via Invite Link
                </span>
              )}
            </div>

            {/* Case A: Locked via Invite Link */}
            {isLocked ? (
              <div className="space-y-2">
                <label className="text-xs text-slate-300 font-medium block">Inviter WUID (L1 Direct Placement)</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={inviterWUID}
                    className="w-full bg-black/60 border border-cyber-cyan/40 text-cyber-cyan font-mono text-sm px-4 py-2.5 rounded-lg cursor-not-allowed font-bold"
                  />
                  <div className="absolute right-3 top-2.5 text-cyber-cyan">
                    <Check className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">You will automatically join this inviter’s L1 affiliate network.</p>
              </div>
            ) : (
              /* Case B: No Invite Link - Ask YES / NO */
              <div className="space-y-3">
                <p className="text-xs text-slate-200 font-medium">Do you have an invite link or WUID?</p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setHasInvite(true);
                      setInviterWUID('');
                    }}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-2 ${
                      hasInvite === true
                        ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setHasInvite(false);
                      setInviterWUID('');
                    }}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-2 ${
                      hasInvite === false
                        ? 'bg-cyber-purple/20 border-cyber-purple text-purple-300'
                        : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    NO
                  </button>
                </div>

                {/* Sub-Case B1: YES -> Manual WUID Entry */}
                {hasInvite === true && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 pt-2"
                  >
                    <label className="text-xs text-slate-300 font-medium block">Enter Inviter WUID</label>
                    <input
                      type="text"
                      placeholder="e.g. 100001-0426-01-AA"
                      value={inviterWUID}
                      onChange={(e) => handleManualWUIDChange(e.target.value)}
                      className="w-full bg-black/60 border border-white/15 text-white font-mono text-sm px-4 py-2.5 rounded-lg focus:border-cyber-cyan focus:outline-none"
                    />
                    {wuidValidationError && (
                      <p className="text-xs text-rose-400 font-medium">{wuidValidationError}</p>
                    )}
                  </motion.div>
                )}

                {/* Sub-Case B2: NO -> Founder Round-Robin Notice */}
                {hasInvite === false && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-cyber-purple/10 border border-cyber-purple/30 rounded-lg text-xs text-purple-200 leading-relaxed"
                  >
                    Founder Round-Robin Placement Active: You will be automatically assigned under the primary founder rotation tree upon completion.
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Section 2: Personal / Account Registration Form */}
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 text-white text-sm px-3.5 py-2 rounded-lg focus:border-cyber-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 text-white text-sm px-3.5 py-2 rounded-lg focus:border-cyber-cyan focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/60 border border-white/10 text-white text-sm px-3.5 py-2 rounded-lg focus:border-cyber-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/60 border border-white/10 text-white text-sm px-3.5 py-2 rounded-lg focus:border-cyber-cyan focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+1 555 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 text-white text-sm px-3.5 py-2 rounded-lg focus:border-cyber-cyan focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 text-white text-sm px-3.5 py-2 rounded-lg focus:border-cyber-cyan focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-cyber-purple hover:bg-[#a855f7] text-white text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Sovereign Account...
                </>
              ) : (
                <>
                  Complete Registration
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070708] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-cyber-purple" />
      </div>
    }>
      <SignupForm />
    </Suspense>
  );
}
