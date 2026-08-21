import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { Libp2pProvider } from "./components/Libp2pProvider";

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
        <html lang="en" className="dark">
            <body
                data-portal="nodlr"
                className={`${roboto.variable} antialiased bg-[#080808] text-white min-h-screen font-sans`}
                style={{ "--nodlr-portal-glow-color": "#ffff00" } as any}
            >
                <AuthProvider>
                    <Libp2pProvider>
                        {children}
                    </Libp2pProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
