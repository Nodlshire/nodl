import React from "react";
interface FooterProps {
    onContactClick?: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
    return (
        <footer className="py-20 bg-black border-t border-white/15">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-16">
                
                {/* 1. Logo and Text at Top Center */}
                <div className="flex flex-col items-center gap-4">
                    <img src="/logo.png" alt="WeNode" className="w-12 h-12" />
                    <div className="flex flex-col text-center">
                        <span className="font-space-grotesk text-3xl tracking-tighter font-bold text-white leading-none">WeNode</span>
                        <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mt-2">AI Powered Planetary & Orbital Compute Mesh</span>
                    </div>
                </div>
                
                {/* 2. Menu Columns (Evenly Spread) */}
                <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-row lg:justify-between gap-8 text-center md:text-left">
                    {/* Home */}
                    <div className="flex flex-col gap-4">
                        <a href="/" className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-2">Home</a>
                    </div>
                    
                    {/* About */}
                    <div className="flex flex-col gap-4">
                        <span className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-2">About</span>
                        <a href="/about/founders-bio-note" className="text-white/70 hover:text-white text-xs transition-colors">Founder's Bio & Note</a>
                        <a href="/about/node-operator" className="text-white/70 hover:text-white text-xs transition-colors">Earth Mesh</a>
                        <a href="/about/space-mesh" className="text-white/70 hover:text-white text-xs transition-colors">Space Mesh</a>
                        <a href="/docs" className="text-white/70 hover:text-white text-xs transition-colors">Documentation</a>
                    </div>
                    
                    {/* Governance */}
                    <div className="flex flex-col gap-4">
                        <span className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-2">Governance</span>
                        <a href="/governance/overview" className="text-white/70 hover:text-white text-xs transition-colors">Governance Overview</a>
                        <a href="/governance/constitution" className="text-white/70 hover:text-white text-xs transition-colors">Constitution</a>
                        <a href="/governance/roles" className="text-white/70 hover:text-white text-xs transition-colors">Roles & Responsibilities</a>
                        <a href="/governance/treasury" className="text-white/70 hover:text-white text-xs transition-colors">Treasury Transparency</a>
                        <a href="/governance/dao" className="text-white/70 hover:text-white text-xs transition-colors">DAO Mechanics</a>
                        <a href="/governance/tokenomics" className="text-white/70 hover:text-white text-xs transition-colors">Tokenomics</a>
                    </div>

                    {/* Partners */}
                    <div className="flex flex-col gap-4">
                        <span className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-2">Partners</span>
                        <a href="/partners" className="text-white/70 hover:text-white text-xs transition-colors">Tech Partners</a>
                        <a href="/chp" className="text-white/70 hover:text-white text-xs transition-colors">VIP 合作伙伴</a>
                    </div>

                    {/* Investors */}
                    <div className="flex flex-col gap-4">
                        <span className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-2">Investors</span>
                        <a href="/investors/whitepaper" className="text-white/70 hover:text-white text-xs transition-colors">Whitepaper</a>
                        <a href="/investors/dr" className="text-white/70 hover:text-white text-xs transition-colors">Data Room</a>
                    </div>

                    {/* Legal */}
                    <div className="flex flex-col gap-4">
                        <span className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-2">Legal</span>
                        <a href="/terms" className="text-white/70 hover:text-white text-xs transition-colors">Terms</a>
                        <a href="/privacy" className="text-white/70 hover:text-white text-xs transition-colors">Privacy</a>
                        <a href="/cookies" className="text-white/70 hover:text-white text-xs transition-colors">Cookies</a>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={(e) => {
                                if (onContactClick) {
                                    e.preventDefault();
                                    onContactClick();
                                }
                            }}
                            className="text-white text-left md:text-left text-xs font-bold uppercase tracking-[0.2em] mb-2 hover:text-white/80 transition-colors"
                        >
                            Contact
                        </button>
                    </div>
                </div>

                {/* Bottom Section: Socials, Address, Copyright */}
                <div className="flex flex-col items-center gap-6 w-full pt-10 border-t border-white/10">
                    <div className="flex items-center gap-6">
                        <a href="https://x.com/wnodemesh" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#3b82f6] hover:scale-110 transition-all duration-300">
                            <img src="/icons/x_neon.png" alt="X (Twitter)" className="h-14 w-auto brightness-125" />
                        </a>
                        <a href="https://discord.gg/5BNhsfg5Br" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#2563eb] hover:scale-110 transition-all duration-300">
                            <img src="/icons/discord_neon.png" alt="Discord" className="h-14 w-auto brightness-125" />
                        </a>
                        <a href="https://t.me/wnodemesh" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#ec4899] hover:scale-110 transition-all duration-300">
                            <img src="/icons/telegram_neon.png" alt="Telegram" className="h-14 w-auto brightness-125" />
                        </a>
                        <a href="https://wa.me/447458197900" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#22c55e] hover:scale-110 transition-all duration-300">
                            <img src="/icons/whatsapp_neon.png" alt="WhatsApp" className="h-14 w-auto brightness-125" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCJsyB9UrIP1eXzkdJpPDFww" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#ff0000] hover:scale-110 transition-all duration-300">
                            <img src="/icons/youtube_neon.png" alt="YouTube" className="h-6 w-auto brightness-125" />
                        </a>
                        <a href="https://github.com/wnodeltd/wnode" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#ffffff] hover:scale-110 transition-all duration-300">
                            <img src="/icons/gitlogo.png" alt="GitHub" className="h-8 w-auto brightness-125" />
                        </a>
                    </div>
                    
                    <div className="text-white/40 text-[10px] tracking-widest text-center mt-2">
                        Unit A 82 James Carter Road, Mildenhall Industrial Estate, Suffolk, United Kingdom, IP28 7DE
                    </div>

                    <div className="text-white/20 font-bold uppercase tracking-widest text-[10px] mt-2">
                        WeNode © 2026
                    </div>
                </div>
            </div>
        </footer>
    );
}
