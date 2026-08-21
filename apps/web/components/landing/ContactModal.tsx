"use client";

import { useState } from "react";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    hideInquiryType?: boolean;
    requirePhone?: boolean;
}

export default function ContactModal({ 
    isOpen, 
    onClose,
    title = "Let's Be Amici",
    hideInquiryType = false,
    requirePhone = false
}: ContactModalProps) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
        inquiryTypes: [] as string[],
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!hideInquiryType && formData.inquiryTypes.length === 0) {
            alert("Please select at least one category.");
            return;
        }

        // If inquiry types are hidden, provide a default for the email subject
        const submissionData = {
            ...formData,
            inquiryTypes: hideInquiryType ? ["Partner Enquiry"] : formData.inquiryTypes
        };

        setStatus("submitting");
        
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });

            if (res.ok) {
                setStatus("success");
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error("Submission error:", err);
            setStatus("error");
        }
    };

    const toggleInquiryType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            inquiryTypes: prev.inquiryTypes.includes(type)
                ? prev.inquiryTypes.filter(t => t !== type)
                : [...prev.inquiryTypes, type]
        }));
    };

    if (status === "success") {
        return (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
                <div className="relative w-full max-w-xl bg-black/95 border border-white/25 rounded-[2.5rem] p-12 text-center shadow-2xl animate-in zoom-in duration-500">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/10 text-blue-500 mb-8">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-white mb-4 uppercase tracking-tight">Message Transmitted</h2>
                    <p className="text-xl text-slate-400 mb-8 leading-relaxed">Your data has been sent to the Mesh. We'll be in touch with your protocol credentials soon.</p>
                    <button onClick={onClose} className="button-apple-primary px-12 py-4">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 overflow-y-auto">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-black/95 border border-white/25 rounded-[2.5rem] p-10 md:p-14 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-500 my-auto">
                <button onClick={onClose} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-4xl font-bold text-white mb-2 tracking-tight uppercase">{title}</h2>
                <p className="text-lg text-slate-500 mb-10">Connect with the Wnode team.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 uppercase ml-2">First Name *</label>
                            <input
                                required
                                type="text"
                                placeholder="John"
                                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                                value={formData.firstName}
                                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-300 uppercase ml-2">Last Name *</label>
                            <input
                                required
                                type="text"
                                placeholder="Doe"
                                className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                                value={formData.lastName}
                                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase ml-2">Email Address *</label>
                        <input
                            required
                            type="email"
                            placeholder="john@example.com"
                            className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase ml-2">Phone {requirePhone ? '*' : '(Optional)'}</label>
                        <input
                            type="tel"
                            required={requirePhone}
                            placeholder="+1 (555) 000-0000"
                            className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>

                    {!hideInquiryType && (
                        <div className="space-y-4">
                            <p className="text-xs font-bold text-slate-300 uppercase tracking-[0.2em]">Inquiry Type * (Select at least one)</p>
                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                {['Compute Buyer', 'Compute Provider', 'Other'].map(type => (
                                    <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="hidden"
                                            checked={formData.inquiryTypes.includes(type)}
                                            onChange={() => toggleInquiryType(type)}
                                        />
                                        <div className={`w-6 h-6 rounded-md border transition-all flex items-center justify-center ${
                                            formData.inquiryTypes.includes(type) 
                                            ? 'bg-blue-600 border-blue-600' 
                                            : 'bg-white/5 border-white/20 group-hover:border-white/40'
                                        }`}>
                                            {formData.inquiryTypes.includes(type) && (
                                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className={`text-base font-medium transition-colors ${
                                            formData.inquiryTypes.includes(type) ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                                        }`}>
                                            {type}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-300 uppercase ml-2">Message *</label>
                        <textarea
                            required
                            placeholder="How can we help you ?"
                            rows={4}
                            className="w-full bg-white/5 border border-white/20 rounded-2xl px-6 py-4 text-white outline-none focus:border-blue-500/50 transition-colors resize-none placeholder:text-slate-600"
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === "submitting"}
                        className="w-full button-apple-primary py-5 text-xl font-bold uppercase tracking-tight disabled:opacity-50"
                    >
                        {status === "submitting" ? "Transmitting..." : "Send Message"}
                    </button>

                    {status === "error" && (
                        <p className="text-red-500 text-sm text-center font-bold uppercase animate-pulse">Transmission Failed. Please retry.</p>
                    )}
                </form>
            </div>
        </div>
    );
}
