'use client';

import React, { useState } from 'react';
import { Download, CheckCircle, Loader2, Smartphone } from 'lucide-react';
import { useInstallPrompt } from './hooks/useInstallPrompt';
import {
  InstallInstructionsSheet,
  detectInstallPlatform,
} from './installInstructions';

/**
 * A permanent install control for the settings / profile page.
 * - Shows a "✓ PokketFit Installed" badge when running in standalone mode.
 * - Shows an "Install PokketFit" button otherwise.
 * - Has no dismiss — it always remains visible.
 */
export default function InstallSettingsButton() {
  const { canInstall, promptInstall, isStandalone, isIOS } = useInstallPrompt();
  const [busy, setBusy] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const platform = React.useMemo(
    () => (typeof window !== 'undefined' ? detectInstallPlatform(isIOS) : 'desktop'),
    [isIOS]
  );

  const handleInstall = async () => {
    if (canInstall) {
      setBusy(true);
      await promptInstall();
      setBusy(false);
    } else {
      setSheetOpen(true);
    }
  };

  return (
    <>
      <div className="bg-[#16120E] border border-[#2A241E] rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-[#E37210]" />
            <h3 className="text-sm font-bold text-white">Install App</h3>
          </div>

          {isStandalone && (
            <span className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Installed
            </span>
          )}
        </div>

        {isStandalone ? (
          /* ── Installed state ─────────────────────────────────────────────── */
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-emerald-400">PokketFit Installed</p>
              <p className="text-[11px] text-[#8A8279]">Running as an installed app</p>
            </div>
          </div>
        ) : (
          /* ── Not installed state ─────────────────────────────────────────── */
          <>
            <p className="text-xs text-[#8A8279]">
              Install PokketFit on your device for faster access, offline workouts, and a
              distraction-free experience.
            </p>
            <button
              id="pwa-settings-install-btn"
              onClick={handleInstall}
              disabled={busy}
              className="w-full min-h-[44px] rounded-xl bg-[#E37210] hover:bg-[#F2801E] active:scale-[0.98] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Install PokketFit
                </>
              )}
            </button>
          </>
        )}
      </div>

      <InstallInstructionsSheet
        platform={platform}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
