'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { isRunningAsPWA } from '@/lib/pwa/usePWAInstall';
import { getLocalStore, saveLocalStore } from '@/lib/storage/store';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isPWA: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isPWA: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPWA, setIsPWA] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const sessionCheckedRef = React.useRef(false);
  const authStateFiredRef = React.useRef(false);

  useEffect(() => {
    const pwaMode = isRunningAsPWA();
    setIsPWA(pwaMode);

    const supabase = createClient();

    if (!supabase) {
      // Local development or unconfigured Supabase fallback
      setIsLoading(false);
      return;
    }

    // 1. Initial Session Restoration
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      sessionCheckedRef.current = true;
      if (sessionCheckedRef.current && authStateFiredRef.current) {
        setIsLoading(false);
      }
    });

    // 2. Listen for Auth State Changes (login, logout, token refresh across tabs)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        authStateFiredRef.current = true;
        if (sessionCheckedRef.current && authStateFiredRef.current) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Centralized Route Protection and PWA Routing Logic
  useEffect(() => {
    if (isLoading) return;

    const isAuth = !!user;
    const isPublicPage = pathname === '/' || pathname === '/login' || pathname === '/onboarding' || pathname === '/privacy' || pathname === '/terms';
    const isAuthPage = pathname === '/login' || pathname === '/onboarding';

    // Rule 1: Authenticated user visits /login or /onboarding -> Redirect to /dashboard
    if (isAuth && isAuthPage) {
      router.replace('/dashboard');
      return;
    }

    // Rule 2: Installed PWA First Launch / Root -> If unauthenticated, redirect straight to /login instead of marketing /
    if (isPWA && !isAuth && pathname === '/') {
      router.replace('/login');
      return;
    }

    // Rule 3: Protected routes (e.g. /dashboard, /workouts, /meals, /progress, /profile)
    if (!isAuth && !isPublicPage) {
      if (isPWA) {
        router.replace('/login');
      } else {
        router.replace('/');
      }
    }
  }, [user, isLoading, pathname, isPWA, router]);

  const signOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);

    // Clean sensitive local store user state while preserving structure
    const store = getLocalStore();
    saveLocalStore(store);

    if (isPWA) {
      router.replace('/login');
    } else {
      router.replace('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isPWA, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
