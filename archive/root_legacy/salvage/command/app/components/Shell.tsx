"use client";

import React from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import IdentityHeader from "@shared/components/IdentityHeader";
import { PageTitleProvider, usePageTitle } from "./PageTitleContext";

function HeaderContent() {
    const { pageTitle, pageSubtitle } = usePageTitle();
    return (
        <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 border-b border-white/[0.05] flex items-center justify-between px-8 bg-[#02040c]/60 backdrop-blur-3xl z-[60] shrink-0">
            <div className="flex flex-col justify-center">
                <h1 className="text-xl font-bold tracking-tight text-white mb-0.5 leading-none drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    {pageTitle}
                </h1>
                {pageSubtitle && (
                    <p className="text-[10px] uppercase font-bold tracking-[0.05em] text-[#22D3EE]/60 leading-none mt-1">
                        {pageSubtitle}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-6">
                <IdentityHeader />
            </div>
        </header>
    );
}

export default function Shell({ children }: { children: React.ReactNode }) {
    return (
        <PageTitleProvider>
            <div className="flex h-screen bg-black text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
                <Sidebar />
                <div className="flex-1 lg:pl-64 flex flex-col min-w-0 bg-neutral-950 overflow-hidden relative">
                    <HeaderContent />
                    <div className="flex-1 overflow-auto relative flex flex-col items-stretch w-full min-h-full pt-16">
                        {children}
                    </div>
                </div>
            </div>
        </PageTitleProvider>
    );
}
