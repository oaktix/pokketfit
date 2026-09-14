'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share, MoreVertical, X, CheckCircle } from 'lucide-react';

// ─── Platform Type ─────────────────────────────────────────────────────────────

export type InstallPlatform = 'ios' | 'android' | 'desktop';

// ─── Platform Detection ────────────────────────────────────────────────────────

export function detectInstallPlatform(isIOS: boolean): InstallPlatform {
  if (isIOS) return 'ios';
  if (typeof window !== 'undefined' && /Android/i.test(navigator.userAgent)) return 'android';
  return 'desktop';
}

// ─── Step Sub-component ────────────────────────────────────────────────────────

function Step({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="shrink-0 w-6 h-6 rounded-full bg-[#E37210] flex items-center justify-center text-white text-[11px] font-extrabold mt-0.5">
        {n}
      </span>
      <span className="text-sm text-[#D5D1CB] leading-relaxed">{children}</span>
    </li>
  );
}

// ─── Sheet Props ───────────────────────────────────────────────────────────────

export interface InstallInstructionsSheetProps {
  platform: InstallPlatform;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone?: () => void;
}

// ─── Platform Content ──────────────────────────────────────────────────────────

const PLATFORM_CONTENT: Record<
  InstallPlatform,
  {
    title: string;
    description: string;
    steps: React.ReactNode[];
  }
> = {
  ios: {
    title: 'Add PokketFit to your Home Screen',
    description: 'Safari on iOS lets you install this app directly from the browser toolbar.',
    steps: [
      <>
        Tap the{' '}
        <Share className="w-3.5 h-3.5 inline mx-0.5 text-[#60C8FF] -translate-y-px" />{' '}
        <strong className="text-white">Share</strong> icon in Safari's toolbar at the bottom (or
        top) of the screen.
      </>,
      <>
        Scroll down and choose{' '}
        <strong className="text-white">Add to Home Screen</strong>, then tap{' '}
        <strong className="text-white">Add</strong> to confirm.
      </>,
    ],
  },
  android: {
    title: 'Install PokketFit on Android',
    description:
      'Chrome and most Android browsers let you install this app directly from the menu.',
    steps: [
      <>
        Tap the{' '}
        <MoreVertical className="w-3.5 h-3.5 inline mx-0.5 text-[#E37210] -translate-y-px" />{' '}
        <strong className="text-white">⋮ menu</strong> in the top-right corner of your browser.
      </>,
      <>
        Choose <strong className="text-white">Install app</strong> (or{' '}
        <strong className="text-white">Add to Home screen</strong>), then confirm.
      </>,
    ],
  },
  desktop: {
    title: 'Install PokketFit on your computer',
    description: 'Most modern browsers let you install this as a desktop app in one click.',
    steps: [
      <>
        Click the <strong className="text-white">install icon</strong> in the right side of the
        address bar, or open the browser{' '}
        <MoreVertical className="w-3.5 h-3.5 inline mx-0.5 text-[#E37210] -translate-y-px" />{' '}
        <strong className="text-white">⋮ menu</strong>.
      </>,
      <>
        Choose <strong className="text-white">Install PokketFit…</strong> and click{' '}
        <strong className="text-white">Install</strong>.
      </>,
    ],
  },
};

// ─── Sheet Component ───────────────────────────────────────────────────────────

export function InstallInstructionsSheet({
  platform,
  open,
  onOpenChange,
  onDone,
}: InstallInstructionsSheetProps) {
  const content = PLATFORM_CONTENT[platform];

  // Lock body scroll while sheet is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleDone = () => {
    onOpenChange(false);
    onDone?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Sheet panel */}
          <motion.div
            key="sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className="fixed bottom-0 inset-x-0 z-50 flex justify-center"
          >
            <div className="w-full max-w-[430px] bg-[#16120E] border-t border-x border-[#2A241E] rounded-t-3xl px-6 pt-5 pb-8 shadow-2xl relative overflow-hidden">
              {/* Drag handle */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#3A342E] rounded-full" />

              {/* Ambient glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#E37210]/8 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="flex items-start justify-between mb-4 mt-2">
                <div className="flex-1 pr-4">
                  <h2 className="text-base font-extrabold text-white tracking-tight leading-snug">
                    {content.title}
                  </h2>
                  <p className="text-xs text-[#8A8279] mt-1 leading-relaxed">
                    {content.description}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  aria-label="Close install instructions"
                  className="p-2 rounded-full bg-[#1E1914] text-[#8A8279] hover:text-white transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Step list */}
              <ol className="space-y-4 mb-6">
                {content.steps.map((step, i) => (
                  <Step key={i} n={i + 1}>
                    {step}
                  </Step>
                ))}
              </ol>

              {/* Got it button */}
              <button
                id="install-instructions-done-btn"
                onClick={handleDone}
                className="w-full min-h-[48px] rounded-2xl bg-[#E37210] hover:bg-[#F2801E] active:scale-[0.98] text-white text-sm font-extrabold transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Got it
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
