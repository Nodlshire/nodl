'use client';

export default function LoadingSkeleton() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-obsidian/80 backdrop-blur-xl">
            <div className="relative">
                {/* Spinning Outer Ring */}
                <div className="w-24 h-24 border-2 border-cyber-cyan/20 border-t-cyber-cyan rounded-full animate-spin" />

                {/* Inner Glitch Square */}
                <div className="absolute inset-0 m-auto w-8 h-8 bg-cyber-cyan rotate-45 animate-pulse shadow-[0_0_20px_rgba(0,240,255,0.5)]" />
            </div>

            <div className="mt-8 space-y-2 text-center pointer-events-none">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white animate-pulse">
                    System Initializing
                </h2>
                <div className="flex gap-1 justify-center">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1 h-1 bg-cyber-cyan/50"
                            style={{ animation: `pulse 1.5s infinite ${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>

            {/* Background Grid decorative element */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>
    );
}
