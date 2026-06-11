"use client";

import React from "react";
import { usePathname } from "next/navigation";
import "./globals.css";

import Shell from "./components/Shell";
import AuthGuard from "./components/AuthGuard";
import { AuthProvider } from "./components/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <html lang="en">
            <head>
                <meta httpEquiv="Content-Security-Policy" content="script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: filesystem:;" />
                <link rel="icon" href="/favicon.ico" />
                <title>Wnode Command</title>
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
                <AuthProvider>
                    <AuthGuard>
                        <React.Suspense fallback={<div className="h-screen w-screen bg-black" />}>
                            {pathname?.startsWith("/auth") ? (
                                children
                            ) : (
                                <Shell>{children}</Shell>
                            )}
                        </React.Suspense>
                    </AuthGuard>
                </AuthProvider>
            </body>
        </html>
    );
}
