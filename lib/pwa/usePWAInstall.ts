'use client';

import { useState, useEffect, useCallback } from 'react';

export function isRunningAsPWA(): boolean {
  if (typeof window === 'undefined') return false;

  const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
  const isIOSStandalone = (window.navigator as any).standalone === true;
  const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
  const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
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

    if (standalone) {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      return;
    }

    let timer: ReturnType<typeof setTimeout> | null = null;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);

      timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      if (timer) clearTimeout(timer);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if (ios && !standalone) {
      timer = setTimeout(() => {
        setShowInstallPrompt(true);
      }, 5000);
    }

    return () => {
      if (timer) clearTimeout(timer);
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
