interface StatCardProps {
    label: string;
    value: string | number;
    subValue?: string;
    trend?: "up" | "down" | "neutral";
    variant?: "cyan" | "violet";
}

export default function StatCard({ label, value, subValue, trend, variant = "cyan" }: StatCardProps) {
    const borderColor = variant === "cyan" ? "gradient-border-cyan" : "gradient-border-violet";
    const glowColor = variant === "cyan" ? "glow-cyan" : "glow-violet";

    return (
        <div className="p-6 rounded-[5px] border border-white/10 bg-black/40 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-black/60 shadow-lg group">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-600 mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-white tracking-tighter uppercase">{value}</h3>

                {subValue && <span className="text-xs font-bold text-slate-500 tracking-widest">{subValue}</span>}
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-1.5">
                    <div className={`w-1 h-1 ${trend === "up" ? "bg-cyber-cyan shadow-[0_0_8px_rgba(0,242,255,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`} />
                    <span className="text-[9px] uppercase text-slate-500 font-bold tracking-widest">
                        {trend === "up" ? "+12.4%" : "-2.1%"} volatility
                    </span>
                </div>

            )}
        </div>
    );
}
