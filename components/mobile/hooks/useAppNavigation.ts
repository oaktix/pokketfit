'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface UseAppNavigationReturn {
  canGoBack: boolean;
  goBack: () => void;
  goToWebsite: () => void;
  fallbackPath?: string;
}

export function useAppNavigation(fallbackPath?: string): UseAppNavigationReturn {
  const router = useRouter();

  const canGoBack = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.history.length > 1;
  }, []);

  const goBack = useCallback(() => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else if (fallbackPath) {
      router.push(fallbackPath);
    }
  }, [router, fallbackPath]);

  const goToWebsite = useCallback(() => {
    router.push('/');
  }, [router]);

  return {
    canGoBack,
    goBack,
    goToWebsite,
    fallbackPath,
  };
}
