import { Bot, Activity, Layers, Code2 } from "lucide-react";

export default function DevelopersSection() {
    const features = [
        {
            title: "Agent Execution",
            description: "Run AI agents across thousands of nodes.",
            icon: Bot,
            color: "text-blue-500",
            border: "border-blue-500/50"
        },
        {
            title: "Telemetry Streams",
            description: "Real‑time data flows across the mesh.",
            icon: Activity,
            color: "text-purple-500",
            border: "border-purple-500/50"
        },
        {
            title: "Distributed Jobs",
            description: "Break workloads into parallel tasks.",
            icon: Layers,
            color: "text-lime-400",
            border: "border-lime-400/50"
        },
        {
            title: "Open APIs",
            description: "Build directly on the mesh.",
            icon: Code2,
            color: "text-fuchsia-500",
            border: "border-fuchsia-500/50"
        }
    ];

    return (
        <section className="py-32 bg-black border-t border-white/15 text-center">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6 font-space-grotesk text-center">
                        A Mesh Developers Can Build On
                    </h2>
                    <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed text-center">
                        Developers can deploy workloads, run distributed jobs, stream telemetry, and build applications that leverage the planetary mesh. Wnode provides a sovereign execution layer for AI agents, distributed apps, and real‑time systems.
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
