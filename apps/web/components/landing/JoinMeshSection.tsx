"use client";

import { Smartphone, Laptop, Server, Radio } from "lucide-react";
import { ModalMode } from "./CTAModal";

interface JoinMeshSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function JoinMeshSection({ onOpenModal }: JoinMeshSectionProps) {
    const features = [
        {
            title: "Phones",
            description: "Lightweight compute and routing.",
            icon: Smartphone,
            color: "text-blue-500",
            border: "border-blue-500/50"
        },
        {
            title: "Laptops",
            description: "Flexible, mobile mesh expansion.",
            icon: Laptop,
            color: "text-purple-500",
            border: "border-purple-500/50"
        },
        {
            title: "Servers",
            description: "High‑throughput compute execution.",
            icon: Server,
            color: "text-lime-400",
            border: "border-lime-400/50"
        },
        {
            title: "USB Radio Nodes",
            description: "Extend wireless coverage and routing.",
            icon: Radio,
            color: "text-fuchsia-500",
            border: "border-fuchsia-500/50"
        }
    ];

    return (
        <section className="py-32 bg-black border-t border-white/15 text-center">
            <div className="max-w-7xl mx-auto px-8 flex flex-col items-center">
                <div className="text-center mb-16 max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight mb-6 font-space-grotesk text-center">
                        Anyone Can Join
                    </h2>
                    <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed text-center mb-12">
                        Wnode is designed for universal accessibility. If you have a device, you can become part of the mesh — no technical expertise required. Start small, scale up, or run multiple nodes across your home, office, or community.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16 w-full">
                    {features.map((f, i) => (
                        <div key={i} className={`fade-in-section p-10 border ${f.border} rounded-2xl bg-white/[0.01] hover:bg-white/[0.03] transition-all group shadow-[0_0_20px_rgba(0,0,0,0.5)] flex flex-col items-center text-center`}>
                            <f.icon className={`w-8 h-8 ${f.color} mb-8 group-hover:scale-110 transition-transform`} />
                            <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-tight font-space-grotesk text-center">{f.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-base text-center">{f.description}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <button 
                        onClick={() => onOpenModal("beta_tester")}
                        className="bg-blue-600 hover:bg-blue-500 text-white text-lg font-bold px-12 py-5 rounded-none transition-all shadow-[0_0_40px_rgba(59,130,246,0.3)] uppercase tracking-widest"
                    >
                        Become a Node Operator
                    </button>
                </div>
            </div>
        </section>
    );
}
