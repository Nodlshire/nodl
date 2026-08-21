'use client';

import React, { useState } from 'react';
import { Wallet, Key, Palette, Save, Plus, Trash2, Check, Copy, User, Lock, CreditCard, ChevronRight, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'payouts' | 'security'>('profile');
    const [isStripeConnected, setIsStripeConnected] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [stripeData, setStripeData] = useState<any>(null);

    // Profile State
    const [profile, setProfile] = useState({
        fullName: 'Stephen Nodl',
        businessName: 'Nodl Core Operations',
        contactEmail: 'stephen@wnode.one'
    });

    // Payout State
    const stripeStatus = isStripeConnected ? 'Bank Account Verified - Payouts Active' : 'Ready to Connect';

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000);
    };

    const handleStripeConnect = (type: 'existing' | 'new') => {
        setIsStripeConnected(true);
        // Mock Stripe verified data pull
        const mockStripeData = {
            fullName: type === 'existing' ? 'Stephen J. Nodl' : 'Stephen Nodl',
            businessName: type === 'existing' ? 'Nodl Enterprise LLC' : 'Nodl Core Operations',
            email: 'stephen@stripe-verified.one'
        };
        setStripeData(mockStripeData);
        
        // Auto-populate profile fields
        setProfile({
            fullName: mockStripeData.fullName,
            businessName: mockStripeData.businessName,
            contactEmail: mockStripeData.email
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-normal tracking-tight text-white mb-1.5">Settings</h1>
                    <p className="text-16px text-slate-400 font-normal">Manage your personal info and payouts</p>
                </div>

                <div className="flex items-center gap-4 bg-[#111111] p-4.5 border border-white/10 rounded-[5px]">
                    <div className="w-10 h-10 bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan font-normal text-sm border border-cyber-cyan/30 rounded-full">
                        {profile.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-slate-500 uppercase font-normal mb-0.5 tracking-[0.2em]">Account id</span>
                        <span className="block text-13px text-white font-normal uppercase tracking-tight">Stephen_Nodl_01</span>
                    </div>

                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Navigation (Internal) */}
                <div className="md:col-span-4 space-y-2">
                    {[
                        { id: 'profile', label: 'My Profile', icon: User },
                        { id: 'payouts', label: 'Earnings & Payouts', icon: CreditCard },
                        { id: 'security', label: 'Security & Password', icon: Lock },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full p-5 text-left border transition-all flex items-center justify-between group rounded-[5px] ${activeTab === tab.id ? 'bg-cyber-cyan/10 border-cyber-cyan/30 text-white' : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3.5">
                                <tab.icon className={`w-4.5 h-4.5 ${activeTab === tab.id ? 'text-cyber-cyan' : 'text-slate-600'}`} />
                                <span className="text-16px font-normal uppercase tracking-tight">
                                    {tab.label}
                                </span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'opacity-100 rotate-90 text-cyber-cyan' : 'opacity-0'}`} />
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="md:col-span-8 surface-card p-10 min-h-[500px] relative overflow-hidden">

                    

                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <div className="border-b-2 border-white/10 pb-6">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-3xl font-normal text-white">My profile</h2>
                                            <p className="text-base text-slate-400 mt-2">Update your personal and business details</p>
                                        </div>
                                        {isStripeConnected && (
                                            <div className="flex items-center gap-3 bg-green-500/10 border-2 border-green-500/30 px-4 py-2 rounded-[5px]">
                                                <Check className="w-5 h-5 text-green-500" />
                                                <span className="text-sm text-green-500 font-normal uppercase tracking-wider">Verified</span>
                                            </div>
                                        )}
                                    </div>
                                </div>


                                <div className="grid grid-cols-1 gap-10">
                                     <div className="space-y-4">
                                        <label className="text-base font-normal text-slate-300 uppercase block tracking-widest">Full name</label>
                                        <input
                                            type="text"
                                            value={profile.fullName}
                                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                                            className="w-full bg-slate-900 border-2 border-white/20 p-6 text-white text-lg outline-none focus:border-cyber-cyan transition-all rounded-[5px]"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-base font-normal text-slate-300 uppercase block tracking-widest">Business name (Optional)</label>
                                        <input
                                            type="text"
                                            value={profile.businessName}
                                            onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                                            className="w-full bg-slate-900 border-2 border-white/20 p-6 text-white text-lg outline-none focus:border-cyber-cyan transition-all rounded-[5px]"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-base font-normal text-slate-300 uppercase block tracking-widest">Contact email</label>
                                        <input
                                            type="email"
                                            value={profile.contactEmail}
                                            onChange={(e) => setProfile({ ...profile, contactEmail: e.target.value })}
                                            className="w-full bg-slate-900 border-2 border-white/20 p-6 text-white text-lg outline-none focus:border-cyber-cyan transition-all rounded-[5px]"
                                        />
                                    </div>

                                </div>

                                <button onClick={handleSave} className="w-full bg-cyber-cyan text-black px-12 py-6 font-bold text-xl uppercase tracking-wider hover:bg-white transition-all shadow-lg">
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </motion.div>
                        )}

                        {activeTab === 'payouts' && (
                            <motion.div
                                key="payouts"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <div className="border-b-2 border-white/10 pb-6">
                                    <h2 className="text-3xl font-normal text-white">Earnings & payouts</h2>
                                    <p className="text-base text-slate-400 mt-2">Manage how you get paid for your node's work</p>
                                </div>
                                <div className="bg-white/5 border-2 border-white/20 p-10 space-y-10 relative overflow-hidden group rounded-[5px]">
                                    <div className="absolute top-0 right-0 p-8 opacity-10">
                                        <CreditCard className="w-24 h-24" />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <span className="text-base font-normal text-slate-300 uppercase block tracking-widest">Stripe connection</span>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${isStripeConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                            <span className={`text-xl font-normal uppercase ${isStripeConnected ? 'text-green-500' : 'text-red-500'}`}>
                                                {stripeStatus}
                                            </span>
                                        </div>
                                    </div>


                                    {!isStripeConnected ? (
                                        <div className="space-y-6">
                                            <button 
                                                onClick={() => handleStripeConnect('existing')}
                                                className="w-full bg-[#635bff] hover:bg-[#7a73ff] text-white px-10 py-6 font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-4 transition-all"
                                            >
                                                <CreditCard className="w-6 h-6" />
                                                Connect My Stripe Account
                                            </button>
                                            <div className="flex items-center gap-6">
                                                <div className="h-[2px] flex-1 bg-white/10" />
                                                <span className="text-xs text-slate-500 uppercase font-bold whitespace-nowrap">OR</span>
                                                <div className="h-[2px] flex-1 bg-white/10" />
                                            </div>
                                            <button 
                                                onClick={() => handleStripeConnect('new')}
                                                className="w-full bg-white/5 border-2 border-white/20 hover:bg-white/10 text-white px-10 py-6 font-bold text-lg uppercase tracking-wider flex items-center justify-center gap-4 transition-all"
                                            >
                                                Setup New Bank Account
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-10 pt-6 border-t-2 border-white/10">
                                            <div className="bg-green-500/10 border-2 border-green-500/20 p-8 space-y-6">
                                                <p className="text-lg text-green-500 font-bold">
                                                    Your account is set up. We send your earnings directly to your bank.
                                                </p>
                                                <div className="flex items-center gap-10">
                                                    <div>
                                                        <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Last Paid</span>
                                                        <span className="block text-2xl text-white font-bold">$482.12</span>
                                                    </div>
                                                    <div className="h-12 w-[2px] bg-white/10" />
                                                    <div>
                                                        <span className="block text-xs text-slate-500 uppercase font-bold mb-1">Bank Account</span>
                                                        <span className="block text-xl text-white font-bold">Checking (...4212)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <a 
                                                href="https://dashboard.stripe.com/express" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-3 text-cyber-cyan hover:text-white transition-colors text-lg font-bold uppercase tracking-wider border-b-2 border-cyber-cyan/50 pb-2"
                                            >
                                                Open Stripe Dashboard <ExternalLink className="w-5 h-5" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-12"
                            >
                                <div className="border-b-2 border-white/10 pb-6">
                                    <h2 className="text-3xl font-normal text-white">Security & password</h2>
                                    <p className="text-base text-slate-400 mt-2">Manage your password and extra security levels</p>
                                </div>


                                <div className="space-y-10">
                                    <div className="grid grid-cols-1 gap-10 p-10 bg-slate-900 border-2 border-white/20 shadow-xl rounded-[5px]">
                                        <h3 className="text-xl font-normal text-white uppercase tracking-wider">Change password</h3>

                                        <div className="space-y-4">
                                            <label className="text-base font-bold text-slate-300 uppercase block">Current Password</label>
                                            <input type="password" placeholder="••••••••" className="w-full bg-black border-2 border-white/20 p-6 text-white text-lg focus:border-red-500/50 transition-all outline-none" />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-base font-bold text-slate-300 uppercase block">New Password</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-black border-2 border-white/20 p-6 text-white text-lg focus:border-cyber-cyan transition-all outline-none" />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-base font-bold text-slate-300 uppercase block">Confirm New Password</label>
                                                <input type="password" placeholder="••••••••" className="w-full bg-black border-2 border-white/20 p-6 text-white text-lg focus:border-cyber-cyan transition-all outline-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-10 bg-slate-900 border-2 border-white/20 shadow-xl rounded-[5px]">
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-normal text-white uppercase tracking-wider">Extra login security</h3>
                                            <p className="text-base text-slate-500">Ask for a code from your phone when logging in</p>
                                        </div>

                                        <div className="w-16 h-8 bg-green-500/20 rounded-full relative cursor-pointer border-2 border-green-500/50">
                                            <div className="absolute right-1.5 top-1 w-5 h-5 bg-green-500 rounded-full shadow-lg" />
                                        </div>
                                    </div>
                                </div>

                                <button onClick={handleSave} className="w-full bg-white/10 border-2 border-white/20 text-white px-12 py-6 font-bold text-xl uppercase tracking-wider hover:bg-white hover:text-black transition-all">
                                    Update My Security
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
