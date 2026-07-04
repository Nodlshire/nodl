'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: any | null;
    session: any | null;
    profile: any | null;
    isLoading: boolean;
    isGodMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<any | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // 1. On mount, read user from localStorage
        let bootstrapped = null;
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('nodlr_session');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    parsed.id = parsed.id || parsed.ID || parsed.wuid || parsed.WnodeID;
                    setUser(parsed);
                    setSession({ user: parsed });
                    setProfile(parsed);
                    bootstrapped = parsed;
                } catch (e) {}
            }
        }

        // 2. Call /api/account/me in background
        const fetchSession = async () => {
            try {
                const res = await fetch('/api/account/me', { credentials: 'include', method: 'GET' });
                if (res.ok) {
                    const data = await res.json();
                    data.id = data.id || data.ID || data.wuid || data.WnodeID;
                    setUser(data);
                    setSession({ user: data });
                    setProfile(data);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('nodlr_session', JSON.stringify(data));
                        localStorage.setItem('nodlr_user_id', data.id);
                    }
                } else {
                    // Do NOT clear user on transient 401s if we successfully bootstrapped
                    if (!bootstrapped) {
                        setUser(null);
                        setSession(null);
                        setProfile(null);
                        if (typeof window !== 'undefined') {
                            localStorage.removeItem('nodlr_session');
                            localStorage.removeItem('nodlr_user_id');
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch session", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSession();
    }, []);

    // 3. Prevent infinite loops and redirect only if definitely no user and not on login page
    useEffect(() => {
        if (!isLoading && !user && !pathname?.startsWith('/login')) {
            router.push('/login');
        }
    }, [isLoading, user, pathname, router]);

    const memoizedProfile = useMemo(() => profile, [JSON.stringify(profile)]);

    const isGodMode = useMemo(() => {
        return memoizedProfile?.role === 'god';
    }, [memoizedProfile]);

    const value = useMemo(() => ({
        user,
        session,
        profile: memoizedProfile,
        isLoading,
        isGodMode
    }), [user, session, memoizedProfile, isLoading, isGodMode]);

    // Do NOT block UI while loading: render children directly
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
