import { Shield, Users, Globe, Cpu } from "lucide-react";

export default function WhyDePINSection() {
    const features = [
        {
            title: "Resilient Infrastructure",
            description: "No single point of failure.",
            icon: Shield,
            color: "text-blue-500",
            border: "border-blue-500/50"
        },
        {
            title: "Community‑Owned",
            description: "Built and operated by individuals, not corporations.",
            icon: Users,
            color: "text-purple-500",
            border: "border-purple-500/50"
        },
        {
            title: "Global Reach",
            description: "Nodes anywhere expand the planetary grid.",
            icon: Globe,
            color: "text-lime-400",
            border: "border-lime-400/50"
        },
        {
            title: "Sovereign Compute",
            description: "Infrastructure controlled by its operators.",
            icon: Cpu,
            color: "text-fuchsia-500",
            border: "border-fuchsia-500/50"
        }
    ];

    return (
        <section className="py-32 bg-black border-t border-white/15 text-center">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6 font-space-grotesk text-center">
                        A New Infrastructure Layer for the Planet
                    </h2>
                    <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed text-center">
                        Centralized cloud and telecom systems are fragile, expensive, and controlled by a few. Wnode replaces them with a sovereign mesh powered by people — devices forming a decentralized backbone for compute, connectivity, and routing.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                    {features.map((f, i) => (
                        <div key={i} className={`fade-in-section p-10 border ${f.border} rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-all group shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center text-center`}>
                            <f.icon className={`w-8 h-8 ${f.color} mb-8 group-hover:scale-110 transition-transform`} />
                            <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-tight font-space-grotesk text-center">{f.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-base text-center">{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
