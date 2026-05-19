import React from "react";
interface FooterProps {
    onContactClick?: () => void;
}

export default function Footer({ onContactClick }: FooterProps) {
    return (
        <footer className="py-20 bg-black border-t border-white/15">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center gap-16">
                <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 relative z-50">
                    <div className="flex items-center gap-4">
                        <img src="/logo.png" alt="wnode" className="w-10 h-10" />
                        <div className="flex flex-col text-left">
                            <span className="font-space-grotesk text-2xl tracking-tighter font-bold text-white uppercase leading-none">wnode</span>
                            <span className="text-[10px] uppercase tracking-widest text-blue-500 font-bold mt-1">Planetary Compute Mesh</span>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center items-center gap-10 relative z-50">
                        <a href="/" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Home</a>
                        
                        <div className="relative group py-2 -my-2">
                            <button className="text-white/40 group-hover:text-white transition-colors text-xs uppercase tracking-[0.2em] cursor-default flex items-center gap-2">
                                About
                                <span className="text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">↑</span>
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-8 pointer-events-none group-hover:pointer-events-auto" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black border border-white/25 p-6 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all flex flex-col gap-4 min-w-[200px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                                <a href="/about/founders-note" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Founder's Note</a>
                                <a href="/about/node-operator" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Node Operator</a>
                            </div>
                        </div>

                        <div className="relative group py-2 -my-2">
                            <button className="text-white/40 group-hover:text-white transition-colors text-xs uppercase tracking-[0.2em] cursor-default flex items-center gap-2">
                                Governance
                                <span className="text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">↑</span>
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-8 pointer-events-none group-hover:pointer-events-auto" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black border border-white/25 p-6 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all flex flex-col gap-4 min-w-[280px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                                <a href="/governance/overview" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Governance Overview</a>
                                <a href="/governance/constitution" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Constitution</a>
                                <a href="/governance/roles" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Roles & Responsibilities</a>
                                <a href="/governance/treasury" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Treasury Transparency</a>
                                <a href="/governance/whitepaper" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Whitepaper</a>
                                <a href="/governance/dao" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">DAO Mechanics</a>
                                <a href="/governance/tokenomics" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Tokenomics</a>
                                <div className="h-px bg-white/10 my-1" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-blue-500/60 mt-2">Investors</span>
                                <a href="/governance/investors/investor-1-pager" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Investor One-Pager</a>
                                <a href="/governance/investors/investor-relations" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Investor Relations</a>
                                <a href="/governance/investors/pitchdeck" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Pitch Deck</a>
                            </div>
                        </div>

                        <div className="relative group py-2 -my-2">
                            <button className="text-white/40 group-hover:text-white transition-colors text-xs uppercase tracking-[0.2em] cursor-default flex items-center gap-2">
                                Legal
                                <span className="text-[10px] opacity-30 group-hover:opacity-100 transition-opacity">↑</span>
                            </button>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-full h-8 pointer-events-none group-hover:pointer-events-auto" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-black border border-white/25 p-6 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all flex flex-col gap-4 min-w-[220px] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] backdrop-blur-xl">
                                <a href="/terms" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Terms</a>
                                <a href="/privacy" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Privacy</a>
                                <a href="/cookies" className="text-white/40 hover:text-white text-[10px] uppercase tracking-widest transition-colors">Cookies</a>
                            </div>
                        </div>

                        <a href="/partners" className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]">Partners</a>
                        <button 
                            onClick={(e) => {
                                if (onContactClick) {
                                    e.preventDefault();
                                    onContactClick();
                                }
                            }}
                            className="text-white/40 hover:text-white transition-colors text-xs uppercase tracking-[0.2em]"
                        >
                            Contact
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center gap-10">
                    <div className="flex items-center gap-6">
                        <a href="https://x.com/wnodemesh" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#3b82f6] hover:scale-110 transition-all duration-300">
                            <img src="/icons/x_neon.png" alt="X (Twitter)" className="h-14 w-auto brightness-125" />
                        </a>
                        <a href="https://discord.gg/5BNhsfg5Br" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#22c55e] hover:scale-110 transition-all duration-300">
                            <img src="/icons/discord_neon.png" alt="Discord" className="h-14 w-auto brightness-125" />
                        </a>
                        <a href="https://t.me/wnodemesh" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#ef4444] hover:scale-110 transition-all duration-300">
                            <img src="/icons/telegram_neon.png" alt="Telegram" className="h-14 w-auto brightness-125" />
                        </a>
                        <a href="https://www.youtube.com/channel/UCJsyB9UrIP1eXzkdJpPDFww" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#ff0000] hover:scale-110 transition-all duration-300">
                            <img src="/icons/youtube_neon.png" alt="YouTube" className="h-6 w-auto brightness-125" />
                        </a>
                        <a href="https://github.com/wnodeltd/wnode" target="_blank" rel="noopener noreferrer" className="inline-block hover:drop-shadow-[0_0_20px_#ffffff] hover:scale-110 transition-all duration-300">
                            <img src="/icons/gitlogo.png" alt="GitHub" className="h-8 w-auto brightness-125" />
                        </a>
                    </div>

                    <div className="text-white/20 font-bold uppercase tracking-widest text-[10px]">
                        wnode © 2026
                    </div>
                </div>
            </div>
        </footer>
    );
}
