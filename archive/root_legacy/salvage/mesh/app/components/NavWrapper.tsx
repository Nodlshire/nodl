'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import { Header } from "./Header";
import { BasketProvider } from "./BasketContext";

export function NavWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="min-h-screen bg-black" />;
    }

    const isLoginPage = pathname === '/login';

    if (isLoginPage) {
        return <>{children}</>;
    }

    return (
        <BasketProvider>
            <div className="flex flex-col min-h-screen w-full bg-black">
                <Header />
                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto relative bg-[#050505]">
                        {children}
                    </main>
                </div>
            </div>
        </BasketProvider>
    );
}
