'use client';

import { useState, useEffect, useCallback } from 'react';

export function isRunningAsPWA(): boolean {
  if (typeof window === 'undefined') return false;

  // Standard display-mode check (Android Chrome, Desktop Chrome/Edge PWA)
  const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;

  // iOS Safari Home Screen standalone check
  const isIOSStandalone = (window.navigator as any).standalone === true;

  // Additional display modes
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;

  // Document referrer for Android TWA (Trusted Web Activity)
  const isAndroidTWA = document.referrer.includes('android-app://');

  return isStandaloneMedia || isIOSStandalone || isMinimalUI || isFullscreen || isAndroidTWA;
}

export function isIOSDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

const DISMISSAL_KEY = 'pokketfit_pwa_install_dismissed_at';
const COOLDOWN_DAYS = 7;

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const standalone = isRunningAsPWA();
    const ios = isIOSDevice();

    setIsStandalone(standalone);
    setIsIOS(ios);

    // If already running as a standalone PWA, never show install prompts
    if (standalone) {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      return;
    }

    // Check dismissal cooldown (7 days)
    const checkDismissalCooldown = (): boolean => {
      const dismissedAt = localStorage.getItem(DISMISSAL_KEY);
      if (!dismissedAt) return true;
      const daysSinceDismissal = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      return daysSinceDismissal >= COOLDOWN_DAYS;
    };

    // Handler for standard Chromium browsers supporting beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      if (checkDismissalCooldown()) {
        // Show after a polite 3-second delay so user has seen the app first
        const timer = setTimeout(() => {
          setShowInstallPrompt(true);
        }, 3000);
        return () => clearTimeout(timer);
      }
    };

    // Handler for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      try {
        localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
      } catch (e) {}
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // For iOS Safari visitors who haven't dismissed within cooldown
    if (ios && !standalone && checkDismissalCooldown()) {
      const iosTimer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 4000);
      return () => {
        clearTimeout(iosTimer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setShowInstallPrompt(false);
      }
      setDeferredPrompt(null);
    }
  }, [deferredPrompt]);

  const dismiss = useCallback(() => {
    setShowInstallPrompt(false);
    try {
      localStorage.setItem(DISMISSAL_KEY, Date.now().toString());
    } catch (e) {}
  }, []);

  const triggerManualPrompt = useCallback(() => {
    if (isStandalone) return;
    setShowInstallPrompt(true);
  }, [isStandalone]);

  return {
    canInstall: !isStandalone && (!!deferredPrompt || isIOS),
    isInstalled: isStandalone || isInstalled,
    isStandalone,
    isIOS,
    showInstallPrompt,
    install,
    dismiss,
    triggerManualPrompt,
  };
}
