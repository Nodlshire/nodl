import AppLayout from "../../components/layout/AppLayout";

export default function TermsPage() {
    return (
        <AppLayout>
            <div className="max-w-3xl mx-auto py-24 px-6">
                <h1 className="text-4xl font-bold mb-12 tracking-tight">Terms of Service</h1>
                
                <div className="space-y-12 text-gray-400 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Introduction</h2>
                        <p>Welcome to Wenode. By accessing our service, you agree to be bound by these terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Use of the Service</h2>
                        <p>Our service is designed for sovereign mesh economy management. Any misuse of the infrastructure is strictly prohibited.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Accounts</h2>
                        <p>You are responsible for maintaining the security of your node and account credentials.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Intellectual Property</h2>
                        <p>Wenode remains the property of Wenode Ltd. Your network data remains your sovereign asset.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Limitation of Liability</h2>
                        <p>Wenode is provided "as is" without any warranties of any kind.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Beta Access</h2>
                        <p>Beta features are experimental and subject to change or removal without notice.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">7. Changes to These Terms</h2>
                        <p>We may update these terms from time to time. Continued use of the service constitutes acceptance.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">8. Contact</h2>
                        <p>Questions? Contact us at stephen@wnode.one</p>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
