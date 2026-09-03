"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import useSWR from "swr";
import { normalizeAccount } from "../lib/identity";

declare global {
    interface Window {
        user_context: any;
    }
}

const fetcher = (url: string) => fetch(url).then(res => res.json()).catch(() => ({}));

export default function IdentityHeader({ account }: { account?: any }) {
    const [user, setUser] = useState<any>(account || null);
    const [fetchError, setFetchError] = useState(false);

    // SOT Avatar Hydration - Scoped strictly per WUID/User Session
    const userId = user?.id || user?.nodlrId || user?.wuid || "";
    const avatarApiUrl = userId ? `/api/avatar?wuid=${encodeURIComponent(userId)}` : null;
    const { data: avatarData } = useSWR(avatarApiUrl, fetcher, { revalidateOnFocus: true });

    useEffect(() => {
        if (account) {
            setUser(account);
            return;
        }

        let cancelled = false;

        const loadUser = async () => {
            try {
                // Identity resolve via domain-scoped session cookies (handled by proxy)
                const res = await fetch("/api/account/me", { credentials: 'include' });

                if (res.ok && !cancelled) {
                    const data = await res.json();
                    setUser(data);
                    
                    if (typeof window !== "undefined") {
                        window.user_context = {
                            email: data.email,
                            role: data.role,
                            id: data.id,
                            permissions: data.permissions || [], // Pure Backend Truth
                            session_age: "fresh",
                        };
                    }
                    return;
                }
            } catch (e) {
                console.warn("[IdentityHeader] Identity resolution failed:", e);
            }

            if (!cancelled) {
                setFetchError(true);
            }
        };

        loadUser();

        return () => {
            cancelled = true;
        };
    }, [account]);

    // Show a minimal placeholder while loading
    if (!user) {
        return (
            <div className="flex items-center gap-3 h-11">
                {fetchError ? (
                    <span className="text-[11px] text-neutral-400 font-sans uppercase tracking-wider">
                        Not signed in
                    </span>
                ) : (
                    <>
                        <Loader2 className="w-3.5 h-3.5 text-neutral-500 animate-spin" />
                        <span className="text-[11px] text-neutral-400 font-sans uppercase tracking-wider">
                            Syncing...
                        </span>
                    </>
                )}
            </div>
        );
    }

    const identity = normalizeAccount(user);
    const effectiveAvatar = identity.avatarUrl || avatarData?.avatar || user?.avatar;

    return (
        <div className="flex items-center gap-4 select-none">
            <div className="text-right flex flex-col items-end min-w-0">
                <span className="text-[17px] text-white font-normal tracking-tight truncate max-w-full font-sans">
                    {identity.displayName}
                </span>
                <span className="text-[14px] text-[#3B82F6] font-normal tracking-widest uppercase mt-0.5 font-sans">
                    {identity.id}
                </span>
            </div>

            {/* User Avatar */}
            <div className="relative group">
                <div className="relative w-10 h-10 rounded-full bg-neutral-900 overflow-hidden flex items-center justify-center border border-white/10">
                    {effectiveAvatar ? (
                        <img 
                            src={effectiveAvatar} 
                            alt={identity.displayName} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white font-medium text-sm">
                            {identity.initials}
                        </span>
                    )}
                </div>
                {/* Online Indicator */}
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0A0A0A] rounded-full shadow-lg"></div>
            </div>
        </div>
    );
}
