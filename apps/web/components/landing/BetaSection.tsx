"use client";

import { ModalMode } from "./CTAModal";

interface BetaSectionProps {
    onOpenModal: (mode: ModalMode) => void;
}

export default function BetaSection({ onOpenModal }: BetaSectionProps) {
    return (
        <section className="section-spacing bg-black pt-0">
            <div className="max-w-6xl mx-auto">
                <div className="fade-in-section text-center border border-blue-500/40 px-10 py-16 md:px-20 md:py-24 rounded-[40px] bg-white/[0.01] backdrop-blur-sm shadow-2xl">
                    <h2 className="text-3xl md:text-6xl font-bold mb-10 text-white tracking-tight">
                        Build the Mesh. <br className="hidden md:block" />
                        Earn Your Place in It.
                    </h2>
                    
                    <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto mb-16">
                        Wnode is opening its sovereign compute layer to a small group of developers ready to shape the foundations of a decentralised network economy. Beta contributors will work directly with the primitives that turn relationships, hardware, and participation into durable economic value. Those who help iterate the mesh will be recognised accordingly and rewarded significantly.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                        <button 
                            onClick={() => onOpenModal("beta_tester")}
                            className="button-apple-primary text-2xl px-12 py-5"
                        >
                            Become a beta tester
                        </button>
                        <a 
                            href="https://github.com/wnodeltd/wnode" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-500 hover:text-orange-400 font-medium tracking-wide transition-colors flex items-center gap-2"
                        >
                            View the project on GitHub
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>

                    <div className="mt-20 flex flex-col items-center gap-6 border-t border-white/25 pt-16">
                        <h3 className="text-2xl font-semibold text-white uppercase tracking-wider">Join the Developer Community</h3>
                        <a
                            href="https://discord.gg/EUXJMZsFCt"
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "8px",
                                backgroundColor: "#5865F2",
                                color: "white",
                                padding: "12px 24px",
                                borderRadius: "8px",
                                fontWeight: 600,
                                textDecoration: "none",
                                fontSize: "1.1rem",
                                transition: "transform 0.2s ease, filter 0.2s ease"
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = "scale(1.05)";
                                e.currentTarget.style.filter = "brightness(1.1)";
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = "scale(1)";
                                e.currentTarget.style.filter = "brightness(1)";
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="white"
                            >
                                <path d="M19.27 4.57C17.75 3.87 16.12 3.37 14.43 3.1c-.2.35-.42.74-.58 1.12-1.78-.27-3.54-.27-5.3 0-.16-.38-.39-.77-.59-1.12-1.69.27-3.32.77-4.84 1.47-3.07 4.59-3.9 9.07-3.48 13.48 2.04 1.5 3.97 2.41 5.86 3 .48-.66.9-1.37 1.25-2.12-.7-.27-1.37-.6-2-1 .17-.12.33-.25.49-.38 3.86 1.78 8.05 1.78 11.87 0 .16.13.32.26.49.38-.63.4-1.3.73-2 1 .35.75.77 1.46 1.25 2.12 1.89-.59 3.82-1.5 5.86-3 .43-5.01-.71-9.47-3.48-13.48zm-11.83 11.23c-1.14 0-2.08-1.04-2.08-2.33s.9-2.33 2.08-2.33 2.08 1.04 2.08 2.33-.9 2.33-2.08 2.33zm8.01 0c-1.14 0-2.08-1.04-2.08-2.33s.9-2.33 2.08-2.33 2.08 1.04 2.08 2.33-.9 2.33-2.08 2.33z" />
                            </svg>
                            Discord
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
