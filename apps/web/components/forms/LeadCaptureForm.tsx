"use client";

import { useState } from "react";

interface LeadCaptureFormProps {
    tag: string;
    onSuccess?: () => void;
}

export default function LeadCaptureForm({ tag, onSuccess }: LeadCaptureFormProps) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const isJoinUsGroup = tag === "developer" || tag === "beta_tester" || tag === "waitlist";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            // Ensure we use the correct backend URL (8080)
            const apiBase = process.env.NEXT_PUBLIC_WNODE_API_BASE || "http://localhost:8080";
            const res = await fetch(`${apiBase}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    tag,
                    source: "apple_landing",
                }),
            });

            if (res.ok) {
                setStatus("success");
                if (onSuccess) {
                    setTimeout(onSuccess, 2000);
                }
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error("Submission error:", err);
            setStatus("error");
        }
    };

    if (status === "success") {
        return (
            <div className="py-12 text-center animate-in fade-in zoom-in duration-700">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 text-blue-500 mb-6">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-3xl font-semibold mb-3 text-white">Application Received.</h3>
                <p className="text-xl text-[#86868b]">We'll be in touch with your protocol credentials soon.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
                <div className="group">
                    <input
                        required
                        type="text"
                        maxLength={100}
                        className="w-full bg-[#2c2c2e] border-none rounded-2xl px-6 py-5 text-lg text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-[#48484a]"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="group">
                    <input
                        required
                        type="email"
                        maxLength={254}
                        className="w-full bg-[#2c2c2e] border-none rounded-2xl px-6 py-5 text-lg text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-[#48484a]"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                {tag !== "investor" && (
                    <div className="group">
                        <textarea
                            maxLength={2000}
                            rows={3}
                            required={isJoinUsGroup}
                            className="w-full bg-[#2c2c2e] border-none rounded-2xl px-6 py-5 text-lg text-white focus:ring-2 focus:ring-blue-500/50 transition-all outline-none placeholder:text-[#48484a] resize-none"
                            placeholder={isJoinUsGroup ? "Brief Message" : "Project Details (Optional)"}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full button-apple-primary py-5 text-xl disabled:opacity-50"
            >
                {status === "submitting" ? "Processing..." : tag === "investor" ? "Join Waitlist" : isJoinUsGroup ? "Join Us" : "Submit Application"}
            </button>

            {status === "error" && (
                <p className="text-red-400 text-lg text-center animate-pulse">System error. Please retry.</p>
            )}
        </form>
    );
}
