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
    title: "Wenode — Own Your Network. Own Your Future.",
    description: "Wenode is a sovereign mesh economy platform that lets you create, grow, and monetise your own network. Join the beta or get on the waitlist.",
    openGraph: {
        title: "Wenode — Own Your Network. Own Your Future.",
        description: "The sovereign mesh economy platform.",
        type: "website",
        url: "https://wnode.one",
    }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark scroll-smooth">
            <head>
                <script defer src="https://stats.wnode.one/script.js" data-website-id="a4384d11-fbf7-4a2c-a8c8-08c252d96b54"></script>
            </head>
            <body suppressHydrationWarning className={`min-h-screen w-full bg-black text-white flex flex-col overflow-x-hidden ${inter.variable} ${roboto.variable} ${spaceGrotesk.variable} antialiased font-sans`}>
                {children}
            </body>
        </html>
    );
}
