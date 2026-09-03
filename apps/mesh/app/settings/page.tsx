'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
    User, 
    Mail, 
    Lock, 
    MapPin, 
    Camera, 
    Save, 
    Loader2, 
    Building2, 
    Phone, 
    UserCheck,
    Briefcase
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';

export default function SettingsPage() {
    const { profile: globalProfile, updateProfile } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [savingAvatar, setSavingAvatar] = useState(false);
    const [hasUnsavedAvatar, setHasUnsavedAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [profile, setProfile] = useState({
        name: globalProfile?.full_name || 'Stephen Nodl',
        companyName: 'Nodl Global',
        contact: globalProfile?.full_name || 'Stephen Nodl',
        email: 'stephen@wnode.one',
        phone: '+1 (555) 000-0000',
        address: '123 Mesh Lane, Cloud City, CC 10101',
        avatar: globalProfile?.avatar || '',
        password: '••••••••••••'
    });

    // Sync with global profile if it changes (e.g. on initial load)
    useEffect(() => {
        if (globalProfile) {
            setProfile(prev => ({
                ...prev,
                name: globalProfile.full_name || prev.name,
                avatar: globalProfile.avatar || prev.avatar
            }));
        }
    }, [globalProfile]);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            updateProfile({ full_name: profile.name, avatar: profile.avatar });
            setIsSaving(false);
            setHasUnsavedAvatar(false);
            alert("Settings updated successfully.");
        }, 1000);
    };

    const handleSaveAvatar = () => {
        setSavingAvatar(true);
        setTimeout(() => {
            updateProfile({ avatar: profile.avatar });
            setSavingAvatar(false);
            setHasUnsavedAvatar(false);
            alert("Avatar updated successfully.");
        }, 1000);
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setProfile(prev => ({ ...prev, avatar: result }));
                setHasUnsavedAvatar(true);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl">
            {/* Hidden File Input for Avatar */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleAvatarChange} 
            />

            <div className="flex justify-between items-end border-b border-white/5 pb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
                    <p className="text-[10px] text-slate-500 tracking-[0.3em] font-bold">Manage your account profile and security preferences</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Account Details Section */}
                <div className="bg-[#080808] border border-white/5 p-8 rounded-3xl space-y-8 relative overflow-hidden">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                        <div className="p-3 bg-mesh-emerald/10 border border-mesh-emerald/20 rounded-xl">
                            <Briefcase className="w-5 h-5 text-mesh-emerald" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-white tracking-tight">Account Details</h2>
                            <p className="text-[9px] text-mesh-emerald font-bold tracking-widest mt-0.5">Corporate & Contact Information</p>
                        </div>
                    </div>
                    


                    <div className="grid gap-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] text-slate-500 tracking-[0.2em] font-bold ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-mesh-emerald transition-colors" />
                                    <input 
                                        type="text" 
                                        value={profile.name} 
                                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 focus:border-mesh-emerald/30 p-4 pl-12 text-white text-xs rounded-xl transition-all focus:outline-none placeholder:text-slate-700" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] text-slate-500 tracking-[0.2em] font-bold ml-1">Company Name</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-mesh-emerald transition-colors" />
                                    <input 
                                        type="text" 
                                        value={profile.companyName} 
                                        onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 focus:border-mesh-emerald/30 p-4 pl-12 text-white text-xs rounded-xl transition-all focus:outline-none placeholder:text-slate-700" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] text-slate-500 tracking-[0.2em] font-bold ml-1">Contact Person</label>
                                <div className="relative group">
                                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-mesh-emerald transition-colors" />
                                    <input 
                                        type="text" 
                                        value={profile.contact} 
                                        onChange={(e) => setProfile({...profile, contact: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 focus:border-mesh-emerald/30 p-4 pl-12 text-white text-xs rounded-xl transition-all focus:outline-none placeholder:text-slate-700" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] text-slate-500 tracking-[0.2em] font-bold ml-1">Phone Number</label>
                                <div className="relative group">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-mesh-emerald transition-colors" />
                                    <input 
                                        type="text" 
                                        value={profile.phone} 
                                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 focus:border-mesh-emerald/30 p-4 pl-12 text-white text-xs rounded-xl transition-all focus:outline-none placeholder:text-slate-700" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] text-slate-500 tracking-[0.2em] font-bold ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-mesh-emerald transition-colors" />
                                    <input 
                                        type="email" 
                                        value={profile.email} 
                                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                                        className="w-full bg-black/40 border border-white/5 focus:border-mesh-emerald/30 p-4 pl-12 text-white text-xs rounded-xl transition-all focus:outline-none placeholder:text-slate-700" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black ml-1">Physical Address</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-mesh-emerald transition-colors" />
                                <input 
                                    type="text" 
                                    value={profile.address} 
                                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                                    className="w-full bg-black/40 border border-white/5 focus:border-mesh-emerald/30 p-4 pl-12 text-white text-xs rounded-xl transition-all focus:outline-none placeholder:text-slate-700" 
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full py-4 bg-white text-black rounded-xl font-bold tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-50 mt-4 shadow-lg hover:bg-white/90"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Update Account
                            </button>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="bg-[#080808] border border-white/5 p-8 rounded-3xl space-y-8 flex flex-col relative overflow-hidden">
                    <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                        <div className="p-3 bg-mesh-emerald/10 border border-mesh-emerald/20 rounded-xl">
                            <Lock className="w-5 h-5 text-mesh-emerald" />
                        </div>
                        <div>
                            <h2 className="text-sm font-black text-white tracking-tight">Security & Communication</h2>
                            <p className="text-[9px] text-mesh-emerald font-black uppercase tracking-widest mt-0.5">Access Credentials & Notifications</p>
                        </div>
                    </div>
                    
                    <div className="space-y-6 flex-1">
                        <div className="space-y-2">
                            <label className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-mesh-emerald transition-colors" />
                                <input 
                                    type="email" 
                                    value={profile.email} 
                                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                                    className="w-full bg-black/40 border border-white/5 focus:border-mesh-emerald/30 p-4 pl-12 text-white text-xs rounded-xl transition-all focus:outline-none placeholder:text-slate-700" 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-black ml-1">Update Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600 group-focus-within:text-mesh-emerald transition-colors" />
                                <input 
                                    type="password" 
                                    value={profile.password} 
                                    onChange={(e) => setProfile({...profile, password: e.target.value})}
                                    className="w-full bg-black/40 border border-white/5 focus:border-mesh-emerald/30 p-4 pl-12 text-white text-xs rounded-xl transition-all focus:outline-none placeholder:text-slate-700" 
                                />
                            </div>
                        </div>
                    </div>

                        <div className="pt-8 mt-auto border-t border-white/5">
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full py-4 bg-white text-black rounded-xl font-bold tracking-wider flex items-center justify-center gap-3 transition-all disabled:opacity-50 mt-4 shadow-lg hover:bg-white/90"
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                                Update Credentials
                            </button>
                        </div>
                </div>
            </div>
            
            <div className="mt-12 text-center">
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.4em] font-black">
                    Nodl Matrix Authority // Last Updated 2026.03.28
                </p>
            </div>
        </div>
    );
}

