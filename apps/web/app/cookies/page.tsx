import AppLayout from "../../components/layout/AppLayout";

export default function CookiePage() {
    return (
        <AppLayout>
            <div className="relative pt-40 pb-24 px-8">

                <div className="max-w-4xl mx-auto">
                <div className="fade-in-section">
                    <h1 className="text-5xl md:text-7xl font-bold mb-16 tracking-tighter uppercase">Cookie Policy</h1>
                    
                    <div className="space-y-16 text-slate-400 text-lg md:text-xl leading-relaxed font-light">
                        <section className="border-t border-white/10 pt-12">
                            <h2 className="text-sm font-bold text-blue-500 uppercase tracking-[0.3em] mb-6">Wenode Ltd. Cookie Policy</h2>
                            <p className="text-white font-medium mb-4">Last Updated: April 2026</p>
                        </section>

                        <section>
                            <p>
                                Wenode Ltd. ("we", "us", or "our") believes in digital sovereignty. Our use of cookies is strictly functional 
                                and designed to meet global privacy standards, including the <span className="text-white">UK/EU GDPR</span> 
                                and <span className="text-white">US State Privacy Laws</span>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">What are cookies?</h2>
                            <p>Small text files stored on your device to help websites function.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">How we use them</h2>
                            <p>
                                We only use <span className="text-white">Strictly Necessary</span> cookies. These are essential for 
                                authentication and session management within the Wenode Dashboards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight text-blue-500">No Tracking</h2>
                            <p>We do not use advertising or third-party tracking cookies.</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Control</h2>
                            <p>
                                You can manage cookie preferences via your browser. Contact 
                                <a href="mailto:team1@wnode.one" className="text-blue-500 hover:text-blue-400 ml-2 transition-colors">team1@wnode.one</a> 
                                for technical inquiries regarding our session management.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    </AppLayout>
    );
}
