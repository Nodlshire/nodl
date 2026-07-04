'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let bootstrappedUser: any = null;
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("cmd_session");
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
                const sessionStr = typeof window !== 'undefined' ? localStorage.getItem('cmd_session') : null;
                const headers: Record<string, string> = {};
                if (sessionStr) {
                    try {
                        const parsed = JSON.parse(sessionStr);
                        const token = parsed.token || parsed.session_id || parsed.id || parsed;
                        const userId = parsed.id || parsed.ID || parsed.wuid || parsed.WnodeID || '';
                        const userRole = parsed.role || parsed.Role || '';

                        headers['x-debug-cookie'] = `cmd_session=${token}`;
                        headers['Authorization'] = `Bearer ${token}`;
                        if (userId) {
                            headers['X-User-ID'] = userId;
                            if (userRole === 'owner') {
                                headers['X-Owner-ID'] = userId;
                            } else if (userRole) {
                                headers['X-User-Role'] = userRole;
                            }
                        }
                    } catch (e) {
                        headers['x-debug-cookie'] = `cmd_session=${sessionStr}`;
                        headers['Authorization'] = `Bearer ${sessionStr}`;
                    }
                }
                console.log("SENDING HEADERS TO BACKEND:", JSON.stringify(headers));
                const res = await fetch('/api/account/me', { 
                    credentials: 'include', 
                    method: 'GET',
                    headers
                });
                if (res.ok) {
                    const data = await res.json();
                    data.id = data.id || data.ID || data.wuid || data.WnodeID;
                    setUser(data);
                    if (typeof window !== "undefined") {
                        localStorage.setItem("cmd_session", JSON.stringify(data));
                    }
                } else {
                    setUser(null);
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("cmd_session");
                    }
                }
            } catch (err) {
                console.error("Background session validation failed", err);
            }
        };

        syncSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
