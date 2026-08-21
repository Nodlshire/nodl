"use client";

import React from "react";
import CurrentCommandUI from "../page";
import RecoveredCommandUI from "../page.from-help-commit";

export default function CommandRecoveryPage() {
    return (
        <div className="flex flex-col gap-8 p-4 bg-black min-h-screen text-white">
            <header className="border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold text-blue-400">Command Recovery View</h1>
                <p className="text-zinc-500">Side-by-side comparison of local vs. help-pages commit UI.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="flex flex-col gap-4">
                    <div className="bg-zinc-900/50 p-2 border border-blue-500/30 rounded shadow-lg shadow-blue-500/5">
                        <h2 className="text-lg font-semibold text-blue-400 mb-2 underline decoration-2 underline-offset-4">
                            Section A: Current Command UI
                        </h2>
                        <div className="border border-zinc-800 rounded h-[600px] overflow-auto scale-90 origin-top">
                            <CurrentCommandUI />
                        </div>
                    </div>
                </section>

                <section className="flex flex-col gap-4">
                    <div className="bg-zinc-900/50 p-2 border border-purple-500/30 rounded shadow-lg shadow-purple-500/5">
                        <h2 className="text-lg font-semibold text-purple-400 mb-2 underline decoration-2 underline-offset-4">
                            Section B: Recovered Command UI (help/restore baseline)
                        </h2>
                        <div className="border border-zinc-800 rounded h-[600px] overflow-auto scale-90 origin-top">
                            <RecoveredCommandUI />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
