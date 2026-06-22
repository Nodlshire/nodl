"use client";

import { useEffect, useState } from "react";

export default function EcosystemRibbon() {
    const [icons, setIcons] = useState<{name: string, filename: string}[]>([]);

    const curatedIcons = [
        { name: 'Ethereum', filename: 'ethereum.svg' },
        { name: 'Bitcoin', filename: 'bitcoin.svg' },
        { name: 'Solana', filename: 'solana.svg' },
        { name: 'Polygon', filename: 'polygon.svg' },
        { name: 'Avalanche', filename: 'avalanche.svg' },
        { name: 'Coinbase', filename: 'coinbase.svg' },
        { name: 'Stripe', filename: 'stripe.svg' },
        { name: 'Chainlink', filename: 'chainlink.svg' },
        { name: 'Filecoin', filename: 'filecoin.svg' },
        { name: 'Arweave', filename: 'arweave.svg' },
        { name: 'Optimism', filename: 'optimism.svg' },
        { name: 'Base', filename: 'base.svg' },
        { name: 'Binance', filename: 'binance.svg' },
        { name: 'Circle', filename: 'circle.svg' },
        { name: 'Aave', filename: 'aave.svg' },
        { name: 'Uniswap', filename: 'uniswap.svg' },
        { name: 'MakerDAO', filename: 'makerdao.svg' },
        { name: 'Lido', filename: 'lido.svg' },
        { name: 'Rocket Pool', filename: 'rocketpool.svg' }
    ];

    useEffect(() => {
        setIcons(curatedIcons);
    }, []);

    // Don't render until we have loaded the icons to prevent hydration mismatch or empty ribbon
    if (!icons.length) return null;

    return (
        <section className="w-full bg-black pt-16 fade-in-section overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-white uppercase tracking-tighter mb-6 font-space-grotesk">
                        The Unifying Infrastructure Layer for Everything Web3
                    </h2>
                    <p className="text-lg text-blue-500 font-medium leading-relaxed max-w-4xl mx-auto">
                        Connecting Every Compute Network, Agent, and Protocol into One Unified Layer.
                    </p>
                </div>
            </div>

            <div className="w-full border-y border-[#00FF9D]/15 py-12 relative flex overflow-hidden group">
                <style>{`
                    @keyframes customMarquee {
                        0% { transform: translateX(0%); }
                        100% { transform: translateX(-50%); }
                    }
                    .animate-marquee-custom {
                        /* Calm, readable pace for 20 items */
                        animation: customMarquee 80s linear infinite;
                    }
                `}</style>
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
                
                {/* Marquee Track */}
                <div className="flex w-max animate-marquee-custom hover:[animation-play-state:paused]">
                    {/* First Set */}
                    <div className="flex min-w-max gap-12 px-6 items-center">
                        {icons.map((icon, idx) => (
                            <div key={`int1-${idx}`} className="flex flex-col items-center gap-3 group/item w-28 shrink-0">
                                <div className="h-14 w-full flex items-center justify-center opacity-70 group-hover/item:opacity-100 transition-opacity duration-300">
                                    <img 
                                        src={`/icons/${icon.filename}`}
                                        alt={icon.name} 
                                        className="max-h-full max-w-full object-contain filter group-hover/item:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="text-[11px] text-white/50 uppercase tracking-widest font-semibold group-hover/item:text-blue-400 transition-colors text-center truncate w-full px-2">
                                    {icon.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Duplicate for infinite loop */}
                    <div className="flex min-w-max gap-12 px-6 items-center" aria-hidden="true">
                        {icons.map((icon, idx) => (
                            <div key={`int2-${idx}`} className="flex flex-col items-center gap-3 group/item w-28 shrink-0">
                                <div className="h-14 w-full flex items-center justify-center opacity-70 group-hover/item:opacity-100 transition-opacity duration-300">
                                    <img 
                                        src={`/icons/${icon.filename}`}
                                        alt={icon.name} 
                                        className="max-h-full max-w-full object-contain filter group-hover/item:drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-all duration-300"
                                        loading="lazy"
                                    />
                                </div>
                                <span className="text-[11px] text-white/50 uppercase tracking-widest font-semibold group-hover/item:text-blue-400 transition-colors text-center truncate w-full px-2">
                                    {icon.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
