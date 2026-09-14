'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { registerPushSubscription } from '@/lib/notifications/push-client';
import { useAuth } from '@/components/auth/AuthProvider';

// Session-only dismissal — reappears on next visit
let _pushDismissedThisSession = false;

type PermissionState = 'idle' | 'granted' | 'denied' | 'unsupported';

export default function PushPromptBanner() {
  const { user } = useAuth();
  const [permissionState, setPermissionState] = useState<PermissionState>('idle');
  const [dismissed, setDismissed] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Must be in browser, must support Notification API
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setPermissionState('unsupported');
      return;
    }
    const perm = Notification.permission;
    if (perm === 'granted') setPermissionState('granted');
    else if (perm === 'denied') setPermissionState('denied');
    else setPermissionState('idle');

    // Sync session-level dismiss state
    if (_pushDismissedThisSession) setDismissed(true);
  }, []);

  const dismiss = () => {
    _pushDismissedThisSession = true;
    setDismissed(true);
  };

  const handleAllow = async () => {
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        setPermissionState('granted');
        // If user is authenticated, register push subscription
        if (user?.id) {
          await registerPushSubscription(user.id);
        }
        dismiss();
      } else {
        setPermissionState('denied');
        dismiss();
      }
    } catch {
      dismiss();
    } finally {
      setBusy(false);
    }
  };

  // Only show when: permission is idle (not yet decided), not dismissed, user is authenticated
  const visible =
    permissionState === 'idle' &&
    !dismissed &&
    !!user;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="push-banner"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300, delay: 0.1 }}
          // Sits above the install banner (4rem tab bar + ~3.25rem install banner + gap)
          className="fixed inset-x-0 bottom-[calc(4rem+3.75rem+0.75rem+var(--safe-bottom,0px))] sm:bottom-[calc(3.75rem+1rem)] z-40 flex justify-center px-4 pointer-events-none"
        >
          <div
            className="pointer-events-auto w-full max-w-md bg-[#16120E]/95 backdrop-blur-md border border-[#2A241E] rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 relative overflow-hidden"
            role="complementary"
            aria-label="Enable push notifications"
          >
            {/* Ambient glow */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Icon */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <Bell className="w-5 h-5 text-white" />
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-white tracking-tight leading-none mb-0.5">
                Stay on track
              </p>
              <p className="text-[11px] text-[#9E968F] leading-tight truncate">
                Get reminders for workouts, hydration &amp; meals.
              </p>
            </div>

            {/* Allow button */}
            <button
              id="push-banner-allow-btn"
              onClick={handleAllow}
              disabled={busy}
              className="shrink-0 min-h-[36px] px-4 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 disabled:opacity-60"
            >
              {busy ? (
                <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                'Allow'
              )}
            </button>

            {/* Dismiss */}
            <button
              id="push-banner-dismiss-btn"
              onClick={dismiss}
              aria-label="Dismiss notification prompt"
              className="shrink-0 p-1.5 rounded-lg text-[#8A8279] hover:text-white hover:bg-[#2A241E] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
