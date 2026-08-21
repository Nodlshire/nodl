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
        <div className="p-6 rounded-[5px] surface-card transition-all hover:bg-white/[0.02]">
            <p className="text-[10px] font-normal uppercase tracking-widest text-slate-500 mb-2">{label}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-normal text-white tracking-tighter">{value}</h3>

                {subValue && <span className="text-sm  text-slate-400">{subValue}</span>}
            </div>
            {trend && (
                <div className="mt-4 flex items-center gap-1">
                    <div className={`w-1.5 h-1.5 rounded-full ${trend === "up" ? "bg-green-500" : "bg-red-500"}`} />
                    <span className="text-[10px] uppercase text-slate-500 font-normal">
                        {trend === "up" ? "+12.4%" : "-2.1%"} volatility
                    </span>
                </div>

            )}
        </div>
    );
}
