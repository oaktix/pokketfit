'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X, Loader2 } from 'lucide-react';
import { useInstallPrompt, recordEngagement } from './hooks/useInstallPrompt';
import {
  InstallInstructionsSheet,
  detectInstallPlatform,
} from './installInstructions';

// Record a single engagement point when this component mounts (i.e. per page view)
// This lets us show the banner after ~3 meaningful page visits.
let _engagementRecordedThisSession = false;

export default function InstallPrompt() {
  const { canInstall, promptInstall, isStandalone, isIOS, dismissed, dismiss, engaged } =
    useInstallPrompt();

  const [busy, setBusy] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Record engagement once per session (not per render)
  React.useEffect(() => {
    if (!_engagementRecordedThisSession) {
      recordEngagement(1);
      _engagementRecordedThisSession = true;
    }
  }, []);

  // Detect platform for subtitle and sheet
  const platform = React.useMemo(
    () => (typeof window !== 'undefined' ? detectInstallPlatform(isIOS) : 'desktop'),
    [isIOS]
  );

  const subtitle =
    platform === 'desktop'
      ? 'Add it to your desktop for instant access — even offline.'
      : 'Add it to your home screen for instant access — even offline.';

  // ── Visibility rules ──────────────────────────────────────────────────────
  // Hidden when: already installed, user dismissed, or not yet engaged
  const visible = !isStandalone && !dismissed && engaged;

  const handleInstall = async () => {
    if (canInstall) {
      setBusy(true);
      const accepted = await promptInstall();
      setBusy(false);
      if (accepted) dismiss();
    } else {
      // iOS, or browser doesn't have native prompt — show manual instructions
      setSheetOpen(true);
    }
  };

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="install-banner"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            // Mobile: sits above the tab bar (4rem) + safe area.
            // Desktop: standard 1rem from the bottom.
            className="fixed inset-x-0 bottom-[calc(4rem+var(--safe-bottom,0px))] sm:bottom-4 z-40 flex justify-center px-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md bg-[#16120E]/95 backdrop-blur-md border border-[#2A241E] rounded-2xl px-4 py-3 shadow-2xl flex items-center gap-3 relative overflow-hidden"
              role="complementary"
              aria-label="Install PokketFit app"
            >
              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E37210]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Icon */}
              <div className="shrink-0 w-10 h-10 rounded-xl bg-[#E37210] flex items-center justify-center shadow-lg shadow-[#E37210]/30">
                <Download className="w-5 h-5 text-white" />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-white tracking-tight leading-none mb-0.5">
                  Install PokketFit
                </p>
                <p className="text-[11px] text-[#9E968F] leading-tight truncate">{subtitle}</p>
              </div>

              {/* Install button */}
              <button
                id="pwa-banner-install-btn"
                onClick={handleInstall}
                disabled={busy}
                className="shrink-0 min-h-[36px] px-4 rounded-xl bg-[#E37210] hover:bg-[#F2801E] active:scale-95 text-white text-xs font-extrabold transition-all flex items-center gap-1.5 disabled:opacity-60"
              >
                {busy ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  'Install'
                )}
              </button>

              {/* Dismiss button */}
              <button
                id="pwa-banner-dismiss-btn"
                onClick={dismiss}
                aria-label="Dismiss install prompt"
                className="shrink-0 p-1.5 rounded-lg text-[#8A8279] hover:text-white hover:bg-[#2A241E] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual instructions sheet (iOS / unsupported browsers) */}
      <InstallInstructionsSheet
        platform={platform}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onDone={dismiss}
      />
    </>
  );
}
