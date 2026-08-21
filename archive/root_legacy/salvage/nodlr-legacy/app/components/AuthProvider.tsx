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
    const [user, setUser] = useState<any | null>(null);
    const [session, setSession] = useState<any | null>(null);
    const [profile, setProfile] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkBypass = () => {
            if (typeof window !== 'undefined' && localStorage.getItem('nodl_auth_bypass') === 'true') {
                const mockEmail = localStorage.getItem('nodl_user_email') || 'stephen@wnode.one';
                const mockUser = {
                    id: 'mock-id-123',
                    email: mockEmail,
                    user_metadata: { full_name: 'Stephen' }
                } as any;

                setUser(mockUser);
                setSession({ user: mockUser } as any);
                setProfile({ id: 'mock-id-123', role: 'god', full_name: 'Stephen' });
                setIsLoading(false);
                return true;
            }
            return false;
        };

        const setData = async () => {
            if (checkBypass()) return;
            setIsLoading(false);
        };

        setData();
    }, [pathname]);

    useEffect(() => {
        if (!isLoading && !user && !pathname?.startsWith('/login')) {
            router.push('/login');
        }
    }, [isLoading, user, pathname, router]);

    // Stable Profile State: prevent re-render loops by memoizing the profile object
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
