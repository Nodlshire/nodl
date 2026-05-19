import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { Libp2pProvider } from "./components/Libp2pProvider";
import { PageTitleProvider } from "./components/PageTitleContext";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-roboto",
});

export const metadata: Metadata = {
    title: "Nodlr — Harvest the Idle",
    description: "Decentralized Compute Marketplace Provider Dashboard",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <head>
                <link 
                    rel="stylesheet" 
                    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" 
                    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" 
                    crossOrigin="" 
                />
            </head>
            <body
                data-portal="nodlr"
                className={`${roboto.variable} antialiased bg-[#080808] text-white min-h-screen font-sans`}
                style={{ "--nodlr-portal-glow-color": "#ffff00" } as any}
                suppressHydrationWarning
            >
                <AuthProvider>
                    <Libp2pProvider>
                        <PageTitleProvider>
                            {children}
                        </PageTitleProvider>
                    </Libp2pProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
