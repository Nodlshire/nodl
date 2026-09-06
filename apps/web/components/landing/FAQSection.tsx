"use client";

import React, { useState } from "react";

export default function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqs = [
        {
            question: "Do I need crypto wallets or blockchain experience?",
            answer: "None at all. Wnode operates on a fiat-first model. Compute buyers pay with standard business cards, and node operators receive daily settlements in standard USD straight to their connected Stripe account."
        },
        {
            question: "Will this slow down my computer or damage my hard drive?",
            answer: "No. Unlike crypto miners that run hardware at maximum heat or storage nodes that grind your SSD with constant reads and writes, Wnode runs exclusively in volatile RAM. It uses spare background capacity, leaves no permanent data behind, and instantly clears out memory when paused."
        },
        {
            question: "What hardware can I use?",
            answer: "Almost any 64-bit computer: older laptops, spare office desktop towers, mini PCs, Raspberry Pi / single-board units, gaming rigs, or home servers."
        },
        {
            question: "Why join during the Beta phase?",
            answer: "Beta operators secure early adopter standing, gain priority placement in task routing epochs, and lock in the highest promotional reward tiers before the global public rollout."
        }
    ];

    const toggleFaq = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="py-24 bg-black text-white relative border-t border-slate-900">
            <div className="max-w-4xl mx-auto px-4 md:px-8">
                
                {/* Section Header */}
                <div className="text-center space-y-4 mb-16">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest bg-blue-950/60 px-3 py-1 rounded-full border border-blue-800/60">
                        Clear Answers
                    </span>
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight font-space-grotesk uppercase">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-300 text-base md:text-lg">
                        Everything you need to know about starting your Wnode operator journey.
                    </p>
                </div>

                {/* FAQ Accordion List */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div 
                                key={idx} 
                                className="bg-slate-950 border border-slate-800/90 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg"
                            >
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none group hover:bg-slate-900/50 transition-colors"
                                >
                                    <span className="text-base md:text-lg font-bold text-white font-space-grotesk group-hover:text-blue-400 transition-colors">
                                        {faq.question}
                                    </span>
                                    <span className={`text-xl text-blue-400 transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}>
                                        ↓
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className="px-6 pb-6 pt-1 text-slate-300 text-xs md:text-sm leading-relaxed border-t border-slate-900">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
