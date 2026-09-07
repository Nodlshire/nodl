import AppLayout from "../../components/layout/AppLayout";

export default function PrivacyPage() {
    const privacySchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Wnode Privacy Policy & GDPR/CCPA Disclosures",
        "description": "Privacy-first infrastructure data disclosures. Wnode processes zero disk retention, zero ad tracking, and stateless RAM-only micro-task executions.",
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
                dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
            />
            <div className="relative pt-40 pb-24 px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="fade-in-section text-slate-300 whitespace-pre-wrap font-sans text-lg">
{`Wnode Ltd. (trading as Wnode) — Privacy Policy
Last Updated: April 2026

Wnode Ltd., trading as Wnode (“we”, “us”, “our”), is committed to digital sovereignty, privacy-first design, and strict data minimisation. This Privacy Policy explains how we collect, use, store, and protect personal data across the Wnode platform, including our dashboards, authentication systems, and protected services.

1. Who We Are
Wnode Ltd. (trading as Wnode)
Registered in the United Kingdom
Contact: team1@wnode.one

We operate privacy-first infrastructure and do not engage in advertising, behavioural tracking, or data monetisation.

2. Data We Collect
We collect only the minimum personal data required to operate the Wnode platform securely and effectively.

2.1 Account Information
• Name  
• Email address  
• Password (hashed and salted; never stored in plain text)

2.2 Authentication and Security Data
• Session tokens  
• Login timestamps  
• IP address (for security, fraud prevention, and abuse mitigation)  
• Device and browser metadata (non-identifying)

2.3 Operational Data
• Actions performed within authenticated dashboards  
• System events required for platform stability  
• Support communications sent to team1@wnode.one

We do not collect sensitive personal data unless explicitly provided by the user.

3. Data We Do Not Collect
We do not collect:
• Advertising identifiers  
• Third-party tracking data  
• Behavioural profiling data  
• Cross-site tracking information  
• Biometric data  
• Financial information (payments are handled by Stripe)  

4. Statutory Rights (GDPR & CCPA)
Users maintain full rights to inspect, export, or permanently delete account credentials at any time.`}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
