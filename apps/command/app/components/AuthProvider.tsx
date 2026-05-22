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
                const res = await fetch('/api/account/me');
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

        syncSession();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
