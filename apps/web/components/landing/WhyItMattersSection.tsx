import { Cpu, Zap, Shield, BarChart3 } from "lucide-react";

export default function WhyItMattersSection() {
    const features = [
        {
            title: "Encrypted Compute",
            description: "Devices run jobs without ever seeing the data.",
            icon: Cpu,
            color: "text-blue-500",
            border: "border-blue-500/50"
        },
        {
            title: "Wireless Routing",
            description: "Nodes forward traffic and extend coverage as part of the DeWi layer.",
            icon: Zap,
            color: "text-purple-500",
            border: "border-purple-500/50"
        },
        {
            title: "Planetary Mesh",
            description: "A global grid formed from thousands of independent devices.",
            icon: Shield,
            color: "text-lime-400",
            border: "border-lime-400/50"
        },
        {
            title: "Zero Storage",
            description: "No data is stored on nodes; everything is streamed and ephemeral.",
            icon: BarChart3,
            color: "text-fuchsia-500",
            border: "border-fuchsia-500/50"
        }
    ];

    return (
        <section className="py-32 bg-black border-t border-white/15 text-center">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6 font-space-grotesk text-center">
                        Your Devices Become Part of the Planetary Mesh
                    </h2>
                    <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed text-center">
                        Wnode streams encrypted workloads to nodes without storing user data. Nodes execute compute jobs, route wireless traffic, and participate in the global mesh. Telemetry flows through the network in real time, enabling verifiable work and trustless payouts.
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
