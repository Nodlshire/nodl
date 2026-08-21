"use client";

import AppLayout from "../../../components/layout/AppLayout";

export default function GovernanceRolesPage() {
    const roles = [
        {
            title: "Founder",
            desc: "The architect and creator of the Wnode Mesh. Responsible for the initial governance framework, protocol design, and long-term strategic vision.",
            limits: "Authority is constitutionally defined and subject to progressive decentralisation.",
            authority: "Permanent seat on the Founder Board; constitutional guardianship."
        },
        {
            title: "Founder Board",
            desc: "A core body of four members (including the Founder) tasked with protecting the Mesh's long-term integrity and constitutional alignment.",
            limits: "Cannot unilaterally change the Constitution; must operate within defined emergency powers.",
            authority: "Constitutional guardianship; Steward appointment/removal; Infrastructure Manager oversight."
        },
        {
            title: "Governance Board",
            desc: "The operational oversight body responsible for validating proposals, supervising the Treasury, and ensuring DAO decisions are implemented.",
            limits: "Accountable to the DAO and Founder Board; does not hold final constitutional veto power.",
            authority: "Proposal validation; Treasury supervision; operational implementation oversight."
        },
        {
            title: "Steward",
            desc: "The commercial operator of the platform, granted authority through the Stewardship Licence to manage UX, support, and compliance.",
            limits: "Does not control governance, the Treasury, or the Token model. Licence can be revoked for cause.",
            authority: "Day-to-day platform operations; customer support; commercial management."
        },
        {
            title: "Infrastructure Manager (IM)",
            desc: "The technical authority responsible for network uptime, hardware reliability, node verification, and emergency technical response.",
            limits: "Cannot modify governance or economic parameters. Answers to the Governance Board.",
            authority: "Technical operations; node verification; emergency technical lockdown powers."
        },
        {
            title: "NODLRs",
            desc: "Verified node operators who contribute compute power to the Mesh and hold Voting Souls.",
            limits: "Must maintain hardware standards and pass identity/technical verification.",
            authority: "Primary DAO voters; revenue earners; proposal submitters."
        },
        {
            title: "Souls (Locked & Voting)",
            desc: "The core identity unit of the Mesh. Locked Souls are identity-only; Voting Souls are earned through node operation.",
            limits: "Non-transferable; 1 Soul = 1 Vote; subject to revocation for fraud.",
            authority: "Participation in DAO governance; representation in the community."
        }
    ];

    return (
        <AppLayout>
            <div className="bg-black text-white min-h-screen pt-40 pb-40 px-6 md:px-12">
                <div className="max-w-4xl mx-auto space-y-12">
                    
                    <div className="space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-space-grotesk uppercase">Roles & Responsibilities</h1>
                        <p className="text-slate-400 max-w-2xl leading-relaxed">
                            A clear definition of duties, limits, and authority within the Wnode governance architecture.
                        </p>
                    </div>

                    <div className="space-y-16 pt-8">
                        {roles.map((role, i) => (
                            <section key={i} className="group space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className="text-blue-500 font-mono text-xs font-black">0{i + 1}</span>
                                    <h2 className="text-xl font-bold text-white uppercase tracking-tight font-space-grotesk group-hover:text-blue-500 transition-colors">
                                        {role.title}
                                    </h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-8 border-l border-white/5 group-hover:border-blue-500/30 transition-colors">
                                    <div className="space-y-4">
                                        <p className="text-slate-300 text-sm leading-relaxed">{role.desc}</p>
                                    </div>
                                    <div className="space-y-4 text-[11px] uppercase tracking-widest leading-loose">
                                        <div>
                                            <span className="text-slate-500 block mb-1">Authority</span>
                                            <span className="text-blue-400 font-bold">{role.authority}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 block mb-1">Limits</span>
                                            <span className="text-slate-400 font-bold">{role.limits}</span>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
