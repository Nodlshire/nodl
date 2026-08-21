"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Cpu, Users, Settings, LogOut, Upload, DollarSign } from 'lucide-react';
import { useState, useRef } from 'react';

const navigation = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Machines', href: '/dashboard/hardware', icon: Cpu },
    { name: 'Finances', href: '/dashboard/finances', icon: DollarSign },
    { name: 'Affiliates', href: '/dashboard/affiliates', icon: Users },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];


export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [avatar, setAvatar] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatar(url);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans flex">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 w-64 bg-[#080808] border-r border-white/10 hidden lg:flex flex-col z-50">
                <div className="h-20 flex flex-col items-start justify-center px-8 border-b border-white/10 shrink-0 overflow-hidden relative">
                    <div className="absolute inset-y-0 left-8 flex items-center">
                        <img 
                            src="https://wnode.one/wp-content/uploads/2025/05/nodl-medium.webp" 
                            alt="nodl logo" 
                            className="h-4 w-auto scale-[3] transform origin-left"
                        />
                    </div>
                    <span className="text-[10px] font-normal tracking-[0.2em] text-slate-500 uppercase mt-12 w-full text-left">Dashboard</span>
                </div>


                
                <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3.5 px-6 py-3 text-sm font-normal border border-transparent rounded-[5px] transition-all group ${
                                    isActive
                                        ? 'bg-white/5 border-white/10 text-white shadow-sm'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                <item.icon className={`w-4 h-4 ${isActive ? 'text-cyber-cyan' : 'text-slate-500'}`} />

                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-5 border-t border-white/10 shrink-0">
                    <button className="flex items-center gap-3 px-5 py-2.5 w-full text-slate-500 hover:text-red-500 transition-all text-13px font-normal">
                        <LogOut className="w-4.5 h-4.5" /> Terminate Link
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 lg:pl-64 flex flex-col min-h-screen relative overflow-y-auto">
                {/* Internal Top Bar */}
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-8 bg-[#080808]/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        <span className="text-[10px] font-normal text-slate-500 uppercase tracking-[0.2em]">Network online</span>
                    </div>


                    <div className="flex items-center gap-5">
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*" 
                            className="hidden" 
                        />
                        <div className="flex flex-col items-end mr-6">
                            <span className="text-16px text-white font-normal tracking-tight">ACC_#4492-X</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-16px font-normal text-white tracking-tight">Stephen Nodl</span>
                            <button 
                                onClick={handlePhotoClick}
                                className="text-[10px] text-cyber-cyan hover:underline font-normal tracking-widest uppercase mt-0.5"
                            >
                                Update photo
                            </button>
                        </div>


                        <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center text-cyber-cyan font-normal text-sm">
                            {avatar ? (
                                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                            ) : (
                                "SN"
                            )}
                        </div>
                    </div>

                </header>

                {/* Content */}
                <main className="flex-1 p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
