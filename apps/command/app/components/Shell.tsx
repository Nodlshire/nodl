"use client";

import React, { useState } from "react";
import Link from "next/link";
import Sidebar from "./Sidebar";
import IdentityHeader from "@shared/components/IdentityHeader";
import { PageTitleProvider, usePageTitle } from "./PageTitleContext";


import TopHeader from "./TopHeader";

export default function Shell({ children }: { children: React.ReactNode }) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <PageTitleProvider>
            <div className="flex h-screen bg-black text-white/80 overflow-hidden font-sans selection:bg-cyan-500/30">
                <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
                <div className="flex-1 lg:pl-64 flex flex-col min-w-0 bg-neutral-950 relative">
                    <TopHeader setIsMobileMenuOpen={setIsMobileMenuOpen} />
                    <div className="flex-1 relative flex flex-col items-stretch w-full overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                </div>
            </div>
        </PageTitleProvider>
    );
}
