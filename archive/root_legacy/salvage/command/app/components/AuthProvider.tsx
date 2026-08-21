'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const userStr = localStorage.getItem("nodl_user");
            if (userStr) {
                try {
                    setUser(JSON.parse(userStr));
                } catch (e) {
                    console.error("Failed to parse user from storage");
                }
            }
        }
        setLoading(false);
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
