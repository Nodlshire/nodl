import AppLayout from "../../components/layout/AppLayout";

export default function PrivacyPage() {
    return (
        <AppLayout>
            <div className="relative pt-40 pb-24 px-8">

                <div className="max-w-4xl mx-auto">
                <div className="fade-in-section">
                    <h1 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter uppercase">Privacy Policy</h1>
                    
                    <div className="space-y-16 text-slate-400 text-lg md:text-xl leading-relaxed font-light">
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-6">Wenode Ltd. Privacy Policy</h2>
                            <p className="text-white font-medium mb-4">Last Updated: April 2026</p>
                            <p className="text-slate-500 italic">Registered Address: Unit A, 82 James Carter Road, Mildenhall Industrial Estate, Suffolk, United Kingdom, IP28 7DE.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">1. Global Compliance Framework</h2>
                            <p>
                                Wenode Ltd. operates as a UK entity and is committed to upholding the highest global data protection standards, 
                                including the <span className="text-white">UK GDPR</span>, <span className="text-white">EU GDPR</span>, 
                                and <span className="text-white">US Privacy Requirements</span> (including CCPA/CPRA).
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">2. Data Sovereignty & Minimization</h2>
                            <p>
                                Our architecture is built on <span className="text-white">Data Minimization</span>. 
                                We collect only the information necessary to facilitate the decentralized mesh. 
                                We do not sell or trade user data.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">3. Information We Collect</h2>
                            <ul className="space-y-6">
                                <li><strong className="text-white">Account Data:</strong> Email and Nodlr ID for secure access and commission payouts.</li>
                                <li><strong className="text-white">Telemetry:</strong> Node performance data (uptime, capacity) used strictly for mesh optimization.</li>
                                <li><strong className="text-white">Inquiries:</strong> Data submitted via our contact form is used solely to facilitate your request.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">4. Data Subject Rights</h2>
                            <p>
                                Regardless of your location, we honor your rights to access, delete, or port your data. 
                                For all privacy requests or to exercise your rights under EU/US/UK law, please contact our privacy team at 
                                <a href="mailto:team1@wnode.one" className="text-blue-500 hover:text-blue-400 ml-2 transition-colors">team1@wnode.one</a>.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
    );
}
