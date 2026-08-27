'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

function InviteRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code') || searchParams.get('invite') || '';
    if (code && typeof window !== 'undefined') {
      localStorage.setItem('nodlr_inviter_wuid', code.trim());
      router.replace(`/signup?invite=${encodeURIComponent(code.trim())}`);
    } else {
      router.replace('/signup');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#070708] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-cyber-purple" />
        <span className="text-sm font-medium">Redirecting to sovereign signup...</span>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070708] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyber-purple" />
      </div>
    }>
      <InviteRedirect />
    </Suspense>
  );
}
