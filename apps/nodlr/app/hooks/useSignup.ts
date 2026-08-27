'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export const FOUNDER_WUIDS = [
  '100001-0426-01-AA',
  '100002-0426-01-AA',
  '100003-0426-01-AA',
  '100004-0426-01-AA'
];

export function useSignup() {
  const searchParams = useSearchParams();

  const [hasInvite, setHasInvite] = useState<boolean | null>(null);
  const [inviterWUID, setInviterWUID] = useState<string>('');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [wuidValidationError, setWuidValidationError] = useState<string>('');

  useEffect(() => {
    const inviteFromUrl = searchParams.get('invite') || searchParams.get('code');
    const inviteFromStorage = typeof window !== 'undefined' ? localStorage.getItem('nodlr_inviter_wuid') : null;

    const resolvedInvite = (inviteFromUrl || inviteFromStorage || '').trim();

    if (resolvedInvite) {
      setInviterWUID(resolvedInvite);
      setIsLocked(true);
      setHasInvite(true);
    }
  }, [searchParams]);

  const validateWUID = (val: string): boolean => {
    if (!val || val.trim().length < 6) {
      setWuidValidationError('Invalid WUID format');
      return false;
    }
    setWuidValidationError('');
    return true;
  };

  const handleManualWUIDChange = (val: string) => {
    setInviterWUID(val);
    if (val.trim()) {
      validateWUID(val);
    } else {
      setWuidValidationError('');
    }
  };

  return {
    hasInvite,
    setHasInvite,
    inviterWUID,
    setInviterWUID,
    isLocked,
    wuidValidationError,
    validateWUID,
    handleManualWUIDChange
  };
}
