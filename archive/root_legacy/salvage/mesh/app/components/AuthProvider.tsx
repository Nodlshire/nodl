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
    const [profile, setProfile] = useState<any | null>({
        full_name: 'Stephen Soos',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stephen',
        id: '100001-0426-01-AA'
    });

    useEffect(() => {
        // Load avatar from shared file API
        if (typeof window !== 'undefined') {
            fetch('/api/avatar')
                .then(res => res.json())
                .then(data => {
                    if (data?.avatar) {
                        setProfile((prev: any) => ({ ...prev, avatar: data.avatar }));
                    }
                })
                .catch(() => {});
        }
    }, []);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const updateProfile = async (updates: any) => {
        setProfile((prev: any) => ({ ...prev, ...updates }));
        
        // Broadcast avatar changes to the global persistence API
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
        const checkBypass = () => {
            if (typeof window !== 'undefined' && localStorage.getItem('nodl_auth_bypass') === 'true') {
                const mockEmail = localStorage.getItem('nodl_user_email') || 'stephen@wnode.one';
                const mockUser = {
                    id: 'mock-mesh-buyer-01',
                    email: mockEmail,
                    user_metadata: { full_name: 'Stephen (Buyer)' }
                } as any;

                setUser(mockUser);
                setSession({ user: mockUser } as any);
                
                // Only initialize profile if not already set or it's just mock data
                setProfile(prev => prev?.id === '100001-0426-01-AA' && prev?.avatar !== 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stephen' ? prev : { 
                    id: '100001-0426-01-AA', 
                    role: 'buyer', 
                    full_name: 'Stephen Soos',
                    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Stephen' // The useEffect will asynchronously overwrite this if a custom avatar is found.
                });
                
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
    }, []);

    useEffect(() => {
        if (!isLoading && !user && !pathname?.startsWith('/login')) {
            router.push('/login');
        }
    }, [isLoading, user, pathname, router]);

    const value = useMemo(() => ({
        user,
        session,
        profile,
        updateProfile,
        isLoading
    }), [user, session, profile, isLoading]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-12 h-12 border-2 border-[#10b981]/20 border-t-[#10b981] animate-spin rounded-full" />
            </div>
        );
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
