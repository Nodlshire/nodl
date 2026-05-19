'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import LoadingSkeleton from './LoadingSkeleton';
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
    const [user, setUser] = useState<any | null>(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('nodl_user');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    parsed.id = parsed.id || parsed.ID || parsed.wuid || parsed.WnodeID;
                    return parsed;
                } catch (e) {}
            }
        }
        return null;
    });
    const [session, setSession] = useState<any | null>(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('nodl_user');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    parsed.id = parsed.id || parsed.ID || parsed.wuid || parsed.WnodeID;
                    return { user: parsed };
                } catch (e) {}
            }
        }
        return null;
    });
    const [profile, setProfile] = useState<any | null>(() => {
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('nodl_user');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    parsed.id = parsed.id || parsed.ID || parsed.wuid || parsed.WnodeID;
                    return parsed;
                } catch (e) {}
            }
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(() => {
        if (typeof window !== 'undefined') {
            return !localStorage.getItem('nodl_user');
        }
        return true;
    });
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch('/api/account/me');
                if (res.ok) {
                    const data = await res.json();
                    data.id = data.id || data.ID || data.wuid || data.WnodeID;
                    setUser(data);
                    setSession({ user: data });
                    setProfile(data);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('nodl_user', JSON.stringify(data));
                    }
                } else {
                    setUser(null);
                    setSession(null);
                    setProfile(null);
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('nodl_user');
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

    useEffect(() => {
        if (!isLoading && !user && !pathname?.startsWith('/login')) {
            router.push('/login');
        }
    }, [isLoading, user, pathname, router]);

    // Stable Profile State: prevent re-render loops by memoizing the profile object
    const memoizedProfile = useMemo(() => profile, [JSON.stringify(profile)]);

    // The god role is purely for UI logic where relevant, though Command enforces it at backend level
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

    if (isLoading) {
        return <LoadingSkeleton />;
    }

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
