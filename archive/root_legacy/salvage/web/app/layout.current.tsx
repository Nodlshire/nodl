import type { Metadata } from "next";
import { Roboto, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const roboto = Roboto({ 
    subsets: ["latin"], 
    weight: ["300", "400", "500", "700", "900"],
    variable: "--" 
});
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--" });

export const metadata: Metadata = {
    title: "Wnode — Peer-to-Peer Compute",
    description: "The global compute network for the next generation of decentralized applications.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <body suppressHydrationWarning data-portal="web" className={`${roboto.variable} ${jetbrainsMono.variable} antialiased bg-obsidian text-slate-300`} style={{ "--web-portal-glow-color": "#9333ea" } as any}>
                {children}
            </body>
        </html>
    );
}
