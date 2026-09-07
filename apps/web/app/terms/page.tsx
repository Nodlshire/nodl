import AppLayout from "../../components/layout/AppLayout";

export default function TermsPage() {
    const termsSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Wnode Terms of Service",
        "description": "Terms of service and node operator agreement for the Wnode sovereign compute mesh network.",
        "publisher": {
            "@type": "Organization",
            "name": "Wnode Ltd.",
            "url": "https://wnode.one"
        }
    };

    return (
        <AppLayout>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(termsSchema) }}
            />
            <div className="relative pt-40 pb-24 px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="fade-in-section text-slate-300 whitespace-pre-wrap font-sans text-lg">
{`Wnode Ltd. (trading as Wnode) — Terms of Service
Last Updated: April 2026

These Terms of Service (“Terms”) govern your access to and use of the Wnode platform, including all dashboards, node management tools, APIs, and related services (“Service”). By accessing or using the Service, you agree to be bound by these Terms.

1. Who We Are
Wnode Ltd. (trading as Wnode)
Registered in the United Kingdom
Contact: team1@wnode.one

Wnode provides sovereign mesh infrastructure, distributed compute orchestration, and related digital services.

2. Eligibility and Account Registration
To use the Service, you must:
• Be at least 18 years old  
• Create an account with accurate information  
• Maintain the confidentiality of your credentials  
• Ensure your node, device, or infrastructure is secured against unauthorised access  

You are responsible for all activity conducted under your account.

3. Acceptable Use
You agree not to:
• Interfere with or disrupt the Wnode Mesh  
• Attempt to bypass authentication, security, or rate limits  
• Use the Service for unlawful, harmful, or abusive purposes  
• Deploy nodes or workloads that violate applicable law  
• Reverse engineer, decompile, or attempt to extract source code  
• Use the Service to distribute malware, spam, or harmful compute tasks  

Wnode reserves the right to suspend or terminate accounts that violate these rules.`}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
