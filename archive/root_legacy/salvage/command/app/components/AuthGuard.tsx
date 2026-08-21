"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Centralized 'Not Signed In' logic
    const jwt = localStorage.getItem("nodl_jwt");
    const userStr = localStorage.getItem("nodl_user");

    if (pathname === "/auth/login") {
      setIsAuthorized(true);
      return;
    }

    if (!jwt || !userStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      // Check for authorized roles
      const allowedRoles = ["owner", "manager", "customer_service"];
      if (!allowedRoles.includes(user.role)) {
        // Not authorized for this portal - but signed in
        // For simplicity, redirect to login or show error
        router.push("/auth/login");
        return;
      }
      setIsAuthorized(true);
    } catch (e) {
      router.push("/auth/login");
    }
  }, [pathname, router]);

  // Don't render anything during SSR to prevent hydration mismatches
  if (!isMounted) {
    return null;
  }

  if (!isAuthorized && pathname !== "/auth/login") {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin text-[#22D3EE] mb-4" />
        <p className="text-slate-500 font-normal">Verifying Security Credentials...</p>
      </div>
    );
  }

  return <>{children}</>;
}
