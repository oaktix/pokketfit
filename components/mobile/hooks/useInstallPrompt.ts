'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Constants ────────────────────────────────────────────────────────────────

export const ENGAGEMENT_THRESHOLD = 3;
const STORAGE_KEY_ENGAGEMENT = 'pokketfit_pwa_engagement';
const STORAGE_KEY_INSTALLED = 'pokketfit_pwa_install';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UseInstallPromptReturn {
  /** True when a native prompt is captured and not running standalone */
  canInstall: boolean;
  /** Fires the native prompt; resolves true if accepted */
  promptInstall: () => Promise<boolean>;
  /** True when running as an installed PWA */
  isStandalone: boolean;
  /** True on iPhone / iPad / iPod / iPadOS 13+ */
  isIOS: boolean;
  /** True after user dismisses — session-only, resets on every page load */
  dismissed: boolean;
  dismiss: () => void;
  /** True when the engagement score has reached ENGAGEMENT_THRESHOLD */
  engaged: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  );
}

function detectIOS(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as MacIntel but has touch points
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

function getEngagementScore(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(STORAGE_KEY_ENGAGEMENT) ?? '0', 10);
}

/**
 * Bump the PWA engagement score by `points` (default 1).
 * Call this anywhere in the app to track meaningful interactions.
 */
export function recordEngagement(points = 1): void {
  if (typeof window === 'undefined') return;
  const current = getEngagementScore();
  localStorage.setItem(STORAGE_KEY_ENGAGEMENT, String(current + points));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useInstallPrompt(): UseInstallPromptReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  // Session-only dismiss — NOT persisted to localStorage
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [engaged, setEngaged] = useState<boolean>(false);

  // ── Initialise on mount ───────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone = detectStandalone();
    const ios = detectIOS();

    setIsStandalone(standalone);
    setIsIOS(ios);

    // Compute engagement once — score is a running total in localStorage
    const score = getEngagementScore();
    setEngaged(score >= ENGAGEMENT_THRESHOLD);

    if (standalone) return; // already installed — nothing more to do

    // ── Native install prompt ────────────────────────────────────────────────
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      // Mark as installed in persistent storage
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_INSTALLED, 'installed');
      }
      setIsStandalone(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;

    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_INSTALLED, 'installed');
      }
      setIsStandalone(true);
      setDeferredPrompt(null);
      return true;
    }

    // Dismissed — clear the prompt (browsers only allow one call)
    setDeferredPrompt(null);
    return false;
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setDismissed(true);
  }, []);

  // ── Derived ───────────────────────────────────────────────────────────────

  const canInstall = !isStandalone && !!deferredPrompt;

  return {
    canInstall,
    promptInstall,
    isStandalone,
    isIOS,
    dismissed,
    dismiss,
    engaged,
  };
}
