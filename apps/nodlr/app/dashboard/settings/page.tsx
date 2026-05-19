'use client';

import React, { useState } from 'react';
import { User, Lock, CreditCard, ChevronRight, Check, Server, Shield, Activity, BarChart, HardDrive, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAvatar } from '../../hooks/useAvatar';
import FinancialStatus from '../../components/FinancialStatus';
import { useAccount } from '../../hooks/useAccount';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'profile' | 'network' | 'payouts' | 'security'>('profile');
    const [isSaving, setIsSaving] = useState(false);
    const { avatar, uploadAvatar } = useAvatar();
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const { account, loading: accountLoading } = useAccount();

    const [profile, setProfile] = useState({
        displayName: '',
        businessName: '',
        avatarUrl: '',
        bio: 'Node Operator',
        contactEmail: '',
        phone: '',
        protocolId: '...',
        netId: '01',
        userId: '...',
        role: 'operator',
        nodeCount: 0,
        activeNodes: 0,
        networkArchitecture: 'Mesh v2',
        lastSeen: new Date().toISOString(),
        registryEntryId: '...',
        registryStatus: 'verified',
        protocolVersion: '1.2.0',
        capabilities: ['compute'],
        currentBalance: 0,
        pendingPayouts: 0,
        commissionRate: 0.70,
        payoutAddress: '',
        stripeVerification: 'pending',
        mfaEnabled: false,
        lastLogin: new Date().toISOString(),
        permissions: ['standard'],
        notificationPrefs: { email: true, sms: false, push: true },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'sot'
    });

    React.useEffect(() => {
        if (account) {
            setProfile(prev => ({
                ...prev,
                displayName: account.displayName || '',
                contactEmail: account.email || '',
                businessName: account.businessName || '',
                phone: account.phone || '',
                protocolId: account.id || '...',
                userId: account.id || '...',
                role: account.role || 'operator',
                payoutAddress: account.stripeAccountId || '',
                stripeVerification: account.stripeAccountId ? 'verified' : 'pending',
            }));
        }
    }, [account]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/account/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    displayName: profile.displayName,
                    email: profile.contactEmail,
                    businessName: profile.businessName,
                    phone: profile.phone
                })
            });
            if (res.ok) {
                // Force a reload or update local state
                window.location.reload();
            } else {
                alert('Failed to save changes');
            }
        } catch (err) {
            console.error('Save failed:', err);
            alert('Network error while saving');
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                await uploadAvatar(file);
            } catch (err) {
                console.error("Avatar upload failed:", err);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-normal tracking-tight text-white mb-1.5">Settings</h1>
                    <p className="text-16px text-slate-400 font-normal">Manage your identity, nodes, payouts, and security</p>
                </div>
                <div className="flex items-center gap-4 bg-[#111111] p-4.5 border border-white/10 rounded-[5px] relative group">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className="hidden" 
                    />
                    <div 
                        onClick={handleAvatarClick}
                        className="w-12 h-12 bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan font-normal text-sm border border-cyber-cyan/30 rounded-full cursor-pointer relative overflow-hidden transition-all hover:border-cyber-cyan group-hover:shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                    >
                        {avatar ? (
                            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            profile.displayName.split(' ').map(n => n[0]).join('')
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Upload className="w-4 h-4 text-white" />
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-[10px] text-slate-500 uppercase font-normal mb-0.5 tracking-[0.2em]">Protocol ID</span>
                        <div className="flex flex-col items-end">
                            <span className="block text-13px text-white font-mono uppercase tracking-tight">{profile.protocolId}</span>
                            <button 
                                onClick={handleAvatarClick}
                                className="text-[9px] text-cyber-cyan hover:underline font-bold tracking-widest mt-0.5 uppercase"
                            >
                                Change Photo
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* NavigationSidebar */}
                <div className="md:col-span-3 space-y-2">
                    {[
                        { id: 'profile', label: 'My Profile', icon: User },
                        { id: 'network', label: 'Network & Registry', icon: Server },
                        { id: 'payouts', label: 'Earnings & Payouts', icon: CreditCard },
                        { id: 'security', label: 'Security & Auth', icon: Lock },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`w-full p-4 text-left transition-all flex items-center justify-between rounded-[5px] ${activeTab === tab.id ? 'bg-cyber-cyan/10 border border-cyber-cyan/30 text-white' : 'bg-transparent border border-transparent text-slate-500 hover:text-white hover:bg-white/5'}`}
                        >
                            <div className="flex items-center gap-3">
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-cyber-cyan' : 'text-slate-500'}`} />
                                <span className="text-14px font-normal uppercase tracking-wider">{tab.label}</span>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeTab === tab.id ? 'opacity-100 rotate-90 text-cyber-cyan' : 'opacity-0'}`} />
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="md:col-span-9 p-8 border border-white/10 bg-black/40 rounded-[8px] min-h-[600px] relative">
                    <AnimatePresence mode="wait">
                        {/* ────────────────────────────────────────────────────────
                              TAB 1: MY PROFILE
                        ──────────────────────────────────────────────────────── */}
                        {activeTab === 'profile' && (
                            <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                                <div className="space-y-1 border-b border-white/10 pb-4">
                                    <h2 className="text-2xl font-normal text-white">Identity & Profile</h2>
                                    <p className="text-sm text-slate-400">Settings and information used across the Nodl ecosystem.</p>
                                </div>

                                <div className="space-y-8">
                                    <Section title="Identity & Profile">
                                        <div className="grid grid-cols-2 gap-6 mt-4">
                                            <Input label="Display Name" value={profile.displayName} onChange={(v) => setProfile({ ...profile, displayName: v })} />
                                            <Input label="Business Name" value={profile.businessName} onChange={(v) => setProfile({ ...profile, businessName: v })} />
                                            <Input label="Bio / Title" value={profile.bio} onChange={(v) => setProfile({ ...profile, bio: v })} />
                                            <Input label="Role" value={profile.role} disabled badge />
                                        </div>
                                    </Section>

                                    <Section title="Contact Information">
                                        <div className="grid grid-cols-2 gap-6 mt-4">
                                            <Input label="Contact Email" type="email" value={profile.contactEmail} onChange={(v) => setProfile({ ...profile, contactEmail: v })} badge badgeText="Verified" badgeColor="text-green-400" />
                                            <Input label="Phone Number" value={profile.phone} onChange={(v) => setProfile({ ...profile, phone: v })} />
                                        </div>
                                    </Section>

                                    <Section title="Account Identifiers (Read-Only)">
                                        <div className="grid grid-cols-2 gap-6 mt-4">
                                            <Input label="Protocol ID" value={profile.protocolId} disabled mono copyable />
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input label="Net ID" value={profile.netId} disabled mono />
                                                <Input label="User ID" value={profile.userId} disabled mono />
                                            </div>
                                        </div>
                                    </Section>

                                    <Section title="Metadata">
                                        <div className="grid grid-cols-3 gap-6 mt-4">
                                            <Input label="Created At" value={new Date(profile.createdAt).toLocaleDateString()} disabled mono />
                                            <Input label="Updated At" value={new Date(profile.updatedAt).toLocaleDateString()} disabled mono />
                                            <Input label="Source" value={profile.source} disabled badge />
                                        </div>
                                    </Section>
                                </div>

                                <SaveButton onClick={handleSave} isSaving={isSaving} />
                            </motion.div>
                        )}

                        {/* ────────────────────────────────────────────────────────
                              TAB 2: NETWORK & REGISTRY
                        ──────────────────────────────────────────────────────── */}
                        {activeTab === 'network' && (
                            <motion.div key="network" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                                <div className="space-y-1 border-b border-white/10 pb-4">
                                    <h2 className="text-2xl font-normal text-white">Network & Registry</h2>
                                    <p className="text-sm text-slate-400">Node activity, configuration, and registry compliance.</p>
                                </div>

                                <div className="space-y-8">
                                    <Section title="Network & Node Information">
                                        <div className="grid grid-cols-4 gap-4 mt-4 mb-6">
                                            <StatBlock value={profile.nodeCount} label="Total Nodes" />
                                            <StatBlock value={profile.activeNodes} label="Active Nodes" color="text-green-400" />
                                            <StatBlock value={profile.activeNodes > 0 ? 'Online' : 'Offline'} label="Status" color={profile.activeNodes > 0 ? 'text-[#22D3EE]' : 'text-slate-500'} />
                                            <StatBlock value={new Date(profile.lastSeen).toLocaleTimeString()} label="Last Seen" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <Input label="Network Architecture" value={profile.networkArchitecture} disabled />
                                        </div>
                                    </Section>

                                    <Section title="Protocol, Registry & Capabilities">
                                        <div className="grid grid-cols-2 gap-6 mt-4 mb-6">
                                            <Input label="Registry Entry ID" value={profile.registryEntryId} disabled mono copyable />
                                            <Input label="Registry Status" value={profile.registryStatus} disabled badge badgeColor="text-[#22D3EE]" />
                                            <Input label="Protocol Version" value={profile.protocolVersion} disabled mono />
                                        </div>
                                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                            <label className="text-[11px] text-slate-500 uppercase tracking-widest block mb-4">Capabilities / Flags</label>
                                            <div className="flex flex-wrap gap-3">
                                                {['compute', 'storage', 'relay', 'governance'].map(flag => (
                                                    <div key={flag} className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded-[3px] border ${profile.capabilities.includes(flag) ? 'bg-[#22D3EE] border-[#22D3EE]' : 'border-white/20'} flex items-center justify-center`}>
                                                            {profile.capabilities.includes(flag) && <Check className="w-3 h-3 text-black" />}
                                                        </div>
                                                        <span className="text-sm text-slate-300 font-mono">{flag}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-[11px] text-yellow-500/70 mt-4 italic">* Changing capability flags requires a re-sync with the peer registry.</p>
                                        </div>
                                    </Section>
                                </div>
                            </motion.div>
                        )}

                        {/* ────────────────────────────────────────────────────────
                              TAB 3: EARNINGS & PAYOUTS
                        ──────────────────────────────────────────────────────── */}
                        {activeTab === 'payouts' && (
                            <motion.div key="payouts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                                <div className="flex justify-between items-start border-b border-white/10 pb-4">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-normal text-white">Earnings & Payouts</h2>
                                        <p className="text-sm text-slate-400">Financial overview and payout configuration.</p>
                                    </div>
                                    <FinancialStatus />
                                </div>

                                <div className="space-y-8">
                                    <Section title="Financial & Yield">
                                        <div className="grid grid-cols-3 gap-6 mt-4 mb-6">
                                            <div className="col-span-3 p-6 bg-[#22D3EE]/5 border border-[#22D3EE]/20 rounded-[5px]">
                                                <span className="text-[11px] text-slate-400 uppercase tracking-widest block mb-2">Current Balance</span>
                                                <span className="text-4xl font-mono text-white">${(profile.currentBalance / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                            </div>
                                            <StatBlock value={`$${(profile.pendingPayouts / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} label="Pending Payouts" color="text-yellow-400" />
                                            <StatBlock value={`${(profile.commissionRate * 100).toFixed(1)}%`} label="Commission Rate" />
                                        </div>
                                    </Section>

                                    <Section title="Payout Settings">
                                        <div className="grid grid-cols-2 gap-6 mt-4">
                                            <Input label="Payout Address (Stripe ID)" value={profile.payoutAddress} onChange={(v) => setProfile({ ...profile, payoutAddress: v })} mono />
                                            <Input label="Stripe Status" value={profile.stripeVerification} disabled badge badgeColor="text-green-400" />
                                        </div>
                                        <div className="mt-6 p-4 bg-white/[0.02] border border-white/5 rounded-[5px]">
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[11px] text-slate-500 uppercase tracking-widest">Recent Payouts (Ledger)</span>
                                                <span className="text-[10px] text-[#22D3EE] uppercase tracking-widest cursor-pointer hover:underline">View Full Ledger</span>
                                            </div>
                                            {[
                                                { id: 'PAY-001', amount: 25000, date: '2026-03-28' },
                                                { id: 'PAY-002', amount: 20000, date: '2026-03-21' },
                                            ].map(p => (
                                                <div key={p.id} className="flex justify-between items-center py-2 border-b border-white/5 text-[12px]">
                                                    <span className="text-slate-400 font-mono">{p.id}</span>
                                                    <span className="text-white font-mono">${(p.amount / 100).toLocaleString()}</span>
                                                    <span className="text-slate-500 font-mono">{p.date}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Section>
                                </div>
                                <SaveButton onClick={handleSave} isSaving={isSaving} />
                            </motion.div>
                        )}

                        {/* ────────────────────────────────────────────────────────
                              TAB 4: SECURITY & PASSWORD
                        ──────────────────────────────────────────────────────── */}
                        {activeTab === 'security' && (
                            <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">
                                <div className="space-y-1 border-b border-white/10 pb-4">
                                    <h2 className="text-2xl font-normal text-white">Security & Password</h2>
                                    <p className="text-sm text-slate-400">Authentication constraints and notification routing.</p>
                                </div>

                                <div className="space-y-8">
                                    <Section title="Security, Sessions & Permissions">
                                        <div className="grid grid-cols-2 gap-6 mt-4 mb-6">
                                            <div className="p-4 border border-white/10 rounded-[5px] flex justify-between items-center">
                                                <div>
                                                    <span className="text-[12px] text-white font-bold block mb-1">MFA Enabled</span>
                                                    <span className="text-[11px] text-slate-500">Multi-factor acts as step-up verification.</span>
                                                </div>
                                                <Toggle checked={profile.mfaEnabled} onChange={() => setProfile({ ...profile, mfaEnabled: !profile.mfaEnabled })} />
                                            </div>
                                            <Input label="Last Login" value={new Date(profile.lastLogin).toLocaleString()} disabled mono />
                                        </div>
                                        <div className="mb-6">
                                            <Input label="Permissions / Roles" value={profile.permissions.join(', ')} disabled badge badgeColor="text-white" />
                                        </div>
                                        <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[5px]">
                                            <h3 className="text-[13px] font-bold text-red-500 mb-2">Change Password</h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <Input label="Current Password" type="password" placeholder="••••••••" value="" onChange={() => {}} />
                                                <Input label="New Password" type="password" placeholder="••••••••" value="" onChange={() => {}} />
                                            </div>
                                        </div>
                                    </Section>

                                    <Section title="Notification Preferences (Instant Save)">
                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <div className="p-4 border border-white/10 rounded-[5px] flex justify-between items-center bg-white/[0.01]">
                                                <span className="text-[13px] text-slate-300">Email Alerts</span>
                                                <Toggle checked={profile.notificationPrefs.email} onChange={(c) => setProfile({ ...profile, notificationPrefs: { ...profile.notificationPrefs, email: c } })} />
                                            </div>
                                            <div className="p-4 border border-white/10 rounded-[5px] flex justify-between items-center bg-white/[0.01]">
                                                <span className="text-[13px] text-slate-300">SMS Alerts</span>
                                                <Toggle checked={profile.notificationPrefs.sms} onChange={(c) => setProfile({ ...profile, notificationPrefs: { ...profile.notificationPrefs, sms: c } })} />
                                            </div>
                                            <div className="p-4 border border-white/10 rounded-[5px] flex justify-between items-center bg-white/[0.01]">
                                                <span className="text-[13px] text-slate-300">Push Notifications</span>
                                                <Toggle checked={profile.notificationPrefs.push} onChange={(c) => setProfile({ ...profile, notificationPrefs: { ...profile.notificationPrefs, push: c } })} />
                                            </div>
                                        </div>
                                    </Section>
                                </div>
                                <SaveButton onClick={handleSave} isSaving={isSaving} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

// ── Helper Components ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section>
            <h3 className="text-[12px] font-bold text-slate-300 uppercase tracking-widest mb-1">{title}</h3>
            {children}
        </section>
    );
}

function Input({ label, value, onChange, disabled, type = 'text', mono, badge, badgeText, badgeColor = 'text-[#22D3EE]', copyable, placeholder }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-end">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
                {copyable && <span className="text-[9px] text-[#22D3EE] uppercase tracking-widest cursor-pointer hover:underline">Copy</span>}
            </div>
            {badge ? (
                <div className={`w-full bg-[#111111] border border-white/10 p-3.5 rounded-[5px] text-[13px]`}>
                    <span className={`px-2 py-0.5 rounded-[3px] bg-white/5 border border-white/10 uppercase tracking-widest font-bold text-[10px] ${badgeColor}`}>
                        {badgeText || value}
                    </span>
                </div>
            ) : (
                <input
                    type={type}
                    value={value}
                    onChange={e => onChange?.(e.target.value)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full bg-[#111111] border border-white/10 p-3.5 rounded-[5px] text-[13px] text-white outline-none focus:border-[#22D3EE]/50 transition-colors ${mono ? 'font-mono' : ''} ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}
                />
            )}
        </div>
    );
}

function StatBlock({ label, value, color = 'text-white' }: { label: string; value: any; color?: string }) {
    return (
        <div className="bg-[#111111] border border-white/10 p-4 rounded-[5px] text-center">
            <span className={`text-2xl font-mono ${color} block leading-none mb-1`}>{value}</span>
            <span className="text-[9px] text-slate-500 uppercase tracking-widest">{label}</span>
        </div>
    );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) {
    return (
        <div onClick={() => onChange(!checked)} className={`w-10 h-5 rounded-full relative cursor-pointer border-2 transition-colors ${checked ? 'bg-[#22D3EE]/20 border-[#22D3EE]/50' : 'bg-white/5 border-white/20'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full transition-all ${checked ? 'bg-[#22D3EE] right-1' : 'bg-slate-500 left-1'}`} />
        </div>
    );
}

function SaveButton({ onClick, isSaving }: { onClick: () => void; isSaving: boolean }) {
    return (
        <div className="pt-6 border-t border-white/10">
            <button onClick={onClick} className="bg-[#22D3EE] hover:bg-[#22D3EE]/80 text-black px-8 py-3.5 rounded-[5px] font-bold text-[12px] uppercase tracking-widest transition-all">
                {isSaving ? 'Processing...' : 'Save Changes'}
            </button>
        </div>
    );
}
