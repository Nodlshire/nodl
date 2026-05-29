"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const email = params.get("email") || "";
  const callbackUrl = params.get("callbackUrl") || "https://dr.wnode.one/dashboard";

  async function handleVerify() {
    const query = new URLSearchParams({ token, email, callbackUrl });
    const res = await fetch(`https://dr.wnode.one/api/auth/callback/email?${query.toString()}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "text/html",
      },
    });

    // NextAuth returns 302 redirect; we need to follow it manually
    if (res.redirected) {
      window.location.href = res.url;
      return;
    }

    // If not redirected, check status
    if (res.ok) {
      window.location.href = callbackUrl || "/dashboard";
    } else {
      const text = await res.text();
      console.error("Verification failed:", text);
      alert("Verification failed. Please request a new link.");
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-xl font-semibold mb-4">Welcome to Papermark</h1>
      <p className="mb-6">Share documents. Not attachments.</p>
      <button
        onClick={handleVerify}
        className="bg-[#1a1a1b] text-white px-6 py-3 rounded-md hover:bg-[#2a2a2b]"
      >
        Verify login
      </button>
      <p className="mt-4 text-xs text-gray-500">
        By clicking continue, you acknowledge that you have read and agree to Papermark’s{" "}
        <a href="/terms" className="underline">Terms of Service</a> and{" "}
        <a href="/privacy" className="underline">Privacy Policy</a>.
      </p>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
