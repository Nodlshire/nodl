'use client';

export default function LoadingSkeleton() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#000000]">
            <div className="relative">
                {/* Minimalist Spinner */}
                <div className="w-16 h-16 border border-white/5 border-t-cyber-cyan rounded-full animate-spin" />
                <div className="absolute inset-0 m-auto w-4 h-4 bg-cyber-cyan opacity-20 rounded-full animate-pulse" />
            </div>

            <div className="mt-8 space-y-2 text-center pointer-events-none">
                <h2 className="text-[10px] font-normal uppercase tracking-[0.3em] text-slate-500 animate-pulse">
                    Command OS Synchronizing
                </h2>
                <div className="flex gap-1.5 justify-center">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-1 h-1 bg-cyber-cyan/30 rounded-full"
                            style={{ animation: `pulse 1.5s infinite ${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
