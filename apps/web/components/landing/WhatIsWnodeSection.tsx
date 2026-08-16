export default function WhatIsWnodeSection() {
    return (
        <section className="py-32 bg-black border-t border-white/15 text-center">
            <div className="max-w-6xl w-full mx-auto text-center px-8 flex flex-col items-center fade-in-section">
                <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wider leading-tight font-space-grotesk mb-8 text-center">
                    A Sovereign Network Built From Everyday Devices
                </h2>
                
                <p className="text-xl md:text-2xl text-slate-400 max-w-5xl mx-auto leading-relaxed mb-16 text-center">
                    Wnode is a decentralized physical infrastructure network (DePIN) combined with a decentralized wireless mesh (DeWi). It turns everyday hardware into part of a planetary grid capable of compute execution, telemetry routing, and micro‑ISP connectivity. No datacenters. No gatekeepers. Just devices forming a sovereign network.
                </p>
                
                {/* KEEP_THIS: devices.png */}
                <div className="relative group w-full">
                    <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
                    <img 
                        src="/devices.png" 
                        alt="Wenode Ecosystem" 
                        className="relative w-full h-auto rounded-[2rem] border border-white/15 shadow-2xl transition-all duration-700 group-hover:border-blue-500/20" 
                    />
                </div>
            </div>
        </section>
    );
}
