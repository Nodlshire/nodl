"use client";

import Link from "next/link";

const validIntegrations = [
    { name: "solana", label: "Solana", ext: "svg" },
    { name: "cardano", label: "Cardano", ext: "svg" },
    { name: "ripple", label: "Ripple", ext: "svg" },
    { name: "base", label: "Base", ext: "svg" },
    { name: "polygon", label: "Polygon", ext: "svg" },
    { name: "avalanche", label: "Avalanche", ext: "svg" },
    { name: "optimism", label: "Optimism", ext: "svg" },
    { name: "near", label: "Near", ext: "svg" },
    { name: "celestia", label: "Celestia", ext: "svg" },
    { name: "filecoin", label: "Filecoin", ext: "svg" },
    { name: "arweave", label: "Arweave", ext: "svg" },
    { name: "helium", label: "Helium", ext: "svg" },
    { name: "chainlink", label: "Chainlink", ext: "svg" },
    { name: "thegraph", label: "The Graph", ext: "svg" },
    { name: "peaq", label: "Peaq", ext: "svg" },
    { name: "fireblocks", label: "Fireblocks", ext: "svg" },
    { name: "mintlayer", label: "Mintlayer", ext: "svg" },
    { name: "bluefin", label: "Bluefin", ext: "svg" },
    { name: "bitso", label: "Bitso", ext: "svg" },
    { name: "flutterwave", label: "Flutterwave", ext: "svg" },
    { name: "akash", label: "Akash", ext: "svg" },
    { name: "zerofs", label: "ZeroFS", ext: "svg" },
    { name: "uniswap", label: "Uniswap", ext: "svg" },
    { name: "aave", label: "Aave", ext: "svg" },
    { name: "makerdao", label: "MakerDAO", ext: "svg" },
    { name: "wormhole", label: "Wormhole", ext: "svg" },
    { name: "lido", label: "Lido", ext: "svg" },
    { name: "ens", label: "ENS", ext: "svg" },
    { name: "fantom", label: "Fantom", ext: "svg" },
    { name: "mantle", label: "Mantle", ext: "svg" }
];

export default function EcosystemRibbon() {
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
                        animation: customMarquee 50s linear infinite;
                    }
                `}</style>
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />
                
                {/* Marquee Track */}
                <div className="flex w-max animate-marquee-custom">
                    {/* First Set */}
                    <div className="flex min-w-max gap-16 px-8 items-center">
                        {validIntegrations.map((integration, idx) => (
                            <div key={`int1-${idx}`} className="flex flex-col items-center gap-4 group/item w-32 shrink-0">
                                <div className="h-12 w-full flex items-center justify-center opacity-60 group-hover/item:opacity-100 transition-opacity duration-300">
                                    <img 
                                        src={`/integrations/${integration.name}/${integration.name}logo.${integration.ext}`}
                                        alt={integration.label} 
                                        className="max-h-full max-w-full object-contain filter group-hover/item:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-300"
                                    />
                                </div>
                                <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold group-hover/item:text-blue-400 transition-colors text-center">
                                    {integration.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Duplicate for infinite loop */}
                    <div className="flex min-w-max gap-16 px-8 items-center" aria-hidden="true">
                        {validIntegrations.map((integration, idx) => (
                            <div key={`int2-${idx}`} className="flex flex-col items-center gap-4 group/item w-32 shrink-0">
                                <div className="h-12 w-full flex items-center justify-center opacity-60 group-hover/item:opacity-100 transition-opacity duration-300">
                                    <img 
                                        src={`/integrations/${integration.name}/${integration.name}logo.${integration.ext}`}
                                        alt={integration.label} 
                                        className="max-h-full max-w-full object-contain filter group-hover/item:drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] transition-all duration-300"
                                    />
                                </div>
                                <span className="text-[10px] text-white/50 uppercase tracking-widest font-bold group-hover/item:text-blue-400 transition-colors text-center">
                                    {integration.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
