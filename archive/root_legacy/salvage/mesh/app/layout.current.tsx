import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";
import { BillingProvider } from "./components/BillingProvider";
import { JobsProvider } from "./components/JobsProvider";
import { Libp2pProvider } from "./components/Libp2pProvider";
import { NavWrapper } from "./components/NavWrapper";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["100", "300", "400", "500", "700", "900"],
    variable: "--font-roboto",
});

export const metadata: Metadata = {
    title: "Wnode Mesh — Compute Marketplace",
    description: "Access high-performance decentralized compute resources.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark" suppressHydrationWarning>
            <body data-portal="mesh" className={`${roboto.variable} antialiased bg-black text-white min-h-screen font-sans`} style={{ "--mesh-portal-glow-color": "#fcba03" } as any}>
                <AuthProvider>
                    <BillingProvider>
                        <JobsProvider>
                            <Libp2pProvider>
                                <NavWrapper>
                                    {children}
                                </NavWrapper>
                            </Libp2pProvider>
                        </JobsProvider>
                    </BillingProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
