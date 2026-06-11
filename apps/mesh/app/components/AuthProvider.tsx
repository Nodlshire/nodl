'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    user: any | null;
    session: any | null;
    profile: any | null;
    updateProfile: (updates: any) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<any | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // 1. On mount, read user from localStorage
        if (typeof window !== 'undefined') {
            const cached = localStorage.getItem('nodl_user');
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    parsed.id = parsed.id || parsed.ID || parsed.wuid || parsed.WnodeID;
                    setUser(parsed);
                    setSession({ user: parsed });
                    setProfile(parsed);
                } catch (e) {}
            }
        }

        // 2. Call /api/account/me in background
        const fetchSession = async () => {
            try {
                const jwt = typeof window !== 'undefined' ? localStorage.getItem('nodl_jwt') : null;
                const headers: HeadersInit = {};
                if (jwt) {
                    headers['Authorization'] = `Bearer ${jwt}`;
                }
                const res = await fetch('/api/account/me', { headers });
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
            }
        };

        fetchSession();
    }, []);

    const updateProfile = async (updates: any) => {
        const merged = { 
            ...profile, 
            ...updates,
            displayName: updates.full_name || updates.displayName || profile?.displayName,
            avatarUrl: updates.avatar || updates.avatarUrl || profile?.avatarUrl
        };
        setUser(merged);
        setSession({ user: merged });
        setProfile(merged);
        if (typeof window !== 'undefined') {
            localStorage.setItem('nodl_user', JSON.stringify(merged));
        }

        // Broadcast avatar changes if relevant
        if (updates.avatar) {
            try {
                await fetch('/api/avatar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ avatar: updates.avatar })
                });
            } catch (e) {}
        }
    };

    useEffect(() => {
        if (!user && !pathname?.startsWith('/login')) {
            const cached = typeof window !== 'undefined' ? localStorage.getItem('nodl_user') : null;
            if (!cached) {
                router.push('/login');
            }
        }
    }, [user, pathname, router]);

    const value = useMemo(() => ({
        user,
        session,
        profile,
        updateProfile,
        isLoading
    }), [user, session, profile, isLoading]);

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
