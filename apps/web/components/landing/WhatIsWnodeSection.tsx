export default function WhatIsWnodeSection() {
    return (
        <section className="py-32 bg-black border-t border-white/15">
            <div className="max-w-6xl mx-auto text-center px-8 fade-in-section">
                <h2 className="text-2xl md:text-4xl font-bold text-white tracking-wider leading-tight font-space-grotesk mb-16">
                    Wenode Is A Sovereign Mesh Of Compute Power. <br />
                    <span className="text-blue-500">No Central Authority. No Gatekeepers. No Datacentres</span> <br />
                    Just Pure, Autonomous Power For Web 4 And AI
                </h2>
                
                {/* KEEP_THIS: devices.png */}
                <div className="relative group">
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
