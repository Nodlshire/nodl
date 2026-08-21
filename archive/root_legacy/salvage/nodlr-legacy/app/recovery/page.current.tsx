"use client";

import React from "react";
import CurrentNodlrDashboard from "../dashboard/page";
import RecoveredNodlrDashboard from "../dashboard/page.from-help-commit";
import MachineList from "../components/MachineList";
import AddMachineModal from "../components/AddMachineModal";

export default function NodlrRecoveryPage() {
    return (
        <div className="flex flex-col gap-8 p-4 bg-black min-h-screen text-white">
            <header className="border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold text-orange-400">Nodlr-Legacy Recovery View</h1>
                <p className="text-zinc-500">Side-by-side comparison of local Nodlr vs. help-pages commit UI.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="flex flex-col gap-4">
                    <div className="bg-zinc-900/50 p-2 border border-orange-500/30 rounded shadow-lg shadow-orange-500/5">
                        <h2 className="text-lg font-semibold text-orange-400 mb-2 underline decoration-2 underline-offset-4">
                            Section A: Current Nodlr Dashboard
                        </h2>
                        <div className="border border-zinc-800 rounded h-[600px] overflow-auto scale-90 origin-top">
                            <CurrentNodlrDashboard />
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div className="bg-zinc-900/50 p-2 border border-purple-500/30 rounded shadow-lg shadow-purple-500/5">
                        <h2 className="text-lg font-semibold text-purple-400 mb-2 underline decoration-2 underline-offset-4">
                            Section B: Recovered Nodlr Views (help/restore baseline)
                        </h2>
                        <div className="border border-zinc-800 rounded h-[600px] overflow-auto scale-90 origin-top">
                            <RecoveredNodlrDashboard />
                        </div>
                    </div>
                </section>
            </div>

            <section className="bg-zinc-900/30 p-4 border border-zinc-800 rounded">
                <h2 className="text-xl font-bold mb-4">Isolated Component Inspection</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">MachineList Component</h3>
                        <div className="border border-zinc-800 p-4 rounded">
                            <MachineList />
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-zinc-400 mb-2 uppercase tracking-wider">AddMachineModal (Component Preview)</h3>
                        <div className="border border-zinc-800 p-4 rounded">
                            <p className="text-xs text-zinc-500 mb-4 italic">Note: Component requires state to trigger. Inspecting static structure.</p>
                            <AddMachineModal isOpen={true} onClose={() => {}} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
