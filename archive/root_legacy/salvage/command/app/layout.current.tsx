"use client";

import React from "react";
import { usePathname } from "next/navigation";
import "./globals.css";
import { Libp2pProvider } from "./components/Libp2pProvider";
import Shell from "./components/Shell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <html lang="en">
            <head>
                <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: filesystem:;" />
            </head>
            <body
                suppressHydrationWarning
                data-portal="command"
                style={{
                    backgroundColor: "black",
                    color: "white",
                    "--command-portal-glow-color": "#22D3EE",
                } as React.CSSProperties}
            >
                <Libp2pProvider>
                    <React.Suspense fallback={<div className="h-screen w-screen bg-black" />}>
                        {pathname?.startsWith("/auth") ? (
                            children
                        ) : (
                            <Shell>{children}</Shell>
                        )}
                    </React.Suspense>
                </Libp2pProvider>
            </body>
        </html>
    );
}
