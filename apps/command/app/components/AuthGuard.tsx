"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const [isVerified, setIsVerified] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkAuth = async () => {
            // Skip auth check for login/auth pages
            if (pathname?.startsWith("/auth") || pathname === "/login") {
                setIsLoading(false);
                return;
            }

            try {
                // Verify session with backend identity provider (via proxy)
                // We no longer rely on localStorage JWTs or bypass flags.
                const res = await fetch("/api/account/me", {
                    cache: "no-store",
                });

                if (res.ok) {
                    setIsVerified(true);
                } else {
                    console.warn("[AuthGuard] Identity verification failed, status:", res.status);
                    router.push("/auth/login");
                }
            } catch (error) {
                console.error("[AuthGuard] Error verifying identity:", error);
                // No more local auth fallbacks allowed.
                router.push("/auth/login");
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]);

    if (isLoading) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-t-2 border-cyan-500 border-solid rounded-full animate-spin" />
                    <span className="text-[10px] text-cyan-500 font-bold uppercase tracking-[0.2em] animate-pulse">
                        Synchronizing Identity...
                    </span>
                </div>
            </div>
        );
    }

    // For auth pages, just render children
    if (pathname?.startsWith("/auth") || pathname === "/login") {
        return <>{children}</>;
    }

    // Only render dashboard if verified
    if (isVerified) {
        return <>{children}</>;
    }

    // Default to empty while redirecting
    return null;
}
