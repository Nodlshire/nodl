'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let bootstrappedUser: any = null;
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("nodl_user");
            if (userStr) {
                try {
                    bootstrappedUser = JSON.parse(userStr);
                    if (bootstrappedUser) {
                        bootstrappedUser.id = bootstrappedUser.id || bootstrappedUser.ID || bootstrappedUser.wuid || bootstrappedUser.WnodeID;
                        setUser(bootstrappedUser);
                    }
                } catch (e) {
                    console.error("Failed to parse user from storage");
                }
            }
        }
        setLoading(false);

        const syncSession = async () => {
            try {
                const jwt = typeof window !== "undefined" ? localStorage.getItem("nodl_jwt") : null;
                const headers: HeadersInit = {};
                if (jwt) {
                    headers['Authorization'] = `Bearer ${jwt}`;
                }
                const res = await fetch('/api/account/me', { headers });
                if (res.ok) {
                    const data = await res.json();
                    data.id = data.id || data.ID || data.wuid || data.WnodeID;
                    setUser(data);
                    if (typeof window !== "undefined") {
                        localStorage.setItem("nodl_user", JSON.stringify(data));
                    }
                } else {
                    setUser(null);
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("nodl_user");
                    }
                }
            } catch (err) {
                console.error("Background session validation failed", err);
            }
        };
        
        // Intercept fetch for specific routes to attach JWT
        if (typeof window !== "undefined" && !(window as any).__fetchIntercepted) {
            (window as any).__fetchIntercepted = true;
            const originalFetch = window.fetch;
            window.fetch = async (...args) => {
                const url = typeof args[0] === 'string' ? args[0] : (args[0] instanceof URL ? args[0].href : (args[0] ? (args[0] as Request).url : ''));
                
                if (url.includes('/api/account/me') || 
                    url.includes('/api/v1/system/pulse') || 
                    url.includes('/api/v1/money/balance') || 
                    url.includes('/api/v1/jobs')) {
                    
                    const jwt = localStorage.getItem('nodl_jwt');
                    if (jwt) {
                        let options = (args[1] || {}) as RequestInit;
                        options.headers = {
                            ...options.headers,
                            'Authorization': `Bearer ${jwt}`
                        };
                        args[1] = options;
                    }
                }
                return originalFetch.apply(window, args);
            };
        }

        syncSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
