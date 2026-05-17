"use client";

import React, { useState, useEffect } from "react";

interface HeaderProps {
    onContactClick: () => void;
}

export default function Header({ onContactClick }: HeaderProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            } 
            else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
                setIsVisible(false);
            }
            
            setScrolled(currentScrollY > 50);
            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: "Home", href: "/" },
        {
            name: "About",
            isDropdown: true,
            subLinks: [
                { name: "Founder's Note", href: "/about/founders-note", color: "text-slate-500" },
                { name: "Node Operator", href: "/about/node-operator", color: "text-slate-500" }
            ]
        },
        {
            name: "Governance",
            isDropdown: true,
            subLinks: [
                { name: "Governance Overview", href: "/governance/overview", color: "text-slate-500" },
                { name: "Constitution", href: "/governance/constitution", color: "text-slate-500" },
                { name: "Roles & Responsibilities", href: "/governance/roles", color: "text-slate-500" },
                { name: "Treasury Transparency", href: "/governance/treasury", color: "text-slate-500" },
                { name: "Whitepaper", href: "/governance/whitepaper", color: "text-slate-500" },
                { name: "DAO Mechanics", href: "/governance/dao", color: "text-slate-500" },
                { name: "Tokenomics", href: "/governance/tokenomics", color: "text-slate-500" },
                { name: "Investors", isHeader: true },
                { name: "Investor One-Pager", href: "/governance/investors/investor-1-pager", color: "text-slate-500" },
                { name: "Investor Relations", href: "/governance/investors/investor-relations", color: "text-slate-500" },
                { name: "Pitch Deck", href: "/governance/investors/pitchdeck", color: "text-slate-500" }
            ]
        },
        {
            name: "Legal",
            isDropdown: true,
            subLinks: [
                { name: "Terms", href: "/terms", color: "text-slate-500" },
                { name: "Privacy", href: "/privacy", color: "text-slate-500" },
                { name: "Cookies", href: "/cookies", color: "text-slate-500" }
            ]
        },
        { name: "Partners", href: "/partners" },
    ];

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    return (
        <>
            <header className={`fixed top-0 left-0 right-0 z-[80] ${
                scrolled ? "py-4 bg-black/80 backdrop-blur-xl border-b border-white/25" : "py-10 bg-transparent"
            } ${
                isVisible ? "block" : "hidden"
            }`}>
                <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                    <a href="/" className="flex items-center gap-4 group">
                        <img src="/logo.png" alt="wnode" className="w-10 h-10 transition-transform group-hover:scale-110" />
                        <div className="flex flex-col">
                            <span className="font-space-grotesk text-2xl tracking-tighter font-bold text-white uppercase leading-none">wnode</span>
                            <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mt-1">Planetary Compute Mesh</span>
                        </div>
                    </a>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-4 mr-4">
                            <a href="https://x.com/wnodemesh" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_12px_rgba(59,130,246,0.7)] transition-all">
                                <img src="/icons/x_neon.png" alt="X (Twitter)" className="h-16 w-auto brightness-125" />
                            </a>
                            <a href="https://discord.gg/5BNhsfg5Br" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_12px_rgba(34,197,94,0.7)] transition-all">
                                <img src="/icons/discord_neon.png" alt="Discord" className="h-16 w-auto brightness-125" />
                            </a>
                            <a href="https://t.me/wnodemesh" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_12px_rgba(239,68,68,0.7)] transition-all">
                                <img src="/icons/telegram_neon.png" alt="Telegram" className="h-16 w-auto brightness-125" />
                            </a>
                            <a href="https://www.youtube.com/channel/UCJsyB9UrIP1eXzkdJpPDFww" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_12px_rgba(255,0,0,0.7)] transition-all">
                                <img src="/icons/youtube_neon.png" alt="YouTube" className="h-7 w-auto brightness-125" />
                            </a>
                            <a href="https://github.com/wnodeltd/wnode" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)] transition-all">
                                <img src="/icons/gitlogo.png" alt="GitHub" className="h-9 w-auto brightness-125" />
                            </a>
                        </div>
                        
                        <button 
                            className="text-white z-[90] relative w-8 h-8 flex flex-col justify-center items-center gap-1.5"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <span className={`w-8 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
                            <span className={`w-8 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`} />
                            <span className={`w-8 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                        </button>
                    </div>
                </div>
            </header>

            <div className={`fixed inset-0 bg-black z-[70] transition-all duration-500 overflow-y-auto ${
                mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}>
                <div className="flex flex-col items-center justify-start h-full space-y-12 pt-40 pb-40">
                    {navLinks.map((link) => (
                        link.isDropdown ? (
                            <div key={link.name} className="flex flex-col items-center space-y-6">
                                <button 
                                    onClick={() => toggleDropdown(link.name)}
                                    className="text-2xl font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all flex items-center gap-4"
                                >
                                    {link.name}
                                    <span className={`transition-transform duration-300 text-slate-600 ${openDropdown === link.name ? "rotate-180" : ""}`}>↓</span>
                                </button>
                                <div className={`flex flex-col items-center space-y-6 overflow-hidden transition-all duration-500 ${openDropdown === link.name ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
                                    {link.subLinks?.map((sub) => (
                                        (sub as any).isHeader ? (
                                            <div key={sub.name} className="pt-8 pb-2">
                                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">{sub.name}</span>
                                            </div>
                                        ) : (
                                            <a 
                                                key={sub.name}
                                                href={sub.href} 
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="text-xl font-bold uppercase tracking-[0.4em] text-slate-500 hover:text-white transition-all text-center px-8"
                                            >
                                                {sub.name}
                                            </a>
                                        )
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-2xl font-bold uppercase tracking-[0.4em] text-slate-400 hover:text-white transition-all"
                            >
                                {link.name}
                            </a>
                        )
                    ))}

                    <div className="pt-8 flex flex-col items-center space-y-8">
                        <button 
                            onClick={() => {
                                setMobileMenuOpen(false);
                                onContactClick();
                            }}
                            className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg"
                        >
                            Contact
                        </button>
                        
                        <div className="flex items-center gap-8 pt-4">
                            <a href="https://x.com/wnodemesh" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.9)] transition-all">
                                <img src="/icons/x_neon.png" alt="X (Twitter)" className="h-28 w-auto brightness-125" />
                            </a>
                            <a href="https://discord.gg/5BNhsfg5Br" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_15px_rgba(34,197,94,0.9)] transition-all">
                                <img src="/icons/discord_neon.png" alt="Discord" className="h-28 w-auto brightness-125" />
                            </a>
                            <a href="https://t.me/wnodemesh" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_15px_rgba(239,68,68,0.9)] transition-all">
                                <img src="/icons/telegram_neon.png" alt="Telegram" className="h-28 w-auto brightness-125" />
                            </a>
                            <a href="https://www.youtube.com/channel/UCJsyB9UrIP1eXzkdJpPDFww" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_15px_rgba(255,0,0,0.9)] transition-all">
                                <img src="/icons/youtube_neon.png" alt="YouTube" className="h-12 w-auto brightness-125" />
                            </a>
                            <a href="https://github.com/wnodeltd/wnode" target="_blank" rel="noopener noreferrer" className="hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.9)] transition-all">
                                <img src="/icons/gitlogo.png" alt="GitHub" className="h-16 w-auto brightness-125" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
