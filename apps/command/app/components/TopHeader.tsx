"use client";

import React from "react";
import { usePageTitle } from "./PageTitleContext";
import IdentityHeader from "@shared/components/IdentityHeader";
import { ChevronRight, Menu } from "lucide-react";

export default function TopHeader({ setIsMobileMenuOpen }: { setIsMobileMenuOpen: (open: boolean) => void }) {
    const { pageTitle, pageSubtitle } = usePageTitle();

    return (
        <header className="sticky top-0 z-40 w-full bg-black/60 backdrop-blur-md border-b border-wnode-border-separator px-4 lg:px-8 py-3 lg:py-4 flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2 lg:gap-3">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-1.5 -ml-1.5 text-white/70 hover:text-white rounded-md hover:bg-white/5 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
                        {pageTitle || "Overview"}
                    </h1>
                </div>
                {pageSubtitle && (
                    <p className="text-[11px] text-white/40 font-medium tracking-tight mt-0.5">
                        {pageSubtitle}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-4">
                <IdentityHeader />
            </div>
        </header>
    );
}
