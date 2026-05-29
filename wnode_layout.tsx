import React from "react";
import type { Metadata } from "next";
import { Inter, Roboto, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const roboto = Roboto({ 
    weight: ["400", "500", "700"],
    subsets: ["latin"], 
    variable: "--font-roboto" 
});
const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk"
});

export const metadata: Metadata = {
    title: "Wnode — Own Your Network. Own Your Future.",
    description: "Wnode is a sovereign mesh economy platform that lets you create, grow, and monetise your own network. Join the beta or get on the waitlist.",
    openGraph: {
        title: "Wnode — Own Your Network. Own Your Future.",
        description: "The sovereign mesh economy platform.",
        type: "website",
        url: "https://wnode.one",
    },
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/favicon-32x32.png",
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <body suppressHydrationWarning className={`${inter.variable} ${roboto.variable} ${spaceGrotesk.variable} antialiased bg-black text-slate-50 font-sans`}>
                {children}
            </body>
        </html>
    );
}
